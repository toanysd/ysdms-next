-- PART 9/14
BEGIN;

INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001076'::uuid, $$MZT-072$$, $$MZT-072$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001076'::uuid, '00000000-1111-0000-0000-000000001076'::uuid, $$MZT-072$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001077'::uuid, $$HSH-002$$, $$HSH-002 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001077'::uuid, '00000000-1111-0000-0000-000000001077'::uuid, $$HSH-002-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001078'::uuid, '00000000-1111-0000-0000-00000000053c'::uuid, $$MCT-001D-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001079'::uuid, $$KSP-117$$, $$KSP-117$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001079'::uuid, '00000000-1111-0000-0000-000000001079'::uuid, $$KSP-117$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000107a'::uuid, $$MCT-003$$, $$MCT-003 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000107a'::uuid, '00000000-1111-0000-0000-00000000107a'::uuid, $$MCT-003-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000107b'::uuid, $$MTM-018$$, $$MTM-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000107b'::uuid, '00000000-1111-0000-0000-00000000107b'::uuid, $$MTM-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000107c'::uuid, $$MMT-018$$, $$MMT-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000107c'::uuid, '00000000-1111-0000-0000-00000000107c'::uuid, $$MMT-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000107e'::uuid, $$TE-2501699-1$$, $$TE-2501699-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000107e'::uuid, '00000000-1111-0000-0000-00000000107e'::uuid, $$TE-2501699-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000107f'::uuid, $$BOC-001$$, $$BOC-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000107f'::uuid, '00000000-1111-0000-0000-00000000107f'::uuid, $$BOC-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001080'::uuid, $$K-タイプ　70$$, $$K-タイプ　70$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001080'::uuid, '00000000-1111-0000-0000-000000001080'::uuid, $$K-タイプ　70$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001081'::uuid, $$TBG-020$$, $$TBG-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001081'::uuid, '00000000-1111-0000-0000-000000001081'::uuid, $$TBG-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001082'::uuid, $$NGD-001$$, $$NGD-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001082'::uuid, '00000000-1111-0000-0000-000000001082'::uuid, $$NGD-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001083'::uuid, $$NHC-004$$, $$NHC-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001083'::uuid, '00000000-1111-0000-0000-000000001083'::uuid, $$NHC-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001086'::uuid, $$QAS-001$$, $$QAS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001086'::uuid, '00000000-1111-0000-0000-000000001086'::uuid, $$QAS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001087'::uuid, $$KDS-072$$, $$KDS-072$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001087'::uuid, '00000000-1111-0000-0000-000000001087'::uuid, $$KDS-072$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001088'::uuid, $$KDS-086$$, $$KDS-086$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001088'::uuid, '00000000-1111-0000-0000-000000001088'::uuid, $$KDS-086$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001089'::uuid, $$HKS-009$$, $$HKS-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001089'::uuid, '00000000-1111-0000-0000-000000001089'::uuid, $$HKS-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000108a'::uuid, $$NHC-005$$, $$NHC-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000108a'::uuid, '00000000-1111-0000-0000-00000000108a'::uuid, $$NHC-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000108b'::uuid, $$KDS-076$$, $$KDS-076$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000108b'::uuid, '00000000-1111-0000-0000-00000000108b'::uuid, $$KDS-076$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000108c'::uuid, $$KDS-077$$, $$KDS-077$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000108c'::uuid, '00000000-1111-0000-0000-00000000108c'::uuid, $$KDS-077$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000108d'::uuid, $$KDS-245$$, $$KDS-245$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000108d'::uuid, '00000000-1111-0000-0000-00000000108d'::uuid, $$KDS-245$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000108e'::uuid, $$KDS-099$$, $$KDS-099$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000108e'::uuid, '00000000-1111-0000-0000-00000000108e'::uuid, $$KDS-099$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000108f'::uuid, $$MIS-2-002$$, $$MIS-2-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000108f'::uuid, '00000000-1111-0000-0000-00000000108f'::uuid, $$MIS-2-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001090'::uuid, $$MIS-2-003$$, $$MIS-2-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001090'::uuid, '00000000-1111-0000-0000-000000001090'::uuid, $$MIS-2-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001091'::uuid, $$KDS-083$$, $$KDS-083$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001091'::uuid, '00000000-1111-0000-0000-000000001091'::uuid, $$KDS-083$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001092'::uuid, $$KDS-084$$, $$KDS-084$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001092'::uuid, '00000000-1111-0000-0000-000000001092'::uuid, $$KDS-084$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001093'::uuid, $$KDS-085$$, $$KDS-085$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001093'::uuid, '00000000-1111-0000-0000-000000001093'::uuid, $$KDS-085$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001094'::uuid, $$JAE-109$$, $$JAE-109$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001094'::uuid, '00000000-1111-0000-0000-000000001094'::uuid, $$JAE-109$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001096'::uuid, $$TE-3-157-7$$, $$TE-3-157-7$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001096'::uuid, '00000000-1111-0000-0000-000000001096'::uuid, $$TE-3-157-7$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001097'::uuid, $$SMK-194$$, $$SMK-194$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001097'::uuid, '00000000-1111-0000-0000-000000001097'::uuid, $$SMK-194$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001098'::uuid, $$SMK-200$$, $$SMK-200$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001098'::uuid, '00000000-1111-0000-0000-000000001098'::uuid, $$SMK-200$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001099'::uuid, $$SSI-003$$, $$SSI-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001099'::uuid, '00000000-1111-0000-0000-000000001099'::uuid, $$SSI-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000109a'::uuid, $$OTAX-021$$, $$OTAX-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000109a'::uuid, '00000000-1111-0000-0000-00000000109a'::uuid, $$OTAX-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000109b'::uuid, $$IBG-001$$, $$IBG-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000109b'::uuid, '00000000-1111-0000-0000-00000000109b'::uuid, $$IBG-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000109c'::uuid, $$KYM-001$$, $$KYM-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000109c'::uuid, '00000000-1111-0000-0000-00000000109c'::uuid, $$KYM-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000109d'::uuid, $$KYM-002$$, $$KYM-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000109d'::uuid, '00000000-1111-0000-0000-00000000109d'::uuid, $$KYM-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000109e'::uuid, $$KYM-003$$, $$KYM-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000109e'::uuid, '00000000-1111-0000-0000-00000000109e'::uuid, $$KYM-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000109f'::uuid, $$TE-3-720996-6$$, $$TE-3-720996-6$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000109f'::uuid, '00000000-1111-0000-0000-00000000109f'::uuid, $$TE-3-720996-6$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010a0'::uuid, $$MZT-104$$, $$MZT-104$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010a0'::uuid, '00000000-1111-0000-0000-0000000010a0'::uuid, $$MZT-104$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010a1'::uuid, $$SNS-002$$, $$SNS-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010a1'::uuid, '00000000-1111-0000-0000-0000000010a1'::uuid, $$SNS-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010a2'::uuid, $$MKD-006$$, $$MKD-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010a2'::uuid, '00000000-1111-0000-0000-0000000010a2'::uuid, $$MKD-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010a3'::uuid, $$KND$$, $$KND$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010a3'::uuid, '00000000-1111-0000-0000-0000000010a3'::uuid, $$KND$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010a4'::uuid, $$J$$, $$JR$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010a4'::uuid, '00000000-1111-0000-0000-0000000010a4'::uuid, $$J-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010a5'::uuid, $$TE-0-108-3$$, $$TE-0-108-3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010a5'::uuid, '00000000-1111-0000-0000-0000000010a5'::uuid, $$TE-0-108-3$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010a6'::uuid, $$NPC$$, $$NPC$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010a6'::uuid, '00000000-1111-0000-0000-0000000010a6'::uuid, $$NPC$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010a7'::uuid, $$SMK-155$$, $$SMK-155$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010a7'::uuid, '00000000-1111-0000-0000-0000000010a7'::uuid, $$SMK-155$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010a8'::uuid, $$YSD-E$$, $$YSD-E$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010a8'::uuid, '00000000-1111-0000-0000-0000000010a8'::uuid, $$YSD-E$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010a9'::uuid, $$PS-100-1$$, $$PS-100-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010a9'::uuid, '00000000-1111-0000-0000-0000000010a9'::uuid, $$PS-100-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010aa'::uuid, $$TH$$, $$TH$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010aa'::uuid, '00000000-1111-0000-0000-0000000010aa'::uuid, $$TH$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010ab'::uuid, $$TE-2-135-8$$, $$TE-2-135-8$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010ab'::uuid, '00000000-1111-0000-0000-0000000010ab'::uuid, $$TE-2-135-8$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010ac'::uuid, $$KGD-002$$, $$KGD-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010ac'::uuid, '00000000-1111-0000-0000-0000000010ac'::uuid, $$KGD-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010ad'::uuid, $$YSD-H$$, $$YSD-H$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010ad'::uuid, '00000000-1111-0000-0000-0000000010ad'::uuid, $$YSD-H$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010ae'::uuid, $$SSJ-013$$, $$SSJ-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010ae'::uuid, '00000000-1111-0000-0000-0000000010ae'::uuid, $$SSJ-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010af'::uuid, $$SSJ-019$$, $$SSJ-019$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010af'::uuid, '00000000-1111-0000-0000-0000000010af'::uuid, $$SSJ-019$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010b0'::uuid, $$YPC-005$$, $$YPC-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010b0'::uuid, '00000000-1111-0000-0000-0000000010b0'::uuid, $$YPC-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010b1'::uuid, $$YPC-008$$, $$YPC-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010b1'::uuid, '00000000-1111-0000-0000-0000000010b1'::uuid, $$YPC-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010b2'::uuid, '00000000-1111-0000-0000-00000000042c'::uuid, $$KRE-049-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010b3'::uuid, $$NRK-003$$, $$NRK-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010b3'::uuid, '00000000-1111-0000-0000-0000000010b3'::uuid, $$NRK-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010b4'::uuid, $$TE-9-127-2$$, $$TE-9-127-2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010b4'::uuid, '00000000-1111-0000-0000-0000000010b4'::uuid, $$TE-9-127-2$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010b5'::uuid, $$ADY$$, $$ADY$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010b5'::uuid, '00000000-1111-0000-0000-0000000010b5'::uuid, $$ADY$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010b6'::uuid, $$EXD-005$$, $$EXD-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010b6'::uuid, '00000000-1111-0000-0000-0000000010b6'::uuid, $$EXD-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010b7'::uuid, $$MZT-049$$, $$MZT-049$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010b7'::uuid, '00000000-1111-0000-0000-0000000010b7'::uuid, $$MZT-049$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010b8'::uuid, $$SMK-089$$, $$SMK-089$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010b8'::uuid, '00000000-1111-0000-0000-0000000010b8'::uuid, $$SMK-089$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010b9'::uuid, $$GMY-088$$, $$GMY-088$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010b9'::uuid, '00000000-1111-0000-0000-0000000010b9'::uuid, $$GMY-088$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010ba'::uuid, $$SSM$$, $$SSM$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$M$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010ba'::uuid, '00000000-1111-0000-0000-0000000010ba'::uuid, $$SSM$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010bb'::uuid, $$JAE-021$$, $$JAE-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010bb'::uuid, '00000000-1111-0000-0000-0000000010bb'::uuid, $$JAE-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010bc'::uuid, $$JAE-022$$, $$JAE-022$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010bc'::uuid, '00000000-1111-0000-0000-0000000010bc'::uuid, $$JAE-022$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010bd'::uuid, $$MTM-003$$, $$MTM-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010bd'::uuid, '00000000-1111-0000-0000-0000000010bd'::uuid, $$MTM-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010be'::uuid, $$KSP-118$$, $$KSP-118$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010be'::uuid, '00000000-1111-0000-0000-0000000010be'::uuid, $$KSP-118$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010bf'::uuid, $$V$$, $$V$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010bf'::uuid, '00000000-1111-0000-0000-0000000010bf'::uuid, $$V$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010c0'::uuid, $$SMK-104$$, $$SMK-104$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010c0'::uuid, '00000000-1111-0000-0000-0000000010c0'::uuid, $$SMK-104$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010c1'::uuid, $$SMK-119$$, $$SMK-119$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010c1'::uuid, '00000000-1111-0000-0000-0000000010c1'::uuid, $$SMK-119$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010c2'::uuid, $$CLDS$$, $$CLDS$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010c2'::uuid, '00000000-1111-0000-0000-0000000010c2'::uuid, $$CLDS$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010c3'::uuid, $$レザーシート小　56Φｘ33Φ$$, $$レザーシート小　56Φｘ33Φ$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010c3'::uuid, '00000000-1111-0000-0000-0000000010c3'::uuid, $$レザーシート小　56Φｘ33Φ$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010c4'::uuid, $$SMK-060$$, $$SMK-060$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010c4'::uuid, '00000000-1111-0000-0000-0000000010c4'::uuid, $$SMK-060$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010c5'::uuid, $$SMK-031$$, $$SMK-031$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010c5'::uuid, '00000000-1111-0000-0000-0000000010c5'::uuid, $$SMK-031$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010c6'::uuid, $$SMK-032$$, $$SMK-032$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010c6'::uuid, '00000000-1111-0000-0000-0000000010c6'::uuid, $$SMK-032$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010c7'::uuid, $$SMK-027$$, $$SMK-027$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010c7'::uuid, '00000000-1111-0000-0000-0000000010c7'::uuid, $$SMK-027$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010c8'::uuid, '00000000-1111-0000-0000-000000000f47'::uuid, $$SMK-002-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010c9'::uuid, $$SMK-005$$, $$SMK-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010c9'::uuid, '00000000-1111-0000-0000-0000000010c9'::uuid, $$SMK-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010ca'::uuid, $$SMK-044$$, $$SMK-044$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010ca'::uuid, '00000000-1111-0000-0000-0000000010ca'::uuid, $$SMK-044$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010cb'::uuid, $$SMK-029$$, $$SMK-029$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010cb'::uuid, '00000000-1111-0000-0000-0000000010cb'::uuid, $$SMK-029$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010cc'::uuid, $$NOKIA$$, $$NOKIA$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010cc'::uuid, '00000000-1111-0000-0000-0000000010cc'::uuid, $$NOKIA$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010cd'::uuid, $$NPC-012$$, $$NPC-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010cd'::uuid, '00000000-1111-0000-0000-0000000010cd'::uuid, $$NPC-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010ce'::uuid, $$TE-0-141-7$$, $$TE-0-141-7$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010ce'::uuid, '00000000-1111-0000-0000-0000000010ce'::uuid, $$TE-0-141-7$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010cf'::uuid, $$TE-9-079-2$$, $$TE-9-079-2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010cf'::uuid, '00000000-1111-0000-0000-0000000010cf'::uuid, $$TE-9-079-2$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010d0'::uuid, $$TE-1-023-5$$, $$TE-1-023-5$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010d0'::uuid, '00000000-1111-0000-0000-0000000010d0'::uuid, $$TE-1-023-5$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010d1'::uuid, $$SMK-007$$, $$SMK-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010d1'::uuid, '00000000-1111-0000-0000-0000000010d1'::uuid, $$SMK-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010d2'::uuid, $$SMK-008$$, $$SMK-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010d2'::uuid, '00000000-1111-0000-0000-0000000010d2'::uuid, $$SMK-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010d3'::uuid, $$JAE-017$$, $$JAE-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010d3'::uuid, '00000000-1111-0000-0000-0000000010d3'::uuid, $$JAE-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010d4'::uuid, $$KSE-001$$, $$KSE-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010d4'::uuid, '00000000-1111-0000-0000-0000000010d4'::uuid, $$KSE-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010d5'::uuid, $$GMY-030$$, $$GMY-030$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010d5'::uuid, '00000000-1111-0000-0000-0000000010d5'::uuid, $$GMY-030$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010d6'::uuid, $$NRK-015$$, $$NRK-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010d6'::uuid, '00000000-1111-0000-0000-0000000010d6'::uuid, $$NRK-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010d7'::uuid, $$NRK-016$$, $$NRK-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010d7'::uuid, '00000000-1111-0000-0000-0000000010d7'::uuid, $$NRK-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010d8'::uuid, $$GMY-034$$, $$GMY-034$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010d8'::uuid, '00000000-1111-0000-0000-0000000010d8'::uuid, $$GMY-034$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010d9'::uuid, $$TH-018$$, $$TH-018B$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010d9'::uuid, '00000000-1111-0000-0000-0000000010d9'::uuid, $$TH-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010da'::uuid, $$OOT-036$$, $$OOT-036$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010da'::uuid, '00000000-1111-0000-0000-0000000010da'::uuid, $$OOT-036$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010db'::uuid, $$OOT-037$$, $$OOT-037$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010db'::uuid, '00000000-1111-0000-0000-0000000010db'::uuid, $$OOT-037$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010dc'::uuid, $$NHK-003$$, $$NHK-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010dc'::uuid, '00000000-1111-0000-0000-0000000010dc'::uuid, $$NHK-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010dd'::uuid, $$NHK-004$$, $$NHK-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010dd'::uuid, '00000000-1111-0000-0000-0000000010dd'::uuid, $$NHK-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010de'::uuid, $$ATS-001$$, $$ATS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010de'::uuid, '00000000-1111-0000-0000-0000000010de'::uuid, $$ATS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010df'::uuid, $$GOJ-004$$, $$GOJ-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010df'::uuid, '00000000-1111-0000-0000-0000000010df'::uuid, $$GOJ-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010e0'::uuid, $$TE-2-135-4$$, $$TE-2-135-4$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010e0'::uuid, '00000000-1111-0000-0000-0000000010e0'::uuid, $$TE-2-135-4$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010e1'::uuid, $$SN$$, $$SNT$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010e1'::uuid, '00000000-1111-0000-0000-0000000010e1'::uuid, $$SN$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010e4'::uuid, $$CANON$$, $$CANON$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010e4'::uuid, '00000000-1111-0000-0000-0000000010e4'::uuid, $$CANON$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010e5'::uuid, $$MTM-131$$, $$MTM-131$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010e5'::uuid, '00000000-1111-0000-0000-0000000010e5'::uuid, $$MTM-131$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010e6'::uuid, $$AAT-002$$, $$AAT-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010e6'::uuid, '00000000-1111-0000-0000-0000000010e6'::uuid, $$AAT-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010e7'::uuid, $$AAT-003$$, $$AAT-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010e7'::uuid, '00000000-1111-0000-0000-0000000010e7'::uuid, $$AAT-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010e9'::uuid, $$SLK-113A$$, $$SLK-113A$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010e9'::uuid, '00000000-1111-0000-0000-0000000010e9'::uuid, $$SLK-113A$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010ea'::uuid, $$JAE-069$$, $$JAE-069$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010ea'::uuid, '00000000-1111-0000-0000-0000000010ea'::uuid, $$JAE-069$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010eb'::uuid, $$ウレタン$$, $$ウレタン$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010eb'::uuid, '00000000-1111-0000-0000-0000000010eb'::uuid, $$ウレタン$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010ec'::uuid, $$足形$$, $$足形$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010ec'::uuid, '00000000-1111-0000-0000-0000000010ec'::uuid, $$足形$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010ed'::uuid, $$TSP-002$$, $$TSP-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010ed'::uuid, '00000000-1111-0000-0000-0000000010ed'::uuid, $$TSP-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010ee'::uuid, $$SSM-010$$, $$SSM-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010ee'::uuid, '00000000-1111-0000-0000-0000000010ee'::uuid, $$SSM-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010ef'::uuid, $$KDS-050$$, $$KDS-050$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010ef'::uuid, '00000000-1111-0000-0000-0000000010ef'::uuid, $$KDS-050$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010f0'::uuid, $$MSM-022$$, $$MSM-022$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010f0'::uuid, '00000000-1111-0000-0000-0000000010f0'::uuid, $$MSM-022$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010f1'::uuid, $$ADY-029$$, $$ADY-029$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010f1'::uuid, '00000000-1111-0000-0000-0000000010f1'::uuid, $$ADY-029$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010f2'::uuid, $$ADY-003$$, $$ADY-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010f2'::uuid, '00000000-1111-0000-0000-0000000010f2'::uuid, $$ADY-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010f3'::uuid, $$SMK-116$$, $$SMK-116$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010f3'::uuid, '00000000-1111-0000-0000-0000000010f3'::uuid, $$SMK-116$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010f4'::uuid, $$SPJ-027$$, $$SPJ-027$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010f4'::uuid, '00000000-1111-0000-0000-0000000010f4'::uuid, $$SPJ-027$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010f5'::uuid, '00000000-1111-0000-0000-00000000107a'::uuid, $$MCT-003-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010f8'::uuid, '00000000-1111-0000-0000-000000000ff1'::uuid, $$TE-1-163-2-R5$$, 5, $$R5$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010f9'::uuid, $$DIC-158$$, $$DIC-158 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010f9'::uuid, '00000000-1111-0000-0000-0000000010f9'::uuid, $$DIC-158-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010fa'::uuid, $$DIC-159$$, $$DIC-159 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010fa'::uuid, '00000000-1111-0000-0000-0000000010fa'::uuid, $$DIC-159-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010fb'::uuid, $$YSD-E-025-1$$, $$YSD-E-025-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010fb'::uuid, '00000000-1111-0000-0000-0000000010fb'::uuid, $$YSD-E-025-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010fc'::uuid, $$YSD-E-032-1$$, $$YSD-E-032-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010fc'::uuid, '00000000-1111-0000-0000-0000000010fc'::uuid, $$YSD-E-032-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010fd'::uuid, $$ODS-049$$, $$ODS-049$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010fd'::uuid, '00000000-1111-0000-0000-0000000010fd'::uuid, $$ODS-049$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010fe'::uuid, $$ODS-050$$, $$ODS-050$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010fe'::uuid, '00000000-1111-0000-0000-0000000010fe'::uuid, $$ODS-050$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000010ff'::uuid, $$ODS-046$$, $$ODS-046$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000010ff'::uuid, '00000000-1111-0000-0000-0000000010ff'::uuid, $$ODS-046$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001100'::uuid, $$YSD-E-080$$, $$YSD-E-080$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001100'::uuid, '00000000-1111-0000-0000-000000001100'::uuid, $$YSD-E-080$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001101'::uuid, $$YSD-E-050-1$$, $$YSD-E-050-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001101'::uuid, '00000000-1111-0000-0000-000000001101'::uuid, $$YSD-E-050-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001102'::uuid, $$SMK-191$$, $$SMK-191$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001102'::uuid, '00000000-1111-0000-0000-000000001102'::uuid, $$SMK-191$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001103'::uuid, $$JAE-337D$$, $$JAE-337D R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001103'::uuid, '00000000-1111-0000-0000-000000001103'::uuid, $$JAE-337D-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001104'::uuid, $$KOS-019$$, $$KOS-019$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001104'::uuid, '00000000-1111-0000-0000-000000001104'::uuid, $$KOS-019$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001105'::uuid, $$KOS-020$$, $$KOS-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001105'::uuid, '00000000-1111-0000-0000-000000001105'::uuid, $$KOS-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001106'::uuid, $$JAE-338D$$, $$JAE-338D R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001106'::uuid, '00000000-1111-0000-0000-000000001106'::uuid, $$JAE-338D-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001107'::uuid, $$TE-4-720990-2$$, $$TE-4-720990-2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001107'::uuid, '00000000-1111-0000-0000-000000001107'::uuid, $$TE-4-720990-2$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001108'::uuid, $$PLX-003$$, $$PLX-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001108'::uuid, '00000000-1111-0000-0000-000000001108'::uuid, $$PLX-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000110a'::uuid, $$KOS-021$$, $$KOS-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000110a'::uuid, '00000000-1111-0000-0000-00000000110a'::uuid, $$KOS-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000110b'::uuid, $$KOS-022$$, $$KOS-022$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000110b'::uuid, '00000000-1111-0000-0000-00000000110b'::uuid, $$KOS-022$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000110c'::uuid, $$SRI-007D$$, $$SRI-007D R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000110c'::uuid, '00000000-1111-0000-0000-00000000110c'::uuid, $$SRI-007D-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000110d'::uuid, '00000000-1111-0000-0000-000000000346'::uuid, $$JAE-307-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000110e'::uuid, $$BSP-002D$$, $$BSP-002D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000110e'::uuid, '00000000-1111-0000-0000-00000000110e'::uuid, $$BSP-002D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000110f'::uuid, $$ADY-128$$, $$ADY-128 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000110f'::uuid, '00000000-1111-0000-0000-00000000110f'::uuid, $$ADY-128-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001110'::uuid, $$SMK-219$$, $$SMK-219 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001110'::uuid, '00000000-1111-0000-0000-000000001110'::uuid, $$SMK-219-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001111'::uuid, $$JAE-342$$, $$JAE-342$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001111'::uuid, '00000000-1111-0000-0000-000000001111'::uuid, $$JAE-342$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001112'::uuid, $$JAE-341$$, $$JAE-341$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001112'::uuid, '00000000-1111-0000-0000-000000001112'::uuid, $$JAE-341$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001113'::uuid, $$SRI-007$$, $$SRI-007 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001113'::uuid, '00000000-1111-0000-0000-000000001113'::uuid, $$SRI-007-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001114'::uuid, $$JAE-338$$, $$JAE-338 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001114'::uuid, '00000000-1111-0000-0000-000000001114'::uuid, $$JAE-338-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001115'::uuid, $$ASH-008$$, $$ASH-008 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001115'::uuid, '00000000-1111-0000-0000-000000001115'::uuid, $$ASH-008-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001116'::uuid, $$ASH-009$$, $$ASH-009 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001116'::uuid, '00000000-1111-0000-0000-000000001116'::uuid, $$ASH-009-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001117'::uuid, $$BSP-002$$, $$BSP-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001117'::uuid, '00000000-1111-0000-0000-000000001117'::uuid, $$BSP-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001118'::uuid, $$TKP-001$$, $$TKP-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001118'::uuid, '00000000-1111-0000-0000-000000001118'::uuid, $$TKP-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001119'::uuid, $$KDS-143$$, $$KDS-143 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001119'::uuid, '00000000-1111-0000-0000-000000001119'::uuid, $$KDS-143-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000111a'::uuid, $$ASH-010$$, $$ASH-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000111a'::uuid, '00000000-1111-0000-0000-00000000111a'::uuid, $$ASH-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000111b'::uuid, $$ODS-R-31$$, $$ODS-R-31$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000111b'::uuid, '00000000-1111-0000-0000-00000000111b'::uuid, $$ODS-R-31$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000111c'::uuid, $$TY-001$$, $$TY-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000111c'::uuid, '00000000-1111-0000-0000-00000000111c'::uuid, $$TY-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000111e'::uuid, $$SMK-140$$, $$SMK-140$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000111e'::uuid, '00000000-1111-0000-0000-00000000111e'::uuid, $$SMK-140$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000111f'::uuid, $$SMK-103$$, $$SMK-103$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000111f'::uuid, '00000000-1111-0000-0000-00000000111f'::uuid, $$SMK-103$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001120'::uuid, $$SMK-128$$, $$SMK-128$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001120'::uuid, '00000000-1111-0000-0000-000000001120'::uuid, $$SMK-128$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001121'::uuid, $$SMK-134$$, $$SMK-134$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001121'::uuid, '00000000-1111-0000-0000-000000001121'::uuid, $$SMK-134$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001122'::uuid, $$SMK-111$$, $$SMK-111$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001122'::uuid, '00000000-1111-0000-0000-000000001122'::uuid, $$SMK-111$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001123'::uuid, $$SMK-003?$$, $$SMK-003?$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001123'::uuid, '00000000-1111-0000-0000-000000001123'::uuid, $$SMK-003?$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001124'::uuid, $$NONAME-034$$, $$NONAME-034$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001124'::uuid, '00000000-1111-0000-0000-000000001124'::uuid, $$NONAME-034$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001125'::uuid, $$OTHER-A59-6903$$, $$OTHER-A59-6903$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001125'::uuid, '00000000-1111-0000-0000-000000001125'::uuid, $$OTHER-A59-6903$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001126'::uuid, $$OTHER-B59-6903$$, $$OTHER-B59-6903$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001126'::uuid, '00000000-1111-0000-0000-000000001126'::uuid, $$OTHER-B59-6903$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001127'::uuid, $$SLK-126$$, $$SLK-126$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001127'::uuid, '00000000-1111-0000-0000-000000001127'::uuid, $$SLK-126$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001128'::uuid, $$SLK-124$$, $$SLK-124$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001128'::uuid, '00000000-1111-0000-0000-000000001128'::uuid, $$SLK-124$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001129'::uuid, $$OTP-003$$, $$OTP-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001129'::uuid, '00000000-1111-0000-0000-000000001129'::uuid, $$OTP-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000112a'::uuid, $$ODS-020$$, $$ODS-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000112a'::uuid, '00000000-1111-0000-0000-00000000112a'::uuid, $$ODS-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000112c'::uuid, $$TE-60654$$, $$TE-60654$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000112c'::uuid, '00000000-1111-0000-0000-00000000112c'::uuid, $$TE-60654$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000112d'::uuid, $$SSM-056$$, $$SSM-056 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000112d'::uuid, '00000000-1111-0000-0000-00000000112d'::uuid, $$SSM-056-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000112e'::uuid, $$TE-5-997-3$$, $$TE-5-997-3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000112e'::uuid, '00000000-1111-0000-0000-00000000112e'::uuid, $$TE-5-997-3$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000112f'::uuid, $$TE-2-057-1$$, $$TE-2-057-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000112f'::uuid, '00000000-1111-0000-0000-00000000112f'::uuid, $$TE-2-057-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001130'::uuid, $$TE-2-059-3$$, $$TE-2-059-3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001130'::uuid, '00000000-1111-0000-0000-000000001130'::uuid, $$TE-2-059-3$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001131'::uuid, '00000000-1111-0000-0000-000000000ccb'::uuid, $$YES-004-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001133'::uuid, '00000000-1111-0000-0000-000000001002'::uuid, $$JAE-337-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001134'::uuid, $$STD-007$$, $$STD-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001134'::uuid, '00000000-1111-0000-0000-000000001134'::uuid, $$STD-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001135'::uuid, $$DIC-161D$$, $$DIC-161D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001135'::uuid, '00000000-1111-0000-0000-000000001135'::uuid, $$DIC-161D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001136'::uuid, '00000000-1111-0000-0000-00000000110b'::uuid, $$KOS-022-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001137'::uuid, $$WKE-004$$, $$WKE-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001137'::uuid, '00000000-1111-0000-0000-000000001137'::uuid, $$WKE-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001138'::uuid, $$SHT-019$$, $$SHT-019 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001138'::uuid, '00000000-1111-0000-0000-000000001138'::uuid, $$SHT-019-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001139'::uuid, $$TE-1-019-6$$, $$TE-1-019-6$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001139'::uuid, '00000000-1111-0000-0000-000000001139'::uuid, $$TE-1-019-6$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000113b'::uuid, $$TE-12793341-1$$, $$TE-12793341-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000113b'::uuid, '00000000-1111-0000-0000-00000000113b'::uuid, $$TE-12793341-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000113c'::uuid, $$TE-1-023-8$$, $$TE-1-023-8$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000113c'::uuid, '00000000-1111-0000-0000-00000000113c'::uuid, $$TE-1-023-8$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000113d'::uuid, $$TE-2-108-9$$, $$TE-2-108-9$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000113d'::uuid, '00000000-1111-0000-0000-00000000113d'::uuid, $$TE-2-108-9$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000113e'::uuid, $$TE-2013973-1$$, $$TE-2013973-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000113e'::uuid, '00000000-1111-0000-0000-00000000113e'::uuid, $$TE-2013973-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000113f'::uuid, $$OGR-013M$$, $$OGR-013M$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$M$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000113f'::uuid, '00000000-1111-0000-0000-00000000113f'::uuid, $$OGR-013M$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001140'::uuid, $$NSE-004$$, $$NSE-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001140'::uuid, '00000000-1111-0000-0000-000000001140'::uuid, $$NSE-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001141'::uuid, $$WKE-005$$, $$WKE-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001141'::uuid, '00000000-1111-0000-0000-000000001141'::uuid, $$WKE-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001142'::uuid, $$JAE-346$$, $$JAE-346$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001142'::uuid, '00000000-1111-0000-0000-000000001142'::uuid, $$JAE-346$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001143'::uuid, $$ADY-129$$, $$ADY-129$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001143'::uuid, '00000000-1111-0000-0000-000000001143'::uuid, $$ADY-129$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001144'::uuid, $$SMK-169$$, $$SMK-169$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001144'::uuid, '00000000-1111-0000-0000-000000001144'::uuid, $$SMK-169$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001145'::uuid, $$DIC-161$$, $$DIC-161$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001145'::uuid, '00000000-1111-0000-0000-000000001145'::uuid, $$DIC-161$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001146'::uuid, $$SMK-100$$, $$SMK-100$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001146'::uuid, '00000000-1111-0000-0000-000000001146'::uuid, $$SMK-100$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001147'::uuid, $$MTM-185D$$, $$MTM-185D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001147'::uuid, '00000000-1111-0000-0000-000000001147'::uuid, $$MTM-185D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001148'::uuid, $$MRD-001D$$, $$MRD-001D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001148'::uuid, '00000000-1111-0000-0000-000000001148'::uuid, $$MRD-001D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001149'::uuid, $$MTM-186D$$, $$MTM-186D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001149'::uuid, '00000000-1111-0000-0000-000000001149'::uuid, $$MTM-186D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000114a'::uuid, $$MTM-187D$$, $$MTM-187D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000114a'::uuid, '00000000-1111-0000-0000-00000000114a'::uuid, $$MTM-187D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000114b'::uuid, $$BSZ-001D$$, $$BSZ-001D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000114b'::uuid, '00000000-1111-0000-0000-00000000114b'::uuid, $$BSZ-001D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000114c'::uuid, $$JAE-347$$, $$JAE-347$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000114c'::uuid, '00000000-1111-0000-0000-00000000114c'::uuid, $$JAE-347$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000114d'::uuid, $$MTM-185$$, $$MTM-185 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000114d'::uuid, '00000000-1111-0000-0000-00000000114d'::uuid, $$MTM-185-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000114e'::uuid, $$SCW-003D$$, $$SCW-003D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000114e'::uuid, '00000000-1111-0000-0000-00000000114e'::uuid, $$SCW-003D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000114f'::uuid, '00000000-1111-0000-0000-000000000e25'::uuid, $$JAE-325-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001150'::uuid, $$ASH-011$$, $$ASH-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001150'::uuid, '00000000-1111-0000-0000-000000001150'::uuid, $$ASH-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001151'::uuid, $$ASH-012$$, $$ASH-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001151'::uuid, '00000000-1111-0000-0000-000000001151'::uuid, $$ASH-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001152'::uuid, $$MTM-188D$$, $$MTM-188D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001152'::uuid, '00000000-1111-0000-0000-000000001152'::uuid, $$MTM-188D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001154'::uuid, $$MRD-001$$, $$MRD-001 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001154'::uuid, '00000000-1111-0000-0000-000000001154'::uuid, $$MRD-001-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001155'::uuid, $$MTM-186$$, $$MTM-186$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001155'::uuid, '00000000-1111-0000-0000-000000001155'::uuid, $$MTM-186$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001156'::uuid, $$JAE-348$$, $$JAE-348$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001156'::uuid, '00000000-1111-0000-0000-000000001156'::uuid, $$JAE-348$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001157'::uuid, $$KSP-208$$, $$KSP-208$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001157'::uuid, '00000000-1111-0000-0000-000000001157'::uuid, $$KSP-208$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001158'::uuid, $$KSP-209$$, $$KSP-209$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001158'::uuid, '00000000-1111-0000-0000-000000001158'::uuid, $$KSP-209$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000115a'::uuid, $$SCW-003$$, $$SCW-003 R4$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000115a'::uuid, '00000000-1111-0000-0000-00000000115a'::uuid, $$SCW-003-R4$$, 4, $$R4$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000115b'::uuid, $$SCW-001$$, $$SCW-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000115b'::uuid, '00000000-1111-0000-0000-00000000115b'::uuid, $$SCW-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000115c'::uuid, $$SCW-002$$, $$SCW-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000115c'::uuid, '00000000-1111-0000-0000-00000000115c'::uuid, $$SCW-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000115d'::uuid, $$BSZ-001$$, $$BSZ-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000115d'::uuid, '00000000-1111-0000-0000-00000000115d'::uuid, $$BSZ-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000115e'::uuid, $$ENT-003$$, $$ENT-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000115e'::uuid, '00000000-1111-0000-0000-00000000115e'::uuid, $$ENT-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000115f'::uuid, $$JAE-350$$, $$JAE-350 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000115f'::uuid, '00000000-1111-0000-0000-00000000115f'::uuid, $$JAE-350-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001160'::uuid, $$JAE-351$$, $$JAE-351$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001160'::uuid, '00000000-1111-0000-0000-000000001160'::uuid, $$JAE-351$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001161'::uuid, $$JAE-349$$, $$JAE-349 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001161'::uuid, '00000000-1111-0000-0000-000000001161'::uuid, $$JAE-349-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001162'::uuid, '00000000-1111-0000-0000-00000000114c'::uuid, $$JAE-347-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001163'::uuid, $$ADY-130$$, $$ADY-130$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001163'::uuid, '00000000-1111-0000-0000-000000001163'::uuid, $$ADY-130$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001165'::uuid, '00000000-1111-0000-0000-00000000114e'::uuid, $$SCW-003D-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001166'::uuid, $$TE-9-998-6$$, $$TE-9-998-6$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001166'::uuid, '00000000-1111-0000-0000-000000001166'::uuid, $$TE-9-998-6$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001167'::uuid, $$RPD-001$$, $$RPD-001 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001167'::uuid, '00000000-1111-0000-0000-000000001167'::uuid, $$RPD-001-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001168'::uuid, $$RPD-002$$, $$RPD-002 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001168'::uuid, '00000000-1111-0000-0000-000000001168'::uuid, $$RPD-002-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001169'::uuid, $$MTM-188$$, $$MTM-188$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001169'::uuid, '00000000-1111-0000-0000-000000001169'::uuid, $$MTM-188$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000116a'::uuid, $$JAE-345A$$, $$JAE-345A R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000116a'::uuid, '00000000-1111-0000-0000-00000000116a'::uuid, $$JAE-345A-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000116b'::uuid, $$JAE-345B$$, $$JAE-345B R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000116b'::uuid, '00000000-1111-0000-0000-00000000116b'::uuid, $$JAE-345B-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000116c'::uuid, $$JAE-352A$$, $$JAE-352A$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000116c'::uuid, '00000000-1111-0000-0000-00000000116c'::uuid, $$JAE-352A$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000116d'::uuid, $$JAE-352$$, $$JAE-352B$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000116d'::uuid, '00000000-1111-0000-0000-00000000116d'::uuid, $$JAE-352$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000116e'::uuid, $$JAE-344A$$, $$JAE-344A R4$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000116e'::uuid, '00000000-1111-0000-0000-00000000116e'::uuid, $$JAE-344A-R4$$, 4, $$R4$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000116f'::uuid, $$JAE-344B$$, $$JAE-344B R4$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000116f'::uuid, '00000000-1111-0000-0000-00000000116f'::uuid, $$JAE-344B-R4$$, 4, $$R4$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001170'::uuid, $$ASH-013$$, $$ASH-013 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001170'::uuid, '00000000-1111-0000-0000-000000001170'::uuid, $$ASH-013-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001171'::uuid, $$JAE-343B$$, $$JAE-343B R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001171'::uuid, '00000000-1111-0000-0000-000000001171'::uuid, $$JAE-343B-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001172'::uuid, $$JAE-343A$$, $$JAE-343A R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001172'::uuid, '00000000-1111-0000-0000-000000001172'::uuid, $$JAE-343A-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001173'::uuid, $$KSC-005$$, $$KSC-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001173'::uuid, '00000000-1111-0000-0000-000000001173'::uuid, $$KSC-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001174'::uuid, $$YCM-076D$$, $$YCM-076D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001174'::uuid, '00000000-1111-0000-0000-000000001174'::uuid, $$YCM-076D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001175'::uuid, '00000000-1111-0000-0000-00000000114a'::uuid, $$MTM-187D-R4$$, 4, $$R4$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001176'::uuid, $$DIC-162$$, $$DIC-162 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001176'::uuid, '00000000-1111-0000-0000-000000001176'::uuid, $$DIC-162-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001177'::uuid, $$TKD-023D$$, $$TKD-023D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001177'::uuid, '00000000-1111-0000-0000-000000001177'::uuid, $$TKD-023D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001178'::uuid, '00000000-1111-0000-0000-000000001147'::uuid, $$MTM-185D-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001179'::uuid, $$TE-5-159-2$$, $$TE-5-159-2 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001179'::uuid, '00000000-1111-0000-0000-000000001179'::uuid, $$TE-5-159-2-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000117a'::uuid, $$TE-5-159-3$$, $$TE-5-159-3 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000117a'::uuid, '00000000-1111-0000-0000-00000000117a'::uuid, $$TE-5-159-3-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000117b'::uuid, $$MTM-187$$, $$MTM-187 R4$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000117b'::uuid, '00000000-1111-0000-0000-00000000117b'::uuid, $$MTM-187-R4$$, 4, $$R4$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000117d'::uuid, $$TE-8-135-7$$, $$TE-8-135-7$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000117d'::uuid, '00000000-1111-0000-0000-00000000117d'::uuid, $$TE-8-135-7$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000117e'::uuid, $$SHARP-SHARP$$, $$SHARP-SHARP$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000117e'::uuid, '00000000-1111-0000-0000-00000000117e'::uuid, $$SHARP-SHARP$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000117f'::uuid, '00000000-1111-0000-0000-000000000ef3'::uuid, $$SLK-139$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001180'::uuid, $$SK-$$, $$SK-$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001180'::uuid, '00000000-1111-0000-0000-000000001180'::uuid, $$SK-$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001181'::uuid, $$OST-010$$, $$OST-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001181'::uuid, '00000000-1111-0000-0000-000000001181'::uuid, $$OST-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001182'::uuid, $$OST-011$$, $$OST-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001182'::uuid, '00000000-1111-0000-0000-000000001182'::uuid, $$OST-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001183'::uuid, $$ADV-NONAME2$$, $$ADV-NONAME2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001183'::uuid, '00000000-1111-0000-0000-000000001183'::uuid, $$ADV-NONAME2$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001184'::uuid, '00000000-1111-0000-0000-00000000018f'::uuid, $$DIM-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001185'::uuid, $$TE-3-103-3$$, $$TE-3-103-3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001185'::uuid, '00000000-1111-0000-0000-000000001185'::uuid, $$TE-3-103-3$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001188'::uuid, '00000000-1111-0000-0000-000000000dc4'::uuid, $$JAE-028-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000118b'::uuid, '00000000-1111-0000-0000-000000000b30'::uuid, $$TE-7-127-7-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000118e'::uuid, $$SKS-006$$, $$SKS-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000118e'::uuid, '00000000-1111-0000-0000-00000000118e'::uuid, $$SKS-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000118f'::uuid, $$TE-5-103-4$$, $$TE-5-103-4$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000118f'::uuid, '00000000-1111-0000-0000-00000000118f'::uuid, $$TE-5-103-4$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001190'::uuid, '00000000-1111-0000-0000-000000000e9e'::uuid, $$TE-2-156-0$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001191'::uuid, $$HAYASHI-TELEM354X300$$, $$HAYASHI-TELEM354X300$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001191'::uuid, '00000000-1111-0000-0000-000000001191'::uuid, $$HAYASHI-TELEM354X300$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001192'::uuid, $$TE-6-129-2$$, $$TE-6-129-2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001192'::uuid, '00000000-1111-0000-0000-000000001192'::uuid, $$TE-6-129-2$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001194'::uuid, $$GMY-NONAME$$, $$GMY-NONAME$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001194'::uuid, '00000000-1111-0000-0000-000000001194'::uuid, $$GMY-NONAME$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001195'::uuid, $$TE-7-129-5$$, $$TE-7-129-5$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001195'::uuid, '00000000-1111-0000-0000-000000001195'::uuid, $$TE-7-129-5$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001196'::uuid, $$SK-035$$, $$SK-035$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001196'::uuid, '00000000-1111-0000-0000-000000001196'::uuid, $$SK-035$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001198'::uuid, '00000000-1111-0000-0000-00000000069f'::uuid, $$NRK-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001199'::uuid, $$OTHER-364X243$$, $$OTHER-364X243$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001199'::uuid, '00000000-1111-0000-0000-000000001199'::uuid, $$OTHER-364X243$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000119a'::uuid, $$TE-7-135-9$$, $$TE-7-135-9$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000119a'::uuid, '00000000-1111-0000-0000-00000000119a'::uuid, $$TE-7-135-9$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000119b'::uuid, '00000000-1111-0000-0000-000000000c13'::uuid, $$TKS-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000119c'::uuid, $$TKS-AB$$, $$TKS-AB$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000119c'::uuid, '00000000-1111-0000-0000-00000000119c'::uuid, $$TKS-AB$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000119d'::uuid, $$SK-069$$, $$SK-069$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000119d'::uuid, '00000000-1111-0000-0000-00000000119d'::uuid, $$SK-069$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000119e'::uuid, $$GMY-T-25$$, $$GMY-T-25$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000119e'::uuid, '00000000-1111-0000-0000-00000000119e'::uuid, $$GMY-T-25$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000119f'::uuid, $$OTHER-プックグッスタ$$, $$OTHER-プックグッスタ$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000119f'::uuid, '00000000-1111-0000-0000-00000000119f'::uuid, $$OTHER-プックグッスタ$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011a0'::uuid, $$JAE-015$$, $$JAE-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011a0'::uuid, '00000000-1111-0000-0000-0000000011a0'::uuid, $$JAE-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011a1'::uuid, $$OTHER-プックグッスタ2$$, $$OTHER-プックグッスタ2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011a1'::uuid, '00000000-1111-0000-0000-0000000011a1'::uuid, $$OTHER-プックグッスタ2$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011a2'::uuid, $$OTHER-380カット$$, $$OTHER-380カット$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011a2'::uuid, '00000000-1111-0000-0000-0000000011a2'::uuid, $$OTHER-380カット$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011a4'::uuid, $$OTHER-T8623518.5Φ　30面$$, $$OTHER-T86235 18.5Φ　30面$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011a4'::uuid, '00000000-1111-0000-0000-0000000011a4'::uuid, $$OTHER-T8623518.5Φ　30面$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011a5'::uuid, $$TE-5-110-8$$, $$TE-5-110-8NO1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011a5'::uuid, '00000000-1111-0000-0000-0000000011a5'::uuid, $$TE-5-110-8$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011aa'::uuid, $$NRK-014$$, $$NRK-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011aa'::uuid, '00000000-1111-0000-0000-0000000011aa'::uuid, $$NRK-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011ab'::uuid, '00000000-1111-0000-0000-000000000b56'::uuid, $$TE-8-127-5-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011ac'::uuid, $$MTM-014$$, $$MTM-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011ac'::uuid, '00000000-1111-0000-0000-0000000011ac'::uuid, $$MTM-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011b0'::uuid, '00000000-1111-0000-0000-00000000114d'::uuid, $$MTM-185-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011b1'::uuid, $$JAE-353$$, $$JAE-353 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011b1'::uuid, '00000000-1111-0000-0000-0000000011b1'::uuid, $$JAE-353-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011b2'::uuid, $$CHG-002DAB$$, $$CHG-002D AB$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$AB$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011b2'::uuid, '00000000-1111-0000-0000-0000000011b2'::uuid, $$CHG-002DAB$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011b3'::uuid, $$CHG-003DAB$$, $$CHG-003D AB$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$AB$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011b3'::uuid, '00000000-1111-0000-0000-0000000011b3'::uuid, $$CHG-003DAB$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011b4'::uuid, $$CHG-001$$, $$CHG-001 R4$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011b4'::uuid, '00000000-1111-0000-0000-0000000011b4'::uuid, $$CHG-001-R4$$, 4, $$R4$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011b5'::uuid, $$ASH-014D$$, $$ASH-014D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011b5'::uuid, '00000000-1111-0000-0000-0000000011b5'::uuid, $$ASH-014D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011b6'::uuid, $$TKD-023$$, $$TKD-023$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011b6'::uuid, '00000000-1111-0000-0000-0000000011b6'::uuid, $$TKD-023$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011b7'::uuid, $$OTHER-圧空BOX600$$, $$OTHER-圧空BOX600$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011b7'::uuid, '00000000-1111-0000-0000-0000000011b7'::uuid, $$OTHER-圧空BOX600$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011b8'::uuid, $$YCM-076-R1NG$$, $$YCM-076 R1 NG$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011b8'::uuid, '00000000-1111-0000-0000-0000000011b8'::uuid, $$YCM-076-R1NG$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011b9'::uuid, $$KOS-023$$, $$KOS-023$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011b9'::uuid, '00000000-1111-0000-0000-0000000011b9'::uuid, $$KOS-023$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011ba'::uuid, $$TE-5-159-1$$, $$TE-5-159-1 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011ba'::uuid, '00000000-1111-0000-0000-0000000011ba'::uuid, $$TE-5-159-1-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011bb'::uuid, $$JAE-354$$, $$JAE-354$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011bb'::uuid, '00000000-1111-0000-0000-0000000011bb'::uuid, $$JAE-354$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011bc'::uuid, $$SHT-020$$, $$SHT-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011bc'::uuid, '00000000-1111-0000-0000-0000000011bc'::uuid, $$SHT-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011bd'::uuid, $$MDS-006D$$, $$MDS-006D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011bd'::uuid, '00000000-1111-0000-0000-0000000011bd'::uuid, $$MDS-006D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011be'::uuid, $$MMT-019$$, $$MMT-019 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011be'::uuid, '00000000-1111-0000-0000-0000000011be'::uuid, $$MMT-019-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011bf'::uuid, $$NGT-002$$, $$NGT-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011bf'::uuid, '00000000-1111-0000-0000-0000000011bf'::uuid, $$NGT-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011c0'::uuid, $$KOS-024$$, $$KOS-024$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011c0'::uuid, '00000000-1111-0000-0000-0000000011c0'::uuid, $$KOS-024$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011c1'::uuid, $$APS-001D$$, $$APS-001D R5$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011c1'::uuid, '00000000-1111-0000-0000-0000000011c1'::uuid, $$APS-001D-R5$$, 5, $$R5$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011c2'::uuid, $$KOS-025$$, $$KOS-025$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011c2'::uuid, '00000000-1111-0000-0000-0000000011c2'::uuid, $$KOS-025$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011c3'::uuid, $$KOS-026$$, $$KOS-026$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011c3'::uuid, '00000000-1111-0000-0000-0000000011c3'::uuid, $$KOS-026$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011c4'::uuid, '00000000-1111-0000-0000-000000001168'::uuid, $$RPD-002-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011c6'::uuid, $$YCM-076$$, $$YCM-076 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011c6'::uuid, '00000000-1111-0000-0000-0000000011c6'::uuid, $$YCM-076-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011c7'::uuid, $$MDS-007D$$, $$MDS-007D R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011c7'::uuid, '00000000-1111-0000-0000-0000000011c7'::uuid, $$MDS-007D-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011c8'::uuid, $$ASC-003$$, $$ASC-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011c8'::uuid, '00000000-1111-0000-0000-0000000011c8'::uuid, $$ASC-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011c9'::uuid, $$ADY-131$$, $$ADY-131$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011c9'::uuid, '00000000-1111-0000-0000-0000000011c9'::uuid, $$ADY-131$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011ca'::uuid, $$APS-001$$, $$APS-001 R6$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011ca'::uuid, '00000000-1111-0000-0000-0000000011ca'::uuid, $$APS-001-R6$$, 6, $$R6$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011cb'::uuid, $$ADY-132$$, $$ADY-132$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011cb'::uuid, '00000000-1111-0000-0000-0000000011cb'::uuid, $$ADY-132$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011cc'::uuid, $$DIC-164$$, $$DIC-164$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011cc'::uuid, '00000000-1111-0000-0000-0000000011cc'::uuid, $$DIC-164$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011ce'::uuid, $$ASH-014$$, $$ASH-014 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011ce'::uuid, '00000000-1111-0000-0000-0000000011ce'::uuid, $$ASH-014-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011cf'::uuid, $$ASC-004$$, $$ASC-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011cf'::uuid, '00000000-1111-0000-0000-0000000011cf'::uuid, $$ASC-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011d0'::uuid, $$THP-008D$$, $$THP-008D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011d0'::uuid, '00000000-1111-0000-0000-0000000011d0'::uuid, $$THP-008D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011d1'::uuid, $$SSM-057$$, $$SSM-057$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011d1'::uuid, '00000000-1111-0000-0000-0000000011d1'::uuid, $$SSM-057$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011d2'::uuid, $$YCM-077D$$, $$YCM-077D R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011d2'::uuid, '00000000-1111-0000-0000-0000000011d2'::uuid, $$YCM-077D-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011d3'::uuid, $$SMK-222$$, $$SMK-222$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011d3'::uuid, '00000000-1111-0000-0000-0000000011d3'::uuid, $$SMK-222$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011d5'::uuid, $$CHG-002AB$$, $$CHG-002AB R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$AB$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011d5'::uuid, '00000000-1111-0000-0000-0000000011d5'::uuid, $$CHG-002AB-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011d6'::uuid, $$TIH-025$$, $$TIH-025 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011d6'::uuid, '00000000-1111-0000-0000-0000000011d6'::uuid, $$TIH-025-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011d7'::uuid, $$CHG-003AB$$, $$CHG-003AB R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$AB$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011d7'::uuid, '00000000-1111-0000-0000-0000000011d7'::uuid, $$CHG-003AB-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011d8'::uuid, $$YCM-077$$, $$YCM-077 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011d8'::uuid, '00000000-1111-0000-0000-0000000011d8'::uuid, $$YCM-077-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011d9'::uuid, $$MDS-006$$, $$MDS-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011d9'::uuid, '00000000-1111-0000-0000-0000000011d9'::uuid, $$MDS-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011da'::uuid, $$MDS-007$$, $$MDS-007 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011da'::uuid, '00000000-1111-0000-0000-0000000011da'::uuid, $$MDS-007-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011db'::uuid, $$SIT-025D$$, $$SIT-025D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011db'::uuid, '00000000-1111-0000-0000-0000000011db'::uuid, $$SIT-025D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011dc'::uuid, $$SIT-026D$$, $$SIT-026D R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011dc'::uuid, '00000000-1111-0000-0000-0000000011dc'::uuid, $$SIT-026D-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011dd'::uuid, $$SIT-027D$$, $$SIT-027D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011dd'::uuid, '00000000-1111-0000-0000-0000000011dd'::uuid, $$SIT-027D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011de'::uuid, $$SIT-028D$$, $$SIT-028D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011de'::uuid, '00000000-1111-0000-0000-0000000011de'::uuid, $$SIT-028D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011df'::uuid, $$KWE-004$$, $$KWE-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011df'::uuid, '00000000-1111-0000-0000-0000000011df'::uuid, $$KWE-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011e0'::uuid, $$YCM-010$$, $$YCM-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011e0'::uuid, '00000000-1111-0000-0000-0000000011e0'::uuid, $$YCM-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011e1'::uuid, $$KSP-210$$, $$KSP-210$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011e1'::uuid, '00000000-1111-0000-0000-0000000011e1'::uuid, $$KSP-210$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011e2'::uuid, '00000000-1111-0000-0000-0000000004f6'::uuid, $$KSP-200-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011e3'::uuid, $$NHR-006$$, $$NHR-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011e3'::uuid, '00000000-1111-0000-0000-0000000011e3'::uuid, $$NHR-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011e4'::uuid, $$NHK-006D$$, $$NHK-006D R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011e4'::uuid, '00000000-1111-0000-0000-0000000011e4'::uuid, $$NHK-006D-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011e5'::uuid, $$ASP-001$$, $$ASP-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011e5'::uuid, '00000000-1111-0000-0000-0000000011e5'::uuid, $$ASP-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011e6'::uuid, $$BMI-003$$, $$BMI-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011e6'::uuid, '00000000-1111-0000-0000-0000000011e6'::uuid, $$BMI-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011e7'::uuid, $$JAE-355$$, $$JAE-355 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011e7'::uuid, '00000000-1111-0000-0000-0000000011e7'::uuid, $$JAE-355-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011e8'::uuid, $$JAE-356$$, $$JAE-356$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011e8'::uuid, '00000000-1111-0000-0000-0000000011e8'::uuid, $$JAE-356$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011e9'::uuid, $$KDS-142$$, $$KDS-142 R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011e9'::uuid, '00000000-1111-0000-0000-0000000011e9'::uuid, $$KDS-142-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011eb'::uuid, $$KDS-032$$, $$KDS-032$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011eb'::uuid, '00000000-1111-0000-0000-0000000011eb'::uuid, $$KDS-032$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011ec'::uuid, $$KDS-058$$, $$KDS-058$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011ec'::uuid, '00000000-1111-0000-0000-0000000011ec'::uuid, $$KDS-058$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011ed'::uuid, $$KDS-022$$, $$KDS-022$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011ed'::uuid, '00000000-1111-0000-0000-0000000011ed'::uuid, $$KDS-022$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011f0'::uuid, $$KDS-046$$, $$KDS-046$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011f0'::uuid, '00000000-1111-0000-0000-0000000011f0'::uuid, $$KDS-046$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011f1'::uuid, $$KDS-059$$, $$KDS-059$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011f1'::uuid, '00000000-1111-0000-0000-0000000011f1'::uuid, $$KDS-059$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011f2'::uuid, $$KDS-019$$, $$KDS-019$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011f2'::uuid, '00000000-1111-0000-0000-0000000011f2'::uuid, $$KDS-019$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011f3'::uuid, $$KDS-031$$, $$KDS-031$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011f3'::uuid, '00000000-1111-0000-0000-0000000011f3'::uuid, $$KDS-031$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011f4'::uuid, $$KDS-033$$, $$KDS-033$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011f4'::uuid, '00000000-1111-0000-0000-0000000011f4'::uuid, $$KDS-033$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011f5'::uuid, $$KDS-016$$, $$KDS-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011f5'::uuid, '00000000-1111-0000-0000-0000000011f5'::uuid, $$KDS-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011f7'::uuid, '00000000-1111-0000-0000-000000000375'::uuid, $$KDS-044-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011f8'::uuid, $$KDS-036$$, $$KDS-036$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011f8'::uuid, '00000000-1111-0000-0000-0000000011f8'::uuid, $$KDS-036$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011f9'::uuid, $$KDS-034$$, $$KDS-034$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011f9'::uuid, '00000000-1111-0000-0000-0000000011f9'::uuid, $$KDS-034$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011fa'::uuid, $$KDS-020$$, $$KDS-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011fa'::uuid, '00000000-1111-0000-0000-0000000011fa'::uuid, $$KDS-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011fb'::uuid, $$KDS-025$$, $$KDS-025$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011fb'::uuid, '00000000-1111-0000-0000-0000000011fb'::uuid, $$KDS-025$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011fc'::uuid, $$KDS-040$$, $$KDS-040$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011fc'::uuid, '00000000-1111-0000-0000-0000000011fc'::uuid, $$KDS-040$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011fd'::uuid, $$KDS-035$$, $$KDS-035$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011fd'::uuid, '00000000-1111-0000-0000-0000000011fd'::uuid, $$KDS-035$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011fe'::uuid, $$KDS-029$$, $$KDS-029$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011fe'::uuid, '00000000-1111-0000-0000-0000000011fe'::uuid, $$KDS-029$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000011ff'::uuid, $$KDS-043$$, $$KDS-043$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000011ff'::uuid, '00000000-1111-0000-0000-0000000011ff'::uuid, $$KDS-043$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001200'::uuid, $$KYM-005$$, $$KYM-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001200'::uuid, '00000000-1111-0000-0000-000000001200'::uuid, $$KYM-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001202'::uuid, '00000000-1111-0000-0000-0000000011b4'::uuid, $$CHG-001-R5$$, 5, $$R5$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001203'::uuid, $$SMK-220$$, $$SMK-220 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001203'::uuid, '00000000-1111-0000-0000-000000001203'::uuid, $$SMK-220-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001204'::uuid, $$SMK-221$$, $$SMK-221$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001204'::uuid, '00000000-1111-0000-0000-000000001204'::uuid, $$SMK-221$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001205'::uuid, $$SHT-021$$, $$SHT-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001205'::uuid, '00000000-1111-0000-0000-000000001205'::uuid, $$SHT-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001207'::uuid, $$ASH-013xx$$, $$ASH-013xx$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001207'::uuid, '00000000-1111-0000-0000-000000001207'::uuid, $$ASH-013xx$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001208'::uuid, $$TE-9-127-7$$, $$TE-9-127-7 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001208'::uuid, '00000000-1111-0000-0000-000000001208'::uuid, $$TE-9-127-7-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001209'::uuid, $$SIT-025$$, $$SIT-025$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001209'::uuid, '00000000-1111-0000-0000-000000001209'::uuid, $$SIT-025$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000120a'::uuid, $$SIT-026$$, $$SIT-026 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000120a'::uuid, '00000000-1111-0000-0000-00000000120a'::uuid, $$SIT-026-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000120b'::uuid, $$KDS-144$$, $$KDS-144$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000120b'::uuid, '00000000-1111-0000-0000-00000000120b'::uuid, $$KDS-144$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000120c'::uuid, $$ENT-004$$, $$ENT-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000120c'::uuid, '00000000-1111-0000-0000-00000000120c'::uuid, $$ENT-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000120d'::uuid, $$SIT-027$$, $$SIT-027$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000120d'::uuid, '00000000-1111-0000-0000-00000000120d'::uuid, $$SIT-027$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000120f'::uuid, $$RPD-004$$, $$RPD-004 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000120f'::uuid, '00000000-1111-0000-0000-00000000120f'::uuid, $$RPD-004-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001210'::uuid, $$SIT-028$$, $$SIT-028 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001210'::uuid, '00000000-1111-0000-0000-000000001210'::uuid, $$SIT-028-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001211'::uuid, $$RPD-005$$, $$RPD-005 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001211'::uuid, '00000000-1111-0000-0000-000000001211'::uuid, $$RPD-005-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001212'::uuid, $$RPD-006$$, $$RPD-006 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001212'::uuid, '00000000-1111-0000-0000-000000001212'::uuid, $$RPD-006-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001213'::uuid, $$JAE-359$$, $$JAE-359$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001213'::uuid, '00000000-1111-0000-0000-000000001213'::uuid, $$JAE-359$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001214'::uuid, $$ASH-015D$$, $$ASH-015D R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001214'::uuid, '00000000-1111-0000-0000-000000001214'::uuid, $$ASH-015D-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001215'::uuid, $$JAE-357$$, $$JAE-357 R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001215'::uuid, '00000000-1111-0000-0000-000000001215'::uuid, $$JAE-357-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001216'::uuid, $$SCW-004$$, $$SCW-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001216'::uuid, '00000000-1111-0000-0000-000000001216'::uuid, $$SCW-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001217'::uuid, $$ASH-016D$$, $$ASH-016D R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001217'::uuid, '00000000-1111-0000-0000-000000001217'::uuid, $$ASH-016D-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001218'::uuid, $$JAE-358$$, $$JAE-358 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001218'::uuid, '00000000-1111-0000-0000-000000001218'::uuid, $$JAE-358-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001219'::uuid, $$TE-2493307-2$$, $$TE-2493307-2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001219'::uuid, '00000000-1111-0000-0000-000000001219'::uuid, $$TE-2493307-2$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000121a'::uuid, $$JAE-361$$, $$JAE-361$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000121a'::uuid, '00000000-1111-0000-0000-00000000121a'::uuid, $$JAE-361$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000121b'::uuid, $$JAE-360$$, $$JAE-360$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000121b'::uuid, '00000000-1111-0000-0000-00000000121b'::uuid, $$JAE-360$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000121c'::uuid, $$TE-2494147-1$$, $$TE-2494147-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000121c'::uuid, '00000000-1111-0000-0000-00000000121c'::uuid, $$TE-2494147-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000121d'::uuid, $$MCT-004$$, $$MCT-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000121d'::uuid, '00000000-1111-0000-0000-00000000121d'::uuid, $$MCT-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000121f'::uuid, '00000000-1111-0000-0000-000000000ff1'::uuid, $$TE-1-163-2-R6$$, 6, $$R6$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001220'::uuid, $$ASH-015$$, $$ASH-015 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001220'::uuid, '00000000-1111-0000-0000-000000001220'::uuid, $$ASH-015-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001221'::uuid, $$ASH-016$$, $$ASH-016 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001221'::uuid, '00000000-1111-0000-0000-000000001221'::uuid, $$ASH-016-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001222'::uuid, $$ASH-017D$$, $$ASH-017 D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001222'::uuid, '00000000-1111-0000-0000-000000001222'::uuid, $$ASH-017D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001223'::uuid, $$YCM-078D$$, $$YCM-078D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001223'::uuid, '00000000-1111-0000-0000-000000001223'::uuid, $$YCM-078D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001224'::uuid, $$JAE-362$$, $$JAE-362 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001224'::uuid, '00000000-1111-0000-0000-000000001224'::uuid, $$JAE-362-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001225'::uuid, $$RPD-003$$, $$RPD-003 R5$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001225'::uuid, '00000000-1111-0000-0000-000000001225'::uuid, $$RPD-003-R5$$, 5, $$R5$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001226'::uuid, $$THP-008$$, $$THP-008 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001226'::uuid, '00000000-1111-0000-0000-000000001226'::uuid, $$THP-008-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001228'::uuid, '00000000-1111-0000-0000-00000000027a'::uuid, $$JAE-036-ZF$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001229'::uuid, $$CHG-004D$$, $$CHG-004D R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001229'::uuid, '00000000-1111-0000-0000-000000001229'::uuid, $$CHG-004D-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000122a'::uuid, $$OOT-044$$, $$OOT-044$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000122a'::uuid, '00000000-1111-0000-0000-00000000122a'::uuid, $$OOT-044$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000122b'::uuid, $$TE-6-161-1$$, $$TE-6-161-1 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000122b'::uuid, '00000000-1111-0000-0000-00000000122b'::uuid, $$TE-6-161-1-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000122c'::uuid, $$TOK-019$$, $$TOK-019$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000122c'::uuid, '00000000-1111-0000-0000-00000000122c'::uuid, $$TOK-019$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000122d'::uuid, $$TOK-020$$, $$TOK-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000122d'::uuid, '00000000-1111-0000-0000-00000000122d'::uuid, $$TOK-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000122e'::uuid, $$ASH-017$$, $$ASH-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000122e'::uuid, '00000000-1111-0000-0000-00000000122e'::uuid, $$ASH-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000122f'::uuid, $$JAE-363D$$, $$JAE-363D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000122f'::uuid, '00000000-1111-0000-0000-00000000122f'::uuid, $$JAE-363D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001230'::uuid, $$JAE-364D$$, $$JAE-364D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001230'::uuid, '00000000-1111-0000-0000-000000001230'::uuid, $$JAE-364D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001231'::uuid, $$MCT-004D$$, $$MCT-004D R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001231'::uuid, '00000000-1111-0000-0000-000000001231'::uuid, $$MCT-004D-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001232'::uuid, $$YCM-078$$, $$YCM-078$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001232'::uuid, '00000000-1111-0000-0000-000000001232'::uuid, $$YCM-078$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001234'::uuid, '00000000-1111-0000-0000-000000001215'::uuid, $$JAE-357-R4$$, 4, $$R4$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001235'::uuid, '00000000-1111-0000-0000-000000001218'::uuid, $$JAE-358-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001236'::uuid, $$KOS-027$$, $$KOS-027$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001236'::uuid, '00000000-1111-0000-0000-000000001236'::uuid, $$KOS-027$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001237'::uuid, $$KOS-029$$, $$KOS-029$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001237'::uuid, '00000000-1111-0000-0000-000000001237'::uuid, $$KOS-029$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001238'::uuid, $$ATS-022D$$, $$ATS-022D R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001238'::uuid, '00000000-1111-0000-0000-000000001238'::uuid, $$ATS-022D-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001239'::uuid, '00000000-1111-0000-0000-000000001226'::uuid, $$THP-008-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000123a'::uuid, '00000000-1111-0000-0000-00000000121d'::uuid, $$MCT-004-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000123b'::uuid, $$KOS-028$$, $$KOS-028$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000123b'::uuid, '00000000-1111-0000-0000-00000000123b'::uuid, $$KOS-028$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000123c'::uuid, $$CHG-005$$, $$CHG-005 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000123c'::uuid, '00000000-1111-0000-0000-00000000123c'::uuid, $$CHG-005-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000123d'::uuid, $$ODS-056D$$, $$ODS-056D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000123d'::uuid, '00000000-1111-0000-0000-00000000123d'::uuid, $$ODS-056D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000123e'::uuid, $$JAE-364$$, $$JAE-364$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000123e'::uuid, '00000000-1111-0000-0000-00000000123e'::uuid, $$JAE-364$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000123f'::uuid, $$YCM-002$$, $$YCM-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000123f'::uuid, '00000000-1111-0000-0000-00000000123f'::uuid, $$YCM-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001240'::uuid, $$YCM-003$$, $$YCM-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001240'::uuid, '00000000-1111-0000-0000-000000001240'::uuid, $$YCM-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001241'::uuid, $$YCM-004$$, $$YCM-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001241'::uuid, '00000000-1111-0000-0000-000000001241'::uuid, $$YCM-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001242'::uuid, $$YCM-005$$, $$YCM-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001242'::uuid, '00000000-1111-0000-0000-000000001242'::uuid, $$YCM-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001243'::uuid, $$JAE-363$$, $$JAE-363 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001243'::uuid, '00000000-1111-0000-0000-000000001243'::uuid, $$JAE-363-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001244'::uuid, $$KWE-005$$, $$KWE-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001244'::uuid, '00000000-1111-0000-0000-000000001244'::uuid, $$KWE-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001245'::uuid, $$CHG-006$$, $$CHG-006 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001245'::uuid, '00000000-1111-0000-0000-000000001245'::uuid, $$CHG-006-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001246'::uuid, $$TE-4-127-5$$, $$TE-4-127-5$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001246'::uuid, '00000000-1111-0000-0000-000000001246'::uuid, $$TE-4-127-5$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001247'::uuid, $$ODS-056$$, $$ODS-056$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001247'::uuid, '00000000-1111-0000-0000-000000001247'::uuid, $$ODS-056$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001249'::uuid, $$MTM-185-R3CAV3-4$$, $$MTM-185R3 CAV3-4$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001249'::uuid, '00000000-1111-0000-0000-000000001249'::uuid, $$MTM-185-R3CAV3-4$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000124a'::uuid, $$DIC-165-R1D$$, $$DIC-165R1 D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000124a'::uuid, '00000000-1111-0000-0000-00000000124a'::uuid, $$DIC-165-R1D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000124b'::uuid, $$MTM-186-R1CAV3-4$$, $$MTM-186R1 CAV3-4$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000124b'::uuid, '00000000-1111-0000-0000-00000000124b'::uuid, $$MTM-186-R1CAV3-4$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000124c'::uuid, $$MTM-187-R4CAV34$$, $$MTM-187 R4 CAV34$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000124c'::uuid, '00000000-1111-0000-0000-00000000124c'::uuid, $$MTM-187-R4CAV34$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000124d'::uuid, $$MTM-188CAV3-4$$, $$MTM-188 CAV3-4$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000124d'::uuid, '00000000-1111-0000-0000-00000000124d'::uuid, $$MTM-188CAV3-4$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000124e'::uuid, $$MTM-189D$$, $$MTM-189 D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000124e'::uuid, '00000000-1111-0000-0000-00000000124e'::uuid, $$MTM-189D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000124f'::uuid, $$ASH-018$$, $$ASH-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000124f'::uuid, '00000000-1111-0000-0000-00000000124f'::uuid, $$ASH-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001250'::uuid, $$SMK-225$$, $$SMK-225$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001250'::uuid, '00000000-1111-0000-0000-000000001250'::uuid, $$SMK-225$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001251'::uuid, $$ASH-019-R1D$$, $$ASH-019R1 D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001251'::uuid, '00000000-1111-0000-0000-000000001251'::uuid, $$ASH-019-R1D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001252'::uuid, $$KSP-219$$, $$KSP-219$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001252'::uuid, '00000000-1111-0000-0000-000000001252'::uuid, $$KSP-219$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001253'::uuid, $$AON-004$$, $$AON-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001253'::uuid, '00000000-1111-0000-0000-000000001253'::uuid, $$AON-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001254'::uuid, $$KSP-220$$, $$KSP-220 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001254'::uuid, '00000000-1111-0000-0000-000000001254'::uuid, $$KSP-220-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001256'::uuid, $$KSP-221$$, $$KSP-221$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001256'::uuid, '00000000-1111-0000-0000-000000001256'::uuid, $$KSP-221$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001257'::uuid, $$JAE-369$$, $$JAE-369 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001257'::uuid, '00000000-1111-0000-0000-000000001257'::uuid, $$JAE-369-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001258'::uuid, $$APF-001$$, $$APF-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001258'::uuid, '00000000-1111-0000-0000-000000001258'::uuid, $$APF-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001259'::uuid, $$JAE-368$$, $$JAE-368 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001259'::uuid, '00000000-1111-0000-0000-000000001259'::uuid, $$JAE-368-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000125a'::uuid, $$KSP-222$$, $$KSP-222$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000125a'::uuid, '00000000-1111-0000-0000-00000000125a'::uuid, $$KSP-222$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000125b'::uuid, '00000000-1111-0000-0000-000000000e25'::uuid, $$JAE-325-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000125c'::uuid, $$JAE-367D$$, $$JAE-367D R4$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000125c'::uuid, '00000000-1111-0000-0000-00000000125c'::uuid, $$JAE-367D-R4$$, 4, $$R4$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000125d'::uuid, $$ASH-019$$, $$ASH-019 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000125d'::uuid, '00000000-1111-0000-0000-00000000125d'::uuid, $$ASH-019-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000125e'::uuid, $$YCM-020$$, $$YCM-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000125e'::uuid, '00000000-1111-0000-0000-00000000125e'::uuid, $$YCM-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000125f'::uuid, $$MTM-190D$$, $$MTM-190D R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000125f'::uuid, '00000000-1111-0000-0000-00000000125f'::uuid, $$MTM-190D-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001260'::uuid, $$SMK-218D$$, $$SMK-218D R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001260'::uuid, '00000000-1111-0000-0000-000000001260'::uuid, $$SMK-218D-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001261'::uuid, $$SSM-058$$, $$SSM-058$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001261'::uuid, '00000000-1111-0000-0000-000000001261'::uuid, $$SSM-058$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001262'::uuid, $$JAE-370$$, $$JAE-370 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001262'::uuid, '00000000-1111-0000-0000-000000001262'::uuid, $$JAE-370-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001263'::uuid, $$JAE-365$$, $$JAE-365 R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001263'::uuid, '00000000-1111-0000-0000-000000001263'::uuid, $$JAE-365-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001264'::uuid, $$JAE-366$$, $$JAE-366 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001264'::uuid, '00000000-1111-0000-0000-000000001264'::uuid, $$JAE-366-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001265'::uuid, $$SIT-029D$$, $$SIT-029D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001265'::uuid, '00000000-1111-0000-0000-000000001265'::uuid, $$SIT-029D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001266'::uuid, $$KSP-211D$$, $$KSP-211D R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001266'::uuid, '00000000-1111-0000-0000-000000001266'::uuid, $$KSP-211D-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001267'::uuid, $$PB470x400x35$$, $$PB 470x400x35$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001267'::uuid, '00000000-1111-0000-0000-000000001267'::uuid, $$PB470x400x35$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001268'::uuid, $$JAE-371$$, $$JAE-371$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001268'::uuid, '00000000-1111-0000-0000-000000001268'::uuid, $$JAE-371$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001269'::uuid, $$SIT-029$$, $$SIT-029$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001269'::uuid, '00000000-1111-0000-0000-000000001269'::uuid, $$SIT-029$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000126a'::uuid, $$STT-002D$$, $$STT-002 DR1$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000126a'::uuid, '00000000-1111-0000-0000-00000000126a'::uuid, $$STT-002D-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000126b'::uuid, $$KOS-030$$, $$KOS-030$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000126b'::uuid, '00000000-1111-0000-0000-00000000126b'::uuid, $$KOS-030$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000126c'::uuid, $$KOS-031$$, $$KOS-031$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000126c'::uuid, '00000000-1111-0000-0000-00000000126c'::uuid, $$KOS-031$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000126d'::uuid, $$JAE-367$$, $$JAE-367 R5$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000126d'::uuid, '00000000-1111-0000-0000-00000000126d'::uuid, $$JAE-367-R5$$, 5, $$R5$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000126e'::uuid, $$OOT-045$$, $$OOT-045 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000126e'::uuid, '00000000-1111-0000-0000-00000000126e'::uuid, $$OOT-045-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000126f'::uuid, $$MTM-192D$$, $$MTM-192D R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000126f'::uuid, '00000000-1111-0000-0000-00000000126f'::uuid, $$MTM-192D-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001270'::uuid, $$CHG-004$$, $$CHG-004 R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001270'::uuid, '00000000-1111-0000-0000-000000001270'::uuid, $$CHG-004-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001271'::uuid, $$MTM-194D$$, $$MTM-194D R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001271'::uuid, '00000000-1111-0000-0000-000000001271'::uuid, $$MTM-194D-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001272'::uuid, $$MTM-193D$$, $$MTM-193D R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001272'::uuid, '00000000-1111-0000-0000-000000001272'::uuid, $$MTM-193D-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001273'::uuid, '00000000-1111-0000-0000-000000001263'::uuid, $$JAE-365-R4$$, 4, $$R4$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001274'::uuid, $$CHG-001D$$, $$CHG-001 D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001274'::uuid, '00000000-1111-0000-0000-000000001274'::uuid, $$CHG-001D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001276'::uuid, $$CHG-011D$$, $$CHG-011D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001276'::uuid, '00000000-1111-0000-0000-000000001276'::uuid, $$CHG-011D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001277'::uuid, '00000000-1111-0000-0000-000000001264'::uuid, $$JAE-366-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001278'::uuid, '00000000-1111-0000-0000-000000001268'::uuid, $$JAE-371-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001279'::uuid, $$MTM-190$$, $$MTM-190 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001279'::uuid, '00000000-1111-0000-0000-000000001279'::uuid, $$MTM-190-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000127a'::uuid, $$SMK-218$$, $$SMK-218 R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000127a'::uuid, '00000000-1111-0000-0000-00000000127a'::uuid, $$SMK-218-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000127b'::uuid, $$JAE-372$$, $$JAE-372 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000127b'::uuid, '00000000-1111-0000-0000-00000000127b'::uuid, $$JAE-372-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000127c'::uuid, $$JAE-373$$, $$JAE-373$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000127c'::uuid, '00000000-1111-0000-0000-00000000127c'::uuid, $$JAE-373$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000127d'::uuid, $$MTM-189$$, $$MTM-189$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000127d'::uuid, '00000000-1111-0000-0000-00000000127d'::uuid, $$MTM-189$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000127e'::uuid, $$JAE-374$$, $$JAE-374$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000127e'::uuid, '00000000-1111-0000-0000-00000000127e'::uuid, $$JAE-374$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000127f'::uuid, $$DIC-167$$, $$DIC-167$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000127f'::uuid, '00000000-1111-0000-0000-00000000127f'::uuid, $$DIC-167$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001280'::uuid, '00000000-1111-0000-0000-000000001266'::uuid, $$KSP-211D-R5$$, 5, $$R5$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001281'::uuid, $$MTM-191D$$, $$MTM-191D R5$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001281'::uuid, '00000000-1111-0000-0000-000000001281'::uuid, $$MTM-191D-R5$$, 5, $$R5$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001282'::uuid, $$PB-355X240$$, $$PB-355X240$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001282'::uuid, '00000000-1111-0000-0000-000000001282'::uuid, $$PB-355X240$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001283'::uuid, $$AON-005$$, $$AON-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001283'::uuid, '00000000-1111-0000-0000-000000001283'::uuid, $$AON-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001285'::uuid, $$WB-470X347$$, $$WB-470X347$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001285'::uuid, '00000000-1111-0000-0000-000000001285'::uuid, $$WB-470X347$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001286'::uuid, '00000000-1111-0000-0000-000000001272'::uuid, $$MTM-193D-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001287'::uuid, $$KOS-032$$, $$KOS-032$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001287'::uuid, '00000000-1111-0000-0000-000000001287'::uuid, $$KOS-032$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001288'::uuid, $$SMK-227D$$, $$SMK-227D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001288'::uuid, '00000000-1111-0000-0000-000000001288'::uuid, $$SMK-227D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001289'::uuid, $$CHG-008D$$, $$CHG-008D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001289'::uuid, '00000000-1111-0000-0000-000000001289'::uuid, $$CHG-008D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000128b'::uuid, $$CHG-009D$$, $$CHG-009D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000128b'::uuid, '00000000-1111-0000-0000-00000000128b'::uuid, $$CHG-009D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000128c'::uuid, $$SMK-226D$$, $$SMK-226D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000128c'::uuid, '00000000-1111-0000-0000-00000000128c'::uuid, $$SMK-226D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000128d'::uuid, $$SMK-228D$$, $$SMK-228D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000128d'::uuid, '00000000-1111-0000-0000-00000000128d'::uuid, $$SMK-228D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000128e'::uuid, $$CHG-010D$$, $$CHG-010D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000128e'::uuid, '00000000-1111-0000-0000-00000000128e'::uuid, $$CHG-010D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000128f'::uuid, $$MTM-194$$, $$MTM-194 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000128f'::uuid, '00000000-1111-0000-0000-00000000128f'::uuid, $$MTM-194-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001290'::uuid, $$ASH-020D$$, $$ASH-020D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001290'::uuid, '00000000-1111-0000-0000-000000001290'::uuid, $$ASH-020D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001291'::uuid, $$CHG-007D$$, $$CHG-007D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001291'::uuid, '00000000-1111-0000-0000-000000001291'::uuid, $$CHG-007D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001292'::uuid, '00000000-1111-0000-0000-0000000011b4'::uuid, $$CHG-001-R8$$, 8, $$R8$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001293'::uuid, $$MTM-192$$, $$MTM-192 R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001293'::uuid, '00000000-1111-0000-0000-000000001293'::uuid, $$MTM-192-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001294'::uuid, $$CHG-012D$$, $$CHG-012D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001294'::uuid, '00000000-1111-0000-0000-000000001294'::uuid, $$CHG-012D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001295'::uuid, $$CHG-013D$$, $$CHG-013D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001295'::uuid, '00000000-1111-0000-0000-000000001295'::uuid, $$CHG-013D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001296'::uuid, $$DIC-166$$, $$DIC-166$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001296'::uuid, '00000000-1111-0000-0000-000000001296'::uuid, $$DIC-166$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001297'::uuid, $$DIC-168$$, $$DIC-168 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001297'::uuid, '00000000-1111-0000-0000-000000001297'::uuid, $$DIC-168-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001298'::uuid, $$DIC-169$$, $$DIC-169 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001298'::uuid, '00000000-1111-0000-0000-000000001298'::uuid, $$DIC-169-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000001299'::uuid, $$DIC-170$$, $$DIC-170 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000001299'::uuid, '00000000-1111-0000-0000-000000001299'::uuid, $$DIC-170-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000129a'::uuid, $$NHC-009$$, $$NHC-009 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000129a'::uuid, '00000000-1111-0000-0000-00000000129a'::uuid, $$NHC-009-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000129b'::uuid, $$PB-470X300ND$$, $$PB-470X300 ND$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000129b'::uuid, '00000000-1111-0000-0000-00000000129b'::uuid, $$PB-470X300ND$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000129c'::uuid, $$MTM-195D$$, $$MTM-195D R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000129c'::uuid, '00000000-1111-0000-0000-00000000129c'::uuid, $$MTM-195D-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000129d'::uuid, $$MTM-193$$, $$MTM-193 R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000129d'::uuid, '00000000-1111-0000-0000-00000000129d'::uuid, $$MTM-193-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000129e'::uuid, $$JAE-376$$, $$JAE-376 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000129e'::uuid, '00000000-1111-0000-0000-00000000129e'::uuid, $$JAE-376-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000129f'::uuid, $$SMK-229$$, $$SMK-229$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000129f'::uuid, '00000000-1111-0000-0000-00000000129f'::uuid, $$SMK-229$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000012a0'::uuid, $$TE-7-129-3$$, $$TE-7-129-3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000012a0'::uuid, '00000000-1111-0000-0000-0000000012a0'::uuid, $$TE-7-129-3$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000012a1'::uuid, $$JAE-375$$, $$JAE-375 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000012a1'::uuid, '00000000-1111-0000-0000-0000000012a1'::uuid, $$JAE-375-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000012a2'::uuid, $$MDS-008D$$, $$MDS-008D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000012a2'::uuid, '00000000-1111-0000-0000-0000000012a2'::uuid, $$MDS-008D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000012a3'::uuid, $$ASH-020$$, $$ASH-020 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000012a3'::uuid, '00000000-1111-0000-0000-0000000012a3'::uuid, $$ASH-020-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000012a4'::uuid, $$WB-355X240UPPE$$, $$WB-355X240 UPPER$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000012a4'::uuid, '00000000-1111-0000-0000-0000000012a4'::uuid, $$WB-355X240UPPE-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000012a5'::uuid, $$WB-355X240UNDE$$, $$WB-355X240 UNDER$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000012a5'::uuid, '00000000-1111-0000-0000-0000000012a5'::uuid, $$WB-355X240UNDE-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000012a6'::uuid, $$PB-460X330ZA$$, $$PB-460X330 ZA$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000012a6'::uuid, '00000000-1111-0000-0000-0000000012a6'::uuid, $$PB-460X330ZA$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000012a7'::uuid, $$MTM-191$$, $$MTM-191 R5$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000012a7'::uuid, '00000000-1111-0000-0000-0000000012a7'::uuid, $$MTM-191-R5$$, 5, $$R5$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000012a8'::uuid, $$MTM-197D$$, $$MTM-197 DR1$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000012a8'::uuid, '00000000-1111-0000-0000-0000000012a8'::uuid, $$MTM-197D-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000012a9'::uuid, $$MDS-009D$$, $$MDS-009D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000012a9'::uuid, '00000000-1111-0000-0000-0000000012a9'::uuid, $$MDS-009D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000012aa'::uuid, $$MTM-196D$$, $$MTM-196D R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000012aa'::uuid, '00000000-1111-0000-0000-0000000012aa'::uuid, $$MTM-196D-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000012ab'::uuid, $$SIT-030D$$, $$SIT-030D R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000012ab'::uuid, '00000000-1111-0000-0000-0000000012ab'::uuid, $$SIT-030D-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000012ac'::uuid, $$SRI-008D$$, $$SRI-008D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000012ac'::uuid, '00000000-1111-0000-0000-0000000012ac'::uuid, $$SRI-008D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000012ad'::uuid, $$SMK-227$$, $$SMK-227 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000012ad'::uuid, '00000000-1111-0000-0000-0000000012ad'::uuid, $$SMK-227-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000012ae'::uuid, $$SMK-228$$, $$SMK-228 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000012ae'::uuid, '00000000-1111-0000-0000-0000000012ae'::uuid, $$SMK-228-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000012af'::uuid, $$MTM-195$$, $$MTM-195 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000012af'::uuid, '00000000-1111-0000-0000-0000000012af'::uuid, $$MTM-195-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000012b0'::uuid, $$YCM-079D$$, $$YCM-079D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000012b0'::uuid, '00000000-1111-0000-0000-0000000012b0'::uuid, $$YCM-079D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000000a'::uuid, $$TIH-014$$, '00000000-2222-0000-0000-000000000c00'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000000c'::uuid, $$TKO-009-TN1$$, '00000000-2222-0000-0000-000000000c2f'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;

COMMIT;
