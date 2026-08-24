#!/usr/bin/env python3
# =============================================================
# create_product_stubs.py — Create product stub records for
#   NOT_FOUND codes from R6-S2 import
# Phase R7-S2 — ysdms-nextgen
# [local-only, not for deployment]
# PE Directive #48: Dry-run first, then insert
# Input : source_data/parse_not_found.json
# Output: source_data/stub_result.json
# =============================================================

import os, re, sys, json, io, argparse
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

import requests

# ── CONFIG ────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SOURCE_DIR = os.path.join(SCRIPT_DIR, "..")
INPUT_JSON = os.path.join(SOURCE_DIR, "parse_not_found.json")
OUTPUT_JSON = os.path.join(SOURCE_DIR, "stub_result.json")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://iirezrszalmecsslbruo.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
REST_URL = f"{SUPABASE_URL}/rest/v1"
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Prefer": "return=representation",
}

# ── MAPPING RULES (PE Spec #48) ──────────────────────────────

COMPANY_PREFIX_MAP = {
    "DIC": "DIC",
    "MTM": "MTM",
    "JAE": "JAE",
    "OTP": "OTP",
    "SK":  "SK",
    "CHG": "CHG",
    "SSM": "SSM",
    "ODS": "ODS",
    "CK":  "CK",
    # YSD internal tray codes:
    "H":   "YSD",
    "A":   "YSD",
    "E":   "YSD",
    "Z":   "YSD",
    "G":   "YSD",
}

SKIP_CODES = {"A-016-1"}  # AMBIGUOUS_VARIANT


# ── HELPERS ───────────────────────────────────────────────────

def normalize_code(raw: str) -> str:
    """Normalize fullwidth dash and whitespace."""
    return raw.replace("\uff0d", "-").replace("\u2010", "-").strip()


def get_prefix(code: str):
    """Extract alphabetic prefix from product code."""
    parts = code.split("-")
    if parts and parts[0].isalpha():
        return parts[0].upper()
    return None  # numeric → skip


def rest_get(table: str, params: dict) -> list:
    r = requests.get(f"{REST_URL}/{table}", headers=HEADERS, params=params, timeout=15)
    r.raise_for_status()
    return r.json()


def rest_insert(table: str, data: dict) -> dict:
    r = requests.post(f"{REST_URL}/{table}", headers=HEADERS, json=data, timeout=15)
    if r.status_code not in (200, 201):
        raise Exception(f"INSERT {table} failed ({r.status_code}): {r.text}")
    result = r.json()
    return result[0] if isinstance(result, list) else result


def fetch_company_map() -> dict:
    """Fetch company_code → company_id."""
    companies = rest_get("companies", {"select": "company_id,company_code", "limit": 5000})
    return {c["company_code"]: c["company_id"] for c in companies if c.get("company_code")}


def fetch_existing_products() -> set:
    """Fetch all existing product_code as uppercase set."""
    products = []
    offset = 0
    while True:
        batch = rest_get("products", {"select": "product_code", "limit": 1000, "offset": offset})
        products.extend(batch)
        if len(batch) < 1000:
            break
        offset += 1000
    return {(p["product_code"] or "").strip().upper() for p in products}


