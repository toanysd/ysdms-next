-- PART 8/14
BEGIN;

INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e4d'::uuid, '00000000-1111-0000-0000-000000000e4d'::uuid, $$JAE-141$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e4e'::uuid, $$JAE-277$$, $$JAE-277$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e4e'::uuid, '00000000-1111-0000-0000-000000000e4e'::uuid, $$JAE-277$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e4f'::uuid, '00000000-1111-0000-0000-00000000053c'::uuid, $$MCT-001D-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e50'::uuid, $$JAE-140-R2PS$$, $$JAE-140 R2 PS$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$PS$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e50'::uuid, '00000000-1111-0000-0000-000000000e50'::uuid, $$JAE-140-R2PS$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e51'::uuid, $$JAE-076$$, $$JAE-076$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e51'::uuid, '00000000-1111-0000-0000-000000000e51'::uuid, $$JAE-076$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e52'::uuid, $$JAE-077$$, $$JAE-077$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e52'::uuid, '00000000-1111-0000-0000-000000000e52'::uuid, $$JAE-077$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e54'::uuid, $$JAE-068$$, $$JAE-068$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e54'::uuid, '00000000-1111-0000-0000-000000000e54'::uuid, $$JAE-068$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e55'::uuid, $$JAE-084$$, $$JAE-084$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e55'::uuid, '00000000-1111-0000-0000-000000000e55'::uuid, $$JAE-084$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e56'::uuid, $$JAE-115$$, $$JAE-115$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e56'::uuid, '00000000-1111-0000-0000-000000000e56'::uuid, $$JAE-115$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e57'::uuid, $$JAE-125$$, $$JAE-125$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e57'::uuid, '00000000-1111-0000-0000-000000000e57'::uuid, $$JAE-125$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e58'::uuid, $$JAE-151$$, $$JAE-151 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e58'::uuid, '00000000-1111-0000-0000-000000000e58'::uuid, $$JAE-151-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e59'::uuid, $$JAE-163$$, $$JAE-163$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e59'::uuid, '00000000-1111-0000-0000-000000000e59'::uuid, $$JAE-163$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e5b'::uuid, $$JAE-205$$, $$JAE-205$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e5b'::uuid, '00000000-1111-0000-0000-000000000e5b'::uuid, $$JAE-205$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e5c'::uuid, $$JAE-218$$, $$JAE-218$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e5c'::uuid, '00000000-1111-0000-0000-000000000e5c'::uuid, $$JAE-218$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e5d'::uuid, $$JAE-237$$, $$JAE-237$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e5d'::uuid, '00000000-1111-0000-0000-000000000e5d'::uuid, $$JAE-237$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e5e'::uuid, $$JAE-246$$, $$JAE-246$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e5e'::uuid, '00000000-1111-0000-0000-000000000e5e'::uuid, $$JAE-246$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e60'::uuid, $$JAE-113$$, $$JAE-113 R7$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e60'::uuid, '00000000-1111-0000-0000-000000000e60'::uuid, $$JAE-113-R7$$, 7, $$R7$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e61'::uuid, $$MOK-006D$$, $$MOK-006D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e61'::uuid, '00000000-1111-0000-0000-000000000e61'::uuid, $$MOK-006D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e62'::uuid, $$GKD-001$$, $$GKD-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e62'::uuid, '00000000-1111-0000-0000-000000000e62'::uuid, $$GKD-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e63'::uuid, $$TIH-024$$, $$TIH-024 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e63'::uuid, '00000000-1111-0000-0000-000000000e63'::uuid, $$TIH-024-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e64'::uuid, $$HYS-002$$, $$HYS-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e64'::uuid, '00000000-1111-0000-0000-000000000e64'::uuid, $$HYS-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e65'::uuid, '00000000-1111-0000-0000-000000000de9'::uuid, $$SHT-017-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e66'::uuid, $$JAE-110$$, $$JAE-110$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e66'::uuid, '00000000-1111-0000-0000-000000000e66'::uuid, $$JAE-110$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e67'::uuid, '00000000-1111-0000-0000-0000000009d7'::uuid, $$TE-1-163-1D-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e68'::uuid, '00000000-1111-0000-0000-0000000009d8'::uuid, $$TE-1-163-2D-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e69'::uuid, $$ADY-107$$, $$ADY-107$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e69'::uuid, '00000000-1111-0000-0000-000000000e69'::uuid, $$ADY-107$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e6a'::uuid, $$ADY-120$$, $$ADY-120$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e6a'::uuid, '00000000-1111-0000-0000-000000000e6a'::uuid, $$ADY-120$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e6b'::uuid, $$MOK-006$$, $$MOK-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e6b'::uuid, '00000000-1111-0000-0000-000000000e6b'::uuid, $$MOK-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e6c'::uuid, $$SLK-121$$, $$SLK-121$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e6c'::uuid, '00000000-1111-0000-0000-000000000e6c'::uuid, $$SLK-121$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e6d'::uuid, $$ADV-022$$, $$ADV-022$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e6d'::uuid, '00000000-1111-0000-0000-000000000e6d'::uuid, $$ADV-022$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e6e'::uuid, $$ODS-024$$, $$ODS-024$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e6e'::uuid, '00000000-1111-0000-0000-000000000e6e'::uuid, $$ODS-024$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e6f'::uuid, $$NGT-006$$, $$NGT-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e6f'::uuid, '00000000-1111-0000-0000-000000000e6f'::uuid, $$NGT-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e70'::uuid, $$NGT-009$$, $$NGT-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e70'::uuid, '00000000-1111-0000-0000-000000000e70'::uuid, $$NGT-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e71'::uuid, $$NGT-004$$, $$NGT-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e71'::uuid, '00000000-1111-0000-0000-000000000e71'::uuid, $$NGT-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e72'::uuid, $$MRY-020$$, $$MRY-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e72'::uuid, '00000000-1111-0000-0000-000000000e72'::uuid, $$MRY-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e73'::uuid, $$CPL-002$$, $$CPL-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e73'::uuid, '00000000-1111-0000-0000-000000000e73'::uuid, $$CPL-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e74'::uuid, $$MZT-021$$, $$MZT-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e74'::uuid, '00000000-1111-0000-0000-000000000e74'::uuid, $$MZT-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e75'::uuid, $$SPJ-007$$, $$SPJ-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e75'::uuid, '00000000-1111-0000-0000-000000000e75'::uuid, $$SPJ-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e76'::uuid, $$SMK-017$$, $$SMK-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e76'::uuid, '00000000-1111-0000-0000-000000000e76'::uuid, $$SMK-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e77'::uuid, $$SMK-030$$, $$SMK-030$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e77'::uuid, '00000000-1111-0000-0000-000000000e77'::uuid, $$SMK-030$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e78'::uuid, $$SMK-045$$, $$SMK-045$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e78'::uuid, '00000000-1111-0000-0000-000000000e78'::uuid, $$SMK-045$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e79'::uuid, $$KDS-051$$, $$KDS-051$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e79'::uuid, '00000000-1111-0000-0000-000000000e79'::uuid, $$KDS-051$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e7a'::uuid, $$MZT-023$$, $$MZT-023$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e7a'::uuid, '00000000-1111-0000-0000-000000000e7a'::uuid, $$MZT-023$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e7b'::uuid, $$MZT-028$$, $$MZT-028$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e7b'::uuid, '00000000-1111-0000-0000-000000000e7b'::uuid, $$MZT-028$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e7c'::uuid, $$MZT-029$$, $$MZT-029$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e7c'::uuid, '00000000-1111-0000-0000-000000000e7c'::uuid, $$MZT-029$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e7d'::uuid, $$MZT-031$$, $$MZT-031$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e7d'::uuid, '00000000-1111-0000-0000-000000000e7d'::uuid, $$MZT-031$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e7e'::uuid, $$MZT-042$$, $$MZT-042$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e7e'::uuid, '00000000-1111-0000-0000-000000000e7e'::uuid, $$MZT-042$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e7f'::uuid, $$MZT-025$$, $$MZT-025$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e7f'::uuid, '00000000-1111-0000-0000-000000000e7f'::uuid, $$MZT-025$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e80'::uuid, $$MZT-026$$, $$MZT-026$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e80'::uuid, '00000000-1111-0000-0000-000000000e80'::uuid, $$MZT-026$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e81'::uuid, $$MZT-041$$, $$MZT-041$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e81'::uuid, '00000000-1111-0000-0000-000000000e81'::uuid, $$MZT-041$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e82'::uuid, $$KDS-056$$, $$KDS-056$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e82'::uuid, '00000000-1111-0000-0000-000000000e82'::uuid, $$KDS-056$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e83'::uuid, $$SMK-139$$, $$SMK-139$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e83'::uuid, '00000000-1111-0000-0000-000000000e83'::uuid, $$SMK-139$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e84'::uuid, $$DIC-152$$, $$DIC-152 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e84'::uuid, '00000000-1111-0000-0000-000000000e84'::uuid, $$DIC-152-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e85'::uuid, '00000000-1111-0000-0000-000000000e13'::uuid, $$NGS-018-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e86'::uuid, $$MOK-004$$, $$MOK-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e86'::uuid, '00000000-1111-0000-0000-000000000e86'::uuid, $$MOK-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e87'::uuid, $$OMG-003$$, $$OMG-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e87'::uuid, '00000000-1111-0000-0000-000000000e87'::uuid, $$OMG-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e88'::uuid, $$SMK-142$$, $$SMK-142$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e88'::uuid, '00000000-1111-0000-0000-000000000e88'::uuid, $$SMK-142$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e8a'::uuid, $$TE-2-156-4$$, $$TE-2-156-4$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e8a'::uuid, '00000000-1111-0000-0000-000000000e8a'::uuid, $$TE-2-156-4$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e8b'::uuid, $$KND-002$$, $$KND-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e8b'::uuid, '00000000-1111-0000-0000-000000000e8b'::uuid, $$KND-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e8c'::uuid, $$YCM-021$$, $$YCM-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e8c'::uuid, '00000000-1111-0000-0000-000000000e8c'::uuid, $$YCM-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e8d'::uuid, $$YMT-009$$, $$YMT-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e8d'::uuid, '00000000-1111-0000-0000-000000000e8d'::uuid, $$YMT-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e8e'::uuid, $$KSP-068$$, $$KSP-068$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e8e'::uuid, '00000000-1111-0000-0000-000000000e8e'::uuid, $$KSP-068$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e8f'::uuid, $$TE-3-156-3$$, $$TE-3-156-3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e8f'::uuid, '00000000-1111-0000-0000-000000000e8f'::uuid, $$TE-3-156-3$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e90'::uuid, $$KSP-081$$, $$KSP-081$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e90'::uuid, '00000000-1111-0000-0000-000000000e90'::uuid, $$KSP-081$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e91'::uuid, $$ady-091$$, $$ady-091$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e91'::uuid, '00000000-1111-0000-0000-000000000e91'::uuid, $$ady-091$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e92'::uuid, $$TE-6-157-0$$, $$TE-6-157-0$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e92'::uuid, '00000000-1111-0000-0000-000000000e92'::uuid, $$TE-6-157-0$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e93'::uuid, $$te-1-141-2$$, $$te-1-141-2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e93'::uuid, '00000000-1111-0000-0000-000000000e93'::uuid, $$te-1-141-2$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e94'::uuid, $$SMK-181$$, $$SMK-181$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e94'::uuid, '00000000-1111-0000-0000-000000000e94'::uuid, $$SMK-181$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e95'::uuid, $$smk-180$$, $$smk-180$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e95'::uuid, '00000000-1111-0000-0000-000000000e95'::uuid, $$smk-180$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e96'::uuid, $$DIC-017$$, $$DIC-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e96'::uuid, '00000000-1111-0000-0000-000000000e96'::uuid, $$DIC-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e97'::uuid, $$DIC-018$$, $$DIC-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e97'::uuid, '00000000-1111-0000-0000-000000000e97'::uuid, $$DIC-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e98'::uuid, $$KMG-003$$, $$KMG-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e98'::uuid, '00000000-1111-0000-0000-000000000e98'::uuid, $$KMG-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e99'::uuid, $$TE-9-156-0$$, $$TE-9-156-0$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e99'::uuid, '00000000-1111-0000-0000-000000000e99'::uuid, $$TE-9-156-0$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e9a'::uuid, $$te-7-157-1$$, $$te-7-157-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e9a'::uuid, '00000000-1111-0000-0000-000000000e9a'::uuid, $$te-7-157-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e9b'::uuid, $$SKK-001$$, $$SKK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e9b'::uuid, '00000000-1111-0000-0000-000000000e9b'::uuid, $$SKK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e9c'::uuid, $$KND-012$$, $$KND-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e9c'::uuid, '00000000-1111-0000-0000-000000000e9c'::uuid, $$KND-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e9d'::uuid, $$ADV-031$$, $$ADV-031$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e9d'::uuid, '00000000-1111-0000-0000-000000000e9d'::uuid, $$ADV-031$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e9e'::uuid, $$TE-2-156-0$$, $$TE-2-156-0 R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e9e'::uuid, '00000000-1111-0000-0000-000000000e9e'::uuid, $$TE-2-156-0-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000e9f'::uuid, $$GMY-029$$, $$GMY-029$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000e9f'::uuid, '00000000-1111-0000-0000-000000000e9f'::uuid, $$GMY-029$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ea0'::uuid, $$ADY-065$$, $$ADY-065$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ea0'::uuid, '00000000-1111-0000-0000-000000000ea0'::uuid, $$ADY-065$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ea1'::uuid, $$ADY-066$$, $$ADY-066$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ea1'::uuid, '00000000-1111-0000-0000-000000000ea1'::uuid, $$ADY-066$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ea2'::uuid, $$MZT-061$$, $$MZT-061$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ea2'::uuid, '00000000-1111-0000-0000-000000000ea2'::uuid, $$MZT-061$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ea3'::uuid, $$YCM-022$$, $$YCM-022$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ea3'::uuid, '00000000-1111-0000-0000-000000000ea3'::uuid, $$YCM-022$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ea4'::uuid, $$TE-3-159-1$$, $$TE-3-159-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ea4'::uuid, '00000000-1111-0000-0000-000000000ea4'::uuid, $$TE-3-159-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ea6'::uuid, $$SIT-023$$, $$SIT-023$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ea6'::uuid, '00000000-1111-0000-0000-000000000ea6'::uuid, $$SIT-023$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ea7'::uuid, $$KOS-018$$, $$KOS-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ea7'::uuid, '00000000-1111-0000-0000-000000000ea7'::uuid, $$KOS-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ea8'::uuid, '00000000-1111-0000-0000-0000000000db'::uuid, $$ATS-030-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ea9'::uuid, $$NKB-001$$, $$NKB-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ea9'::uuid, '00000000-1111-0000-0000-000000000ea9'::uuid, $$NKB-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eaa'::uuid, $$MTM-132$$, $$MTM-132$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eaa'::uuid, '00000000-1111-0000-0000-000000000eaa'::uuid, $$MTM-132$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eab'::uuid, $$SONY-001$$, $$SONY-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eab'::uuid, '00000000-1111-0000-0000-000000000eab'::uuid, $$SONY-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eac'::uuid, $$CPL-001M$$, $$CPL-001M$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$M$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eac'::uuid, '00000000-1111-0000-0000-000000000eac'::uuid, $$CPL-001M$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ead'::uuid, $$CPL-001C$$, $$CPL-001C$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ead'::uuid, '00000000-1111-0000-0000-000000000ead'::uuid, $$CPL-001C$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eae'::uuid, $$DIC-026$$, $$DIC-026$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eae'::uuid, '00000000-1111-0000-0000-000000000eae'::uuid, $$DIC-026$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eaf'::uuid, $$OTAX-012$$, $$OTAX-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eaf'::uuid, '00000000-1111-0000-0000-000000000eaf'::uuid, $$OTAX-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eb0'::uuid, $$OTAX-011$$, $$OTAX-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eb0'::uuid, '00000000-1111-0000-0000-000000000eb0'::uuid, $$OTAX-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eb1'::uuid, $$DIC-006M$$, $$DIC-006M$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$M$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eb1'::uuid, '00000000-1111-0000-0000-000000000eb1'::uuid, $$DIC-006M$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eb2'::uuid, $$DIC-006$$, $$DIC-006T$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eb2'::uuid, '00000000-1111-0000-0000-000000000eb2'::uuid, $$DIC-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eb3'::uuid, $$FDK-001$$, $$FDK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eb3'::uuid, '00000000-1111-0000-0000-000000000eb3'::uuid, $$FDK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eb4'::uuid, $$FDK-002$$, $$FDK-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eb4'::uuid, '00000000-1111-0000-0000-000000000eb4'::uuid, $$FDK-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eb5'::uuid, $$EFC-001$$, $$EFC-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eb5'::uuid, '00000000-1111-0000-0000-000000000eb5'::uuid, $$EFC-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eb6'::uuid, $$TE-2-072-5A$$, $$TE-2-072-5A$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eb6'::uuid, '00000000-1111-0000-0000-000000000eb6'::uuid, $$TE-2-072-5A$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eb7'::uuid, $$TE-2-072-5$$, $$TE-2-072-5B$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eb7'::uuid, '00000000-1111-0000-0000-000000000eb7'::uuid, $$TE-2-072-5$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eb9'::uuid, $$ODS-036$$, $$ODS-036 R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eb9'::uuid, '00000000-1111-0000-0000-000000000eb9'::uuid, $$ODS-036-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eba'::uuid, $$IGB-002$$, $$IGB-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eba'::uuid, '00000000-1111-0000-0000-000000000eba'::uuid, $$IGB-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ebb'::uuid, $$TH-057$$, $$TH-057$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ebb'::uuid, '00000000-1111-0000-0000-000000000ebb'::uuid, $$TH-057$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ebc'::uuid, $$TE-2418183-1TYPE1$$, $$TE-2418183-1 TYPE1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ebc'::uuid, '00000000-1111-0000-0000-000000000ebc'::uuid, $$TE-2418183-1TYPE1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ebd'::uuid, $$TE-2418183-1TYPE2$$, $$TE-2418183-1 TYPE2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ebd'::uuid, '00000000-1111-0000-0000-000000000ebd'::uuid, $$TE-2418183-1TYPE2$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ebe'::uuid, $$ADV-038$$, $$ADV-038$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ebe'::uuid, '00000000-1111-0000-0000-000000000ebe'::uuid, $$ADV-038$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ebf'::uuid, $$TE-2-145-9$$, $$TE-2-145-9$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ebf'::uuid, '00000000-1111-0000-0000-000000000ebf'::uuid, $$TE-2-145-9$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ec0'::uuid, $$KDS-124$$, $$KDS-124$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ec0'::uuid, '00000000-1111-0000-0000-000000000ec0'::uuid, $$KDS-124$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ec1'::uuid, $$SJI-011$$, $$SJI-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ec1'::uuid, '00000000-1111-0000-0000-000000000ec1'::uuid, $$SJI-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ec2'::uuid, $$TE-6-073-6$$, $$TE-6-073-6$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ec2'::uuid, '00000000-1111-0000-0000-000000000ec2'::uuid, $$TE-6-073-6$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ec3'::uuid, $$SEW-001$$, $$SEW-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ec3'::uuid, '00000000-1111-0000-0000-000000000ec3'::uuid, $$SEW-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ec4'::uuid, $$TE-1-447287-1$$, $$TE-1-447287-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ec4'::uuid, '00000000-1111-0000-0000-000000000ec4'::uuid, $$TE-1-447287-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ec5'::uuid, $$BSP-001$$, $$BSP-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ec5'::uuid, '00000000-1111-0000-0000-000000000ec5'::uuid, $$BSP-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ec7'::uuid, $$TH-056$$, $$TH-056$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ec7'::uuid, '00000000-1111-0000-0000-000000000ec7'::uuid, $$TH-056$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ec8'::uuid, $$KND-003$$, $$KND-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ec8'::uuid, '00000000-1111-0000-0000-000000000ec8'::uuid, $$KND-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ec9'::uuid, $$TE-9-130-4$$, $$TE-9-130-4$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ec9'::uuid, '00000000-1111-0000-0000-000000000ec9'::uuid, $$TE-9-130-4$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eca'::uuid, $$A3C-002$$, $$A3C-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eca'::uuid, '00000000-1111-0000-0000-000000000eca'::uuid, $$A3C-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ecb'::uuid, $$TE-023$$, $$TE-023$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ecb'::uuid, '00000000-1111-0000-0000-000000000ecb'::uuid, $$TE-023$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ecc'::uuid, $$TE-7-174-1$$, $$TE-7-174-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ecc'::uuid, '00000000-1111-0000-0000-000000000ecc'::uuid, $$TE-7-174-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ecd'::uuid, $$TMT-001$$, $$TMT-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ecd'::uuid, '00000000-1111-0000-0000-000000000ecd'::uuid, $$TMT-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ece'::uuid, $$OPK-001$$, $$OPK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ece'::uuid, '00000000-1111-0000-0000-000000000ece'::uuid, $$OPK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ecf'::uuid, $$MSP-002$$, $$MSP-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ecf'::uuid, '00000000-1111-0000-0000-000000000ecf'::uuid, $$MSP-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ed0'::uuid, $$SWT-002$$, $$SWT-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ed0'::uuid, '00000000-1111-0000-0000-000000000ed0'::uuid, $$SWT-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ed1'::uuid, $$OOT-029$$, $$OOT-029$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ed1'::uuid, '00000000-1111-0000-0000-000000000ed1'::uuid, $$OOT-029$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ed2'::uuid, $$OMG-004$$, $$OMG-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ed2'::uuid, '00000000-1111-0000-0000-000000000ed2'::uuid, $$OMG-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ed4'::uuid, $$ADV-030$$, $$ADV-030$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ed4'::uuid, '00000000-1111-0000-0000-000000000ed4'::uuid, $$ADV-030$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ed5'::uuid, $$SHT-001$$, $$SHT-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ed5'::uuid, '00000000-1111-0000-0000-000000000ed5'::uuid, $$SHT-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ed6'::uuid, $$SIT-008$$, $$SIT-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ed6'::uuid, '00000000-1111-0000-0000-000000000ed6'::uuid, $$SIT-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ed7'::uuid, $$TH-007$$, $$TH-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ed7'::uuid, '00000000-1111-0000-0000-000000000ed7'::uuid, $$TH-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ed8'::uuid, $$A3C-001$$, $$A3C-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ed8'::uuid, '00000000-1111-0000-0000-000000000ed8'::uuid, $$A3C-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ed9'::uuid, $$TE-6-074-9$$, $$TE-6-074-9$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ed9'::uuid, '00000000-1111-0000-0000-000000000ed9'::uuid, $$TE-6-074-9$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eda'::uuid, $$TE-9-142-2$$, $$TE-9-142-2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eda'::uuid, '00000000-1111-0000-0000-000000000eda'::uuid, $$TE-9-142-2$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000edb'::uuid, $$NGT-003$$, $$NGT-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000edb'::uuid, '00000000-1111-0000-0000-000000000edb'::uuid, $$NGT-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000edc'::uuid, $$TE-3-143-5$$, $$TE-3-143-5$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000edc'::uuid, '00000000-1111-0000-0000-000000000edc'::uuid, $$TE-3-143-5$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000edd'::uuid, $$TE-9-143-2$$, $$TE-9-143-2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000edd'::uuid, '00000000-1111-0000-0000-000000000edd'::uuid, $$TE-9-143-2$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ede'::uuid, $$KKG-004$$, $$KKG-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ede'::uuid, '00000000-1111-0000-0000-000000000ede'::uuid, $$KKG-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000edf'::uuid, $$TMC-004$$, $$TMC-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000edf'::uuid, '00000000-1111-0000-0000-000000000edf'::uuid, $$TMC-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ee0'::uuid, $$SIT-009$$, $$SIT-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ee0'::uuid, '00000000-1111-0000-0000-000000000ee0'::uuid, $$SIT-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ee1'::uuid, $$ADY-116$$, $$ADY-116$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ee1'::uuid, '00000000-1111-0000-0000-000000000ee1'::uuid, $$ADY-116$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ee2'::uuid, $$KOS-004$$, $$KOS-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ee2'::uuid, '00000000-1111-0000-0000-000000000ee2'::uuid, $$KOS-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ee3'::uuid, $$ESJ-001$$, $$ESJ-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ee3'::uuid, '00000000-1111-0000-0000-000000000ee3'::uuid, $$ESJ-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ee4'::uuid, $$MTY-001$$, $$MTY-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ee4'::uuid, '00000000-1111-0000-0000-000000000ee4'::uuid, $$MTY-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ee5'::uuid, $$KOK-005$$, $$KOK-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ee5'::uuid, '00000000-1111-0000-0000-000000000ee5'::uuid, $$KOK-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ee6'::uuid, $$KND-015$$, $$KND-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ee6'::uuid, '00000000-1111-0000-0000-000000000ee6'::uuid, $$KND-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ee7'::uuid, $$KDS-128$$, $$KDS-128$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ee7'::uuid, '00000000-1111-0000-0000-000000000ee7'::uuid, $$KDS-128$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ee8'::uuid, $$TMT-002$$, $$TMT-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ee8'::uuid, '00000000-1111-0000-0000-000000000ee8'::uuid, $$TMT-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ee9'::uuid, $$TBG-029$$, $$TBG-029$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ee9'::uuid, '00000000-1111-0000-0000-000000000ee9'::uuid, $$TBG-029$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eea'::uuid, $$TBG-021$$, $$TBG-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eea'::uuid, '00000000-1111-0000-0000-000000000eea'::uuid, $$TBG-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eeb'::uuid, $$TE-9-157-7$$, $$TE-9-157-7$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eeb'::uuid, '00000000-1111-0000-0000-000000000eeb'::uuid, $$TE-9-157-7$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eec'::uuid, $$TE-2307445-1$$, $$TE-2307445-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eec'::uuid, '00000000-1111-0000-0000-000000000eec'::uuid, $$TE-2307445-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eee'::uuid, $$SIT-004$$, $$SIT-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eee'::uuid, '00000000-1111-0000-0000-000000000eee'::uuid, $$SIT-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eef'::uuid, $$KND-016$$, $$KND-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eef'::uuid, '00000000-1111-0000-0000-000000000eef'::uuid, $$KND-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ef1'::uuid, $$SLK-131$$, $$SLK-131$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ef1'::uuid, '00000000-1111-0000-0000-000000000ef1'::uuid, $$SLK-131$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ef2'::uuid, $$SLK-137$$, $$SLK-137$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ef2'::uuid, '00000000-1111-0000-0000-000000000ef2'::uuid, $$SLK-137$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ef3'::uuid, $$SLK-139$$, $$SLK-139 R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ef3'::uuid, '00000000-1111-0000-0000-000000000ef3'::uuid, $$SLK-139-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ef4'::uuid, $$SLK-132$$, $$SLK-132$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ef4'::uuid, '00000000-1111-0000-0000-000000000ef4'::uuid, $$SLK-132$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ef5'::uuid, $$SLK-134$$, $$SLK-134$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ef5'::uuid, '00000000-1111-0000-0000-000000000ef5'::uuid, $$SLK-134$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ef6'::uuid, $$SLK-138$$, $$SLK-138$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ef6'::uuid, '00000000-1111-0000-0000-000000000ef6'::uuid, $$SLK-138$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ef7'::uuid, $$SLK-135$$, $$SLK-135$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ef7'::uuid, '00000000-1111-0000-0000-000000000ef7'::uuid, $$SLK-135$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ef8'::uuid, $$SLK-140$$, $$SLK-140$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ef8'::uuid, '00000000-1111-0000-0000-000000000ef8'::uuid, $$SLK-140$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ef9'::uuid, $$SLK-129$$, $$SLK-129$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ef9'::uuid, '00000000-1111-0000-0000-000000000ef9'::uuid, $$SLK-129$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000efa'::uuid, $$SLK-123$$, $$SLK-123$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000efa'::uuid, '00000000-1111-0000-0000-000000000efa'::uuid, $$SLK-123$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000efb'::uuid, $$SLK-136$$, $$SLK-136$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000efb'::uuid, '00000000-1111-0000-0000-000000000efb'::uuid, $$SLK-136$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000efc'::uuid, $$SLK-116$$, $$SLK-116$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000efc'::uuid, '00000000-1111-0000-0000-000000000efc'::uuid, $$SLK-116$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000efd'::uuid, $$SLK-125$$, $$SLK-125$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000efd'::uuid, '00000000-1111-0000-0000-000000000efd'::uuid, $$SLK-125$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000efe'::uuid, $$SLK-141$$, $$SLK-141$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000efe'::uuid, '00000000-1111-0000-0000-000000000efe'::uuid, $$SLK-141$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000eff'::uuid, $$SLK-133$$, $$SLK-133$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000eff'::uuid, '00000000-1111-0000-0000-000000000eff'::uuid, $$SLK-133$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f00'::uuid, $$OTP-004$$, $$OTP-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f00'::uuid, '00000000-1111-0000-0000-000000000f00'::uuid, $$OTP-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f01'::uuid, $$OTP-002$$, $$OTP-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f01'::uuid, '00000000-1111-0000-0000-000000000f01'::uuid, $$OTP-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f02'::uuid, $$OTP-001$$, $$OTP-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f02'::uuid, '00000000-1111-0000-0000-000000000f02'::uuid, $$OTP-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f03'::uuid, $$OTP-005$$, $$OTP-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f03'::uuid, '00000000-1111-0000-0000-000000000f03'::uuid, $$OTP-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f04'::uuid, $$OTHER-613$$, $$OTHER-613$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f04'::uuid, '00000000-1111-0000-0000-000000000f04'::uuid, $$OTHER-613$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f05'::uuid, $$TE-1-145-2$$, $$TE-1-145-2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f05'::uuid, '00000000-1111-0000-0000-000000000f05'::uuid, $$TE-1-145-2$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f06'::uuid, $$A3C-003$$, $$A3C-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f06'::uuid, '00000000-1111-0000-0000-000000000f06'::uuid, $$A3C-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f07'::uuid, $$TE-3-023-0$$, $$TE-3-023-0 B$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f07'::uuid, '00000000-1111-0000-0000-000000000f07'::uuid, $$TE-3-023-0$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f08'::uuid, $$TE-3-023-0A$$, $$TE-3-023-0 A$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f08'::uuid, '00000000-1111-0000-0000-000000000f08'::uuid, $$TE-3-023-0A$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f09'::uuid, $$SIT-016$$, $$SIT-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f09'::uuid, '00000000-1111-0000-0000-000000000f09'::uuid, $$SIT-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f0a'::uuid, $$TE-2289506-1$$, $$TE-2289506-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f0a'::uuid, '00000000-1111-0000-0000-000000000f0a'::uuid, $$TE-2289506-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f0b'::uuid, $$TE-2289554-1$$, $$TE-2289554-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f0b'::uuid, '00000000-1111-0000-0000-000000000f0b'::uuid, $$TE-2289554-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f0c'::uuid, $$PS-100$$, $$PS-100$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f0c'::uuid, '00000000-1111-0000-0000-000000000f0c'::uuid, $$PS-100$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f0d'::uuid, $$PS-050$$, $$PS-050$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f0d'::uuid, '00000000-1111-0000-0000-000000000f0d'::uuid, $$PS-050$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f0e'::uuid, $$GMY-091$$, $$GMY-091$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f0e'::uuid, '00000000-1111-0000-0000-000000000f0e'::uuid, $$GMY-091$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f0f'::uuid, $$EFC-002$$, $$EFC-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f0f'::uuid, '00000000-1111-0000-0000-000000000f0f'::uuid, $$EFC-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f11'::uuid, $$TE-3-066-8$$, $$TE-3-066-8 NO1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f11'::uuid, '00000000-1111-0000-0000-000000000f11'::uuid, $$TE-3-066-8$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f13'::uuid, $$TE-7-162-7$$, $$TE-7-162-7$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f13'::uuid, '00000000-1111-0000-0000-000000000f13'::uuid, $$TE-7-162-7$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f14'::uuid, $$KDS-117$$, $$KDS-117$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f14'::uuid, '00000000-1111-0000-0000-000000000f14'::uuid, $$KDS-117$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f15'::uuid, $$TE-2421086-1$$, $$TE-2421086-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f15'::uuid, '00000000-1111-0000-0000-000000000f15'::uuid, $$TE-2421086-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f16'::uuid, $$YCM-052$$, $$YCM-052$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f16'::uuid, '00000000-1111-0000-0000-000000000f16'::uuid, $$YCM-052$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f17'::uuid, $$KDS-062$$, $$KDS-062$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f17'::uuid, '00000000-1111-0000-0000-000000000f17'::uuid, $$KDS-062$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f18'::uuid, $$TE-5-072-7$$, $$TE-5-072-7$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f18'::uuid, '00000000-1111-0000-0000-000000000f18'::uuid, $$TE-5-072-7$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f19'::uuid, $$TE-3-066-3$$, $$TE-3-066-3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f19'::uuid, '00000000-1111-0000-0000-000000000f19'::uuid, $$TE-3-066-3$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f1a'::uuid, $$TE-5-072-8$$, $$TE-5-072-8$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f1a'::uuid, '00000000-1111-0000-0000-000000000f1a'::uuid, $$TE-5-072-8$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f1b'::uuid, $$TE-5-072-5$$, $$TE-5-072-5$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f1b'::uuid, '00000000-1111-0000-0000-000000000f1b'::uuid, $$TE-5-072-5$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f1c'::uuid, $$A3C-004$$, $$A3C-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f1c'::uuid, '00000000-1111-0000-0000-000000000f1c'::uuid, $$A3C-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f1d'::uuid, $$YPC-001$$, $$YPC-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f1d'::uuid, '00000000-1111-0000-0000-000000000f1d'::uuid, $$YPC-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f1e'::uuid, $$TCT-001$$, $$TCT-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f1e'::uuid, '00000000-1111-0000-0000-000000000f1e'::uuid, $$TCT-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f1f'::uuid, $$TE-5-072-9$$, $$TE-5-072-9$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f1f'::uuid, '00000000-1111-0000-0000-000000000f1f'::uuid, $$TE-5-072-9$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f20'::uuid, $$TE-5-072-3$$, $$TE-5-072-3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f20'::uuid, '00000000-1111-0000-0000-000000000f20'::uuid, $$TE-5-072-3$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f21'::uuid, $$YPC-004$$, $$YPC-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f21'::uuid, '00000000-1111-0000-0000-000000000f21'::uuid, $$YPC-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f22'::uuid, $$TE-3-059-6$$, $$TE-3-059-6$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f22'::uuid, '00000000-1111-0000-0000-000000000f22'::uuid, $$TE-3-059-6$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f23'::uuid, $$TE-4-061-3$$, $$TE-4-061-3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f23'::uuid, '00000000-1111-0000-0000-000000000f23'::uuid, $$TE-4-061-3$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f24'::uuid, $$TE-5-072-2$$, $$TE-5-072-2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f24'::uuid, '00000000-1111-0000-0000-000000000f24'::uuid, $$TE-5-072-2$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f25'::uuid, $$SIT-007$$, $$SIT-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f25'::uuid, '00000000-1111-0000-0000-000000000f25'::uuid, $$SIT-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f26'::uuid, $$TE-1-162-9$$, $$TE-1-162-9$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f26'::uuid, '00000000-1111-0000-0000-000000000f26'::uuid, $$TE-1-162-9$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f27'::uuid, $$HIN-003$$, $$HIN-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f27'::uuid, '00000000-1111-0000-0000-000000000f27'::uuid, $$HIN-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f28'::uuid, $$TE-9-078-7$$, $$TE-9-078-7$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f28'::uuid, '00000000-1111-0000-0000-000000000f28'::uuid, $$TE-9-078-7$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f29'::uuid, $$TE-9-157-6$$, $$TE-9-157-6$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f29'::uuid, '00000000-1111-0000-0000-000000000f29'::uuid, $$TE-9-157-6$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f2a'::uuid, $$APF-005$$, $$APF-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f2a'::uuid, '00000000-1111-0000-0000-000000000f2a'::uuid, $$APF-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f2c'::uuid, $$SMK-009$$, $$SMK-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f2c'::uuid, '00000000-1111-0000-0000-000000000f2c'::uuid, $$SMK-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f2d'::uuid, $$SMK-034$$, $$SMK-034$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f2d'::uuid, '00000000-1111-0000-0000-000000000f2d'::uuid, $$SMK-034$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f2e'::uuid, $$TSP-006$$, $$TSP-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f2e'::uuid, '00000000-1111-0000-0000-000000000f2e'::uuid, $$TSP-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f2f'::uuid, $$SMK-012$$, $$SMK-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f2f'::uuid, '00000000-1111-0000-0000-000000000f2f'::uuid, $$SMK-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f30'::uuid, $$SMK-148$$, $$SMK-148$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f30'::uuid, '00000000-1111-0000-0000-000000000f30'::uuid, $$SMK-148$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f31'::uuid, $$SMK-078$$, $$SMK-078$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f31'::uuid, '00000000-1111-0000-0000-000000000f31'::uuid, $$SMK-078$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f32'::uuid, $$SMK-081$$, $$SMK-081$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f32'::uuid, '00000000-1111-0000-0000-000000000f32'::uuid, $$SMK-081$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f33'::uuid, $$SMK-095$$, $$SMK-095$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f33'::uuid, '00000000-1111-0000-0000-000000000f33'::uuid, $$SMK-095$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f34'::uuid, $$SMK-022$$, $$SMK-022$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f34'::uuid, '00000000-1111-0000-0000-000000000f34'::uuid, $$SMK-022$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f35'::uuid, $$SMK-021$$, $$SMK-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f35'::uuid, '00000000-1111-0000-0000-000000000f35'::uuid, $$SMK-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f36'::uuid, $$SMK-016$$, $$SMK-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f36'::uuid, '00000000-1111-0000-0000-000000000f36'::uuid, $$SMK-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f37'::uuid, $$SMK-018$$, $$SMK-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f37'::uuid, '00000000-1111-0000-0000-000000000f37'::uuid, $$SMK-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f38'::uuid, $$SMK-064$$, $$SMK-064$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f38'::uuid, '00000000-1111-0000-0000-000000000f38'::uuid, $$SMK-064$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f39'::uuid, $$SMK-077$$, $$SMK-077$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f39'::uuid, '00000000-1111-0000-0000-000000000f39'::uuid, $$SMK-077$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f3a'::uuid, $$SMK-170$$, $$SMK-170$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f3a'::uuid, '00000000-1111-0000-0000-000000000f3a'::uuid, $$SMK-170$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f3b'::uuid, $$ADY-030$$, $$ADY-030$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f3b'::uuid, '00000000-1111-0000-0000-000000000f3b'::uuid, $$ADY-030$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f3c'::uuid, $$SMK-024$$, $$SMK-024$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f3c'::uuid, '00000000-1111-0000-0000-000000000f3c'::uuid, $$SMK-024$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f3d'::uuid, $$SMK-035$$, $$SMK-035$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f3d'::uuid, '00000000-1111-0000-0000-000000000f3d'::uuid, $$SMK-035$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f3e'::uuid, $$SMK-063$$, $$SMK-063$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f3e'::uuid, '00000000-1111-0000-0000-000000000f3e'::uuid, $$SMK-063$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f3f'::uuid, $$SMK-072$$, $$SMK-072$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f3f'::uuid, '00000000-1111-0000-0000-000000000f3f'::uuid, $$SMK-072$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f40'::uuid, $$SMK-067$$, $$SMK-067$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f40'::uuid, '00000000-1111-0000-0000-000000000f40'::uuid, $$SMK-067$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f41'::uuid, $$SMK-073$$, $$SMK-073$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f41'::uuid, '00000000-1111-0000-0000-000000000f41'::uuid, $$SMK-073$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f42'::uuid, $$SMK-069$$, $$SMK-069$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f42'::uuid, '00000000-1111-0000-0000-000000000f42'::uuid, $$SMK-069$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f43'::uuid, $$SMK-080$$, $$SMK-080$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f43'::uuid, '00000000-1111-0000-0000-000000000f43'::uuid, $$SMK-080$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f44'::uuid, $$SMK-065$$, $$SMK-065$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f44'::uuid, '00000000-1111-0000-0000-000000000f44'::uuid, $$SMK-065$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f45'::uuid, $$SMK-057$$, $$SMK-057$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f45'::uuid, '00000000-1111-0000-0000-000000000f45'::uuid, $$SMK-057$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f46'::uuid, $$SMK-082$$, $$SMK-082$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f46'::uuid, '00000000-1111-0000-0000-000000000f46'::uuid, $$SMK-082$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f47'::uuid, $$SMK-002$$, $$SMK-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f47'::uuid, '00000000-1111-0000-0000-000000000f47'::uuid, $$SMK-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f48'::uuid, $$SMK-083xx$$, $$SMK-083xx$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f48'::uuid, '00000000-1111-0000-0000-000000000f48'::uuid, $$SMK-083xx$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f4b'::uuid, $$SMK-084$$, $$SMK-084$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f4b'::uuid, '00000000-1111-0000-0000-000000000f4b'::uuid, $$SMK-084$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f4c'::uuid, $$SMK-062$$, $$SMK-062$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f4c'::uuid, '00000000-1111-0000-0000-000000000f4c'::uuid, $$SMK-062$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f4e'::uuid, $$TE-9-103-8$$, $$TE-9-103-8$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f4e'::uuid, '00000000-1111-0000-0000-000000000f4e'::uuid, $$TE-9-103-8$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f4f'::uuid, $$TE-3-156-8$$, $$TE-3-156-8$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f4f'::uuid, '00000000-1111-0000-0000-000000000f4f'::uuid, $$TE-3-156-8$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f50'::uuid, $$TE-4-156-5$$, $$TE-4-156-5$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f50'::uuid, '00000000-1111-0000-0000-000000000f50'::uuid, $$TE-4-156-5$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f51'::uuid, $$TE-7-157-2$$, $$TE-7-157-2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f51'::uuid, '00000000-1111-0000-0000-000000000f51'::uuid, $$TE-7-157-2$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f52'::uuid, $$MSP-001$$, $$MSP-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f52'::uuid, '00000000-1111-0000-0000-000000000f52'::uuid, $$MSP-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f53'::uuid, $$TE-2-145-6$$, $$TE-2-145-6$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f53'::uuid, '00000000-1111-0000-0000-000000000f53'::uuid, $$TE-2-145-6$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f54'::uuid, $$KSP-127$$, $$KSP-127$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f54'::uuid, '00000000-1111-0000-0000-000000000f54'::uuid, $$KSP-127$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f55'::uuid, $$TE-016$$, $$TE-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f55'::uuid, '00000000-1111-0000-0000-000000000f55'::uuid, $$TE-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f56'::uuid, $$TE-004$$, $$TE-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f56'::uuid, '00000000-1111-0000-0000-000000000f56'::uuid, $$TE-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f57'::uuid, $$TE-021$$, $$TE-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f57'::uuid, '00000000-1111-0000-0000-000000000f57'::uuid, $$TE-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f58'::uuid, $$TE-8-130-9$$, $$TE-8-130-9$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f58'::uuid, '00000000-1111-0000-0000-000000000f58'::uuid, $$TE-8-130-9$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f59'::uuid, $$TE-8-130-6$$, $$TE-8-130-6$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f59'::uuid, '00000000-1111-0000-0000-000000000f59'::uuid, $$TE-8-130-6$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f5a'::uuid, $$DIC-153$$, $$DIC-153$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f5a'::uuid, '00000000-1111-0000-0000-000000000f5a'::uuid, $$DIC-153$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f5b'::uuid, $$KSC-004$$, $$KSC-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f5b'::uuid, '00000000-1111-0000-0000-000000000f5b'::uuid, $$KSC-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f5c'::uuid, $$ADV-036$$, $$ADV-036$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f5c'::uuid, '00000000-1111-0000-0000-000000000f5c'::uuid, $$ADV-036$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f5d'::uuid, $$TE-1-108-5$$, $$TE-1-108-5$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f5d'::uuid, '00000000-1111-0000-0000-000000000f5d'::uuid, $$TE-1-108-5$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f5e'::uuid, $$TE-4-075-7$$, $$TE-4-075-7$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f5e'::uuid, '00000000-1111-0000-0000-000000000f5e'::uuid, $$TE-4-075-7$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f5f'::uuid, $$TE-2289529-1$$, $$TE-2289529-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f5f'::uuid, '00000000-1111-0000-0000-000000000f5f'::uuid, $$TE-2289529-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f60'::uuid, $$TE-1-074-2$$, $$TE-1-074-2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f60'::uuid, '00000000-1111-0000-0000-000000000f60'::uuid, $$TE-1-074-2$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f61'::uuid, $$TE-2289548-1$$, $$TE-2289548-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f61'::uuid, '00000000-1111-0000-0000-000000000f61'::uuid, $$TE-2289548-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f62'::uuid, $$TE-2289538-1$$, $$TE-2289538-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f62'::uuid, '00000000-1111-0000-0000-000000000f62'::uuid, $$TE-2289538-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f63'::uuid, $$DIC-156$$, $$DIC-156$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f63'::uuid, '00000000-1111-0000-0000-000000000f63'::uuid, $$DIC-156$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f64'::uuid, $$DIC-157$$, $$DIC-157$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f64'::uuid, '00000000-1111-0000-0000-000000000f64'::uuid, $$DIC-157$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f65'::uuid, $$YCM-036$$, $$YCM-036 R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f65'::uuid, '00000000-1111-0000-0000-000000000f65'::uuid, $$YCM-036-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f66'::uuid, $$SSK-007$$, $$SSK-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f66'::uuid, '00000000-1111-0000-0000-000000000f66'::uuid, $$SSK-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f67'::uuid, $$TE-2289513-1$$, $$TE-2289513-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f67'::uuid, '00000000-1111-0000-0000-000000000f67'::uuid, $$TE-2289513-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f68'::uuid, $$TE-2289530-1$$, $$TE-2289530-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f68'::uuid, '00000000-1111-0000-0000-000000000f68'::uuid, $$TE-2289530-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f69'::uuid, $$TE-1-074-3$$, $$TE-1-074-3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f69'::uuid, '00000000-1111-0000-0000-000000000f69'::uuid, $$TE-1-074-3$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f6a'::uuid, $$TE-2289556-1$$, $$TE-2289556-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f6a'::uuid, '00000000-1111-0000-0000-000000000f6a'::uuid, $$TE-2289556-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f6b'::uuid, $$TE-8-142-4$$, $$TE-8-142-4$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f6b'::uuid, '00000000-1111-0000-0000-000000000f6b'::uuid, $$TE-8-142-4$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f6c'::uuid, $$CK-001$$, $$CK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f6c'::uuid, '00000000-1111-0000-0000-000000000f6c'::uuid, $$CK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f6d'::uuid, $$CK-002$$, $$CK-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f6d'::uuid, '00000000-1111-0000-0000-000000000f6d'::uuid, $$CK-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f6e'::uuid, $$TE-9-143-0$$, $$TE-9-143-0$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f6e'::uuid, '00000000-1111-0000-0000-000000000f6e'::uuid, $$TE-9-143-0$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f6f'::uuid, $$TE-9-130-1$$, $$TE-9-130-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f6f'::uuid, '00000000-1111-0000-0000-000000000f6f'::uuid, $$TE-9-130-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f70'::uuid, $$TE-9-130-5$$, $$TE-9-130-5$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f70'::uuid, '00000000-1111-0000-0000-000000000f70'::uuid, $$TE-9-130-5$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f71'::uuid, $$TE-9-130-3$$, $$TE-9-130-3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f71'::uuid, '00000000-1111-0000-0000-000000000f71'::uuid, $$TE-9-130-3$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f72'::uuid, $$YCM-063$$, $$YCM-063$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f72'::uuid, '00000000-1111-0000-0000-000000000f72'::uuid, $$YCM-063$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f73'::uuid, $$YCM-062$$, $$YCM-062$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f73'::uuid, '00000000-1111-0000-0000-000000000f73'::uuid, $$YCM-062$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f74'::uuid, $$TE-1-130-1$$, $$TE-1-130-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f74'::uuid, '00000000-1111-0000-0000-000000000f74'::uuid, $$TE-1-130-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f75'::uuid, $$TE-2-143-0$$, $$TE-2-143-0$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f75'::uuid, '00000000-1111-0000-0000-000000000f75'::uuid, $$TE-2-143-0$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f76'::uuid, $$TE-1-108-3$$, $$TE-1-108-3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f76'::uuid, '00000000-1111-0000-0000-000000000f76'::uuid, $$TE-1-108-3$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f77'::uuid, $$TE-1-108-4$$, $$TE-1-108-4$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f77'::uuid, '00000000-1111-0000-0000-000000000f77'::uuid, $$TE-1-108-4$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f79'::uuid, $$TE-9-130-6$$, $$TE-9-130-6$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f79'::uuid, '00000000-1111-0000-0000-000000000f79'::uuid, $$TE-9-130-6$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f7a'::uuid, $$TE-2822661-1$$, $$TE-2822661-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f7a'::uuid, '00000000-1111-0000-0000-000000000f7a'::uuid, $$TE-2822661-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f7b'::uuid, $$SMK-150$$, $$SMK-150$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f7b'::uuid, '00000000-1111-0000-0000-000000000f7b'::uuid, $$SMK-150$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f7c'::uuid, $$SMK-159$$, $$SMK-159$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f7c'::uuid, '00000000-1111-0000-0000-000000000f7c'::uuid, $$SMK-159$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f7d'::uuid, $$SMK-201$$, $$SMK-201$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f7d'::uuid, '00000000-1111-0000-0000-000000000f7d'::uuid, $$SMK-201$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f7e'::uuid, $$SMK-145$$, $$SMK-145$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f7e'::uuid, '00000000-1111-0000-0000-000000000f7e'::uuid, $$SMK-145$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f7f'::uuid, $$SMK-154$$, $$SMK-154$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f7f'::uuid, '00000000-1111-0000-0000-000000000f7f'::uuid, $$SMK-154$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f80'::uuid, $$SMK-102$$, $$SMK-102$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f80'::uuid, '00000000-1111-0000-0000-000000000f80'::uuid, $$SMK-102$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f81'::uuid, $$SMK-083$$, $$SMK-083$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f81'::uuid, '00000000-1111-0000-0000-000000000f81'::uuid, $$SMK-083$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f82'::uuid, $$SMK-172$$, $$SMK-172$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f82'::uuid, '00000000-1111-0000-0000-000000000f82'::uuid, $$SMK-172$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f83'::uuid, $$SMK-165$$, $$SMK-165$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f83'::uuid, '00000000-1111-0000-0000-000000000f83'::uuid, $$SMK-165$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f84'::uuid, $$SMK-046$$, $$SMK-046$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f84'::uuid, '00000000-1111-0000-0000-000000000f84'::uuid, $$SMK-046$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f85'::uuid, $$SMK-195$$, $$SMK-195$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f85'::uuid, '00000000-1111-0000-0000-000000000f85'::uuid, $$SMK-195$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f86'::uuid, $$SMK-199$$, $$SMK-199$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f86'::uuid, '00000000-1111-0000-0000-000000000f86'::uuid, $$SMK-199$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f87'::uuid, $$SMK-179$$, $$SMK-179$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f87'::uuid, '00000000-1111-0000-0000-000000000f87'::uuid, $$SMK-179$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f88'::uuid, $$SMK-098$$, $$SMK-098$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f88'::uuid, '00000000-1111-0000-0000-000000000f88'::uuid, $$SMK-098$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f89'::uuid, $$DIC-072$$, $$DIC-072$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f89'::uuid, '00000000-1111-0000-0000-000000000f89'::uuid, $$DIC-072$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f8a'::uuid, $$DIC-124$$, $$DIC-124$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f8a'::uuid, '00000000-1111-0000-0000-000000000f8a'::uuid, $$DIC-124$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f8b'::uuid, $$DIC-123$$, $$DIC-123$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f8b'::uuid, '00000000-1111-0000-0000-000000000f8b'::uuid, $$DIC-123$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f8c'::uuid, $$DIC-027$$, $$DIC-027$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f8c'::uuid, '00000000-1111-0000-0000-000000000f8c'::uuid, $$DIC-027$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f8e'::uuid, '00000000-1111-0000-0000-000000000122'::uuid, $$DIC-019-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f8f'::uuid, $$DIC-020$$, $$DIC-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f8f'::uuid, '00000000-1111-0000-0000-000000000f8f'::uuid, $$DIC-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f90'::uuid, $$DIC-080$$, $$DIC-080$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f90'::uuid, '00000000-1111-0000-0000-000000000f90'::uuid, $$DIC-080$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f91'::uuid, $$DIC-071$$, $$DIC-071$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f91'::uuid, '00000000-1111-0000-0000-000000000f91'::uuid, $$DIC-071$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f92'::uuid, $$DIC-081$$, $$DIC-081$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f92'::uuid, '00000000-1111-0000-0000-000000000f92'::uuid, $$DIC-081$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f93'::uuid, $$DIC-069$$, $$DIC-069$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f93'::uuid, '00000000-1111-0000-0000-000000000f93'::uuid, $$DIC-069$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f94'::uuid, $$DIC-128$$, $$DIC-128$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f94'::uuid, '00000000-1111-0000-0000-000000000f94'::uuid, $$DIC-128$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f95'::uuid, $$DIC-025$$, $$DIC-025$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f95'::uuid, '00000000-1111-0000-0000-000000000f95'::uuid, $$DIC-025$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f96'::uuid, $$DIC-079$$, $$DIC-079$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f96'::uuid, '00000000-1111-0000-0000-000000000f96'::uuid, $$DIC-079$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f97'::uuid, $$DIC-191$$, $$DIC-191$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f97'::uuid, '00000000-1111-0000-0000-000000000f97'::uuid, $$DIC-191$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f98'::uuid, $$DIC-182$$, $$DIC-182$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f98'::uuid, '00000000-1111-0000-0000-000000000f98'::uuid, $$DIC-182$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f99'::uuid, $$DIC-103$$, $$DIC-103$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f99'::uuid, '00000000-1111-0000-0000-000000000f99'::uuid, $$DIC-103$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f9a'::uuid, $$DIC-163$$, $$DIC-163$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f9a'::uuid, '00000000-1111-0000-0000-000000000f9a'::uuid, $$DIC-163$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f9b'::uuid, $$DIC-035$$, $$DIC-035$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f9b'::uuid, '00000000-1111-0000-0000-000000000f9b'::uuid, $$DIC-035$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f9c'::uuid, $$DIC-073$$, $$DIC-073$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f9c'::uuid, '00000000-1111-0000-0000-000000000f9c'::uuid, $$DIC-073$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f9d'::uuid, $$DIC-032$$, $$DIC-032$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f9d'::uuid, '00000000-1111-0000-0000-000000000f9d'::uuid, $$DIC-032$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f9e'::uuid, $$DIC-082$$, $$DIC-082$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f9e'::uuid, '00000000-1111-0000-0000-000000000f9e'::uuid, $$DIC-082$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000f9f'::uuid, $$DIC-029$$, $$DIC-029$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000f9f'::uuid, '00000000-1111-0000-0000-000000000f9f'::uuid, $$DIC-029$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fa0'::uuid, $$DIC-034$$, $$DIC-034$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fa0'::uuid, '00000000-1111-0000-0000-000000000fa0'::uuid, $$DIC-034$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fa1'::uuid, $$SMK-157$$, $$SMK-157$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fa1'::uuid, '00000000-1111-0000-0000-000000000fa1'::uuid, $$SMK-157$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fa2'::uuid, $$SMK-206$$, $$SMK-206$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fa2'::uuid, '00000000-1111-0000-0000-000000000fa2'::uuid, $$SMK-206$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fa3'::uuid, $$SMK-196$$, $$SMK-196$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fa3'::uuid, '00000000-1111-0000-0000-000000000fa3'::uuid, $$SMK-196$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fa4'::uuid, $$SMK-076$$, $$SMK-076 R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fa4'::uuid, '00000000-1111-0000-0000-000000000fa4'::uuid, $$SMK-076-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fa5'::uuid, $$SMK-101$$, $$SMK-101$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fa5'::uuid, '00000000-1111-0000-0000-000000000fa5'::uuid, $$SMK-101$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fa6'::uuid, $$SMK-136$$, $$SMK-136$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fa6'::uuid, '00000000-1111-0000-0000-000000000fa6'::uuid, $$SMK-136$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fa7'::uuid, $$SMK-197$$, $$SMK-197$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fa7'::uuid, '00000000-1111-0000-0000-000000000fa7'::uuid, $$SMK-197$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fa8'::uuid, $$SMK-173$$, $$SMK-173$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fa8'::uuid, '00000000-1111-0000-0000-000000000fa8'::uuid, $$SMK-173$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fa9'::uuid, $$SMK-153$$, $$SMK-153$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fa9'::uuid, '00000000-1111-0000-0000-000000000fa9'::uuid, $$SMK-153$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000faa'::uuid, $$SMK-105$$, $$SMK-105$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000faa'::uuid, '00000000-1111-0000-0000-000000000faa'::uuid, $$SMK-105$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fab'::uuid, $$SMK-190$$, $$SMK-190$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fab'::uuid, '00000000-1111-0000-0000-000000000fab'::uuid, $$SMK-190$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fac'::uuid, $$SMK-138$$, $$SMK-138$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fac'::uuid, '00000000-1111-0000-0000-000000000fac'::uuid, $$SMK-138$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fad'::uuid, $$HSK-060$$, $$HSK-060$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fad'::uuid, '00000000-1111-0000-0000-000000000fad'::uuid, $$HSK-060$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fae'::uuid, $$HSK-046$$, $$HSK-046$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fae'::uuid, '00000000-1111-0000-0000-000000000fae'::uuid, $$HSK-046$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000faf'::uuid, $$HSK-047$$, $$HSK-047$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000faf'::uuid, '00000000-1111-0000-0000-000000000faf'::uuid, $$HSK-047$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fb0'::uuid, $$MZT-052$$, $$MZT-052$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fb0'::uuid, '00000000-1111-0000-0000-000000000fb0'::uuid, $$MZT-052$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fb1'::uuid, $$TE-6-110-5$$, $$TE-6-110-5$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fb1'::uuid, '00000000-1111-0000-0000-000000000fb1'::uuid, $$TE-6-110-5$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fb2'::uuid, $$NPC-005$$, $$NPC-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fb2'::uuid, '00000000-1111-0000-0000-000000000fb2'::uuid, $$NPC-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fb4'::uuid, $$NPC-006$$, $$NPC-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fb4'::uuid, '00000000-1111-0000-0000-000000000fb4'::uuid, $$NPC-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fb5'::uuid, $$NPC-007$$, $$NPC-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fb5'::uuid, '00000000-1111-0000-0000-000000000fb5'::uuid, $$NPC-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fb6'::uuid, $$NPC-008$$, $$NPC-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fb6'::uuid, '00000000-1111-0000-0000-000000000fb6'::uuid, $$NPC-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fb7'::uuid, $$NPC-009$$, $$NPC-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fb7'::uuid, '00000000-1111-0000-0000-000000000fb7'::uuid, $$NPC-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fb8'::uuid, $$NPC-010$$, $$NPC-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fb8'::uuid, '00000000-1111-0000-0000-000000000fb8'::uuid, $$NPC-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fba'::uuid, $$PT-5-25$$, $$PT-5-25$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fba'::uuid, '00000000-1111-0000-0000-000000000fba'::uuid, $$PT-5-25$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fbc'::uuid, $$PT-5-40$$, $$PT-5-40$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fbc'::uuid, '00000000-1111-0000-0000-000000000fbc'::uuid, $$PT-5-40$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fbd'::uuid, $$GW-2K-R1-100$$, $$GW-2K-R1-100$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fbd'::uuid, '00000000-1111-0000-0000-000000000fbd'::uuid, $$GW-2K-R1-100$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fbe'::uuid, $$YSD-G$$, $$YSD-G$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fbe'::uuid, '00000000-1111-0000-0000-000000000fbe'::uuid, $$YSD-G$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fbf'::uuid, $$ODS-002$$, $$ODS-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fbf'::uuid, '00000000-1111-0000-0000-000000000fbf'::uuid, $$ODS-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fc0'::uuid, $$ELP-030$$, $$ELP-030$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fc0'::uuid, '00000000-1111-0000-0000-000000000fc0'::uuid, $$ELP-030$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fc1'::uuid, $$SK-003$$, $$SK-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fc1'::uuid, '00000000-1111-0000-0000-000000000fc1'::uuid, $$SK-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fc2'::uuid, $$TE-7-130-0$$, $$TE-7-130-0$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fc2'::uuid, '00000000-1111-0000-0000-000000000fc2'::uuid, $$TE-7-130-0$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fc3'::uuid, $$TE-8-103-5$$, $$TE-8-103-5$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fc3'::uuid, '00000000-1111-0000-0000-000000000fc3'::uuid, $$TE-8-103-5$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fc4'::uuid, $$TE-2-045-6$$, $$TE-2-045-6$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fc4'::uuid, '00000000-1111-0000-0000-000000000fc4'::uuid, $$TE-2-045-6$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fc6'::uuid, $$TE-194$$, $$TE-194$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fc6'::uuid, '00000000-1111-0000-0000-000000000fc6'::uuid, $$TE-194$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fc8'::uuid, $$TE-0-073-1$$, $$TE-0-073-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fc8'::uuid, '00000000-1111-0000-0000-000000000fc8'::uuid, $$TE-0-073-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fca'::uuid, $$TE-2-076-1$$, $$TE-2-076-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fca'::uuid, '00000000-1111-0000-0000-000000000fca'::uuid, $$TE-2-076-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fcb'::uuid, $$TE-5-077-2$$, $$TE-5-077-2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fcb'::uuid, '00000000-1111-0000-0000-000000000fcb'::uuid, $$TE-5-077-2$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fcc'::uuid, $$TE-6-076-6$$, $$TE-6-076-6$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fcc'::uuid, '00000000-1111-0000-0000-000000000fcc'::uuid, $$TE-6-076-6$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fcd'::uuid, $$TE-7-072-5$$, $$TE-7-072-5$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fcd'::uuid, '00000000-1111-0000-0000-000000000fcd'::uuid, $$TE-7-072-5$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fd2'::uuid, $$YSD-D$$, $$YSD-D$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fd2'::uuid, '00000000-1111-0000-0000-000000000fd2'::uuid, $$YSD-D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fd3'::uuid, $$ADV-004$$, $$ADV-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fd3'::uuid, '00000000-1111-0000-0000-000000000fd3'::uuid, $$ADV-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fd4'::uuid, $$SK-017$$, $$SK-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fd4'::uuid, '00000000-1111-0000-0000-000000000fd4'::uuid, $$SK-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fd5'::uuid, $$SK-018$$, $$SK-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fd5'::uuid, '00000000-1111-0000-0000-000000000fd5'::uuid, $$SK-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fd6'::uuid, $$SK-022$$, $$SK-022$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fd6'::uuid, '00000000-1111-0000-0000-000000000fd6'::uuid, $$SK-022$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fd7'::uuid, $$ELP-010$$, $$ELP-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fd7'::uuid, '00000000-1111-0000-0000-000000000fd7'::uuid, $$ELP-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fd8'::uuid, $$TE-7-074-3$$, $$TE-7-074-3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fd8'::uuid, '00000000-1111-0000-0000-000000000fd8'::uuid, $$TE-7-074-3$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fd9'::uuid, $$TE-7-074-4$$, $$TE-7-074-4$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fd9'::uuid, '00000000-1111-0000-0000-000000000fd9'::uuid, $$TE-7-074-4$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fdb'::uuid, $$TE-4-023-3$$, $$TE-4-023-3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fdb'::uuid, '00000000-1111-0000-0000-000000000fdb'::uuid, $$TE-4-023-3$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fdc'::uuid, $$TE-3-161-0$$, $$TE-3-161-0$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fdc'::uuid, '00000000-1111-0000-0000-000000000fdc'::uuid, $$TE-3-161-0$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fdd'::uuid, $$ADV-192$$, $$ADV-192$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fdd'::uuid, '00000000-1111-0000-0000-000000000fdd'::uuid, $$ADV-192$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fdf'::uuid, $$CST-010$$, $$CST-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fdf'::uuid, '00000000-1111-0000-0000-000000000fdf'::uuid, $$CST-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fe0'::uuid, $$CST-011$$, $$CST-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fe0'::uuid, '00000000-1111-0000-0000-000000000fe0'::uuid, $$CST-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fe1'::uuid, $$DIC-021$$, $$DIC-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fe1'::uuid, '00000000-1111-0000-0000-000000000fe1'::uuid, $$DIC-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fe2'::uuid, $$TE-0-130-6$$, $$TE-0-130-6$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fe2'::uuid, '00000000-1111-0000-0000-000000000fe2'::uuid, $$TE-0-130-6$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fe3'::uuid, $$NPC-001$$, $$NPC-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fe3'::uuid, '00000000-1111-0000-0000-000000000fe3'::uuid, $$NPC-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fe4'::uuid, $$KDS-042$$, $$KDS-042$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fe4'::uuid, '00000000-1111-0000-0000-000000000fe4'::uuid, $$KDS-042$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fe5'::uuid, $$ADV-001$$, $$ADV-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fe5'::uuid, '00000000-1111-0000-0000-000000000fe5'::uuid, $$ADV-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fe6'::uuid, $$SMK-161$$, $$SMK-161 R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fe6'::uuid, '00000000-1111-0000-0000-000000000fe6'::uuid, $$SMK-161-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fe7'::uuid, $$RS-001-01$$, $$RS-001-01 R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fe7'::uuid, '00000000-1111-0000-0000-000000000fe7'::uuid, $$RS-001-01-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fe8'::uuid, $$MOK-005$$, $$MOK-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fe8'::uuid, '00000000-1111-0000-0000-000000000fe8'::uuid, $$MOK-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fe9'::uuid, $$SMK-087$$, $$SMK-087$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fe9'::uuid, '00000000-1111-0000-0000-000000000fe9'::uuid, $$SMK-087$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fea'::uuid, $$YMT-011$$, $$YMT-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fea'::uuid, '00000000-1111-0000-0000-000000000fea'::uuid, $$YMT-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000feb'::uuid, $$DIC-154$$, $$DIC-154$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000feb'::uuid, '00000000-1111-0000-0000-000000000feb'::uuid, $$DIC-154$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fec'::uuid, $$TKS-020$$, $$TKS-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fec'::uuid, '00000000-1111-0000-0000-000000000fec'::uuid, $$TKS-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fee'::uuid, $$TE-6-159-8D$$, $$TE-6-159-8D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fee'::uuid, '00000000-1111-0000-0000-000000000fee'::uuid, $$TE-6-159-8D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fef'::uuid, $$DIC-155$$, $$DIC-155$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fef'::uuid, '00000000-1111-0000-0000-000000000fef'::uuid, $$DIC-155$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ff0'::uuid, $$TE-1-163-1$$, $$TE-1-163-1 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ff0'::uuid, '00000000-1111-0000-0000-000000000ff0'::uuid, $$TE-1-163-1-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ff1'::uuid, $$TE-1-163-2$$, $$TE-1-163-2 R4$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ff1'::uuid, '00000000-1111-0000-0000-000000000ff1'::uuid, $$TE-1-163-2-R4$$, 4, $$R4$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ff2'::uuid, $$KBY-002$$, $$KBY-002 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ff2'::uuid, '00000000-1111-0000-0000-000000000ff2'::uuid, $$KBY-002-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ff3'::uuid, '00000000-1111-0000-0000-000000000b8b'::uuid, $$TE-9-162-7-R4$$, 4, $$R4$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ff6'::uuid, $$ASH-008D$$, $$ASH-008D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ff6'::uuid, '00000000-1111-0000-0000-000000000ff6'::uuid, $$ASH-008D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ff8'::uuid, '00000000-1111-0000-0000-000000000b1c'::uuid, $$TE-6-159-7-R4$$, 4, $$R4$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ff9'::uuid, $$TE-6-159-8$$, $$TE-6-159-8 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ff9'::uuid, '00000000-1111-0000-0000-000000000ff9'::uuid, $$TE-6-159-8-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ffb'::uuid, $$ASH-009D$$, $$ASH-009D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ffb'::uuid, '00000000-1111-0000-0000-000000000ffb'::uuid, $$ASH-009D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ffd'::uuid, $$KRE-013$$, $$KRE-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ffd'::uuid, '00000000-1111-0000-0000-000000000ffd'::uuid, $$KRE-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000ffe'::uuid, $$TH-001$$, $$TH-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000ffe'::uuid, '00000000-1111-0000-0000-000000000ffe'::uuid, $$TH-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000fff'::uuid, $$TH-002$$, $$TH-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000fff'::uuid, '00000000-1111-0000-0000-000000000fff'::uuid, $$TH-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001000'::uuid, $$TH-003$$, $$TH-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001000'::uuid, '00000000-1111-0000-0000-000000001000'::uuid, $$TH-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001001'::uuid, $$TH-005$$, $$TH-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001001'::uuid, '00000000-1111-0000-0000-000000001001'::uuid, $$TH-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001002'::uuid, $$JAE-337$$, $$JAE-337$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001002'::uuid, '00000000-1111-0000-0000-000000001002'::uuid, $$JAE-337$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001003'::uuid, $$SIT-024$$, $$SIT-024$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001003'::uuid, '00000000-1111-0000-0000-000000001003'::uuid, $$SIT-024$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001004'::uuid, $$YCM-075$$, $$YCM-075 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001004'::uuid, '00000000-1111-0000-0000-000000001004'::uuid, $$YCM-075-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001005'::uuid, '00000000-1111-0000-0000-000000000432'::uuid, $$KSE-002-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001006'::uuid, $$SK-006$$, $$SK-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001006'::uuid, '00000000-1111-0000-0000-000000001006'::uuid, $$SK-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001007'::uuid, $$SK-013$$, $$SK-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001007'::uuid, '00000000-1111-0000-0000-000000001007'::uuid, $$SK-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001008'::uuid, $$SK-016$$, $$SK-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001008'::uuid, '00000000-1111-0000-0000-000000001008'::uuid, $$SK-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001009'::uuid, $$SK-021$$, $$SK-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001009'::uuid, '00000000-1111-0000-0000-000000001009'::uuid, $$SK-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000100a'::uuid, $$SK-023$$, $$SK-023$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000100a'::uuid, '00000000-1111-0000-0000-00000000100a'::uuid, $$SK-023$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000100b'::uuid, $$SK-025$$, $$SK-025$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000100b'::uuid, '00000000-1111-0000-0000-00000000100b'::uuid, $$SK-025$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000100c'::uuid, $$SK-027$$, $$SK-027$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000100c'::uuid, '00000000-1111-0000-0000-00000000100c'::uuid, $$SK-027$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000100d'::uuid, $$SK-032$$, $$SK-032$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000100d'::uuid, '00000000-1111-0000-0000-00000000100d'::uuid, $$SK-032$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000100e'::uuid, $$SK-034$$, $$SK-034$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000100e'::uuid, '00000000-1111-0000-0000-00000000100e'::uuid, $$SK-034$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000100f'::uuid, $$SK-038$$, $$SK-038$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000100f'::uuid, '00000000-1111-0000-0000-00000000100f'::uuid, $$SK-038$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001010'::uuid, $$SK-040$$, $$SK-040$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001010'::uuid, '00000000-1111-0000-0000-000000001010'::uuid, $$SK-040$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001011'::uuid, $$SK-041$$, $$SK-041$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001011'::uuid, '00000000-1111-0000-0000-000000001011'::uuid, $$SK-041$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001012'::uuid, $$SK-044$$, $$SK-044$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001012'::uuid, '00000000-1111-0000-0000-000000001012'::uuid, $$SK-044$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001013'::uuid, $$SK-045$$, $$SK-045$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001013'::uuid, '00000000-1111-0000-0000-000000001013'::uuid, $$SK-045$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001014'::uuid, '00000000-1111-0000-0000-000000000803'::uuid, $$SK-046-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001015'::uuid, $$SK-047$$, $$SK-047$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001015'::uuid, '00000000-1111-0000-0000-000000001015'::uuid, $$SK-047$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001016'::uuid, $$ADV-003$$, $$ADV-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001016'::uuid, '00000000-1111-0000-0000-000000001016'::uuid, $$ADV-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001017'::uuid, $$ADV-005$$, $$ADV-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001017'::uuid, '00000000-1111-0000-0000-000000001017'::uuid, $$ADV-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001018'::uuid, $$ADV-010$$, $$ADV-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001018'::uuid, '00000000-1111-0000-0000-000000001018'::uuid, $$ADV-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001019'::uuid, $$ADV-011$$, $$ADV-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001019'::uuid, '00000000-1111-0000-0000-000000001019'::uuid, $$ADV-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000101a'::uuid, $$ADV-012$$, $$ADV-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000101a'::uuid, '00000000-1111-0000-0000-00000000101a'::uuid, $$ADV-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000101b'::uuid, $$ADV-013$$, $$ADV-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000101b'::uuid, '00000000-1111-0000-0000-00000000101b'::uuid, $$ADV-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000101c'::uuid, $$ADV-016$$, $$ADV-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000101c'::uuid, '00000000-1111-0000-0000-00000000101c'::uuid, $$ADV-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000101d'::uuid, $$ADV-020$$, $$ADV-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000101d'::uuid, '00000000-1111-0000-0000-00000000101d'::uuid, $$ADV-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000101e'::uuid, $$ADV-021$$, $$ADV-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000101e'::uuid, '00000000-1111-0000-0000-00000000101e'::uuid, $$ADV-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000101f'::uuid, $$TH-020$$, $$TH-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000101f'::uuid, '00000000-1111-0000-0000-00000000101f'::uuid, $$TH-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001020'::uuid, $$TH-021$$, $$TH-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001020'::uuid, '00000000-1111-0000-0000-000000001020'::uuid, $$TH-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001021'::uuid, $$TH-025$$, $$TH-025$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001021'::uuid, '00000000-1111-0000-0000-000000001021'::uuid, $$TH-025$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001022'::uuid, $$TH-041$$, $$TH-041$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001022'::uuid, '00000000-1111-0000-0000-000000001022'::uuid, $$TH-041$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001023'::uuid, $$TH-054$$, $$TH-054$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001023'::uuid, '00000000-1111-0000-0000-000000001023'::uuid, $$TH-054$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001024'::uuid, $$TH-053$$, $$TH-053$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001024'::uuid, '00000000-1111-0000-0000-000000001024'::uuid, $$TH-053$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001025'::uuid, $$TH-052$$, $$TH-052$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001025'::uuid, '00000000-1111-0000-0000-000000001025'::uuid, $$TH-052$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001026'::uuid, $$SPJ-035$$, $$SPJ-035$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001026'::uuid, '00000000-1111-0000-0000-000000001026'::uuid, $$SPJ-035$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001027'::uuid, $$SPJ-037$$, $$SPJ-037$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001027'::uuid, '00000000-1111-0000-0000-000000001027'::uuid, $$SPJ-037$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001028'::uuid, $$SPJ-038$$, $$SPJ-038$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001028'::uuid, '00000000-1111-0000-0000-000000001028'::uuid, $$SPJ-038$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001029'::uuid, $$SPJ-039$$, $$SPJ-039$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001029'::uuid, '00000000-1111-0000-0000-000000001029'::uuid, $$SPJ-039$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000102a'::uuid, $$SPJ-041$$, $$SPJ-041$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000102a'::uuid, '00000000-1111-0000-0000-00000000102a'::uuid, $$SPJ-041$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000102b'::uuid, $$SPJ-045$$, $$SPJ-045$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000102b'::uuid, '00000000-1111-0000-0000-00000000102b'::uuid, $$SPJ-045$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000102c'::uuid, $$SPJ-049$$, $$SPJ-049$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000102c'::uuid, '00000000-1111-0000-0000-00000000102c'::uuid, $$SPJ-049$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000102d'::uuid, $$SPJ-042$$, $$SPJ-042$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000102d'::uuid, '00000000-1111-0000-0000-00000000102d'::uuid, $$SPJ-042$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000102e'::uuid, $$SPJ-050$$, $$SPJ-050$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000102e'::uuid, '00000000-1111-0000-0000-00000000102e'::uuid, $$SPJ-050$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000102f'::uuid, $$KRE-002$$, $$KRE-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000102f'::uuid, '00000000-1111-0000-0000-00000000102f'::uuid, $$KRE-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001030'::uuid, $$KRE-004$$, $$KRE-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001030'::uuid, '00000000-1111-0000-0000-000000001030'::uuid, $$KRE-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001031'::uuid, $$KRE-005$$, $$KRE-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001031'::uuid, '00000000-1111-0000-0000-000000001031'::uuid, $$KRE-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001032'::uuid, $$KRE-006$$, $$KRE-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001032'::uuid, '00000000-1111-0000-0000-000000001032'::uuid, $$KRE-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001033'::uuid, $$KRE-007$$, $$KRE-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001033'::uuid, '00000000-1111-0000-0000-000000001033'::uuid, $$KRE-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001034'::uuid, $$KRE-011$$, $$KRE-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001034'::uuid, '00000000-1111-0000-0000-000000001034'::uuid, $$KRE-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001035'::uuid, $$KRE-017$$, $$KRE-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001035'::uuid, '00000000-1111-0000-0000-000000001035'::uuid, $$KRE-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001036'::uuid, $$KRE-040$$, $$KRE-040R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001036'::uuid, '00000000-1111-0000-0000-000000001036'::uuid, $$KRE-040-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001037'::uuid, $$KRE-041$$, $$KRE-041$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001037'::uuid, '00000000-1111-0000-0000-000000001037'::uuid, $$KRE-041$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001038'::uuid, $$KRE-042$$, $$KRE-042$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001038'::uuid, '00000000-1111-0000-0000-000000001038'::uuid, $$KRE-042$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001039'::uuid, $$KRE-047$$, $$KRE-047$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001039'::uuid, '00000000-1111-0000-0000-000000001039'::uuid, $$KRE-047$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000103a'::uuid, $$KRE-051$$, $$KRE-051$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000103a'::uuid, '00000000-1111-0000-0000-00000000103a'::uuid, $$KRE-051$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000103b'::uuid, $$CST-012$$, $$CST-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000103b'::uuid, '00000000-1111-0000-0000-00000000103b'::uuid, $$CST-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000103c'::uuid, $$CST-013$$, $$CST-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000103c'::uuid, '00000000-1111-0000-0000-00000000103c'::uuid, $$CST-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000103e'::uuid, $$KSP-028$$, $$KSP-028$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000103e'::uuid, '00000000-1111-0000-0000-00000000103e'::uuid, $$KSP-028$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000103f'::uuid, $$KSP-047$$, $$KSP-047$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000103f'::uuid, '00000000-1111-0000-0000-00000000103f'::uuid, $$KSP-047$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001040'::uuid, $$KSP-048$$, $$KSP-048$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001040'::uuid, '00000000-1111-0000-0000-000000001040'::uuid, $$KSP-048$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001041'::uuid, $$KSP-049A$$, $$KSP-049A$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001041'::uuid, '00000000-1111-0000-0000-000000001041'::uuid, $$KSP-049A$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001042'::uuid, $$KSP-051AB$$, $$KSP-051AB$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$AB$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001042'::uuid, '00000000-1111-0000-0000-000000001042'::uuid, $$KSP-051AB$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001043'::uuid, $$KSP-052$$, $$KSP-052$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001043'::uuid, '00000000-1111-0000-0000-000000001043'::uuid, $$KSP-052$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001044'::uuid, $$KSP-054AB$$, $$KSP-054AB$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$AB$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001044'::uuid, '00000000-1111-0000-0000-000000001044'::uuid, $$KSP-054AB$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001045'::uuid, $$KSP-055$$, $$KSP-055$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001045'::uuid, '00000000-1111-0000-0000-000000001045'::uuid, $$KSP-055$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001046'::uuid, $$KSP-056$$, $$KSP-056$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001046'::uuid, '00000000-1111-0000-0000-000000001046'::uuid, $$KSP-056$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001047'::uuid, $$KSP-057$$, $$KSP-057$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001047'::uuid, '00000000-1111-0000-0000-000000001047'::uuid, $$KSP-057$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001048'::uuid, $$KSP-058$$, $$KSP-058$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001048'::uuid, '00000000-1111-0000-0000-000000001048'::uuid, $$KSP-058$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001049'::uuid, $$KSP-059$$, $$KSP-059$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001049'::uuid, '00000000-1111-0000-0000-000000001049'::uuid, $$KSP-059$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000104a'::uuid, $$KSP-060$$, $$KSP-060$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000104a'::uuid, '00000000-1111-0000-0000-00000000104a'::uuid, $$KSP-060$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000104b'::uuid, $$KSP-076AB$$, $$KSP-076AB$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$AB$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000104b'::uuid, '00000000-1111-0000-0000-00000000104b'::uuid, $$KSP-076AB$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000104c'::uuid, '00000000-1111-0000-0000-000000000494'::uuid, $$KSP-090-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000104d'::uuid, $$KSP-100$$, $$KSP-100$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000104d'::uuid, '00000000-1111-0000-0000-00000000104d'::uuid, $$KSP-100$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000104e'::uuid, $$ADY-052$$, $$ADY-052$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000104e'::uuid, '00000000-1111-0000-0000-00000000104e'::uuid, $$ADY-052$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000104f'::uuid, $$ADY-056$$, $$ADY-056$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000104f'::uuid, '00000000-1111-0000-0000-00000000104f'::uuid, $$ADY-056$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001050'::uuid, $$ADY-057$$, $$ADY-057$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001050'::uuid, '00000000-1111-0000-0000-000000001050'::uuid, $$ADY-057$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001051'::uuid, $$ADY-058$$, $$ADY-058$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001051'::uuid, '00000000-1111-0000-0000-000000001051'::uuid, $$ADY-058$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001053'::uuid, '00000000-1111-0000-0000-000000000054'::uuid, $$ADY-093$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001054'::uuid, $$ADY-095$$, $$ADY-095$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001054'::uuid, '00000000-1111-0000-0000-000000001054'::uuid, $$ADY-095$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001055'::uuid, $$ADY-100$$, $$ADY-100$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001055'::uuid, '00000000-1111-0000-0000-000000001055'::uuid, $$ADY-100$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001056'::uuid, $$ADY-109$$, $$ADY-109$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001056'::uuid, '00000000-1111-0000-0000-000000001056'::uuid, $$ADY-109$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001057'::uuid, $$ETS-023$$, $$ETS-023$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001057'::uuid, '00000000-1111-0000-0000-000000001057'::uuid, $$ETS-023$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001059'::uuid, $$DIC-047旧$$, $$DIC-047旧$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001059'::uuid, '00000000-1111-0000-0000-000000001059'::uuid, $$DIC-047旧$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000105a'::uuid, $$DIC-048旧$$, $$DIC-048旧$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000105a'::uuid, '00000000-1111-0000-0000-00000000105a'::uuid, $$DIC-048旧$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000105b'::uuid, $$MZT-003$$, $$MZT-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000105b'::uuid, '00000000-1111-0000-0000-00000000105b'::uuid, $$MZT-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000105c'::uuid, $$MZT-004$$, $$MZT-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000105c'::uuid, '00000000-1111-0000-0000-00000000105c'::uuid, $$MZT-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000105d'::uuid, $$MZT-011$$, $$MZT-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000105d'::uuid, '00000000-1111-0000-0000-00000000105d'::uuid, $$MZT-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001063'::uuid, $$MZT-017$$, $$MZT-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001063'::uuid, '00000000-1111-0000-0000-000000001063'::uuid, $$MZT-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001065'::uuid, $$MZT-018$$, $$MZT-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001065'::uuid, '00000000-1111-0000-0000-000000001065'::uuid, $$MZT-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001066'::uuid, $$MZT-022$$, $$MZT-022$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001066'::uuid, '00000000-1111-0000-0000-000000001066'::uuid, $$MZT-022$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001068'::uuid, $$下スタキング　Aタイプ$$, $$下スタキング　A タイプ$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001068'::uuid, '00000000-1111-0000-0000-000000001068'::uuid, $$下スタキング　Aタイプ$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001069'::uuid, $$MZT-024$$, $$MZT-024$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001069'::uuid, '00000000-1111-0000-0000-000000001069'::uuid, $$MZT-024$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000106a'::uuid, $$MZT-027$$, $$MZT-027$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000106a'::uuid, '00000000-1111-0000-0000-00000000106a'::uuid, $$MZT-027$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000106b'::uuid, $$MZT-030$$, $$MZT-030$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000106b'::uuid, '00000000-1111-0000-0000-00000000106b'::uuid, $$MZT-030$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000106c'::uuid, $$MZT-033$$, $$MZT-033$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000106c'::uuid, '00000000-1111-0000-0000-00000000106c'::uuid, $$MZT-033$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000106d'::uuid, $$MZT-035$$, $$MZT-035$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000106d'::uuid, '00000000-1111-0000-0000-00000000106d'::uuid, $$MZT-035$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000106e'::uuid, $$MZT-039$$, $$MZT-039$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000106e'::uuid, '00000000-1111-0000-0000-00000000106e'::uuid, $$MZT-039$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000106f'::uuid, $$MZT-040$$, $$MZT-040$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000106f'::uuid, '00000000-1111-0000-0000-00000000106f'::uuid, $$MZT-040$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001070'::uuid, $$MZT-043$$, $$MZT-043$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001070'::uuid, '00000000-1111-0000-0000-000000001070'::uuid, $$MZT-043$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001071'::uuid, $$MZT-044$$, $$MZT-044$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001071'::uuid, '00000000-1111-0000-0000-000000001071'::uuid, $$MZT-044$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001072'::uuid, $$MZT-053$$, $$MZT-053$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001072'::uuid, '00000000-1111-0000-0000-000000001072'::uuid, $$MZT-053$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001073'::uuid, $$MZT-059$$, $$MZT-059$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001073'::uuid, '00000000-1111-0000-0000-000000001073'::uuid, $$MZT-059$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001074'::uuid, $$MZT-066$$, $$MZT-066$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001074'::uuid, '00000000-1111-0000-0000-000000001074'::uuid, $$MZT-066$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001075'::uuid, $$MZT-071$$, $$MZT-071$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001075'::uuid, '00000000-1111-0000-0000-000000001075'::uuid, $$MZT-071$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;

COMMIT;
