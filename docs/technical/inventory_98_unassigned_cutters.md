# SỔ TAY KIỂM KÊ VÀ RÀ SOÁT ĐỊNH KỲ: 98 DAO CẮT CHƯA LIÊN KẾT KHUÔN (YSDMS)

> **Thời điểm trích xuất:** 2026-09-17 14:50 JST  
> **Nguồn dữ liệu:** CSDL Supabase Production (`equipment` & `equipment_assignments`)  
> **Trạng thái:** Tồn đọng dữ liệu lịch sử cần xác nhận thủ công tại hiện trường xưởng (5,7% tổng số dao)  
> **Căn cứ:** Quyết định nghiệm thu kết thúc tự động hóa Ưu tiên 4 từ Anh Thoan & PE ngày 2026-09-17.

---

## 1. TỔNG QUAN HIỆN TRẠNG (SUMMARY)

Hệ thống YSDMS NextGen đã hoàn tất việc backfill tự động hóa tối đa cho **1.633 / 1.731 dao cắt** (**94,3%** đã có liên kết SET/SHARED chuẩn xác).  
Còn lại đúng **98 dao cắt** (**5,7%**) không thể ghép nối tự động do giới hạn của dữ liệu lịch sử (thiếu bản vẽ CAD hoặc khuôn vật lý đã thanh lý/chưa nhập CSDL).  
Danh sách 98 dao này được bàn giao cho bộ phận Quản lý Kỹ thuật & Thủ kho khuôn YSD để tiến hành kiểm kê thực tế theo 3 nhóm:

| Phân nhóm | Số lượng dao | Đặc điểm kỹ thuật | Hướng xử lý thực tế tại xưởng |
|---|---|---|---|
| **Nhóm 3C** | 12 dao (10 mã khuôn) | Khớp mã/tên xưởng với khuôn nhưng thiếu CAD Revision cả 2 phía | Đo kích thước vật lý cutline của dao và khuôn; nếu khớp thì gán thủ công trên UI modal |
| **Tier 4A** | 5 dao | Dao phụ trợ đặc thù (nhôm ALCUTTER, dưỡng da, dưỡng gỗ, dao mẫu) | Gán nhãn dao phụ trợ dùng chung xưởng hoặc chuyển sang danh mục công cụ gá lắp |
| **Tier 4B** | 81 dao | Dao sản xuất thông thường nhưng không tìm thấy khuôn tương ứng trong CSDL | Kiểm tra thực tế tại kệ: xác định khuôn đã thanh lý (廃却) hay chưa nhập vào hệ thống |
| **TỔNG CỘNG** | **98 dao** | | |

---

## 2. PHẦN 1 — NHÓM 3C: CÓ KHUÔN ỨNG VIÊN THEO MÃ/TÊN NHƯNG THIẾU CAD (12 DAO)

*Hướng dẫn hiện trường:* Kiểm tra kích thước khay thực tế giữa dao cắt và khuôn ứng viên. Nếu kích thước khớp nhau, nhân viên xưởng có thể mở Modal chi tiết thiết bị trên hệ thống và bấm nút liên kết quan hệ `SHARED`.

