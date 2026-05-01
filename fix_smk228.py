import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(os.path.join(os.path.dirname(__file__), '.env.local'))

url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

supabase = create_client(url, key)

# Kiểm tra dữ liệu cũ
print("Before update:")
res = supabase.table("product_master").select("*").eq("code", "SMK-228").execute()
print(res.data)

# Cập nhật
response = supabase.table("product_master").update({
    "material": "PP(N)",
    "thickness": 0.60,
    "length_val": 365,
    "width_val": 245
}).eq("code", "SMK-228").execute()

print("After update:")
print(response.data)
