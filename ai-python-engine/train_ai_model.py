import os
import pandas as pd
import numpy as np
from pymongo import MongoClient
from bson import ObjectId  # <-- Wajib import ini untuk menangani ID MongoDB
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["fortisdb"]

print("🔄 Memproses data untuk AI parameters...")

# Ambil data transaksi seperti biasa...
transactions_list = list(db.transactions.find({}))
if not transactions_list:
    print("❌ Data transaksi kosong!")
    exit()

# Ambil tenant_id langsung dari tenant yang ada di database agar konsisten
tenant_doc = db.tenants.find_one()
if not tenant_doc:
    print("❌ Tenant tidak ditemukan!")
    exit()

tenant_id = tenant_doc["_id"] # Ini sudah berupa ObjectId asli dari MongoDB

# ... (proses perhitungan pandas / bobot AI tetap sama seperti sebelumnya) ...
# Contoh hasil hitung bobot:
day_weights = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
ceremony_multiplier = 1.02

ai_parameter_payload = {
    "tenantId": ObjectId(tenant_id), # Dipastikan dibungkus ObjectId secara eksplisit
    "stockCoefficients": {
        "baseMultiplier": 1.05,
        "ceremonyMultiplier": ceremony_multiplier,
        "dayOfWeekWeights": day_weights
    },
    "lastTrainedAt": datetime.utcnow()
}

# Simpan ke koleksi aiparameters (pastikan huruf kecil sesuai gambar Compass Anda)
db.aiparameters.update_one(
    {"tenantId": ObjectId(tenant_id)},
    {"$set": ai_parameter_payload},
    upsert=True
)

print(f"✅ Berhasil! Parameter AI untuk Tenant ID: {tenant_id} berhasil masuk ke koleksi 'aiparameters'.")