| STT | Mã Dao | Tên Dao | UUID Dao | Vị Trí Kệ Kho | Khuôn Ứng Viên | UUID Khuôn | Hướng Dẫn Kiểm Kê Thực Tế |
|---|---|---|---|---|---|---|---|
| 1 | `ADY` | ADY | `6cea2af0-a0e2-4cfd-88f2-21900a4be37b` | 2F-04-2F-04-L2 | `ADY-2` (ADY) | `00a9797d-767c-4c27-8554-592fa976d3e1` | Đối chiếu kích thước với khuôn ADY-2 |
| 2 | `CLDS` | CLDS | `8b89767a-10f8-4cc6-b29e-ddaa9e28a0ff` | SP-10-SP-10-L1 | `CLDS-2` (CLDS) | `7d3886ee-643e-4ea5-8922-37037c085358` | Đối chiếu kích thước với khuôn CLDS-2 |
| 3 | `NPC` | NPC | `daf7edff-8425-451f-9932-dd06bcd5ef1c` | 2F-10-2F-10-L4 | `NPC-2` (NPC) | `39c6a908-191c-4176-b876-36f4e3450f2f` | Đối chiếu kích thước với khuôn NPC-2 |
| 4 | `SMK064` | SMK-064 | `9cbeeca9-51fa-4a5f-9126-2645bc0cba9a` | CS-04-CS-04-L1 | `SMK064-2` (SMK-064) | `2d8624f3-b0d8-44cf-9180-e6a28e68b5e7` | Đối chiếu kích thước với khuôn SMK064-2 |
| 5 | `SMK067` | SMK-067 | `546e96fb-b480-4eab-b4ac-d65400006294` | CS-04-CS-04-L1 | `SMK067-2` (SMK-067) | `0e5e22f1-7d01-4df4-a769-917c880b9949` | Đối chiếu kích thước với khuôn SMK067-2 |
| 6 | `SSM` | SSM | `c4ade6dc-91a1-449e-908a-e1dd84a6b0fe` | 2F-07-2F-07-L2 | `SSM-3` (SSM) | `913122f5-4ba5-48dd-be17-cc0946401702` | Đối chiếu kích thước với khuôn SSM-3 |
| 7 | `SSM-2` | SSM | `bf92f2cd-b432-4eeb-b001-dc97b8bdfea5` | CS-03-CS-03-L1 | `SSM-3` (SSM) | `913122f5-4ba5-48dd-be17-cc0946401702` | Đối chiếu kích thước với khuôn SSM-3 |
| 8 | `TH` | TH | `20340666-b537-4808-8687-18e1ec9fedf2` | 2F-05-2F-05-L1 | `TH-2` (TH) | `0a3cad04-2093-4cd9-b480-d4588cd50174` | Đối chiếu kích thước với khuôn TH-2 |
| 9 | `YMT011-2` | YMT-011 | `8f9a4541-a023-49aa-8c7a-a4308ac862f6` | 2F-25-2F-25-L4 | `YMT011` (YMT-011) | `d3101f0b-e77b-4cf4-bdc6-4fa2159ddeb1` | Đối chiếu kích thước với khuôn YMT011 |
| 10 | `YSDE-2` | YSD-E | `170ec247-4fe1-4997-a81e-52ca93f92a6f` | 2F-05-2F-05-L1 | `YSDE` (YSD-E) | `cf5e25d6-d86c-425d-8a96-72bd7c010006` | Đối chiếu kích thước với khuôn YSDE |
| 11 | `YSDH` | YSD-H | `7c2d062b-c3d7-4cd1-be18-40c9ceee2696` | Chưa xếp kệ | `YSDH-3` (YSD-H) | `c04e243f-63f6-4881-a7f4-beb5a10bcaf3` | Đối chiếu kích thước với khuôn YSDH-3 |
| 12 | `YSDH-2` | YSD-H | `df21a61c-a7fb-4c61-9d4a-d4d4e5e0b8dd` | CS-04-CS-04-L4 | `YSDH-3` (YSD-H) | `c04e243f-63f6-4881-a7f4-beb5a10bcaf3` | Đối chiếu kích thước với khuôn YSDH-3 |

---

## 3. PHẦN 2 — TIER 4A: DAO PHỤ TRỢ ĐẶC THÙ (5 DAO)

*Hướng dẫn hiện trường:* Xác nhận công dụng chuyên biệt (dao gá dưỡng, dập tấm nhôm, hoặc dao thử nghiệm). Ghi nhận vào mục ghi chú của thiết bị hoặc thanh lý nếu không còn sử dụng.

