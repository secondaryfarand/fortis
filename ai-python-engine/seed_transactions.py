import os
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv

# Muat environment variables dari .env
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["fortisdb"]

print("🌱 Memasukkan data transaksi dummy ke MongoDB...")

# 1. Cari tenant dengan mendeteksi koleksi 'tenants' atau 'tenant'
tenant = None
if "tenants" in db.list_collection_names():
    tenant = db.tenants.find_one()
elif "tenant" in db.list_collection_names():
    tenant = db.tenant.find_one()
else:
    # Ambil koleksi pertama apa pun yang ada jika nama koleksi berbeda
    for col_name in db.list_collection_names():
        if "tenant" in col_name.lower():
            tenant = db[col_name].find_one()
            break

if not tenant:
    print("❌ Tenant tidak ditemukan di database fortisdb! Pastikan Anda sudah memasukkan dokumen tenant dengan benar.")
    exit()

tenant_id = tenant["_id"]
print(f"✅ Tenant ditemukan dengan ID: {tenant_id}")

# 2. Cari menu (pastikan nama koleksi menuitems atau menu_items)
menu_collection_name = "menuitems" if "menuitems" in db.list_collection_names() else "menu_items"
menu_items = list(db[menu_collection_name].find({"tenantId": tenant_id}))

if not menu_items:
    print(f"❌ Belum ada menu di koleksi '{menu_collection_name}' untuk tenant ini! Masukkan menu dummy terlebih dahulu.")
    exit()

# 3. Buat beberapa data transaksi dummy
dummy_transactions = []
for i in range(15):
    items_in_trx = []
    for menu in menu_items[:2]:
        items_in_trx.append({
            "menuItemId": menu["_id"],
            "quantity": int(10 + (i % 5)),
            "subtotal": menu.get("price", 35000) * (10 + (i % 5))
        })
    
    total_amount = sum(item["subtotal"] for item in items_in_trx)
    
    dummy_transactions.append({
        "tenantId": tenant_id,
        "items": items_in_trx,
        "totalAmount": total_amount,
        "saleDate": datetime.utcnow(),
        "isCeremonyDay": (i % 4 == 0),
        "dayOfWeek": datetime.utcnow().weekday()
    })

# Masukkan ke koleksi transactions
db.transactions.insert_many(dummy_transactions)
print(f"✅ Berhasil memasukkan {len(dummy_transactions)} data transaksi dummy ke koleksi 'transactions'!")
print("Sekarang Anda bisa menjalankan kembali skrip `python train_ai_model.py`.")