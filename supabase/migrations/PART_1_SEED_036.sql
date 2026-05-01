-- PART 1/14
BEGIN;

-- =============================================================
-- 036_seed_master_data_v3.sql
-- Generated: 2026-04-22 18:15:34 JST
-- Strategy : V3 7-Block CNC Nomenclature
-- =============================================================
-- [1] Machine Models & Instances
INSERT INTO machine_model (id, machine_type_id, manufacturer, model_code, model_name, specs)
SELECT '00000000-aaaa-0000-0000-000000000001'::uuid, id, $$ILLIG$$, $$RV53b$$, $$Máy RV53b$$, $${"max_forming_length_mm": 500, "max_forming_width_mm": 350}$$::jsonb
FROM machine_type WHERE code = 'THERMOFORM' ON CONFLICT (id) DO NOTHING;
INSERT INTO machine_model (id, machine_type_id, manufacturer, model_code, model_name, specs)
SELECT '00000000-aaaa-0000-0000-000000000003'::uuid, id, $$ILLIG$$, $$RV74D$$, $$Máy RV74D$$, $${"max_forming_length_mm": 704, "max_forming_width_mm": 530}$$::jsonb
FROM machine_type WHERE code = 'THERMOFORM' ON CONFLICT (id) DO NOTHING;
INSERT INTO machine_instance (id, machine_model_id, internal_code, name, status)
VALUES ('00000000-bbbb-0000-0000-000000000006'::uuid, '00000000-aaaa-0000-0000-000000000001'::uuid, $$MAC-6$$, $$ILLIG 6$$, 'active')
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name;
INSERT INTO machine_instance (id, machine_model_id, internal_code, name, status)
VALUES ('00000000-bbbb-0000-0000-000000000007'::uuid, '00000000-aaaa-0000-0000-000000000001'::uuid, $$MAC-7$$, $$ILLIG 7$$, 'active')
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name;
INSERT INTO machine_instance (id, machine_model_id, internal_code, name, status)
VALUES ('00000000-bbbb-0000-0000-000000000008'::uuid, '00000000-aaaa-0000-0000-000000000003'::uuid, $$MAC-8$$, $$ILLIG 8$$, 'active')
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name;
INSERT INTO machine_instance (id, machine_model_id, internal_code, name, status)
VALUES ('00000000-bbbb-0000-0000-000000000009'::uuid, '00000000-aaaa-0000-0000-000000000003'::uuid, $$MAC-9$$, $$ILLIG 9$$, 'active')
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name;
-- [2] Molds (V3 Standard)
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000001'::uuid, $$12X356X460$$, $$12X356X460$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000001'::uuid, '00000000-1111-0000-0000-000000000001'::uuid, $$12X356X460$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000002'::uuid, $$26.5ｘ82.5ｘ480$$, $$26.5ｘ82.5ｘ480$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000002'::uuid, '00000000-1111-0000-0000-000000000002'::uuid, $$26.5ｘ82.5ｘ480$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000003'::uuid, $$36x260x380$$, $$36x260x380$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000003'::uuid, '00000000-1111-0000-0000-000000000003'::uuid, $$36x260x380$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000004'::uuid, $$3x246x335$$, $$3x246x335$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000004'::uuid, '00000000-1111-0000-0000-000000000004'::uuid, $$3x246x335$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000005'::uuid, $$5x600x745DIM-018$$, $$5x600x745 DIM-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000005'::uuid, '00000000-1111-0000-0000-000000000005'::uuid, $$5x600x745DIM-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000006'::uuid, $$74CABFO-R1STAKING$$, $$74C AB FOR STAKING$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000006'::uuid, '00000000-1111-0000-0000-000000000006'::uuid, $$74CABFO-R1STAKING$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000007'::uuid, $$74CALUMBASEVer10t$$, $$74C ALUM BASE Ver10t$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000007'::uuid, '00000000-1111-0000-0000-000000000007'::uuid, $$74CALUMBASEVer10t$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000008'::uuid, $$74CALUMCUTTE-R1BASE$$, $$74C ALUM CUTTER BASE$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000008'::uuid, '00000000-1111-0000-0000-000000000008'::uuid, $$74CALUMCUTTE-R1BASE$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000009'::uuid, $$74CCommonUpperParts$$, $$74C Common Upper Parts$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000009'::uuid, '00000000-1111-0000-0000-000000000009'::uuid, $$74CCommonUpperParts$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000000a'::uuid, $$74CJAECUTTE-R1BASEPLATE$$, $$74C JAE CUTTER BASE PLATE$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000000a'::uuid, '00000000-1111-0000-0000-00000000000a'::uuid, $$74CJAECUTTE-R1BASEPLATE$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000000b'::uuid, $$74CPB-H20$$, $$74C PB-H20$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000000b'::uuid, '00000000-1111-0000-0000-00000000000b'::uuid, $$74CPB-H20$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000000c'::uuid, $$74CVENEE-R1BASE$$, $$74C VENEER BASE$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000000c'::uuid, '00000000-1111-0000-0000-00000000000c'::uuid, $$74CVENEE-R1BASE$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000000d'::uuid, $$74Cスタック用NPC-T-409$$, $$74C スタック用 NPC-T-409$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000000d'::uuid, '00000000-1111-0000-0000-00000000000d'::uuid, $$74Cスタック用NPC-T-409$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000000e'::uuid, $$74C-H15UPPE$$, $$74C-H15 UPPER$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000000e'::uuid, '00000000-1111-0000-0000-00000000000e'::uuid, $$74C-H15UPPE-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000000f'::uuid, $$A別抜き$$, $$A 別抜き$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000000f'::uuid, '00000000-1111-0000-0000-00000000000f'::uuid, $$A別抜き$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000010'::uuid, $$AA$$, $$AAT$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000010'::uuid, '00000000-1111-0000-0000-000000000010'::uuid, $$AA$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000011'::uuid, $$AAT-001$$, $$AAT-001B$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000011'::uuid, '00000000-1111-0000-0000-000000000011'::uuid, $$AAT-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000013'::uuid, $$AAT-004$$, $$AAT-004B$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000013'::uuid, '00000000-1111-0000-0000-000000000013'::uuid, $$AAT-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000015'::uuid, $$AAT-005$$, $$AAT-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000015'::uuid, '00000000-1111-0000-0000-000000000015'::uuid, $$AAT-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000016'::uuid, $$AAT-006$$, $$AAT-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000016'::uuid, '00000000-1111-0000-0000-000000000016'::uuid, $$AAT-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000017'::uuid, $$AAT-007$$, $$AAT-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000017'::uuid, '00000000-1111-0000-0000-000000000017'::uuid, $$AAT-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000018'::uuid, $$AAT-008$$, $$AAT-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000018'::uuid, '00000000-1111-0000-0000-000000000018'::uuid, $$AAT-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000019'::uuid, $$ADV$$, $$ADV$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000019'::uuid, '00000000-1111-0000-0000-000000000019'::uuid, $$ADV$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000001a'::uuid, $$ADV-002$$, $$ADV-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000001a'::uuid, '00000000-1111-0000-0000-00000000001a'::uuid, $$ADV-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000001b'::uuid, $$ADV-006$$, $$ADV-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000001b'::uuid, '00000000-1111-0000-0000-00000000001b'::uuid, $$ADV-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000001c'::uuid, $$ADV-007$$, $$ADV-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000001c'::uuid, '00000000-1111-0000-0000-00000000001c'::uuid, $$ADV-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000001d'::uuid, $$ADV-008$$, $$ADV-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000001d'::uuid, '00000000-1111-0000-0000-00000000001d'::uuid, $$ADV-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000001e'::uuid, $$ADV-009$$, $$ADV-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000001e'::uuid, '00000000-1111-0000-0000-00000000001e'::uuid, $$ADV-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000001f'::uuid, $$ADV-014$$, $$ADV-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000001f'::uuid, '00000000-1111-0000-0000-00000000001f'::uuid, $$ADV-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000020'::uuid, $$ADV-015$$, $$ADV-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000020'::uuid, '00000000-1111-0000-0000-000000000020'::uuid, $$ADV-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000021'::uuid, $$ADV-017$$, $$ADV-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000021'::uuid, '00000000-1111-0000-0000-000000000021'::uuid, $$ADV-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000022'::uuid, $$ADV-019$$, $$ADV-019$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000022'::uuid, '00000000-1111-0000-0000-000000000022'::uuid, $$ADV-019$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000023'::uuid, $$ADV-023$$, $$ADV-023$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000023'::uuid, '00000000-1111-0000-0000-000000000023'::uuid, $$ADV-023$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000024'::uuid, $$ADV-024$$, $$ADV-024$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000024'::uuid, '00000000-1111-0000-0000-000000000024'::uuid, $$ADV-024$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000025'::uuid, $$ADV-025$$, $$ADV-025R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000025'::uuid, '00000000-1111-0000-0000-000000000025'::uuid, $$ADV-025-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000026'::uuid, $$ADV-026$$, $$ADV-026$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000026'::uuid, '00000000-1111-0000-0000-000000000026'::uuid, $$ADV-026$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000027'::uuid, $$ADV-027$$, $$ADV-027$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000027'::uuid, '00000000-1111-0000-0000-000000000027'::uuid, $$ADV-027$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000028'::uuid, $$ADV-029$$, $$ADV-029 R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000028'::uuid, '00000000-1111-0000-0000-000000000028'::uuid, $$ADV-029-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000029'::uuid, $$ADV-032$$, $$ADV-032$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000029'::uuid, '00000000-1111-0000-0000-000000000029'::uuid, $$ADV-032$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000002a'::uuid, $$ADV-033$$, $$ADV-033$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000002a'::uuid, '00000000-1111-0000-0000-00000000002a'::uuid, $$ADV-033$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000002b'::uuid, $$ADV-034$$, $$ADV-034$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000002b'::uuid, '00000000-1111-0000-0000-00000000002b'::uuid, $$ADV-034$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000002c'::uuid, $$ADV-035$$, $$ADV-035$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000002c'::uuid, '00000000-1111-0000-0000-00000000002c'::uuid, $$ADV-035$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000002d'::uuid, $$ADV-037$$, $$ADV-037$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000002d'::uuid, '00000000-1111-0000-0000-00000000002d'::uuid, $$ADV-037$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000002e'::uuid, $$ADY-006$$, $$ADY-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000002e'::uuid, '00000000-1111-0000-0000-00000000002e'::uuid, $$ADY-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000002f'::uuid, $$ADY-051$$, $$ADY-051$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000002f'::uuid, '00000000-1111-0000-0000-00000000002f'::uuid, $$ADY-051$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000030'::uuid, $$ADY-053$$, $$ADY-053$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000030'::uuid, '00000000-1111-0000-0000-000000000030'::uuid, $$ADY-053$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000031'::uuid, $$ADY-054$$, $$ADY-054$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000031'::uuid, '00000000-1111-0000-0000-000000000031'::uuid, $$ADY-054$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000032'::uuid, $$ADY-055$$, $$ADY-055$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000032'::uuid, '00000000-1111-0000-0000-000000000032'::uuid, $$ADY-055$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000033'::uuid, $$ADY-059$$, $$ADY-059$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000033'::uuid, '00000000-1111-0000-0000-000000000033'::uuid, $$ADY-059$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000034'::uuid, $$ADY-060$$, $$ADY-060$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000034'::uuid, '00000000-1111-0000-0000-000000000034'::uuid, $$ADY-060$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000035'::uuid, $$ADY-061$$, $$ADY-061$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000035'::uuid, '00000000-1111-0000-0000-000000000035'::uuid, $$ADY-061$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000036'::uuid, $$ADY-062$$, $$ADY-062$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000036'::uuid, '00000000-1111-0000-0000-000000000036'::uuid, $$ADY-062$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000037'::uuid, $$ADY-063$$, $$ADY-063$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000037'::uuid, '00000000-1111-0000-0000-000000000037'::uuid, $$ADY-063$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000038'::uuid, $$ADY-064$$, $$ADY-064$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000038'::uuid, '00000000-1111-0000-0000-000000000038'::uuid, $$ADY-064$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000039'::uuid, $$ADY-067$$, $$ADY-067$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000039'::uuid, '00000000-1111-0000-0000-000000000039'::uuid, $$ADY-067$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000003a'::uuid, $$ADY-068$$, $$ADY-068$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000003a'::uuid, '00000000-1111-0000-0000-00000000003a'::uuid, $$ADY-068$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000003b'::uuid, $$ADY-069$$, $$ADY-069$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000003b'::uuid, '00000000-1111-0000-0000-00000000003b'::uuid, $$ADY-069$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000003c'::uuid, $$ADY-070$$, $$ADY-070$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000003c'::uuid, '00000000-1111-0000-0000-00000000003c'::uuid, $$ADY-070$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000003d'::uuid, $$ADY-071$$, $$ADY-071$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000003d'::uuid, '00000000-1111-0000-0000-00000000003d'::uuid, $$ADY-071$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000003e'::uuid, $$ADY-074$$, $$ADY-074$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000003e'::uuid, '00000000-1111-0000-0000-00000000003e'::uuid, $$ADY-074$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000003f'::uuid, $$ADY-075$$, $$ADY-075$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000003f'::uuid, '00000000-1111-0000-0000-00000000003f'::uuid, $$ADY-075$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000040'::uuid, $$ADY-076$$, $$ADY-076$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000040'::uuid, '00000000-1111-0000-0000-000000000040'::uuid, $$ADY-076$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000041'::uuid, $$ADY-077$$, $$ADY-077$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000041'::uuid, '00000000-1111-0000-0000-000000000041'::uuid, $$ADY-077$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000042'::uuid, $$ADY-078$$, $$ADY-078$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000042'::uuid, '00000000-1111-0000-0000-000000000042'::uuid, $$ADY-078$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000045'::uuid, $$ADY-079$$, $$ADY-079$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000045'::uuid, '00000000-1111-0000-0000-000000000045'::uuid, $$ADY-079$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000046'::uuid, $$ADY-080$$, $$ADY-080$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000046'::uuid, '00000000-1111-0000-0000-000000000046'::uuid, $$ADY-080$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000047'::uuid, $$ADY-081$$, $$ADY-081$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000047'::uuid, '00000000-1111-0000-0000-000000000047'::uuid, $$ADY-081$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000048'::uuid, $$ADY-082$$, $$ADY-082$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000048'::uuid, '00000000-1111-0000-0000-000000000048'::uuid, $$ADY-082$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000049'::uuid, $$ADY-083$$, $$ADY-083$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000049'::uuid, '00000000-1111-0000-0000-000000000049'::uuid, $$ADY-083$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000004a'::uuid, '00000000-1111-0000-0000-000000000049'::uuid, $$ADY-083-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000004b'::uuid, $$ADY-084$$, $$ADY-084$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000004b'::uuid, '00000000-1111-0000-0000-00000000004b'::uuid, $$ADY-084$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000004c'::uuid, $$ADY-085$$, $$ADY-085$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000004c'::uuid, '00000000-1111-0000-0000-00000000004c'::uuid, $$ADY-085$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000004d'::uuid, $$ADY-086$$, $$ADY-086$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000004d'::uuid, '00000000-1111-0000-0000-00000000004d'::uuid, $$ADY-086$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000004e'::uuid, $$ADY-087$$, $$ADY-087$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000004e'::uuid, '00000000-1111-0000-0000-00000000004e'::uuid, $$ADY-087$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000004f'::uuid, $$ADY-088$$, $$ADY-088$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000004f'::uuid, '00000000-1111-0000-0000-00000000004f'::uuid, $$ADY-088$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000050'::uuid, $$ADY-089$$, $$ADY-089$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000050'::uuid, '00000000-1111-0000-0000-000000000050'::uuid, $$ADY-089$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000051'::uuid, $$ADY-090$$, $$ADY-090 R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000051'::uuid, '00000000-1111-0000-0000-000000000051'::uuid, $$ADY-090-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000052'::uuid, $$ADY-090($$, $$ADY-090 (梱包）$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000052'::uuid, '00000000-1111-0000-0000-000000000052'::uuid, $$ADY-090($$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000053'::uuid, $$ADY-092$$, $$ADY-092$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000053'::uuid, '00000000-1111-0000-0000-000000000053'::uuid, $$ADY-092$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000054'::uuid, $$ADY-093$$, $$ADY-093R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000054'::uuid, '00000000-1111-0000-0000-000000000054'::uuid, $$ADY-093-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000055'::uuid, $$ADY-096$$, $$ADY-096$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000055'::uuid, '00000000-1111-0000-0000-000000000055'::uuid, $$ADY-096$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000056'::uuid, $$ADY-097$$, $$ADY-097$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000056'::uuid, '00000000-1111-0000-0000-000000000056'::uuid, $$ADY-097$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000057'::uuid, $$ADY-098$$, $$ADY-098$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000057'::uuid, '00000000-1111-0000-0000-000000000057'::uuid, $$ADY-098$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000058'::uuid, $$ADY-099$$, $$ADY-099$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000058'::uuid, '00000000-1111-0000-0000-000000000058'::uuid, $$ADY-099$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000005b'::uuid, $$ADY-101$$, $$ADY-101$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000005b'::uuid, '00000000-1111-0000-0000-00000000005b'::uuid, $$ADY-101$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000005c'::uuid, $$ADY-102$$, $$ADY-102$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000005c'::uuid, '00000000-1111-0000-0000-00000000005c'::uuid, $$ADY-102$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000005d'::uuid, $$ADY-103$$, $$ADY-103$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000005d'::uuid, '00000000-1111-0000-0000-00000000005d'::uuid, $$ADY-103$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000005e'::uuid, $$ADY-104$$, $$ADY-104$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000005e'::uuid, '00000000-1111-0000-0000-00000000005e'::uuid, $$ADY-104$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000005f'::uuid, $$ADY-105$$, $$ADY-105$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000005f'::uuid, '00000000-1111-0000-0000-00000000005f'::uuid, $$ADY-105$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000060'::uuid, $$ADY-106$$, $$ADY-106$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000060'::uuid, '00000000-1111-0000-0000-000000000060'::uuid, $$ADY-106$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000061'::uuid, $$ADY-108$$, $$ADY-108$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000061'::uuid, '00000000-1111-0000-0000-000000000061'::uuid, $$ADY-108$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000062'::uuid, $$ADY-110$$, $$ADY-110$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000062'::uuid, '00000000-1111-0000-0000-000000000062'::uuid, $$ADY-110$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000063'::uuid, $$ADY-111$$, $$ADY-111$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000063'::uuid, '00000000-1111-0000-0000-000000000063'::uuid, $$ADY-111$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000064'::uuid, $$ADY-112$$, $$ADY-112$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000064'::uuid, '00000000-1111-0000-0000-000000000064'::uuid, $$ADY-112$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000065'::uuid, $$ADY-113$$, $$ADY-113$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000065'::uuid, '00000000-1111-0000-0000-000000000065'::uuid, $$ADY-113$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000066'::uuid, $$ADY-114$$, $$ADY-114$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000066'::uuid, '00000000-1111-0000-0000-000000000066'::uuid, $$ADY-114$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000067'::uuid, $$ADY-115$$, $$ADY-115$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000067'::uuid, '00000000-1111-0000-0000-000000000067'::uuid, $$ADY-115$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000068'::uuid, $$ADY-117$$, $$ADY-117$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000068'::uuid, '00000000-1111-0000-0000-000000000068'::uuid, $$ADY-117$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000069'::uuid, $$ADY-118$$, $$ADY-118$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000069'::uuid, '00000000-1111-0000-0000-000000000069'::uuid, $$ADY-118$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000006a'::uuid, $$ADY-119$$, $$ADY-119$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000006a'::uuid, '00000000-1111-0000-0000-00000000006a'::uuid, $$ADY-119$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000006b'::uuid, $$ADY-123$$, $$ADY-123$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000006b'::uuid, '00000000-1111-0000-0000-00000000006b'::uuid, $$ADY-123$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000006d'::uuid, $$ADY-125D$$, $$ADY-125D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000006d'::uuid, '00000000-1111-0000-0000-00000000006d'::uuid, $$ADY-125D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000006e'::uuid, $$ADY-125$$, $$ADY-125$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000006e'::uuid, '00000000-1111-0000-0000-00000000006e'::uuid, $$ADY-125$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000006f'::uuid, $$ADY-126$$, $$ADY-126$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000006f'::uuid, '00000000-1111-0000-0000-00000000006f'::uuid, $$ADY-126$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000070'::uuid, $$ADY-127$$, $$ADY-127$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000070'::uuid, '00000000-1111-0000-0000-000000000070'::uuid, $$ADY-127$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000071'::uuid, $$AFMC-001$$, $$AFMC-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000071'::uuid, '00000000-1111-0000-0000-000000000071'::uuid, $$AFMC-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000072'::uuid, $$AFMC-002$$, $$AFMC-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000072'::uuid, '00000000-1111-0000-0000-000000000072'::uuid, $$AFMC-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000073'::uuid, $$AGR-001$$, $$AGR-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000073'::uuid, '00000000-1111-0000-0000-000000000073'::uuid, $$AGR-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000074'::uuid, $$AKR-001$$, $$AKR-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000074'::uuid, '00000000-1111-0000-0000-000000000074'::uuid, $$AKR-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000075'::uuid, $$AKT-001$$, $$AKT-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000075'::uuid, '00000000-1111-0000-0000-000000000075'::uuid, $$AKT-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000076'::uuid, $$ALBASE10x557x704$$, $$AL BASE 10x557x704$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000076'::uuid, '00000000-1111-0000-0000-000000000076'::uuid, $$ALBASE10x557x704$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000077'::uuid, $$ALCUTTE-R1234x184YMS3P$$, $$ALCUTTER 234x184 YMS 3P$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000077'::uuid, '00000000-1111-0000-0000-000000000077'::uuid, $$ALCUTTE-R1234x184YMS3P$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000078'::uuid, $$ALCUTTE-R1248.4x198.4YMS4P$$, $$ALCUTTER 248.4x198.4 YMS 4P$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000078'::uuid, '00000000-1111-0000-0000-000000000078'::uuid, $$ALCUTTE-R1248.4x198.4YMS4P$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000079'::uuid, $$ALCUTTE-R1270x270JAE$$, $$ALCUTTER 270x270 JAE$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000079'::uuid, '00000000-1111-0000-0000-000000000079'::uuid, $$ALCUTTE-R1270x270JAE$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000007a'::uuid, $$ALCUTTE-R1310x210JAE$$, $$ALCUTTER 310x210 JAE$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000007a'::uuid, '00000000-1111-0000-0000-00000000007a'::uuid, $$ALCUTTE-R1310x210JAE$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000007b'::uuid, $$ALCUTTE-R1508x335FHJ$$, $$ALCUTTER 508x335 FHJ$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000007b'::uuid, '00000000-1111-0000-0000-00000000007b'::uuid, $$ALCUTTE-R1508x335FHJ$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000007c'::uuid, $$ALCUTTE-R1510x340ADY$$, $$ALCUTTER 510x340 ADY$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000007c'::uuid, '00000000-1111-0000-0000-00000000007c'::uuid, $$ALCUTTE-R1510x340ADY$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000007d'::uuid, $$ALCUTTE-R1ADY2P$$, $$ALCUTTER ADY 2P$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000007d'::uuid, '00000000-1111-0000-0000-00000000007d'::uuid, $$ALCUTTE-R1ADY2P$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000007e'::uuid, $$ALCUTTE-R1PLATE-ADY2P$$, $$ALCUTTER PLATE - ADY 2P$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000007e'::uuid, '00000000-1111-0000-0000-00000000007e'::uuid, $$ALCUTTE-R1PLATE-ADY2P$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000007f'::uuid, $$ALCUTTE-R1PLATE-YMS4P$$, $$ALCUTTER PLATE - YMS 4P$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000007f'::uuid, '00000000-1111-0000-0000-00000000007f'::uuid, $$ALCUTTE-R1PLATE-YMS4P$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000080'::uuid, $$ALCUTTE-R1PlateJAE270x270$$, $$ALCUTTER Plate JAE 270x270$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000080'::uuid, '00000000-1111-0000-0000-000000000080'::uuid, $$ALCUTTE-R1PlateJAE270x270$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000081'::uuid, $$ALF-001$$, $$ALF-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000081'::uuid, '00000000-1111-0000-0000-000000000081'::uuid, $$ALF-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000082'::uuid, $$ALF-002$$, $$ALF-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000082'::uuid, '00000000-1111-0000-0000-000000000082'::uuid, $$ALF-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000083'::uuid, $$ALP-001$$, $$ALP-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000083'::uuid, '00000000-1111-0000-0000-000000000083'::uuid, $$ALP-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000084'::uuid, $$ALP-001A$$, $$ALP-001A$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000084'::uuid, '00000000-1111-0000-0000-000000000084'::uuid, $$ALP-001A$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000086'::uuid, $$ALP-002$$, $$ALP-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000086'::uuid, '00000000-1111-0000-0000-000000000086'::uuid, $$ALP-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000087'::uuid, $$AMP$$, $$AMP$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000087'::uuid, '00000000-1111-0000-0000-000000000087'::uuid, $$AMP$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000088'::uuid, $$AMP-010$$, $$AMP-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000088'::uuid, '00000000-1111-0000-0000-000000000088'::uuid, $$AMP-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000089'::uuid, $$AMP-010-3$$, $$AMP-010-3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000089'::uuid, '00000000-1111-0000-0000-000000000089'::uuid, $$AMP-010-3$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000008a'::uuid, $$AMP-011$$, $$AMP-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000008a'::uuid, '00000000-1111-0000-0000-00000000008a'::uuid, $$AMP-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000008b'::uuid, $$AMP-012$$, $$AMP-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000008b'::uuid, '00000000-1111-0000-0000-00000000008b'::uuid, $$AMP-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000008c'::uuid, $$AMP-013$$, $$AMP-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000008c'::uuid, '00000000-1111-0000-0000-00000000008c'::uuid, $$AMP-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000008d'::uuid, $$AMP-0-130-6$$, $$AMP-0-130-6$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000008d'::uuid, '00000000-1111-0000-0000-00000000008d'::uuid, $$AMP-0-130-6$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000008e'::uuid, $$AMP-014$$, $$AMP-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000008e'::uuid, '00000000-1111-0000-0000-00000000008e'::uuid, $$AMP-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000008f'::uuid, $$AMP-015$$, $$AMP-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000008f'::uuid, '00000000-1111-0000-0000-00000000008f'::uuid, $$AMP-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000090'::uuid, $$AMP-016$$, $$AMP-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000090'::uuid, '00000000-1111-0000-0000-000000000090'::uuid, $$AMP-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000091'::uuid, $$AMP-017$$, $$AMP-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000091'::uuid, '00000000-1111-0000-0000-000000000091'::uuid, $$AMP-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000092'::uuid, $$AMP-018$$, $$AMP-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000092'::uuid, '00000000-1111-0000-0000-000000000092'::uuid, $$AMP-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000093'::uuid, $$AMP-019$$, $$AMP-019$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000093'::uuid, '00000000-1111-0000-0000-000000000093'::uuid, $$AMP-019$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000094'::uuid, $$AMP-021$$, $$AMP-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000094'::uuid, '00000000-1111-0000-0000-000000000094'::uuid, $$AMP-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000095'::uuid, $$AMP-022$$, $$AMP-022$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000095'::uuid, '00000000-1111-0000-0000-000000000095'::uuid, $$AMP-022$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000096'::uuid, $$AMP-023$$, $$AMP-023$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000096'::uuid, '00000000-1111-0000-0000-000000000096'::uuid, $$AMP-023$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000097'::uuid, $$AMP-024$$, $$AMP-024$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000097'::uuid, '00000000-1111-0000-0000-000000000097'::uuid, $$AMP-024$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000098'::uuid, $$AMP-025$$, $$AMP-025$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000098'::uuid, '00000000-1111-0000-0000-000000000098'::uuid, $$AMP-025$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000099'::uuid, $$AMP-026$$, $$AMP-026$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000099'::uuid, '00000000-1111-0000-0000-000000000099'::uuid, $$AMP-026$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000009a'::uuid, $$AMP-027$$, $$AMP-027$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000009a'::uuid, '00000000-1111-0000-0000-00000000009a'::uuid, $$AMP-027$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000009b'::uuid, $$AMP-9面$$, $$AMP-9面$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000009b'::uuid, '00000000-1111-0000-0000-00000000009b'::uuid, $$AMP-9面$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000009c'::uuid, $$AMP-PP台湾機$$, $$AMP-PP 台湾機$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000009c'::uuid, '00000000-1111-0000-0000-00000000009c'::uuid, $$AMP-PP台湾機$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000009d'::uuid, $$AMP-大　PP　台湾機$$, $$AMP-大　PP　台湾機$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000009d'::uuid, '00000000-1111-0000-0000-00000000009d'::uuid, $$AMP-大　PP　台湾機$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000009e'::uuid, $$AON-001$$, $$AON-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000009e'::uuid, '00000000-1111-0000-0000-00000000009e'::uuid, $$AON-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000009f'::uuid, $$AON-003$$, $$AON-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000009f'::uuid, '00000000-1111-0000-0000-00000000009f'::uuid, $$AON-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000a0'::uuid, $$AP-001$$, $$AP-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000a0'::uuid, '00000000-1111-0000-0000-0000000000a0'::uuid, $$AP-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000a1'::uuid, $$AP-024$$, $$AP-024$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000a1'::uuid, '00000000-1111-0000-0000-0000000000a1'::uuid, $$AP-024$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000a2'::uuid, $$AP-10$$, $$AP-10$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000a2'::uuid, '00000000-1111-0000-0000-0000000000a2'::uuid, $$AP-10$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000a3'::uuid, $$AP-101$$, $$AP-101$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000a3'::uuid, '00000000-1111-0000-0000-0000000000a3'::uuid, $$AP-101$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000a4'::uuid, $$AP-102$$, $$AP-102$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000a4'::uuid, '00000000-1111-0000-0000-0000000000a4'::uuid, $$AP-102$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000a5'::uuid, $$AP-103$$, $$AP-103$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000a5'::uuid, '00000000-1111-0000-0000-0000000000a5'::uuid, $$AP-103$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000a6'::uuid, $$AP-104$$, $$AP-104$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000a6'::uuid, '00000000-1111-0000-0000-0000000000a6'::uuid, $$AP-104$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000a7'::uuid, $$AP-30$$, $$AP-30$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000a7'::uuid, '00000000-1111-0000-0000-0000000000a7'::uuid, $$AP-30$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000a8'::uuid, $$APE-001$$, $$APE-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000a8'::uuid, '00000000-1111-0000-0000-0000000000a8'::uuid, $$APE-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000a9'::uuid, $$APE-002$$, $$APE-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000a9'::uuid, '00000000-1111-0000-0000-0000000000a9'::uuid, $$APE-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000aa'::uuid, $$APF-002$$, $$APF-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000aa'::uuid, '00000000-1111-0000-0000-0000000000aa'::uuid, $$APF-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000ab'::uuid, $$APF-003$$, $$APF-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000ab'::uuid, '00000000-1111-0000-0000-0000000000ab'::uuid, $$APF-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000ac'::uuid, $$APF-004$$, $$APF-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000ac'::uuid, '00000000-1111-0000-0000-0000000000ac'::uuid, $$APF-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000ad'::uuid, $$APF-006$$, $$APF-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000ad'::uuid, '00000000-1111-0000-0000-0000000000ad'::uuid, $$APF-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000af'::uuid, $$ARD-001$$, $$ARD-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000af'::uuid, '00000000-1111-0000-0000-0000000000af'::uuid, $$ARD-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000b0'::uuid, $$ARK-001$$, $$ARK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000b0'::uuid, '00000000-1111-0000-0000-0000000000b0'::uuid, $$ARK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000b1'::uuid, $$ARK-002$$, $$ARK-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000b1'::uuid, '00000000-1111-0000-0000-0000000000b1'::uuid, $$ARK-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000b2'::uuid, $$ASC-001$$, $$ASC-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000b2'::uuid, '00000000-1111-0000-0000-0000000000b2'::uuid, $$ASC-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000b3'::uuid, $$ASC-002$$, $$ASC-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000b3'::uuid, '00000000-1111-0000-0000-0000000000b3'::uuid, $$ASC-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000b4'::uuid, $$ASC-002D$$, $$ASC-002D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000b4'::uuid, '00000000-1111-0000-0000-0000000000b4'::uuid, $$ASC-002D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000b5'::uuid, $$ASH-001$$, $$ASH-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000b5'::uuid, '00000000-1111-0000-0000-0000000000b5'::uuid, $$ASH-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000b6'::uuid, $$ASH-002$$, $$ASH-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000b6'::uuid, '00000000-1111-0000-0000-0000000000b6'::uuid, $$ASH-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000b7'::uuid, $$ASH-003$$, $$ASH-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000b7'::uuid, '00000000-1111-0000-0000-0000000000b7'::uuid, $$ASH-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000b8'::uuid, $$ASH-004$$, $$ASH-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000b8'::uuid, '00000000-1111-0000-0000-0000000000b8'::uuid, $$ASH-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000b9'::uuid, $$ASH-005$$, $$ASH-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000b9'::uuid, '00000000-1111-0000-0000-0000000000b9'::uuid, $$ASH-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000ba'::uuid, $$ASH-006$$, $$ASH-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000ba'::uuid, '00000000-1111-0000-0000-0000000000ba'::uuid, $$ASH-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000bb'::uuid, $$ASH-007$$, $$ASH-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000bb'::uuid, '00000000-1111-0000-0000-0000000000bb'::uuid, $$ASH-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000bc'::uuid, $$ASS-001$$, $$ASS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000bc'::uuid, '00000000-1111-0000-0000-0000000000bc'::uuid, $$ASS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000bd'::uuid, $$AST-001$$, $$AST-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000bd'::uuid, '00000000-1111-0000-0000-0000000000bd'::uuid, $$AST-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000be'::uuid, $$ATK-053$$, $$ATK-053$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000be'::uuid, '00000000-1111-0000-0000-0000000000be'::uuid, $$ATK-053$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000bf'::uuid, $$ATS-002$$, $$ATS-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000bf'::uuid, '00000000-1111-0000-0000-0000000000bf'::uuid, $$ATS-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000c0'::uuid, $$ATS-003$$, $$ATS-003R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000c0'::uuid, '00000000-1111-0000-0000-0000000000c0'::uuid, $$ATS-003-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000c1'::uuid, $$ATS-004$$, $$ATS-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000c1'::uuid, '00000000-1111-0000-0000-0000000000c1'::uuid, $$ATS-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000c2'::uuid, $$ATS-005$$, $$ATS-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000c2'::uuid, '00000000-1111-0000-0000-0000000000c2'::uuid, $$ATS-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000c3'::uuid, $$ATS-006$$, $$ATS-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000c3'::uuid, '00000000-1111-0000-0000-0000000000c3'::uuid, $$ATS-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000c4'::uuid, $$ATS-010$$, $$ATS-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000c4'::uuid, '00000000-1111-0000-0000-0000000000c4'::uuid, $$ATS-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000c5'::uuid, $$ATS-011$$, $$ATS-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000c5'::uuid, '00000000-1111-0000-0000-0000000000c5'::uuid, $$ATS-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000c6'::uuid, $$ATS-013$$, $$ATS-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000c6'::uuid, '00000000-1111-0000-0000-0000000000c6'::uuid, $$ATS-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000c7'::uuid, $$ATS-015$$, $$ATS-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000c7'::uuid, '00000000-1111-0000-0000-0000000000c7'::uuid, $$ATS-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000c8'::uuid, $$ATS-016$$, $$ATS-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000c8'::uuid, '00000000-1111-0000-0000-0000000000c8'::uuid, $$ATS-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000c9'::uuid, $$ATS-017$$, $$ATS-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000c9'::uuid, '00000000-1111-0000-0000-0000000000c9'::uuid, $$ATS-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000ca'::uuid, $$ATS-018$$, $$ATS-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000ca'::uuid, '00000000-1111-0000-0000-0000000000ca'::uuid, $$ATS-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000cb'::uuid, $$ATS-019$$, $$ATS-019$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000cb'::uuid, '00000000-1111-0000-0000-0000000000cb'::uuid, $$ATS-019$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000cc'::uuid, $$ATS-020$$, $$ATS-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000cc'::uuid, '00000000-1111-0000-0000-0000000000cc'::uuid, $$ATS-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000cd'::uuid, $$ATS-021$$, $$ATS-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000cd'::uuid, '00000000-1111-0000-0000-0000000000cd'::uuid, $$ATS-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000ce'::uuid, $$ATS-023D$$, $$ATS-023D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000ce'::uuid, '00000000-1111-0000-0000-0000000000ce'::uuid, $$ATS-023D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000cf'::uuid, $$ATS-024$$, $$ATS-024$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000cf'::uuid, '00000000-1111-0000-0000-0000000000cf'::uuid, $$ATS-024$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000d0'::uuid, $$ATS-025$$, $$ATS-025$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000d0'::uuid, '00000000-1111-0000-0000-0000000000d0'::uuid, $$ATS-025$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000d1'::uuid, $$ATS-026$$, $$ATS-026$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000d1'::uuid, '00000000-1111-0000-0000-0000000000d1'::uuid, $$ATS-026$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000d2'::uuid, $$ATS-026ASANOPLATE$$, $$ATS-026 ASANO PLATE$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000d2'::uuid, '00000000-1111-0000-0000-0000000000d2'::uuid, $$ATS-026ASANOPLATE$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000d3'::uuid, $$ATS-026ASANOROD$$, $$ATS-026 ASANO ROD$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000d3'::uuid, '00000000-1111-0000-0000-0000000000d3'::uuid, $$ATS-026ASANOROD$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000d4'::uuid, $$ATS-027$$, $$ATS-027$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000d4'::uuid, '00000000-1111-0000-0000-0000000000d4'::uuid, $$ATS-027$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000d5'::uuid, $$ATS-028D$$, $$ATS-028D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000d5'::uuid, '00000000-1111-0000-0000-0000000000d5'::uuid, $$ATS-028D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000d6'::uuid, '00000000-1111-0000-0000-0000000000d5'::uuid, $$ATS-028D-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000d7'::uuid, $$ATS-028$$, $$ATS-028R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000d7'::uuid, '00000000-1111-0000-0000-0000000000d7'::uuid, $$ATS-028-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000d8'::uuid, $$ATS-029D$$, $$ATS-029D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000d8'::uuid, '00000000-1111-0000-0000-0000000000d8'::uuid, $$ATS-029D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000d9'::uuid, '00000000-1111-0000-0000-0000000000d8'::uuid, $$ATS-029D-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000da'::uuid, $$ATS-029$$, $$ATS-029R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000da'::uuid, '00000000-1111-0000-0000-0000000000da'::uuid, $$ATS-029-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000db'::uuid, $$ATS-030$$, $$ATS-030$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000db'::uuid, '00000000-1111-0000-0000-0000000000db'::uuid, $$ATS-030$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000dc'::uuid, '00000000-1111-0000-0000-0000000000db'::uuid, $$ATS-030-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000de'::uuid, $$ATS-031$$, $$ATS-031$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000de'::uuid, '00000000-1111-0000-0000-0000000000de'::uuid, $$ATS-031$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000df'::uuid, $$ATS-032　PLATE$$, $$ATS-032　PLATE$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000df'::uuid, '00000000-1111-0000-0000-0000000000df'::uuid, $$ATS-032　PLATE$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000e0'::uuid, $$ATS-032$$, $$ATS-032$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000e0'::uuid, '00000000-1111-0000-0000-0000000000e0'::uuid, $$ATS-032$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000e1'::uuid, $$AXN-001$$, $$AXN-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000e1'::uuid, '00000000-1111-0000-0000-0000000000e1'::uuid, $$AXN-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000e2'::uuid, $$AZK-001$$, $$AZK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000e2'::uuid, '00000000-1111-0000-0000-0000000000e2'::uuid, $$AZK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000e3'::uuid, $$AZUMA-IND-4PL$$, $$AZUMA-IND-4PL$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000e3'::uuid, '00000000-1111-0000-0000-0000000000e3'::uuid, $$AZUMA-IND-4PL$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000e4'::uuid, $$BMI-001$$, $$BMI-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000e4'::uuid, '00000000-1111-0000-0000-0000000000e4'::uuid, $$BMI-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000e5'::uuid, $$BMI-002$$, $$BMI-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000e5'::uuid, '00000000-1111-0000-0000-0000000000e5'::uuid, $$BMI-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000e6'::uuid, $$BNS-001$$, $$BNS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000e6'::uuid, '00000000-1111-0000-0000-0000000000e6'::uuid, $$BNS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000e7'::uuid, $$C別抜き$$, $$C 別抜き$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000e7'::uuid, '00000000-1111-0000-0000-0000000000e7'::uuid, $$C別抜き$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000e8'::uuid, $$CBS-001$$, $$CBS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000e8'::uuid, '00000000-1111-0000-0000-0000000000e8'::uuid, $$CBS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000e9'::uuid, $$CEJ-001$$, $$CEJ-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000e9'::uuid, '00000000-1111-0000-0000-0000000000e9'::uuid, $$CEJ-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000ea'::uuid, $$CGI-002$$, $$CGI-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000ea'::uuid, '00000000-1111-0000-0000-0000000000ea'::uuid, $$CGI-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000eb'::uuid, $$CGI-003$$, $$CGI-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000eb'::uuid, '00000000-1111-0000-0000-0000000000eb'::uuid, $$CGI-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000ec'::uuid, $$CGR-002PP$$, $$CGR-002PP$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$PP$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000ec'::uuid, '00000000-1111-0000-0000-0000000000ec'::uuid, $$CGR-002PP$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000ed'::uuid, $$CIPS$$, $$CIPS$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$PS$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000ed'::uuid, '00000000-1111-0000-0000-0000000000ed'::uuid, $$CIPS$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000ee'::uuid, $$CIPS-001$$, $$CIPS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000ee'::uuid, '00000000-1111-0000-0000-0000000000ee'::uuid, $$CIPS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000ef'::uuid, $$CIPS-002$$, $$CIPS-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000ef'::uuid, '00000000-1111-0000-0000-0000000000ef'::uuid, $$CIPS-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000f0'::uuid, $$CIPS-003$$, $$CIPS-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000f0'::uuid, '00000000-1111-0000-0000-0000000000f0'::uuid, $$CIPS-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000f1'::uuid, $$CIPS-005$$, $$CIPS-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000f1'::uuid, '00000000-1111-0000-0000-0000000000f1'::uuid, $$CIPS-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000f2'::uuid, $$CK-004$$, $$CK-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000f2'::uuid, '00000000-1111-0000-0000-0000000000f2'::uuid, $$CK-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000f3'::uuid, $$CK-005$$, $$CK-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000f3'::uuid, '00000000-1111-0000-0000-0000000000f3'::uuid, $$CK-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000f4'::uuid, $$CK-006$$, $$CK-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000f4'::uuid, '00000000-1111-0000-0000-0000000000f4'::uuid, $$CK-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000f5'::uuid, $$CK-008$$, $$CK-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000f5'::uuid, '00000000-1111-0000-0000-0000000000f5'::uuid, $$CK-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000f6'::uuid, $$CK-009$$, $$CK-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000f6'::uuid, '00000000-1111-0000-0000-0000000000f6'::uuid, $$CK-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000f7'::uuid, $$CL-001$$, $$CL-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000f7'::uuid, '00000000-1111-0000-0000-0000000000f7'::uuid, $$CL-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000f8'::uuid, $$CMX1100V$$, $$CMX1100V$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000f8'::uuid, '00000000-1111-0000-0000-0000000000f8'::uuid, $$CMX1100V$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000f9'::uuid, $$CMX800V$$, $$CMX800V$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000f9'::uuid, '00000000-1111-0000-0000-0000000000f9'::uuid, $$CMX800V$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000fa'::uuid, $$COT-001$$, $$COT-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000fa'::uuid, '00000000-1111-0000-0000-0000000000fa'::uuid, $$COT-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000fb'::uuid, $$COT-002$$, $$COT-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000fb'::uuid, '00000000-1111-0000-0000-0000000000fb'::uuid, $$COT-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000fc'::uuid, $$COT-003$$, $$COT-003B$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000fc'::uuid, '00000000-1111-0000-0000-0000000000fc'::uuid, $$COT-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000fe'::uuid, $$COT-004$$, $$COT-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000fe'::uuid, '00000000-1111-0000-0000-0000000000fe'::uuid, $$COT-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000000ff'::uuid, $$CPL$$, $$CPL$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000000ff'::uuid, '00000000-1111-0000-0000-0000000000ff'::uuid, $$CPL$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000100'::uuid, $$CPL-PE$$, $$CPL-PET$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000100'::uuid, '00000000-1111-0000-0000-000000000100'::uuid, $$CPL-PE$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000101'::uuid, $$CPL-サンプル用トレイ$$, $$CPL-サンプル用トレイ$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000101'::uuid, '00000000-1111-0000-0000-000000000101'::uuid, $$CPL-サンプル用トレイ$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000102'::uuid, $$CSFHI-1601$$, $$CSFHI-1601$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000102'::uuid, '00000000-1111-0000-0000-000000000102'::uuid, $$CSFHI-1601$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000103'::uuid, $$CSM-001$$, $$CSM-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000103'::uuid, '00000000-1111-0000-0000-000000000103'::uuid, $$CSM-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000104'::uuid, $$CST-001$$, $$CST-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000104'::uuid, '00000000-1111-0000-0000-000000000104'::uuid, $$CST-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000105'::uuid, $$CST-002$$, $$CST-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000105'::uuid, '00000000-1111-0000-0000-000000000105'::uuid, $$CST-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000106'::uuid, $$CST-003$$, $$CST-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000106'::uuid, '00000000-1111-0000-0000-000000000106'::uuid, $$CST-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000107'::uuid, $$CST-004$$, $$CST-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000107'::uuid, '00000000-1111-0000-0000-000000000107'::uuid, $$CST-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000108'::uuid, $$CST-005$$, $$CST-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000108'::uuid, '00000000-1111-0000-0000-000000000108'::uuid, $$CST-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000109'::uuid, $$CST-007$$, $$CST-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000109'::uuid, '00000000-1111-0000-0000-000000000109'::uuid, $$CST-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000010a'::uuid, $$CST-009$$, $$CST-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000010a'::uuid, '00000000-1111-0000-0000-00000000010a'::uuid, $$CST-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000010b'::uuid, $$CYD-001$$, $$CYD-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000010b'::uuid, '00000000-1111-0000-0000-00000000010b'::uuid, $$CYD-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000010c'::uuid, $$DDB-001$$, $$DDB-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000010c'::uuid, '00000000-1111-0000-0000-00000000010c'::uuid, $$DDB-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000010d'::uuid, $$DDB-002$$, $$DDB-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000010d'::uuid, '00000000-1111-0000-0000-00000000010d'::uuid, $$DDB-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000010e'::uuid, $$DDB-003$$, $$DDB-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000010e'::uuid, '00000000-1111-0000-0000-00000000010e'::uuid, $$DDB-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000010f'::uuid, $$DDB-004$$, $$DDB-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000010f'::uuid, '00000000-1111-0000-0000-00000000010f'::uuid, $$DDB-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000110'::uuid, $$DHA-001$$, $$DHA-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000110'::uuid, '00000000-1111-0000-0000-000000000110'::uuid, $$DHA-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000111'::uuid, $$DHA-002$$, $$DHA-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000111'::uuid, '00000000-1111-0000-0000-000000000111'::uuid, $$DHA-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000113'::uuid, $$DHA-003$$, $$DHA-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000113'::uuid, '00000000-1111-0000-0000-000000000113'::uuid, $$DHA-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000114'::uuid, $$DIC$$, $$DIC$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000114'::uuid, '00000000-1111-0000-0000-000000000114'::uuid, $$DIC$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000115'::uuid, $$DIC-001$$, $$DIC-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000115'::uuid, '00000000-1111-0000-0000-000000000115'::uuid, $$DIC-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000116'::uuid, $$DIC-003$$, $$DIC-003B$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000116'::uuid, '00000000-1111-0000-0000-000000000116'::uuid, $$DIC-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000118'::uuid, $$DIC-005$$, $$DIC-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000118'::uuid, '00000000-1111-0000-0000-000000000118'::uuid, $$DIC-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000119'::uuid, $$DIC-007$$, $$DIC-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000119'::uuid, '00000000-1111-0000-0000-000000000119'::uuid, $$DIC-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000011a'::uuid, $$DIC-008$$, $$DIC-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000011a'::uuid, '00000000-1111-0000-0000-00000000011a'::uuid, $$DIC-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000011b'::uuid, $$DIC-009$$, $$DIC-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000011b'::uuid, '00000000-1111-0000-0000-00000000011b'::uuid, $$DIC-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000011d'::uuid, $$DIC-010$$, $$DIC-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000011d'::uuid, '00000000-1111-0000-0000-00000000011d'::uuid, $$DIC-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000011e'::uuid, $$DIC-011$$, $$DIC-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000011e'::uuid, '00000000-1111-0000-0000-00000000011e'::uuid, $$DIC-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000011f'::uuid, $$DIC-012$$, $$DIC-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000011f'::uuid, '00000000-1111-0000-0000-00000000011f'::uuid, $$DIC-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000120'::uuid, $$DIC-015$$, $$DIC-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000120'::uuid, '00000000-1111-0000-0000-000000000120'::uuid, $$DIC-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000121'::uuid, $$DIC-016$$, $$DIC-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000121'::uuid, '00000000-1111-0000-0000-000000000121'::uuid, $$DIC-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000122'::uuid, $$DIC-019$$, $$DIC-019$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000122'::uuid, '00000000-1111-0000-0000-000000000122'::uuid, $$DIC-019$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000123'::uuid, $$DIC-022PLUG$$, $$DIC-022PLUG$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000123'::uuid, '00000000-1111-0000-0000-000000000123'::uuid, $$DIC-022PLUG$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000124'::uuid, $$DIC-023$$, $$DIC-023$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000124'::uuid, '00000000-1111-0000-0000-000000000124'::uuid, $$DIC-023$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000125'::uuid, $$DIC-024$$, $$DIC-024$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000125'::uuid, '00000000-1111-0000-0000-000000000125'::uuid, $$DIC-024$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000126'::uuid, $$DIC-028$$, $$DIC-028$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000126'::uuid, '00000000-1111-0000-0000-000000000126'::uuid, $$DIC-028$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000127'::uuid, $$DIC-030$$, $$DIC-030$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000127'::uuid, '00000000-1111-0000-0000-000000000127'::uuid, $$DIC-030$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000128'::uuid, $$DIC-031$$, $$DIC-031$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000128'::uuid, '00000000-1111-0000-0000-000000000128'::uuid, $$DIC-031$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000129'::uuid, $$DIC-033$$, $$DIC-033$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000129'::uuid, '00000000-1111-0000-0000-000000000129'::uuid, $$DIC-033$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000012a'::uuid, $$DIC-036$$, $$DIC-036$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000012a'::uuid, '00000000-1111-0000-0000-00000000012a'::uuid, $$DIC-036$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000012b'::uuid, $$DIC-037$$, $$DIC-037 No1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000012b'::uuid, '00000000-1111-0000-0000-00000000012b'::uuid, $$DIC-037$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000012c'::uuid, $$DIC-040$$, $$DIC-040$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000012c'::uuid, '00000000-1111-0000-0000-00000000012c'::uuid, $$DIC-040$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000012d'::uuid, $$DIC-041$$, $$DIC-041$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000012d'::uuid, '00000000-1111-0000-0000-00000000012d'::uuid, $$DIC-041$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000012e'::uuid, $$DIC-042$$, $$DIC-042$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000012e'::uuid, '00000000-1111-0000-0000-00000000012e'::uuid, $$DIC-042$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000012f'::uuid, $$DIC-043$$, $$DIC-043$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000012f'::uuid, '00000000-1111-0000-0000-00000000012f'::uuid, $$DIC-043$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000130'::uuid, $$DIC-044$$, $$DIC-044$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000130'::uuid, '00000000-1111-0000-0000-000000000130'::uuid, $$DIC-044$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000131'::uuid, $$DIC-045$$, $$DIC-045$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000131'::uuid, '00000000-1111-0000-0000-000000000131'::uuid, $$DIC-045$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000132'::uuid, $$DIC-046$$, $$DIC-046$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000132'::uuid, '00000000-1111-0000-0000-000000000132'::uuid, $$DIC-046$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000133'::uuid, $$DIC-047$$, $$DIC-047$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000133'::uuid, '00000000-1111-0000-0000-000000000133'::uuid, $$DIC-047$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000134'::uuid, $$DIC-048$$, $$DIC-048$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000134'::uuid, '00000000-1111-0000-0000-000000000134'::uuid, $$DIC-048$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000135'::uuid, $$DIC-049$$, $$DIC-049$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000135'::uuid, '00000000-1111-0000-0000-000000000135'::uuid, $$DIC-049$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000136'::uuid, $$DIC-050$$, $$DIC-050$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000136'::uuid, '00000000-1111-0000-0000-000000000136'::uuid, $$DIC-050$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000137'::uuid, $$DIC-051$$, $$DIC-051$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000137'::uuid, '00000000-1111-0000-0000-000000000137'::uuid, $$DIC-051$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000138'::uuid, $$DIC-052$$, $$DIC-052$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000138'::uuid, '00000000-1111-0000-0000-000000000138'::uuid, $$DIC-052$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000139'::uuid, $$DIC-053$$, $$DIC-053$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000139'::uuid, '00000000-1111-0000-0000-000000000139'::uuid, $$DIC-053$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000013a'::uuid, $$DIC-054$$, $$DIC-054$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000013a'::uuid, '00000000-1111-0000-0000-00000000013a'::uuid, $$DIC-054$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000013b'::uuid, $$DIC-055$$, $$DIC-055$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000013b'::uuid, '00000000-1111-0000-0000-00000000013b'::uuid, $$DIC-055$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000013c'::uuid, $$DIC-056$$, $$DIC-056$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000013c'::uuid, '00000000-1111-0000-0000-00000000013c'::uuid, $$DIC-056$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000013d'::uuid, $$DIC-057$$, $$DIC-057$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000013d'::uuid, '00000000-1111-0000-0000-00000000013d'::uuid, $$DIC-057$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000013e'::uuid, $$DIC-058$$, $$DIC-058$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000013e'::uuid, '00000000-1111-0000-0000-00000000013e'::uuid, $$DIC-058$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000013f'::uuid, $$DIC-059$$, $$DIC-059$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000013f'::uuid, '00000000-1111-0000-0000-00000000013f'::uuid, $$DIC-059$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000140'::uuid, $$DIC-060$$, $$DIC-060$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000140'::uuid, '00000000-1111-0000-0000-000000000140'::uuid, $$DIC-060$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000141'::uuid, $$DIC-061$$, $$DIC-061$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000141'::uuid, '00000000-1111-0000-0000-000000000141'::uuid, $$DIC-061$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000142'::uuid, $$DIC-062$$, $$DIC-062$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000142'::uuid, '00000000-1111-0000-0000-000000000142'::uuid, $$DIC-062$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000143'::uuid, $$DIC-063$$, $$DIC-063$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000143'::uuid, '00000000-1111-0000-0000-000000000143'::uuid, $$DIC-063$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000144'::uuid, $$DIC-064$$, $$DIC-064$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000144'::uuid, '00000000-1111-0000-0000-000000000144'::uuid, $$DIC-064$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000145'::uuid, $$DIC-066$$, $$DIC-066$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000145'::uuid, '00000000-1111-0000-0000-000000000145'::uuid, $$DIC-066$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000146'::uuid, $$DIC-067$$, $$DIC-067$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000146'::uuid, '00000000-1111-0000-0000-000000000146'::uuid, $$DIC-067$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000147'::uuid, $$DIC-068$$, $$DIC-068$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000147'::uuid, '00000000-1111-0000-0000-000000000147'::uuid, $$DIC-068$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000148'::uuid, $$DIC-074$$, $$DIC-074R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000148'::uuid, '00000000-1111-0000-0000-000000000148'::uuid, $$DIC-074-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000149'::uuid, $$DIC-075$$, $$DIC-075R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000149'::uuid, '00000000-1111-0000-0000-000000000149'::uuid, $$DIC-075-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000014a'::uuid, $$DIC-076$$, $$DIC-076$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000014a'::uuid, '00000000-1111-0000-0000-00000000014a'::uuid, $$DIC-076$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000014b'::uuid, $$DIC-077$$, $$DIC-077$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000014b'::uuid, '00000000-1111-0000-0000-00000000014b'::uuid, $$DIC-077$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000014c'::uuid, $$DIC-078$$, $$DIC-078$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000014c'::uuid, '00000000-1111-0000-0000-00000000014c'::uuid, $$DIC-078$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000014d'::uuid, $$DIC-083$$, $$DIC-083$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000014d'::uuid, '00000000-1111-0000-0000-00000000014d'::uuid, $$DIC-083$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000014e'::uuid, $$DIC-084$$, $$DIC-084$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000014e'::uuid, '00000000-1111-0000-0000-00000000014e'::uuid, $$DIC-084$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000014f'::uuid, $$DIC-085$$, $$DIC-085$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000014f'::uuid, '00000000-1111-0000-0000-00000000014f'::uuid, $$DIC-085$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000150'::uuid, $$DIC-086$$, $$DIC-086$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000150'::uuid, '00000000-1111-0000-0000-000000000150'::uuid, $$DIC-086$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000151'::uuid, $$DIC-087$$, $$DIC-087$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000151'::uuid, '00000000-1111-0000-0000-000000000151'::uuid, $$DIC-087$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000152'::uuid, $$DIC-088$$, $$DIC-088$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000152'::uuid, '00000000-1111-0000-0000-000000000152'::uuid, $$DIC-088$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000153'::uuid, $$DIC-090$$, $$DIC-090$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000153'::uuid, '00000000-1111-0000-0000-000000000153'::uuid, $$DIC-090$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000154'::uuid, $$DIC-091?$$, $$DIC-091?$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000154'::uuid, '00000000-1111-0000-0000-000000000154'::uuid, $$DIC-091?$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000155'::uuid, $$DIC-092$$, $$DIC-092$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000155'::uuid, '00000000-1111-0000-0000-000000000155'::uuid, $$DIC-092$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000156'::uuid, $$DIC-093$$, $$DIC-093$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000156'::uuid, '00000000-1111-0000-0000-000000000156'::uuid, $$DIC-093$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000157'::uuid, $$DIC-094$$, $$DIC-094$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000157'::uuid, '00000000-1111-0000-0000-000000000157'::uuid, $$DIC-094$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000158'::uuid, $$DIC-095$$, $$DIC-095$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000158'::uuid, '00000000-1111-0000-0000-000000000158'::uuid, $$DIC-095$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000159'::uuid, $$DIC-096$$, $$DIC-096$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000159'::uuid, '00000000-1111-0000-0000-000000000159'::uuid, $$DIC-096$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000015a'::uuid, $$DIC-097$$, $$DIC-097$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000015a'::uuid, '00000000-1111-0000-0000-00000000015a'::uuid, $$DIC-097$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000015b'::uuid, '00000000-1111-0000-0000-00000000015a'::uuid, $$DIC-097-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000015c'::uuid, $$DIC-098$$, $$DIC-098$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000015c'::uuid, '00000000-1111-0000-0000-00000000015c'::uuid, $$DIC-098$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000015d'::uuid, $$DIC-099$$, $$DIC-099$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000015d'::uuid, '00000000-1111-0000-0000-00000000015d'::uuid, $$DIC-099$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000015e'::uuid, $$DIC-100$$, $$DIC-100$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000015e'::uuid, '00000000-1111-0000-0000-00000000015e'::uuid, $$DIC-100$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000015f'::uuid, $$DIC-101$$, $$DIC-101$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000015f'::uuid, '00000000-1111-0000-0000-00000000015f'::uuid, $$DIC-101$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000160'::uuid, $$DIC-102$$, $$DIC-102$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000160'::uuid, '00000000-1111-0000-0000-000000000160'::uuid, $$DIC-102$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000161'::uuid, $$DIC-105$$, $$DIC-105$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000161'::uuid, '00000000-1111-0000-0000-000000000161'::uuid, $$DIC-105$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000162'::uuid, $$DIC-106$$, $$DIC-106$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000162'::uuid, '00000000-1111-0000-0000-000000000162'::uuid, $$DIC-106$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000163'::uuid, $$DIC-107$$, $$DIC-107$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000163'::uuid, '00000000-1111-0000-0000-000000000163'::uuid, $$DIC-107$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000164'::uuid, $$DIC-108$$, $$DIC-108$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000164'::uuid, '00000000-1111-0000-0000-000000000164'::uuid, $$DIC-108$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000165'::uuid, $$DIC-110$$, $$DIC-110$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000165'::uuid, '00000000-1111-0000-0000-000000000165'::uuid, $$DIC-110$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000166'::uuid, $$DIC-111$$, $$DIC-111$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000166'::uuid, '00000000-1111-0000-0000-000000000166'::uuid, $$DIC-111$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000167'::uuid, $$DIC-112$$, $$DIC-112$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000167'::uuid, '00000000-1111-0000-0000-000000000167'::uuid, $$DIC-112$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000168'::uuid, $$DIC-113$$, $$DIC-113$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000168'::uuid, '00000000-1111-0000-0000-000000000168'::uuid, $$DIC-113$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000169'::uuid, $$DIC-114$$, $$DIC-114$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000169'::uuid, '00000000-1111-0000-0000-000000000169'::uuid, $$DIC-114$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000016a'::uuid, $$DIC-115$$, $$DIC-115$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000016a'::uuid, '00000000-1111-0000-0000-00000000016a'::uuid, $$DIC-115$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000016b'::uuid, $$DIC-116$$, $$DIC-116$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000016b'::uuid, '00000000-1111-0000-0000-00000000016b'::uuid, $$DIC-116$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000016c'::uuid, $$DIC-117$$, $$DIC-117$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000016c'::uuid, '00000000-1111-0000-0000-00000000016c'::uuid, $$DIC-117$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000016d'::uuid, $$DIC-118$$, $$DIC-118$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000016d'::uuid, '00000000-1111-0000-0000-00000000016d'::uuid, $$DIC-118$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000016e'::uuid, $$DIC-119$$, $$DIC-119$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000016e'::uuid, '00000000-1111-0000-0000-00000000016e'::uuid, $$DIC-119$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000016f'::uuid, $$DIC-120$$, $$DIC-120$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000016f'::uuid, '00000000-1111-0000-0000-00000000016f'::uuid, $$DIC-120$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000170'::uuid, $$DIC-121$$, $$DIC-121$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000170'::uuid, '00000000-1111-0000-0000-000000000170'::uuid, $$DIC-121$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000171'::uuid, $$DIC-122$$, $$DIC-122$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000171'::uuid, '00000000-1111-0000-0000-000000000171'::uuid, $$DIC-122$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000172'::uuid, $$DIC-125$$, $$DIC-125$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000172'::uuid, '00000000-1111-0000-0000-000000000172'::uuid, $$DIC-125$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000173'::uuid, $$DIC-126$$, $$DIC-126$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000173'::uuid, '00000000-1111-0000-0000-000000000173'::uuid, $$DIC-126$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000174'::uuid, $$DIC-127$$, $$DIC-127$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000174'::uuid, '00000000-1111-0000-0000-000000000174'::uuid, $$DIC-127$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000175'::uuid, $$DIC-129$$, $$DIC-129$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000175'::uuid, '00000000-1111-0000-0000-000000000175'::uuid, $$DIC-129$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000176'::uuid, $$DIC-130$$, $$DIC-130$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000176'::uuid, '00000000-1111-0000-0000-000000000176'::uuid, $$DIC-130$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000177'::uuid, $$DIC-131$$, $$DIC-131$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000177'::uuid, '00000000-1111-0000-0000-000000000177'::uuid, $$DIC-131$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000178'::uuid, $$DIC-132$$, $$DIC-132$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000178'::uuid, '00000000-1111-0000-0000-000000000178'::uuid, $$DIC-132$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000179'::uuid, $$DIC-133$$, $$DIC-133$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000179'::uuid, '00000000-1111-0000-0000-000000000179'::uuid, $$DIC-133$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000017a'::uuid, $$DIC-134$$, $$DIC-134$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000017a'::uuid, '00000000-1111-0000-0000-00000000017a'::uuid, $$DIC-134$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000017b'::uuid, $$DIC-135$$, $$DIC-135$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000017b'::uuid, '00000000-1111-0000-0000-00000000017b'::uuid, $$DIC-135$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000017c'::uuid, $$DIC-136$$, $$DIC-136$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000017c'::uuid, '00000000-1111-0000-0000-00000000017c'::uuid, $$DIC-136$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000017d'::uuid, $$DIC-137$$, $$DIC-137$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000017d'::uuid, '00000000-1111-0000-0000-00000000017d'::uuid, $$DIC-137$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000017e'::uuid, $$DIC-138$$, $$DIC-138$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000017e'::uuid, '00000000-1111-0000-0000-00000000017e'::uuid, $$DIC-138$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000017f'::uuid, $$DIC-139$$, $$DIC-139$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000017f'::uuid, '00000000-1111-0000-0000-00000000017f'::uuid, $$DIC-139$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000180'::uuid, $$DIC-140$$, $$DIC-140$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000180'::uuid, '00000000-1111-0000-0000-000000000180'::uuid, $$DIC-140$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000181'::uuid, $$DIC-141$$, $$DIC-141$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000181'::uuid, '00000000-1111-0000-0000-000000000181'::uuid, $$DIC-141$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000182'::uuid, $$DIC-142$$, $$DIC-142$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000182'::uuid, '00000000-1111-0000-0000-000000000182'::uuid, $$DIC-142$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000184'::uuid, $$DIC-143$$, $$DIC-143 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000184'::uuid, '00000000-1111-0000-0000-000000000184'::uuid, $$DIC-143-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000185'::uuid, $$DIC-144$$, $$DIC-144$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000185'::uuid, '00000000-1111-0000-0000-000000000185'::uuid, $$DIC-144$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000186'::uuid, $$DIC-145$$, $$DIC-145$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000186'::uuid, '00000000-1111-0000-0000-000000000186'::uuid, $$DIC-145$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000188'::uuid, $$DIC-146$$, $$DIC-146 R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000188'::uuid, '00000000-1111-0000-0000-000000000188'::uuid, $$DIC-146-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000189'::uuid, $$DIC-146D$$, $$DIC-146D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000189'::uuid, '00000000-1111-0000-0000-000000000189'::uuid, $$DIC-146D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000018a'::uuid, $$DIC-147$$, $$DIC-147$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000018a'::uuid, '00000000-1111-0000-0000-00000000018a'::uuid, $$DIC-147$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000018b'::uuid, $$DIC-147D$$, $$DIC-147D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000018b'::uuid, '00000000-1111-0000-0000-00000000018b'::uuid, $$DIC-147D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000018c'::uuid, '00000000-1111-0000-0000-00000000018a'::uuid, $$DIC-147-R4$$, 4, $$R4$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000018d'::uuid, $$DIC-148$$, $$DIC-148$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000018d'::uuid, '00000000-1111-0000-0000-00000000018d'::uuid, $$DIC-148$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000018e'::uuid, $$DIC-151$$, $$DIC-151$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000018e'::uuid, '00000000-1111-0000-0000-00000000018e'::uuid, $$DIC-151$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000018f'::uuid, $$DIM-001$$, $$DIM-001R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000018f'::uuid, '00000000-1111-0000-0000-00000000018f'::uuid, $$DIM-001-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000190'::uuid, $$DIM-002$$, $$DIM-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000190'::uuid, '00000000-1111-0000-0000-000000000190'::uuid, $$DIM-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000191'::uuid, $$DIM-004$$, $$DIM-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000191'::uuid, '00000000-1111-0000-0000-000000000191'::uuid, $$DIM-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000192'::uuid, $$DIM-005$$, $$DIM-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000192'::uuid, '00000000-1111-0000-0000-000000000192'::uuid, $$DIM-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000193'::uuid, $$DIM-006$$, $$DIM-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000193'::uuid, '00000000-1111-0000-0000-000000000193'::uuid, $$DIM-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000194'::uuid, $$DIM-007$$, $$DIM-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000194'::uuid, '00000000-1111-0000-0000-000000000194'::uuid, $$DIM-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000195'::uuid, $$DIM-008$$, $$DIM-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000195'::uuid, '00000000-1111-0000-0000-000000000195'::uuid, $$DIM-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000196'::uuid, $$DIM-009$$, $$DIM-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000196'::uuid, '00000000-1111-0000-0000-000000000196'::uuid, $$DIM-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000197'::uuid, $$DIM-010$$, $$DIM-010 R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000197'::uuid, '00000000-1111-0000-0000-000000000197'::uuid, $$DIM-010-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000199'::uuid, $$DIM-011$$, $$DIM-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000199'::uuid, '00000000-1111-0000-0000-000000000199'::uuid, $$DIM-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000019a'::uuid, $$DIM-012$$, $$DIM-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000019a'::uuid, '00000000-1111-0000-0000-00000000019a'::uuid, $$DIM-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000019b'::uuid, $$DIM-013$$, $$DIM-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000019b'::uuid, '00000000-1111-0000-0000-00000000019b'::uuid, $$DIM-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000019c'::uuid, $$DIM-014$$, $$DIM-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000019c'::uuid, '00000000-1111-0000-0000-00000000019c'::uuid, $$DIM-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000019d'::uuid, $$DIM-015$$, $$DIM-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000019d'::uuid, '00000000-1111-0000-0000-00000000019d'::uuid, $$DIM-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000019e'::uuid, $$DIM-016$$, $$DIM-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000019e'::uuid, '00000000-1111-0000-0000-00000000019e'::uuid, $$DIM-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000019f'::uuid, $$DIM-017$$, $$DIM-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000019f'::uuid, '00000000-1111-0000-0000-00000000019f'::uuid, $$DIM-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001a0'::uuid, $$DIM-018$$, $$DIM-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001a0'::uuid, '00000000-1111-0000-0000-0000000001a0'::uuid, $$DIM-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001a1'::uuid, $$DIM-019$$, $$DIM-019 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001a1'::uuid, '00000000-1111-0000-0000-0000000001a1'::uuid, $$DIM-019-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001a2'::uuid, $$DIN-001$$, $$DIN-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001a2'::uuid, '00000000-1111-0000-0000-0000000001a2'::uuid, $$DIN-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001a3'::uuid, $$DIN-010$$, $$DIN-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001a3'::uuid, '00000000-1111-0000-0000-0000000001a3'::uuid, $$DIN-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001a4'::uuid, $$DIS-001$$, $$DIS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001a4'::uuid, '00000000-1111-0000-0000-0000000001a4'::uuid, $$DIS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001a5'::uuid, $$DK-030$$, $$DK-030$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001a5'::uuid, '00000000-1111-0000-0000-0000000001a5'::uuid, $$DK-030$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001a6'::uuid, $$DK-031$$, $$DK-031$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001a6'::uuid, '00000000-1111-0000-0000-0000000001a6'::uuid, $$DK-031$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001a7'::uuid, $$DK-120$$, $$DK-120$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001a7'::uuid, '00000000-1111-0000-0000-0000000001a7'::uuid, $$DK-120$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001a8'::uuid, $$DK-121$$, $$DK-121$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001a8'::uuid, '00000000-1111-0000-0000-0000000001a8'::uuid, $$DK-121$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001a9'::uuid, $$DK-129$$, $$DK-129$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001a9'::uuid, '00000000-1111-0000-0000-0000000001a9'::uuid, $$DK-129$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001aa'::uuid, $$DK-136$$, $$DK-136$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001aa'::uuid, '00000000-1111-0000-0000-0000000001aa'::uuid, $$DK-136$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001ab'::uuid, $$DK-139$$, $$DK-139$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001ab'::uuid, '00000000-1111-0000-0000-0000000001ab'::uuid, $$DK-139$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001ac'::uuid, $$DK-144$$, $$DK-144$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001ac'::uuid, '00000000-1111-0000-0000-0000000001ac'::uuid, $$DK-144$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001ad'::uuid, $$DNS-001$$, $$DNS-001B$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001ad'::uuid, '00000000-1111-0000-0000-0000000001ad'::uuid, $$DNS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001af'::uuid, $$DNS-011$$, $$DNS-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001af'::uuid, '00000000-1111-0000-0000-0000000001af'::uuid, $$DNS-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001b0'::uuid, $$DuraVertical5080$$, $$DuraVertical 5080$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001b0'::uuid, '00000000-1111-0000-0000-0000000001b0'::uuid, $$DuraVertical5080$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001b1'::uuid, $$EDK-004$$, $$EDK-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001b1'::uuid, '00000000-1111-0000-0000-0000000001b1'::uuid, $$EDK-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001b2'::uuid, $$EK-001$$, $$EK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001b2'::uuid, '00000000-1111-0000-0000-0000000001b2'::uuid, $$EK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001b3'::uuid, $$EK-002$$, $$EK-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001b3'::uuid, '00000000-1111-0000-0000-0000000001b3'::uuid, $$EK-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001b4'::uuid, $$ELI-001$$, $$ELI-001 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001b4'::uuid, '00000000-1111-0000-0000-0000000001b4'::uuid, $$ELI-001-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001b5'::uuid, $$ELP-009$$, $$ELP-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001b5'::uuid, '00000000-1111-0000-0000-0000000001b5'::uuid, $$ELP-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001b6'::uuid, $$ELP-200$$, $$ELP-200$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001b6'::uuid, '00000000-1111-0000-0000-0000000001b6'::uuid, $$ELP-200$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001b7'::uuid, $$ELS-001$$, $$ELS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001b7'::uuid, '00000000-1111-0000-0000-0000000001b7'::uuid, $$ELS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001b8'::uuid, $$EMI-001$$, $$EMI-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001b8'::uuid, '00000000-1111-0000-0000-0000000001b8'::uuid, $$EMI-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001b9'::uuid, $$ENT-001$$, $$ENT-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001b9'::uuid, '00000000-1111-0000-0000-0000000001b9'::uuid, $$ENT-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001ba'::uuid, $$ENT-002$$, $$ENT-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001ba'::uuid, '00000000-1111-0000-0000-0000000001ba'::uuid, $$ENT-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001bb'::uuid, $$ESJ-002D$$, $$ESJ-002D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001bb'::uuid, '00000000-1111-0000-0000-0000000001bb'::uuid, $$ESJ-002D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001bc'::uuid, $$ESJ-003D$$, $$ESJ-003D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001bc'::uuid, '00000000-1111-0000-0000-0000000001bc'::uuid, $$ESJ-003D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001bd'::uuid, $$ETS-001$$, $$ETS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001bd'::uuid, '00000000-1111-0000-0000-0000000001bd'::uuid, $$ETS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001be'::uuid, $$ETS-002$$, $$ETS-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001be'::uuid, '00000000-1111-0000-0000-0000000001be'::uuid, $$ETS-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001bf'::uuid, $$ETS-003$$, $$ETS-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001bf'::uuid, '00000000-1111-0000-0000-0000000001bf'::uuid, $$ETS-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001c0'::uuid, $$ETS-004$$, $$ETS-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001c0'::uuid, '00000000-1111-0000-0000-0000000001c0'::uuid, $$ETS-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001c1'::uuid, $$ETS-005$$, $$ETS-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001c1'::uuid, '00000000-1111-0000-0000-0000000001c1'::uuid, $$ETS-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001c2'::uuid, $$ETS-006$$, $$ETS-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001c2'::uuid, '00000000-1111-0000-0000-0000000001c2'::uuid, $$ETS-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001c3'::uuid, $$ETS-007$$, $$ETS-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001c3'::uuid, '00000000-1111-0000-0000-0000000001c3'::uuid, $$ETS-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001c4'::uuid, $$ETS-008$$, $$ETS-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001c4'::uuid, '00000000-1111-0000-0000-0000000001c4'::uuid, $$ETS-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001c5'::uuid, $$ETS-009$$, $$ETS-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001c5'::uuid, '00000000-1111-0000-0000-0000000001c5'::uuid, $$ETS-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001c6'::uuid, $$ETS-011$$, $$ETS-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001c6'::uuid, '00000000-1111-0000-0000-0000000001c6'::uuid, $$ETS-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001c7'::uuid, $$ETS-012$$, $$ETS-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001c7'::uuid, '00000000-1111-0000-0000-0000000001c7'::uuid, $$ETS-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001c8'::uuid, $$ETS-013$$, $$ETS-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001c8'::uuid, '00000000-1111-0000-0000-0000000001c8'::uuid, $$ETS-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001c9'::uuid, $$ETS-014$$, $$ETS-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001c9'::uuid, '00000000-1111-0000-0000-0000000001c9'::uuid, $$ETS-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001ca'::uuid, $$ETS-015$$, $$ETS-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001ca'::uuid, '00000000-1111-0000-0000-0000000001ca'::uuid, $$ETS-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001cb'::uuid, $$ETS-016$$, $$ETS-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001cb'::uuid, '00000000-1111-0000-0000-0000000001cb'::uuid, $$ETS-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001cc'::uuid, $$ETS-017$$, $$ETS-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001cc'::uuid, '00000000-1111-0000-0000-0000000001cc'::uuid, $$ETS-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001cd'::uuid, $$ETS-018$$, $$ETS-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001cd'::uuid, '00000000-1111-0000-0000-0000000001cd'::uuid, $$ETS-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001ce'::uuid, $$ETS-019$$, $$ETS-019$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001ce'::uuid, '00000000-1111-0000-0000-0000000001ce'::uuid, $$ETS-019$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001cf'::uuid, $$ETS-020$$, $$ETS-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001cf'::uuid, '00000000-1111-0000-0000-0000000001cf'::uuid, $$ETS-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001d0'::uuid, $$ETS-021$$, $$ETS-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001d0'::uuid, '00000000-1111-0000-0000-0000000001d0'::uuid, $$ETS-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001d1'::uuid, $$ETS-022$$, $$ETS-022$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001d1'::uuid, '00000000-1111-0000-0000-0000000001d1'::uuid, $$ETS-022$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001d2'::uuid, $$ETS-024$$, $$ETS-024$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001d2'::uuid, '00000000-1111-0000-0000-0000000001d2'::uuid, $$ETS-024$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001d3'::uuid, $$ETS-025$$, $$ETS-025$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001d3'::uuid, '00000000-1111-0000-0000-0000000001d3'::uuid, $$ETS-025$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001d4'::uuid, $$ETS-026$$, $$ETS-026$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001d4'::uuid, '00000000-1111-0000-0000-0000000001d4'::uuid, $$ETS-026$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001d5'::uuid, $$ETS-027$$, $$ETS-027$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001d5'::uuid, '00000000-1111-0000-0000-0000000001d5'::uuid, $$ETS-027$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001d6'::uuid, $$ETS-028$$, $$ETS-028$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001d6'::uuid, '00000000-1111-0000-0000-0000000001d6'::uuid, $$ETS-028$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001d7'::uuid, $$ETS-029$$, $$ETS-029$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001d7'::uuid, '00000000-1111-0000-0000-0000000001d7'::uuid, $$ETS-029$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001d8'::uuid, $$ETS-030$$, $$ETS-030$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001d8'::uuid, '00000000-1111-0000-0000-0000000001d8'::uuid, $$ETS-030$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001d9'::uuid, $$ETS-031$$, $$ETS-031$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001d9'::uuid, '00000000-1111-0000-0000-0000000001d9'::uuid, $$ETS-031$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001da'::uuid, $$ETS-032$$, $$ETS-032$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001da'::uuid, '00000000-1111-0000-0000-0000000001da'::uuid, $$ETS-032$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001db'::uuid, $$ETS-033$$, $$ETS-033$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001db'::uuid, '00000000-1111-0000-0000-0000000001db'::uuid, $$ETS-033$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001dc'::uuid, $$ETS-034$$, $$ETS-034$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001dc'::uuid, '00000000-1111-0000-0000-0000000001dc'::uuid, $$ETS-034$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001dd'::uuid, $$ETS-035$$, $$ETS-035$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001dd'::uuid, '00000000-1111-0000-0000-0000000001dd'::uuid, $$ETS-035$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001de'::uuid, $$ETS-036$$, $$ETS-036$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001de'::uuid, '00000000-1111-0000-0000-0000000001de'::uuid, $$ETS-036$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001df'::uuid, $$EXD$$, $$EXD$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001df'::uuid, '00000000-1111-0000-0000-0000000001df'::uuid, $$EXD$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001e0'::uuid, $$EXD-003$$, $$EXD-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001e0'::uuid, '00000000-1111-0000-0000-0000000001e0'::uuid, $$EXD-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001e1'::uuid, $$EXD-006$$, $$EXD-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001e1'::uuid, '00000000-1111-0000-0000-0000000001e1'::uuid, $$EXD-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001e2'::uuid, $$EXD-008$$, $$EXD-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001e2'::uuid, '00000000-1111-0000-0000-0000000001e2'::uuid, $$EXD-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001e3'::uuid, $$EXD-009$$, $$EXD-009R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001e3'::uuid, '00000000-1111-0000-0000-0000000001e3'::uuid, $$EXD-009-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001e4'::uuid, $$EXD-012$$, $$EXD-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001e4'::uuid, '00000000-1111-0000-0000-0000000001e4'::uuid, $$EXD-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001e5'::uuid, $$EXD-013$$, $$EXD-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001e5'::uuid, '00000000-1111-0000-0000-0000000001e5'::uuid, $$EXD-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001e6'::uuid, $$EXD-014$$, $$EXD-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001e6'::uuid, '00000000-1111-0000-0000-0000000001e6'::uuid, $$EXD-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001e7'::uuid, $$EXD-017$$, $$EXD-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001e7'::uuid, '00000000-1111-0000-0000-0000000001e7'::uuid, $$EXD-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001e8'::uuid, $$EXD-018$$, $$EXD-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001e8'::uuid, '00000000-1111-0000-0000-0000000001e8'::uuid, $$EXD-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001ea'::uuid, $$EXD-020$$, $$EXD-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001ea'::uuid, '00000000-1111-0000-0000-0000000001ea'::uuid, $$EXD-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001eb'::uuid, $$EXD-025$$, $$EXD-025$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001eb'::uuid, '00000000-1111-0000-0000-0000000001eb'::uuid, $$EXD-025$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001ec'::uuid, $$EXD-026$$, $$EXD-026$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001ec'::uuid, '00000000-1111-0000-0000-0000000001ec'::uuid, $$EXD-026$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001ed'::uuid, $$EXD-027$$, $$EXD-027$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001ed'::uuid, '00000000-1111-0000-0000-0000000001ed'::uuid, $$EXD-027$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001ee'::uuid, $$EXD-028$$, $$EXD-028$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001ee'::uuid, '00000000-1111-0000-0000-0000000001ee'::uuid, $$EXD-028$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001ef'::uuid, $$EXD-029$$, $$EXD-029R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001ef'::uuid, '00000000-1111-0000-0000-0000000001ef'::uuid, $$EXD-029-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001f0'::uuid, $$EXD-030$$, $$EXD-030$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001f0'::uuid, '00000000-1111-0000-0000-0000000001f0'::uuid, $$EXD-030$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001f1'::uuid, $$EXD-031$$, $$EXD-031$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001f1'::uuid, '00000000-1111-0000-0000-0000000001f1'::uuid, $$EXD-031$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001f2'::uuid, $$EXD-032$$, $$EXD-032$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001f2'::uuid, '00000000-1111-0000-0000-0000000001f2'::uuid, $$EXD-032$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001f3'::uuid, $$EXD-034$$, $$EXD-034$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001f3'::uuid, '00000000-1111-0000-0000-0000000001f3'::uuid, $$EXD-034$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001f4'::uuid, $$EXD-035$$, $$EXD-035$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001f4'::uuid, '00000000-1111-0000-0000-0000000001f4'::uuid, $$EXD-035$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001f5'::uuid, $$EXD-036$$, $$EXD-036$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001f5'::uuid, '00000000-1111-0000-0000-0000000001f5'::uuid, $$EXD-036$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001f6'::uuid, $$EXD-037$$, $$EXD-037$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001f6'::uuid, '00000000-1111-0000-0000-0000000001f6'::uuid, $$EXD-037$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001f7'::uuid, $$EXD-038$$, $$EXD-038$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001f7'::uuid, '00000000-1111-0000-0000-0000000001f7'::uuid, $$EXD-038$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001f8'::uuid, $$EXD-040$$, $$EXD-040$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001f8'::uuid, '00000000-1111-0000-0000-0000000001f8'::uuid, $$EXD-040$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001f9'::uuid, $$EXD-041$$, $$EXD-041$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001f9'::uuid, '00000000-1111-0000-0000-0000000001f9'::uuid, $$EXD-041$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001fa'::uuid, $$EXD-042$$, $$EXD-042$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001fa'::uuid, '00000000-1111-0000-0000-0000000001fa'::uuid, $$EXD-042$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001fb'::uuid, $$FDE-003$$, $$FDE-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001fb'::uuid, '00000000-1111-0000-0000-0000000001fb'::uuid, $$FDE-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001fc'::uuid, $$FDK-003$$, $$FDK-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001fc'::uuid, '00000000-1111-0000-0000-0000000001fc'::uuid, $$FDK-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001fd'::uuid, $$FDK-004$$, $$FDK-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001fd'::uuid, '00000000-1111-0000-0000-0000000001fd'::uuid, $$FDK-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001fe'::uuid, $$FDK-005$$, $$FDK-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001fe'::uuid, '00000000-1111-0000-0000-0000000001fe'::uuid, $$FDK-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000001ff'::uuid, $$FDK-006$$, $$FDK-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000001ff'::uuid, '00000000-1111-0000-0000-0000000001ff'::uuid, $$FDK-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000200'::uuid, $$FDK-007$$, $$FDK-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000200'::uuid, '00000000-1111-0000-0000-000000000200'::uuid, $$FDK-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000201'::uuid, $$FDK-008$$, $$FDK-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000201'::uuid, '00000000-1111-0000-0000-000000000201'::uuid, $$FDK-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000202'::uuid, $$FDK-009$$, $$FDK-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000202'::uuid, '00000000-1111-0000-0000-000000000202'::uuid, $$FDK-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000203'::uuid, $$FHJ-001$$, $$FHJ-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000203'::uuid, '00000000-1111-0000-0000-000000000203'::uuid, $$FHJ-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000204'::uuid, '00000000-1111-0000-0000-000000000203'::uuid, $$FHJ-001-R4$$, 4, $$R4$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000205'::uuid, $$FHJ-001PLUG$$, $$FHJ-001PLUG$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000205'::uuid, '00000000-1111-0000-0000-000000000205'::uuid, $$FHJ-001PLUG$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000206'::uuid, $$FJK$$, $$FJK$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000206'::uuid, '00000000-1111-0000-0000-000000000206'::uuid, $$FJK$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000207'::uuid, $$FJK-001$$, $$FJK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000207'::uuid, '00000000-1111-0000-0000-000000000207'::uuid, $$FJK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000208'::uuid, $$FJK-002$$, $$FJK-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;

COMMIT;