| STT | Mã Dao | Tên Dao | UUID Dao | Vị Trí Kệ Kho | Trạng Thái Thiết Bị | Ghi Chú Đặc Thù |
|---|---|---|---|---|---|---|
| 1 | `ALCUTTER510x340ADY` | ALCUTTER 510x340 ADY | `a726c10f-4e95-4c68-9642-d1aa759411dc` | Chưa xếp kệ | `NORMAL` / `STORAGE` | Dao chuyên dụng đặc thù |
| 2 | `ALCUTTERADY2P` | ALCUTTER ADY 2P | `c599c07d-c52a-4999-8ff3-585eeada0155` | Chưa xếp kệ | `NORMAL` / `STORAGE` | Dao chuyên dụng đặc thù |
| 3 | `ALCUTTERPLATEADY2P` | ALCUTTER PLATE - ADY 2P | `27ee0774-2f16-432f-9a92-4f44c0baa4ec` | Chưa xếp kệ | `NORMAL` / `STORAGE` | Dao chuyên dụng đặc thù |
| 4 | `WOODBASE74C（590ｘ290）` | WOODBASE 74C（590ｘ290） | `291855a1-5164-4cfd-b972-94f7996c184b` | MD-03-MD-03-L2 | `NORMAL` / `STORAGE` | Dao chuyên dụng đặc thù |
| 5 | `レザーシート小56Φｘ33Φ` | レザーシート小　56Φｘ33Φ | `a3a84425-def5-45b7-8610-9c22dd0dcee3` | SP-10-SP-10-L2 | `NORMAL` / `STORAGE` | Dao chuyên dụng đặc thù |

---

## 4. PHẦN 3 — TIER 4B: DAO KHÔNG TÌM THẤY KHUÔN TƯƠNG ỨNG TRONG HỆ THỐNG (81 DAO)

*Hướng dẫn hiện trường:* Kiểm tra vị trí kệ kho thực tế. Xác minh xem khuôn đi kèm đã bị thanh lý (`廃却`), chuyển đi xưởng ngoài, hay là khuôn chưa được số hóa vào CSDL YSDMS.

