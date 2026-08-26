-- Thêm UNIQUE constraint cho legacy_id (bảng companies)
ALTER TABLE public.companies ADD CONSTRAINT companies_legacy_id_key UNIQUE (legacy_id);

-- Thêm cột last_synced_at để theo dõi thời điểm đồng bộ CSV cuối cùng
ALTER TABLE public.companies ADD COLUMN last_synced_at timestamptz;

-- Thêm cột is_manually_edited để ngăn Diff Engine ghi đè nếu User đã sửa tay
ALTER TABLE public.companies ADD COLUMN is_manually_edited boolean DEFAULT false;
