import os
import pandas as pd
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["fortisdb"]

print("🛒 Menjalankan Market Basket Analysis (MBA) berbasis Tenant...")

TARGET_TENANT_ID = "6aec060fbb71bd1b0a3ef9ae" 

try:
    tenant_obj_id = ObjectId(TARGET_TENANT_ID)
except Exception:
    tenant_obj_id = TARGET_TENANT_ID

transactions = list(db.transactions.find({"tenantId": tenant_obj_id}))
menu_items = list(db.menuitems.find({"tenantId": tenant_obj_id}))

if not transactions:
    print(f"❌ Tidak ada data transaksi untuk Tenant ID: {TARGET_TENANT_ID}")
    exit()

name_to_menu_id = {menu["name"]: menu["_id"] for menu in menu_items}
menu_id_to_name = {str(menu["_id"]): menu["name"] for menu in menu_items}

dataset = []
for trx in transactions:
    basket = []
    for item in trx.get("items", []):
        menu_id = item.get("menuItemId")
        if isinstance(menu_id, dict) and "_id" in menu_id:
            m_id_str = str(menu_id["_id"])
        else:
            m_id_str = str(menu_id)
            
        menu_name = menu_id_to_name.get(m_id_str)
        if menu_name:
            basket.append(menu_name)
    
    if basket:
        dataset.append(basket)

if not dataset:
    print("❌ Tidak ada item valid dalam transaksi.")
    exit()

te = TransactionEncoder()
te_ary = te.fit(dataset).transform(dataset)
df = pd.DataFrame(te_ary, columns=te.columns_)

frequent_itemsets = apriori(df, min_support=0.05, use_colnames=True)

if frequent_itemsets.empty:
    print("⚠️ Tidak ditemukan pola frequent itemset yang signifikan.")
    exit()

rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1.0)
rules = rules.sort_values(by="confidence", ascending=False)

recommendations_payload = []
for _, row in rules.iterrows():
    antecedents_names = list(row['antecedents'])
    consequents_names = list(row['consequents'])
    
    antecedents_structured = [{
        "menuName": name,
        "menuItemId": name_to_menu_id.get(name, None)
    } for name in antecedents_names]

    consequents_structured = [{
        "menuName": name,
        "menuItemId": name_to_menu_id.get(name, None)
    } for name in consequents_names]

    recommendations_payload.append({
        "tenantId": tenant_obj_id,
        "ifUserBuys": antecedents_structured,
        "thenRecommend": consequents_structured,
        "support": round(float(row['support']), 2),
        "confidence": round(float(row['confidence']), 2),
        "lift": round(float(row['lift']), 2)
    })

db.mbarecommendations.delete_many({"tenantId": tenant_obj_id})

if recommendations_payload:
    db.mbarecommendations.insert_many(recommendations_payload)
    print(f"✅ Berhasil! Menyimpan {len(recommendations_payload)} aturan MBA terstruktur untuk Tenant: {TARGET_TENANT_ID}")
else:
    print("⚠️ Tidak ada rule asosiasi yang memenuhi syarat.")

print("✨ Analisis MBA Selesai!")