| STT | Mã Dao | Tên Dao | UUID Dao | Vị Trí Kệ Kho | Trạng Thái | Ghi Chú |
|---|---|---|---|---|---|---|
| 1 | `AAT002` | AAT-002 | `ba46ace7-b10a-4d7d-8ceb-70d21ab49cba` | CS-04-CS-04-L3 | `NORMAL` | — |
| 2 | `ADV192` | ADV-192 | `355c2b3c-1bb0-419d-b720-17df21b69f03` | 2F-10-2F-10-L3 | `NORMAL` | — |
| 3 | `ADY003` | ADY-003 | `8ee446b4-5a24-4998-8818-260bda8979ae` | CS-03-CS-03-L2 | `NORMAL` | — |
| 4 | `ADY029` | ADY-029 | `b90b3e02-1261-48b3-9f5a-b159e1de49fd` | CS-03-CS-03-L2 | `NORMAL` | — |
| 5 | `CANON` | CANON | `4a055906-1e2c-4128-8ffc-5424ee833027` | Chưa xếp kệ | `NORMAL` | — |
| 6 | `CHG001R4` | CHG-001 R4 | `dc2b4ba5-e910-4c27-8bef-89a4bfa84359` | MD-03-MD-03-L1 | `NORMAL` | — |
| 7 | `CHG013R2` | CHG-013R2 | `125d9c8e-cede-4d16-9677-d0d4345f15b9` | Chưa xếp kệ | `NORMAL` | — |
| 8 | `CST010` | CST-010 | `6b6e5cdd-69c3-4216-a227-e2f6978c5fa7` | 2F-10-2F-10-L4 | `NORMAL` | — |
| 9 | `DIC021` | DIC-021 | `491df31a-ccd8-4761-8b9c-5e0404cd9c20` | 2F-10-2F-10-L4 | `NORMAL` | — |
| 10 | `ELP030` | ELP-030 | `233d9239-564c-4f2c-9e50-c3099b94d1c1` | 2F-10-2F-10-L1 | `NORMAL` | — |
| 11 | `EXD015` | EXD-015 | `e5dc0dbc-f0d7-4aa8-9c37-ab4b0dab33eb` | 2F-04-2F-04-L2 | `NORMAL` | — |
| 12 | `EXD016` | EXD-016 | `c212f602-d6fb-4a0d-be5c-21bf4d311dce` | 2F-04-2F-04-L2 | `NORMAL` | — |
| 13 | `GMY015` | GMY-015 | `653013f2-1f3a-480b-a7b3-4ccd3541b65c` | 2F-04-2F-04-L3 | `NORMAL` | — |
| 14 | `GMY029` | GMY-029 | `c4f1be51-3e2b-4e22-9a06-84022d11a8f5` | 2F-08-2F-08-L4 | `NORMAL` | — |
| 15 | `GMY030` | GMY-030 | `a459a499-5989-411d-909d-abeddf856079` | CS-01-CS-01-L3 | `NORMAL` | — |
| 16 | `GMY034` | GMY-034 | `ab7897c1-8606-4375-80d5-a90cb3b0bf3b` | CS-01-CS-01-L3 | `NORMAL` | — |
| 17 | `GOJ004` | GOJ-004 | `626e57b4-bdf4-4aa3-8e6a-d1d08e01d767` | CS-04-CS-04-L1 | `NORMAL` | — |
| 18 | `JAE017` | JAE-017 | `fcf4464f-9bc2-481e-bc9e-f610778746e6` | CS-01-CS-01-L2 | `NORMAL` | — |
| 19 | `JAE069` | JAE-069 | `2ed985a4-7dd0-4146-9940-3a44b6727586` | CS-04-CS-04-L3 | `NORMAL` | — |
| 20 | `JAE325R1` | JAE-325 R1 | `60031dbd-6d21-4949-ae71-472cca2c9dc9` | 2F-24-2F-24-L4 | `NORMAL` | — |
| 21 | `JAE357R3` | JAE-357 R3 | `2e180380-6484-4d08-858a-e5f8651dbcbd` | Chưa xếp kệ | `NORMAL` | — |
| 22 | `KDS104` | KDS-104 | `6731e662-a739-420e-85b7-1dde69c51559` | Chưa xếp kệ | `NORMAL` | — |
| 23 | `KMG003` | KMG-003 | `c29956f0-5993-4ae6-b062-cd5a8f789b19` | 2F-08-2F-08-L1 | `NORMAL` | — |
| 24 | `KSE001` | KSE-001 | `933ddc86-b7fd-49c3-9808-2d9e20479d06` | CS-01-CS-01-L3 | `NORMAL` | — |
| 25 | `KSP211R6` | KSP-211 R6 | `f8d20d1b-aad0-425f-b363-ec9049f7560e` | Chưa xếp kệ | `NORMAL` | — |
| 26 | `KYM` | KYM | `0b08a54c-a0d0-4e88-b34b-4417b9ba0396` | 2F-22-2F-22-L2 | `NORMAL` | — |
| 27 | `MDS331x251SHAPEFORM` | MDS 331x251 SHAPE FORM | `ef4f3cf6-e205-4d9d-b2a5-50f20c99f018` | MD-03-MD-03-L1 | `NORMAL` | — |
| 28 | `MOK004` | MOK-004 | `4cf8a3d4-cdd7-4f10-acf4-6a6594139714` | 2F-05-2F-05-L3 | `NORMAL` | — |
| 29 | `MOK005` | MOK-005 | `91d72c20-a9bc-4f69-938c-2d3406c15253` | GT-06-GT-06-L1 | `NORMAL` | — |
| 30 | `MSM022` | MSM-022 | `7699d51f-f9b0-45ff-8220-fde8add883df` | CS-03-CS-03-L1 | `NORMAL` | — |
| 31 | `MSM036` | MSM-036 | `a2933d90-bc64-4f8c-9bf9-3ed4c3affecb` | 2F-04-2F-04-L3 | `NORMAL` | — |
| 32 | `MTM131` | MTM-131 | `e53f56c0-63ef-4e8e-8a1a-e17efaa1d72d` | CS-04-CS-04-L2 | `NORMAL` | — |
| 33 | `MTM194R1` | MTM194R1 | `a060ed67-af29-4cb9-b9ed-2a09cf231f1f` | Chưa xếp kệ | `NORMAL` | — |
| 34 | `MZT052` | MZT-052 | `7cc2ac0e-8aea-478a-a361-0feea3005ae8` | Chưa xếp kệ | `NORMAL` | — |
| 35 | `NGS018R1` | NGS-018 R1 | `678f5ea1-b489-45ad-bc1a-a5401e853d7f` | 2F-24-2F-24-L4 | `NORMAL` | — |
| 36 | `NHK003` | NHK-003 | `70215c2c-6671-4ed1-b1c6-19ce4ab40b04` | CS-05-CS-05-L2 | `NORMAL` | — |
| 37 | `NKI001` | NKI-001 | `d1a31ec8-256b-4400-9718-55c79cb2dd64` | 2F-04-2F-04-L2 | `NORMAL` | — |
| 38 | `NOKIA` | NOKIA | `3bcf2cf9-1e88-4a19-a82d-128381caad5d` | GT-06-GT-06-L1 | `NORMAL` | — |
| 39 | `NOKIA-2` | NOKIA | `844a6882-cf22-4057-9547-2c95e341105a` | CS-01-CS-01-L2 | `NORMAL` | — |
| 40 | `NPC001` | NPC-001 | `eb21f8f5-d265-425f-9f8f-61d589ca6f16` | 2F-10-2F-10-L4 | `NORMAL` | — |
| 41 | `NPC005` | NPC-005 | `a40b6c3e-0835-41c7-941f-c20255c90e9b` | 2F-10-2F-10-L1 | `NORMAL` | — |
| 42 | `NPC012` | NPC-012 | `cc235883-7775-4588-8a8b-c14f1fac882c` | CS-01-CS-01-L2 | `NORMAL` | — |
| 43 | `NRK015` | NRK-015 | `266551a1-0fd6-4939-96fd-c8e0cece3264` | CS-01-CS-01-L3 | `NORMAL` | — |
| 44 | `ODS002` | ODS-002 | `1a2a4186-3f4b-4ced-ba43-471f5baf029e` | 2F-10-2F-10-L1 | `NORMAL` | — |
| 45 | `PT525` | PT-5-25 | `d32e74c0-9edb-41e5-9bff-35ef2409ba57` | 2F-10-2F-10-L1 | `NORMAL` | — |
| 46 | `SHT017R2` | SHT-017 R2 | `6d341ccc-135f-411c-b65b-1c674fd98d17` | 2F-20-2F-20-L3 | `NORMAL` | — |
| 47 | `SK003` | SK-003 | `c525b84e-a5a7-43ff-8e6d-940c3a90522a` | 2F-24-2F-24-L5 | `NORMAL` | — |
| 48 | `SKK001` | SKK-001 | `9dc9f3aa-a8ed-4701-876c-58f26457c819` | 2F-08-2F-08-L3 | `NORMAL` | — |
| 49 | `SMK060` | SMK-060 | `2cc7731b-f638-4a09-888f-ae05b7c5aea9` | CS-01-CS-01-L2 | `NORMAL` | — |
| 50 | `SMK087` | SMK-087 | `93c25655-e4ba-42dd-9c1a-affedfc1ff0b` | GT-06-GT-06-L1 | `NORMAL` | — |
| 51 | `SMK116` | SMK-116 | `c1422d49-dc14-4f0d-a33b-fc56ecf253d9` | CS-03-CS-03-L3 | `NORMAL` | — |
| 52 | `SMK120` | SMK-120 | `8a9ad1eb-3180-4ed2-97b3-ea00a40fe0ff` | 2F-04-2F-04-L3 | `NORMAL` | — |
| 53 | `SMK161R` | SMK-161 R | `a2b001d8-80c6-4435-811e-505cc334e37b` | GT-06-GT-06-L1 | `NORMAL` | — |
| 54 | `SNT` | SNT | `ad7111d1-e4f3-41d9-8566-3c097c67a6e4` | CS-04-CS-04-L1 | `NORMAL` | — |
| 55 | `SPJ027` | SPJ-027 | `75864088-da04-4620-a732-956dd64c5209` | CS-03-CS-03-L3 | `NORMAL` | — |
| 56 | `SWT006` | SWT-006 | `4ea70ba4-f8d0-4c11-8fc8-a6b44dc75d37` | Chưa xếp kệ | `NORMAL` | — |
| 57 | `TDS006` | TDS-006 | `042f94a7-2ef6-465c-926a-27434095a354` | CS-05-CS-05-L2 | `NORMAL` | — |
| 58 | `TE01417` | TE-0-141-7 | `3a424eaf-2c51-4ce4-be44-0439cd36718f` | CS-01-CS-01-L2 | `NORMAL` | — |
| 59 | `TE11604` | TE-1-160-4 | `e4f622a0-57ab-4535-9110-42a44df04bda` | Chưa xếp kệ | `NORMAL` | — |
| 60 | `TE11604-2` | TE-1-160-4 | `fd46bfed-f5f3-4716-8cd1-61e7e2040438` | Chưa xếp kệ | `NORMAL` | — |
| 61 | `TE21354` | TE-2-135-4 | `de4bb561-2bac-4595-bbe2-48962d58784c` | CS-04-CS-04-L1 | `NORMAL` | — |
| 62 | `TE30230` | TE-3-023-0 | `5e0ccada-5f55-4ace-ad65-1d96d288cc73` | 2F-10-2F-10-L3 | `NORMAL` | — |
| 63 | `TE30230-2` | TE-3-023-0 | `1f99222a-00e5-4ef2-b838-f8717259fa7b` | 2F-10-2F-10-L4 | `NORMAL` | — |
| 64 | `TE31563` | TE-3-156-3 | `4a863f4a-7a02-4393-958f-9ade33ad96c3` | 2F-05-2F-05-L4 | `NORMAL` | — |
| 65 | `TE61105` | TE-6-110-5 | `e0112847-56f8-45d0-8c27-1fd7d2794ab8` | 2F-10-2F-10-L1 | `NORMAL` | — |
| 66 | `TE70743` | TE-7-074-3 | `66e56866-3dd5-4905-a02f-e0f471a57dbf` | 2F-10-2F-10-L3 | `NORMAL` | — |
| 67 | `TE70743-2` | TE-7-074-3 | `d52c9890-6bb7-43af-b136-3bf1c2de66bf` | 2F-10-2F-10-L3 | `NORMAL` | — |
| 68 | `TE81035` | TE-8-103-5 | `3b307d49-7ce7-4c66-a3dd-4bcac69e2dcc` | 2F-10-2F-10-L2 | `NORMAL` | — |
| 69 | `TE91560` | TE-9-156-0 | `285119de-c4c2-43ca-bab1-717f662f15b6` | 2F-08-2F-08-L1 | `NORMAL` | — |
| 70 | `TSP002` | TSP-002 | `6ab36f1a-99dc-43e4-8822-336c7f78743a` | CS-04-CS-04-L3 | `NORMAL` | — |
| 71 | `YCM022` | YCM-022 | `f43679c1-ce22-4f59-822d-954f4ff405cd` | 2F-08-2F-08-L4 | `NORMAL` | — |
| 72 | `YCM042` | YCM-042 | `525ba9f7-87b0-4235-ac35-d6e7cee28627` | GT-04-GT-04-L4 | `NORMAL` | — |
| 73 | `YPC002` | YPC-002 | `18a86e7a-c9bc-4080-a370-60822ab588b8` | GT-04-GT-04-L1 | `NORMAL` | — |
| 74 | `YPK` | YPK | `a0055cc4-f527-4c6b-869d-18efd4cdd496` | Chưa xếp kệ | `NORMAL` | — |
| 75 | `YSDD` | YSD-D | `66cf8c65-5a6f-4d6a-8531-7cdf41531cb2` | 2F-10-2F-10-L2 | `NORMAL` | — |
| 76 | `YSDG` | YSD-G | `5ad58e7d-5b33-46de-a63f-65780971046e` | 2F-01-2F-01-L1 | `NORMAL` | — |
| 77 | `YSDG-2` | YSD-G | `1aeb5950-d1a8-441b-9972-138f04d4a94e` | 2F-10-2F-10-L1 | `NORMAL` | — |
| 78 | `ウレタン` | ウレタン | `bf9f52b9-0e0d-4d49-9f47-90f2b2763e5c` | CS-04-CS-04-L3 | `NORMAL` | — |
| 79 | `ブラシ小` | ブラシ小 | `2acacb20-edcd-4aab-9d84-dd904d0cca53` | Chưa xếp kệ | `NORMAL` | — |
| 80 | `足形` | 足形 | `b2755e2e-e495-41a9-9837-112287f4b9cb` | CS-04-CS-04-L3 | `NORMAL` | — |
| 81 | `鈴木トレイ` | 鈴木トレイ | `6710adcf-2ac4-444b-a2d9-13d32fc05d76` | Chưa xếp kệ | `NORMAL` | — |
