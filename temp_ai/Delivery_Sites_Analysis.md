# Phân Tích Sổ Địa Chỉ & Nghiệp Vụ Delivery Sites

**Nguồn dữ liệu:** `トレイデータ&指示書.xlsx` (sheet `納入先一覧表`)
**Số dòng Excel hợp lệ:** 1860

## 1. Giả thuyết "1 Công ty, Nhiều Địa điểm/Liên hệ"
Có **90** mã `依頼元` (Người đặt hàng) xuất hiện nhiều hơn 1 lần trong Excel.
*Ví dụ Top 5:*
- Mã `*`: xuất hiện 18 lần.
- Mã `OGR01`: xuất hiện 12 lần.
- Mã `小倉貿易（株）OGR01`: xuất hiện 11 lần.
- Mã `SMK01`: xuất hiện 11 lần.
- Mã `NPC01`: xuất hiện 8 lần.

## 2. Giả thuyết "1 Điểm đến, Nhiều Công ty đặt hàng"
Có **38** địa chỉ được đặt hàng bởi nhiều `依頼元` khác nhau.
*Ví dụ Top 5 địa chỉ phổ biến nhất:*
- Địa chỉ `*...`: 54 mã đặt hàng (ＳＭＫ（株）　崎村, *, ＳＭＫ（株）杉村, ADV03, ADV01, AMP  B伝, AMP A伝　豊福, A伝, AND01  102, AMP 勝俣, 松南クラフトSON01, ASH01, OCC01, 三住ｹﾐｶﾙ SNS01, SON01, AMP 清水　A伝, THD01, 光和精工（株）KOW01, 資材Ｇ小久江HMH01, IBR01, AMP  A伝, KMC01, KOW01, KRD02, 日清化成（NSK02), TMK02, RYK01, DIC01 　大一, SPD01  ｽﾋﾟｰﾄﾞｼﾞｬﾊﾟﾝ, KNY01  クニヨシ（株）片平, HKS01　ホクソウ, MBC01, TYM01, MFS01, NPC01, MYK01, OGR01, NMK01, NRK01, 新光（株）　SNK03, IEC01, OTA01, SES01, SMK01, SON01　松南ｸﾗﾌﾄ, ＳＭＫ（株）　野口, 東北電子　THD01, MYK01  ミヤカワ, THK01, TMK01, 湯本 WKO01, 田中 WKO02, YMD01, 小林精工 KBY02)
- Địa chỉ `*****...`: 7 mã đặt hàng (光和精工（株）KOW01, (有) 小林精工KBY02, AMP　A伝　林, SLK01, SMK01, *****, SUW01)
- Địa chỉ `〒115-0052　　東京都北区赤羽北2-30-1...`: 2 mã đặt hàng (KKG01　　1265, KOG01)
- Địa chỉ `〒142-0041　　東京都品川区戸越6-6-5...`: 2 mã đặt hàng (SMK01  　487, SMK01)
- Địa chỉ `〒160-0023　　東京都新宿区西新宿6丁目10番1号...`: 2 mã đặt hàng (ELS01　　1162, IMC01　　1267)

## 3. Đối chiếu mã `依頼元` (Cột D) với Database `companies`
- Tổng số mã `依頼元` duy nhất trong Excel: 1652
- Khớp chính xác hoàn toàn với `company_code` hoặc `legacy_id` trong DB: **64** mã.
- Không khớp chính xác: **1587** mã.
  *(Tuy nhiên, phát hiện 1483 mã có thể khớp theo tiền tố, ví dụ: `HRS05　　2186` -> `H`, `KMG01　　1527` -> `K`, `RGS01　　444` -> `RGS`)*

## 4. Đối chiếu Excel với Database `delivery_sites` hiện có
- Tổng số site hiện có trong DB: 1169
- Số mã `No.` (Cột A) trong Excel ĐÃ CÓ TRONG DB: **1178** dòng.
- Số mã `No.` (Cột A) trong Excel CHƯA CÓ TRONG DB (Dữ liệu mới): **682** dòng.
