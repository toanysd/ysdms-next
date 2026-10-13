import os
import sys
import re
import urllib.request
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def test_bridge_v240():
    print("=" * 70)
    print("TEST SUITE: REALTIME BRIDGE v2.4.0 (DUAL-PATH ARCHITECTURE AUDIT)")
    print("=" * 70)
    
    script_path = "tools/realtime-bridge/ysdms_pe_bridge.user.js"
    assert os.path.exists(script_path), f"File {script_path} must exist"
    
    with open(script_path, "r", encoding="utf-8") as f:
        content = f.read()
        lines = content.splitlines()

    results = []

    # TC1: Line Count Audit
    line_count = len(lines)
    print(f"\n[TC1] Line Count Audit:")
    print(f"  - Actual lines: {line_count}")
    if 350 <= line_count <= 600:
        print("  -> PASS: Line count is within optimal streamlined range (350-600 lines).")
        results.append(("TC1: Line Count Audit", True, f"{line_count} lines (target: 350-600)"))
    else:
        print("  -> FAIL: Line count outside target range.")
        results.append(("TC1: Line Count Audit", False, f"{line_count} lines"))

    # TC2: Zero Auto-Scraping Audit
    print(f"\n[TC2] Zero Auto-Scraping Audit:")
    scraping_patterns = [
        ("observePeStream", r"observePeStream"),
        ("debounceForwardTimer", r"debounceForwardTimer"),
        ("timeSinceLastTextChange", r"timeSinceLastTextChange"),
        ("verifyDirectiveIntegrity", r"verifyDirectiveIntegrity"),
        ("auto_forward_call", r"forwardPeResponseToAn\s*\(\s*false\s*\)"),
        ("hashString_baseline", r"baselinePeTextHash"),
    ]
    tc2_pass = True
    for name, pattern in scraping_patterns:
        matches = re.findall(pattern, content)
        if len(matches) > 0:
            print(f"  -> FAIL: Found deprecated auto-scraping symbol '{name}' ({len(matches)} occurrences)")
            tc2_pass = False
        else:
            print(f"  -> PASS: '{name}' is 100% eliminated.")
    results.append(("TC2: Zero Auto-Scraping Audit", tc2_pass, "All auto-scraping symbols eliminated"))

    # TC3: Manual Rescue Button Audit (Alt+F10)
    print(f"\n[TC3] Manual Rescue Button Audit:")
    has_rescue_fn = "function handleManualRescueForward" in content
    has_rescue_api = "/api/directive" in content
    has_f10_hotkey = "F10" in content and "handleManualRescueForward" in content
    has_rescue_btn = "ysdms-btn-rescue-an" in content

    tc3_pass = has_rescue_fn and has_rescue_api and has_f10_hotkey and has_rescue_btn
    print(f"  - Function handleManualRescueForward: {'YES' if has_rescue_fn else 'NO'}")
    print(f"  - Target API /api/directive: {'YES' if has_rescue_api else 'NO'}")
    print(f"  - Hotkey Alt+F10 binding: {'YES' if has_f10_hotkey else 'NO'}")
    print(f"  - Rescue Button on UI: {'YES' if has_rescue_btn else 'NO'}")
    results.append(("TC3: Manual Rescue Action", tc3_pass, "Rescue handler & Alt+F10 present"))

    # TC4: Input Injection & Gatekeeper Audit
    print(f"\n[TC4] Input Injection & Gatekeeper Audit:")
    has_inject_fn = "function injectTextToPerplexity" in content
    has_textarea_setter = "HTMLTextAreaElement.prototype" in content
    has_execcommand = "execCommand" in content
    has_gatekeeper_btn = "ysdms-btn-submit-pe" in content
    has_f9_hotkey = "F9" in content and "handleMinhChuSubmit" in content

    tc4_pass = has_inject_fn and has_textarea_setter and has_execcommand and has_gatekeeper_btn and has_f9_hotkey
    print(f"  - Function injectTextToPerplexity: {'YES' if has_inject_fn else 'NO'}")
    print(f"  - Prototype setter for React textarea: {'YES' if has_textarea_setter else 'NO'}")
    print(f"  - execCommand fallback for contenteditable: {'YES' if has_execcommand else 'NO'}")
    print(f"  - Gatekeeper submit button: {'YES' if has_gatekeeper_btn else 'NO'}")
    print(f"  - Hotkey Alt+F9 binding: {'YES' if has_f9_hotkey else 'NO'}")
    results.append(("TC4: Input Injection & Gatekeeper", tc4_pass, "React injector & Alt+F9 present"))

    # TC5: Live Hub & SSE Compatibility Audit
    print(f"\n[TC5] Live Hub & SSE Compatibility Audit:")
    tc5_pass = False
    try:
        req = urllib.request.urlopen("http://127.0.0.1:3856/api/status", timeout=3)
        data = json.loads(req.read().decode('utf-8'))
        is_online = data.get("status") == "online"
        hub_ver = data.get("hub", "")
        has_v240 = "v2.4.0" in hub_ver
        
        # Check script endpoint
        script_req = urllib.request.urlopen("http://127.0.0.1:3856/ysdms_pe_bridge.user.js", timeout=3)
        script_header = script_req.read(200).decode('utf-8', errors='ignore')
        script_ver_match = "2.4.0" in script_header

        print(f"  - Hub status: {data.get('status')} (Online: {is_online})")
        print(f"  - Hub version banner: {hub_ver} (v2.4.0: {has_v240})")
        print(f"  - Hub served script contains v2.4.0: {script_ver_match}")

        tc5_pass = is_online and has_v240 and script_ver_match
    except Exception as e:
        print(f"  - Hub connection error: {e}")

    results.append(("TC5: Live Hub & Distribution", tc5_pass, "Hub port 3856 online with v2.4.0"))

    # Summary
    print("\n" + "=" * 70)
    print("AUDIT RESULTS SUMMARY")
    print("=" * 70)
    all_passed = True
    for name, passed, detail in results:
        status_str = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status_str} | {name}: {detail}")
        if not passed:
            all_passed = False

    print("=" * 70)
    if all_passed:
        print("ALL QUALITY GATES PASSED (5/5) — BRIDGE v2.4.0 READY FOR PRODUCTION!")
    else:
        print("SOME QUALITY GATES FAILED — PLEASE REVIEW FINDINGS ABOVE.")
    print("=" * 70)

    assert all_passed, "Test Suite did not achieve 100% PASS"

if __name__ == "__main__":
    test_bridge_v240()