# ── MAIN ──────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", default=False)
    args = parser.parse_args()

    print("=" * 60)
    print(f"R7-S2 — Create Product Stubs ({'DRY-RUN' if args.dry_run else 'LIVE INSERT'})")
    print(f"Input : {os.path.abspath(INPUT_JSON)}")
    print(f"Output: {os.path.abspath(OUTPUT_JSON)}")
    print("=" * 60)

    if not SUPABASE_KEY:
        sys.exit("ERROR: SUPABASE_SERVICE_KEY not set")

    # Load NOT_FOUND data
    with open(INPUT_JSON, "r", encoding="utf-8") as f:
        not_found = json.load(f)

    genuine = [r for r in not_found if r.get("reason") != "STRAY_NOTE"]
    print(f"\n  Total NOT_FOUND codes: {len(not_found)}")
    print(f"  Genuine (non-stray):   {len(genuine)}")

    # Fetch lookups
    print("\n  Fetching company map...")
    company_map = fetch_company_map()
    print(f"    → {len(company_map)} companies")

    print("  Fetching existing product codes...")
    existing_codes = fetch_existing_products()
    print(f"    → {len(existing_codes)} existing products")

    # Process each code
    results = []
    stats = {
        "total_not_found": len(not_found),
        "genuine": len(genuine),
        "to_insert": 0,
        "inserted_ok": 0,
        "skipped_ambiguous": 0,
        "skipped_no_company": 0,
        "skipped_already_exists": 0,
        "skipped_stray_note": len(not_found) - len(genuine),
        "errors": 0,
        "dry_run": args.dry_run,
    }

    for entry in genuine:
        raw_code = entry["product_code_raw"]
        normalized = normalize_code(raw_code)
        occ = entry["occurrences"]

        # Skip ambiguous
        if normalized in SKIP_CODES:
            results.append({
                "product_code": normalized, "raw": raw_code,
                "company_code": None, "action": "SKIP",
                "reason": "AMBIGUOUS_VARIANT", "occurrences": occ,
            })
            stats["skipped_ambiguous"] += 1
            continue

        # Get prefix
        prefix = get_prefix(normalized)
        if not prefix or prefix not in COMPANY_PREFIX_MAP:
            results.append({
                "product_code": normalized, "raw": raw_code,
                "company_code": None, "action": "SKIP",
                "reason": "NO_COMPANY_MAPPING", "occurrences": occ,
            })
            stats["skipped_no_company"] += 1
            continue

        # Lookup company
        target_company_code = COMPANY_PREFIX_MAP[prefix]
        company_id = company_map.get(target_company_code)
        if not company_id:
            results.append({
                "product_code": normalized, "raw": raw_code,
                "company_code": target_company_code, "action": "SKIP",
                "reason": f"COMPANY_NOT_FOUND: {target_company_code}", "occurrences": occ,
            })
            stats["skipped_no_company"] += 1
            continue

        # Check already exists
        if normalized.upper() in existing_codes:
            results.append({
                "product_code": normalized, "raw": raw_code,
                "company_code": target_company_code, "action": "SKIP",
                "reason": "ALREADY_EXISTS", "occurrences": occ,
            })
            stats["skipped_already_exists"] += 1
            continue

        # Ready to insert
        stats["to_insert"] += 1

        if args.dry_run:
            results.append({
                "product_code": normalized, "raw": raw_code,
                "company_code": target_company_code, "action": "INSERT (dry-run)",
                "occurrences": occ,
            })
        else:
            try:
                stub = {
                    "product_code": normalized,
                    "product_name_internal": normalized,
                    "company_id": company_id,
                    "product_status": "ACTIVE",
                    "notes": f"Auto-stub R7-S2 | source: YSDトレー受注一覧 | raw: {raw_code}",
                }
                rest_insert("products", stub)
                existing_codes.add(normalized.upper())  # prevent dup in same run
                stats["inserted_ok"] += 1
                results.append({
                    "product_code": normalized, "raw": raw_code,
                    "company_code": target_company_code, "action": "INSERTED",
                    "occurrences": occ,
                })
            except Exception as e:
                stats["errors"] += 1
                results.append({
                    "product_code": normalized, "raw": raw_code,
                    "company_code": target_company_code, "action": "ERROR",
                    "reason": str(e)[:200], "occurrences": occ,
                })

    # Output
    output = {**stats, "stubs": results}
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    # Print summary
    print(f"\n{'='*60}")
    print(f"  RESULTS ({'DRY-RUN' if args.dry_run else 'LIVE'})")
    print(f"{'='*60}")
    for k, v in stats.items():
        if k != "dry_run":
            print(f"  {k:<30s}: {v}")
    print(f"{'='*60}")

    # Show INSERT actions
    inserts = [r for r in results if "INSERT" in r.get("action", "")]
    if inserts:
        print(f"\n  Stubs to create ({len(inserts)}):")
        for r in inserts[:15]:
            print(f"    {r['product_code']:<25s} → {r['company_code']:<5s} ({r['occurrences']} occ)")
        if len(inserts) > 15:
            print(f"    ... and {len(inserts) - 15} more")

    print(f"\n  Output: {os.path.abspath(OUTPUT_JSON)}")


if __name__ == "__main__":
    main()
