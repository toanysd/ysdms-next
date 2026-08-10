UPDATE public.machine_type 
SET spec_schema = jsonb_set(
    spec_schema, 
    '{fields}', 
    (spec_schema->'fields') || '[{"key": "feed_length_mm", "label_vi": "Chiều dài bước tiến", "label_jp": "送り長さ", "unit": "mm", "type": "number"}]'::jsonb
) 
WHERE code = 'THERMOFORM';

UPDATE public.machine_model 
SET specs = specs || '{"feed_length_mm": 400}'::jsonb 
WHERE machine_type_id = (SELECT id FROM public.machine_type WHERE code = 'THERMOFORM');
