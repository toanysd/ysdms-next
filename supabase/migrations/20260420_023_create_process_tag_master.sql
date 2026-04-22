CREATE TABLE public.process_tag_master (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL UNIQUE,        -- 【袋詰め】
  display_text text NOT NULL,        -- "袋詰め"
  category text,                     -- 'process' | 'packaging' | 'custom'
  sort_order integer DEFAULT 99,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Seed mặc định
INSERT INTO public.process_tag_master (label, display_text, category, sort_order) VALUES
('【台湾機】', '台湾機', 'process', 1),
('【別抜き】', '別抜き', 'process', 2),
('【袋詰め】', '袋詰め', 'packaging', 3),
('【面取り】', '面取り', 'process', 4),
('【全数検査】', '全数検査', 'process', 5),
('【無地ケース】', '無地ケース', 'packaging', 6),
('【無地ラベル】', '無地ラベル', 'packaging', 7),
('【導電シート】', '導電シート', 'packaging', 8),
('【YSUIOI箱使用】', 'YSUIOI箱使用', 'packaging', 9);
