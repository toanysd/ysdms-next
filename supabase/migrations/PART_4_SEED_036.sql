-- PART 4/14
BEGIN;

INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000060d'::uuid, $$MZT-145$$, $$MZT-145$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000060d'::uuid, '00000000-1111-0000-0000-00000000060d'::uuid, $$MZT-145$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000060e'::uuid, $$MZT-NoName$$, $$MZT-NoName$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000060e'::uuid, '00000000-1111-0000-0000-00000000060e'::uuid, $$MZT-NoName$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000060f'::uuid, $$MZT-無印$$, $$MZT-無印$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000060f'::uuid, '00000000-1111-0000-0000-00000000060f'::uuid, $$MZT-無印$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000610'::uuid, $$NA-001$$, $$NA-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000610'::uuid, '00000000-1111-0000-0000-000000000610'::uuid, $$NA-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000611'::uuid, $$NAC-001$$, $$NAC-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000611'::uuid, '00000000-1111-0000-0000-000000000611'::uuid, $$NAC-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000612'::uuid, $$NCD-001$$, $$NCD-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000612'::uuid, '00000000-1111-0000-0000-000000000612'::uuid, $$NCD-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000614'::uuid, $$NEC$$, $$NEC$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000614'::uuid, '00000000-1111-0000-0000-000000000614'::uuid, $$NEC$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000615'::uuid, $$NEC-001$$, $$NEC-001B$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000615'::uuid, '00000000-1111-0000-0000-000000000615'::uuid, $$NEC-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000617'::uuid, $$NEC-002$$, $$NEC-002B$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000617'::uuid, '00000000-1111-0000-0000-000000000617'::uuid, $$NEC-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000619'::uuid, $$NEC-007$$, $$NEC-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000619'::uuid, '00000000-1111-0000-0000-000000000619'::uuid, $$NEC-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000061a'::uuid, '00000000-1111-0000-0000-000000000619'::uuid, $$NEC-007-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000061b'::uuid, $$NEC-008$$, $$NEC-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000061b'::uuid, '00000000-1111-0000-0000-00000000061b'::uuid, $$NEC-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000061c'::uuid, $$NEC-009$$, $$NEC-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000061c'::uuid, '00000000-1111-0000-0000-00000000061c'::uuid, $$NEC-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000061e'::uuid, $$NEC-009Bxx$$, $$NEC-009B xx$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000061e'::uuid, '00000000-1111-0000-0000-00000000061e'::uuid, $$NEC-009Bxx$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000620'::uuid, $$NEC-009T3$$, $$NEC-009T 3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000620'::uuid, '00000000-1111-0000-0000-000000000620'::uuid, $$NEC-009T3$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000621'::uuid, $$NEC-009Txx$$, $$NEC-009T xx$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000621'::uuid, '00000000-1111-0000-0000-000000000621'::uuid, $$NEC-009Txx$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000622'::uuid, $$NEC-010$$, $$NEC-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000622'::uuid, '00000000-1111-0000-0000-000000000622'::uuid, $$NEC-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000623'::uuid, $$NEC-011$$, $$NEC-011B$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000623'::uuid, '00000000-1111-0000-0000-000000000623'::uuid, $$NEC-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000625'::uuid, $$NEC-012$$, $$NEC-012B$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000625'::uuid, '00000000-1111-0000-0000-000000000625'::uuid, $$NEC-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000626'::uuid, $$NEC-013$$, $$NEC-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000626'::uuid, '00000000-1111-0000-0000-000000000626'::uuid, $$NEC-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000627'::uuid, $$NEC-014$$, $$NEC-014R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000627'::uuid, '00000000-1111-0000-0000-000000000627'::uuid, $$NEC-014-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000628'::uuid, $$NEC-016$$, $$NEC-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000628'::uuid, '00000000-1111-0000-0000-000000000628'::uuid, $$NEC-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000629'::uuid, $$NEC-017$$, $$NEC-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000629'::uuid, '00000000-1111-0000-0000-000000000629'::uuid, $$NEC-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000062a'::uuid, $$NFC-001$$, $$NFC-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000062a'::uuid, '00000000-1111-0000-0000-00000000062a'::uuid, $$NFC-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000062b'::uuid, $$NFC-001ASANOPLATE$$, $$NFC-001 ASANO PLATE$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000062b'::uuid, '00000000-1111-0000-0000-00000000062b'::uuid, $$NFC-001ASANOPLATE$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000062c'::uuid, $$NFC-001追加工・治具$$, $$NFC-001追加工・治具$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000062c'::uuid, '00000000-1111-0000-0000-00000000062c'::uuid, $$NFC-001追加工・治具$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000062d'::uuid, $$NFC-002$$, $$NFC-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000062d'::uuid, '00000000-1111-0000-0000-00000000062d'::uuid, $$NFC-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000062e'::uuid, $$NGK-001$$, $$NGK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000062e'::uuid, '00000000-1111-0000-0000-00000000062e'::uuid, $$NGK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000062f'::uuid, $$NGK-002$$, $$NGK-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000062f'::uuid, '00000000-1111-0000-0000-00000000062f'::uuid, $$NGK-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000630'::uuid, $$NGK-003$$, $$NGK-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000630'::uuid, '00000000-1111-0000-0000-000000000630'::uuid, $$NGK-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000631'::uuid, $$NGS-001$$, $$NGS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000631'::uuid, '00000000-1111-0000-0000-000000000631'::uuid, $$NGS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000632'::uuid, $$NGS-002$$, $$NGS-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000632'::uuid, '00000000-1111-0000-0000-000000000632'::uuid, $$NGS-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000633'::uuid, $$NGS-003$$, $$NGS-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000633'::uuid, '00000000-1111-0000-0000-000000000633'::uuid, $$NGS-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000634'::uuid, $$NGS-004$$, $$NGS-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000634'::uuid, '00000000-1111-0000-0000-000000000634'::uuid, $$NGS-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000635'::uuid, $$NGS-005$$, $$NGS-005B$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000635'::uuid, '00000000-1111-0000-0000-000000000635'::uuid, $$NGS-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000637'::uuid, $$NGS-006$$, $$NGS-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000637'::uuid, '00000000-1111-0000-0000-000000000637'::uuid, $$NGS-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000638'::uuid, $$NGS-007$$, $$NGS-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000638'::uuid, '00000000-1111-0000-0000-000000000638'::uuid, $$NGS-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000639'::uuid, $$NGS-008$$, $$NGS-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000639'::uuid, '00000000-1111-0000-0000-000000000639'::uuid, $$NGS-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000063a'::uuid, $$NGS-009$$, $$NGS-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000063a'::uuid, '00000000-1111-0000-0000-00000000063a'::uuid, $$NGS-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000063b'::uuid, $$NGS-010$$, $$NGS-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000063b'::uuid, '00000000-1111-0000-0000-00000000063b'::uuid, $$NGS-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000063c'::uuid, $$NGS-011$$, $$NGS-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000063c'::uuid, '00000000-1111-0000-0000-00000000063c'::uuid, $$NGS-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000063d'::uuid, $$NGS-012$$, $$NGS-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000063d'::uuid, '00000000-1111-0000-0000-00000000063d'::uuid, $$NGS-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000063e'::uuid, $$NGS-013$$, $$NGS-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000063e'::uuid, '00000000-1111-0000-0000-00000000063e'::uuid, $$NGS-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000063f'::uuid, $$NGS-013AB$$, $$NGS-013AB$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$AB$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000063f'::uuid, '00000000-1111-0000-0000-00000000063f'::uuid, $$NGS-013AB$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000640'::uuid, $$NGS-014$$, $$NGS-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000640'::uuid, '00000000-1111-0000-0000-000000000640'::uuid, $$NGS-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000641'::uuid, $$NGS-015$$, $$NGS-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000641'::uuid, '00000000-1111-0000-0000-000000000641'::uuid, $$NGS-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000642'::uuid, $$NGS-016?$$, $$NGS-016?$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000642'::uuid, '00000000-1111-0000-0000-000000000642'::uuid, $$NGS-016?$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000643'::uuid, $$NGS-016$$, $$NGS-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000643'::uuid, '00000000-1111-0000-0000-000000000643'::uuid, $$NGS-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000644'::uuid, $$NGS-017D$$, $$NGS-017D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000644'::uuid, '00000000-1111-0000-0000-000000000644'::uuid, $$NGS-017D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000645'::uuid, $$NGS-017$$, $$NGS-017　R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000645'::uuid, '00000000-1111-0000-0000-000000000645'::uuid, $$NGS-017-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000646'::uuid, $$NGT-001$$, $$NGT-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000646'::uuid, '00000000-1111-0000-0000-000000000646'::uuid, $$NGT-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000647'::uuid, $$NGT-005$$, $$NGT-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000647'::uuid, '00000000-1111-0000-0000-000000000647'::uuid, $$NGT-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000648'::uuid, $$NGT-007$$, $$NGT-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000648'::uuid, '00000000-1111-0000-0000-000000000648'::uuid, $$NGT-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000649'::uuid, $$NGT-008$$, $$NGT-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000649'::uuid, '00000000-1111-0000-0000-000000000649'::uuid, $$NGT-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000064a'::uuid, $$NGT-011$$, $$NGT-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000064a'::uuid, '00000000-1111-0000-0000-00000000064a'::uuid, $$NGT-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000064b'::uuid, $$NGT-012$$, $$NGT-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000064b'::uuid, '00000000-1111-0000-0000-00000000064b'::uuid, $$NGT-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000064c'::uuid, $$NHC-001$$, $$NHC-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000064c'::uuid, '00000000-1111-0000-0000-00000000064c'::uuid, $$NHC-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000064d'::uuid, $$NHC-002$$, $$NHC-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000064d'::uuid, '00000000-1111-0000-0000-00000000064d'::uuid, $$NHC-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000064e'::uuid, $$NHC-003$$, $$NHC-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000064e'::uuid, '00000000-1111-0000-0000-00000000064e'::uuid, $$NHC-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000064f'::uuid, $$NHC-006$$, $$NHC-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000064f'::uuid, '00000000-1111-0000-0000-00000000064f'::uuid, $$NHC-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000650'::uuid, $$NHC-007$$, $$NHC-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000650'::uuid, '00000000-1111-0000-0000-000000000650'::uuid, $$NHC-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000651'::uuid, $$NHC-008$$, $$NHC-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000651'::uuid, '00000000-1111-0000-0000-000000000651'::uuid, $$NHC-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000652'::uuid, $$NHK-001$$, $$NHK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000652'::uuid, '00000000-1111-0000-0000-000000000652'::uuid, $$NHK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000653'::uuid, $$NHK-002$$, $$NHK-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000653'::uuid, '00000000-1111-0000-0000-000000000653'::uuid, $$NHK-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000654'::uuid, $$NHK-005D$$, $$NHK-005D R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000654'::uuid, '00000000-1111-0000-0000-000000000654'::uuid, $$NHK-005D-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000655'::uuid, $$NHK-006$$, $$NHK-006 R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000655'::uuid, '00000000-1111-0000-0000-000000000655'::uuid, $$NHK-006-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000656'::uuid, $$NHK-009$$, $$NHK-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000656'::uuid, '00000000-1111-0000-0000-000000000656'::uuid, $$NHK-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000657'::uuid, $$NHK-012$$, $$NHK-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000657'::uuid, '00000000-1111-0000-0000-000000000657'::uuid, $$NHK-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000658'::uuid, $$NIT-001$$, $$NIT-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000658'::uuid, '00000000-1111-0000-0000-000000000658'::uuid, $$NIT-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000659'::uuid, $$NIT-002$$, $$NIT-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000659'::uuid, '00000000-1111-0000-0000-000000000659'::uuid, $$NIT-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000065a'::uuid, $$NIT-003$$, $$NIT-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000065a'::uuid, '00000000-1111-0000-0000-00000000065a'::uuid, $$NIT-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000065b'::uuid, $$NIT-004$$, $$NIT-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000065b'::uuid, '00000000-1111-0000-0000-00000000065b'::uuid, $$NIT-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000065c'::uuid, $$NIT-006$$, $$NIT-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000065c'::uuid, '00000000-1111-0000-0000-00000000065c'::uuid, $$NIT-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000065d'::uuid, $$NIT-007$$, $$NIT-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000065d'::uuid, '00000000-1111-0000-0000-00000000065d'::uuid, $$NIT-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000065e'::uuid, $$NIT-008$$, $$NIT-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000065e'::uuid, '00000000-1111-0000-0000-00000000065e'::uuid, $$NIT-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000065f'::uuid, $$NKI-003$$, $$NKI-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000065f'::uuid, '00000000-1111-0000-0000-00000000065f'::uuid, $$NKI-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000660'::uuid, $$NKI-004$$, $$NKI-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000660'::uuid, '00000000-1111-0000-0000-000000000660'::uuid, $$NKI-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000661'::uuid, $$NKI-005$$, $$NKI-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000661'::uuid, '00000000-1111-0000-0000-000000000661'::uuid, $$NKI-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000662'::uuid, $$NKI-007$$, $$NKI-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000662'::uuid, '00000000-1111-0000-0000-000000000662'::uuid, $$NKI-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000663'::uuid, $$NKP-001$$, $$NKP-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000663'::uuid, '00000000-1111-0000-0000-000000000663'::uuid, $$NKP-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000664'::uuid, $$NKP-002$$, $$NKP-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000664'::uuid, '00000000-1111-0000-0000-000000000664'::uuid, $$NKP-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000665'::uuid, $$NML-001$$, $$NML-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000665'::uuid, '00000000-1111-0000-0000-000000000665'::uuid, $$NML-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000666'::uuid, $$NML-001(210x160)$$, $$NML-001(210x160)$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000666'::uuid, '00000000-1111-0000-0000-000000000666'::uuid, $$NML-001(210x160)$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000667'::uuid, $$NML-002$$, $$NML-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000667'::uuid, '00000000-1111-0000-0000-000000000667'::uuid, $$NML-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000668'::uuid, $$NML-003$$, $$NML-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000668'::uuid, '00000000-1111-0000-0000-000000000668'::uuid, $$NML-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000669'::uuid, $$NML-004$$, $$NML-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000669'::uuid, '00000000-1111-0000-0000-000000000669'::uuid, $$NML-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000066a'::uuid, $$NML-005$$, $$NML-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000066a'::uuid, '00000000-1111-0000-0000-00000000066a'::uuid, $$NML-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000066b'::uuid, $$NML-006$$, $$NML-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000066b'::uuid, '00000000-1111-0000-0000-00000000066b'::uuid, $$NML-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000066c'::uuid, $$NML-007$$, $$NML-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000066c'::uuid, '00000000-1111-0000-0000-00000000066c'::uuid, $$NML-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000066d'::uuid, $$NML-008$$, $$NML-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000066d'::uuid, '00000000-1111-0000-0000-00000000066d'::uuid, $$NML-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000066e'::uuid, $$NNP-001$$, $$NNP-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000066e'::uuid, '00000000-1111-0000-0000-00000000066e'::uuid, $$NNP-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000066f'::uuid, $$NoName$$, $$No Name$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000066f'::uuid, '00000000-1111-0000-0000-00000000066f'::uuid, $$NoName$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000670'::uuid, $$EXD-021$$, $$EXD-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000670'::uuid, '00000000-1111-0000-0000-000000000670'::uuid, $$EXD-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000671'::uuid, $$NoName-(大）$$, $$No Name-(大）$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000671'::uuid, '00000000-1111-0000-0000-000000000671'::uuid, $$NoName-(大）$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000672'::uuid, $$NoName-015210x160$$, $$No Name-015 210x160$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000672'::uuid, '00000000-1111-0000-0000-000000000672'::uuid, $$NoName-015210x160$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000673'::uuid, $$16POCKETS$$, $$16POCKETS$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000673'::uuid, '00000000-1111-0000-0000-000000000673'::uuid, $$16POCKETS$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000674'::uuid, $$NoName-147x$$, $$No Name-147x$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000674'::uuid, '00000000-1111-0000-0000-000000000674'::uuid, $$NoName-147x$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000675'::uuid, $$NoName-175x340$$, $$No Name-175x340$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000675'::uuid, '00000000-1111-0000-0000-000000000675'::uuid, $$NoName-175x340$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000676'::uuid, $$NoName-200x$$, $$No Name-200x$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000676'::uuid, '00000000-1111-0000-0000-000000000676'::uuid, $$NoName-200x$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000677'::uuid, $$NoName-200x560$$, $$No Name-200x560$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000677'::uuid, '00000000-1111-0000-0000-000000000677'::uuid, $$NoName-200x560$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000678'::uuid, $$NoName-210x160$$, $$No Name-210x160$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000678'::uuid, '00000000-1111-0000-0000-000000000678'::uuid, $$NoName-210x160$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000679'::uuid, $$NoName-299x?$$, $$No Name-299x?$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000679'::uuid, '00000000-1111-0000-0000-000000000679'::uuid, $$NoName-299x?$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000067a'::uuid, $$NoName-34?$$, $$No Name-34?$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000067a'::uuid, '00000000-1111-0000-0000-00000000067a'::uuid, $$NoName-34?$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000067b'::uuid, $$NoName-385x265x(40)$$, $$No Name-385x265x(40)$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000067b'::uuid, '00000000-1111-0000-0000-00000000067b'::uuid, $$NoName-385x265x(40)$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000067c'::uuid, $$NoName-405x?$$, $$No Name-405x?$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000067c'::uuid, '00000000-1111-0000-0000-00000000067c'::uuid, $$NoName-405x?$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000067d'::uuid, $$NoName-405x?SSJ?$$, $$No Name-405x? SSJ?$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000067d'::uuid, '00000000-1111-0000-0000-00000000067d'::uuid, $$NoName-405x?SSJ?$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000067e'::uuid, $$NoName-45x347x$$, $$No Name-45x347x$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000067e'::uuid, '00000000-1111-0000-0000-00000000067e'::uuid, $$NoName-45x347x$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000067f'::uuid, $$NoName-4面$$, $$No Name-4面$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000067f'::uuid, '00000000-1111-0000-0000-00000000067f'::uuid, $$NoName-4面$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000680'::uuid, $$NoName-540x420x(40)$$, $$No Name-540x420x(40)$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000680'::uuid, '00000000-1111-0000-0000-000000000680'::uuid, $$NoName-540x420x(40)$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000681'::uuid, $$NoName-570x380x(35)$$, $$No Name-570x380x(35)$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000681'::uuid, '00000000-1111-0000-0000-000000000681'::uuid, $$NoName-570x380x(35)$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000682'::uuid, $$NoName-D?$$, $$No Name-D?$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000682'::uuid, '00000000-1111-0000-0000-000000000682'::uuid, $$NoName-D?$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000683'::uuid, $$NoName-M-S->385x265$$, $$No Name-M-S -> 385x265$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000683'::uuid, '00000000-1111-0000-0000-000000000683'::uuid, $$NoName-M-S->385x265$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000684'::uuid, $$UNNAMED-001$$, $$No Name-No Number1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000684'::uuid, '00000000-1111-0000-0000-000000000684'::uuid, $$UNNAMED-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000685'::uuid, $$NoName-SSJ?$$, $$No Name-SSJ?$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000685'::uuid, '00000000-1111-0000-0000-000000000685'::uuid, $$NoName-SSJ?$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000686'::uuid, $$NoName-ストッパー$$, $$No Name-ストッパー$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000686'::uuid, '00000000-1111-0000-0000-000000000686'::uuid, $$NoName-ストッパー$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000687'::uuid, $$NoName-ダウンライト枠通箱トレイ$$, $$No Name-ダウンライト枠通箱トレイ$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000687'::uuid, '00000000-1111-0000-0000-000000000687'::uuid, $$NoName-ダウンライト枠通箱トレイ$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000688'::uuid, $$NoName-台湾機用$$, $$No Name-台湾機用$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000688'::uuid, '00000000-1111-0000-0000-000000000688'::uuid, $$NoName-台湾機用$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000689'::uuid, $$NPC-003$$, $$NPC-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000689'::uuid, '00000000-1111-0000-0000-000000000689'::uuid, $$NPC-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000068a'::uuid, $$NPC-011$$, $$NPC-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000068a'::uuid, '00000000-1111-0000-0000-00000000068a'::uuid, $$NPC-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000068b'::uuid, $$NPC-013$$, $$NPC-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000068b'::uuid, '00000000-1111-0000-0000-00000000068b'::uuid, $$NPC-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000068c'::uuid, $$NPC-014$$, $$NPC-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000068c'::uuid, '00000000-1111-0000-0000-00000000068c'::uuid, $$NPC-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000068d'::uuid, $$NPC-T010$$, $$NPC-T010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000068d'::uuid, '00000000-1111-0000-0000-00000000068d'::uuid, $$NPC-T010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000068e'::uuid, $$NPC-T032$$, $$NPC-T032$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000068e'::uuid, '00000000-1111-0000-0000-00000000068e'::uuid, $$NPC-T032$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000690'::uuid, $$NPK-001$$, $$NPK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000690'::uuid, '00000000-1111-0000-0000-000000000690'::uuid, $$NPK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000691'::uuid, $$NPK-test?$$, $$NPK-test?$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000691'::uuid, '00000000-1111-0000-0000-000000000691'::uuid, $$NPK-test?$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000692'::uuid, $$NPR-001$$, $$NPR-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000692'::uuid, '00000000-1111-0000-0000-000000000692'::uuid, $$NPR-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000693'::uuid, $$NPR-002$$, $$NPR-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000693'::uuid, '00000000-1111-0000-0000-000000000693'::uuid, $$NPR-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000694'::uuid, $$NPR-003$$, $$NPR-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000694'::uuid, '00000000-1111-0000-0000-000000000694'::uuid, $$NPR-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000695'::uuid, $$NRK-001$$, $$NRK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000695'::uuid, '00000000-1111-0000-0000-000000000695'::uuid, $$NRK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000696'::uuid, $$NRK-002$$, $$NRK-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000696'::uuid, '00000000-1111-0000-0000-000000000696'::uuid, $$NRK-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000697'::uuid, $$NRK-004$$, $$NRK-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000697'::uuid, '00000000-1111-0000-0000-000000000697'::uuid, $$NRK-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000698'::uuid, $$NRK-005$$, $$NRK-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000698'::uuid, '00000000-1111-0000-0000-000000000698'::uuid, $$NRK-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000699'::uuid, $$NRK-007$$, $$NRK-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000699'::uuid, '00000000-1111-0000-0000-000000000699'::uuid, $$NRK-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000069a'::uuid, $$NRK-008$$, $$NRK-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000069a'::uuid, '00000000-1111-0000-0000-00000000069a'::uuid, $$NRK-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000069b'::uuid, $$NRK-009$$, $$NRK-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000069b'::uuid, '00000000-1111-0000-0000-00000000069b'::uuid, $$NRK-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000069c'::uuid, $$NRK-010$$, $$NRK-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000069c'::uuid, '00000000-1111-0000-0000-00000000069c'::uuid, $$NRK-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000069d'::uuid, $$NRK-011$$, $$NRK-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000069d'::uuid, '00000000-1111-0000-0000-00000000069d'::uuid, $$NRK-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000069e'::uuid, $$NRK-012$$, $$NRK-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000069e'::uuid, '00000000-1111-0000-0000-00000000069e'::uuid, $$NRK-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000069f'::uuid, $$NRK-013$$, $$NRK-013R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000069f'::uuid, '00000000-1111-0000-0000-00000000069f'::uuid, $$NRK-013-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006a0'::uuid, $$NRK-022$$, $$NRK-022R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006a0'::uuid, '00000000-1111-0000-0000-0000000006a0'::uuid, $$NRK-022-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006a1'::uuid, $$NRK-024$$, $$NRK-024$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006a1'::uuid, '00000000-1111-0000-0000-0000000006a1'::uuid, $$NRK-024$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006a2'::uuid, $$NRK-025$$, $$NRK-025$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006a2'::uuid, '00000000-1111-0000-0000-0000000006a2'::uuid, $$NRK-025$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006a3'::uuid, $$NRK-026$$, $$NRK-026$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006a3'::uuid, '00000000-1111-0000-0000-0000000006a3'::uuid, $$NRK-026$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006a4'::uuid, $$NRK-030$$, $$NRK-030$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006a4'::uuid, '00000000-1111-0000-0000-0000000006a4'::uuid, $$NRK-030$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006a5'::uuid, $$NRK-031$$, $$NRK-031$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006a5'::uuid, '00000000-1111-0000-0000-0000000006a5'::uuid, $$NRK-031$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006a6'::uuid, $$NRK-032$$, $$NRK-032$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006a6'::uuid, '00000000-1111-0000-0000-0000000006a6'::uuid, $$NRK-032$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006a7'::uuid, $$NRK-034$$, $$NRK-034$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006a7'::uuid, '00000000-1111-0000-0000-0000000006a7'::uuid, $$NRK-034$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006a8'::uuid, $$NRK-035$$, $$NRK-035$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006a8'::uuid, '00000000-1111-0000-0000-0000000006a8'::uuid, $$NRK-035$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006a9'::uuid, $$NRK-037$$, $$NRK-037$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006a9'::uuid, '00000000-1111-0000-0000-0000000006a9'::uuid, $$NRK-037$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006aa'::uuid, $$NRK-038$$, $$NRK-038$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006aa'::uuid, '00000000-1111-0000-0000-0000000006aa'::uuid, $$NRK-038$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006ab'::uuid, $$NRK-039$$, $$NRK-039$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006ab'::uuid, '00000000-1111-0000-0000-0000000006ab'::uuid, $$NRK-039$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006ac'::uuid, $$NRK-042$$, $$NRK-042$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006ac'::uuid, '00000000-1111-0000-0000-0000000006ac'::uuid, $$NRK-042$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006ad'::uuid, $$NRK-043$$, $$NRK-043$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006ad'::uuid, '00000000-1111-0000-0000-0000000006ad'::uuid, $$NRK-043$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006ae'::uuid, $$NRK-044$$, $$NRK-044$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006ae'::uuid, '00000000-1111-0000-0000-0000000006ae'::uuid, $$NRK-044$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006af'::uuid, $$NRK-046$$, $$NRK-046$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006af'::uuid, '00000000-1111-0000-0000-0000000006af'::uuid, $$NRK-046$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006b0'::uuid, $$NSE-001$$, $$NSE-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006b0'::uuid, '00000000-1111-0000-0000-0000000006b0'::uuid, $$NSE-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006b1'::uuid, $$NSE-002$$, $$NSE-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006b1'::uuid, '00000000-1111-0000-0000-0000000006b1'::uuid, $$NSE-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006b2'::uuid, $$NSE-003$$, $$NSE-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006b2'::uuid, '00000000-1111-0000-0000-0000000006b2'::uuid, $$NSE-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006b3'::uuid, $$NSK$$, $$NSK$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006b3'::uuid, '00000000-1111-0000-0000-0000000006b3'::uuid, $$NSK$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006b4'::uuid, $$NSK-001$$, $$NSK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006b4'::uuid, '00000000-1111-0000-0000-0000000006b4'::uuid, $$NSK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006b5'::uuid, $$NSK-002$$, $$NSK-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006b5'::uuid, '00000000-1111-0000-0000-0000000006b5'::uuid, $$NSK-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006b6'::uuid, $$NSK-003(NKS003?)$$, $$NSK-003 (NKS 003?)$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006b6'::uuid, '00000000-1111-0000-0000-0000000006b6'::uuid, $$NSK-003(NKS003?)$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006b7'::uuid, $$NSK-005$$, $$NSK-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006b7'::uuid, '00000000-1111-0000-0000-0000000006b7'::uuid, $$NSK-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006b8'::uuid, $$NSK-006$$, $$NSK-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006b8'::uuid, '00000000-1111-0000-0000-0000000006b8'::uuid, $$NSK-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006b9'::uuid, $$NSK-007$$, $$NSK-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006b9'::uuid, '00000000-1111-0000-0000-0000000006b9'::uuid, $$NSK-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006ba'::uuid, $$NSK-008$$, $$NSK-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006ba'::uuid, '00000000-1111-0000-0000-0000000006ba'::uuid, $$NSK-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006bb'::uuid, $$NSK-009$$, $$NSK-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006bb'::uuid, '00000000-1111-0000-0000-0000000006bb'::uuid, $$NSK-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006bc'::uuid, $$NSK-010$$, $$NSK-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006bc'::uuid, '00000000-1111-0000-0000-0000000006bc'::uuid, $$NSK-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006bd'::uuid, $$NSK-011$$, $$NSK-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006bd'::uuid, '00000000-1111-0000-0000-0000000006bd'::uuid, $$NSK-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006be'::uuid, $$NSK-012$$, $$NSK-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006be'::uuid, '00000000-1111-0000-0000-0000000006be'::uuid, $$NSK-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006bf'::uuid, $$NSK-013$$, $$NSK-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006bf'::uuid, '00000000-1111-0000-0000-0000000006bf'::uuid, $$NSK-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006c0'::uuid, $$NSK-014$$, $$NSK-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006c0'::uuid, '00000000-1111-0000-0000-0000000006c0'::uuid, $$NSK-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006c1'::uuid, $$NSK-015$$, $$NSK-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006c1'::uuid, '00000000-1111-0000-0000-0000000006c1'::uuid, $$NSK-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006c2'::uuid, $$NSK-016$$, $$NSK-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006c2'::uuid, '00000000-1111-0000-0000-0000000006c2'::uuid, $$NSK-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006c3'::uuid, $$NSM-001$$, $$NSM-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006c3'::uuid, '00000000-1111-0000-0000-0000000006c3'::uuid, $$NSM-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006c4'::uuid, $$NSM-002$$, $$NSM-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006c4'::uuid, '00000000-1111-0000-0000-0000000006c4'::uuid, $$NSM-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006c5'::uuid, $$NSM-003$$, $$NSM-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006c5'::uuid, '00000000-1111-0000-0000-0000000006c5'::uuid, $$NSM-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006c6'::uuid, $$NSM-004$$, $$NSM-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006c6'::uuid, '00000000-1111-0000-0000-0000000006c6'::uuid, $$NSM-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006c7'::uuid, $$NTT-003$$, $$NTT-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006c7'::uuid, '00000000-1111-0000-0000-0000000006c7'::uuid, $$NTT-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006c8'::uuid, $$NWN-001$$, $$NWN-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006c8'::uuid, '00000000-1111-0000-0000-0000000006c8'::uuid, $$NWN-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006c9'::uuid, $$ODS$$, $$ODS$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006c9'::uuid, '00000000-1111-0000-0000-0000000006c9'::uuid, $$ODS$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006ca'::uuid, $$ODS-001$$, $$ODS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006ca'::uuid, '00000000-1111-0000-0000-0000000006ca'::uuid, $$ODS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006cb'::uuid, $$ODS-010$$, $$ODS-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006cb'::uuid, '00000000-1111-0000-0000-0000000006cb'::uuid, $$ODS-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006cc'::uuid, $$ODS-012$$, $$ODS-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006cc'::uuid, '00000000-1111-0000-0000-0000000006cc'::uuid, $$ODS-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006cd'::uuid, $$ODS-013$$, $$ODS-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006cd'::uuid, '00000000-1111-0000-0000-0000000006cd'::uuid, $$ODS-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006ce'::uuid, $$ODS-015$$, $$ODS-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006ce'::uuid, '00000000-1111-0000-0000-0000000006ce'::uuid, $$ODS-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006cf'::uuid, $$ODS-016$$, $$ODS-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006cf'::uuid, '00000000-1111-0000-0000-0000000006cf'::uuid, $$ODS-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006d0'::uuid, $$ODS-017$$, $$ODS-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006d0'::uuid, '00000000-1111-0000-0000-0000000006d0'::uuid, $$ODS-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006d1'::uuid, $$ODS-018$$, $$ODS-018R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006d1'::uuid, '00000000-1111-0000-0000-0000000006d1'::uuid, $$ODS-018-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006d2'::uuid, $$ODS-019$$, $$ODS-019$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006d2'::uuid, '00000000-1111-0000-0000-0000000006d2'::uuid, $$ODS-019$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006d3'::uuid, $$ODS-021$$, $$ODS-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006d3'::uuid, '00000000-1111-0000-0000-0000000006d3'::uuid, $$ODS-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006d4'::uuid, $$ODS-022$$, $$ODS-022$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006d4'::uuid, '00000000-1111-0000-0000-0000000006d4'::uuid, $$ODS-022$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006d5'::uuid, $$ODS-023$$, $$ODS-023$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006d5'::uuid, '00000000-1111-0000-0000-0000000006d5'::uuid, $$ODS-023$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006d6'::uuid, $$ODS-025$$, $$ODS-025$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006d6'::uuid, '00000000-1111-0000-0000-0000000006d6'::uuid, $$ODS-025$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006d7'::uuid, $$ODS-026$$, $$ODS-026$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006d7'::uuid, '00000000-1111-0000-0000-0000000006d7'::uuid, $$ODS-026$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006d8'::uuid, $$ODS-027$$, $$ODS-027$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006d8'::uuid, '00000000-1111-0000-0000-0000000006d8'::uuid, $$ODS-027$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006d9'::uuid, $$ODS-028$$, $$ODS-028$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006d9'::uuid, '00000000-1111-0000-0000-0000000006d9'::uuid, $$ODS-028$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006da'::uuid, $$ODS-029$$, $$ODS-029$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006da'::uuid, '00000000-1111-0000-0000-0000000006da'::uuid, $$ODS-029$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006db'::uuid, $$ODS-030$$, $$ODS-030$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006db'::uuid, '00000000-1111-0000-0000-0000000006db'::uuid, $$ODS-030$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006dc'::uuid, $$ODS-031$$, $$ODS-031$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006dc'::uuid, '00000000-1111-0000-0000-0000000006dc'::uuid, $$ODS-031$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006dd'::uuid, $$ODS-032$$, $$ODS-032$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006dd'::uuid, '00000000-1111-0000-0000-0000000006dd'::uuid, $$ODS-032$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006de'::uuid, $$ODS-033$$, $$ODS-033$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006de'::uuid, '00000000-1111-0000-0000-0000000006de'::uuid, $$ODS-033$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006df'::uuid, $$ODS-034$$, $$ODS-034$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006df'::uuid, '00000000-1111-0000-0000-0000000006df'::uuid, $$ODS-034$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006e0'::uuid, $$ODS-035$$, $$ODS-035$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006e0'::uuid, '00000000-1111-0000-0000-0000000006e0'::uuid, $$ODS-035$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006e1'::uuid, $$ODS-037$$, $$ODS-037$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006e1'::uuid, '00000000-1111-0000-0000-0000000006e1'::uuid, $$ODS-037$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006e2'::uuid, $$ODS-038$$, $$ODS-038$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006e2'::uuid, '00000000-1111-0000-0000-0000000006e2'::uuid, $$ODS-038$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006e3'::uuid, $$ODS-039$$, $$ODS-039$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006e3'::uuid, '00000000-1111-0000-0000-0000000006e3'::uuid, $$ODS-039$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006e4'::uuid, $$ODS-040$$, $$ODS-040$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006e4'::uuid, '00000000-1111-0000-0000-0000000006e4'::uuid, $$ODS-040$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006e5'::uuid, $$ODS-041$$, $$ODS-041$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006e5'::uuid, '00000000-1111-0000-0000-0000000006e5'::uuid, $$ODS-041$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006e6'::uuid, $$ODS-042$$, $$ODS-042$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006e6'::uuid, '00000000-1111-0000-0000-0000000006e6'::uuid, $$ODS-042$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006e7'::uuid, $$ODS-043$$, $$ODS-043$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006e7'::uuid, '00000000-1111-0000-0000-0000000006e7'::uuid, $$ODS-043$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006e8'::uuid, $$ODS-044$$, $$ODS-044$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006e8'::uuid, '00000000-1111-0000-0000-0000000006e8'::uuid, $$ODS-044$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006e9'::uuid, $$ODS-045$$, $$ODS-045$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006e9'::uuid, '00000000-1111-0000-0000-0000000006e9'::uuid, $$ODS-045$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006ea'::uuid, $$ODS-048$$, $$ODS-048$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006ea'::uuid, '00000000-1111-0000-0000-0000000006ea'::uuid, $$ODS-048$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006eb'::uuid, $$ODS-051$$, $$ODS-051$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006eb'::uuid, '00000000-1111-0000-0000-0000000006eb'::uuid, $$ODS-051$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006ec'::uuid, $$ODS-052$$, $$ODS-052$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006ec'::uuid, '00000000-1111-0000-0000-0000000006ec'::uuid, $$ODS-052$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006ed'::uuid, '00000000-1111-0000-0000-0000000006ec'::uuid, $$ODS-052-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006ee'::uuid, $$ODS-053$$, $$ODS-053$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006ee'::uuid, '00000000-1111-0000-0000-0000000006ee'::uuid, $$ODS-053$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006ef'::uuid, $$ODS-054$$, $$ODS-054$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006ef'::uuid, '00000000-1111-0000-0000-0000000006ef'::uuid, $$ODS-054$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006f0'::uuid, $$ODS-055$$, $$ODS-055$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006f0'::uuid, '00000000-1111-0000-0000-0000000006f0'::uuid, $$ODS-055$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006f1'::uuid, $$ODS-055D$$, $$ODS-055D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006f1'::uuid, '00000000-1111-0000-0000-0000000006f1'::uuid, $$ODS-055D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006f2'::uuid, $$OGR-009$$, $$OGR-009B$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006f2'::uuid, '00000000-1111-0000-0000-0000000006f2'::uuid, $$OGR-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006f3'::uuid, '00000000-1111-0000-0000-0000000006f2'::uuid, $$OGR-009-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006f5'::uuid, $$OGR-012$$, $$OGR-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006f5'::uuid, '00000000-1111-0000-0000-0000000006f5'::uuid, $$OGR-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006f6'::uuid, $$OGR-013F$$, $$OGR-013F$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006f6'::uuid, '00000000-1111-0000-0000-0000000006f6'::uuid, $$OGR-013F$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006f7'::uuid, $$OGR-013H$$, $$OGR-013H$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006f7'::uuid, '00000000-1111-0000-0000-0000000006f7'::uuid, $$OGR-013H$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006f8'::uuid, $$OGR-018$$, $$OGR-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006f8'::uuid, '00000000-1111-0000-0000-0000000006f8'::uuid, $$OGR-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006f9'::uuid, $$OGS-004$$, $$OGS-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006f9'::uuid, '00000000-1111-0000-0000-0000000006f9'::uuid, $$OGS-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006fa'::uuid, $$OHS-001$$, $$OHS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006fa'::uuid, '00000000-1111-0000-0000-0000000006fa'::uuid, $$OHS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006fb'::uuid, $$OID-001$$, $$OID-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006fb'::uuid, '00000000-1111-0000-0000-0000000006fb'::uuid, $$OID-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006fc'::uuid, $$OIK-001$$, $$OIK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006fc'::uuid, '00000000-1111-0000-0000-0000000006fc'::uuid, $$OIK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006fd'::uuid, $$OKH-001$$, $$OKH-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006fd'::uuid, '00000000-1111-0000-0000-0000000006fd'::uuid, $$OKH-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006fe'::uuid, $$OKH-002$$, $$OKH-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006fe'::uuid, '00000000-1111-0000-0000-0000000006fe'::uuid, $$OKH-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000006ff'::uuid, $$OMG-001$$, $$OMG-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000006ff'::uuid, '00000000-1111-0000-0000-0000000006ff'::uuid, $$OMG-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000700'::uuid, $$OMG-002$$, $$OMG-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000700'::uuid, '00000000-1111-0000-0000-000000000700'::uuid, $$OMG-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000701'::uuid, $$OMG-005$$, $$OMG-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000701'::uuid, '00000000-1111-0000-0000-000000000701'::uuid, $$OMG-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000702'::uuid, $$OMG-006$$, $$OMG-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000702'::uuid, '00000000-1111-0000-0000-000000000702'::uuid, $$OMG-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000703'::uuid, $$ORM-001$$, $$ORM-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000703'::uuid, '00000000-1111-0000-0000-000000000703'::uuid, $$ORM-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000704'::uuid, $$ONER-001$$, $$ONER-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000704'::uuid, '00000000-1111-0000-0000-000000000704'::uuid, $$ONER-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000705'::uuid, $$OOT-001$$, $$OOT-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000705'::uuid, '00000000-1111-0000-0000-000000000705'::uuid, $$OOT-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000706'::uuid, $$OOT-003$$, $$OOT-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000706'::uuid, '00000000-1111-0000-0000-000000000706'::uuid, $$OOT-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000707'::uuid, $$OOT-004AB$$, $$OOT-004AB$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$AB$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000707'::uuid, '00000000-1111-0000-0000-000000000707'::uuid, $$OOT-004AB$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000708'::uuid, $$OOT-005$$, $$OOT-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000708'::uuid, '00000000-1111-0000-0000-000000000708'::uuid, $$OOT-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000709'::uuid, $$OOT-006$$, $$OOT-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000709'::uuid, '00000000-1111-0000-0000-000000000709'::uuid, $$OOT-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000070a'::uuid, $$OOT-009$$, $$OOT-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000070a'::uuid, '00000000-1111-0000-0000-00000000070a'::uuid, $$OOT-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000070b'::uuid, $$OOT-010$$, $$OOT-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000070b'::uuid, '00000000-1111-0000-0000-00000000070b'::uuid, $$OOT-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000070c'::uuid, $$OOT-011$$, $$OOT-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000070c'::uuid, '00000000-1111-0000-0000-00000000070c'::uuid, $$OOT-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000070d'::uuid, $$OOT-012$$, $$OOT-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000070d'::uuid, '00000000-1111-0000-0000-00000000070d'::uuid, $$OOT-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000070e'::uuid, $$OOT-013$$, $$OOT-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000070e'::uuid, '00000000-1111-0000-0000-00000000070e'::uuid, $$OOT-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000070f'::uuid, $$OOT-015$$, $$OOT-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000070f'::uuid, '00000000-1111-0000-0000-00000000070f'::uuid, $$OOT-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000710'::uuid, $$OOT-017$$, $$OOT-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000710'::uuid, '00000000-1111-0000-0000-000000000710'::uuid, $$OOT-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000711'::uuid, $$OOT-018$$, $$OOT-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000711'::uuid, '00000000-1111-0000-0000-000000000711'::uuid, $$OOT-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000712'::uuid, $$OOT-019$$, $$OOT-019$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000712'::uuid, '00000000-1111-0000-0000-000000000712'::uuid, $$OOT-019$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000713'::uuid, $$OOT-020$$, $$OOT-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000713'::uuid, '00000000-1111-0000-0000-000000000713'::uuid, $$OOT-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000714'::uuid, $$OOT-021$$, $$OOT-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000714'::uuid, '00000000-1111-0000-0000-000000000714'::uuid, $$OOT-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000715'::uuid, $$OOT-022$$, $$OOT-022$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000715'::uuid, '00000000-1111-0000-0000-000000000715'::uuid, $$OOT-022$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000716'::uuid, $$OOT-023$$, $$OOT-023$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000716'::uuid, '00000000-1111-0000-0000-000000000716'::uuid, $$OOT-023$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000717'::uuid, $$OOT-024$$, $$OOT-024$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000717'::uuid, '00000000-1111-0000-0000-000000000717'::uuid, $$OOT-024$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000718'::uuid, $$OOT-025$$, $$OOT-025$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000718'::uuid, '00000000-1111-0000-0000-000000000718'::uuid, $$OOT-025$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000719'::uuid, $$OOT-026$$, $$OOT-026$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000719'::uuid, '00000000-1111-0000-0000-000000000719'::uuid, $$OOT-026$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000071a'::uuid, $$OOT-027$$, $$OOT-027$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000071a'::uuid, '00000000-1111-0000-0000-00000000071a'::uuid, $$OOT-027$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000071b'::uuid, $$OOT-030$$, $$OOT-030R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000071b'::uuid, '00000000-1111-0000-0000-00000000071b'::uuid, $$OOT-030-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000071c'::uuid, $$OOT-031$$, $$OOT-031$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000071c'::uuid, '00000000-1111-0000-0000-00000000071c'::uuid, $$OOT-031$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000071d'::uuid, $$OOT-032$$, $$OOT-032$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000071d'::uuid, '00000000-1111-0000-0000-00000000071d'::uuid, $$OOT-032$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000071e'::uuid, $$OOT-033$$, $$OOT-033$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000071e'::uuid, '00000000-1111-0000-0000-00000000071e'::uuid, $$OOT-033$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000071f'::uuid, $$OOT-034$$, $$OOT-034$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000071f'::uuid, '00000000-1111-0000-0000-00000000071f'::uuid, $$OOT-034$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000720'::uuid, $$OOT-035$$, $$OOT-035$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000720'::uuid, '00000000-1111-0000-0000-000000000720'::uuid, $$OOT-035$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000721'::uuid, $$OOT-038$$, $$OOT-038$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000721'::uuid, '00000000-1111-0000-0000-000000000721'::uuid, $$OOT-038$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000722'::uuid, $$OOT-039$$, $$OOT-039$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000722'::uuid, '00000000-1111-0000-0000-000000000722'::uuid, $$OOT-039$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000723'::uuid, $$OOT-040?$$, $$OOT-040?$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000723'::uuid, '00000000-1111-0000-0000-000000000723'::uuid, $$OOT-040?$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000724'::uuid, $$OOT-040$$, $$OOT-040$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000724'::uuid, '00000000-1111-0000-0000-000000000724'::uuid, $$OOT-040$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000725'::uuid, $$OOT-041ASANOPLATE$$, $$OOT-041 ASANO PLATE$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000725'::uuid, '00000000-1111-0000-0000-000000000725'::uuid, $$OOT-041ASANOPLATE$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000726'::uuid, $$OOT-041$$, $$OOT-041$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000726'::uuid, '00000000-1111-0000-0000-000000000726'::uuid, $$OOT-041$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000727'::uuid, $$OOT-042D$$, $$OOT-042D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000727'::uuid, '00000000-1111-0000-0000-000000000727'::uuid, $$OOT-042D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000728'::uuid, $$OOT-042$$, $$OOT-042$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000728'::uuid, '00000000-1111-0000-0000-000000000728'::uuid, $$OOT-042$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000729'::uuid, $$OOT-043$$, $$OOT-043$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000729'::uuid, '00000000-1111-0000-0000-000000000729'::uuid, $$OOT-043$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000072a'::uuid, $$OPA-001$$, $$OPA-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000072a'::uuid, '00000000-1111-0000-0000-00000000072a'::uuid, $$OPA-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000072b'::uuid, $$ORM-002$$, $$ORM-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000072b'::uuid, '00000000-1111-0000-0000-00000000072b'::uuid, $$ORM-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000072c'::uuid, $$ORM-003$$, $$ORM-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000072c'::uuid, '00000000-1111-0000-0000-00000000072c'::uuid, $$ORM-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000072d'::uuid, $$ORM-004$$, $$ORM-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000072d'::uuid, '00000000-1111-0000-0000-00000000072d'::uuid, $$ORM-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000072e'::uuid, $$ORM-005$$, $$ORM-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000072e'::uuid, '00000000-1111-0000-0000-00000000072e'::uuid, $$ORM-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000072f'::uuid, $$OSI-001$$, $$OSI-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000072f'::uuid, '00000000-1111-0000-0000-00000000072f'::uuid, $$OSI-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000730'::uuid, $$OSI-002$$, $$OSI-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000730'::uuid, '00000000-1111-0000-0000-000000000730'::uuid, $$OSI-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000731'::uuid, $$OTAX-001$$, $$OTAX-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000731'::uuid, '00000000-1111-0000-0000-000000000731'::uuid, $$OTAX-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000732'::uuid, $$OTAX-002$$, $$OTAX-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000732'::uuid, '00000000-1111-0000-0000-000000000732'::uuid, $$OTAX-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000733'::uuid, $$OTAX-003$$, $$OTAX-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000733'::uuid, '00000000-1111-0000-0000-000000000733'::uuid, $$OTAX-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000734'::uuid, $$OTAX-004$$, $$OTAX-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000734'::uuid, '00000000-1111-0000-0000-000000000734'::uuid, $$OTAX-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000735'::uuid, $$OTAX-005$$, $$OTAX-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000735'::uuid, '00000000-1111-0000-0000-000000000735'::uuid, $$OTAX-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000736'::uuid, $$OTAX-006$$, $$OTAX-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000736'::uuid, '00000000-1111-0000-0000-000000000736'::uuid, $$OTAX-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000737'::uuid, $$OTAX-007$$, $$OTAX-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000737'::uuid, '00000000-1111-0000-0000-000000000737'::uuid, $$OTAX-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000738'::uuid, $$OTAX-008$$, $$OTAX-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000738'::uuid, '00000000-1111-0000-0000-000000000738'::uuid, $$OTAX-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000739'::uuid, $$OTAX-009$$, $$OTAX-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000739'::uuid, '00000000-1111-0000-0000-000000000739'::uuid, $$OTAX-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000073a'::uuid, $$OTAX-010$$, $$OTAX-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000073a'::uuid, '00000000-1111-0000-0000-00000000073a'::uuid, $$OTAX-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000073b'::uuid, $$OTAX-013$$, $$OTAX-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000073b'::uuid, '00000000-1111-0000-0000-00000000073b'::uuid, $$OTAX-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000073c'::uuid, $$OTAX-014$$, $$OTAX-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000073c'::uuid, '00000000-1111-0000-0000-00000000073c'::uuid, $$OTAX-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000073d'::uuid, $$OTAX-015$$, $$OTAX-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000073d'::uuid, '00000000-1111-0000-0000-00000000073d'::uuid, $$OTAX-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000073e'::uuid, $$OTAX-016$$, $$OTAX-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000073e'::uuid, '00000000-1111-0000-0000-00000000073e'::uuid, $$OTAX-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000073f'::uuid, $$OTAX-017$$, $$OTAX-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000073f'::uuid, '00000000-1111-0000-0000-00000000073f'::uuid, $$OTAX-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000740'::uuid, $$OTAX-018$$, $$OTAX-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000740'::uuid, '00000000-1111-0000-0000-000000000740'::uuid, $$OTAX-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000741'::uuid, $$OTAX-019$$, $$OTAX-019$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000741'::uuid, '00000000-1111-0000-0000-000000000741'::uuid, $$OTAX-019$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000742'::uuid, $$OTAX-020$$, $$OTAX-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000742'::uuid, '00000000-1111-0000-0000-000000000742'::uuid, $$OTAX-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000743'::uuid, $$OTAX-022$$, $$OTAX-022$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000743'::uuid, '00000000-1111-0000-0000-000000000743'::uuid, $$OTAX-022$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000744'::uuid, $$OTD-001$$, $$OTD-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000744'::uuid, '00000000-1111-0000-0000-000000000744'::uuid, $$OTD-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000745'::uuid, $$Other$$, $$Other$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000745'::uuid, '00000000-1111-0000-0000-000000000745'::uuid, $$Other$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000746'::uuid, $$Other-1482-006-01$$, $$Other-1482-006-01$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000746'::uuid, '00000000-1111-0000-0000-000000000746'::uuid, $$Other-1482-006-01$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000747'::uuid, $$Other-2016-117-27$$, $$Other-20 16-117-27$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000747'::uuid, '00000000-1111-0000-0000-000000000747'::uuid, $$Other-2016-117-27$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000749'::uuid, $$Other-6D70423A-2$$, $$Other-6D704 23A-2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000749'::uuid, '00000000-1111-0000-0000-000000000749'::uuid, $$Other-6D70423A-2$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000074a'::uuid, $$Other-8号機$$, $$Other-8号機$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000074a'::uuid, '00000000-1111-0000-0000-00000000074a'::uuid, $$Other-8号機$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000074b'::uuid, $$Other-A　タイプ$$, $$Other-A　タイプ$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000074b'::uuid, '00000000-1111-0000-0000-00000000074b'::uuid, $$Other-A　タイプ$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000074c'::uuid, $$Other-Achievement$$, $$Other-Achievement$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000074c'::uuid, '00000000-1111-0000-0000-00000000074c'::uuid, $$Other-Achievement$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000074d'::uuid, $$Other-Cタイプ専用$$, $$Other-Cタイプ専用$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000074d'::uuid, '00000000-1111-0000-0000-00000000074d'::uuid, $$Other-Cタイプ専用$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000074e'::uuid, $$Other-PICKCASE$$, $$Other-PICK CASE$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000074e'::uuid, '00000000-1111-0000-0000-00000000074e'::uuid, $$Other-PICKCASE$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000074f'::uuid, $$Other-YO1014A(9K)$$, $$Other-YO 1014A (9K)$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000074f'::uuid, '00000000-1111-0000-0000-00000000074f'::uuid, $$Other-YO1014A(9K)$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000750'::uuid, $$Other-シャープ$$, $$Other-シャープ$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000750'::uuid, '00000000-1111-0000-0000-000000000750'::uuid, $$Other-シャープ$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000751'::uuid, $$Other-試作?$$, $$Other-試作?$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000751'::uuid, '00000000-1111-0000-0000-000000000751'::uuid, $$Other-試作?$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000752'::uuid, $$OTJ-001$$, $$OTJ-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000752'::uuid, '00000000-1111-0000-0000-000000000752'::uuid, $$OTJ-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000753'::uuid, $$PB375x367$$, $$PB 375x367$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000753'::uuid, '00000000-1111-0000-0000-000000000753'::uuid, $$PB375x367$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000754'::uuid, $$PB460x330WTN007$$, $$PB 460x330 WTN007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000754'::uuid, '00000000-1111-0000-0000-000000000754'::uuid, $$PB460x330WTN007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000755'::uuid, $$PB470x400x50ND$$, $$PB 470x400x50 ND$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000755'::uuid, '00000000-1111-0000-0000-000000000755'::uuid, $$PB470x400x50ND$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000756'::uuid, $$PB470x450x50HIGHPLUG$$, $$PB 470x450x50 HIGH PLUG$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000756'::uuid, '00000000-1111-0000-0000-000000000756'::uuid, $$PB470x450x50HIGHPLUG$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000757'::uuid, $$PB590x350$$, $$PB 590x350$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000757'::uuid, '00000000-1111-0000-0000-000000000757'::uuid, $$PB590x350$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000758'::uuid, $$PBAType490x320x15$$, $$PB A Type 490x320x15$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000758'::uuid, '00000000-1111-0000-0000-000000000758'::uuid, $$PBAType490x320x15$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000759'::uuid, $$PBCTYPE499x347$$, $$PB C TYPE 499x347$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000759'::uuid, '00000000-1111-0000-0000-000000000759'::uuid, $$PBCTYPE499x347$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000075a'::uuid, $$PBJAE　300ｘ285$$, $$PB JAE　300ｘ285$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000075a'::uuid, '00000000-1111-0000-0000-00000000075a'::uuid, $$PBJAE　300ｘ285$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000075b'::uuid, $$PBNB620x310$$, $$PB NB 620x310$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000075b'::uuid, '00000000-1111-0000-0000-00000000075b'::uuid, $$PBNB620x310$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000075c'::uuid, $$PB-ZDTYPE$$, $$PB ZD TYPE$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000075c'::uuid, '00000000-1111-0000-0000-00000000075c'::uuid, $$PB-ZDTYPE$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000075d'::uuid, $$PB74530x350$$, $$PB74 530x350$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000075d'::uuid, '00000000-1111-0000-0000-00000000075d'::uuid, $$PB74530x350$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000075e'::uuid, $$PB74FHJ515x347$$, $$PB74 FHJ 515x347$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000075e'::uuid, '00000000-1111-0000-0000-00000000075e'::uuid, $$PB74FHJ515x347$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000075f'::uuid, $$PB74H20YMS-001$$, $$PB74 H20 YMS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000075f'::uuid, '00000000-1111-0000-0000-00000000075f'::uuid, $$PB74H20YMS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000760'::uuid, $$PLATE5x600x745$$, $$PLATE 5x600x745$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000760'::uuid, '00000000-1111-0000-0000-000000000760'::uuid, $$PLATE5x600x745$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000761'::uuid, $$PLATE5x606x830$$, $$PLATE 5x606x830$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000761'::uuid, '00000000-1111-0000-0000-000000000761'::uuid, $$PLATE5x606x830$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000762'::uuid, $$PLX-001$$, $$PLX-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000762'::uuid, '00000000-1111-0000-0000-000000000762'::uuid, $$PLX-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000763'::uuid, $$PLX-002D$$, $$PLX-002D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000763'::uuid, '00000000-1111-0000-0000-000000000763'::uuid, $$PLX-002D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000764'::uuid, $$PLX-002$$, $$PLX-002 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000764'::uuid, '00000000-1111-0000-0000-000000000764'::uuid, $$PLX-002-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000766'::uuid, $$PNS-001$$, $$PNS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000766'::uuid, '00000000-1111-0000-0000-000000000766'::uuid, $$PNS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000767'::uuid, $$PNS-002$$, $$PNS-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000767'::uuid, '00000000-1111-0000-0000-000000000767'::uuid, $$PNS-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000768'::uuid, $$PNS-002B/$$, $$PNS-002B/T$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000768'::uuid, '00000000-1111-0000-0000-000000000768'::uuid, $$PNS-002B/$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000769'::uuid, $$PNS-003$$, $$PNS-003B$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000769'::uuid, '00000000-1111-0000-0000-000000000769'::uuid, $$PNS-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000076b'::uuid, $$PNS-004$$, $$PNS-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000076b'::uuid, '00000000-1111-0000-0000-00000000076b'::uuid, $$PNS-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000076c'::uuid, $$PNS-005$$, $$PNS-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000076c'::uuid, '00000000-1111-0000-0000-00000000076c'::uuid, $$PNS-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000076d'::uuid, $$PNS-006$$, $$PNS-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000076d'::uuid, '00000000-1111-0000-0000-00000000076d'::uuid, $$PNS-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000076e'::uuid, $$PNS-007$$, $$PNS-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000076e'::uuid, '00000000-1111-0000-0000-00000000076e'::uuid, $$PNS-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000076f'::uuid, $$PNS-010$$, $$PNS-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000076f'::uuid, '00000000-1111-0000-0000-00000000076f'::uuid, $$PNS-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000770'::uuid, '00000000-1111-0000-0000-00000000076f'::uuid, $$PNS-010-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000773'::uuid, $$PNS-011$$, $$PNS-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000773'::uuid, '00000000-1111-0000-0000-000000000773'::uuid, $$PNS-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000774'::uuid, $$POS-002$$, $$POS-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000774'::uuid, '00000000-1111-0000-0000-000000000774'::uuid, $$POS-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000775'::uuid, $$P-P12127-P$$, $$P-P12127-P$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000775'::uuid, '00000000-1111-0000-0000-000000000775'::uuid, $$P-P12127-P$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000776'::uuid, $$QA-005$$, $$QA-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000776'::uuid, '00000000-1111-0000-0000-000000000776'::uuid, $$QA-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000777'::uuid, $$QA-006$$, $$QA-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000777'::uuid, '00000000-1111-0000-0000-000000000777'::uuid, $$QA-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000778'::uuid, $$QA-007$$, $$QA-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000778'::uuid, '00000000-1111-0000-0000-000000000778'::uuid, $$QA-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000779'::uuid, $$QAS-002$$, $$QAS-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000779'::uuid, '00000000-1111-0000-0000-000000000779'::uuid, $$QAS-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000077a'::uuid, $$QAS-003$$, $$QAS-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000077a'::uuid, '00000000-1111-0000-0000-00000000077a'::uuid, $$QAS-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000077b'::uuid, $$QAS-004$$, $$QAS-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000077b'::uuid, '00000000-1111-0000-0000-00000000077b'::uuid, $$QAS-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000077c'::uuid, $$QAS-005$$, $$QAS-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000077c'::uuid, '00000000-1111-0000-0000-00000000077c'::uuid, $$QAS-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000077d'::uuid, $$QSK-001$$, $$QSK-001　$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000077d'::uuid, '00000000-1111-0000-0000-00000000077d'::uuid, $$QSK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000077e'::uuid, $$RCH-001$$, $$RCH-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000077e'::uuid, '00000000-1111-0000-0000-00000000077e'::uuid, $$RCH-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000077f'::uuid, $$RCH-002$$, $$RCH-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000077f'::uuid, '00000000-1111-0000-0000-00000000077f'::uuid, $$RCH-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000780'::uuid, $$RCH-003$$, $$RCH-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000780'::uuid, '00000000-1111-0000-0000-000000000780'::uuid, $$RCH-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000781'::uuid, $$RCH-004$$, $$RCH-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000781'::uuid, '00000000-1111-0000-0000-000000000781'::uuid, $$RCH-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000782'::uuid, $$RCH-005$$, $$RCH-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000782'::uuid, '00000000-1111-0000-0000-000000000782'::uuid, $$RCH-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000783'::uuid, $$RCH-006$$, $$RCH-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000783'::uuid, '00000000-1111-0000-0000-000000000783'::uuid, $$RCH-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000784'::uuid, $$RCH-007$$, $$RCH-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000784'::uuid, '00000000-1111-0000-0000-000000000784'::uuid, $$RCH-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000785'::uuid, $$RCH-008$$, $$RCH-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000785'::uuid, '00000000-1111-0000-0000-000000000785'::uuid, $$RCH-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000786'::uuid, $$RCH-009$$, $$RCH-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000786'::uuid, '00000000-1111-0000-0000-000000000786'::uuid, $$RCH-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000787'::uuid, $$RDF85CUTTE-R1JIG$$, $$RDF85 CUTTER JIG$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000787'::uuid, '00000000-1111-0000-0000-000000000787'::uuid, $$RDF85CUTTE-R1JIG$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000788'::uuid, $$RKK-001$$, $$RKK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000788'::uuid, '00000000-1111-0000-0000-000000000788'::uuid, $$RKK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000789'::uuid, $$Rv53BLowerVerD25$$, $$Rv53B Lower VerD25$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000789'::uuid, '00000000-1111-0000-0000-000000000789'::uuid, $$Rv53BLowerVerD25$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000078a'::uuid, $$RV53BLowerVerD32$$, $$RV53B Lower VerD32$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000078a'::uuid, '00000000-1111-0000-0000-00000000078a'::uuid, $$RV53BLowerVerD32$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000078b'::uuid, $$RV-53BMountingPlate$$, $$RV-53B Mounting Plate$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000078b'::uuid, '00000000-1111-0000-0000-00000000078b'::uuid, $$RV-53BMountingPlate$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000078c'::uuid, $$RV74CLowerTable$$, $$RV74C Lower Table$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000078c'::uuid, '00000000-1111-0000-0000-00000000078c'::uuid, $$RV74CLowerTable$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000078d'::uuid, $$RV74CLowerTableVer23.4.19$$, $$RV74C Lower Table Ver23.4.19$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000078d'::uuid, '00000000-1111-0000-0000-00000000078d'::uuid, $$RV74CLowerTableVer23.4.19$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000078e'::uuid, $$RYK-001$$, $$RYK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000078e'::uuid, '00000000-1111-0000-0000-00000000078e'::uuid, $$RYK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000078f'::uuid, $$RYK-002$$, $$RYK-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000078f'::uuid, '00000000-1111-0000-0000-00000000078f'::uuid, $$RYK-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000790'::uuid, $$RYK-003$$, $$RYK-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000790'::uuid, '00000000-1111-0000-0000-000000000790'::uuid, $$RYK-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000791'::uuid, $$RYK-004$$, $$RYK-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000791'::uuid, '00000000-1111-0000-0000-000000000791'::uuid, $$RYK-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000792'::uuid, $$RYK-005？$$, $$RYK-005？$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000792'::uuid, '00000000-1111-0000-0000-000000000792'::uuid, $$RYK-005？$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000793'::uuid, $$RYK-005$$, $$RYK-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000793'::uuid, '00000000-1111-0000-0000-000000000793'::uuid, $$RYK-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000794'::uuid, $$RYOKA-002$$, $$RYOKA-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000794'::uuid, '00000000-1111-0000-0000-000000000794'::uuid, $$RYOKA-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000795'::uuid, $$RYOKA-21-001-000$$, $$RYOKA-21-001-000$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000795'::uuid, '00000000-1111-0000-0000-000000000795'::uuid, $$RYOKA-21-001-000$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000796'::uuid, $$SAI-001$$, $$SAI-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000796'::uuid, '00000000-1111-0000-0000-000000000796'::uuid, $$SAI-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000797'::uuid, $$SAIKO-02$$, $$SAIKO-02$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000797'::uuid, '00000000-1111-0000-0000-000000000797'::uuid, $$SAIKO-02$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000799'::uuid, $$SAM-001$$, $$SAM-001 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000799'::uuid, '00000000-1111-0000-0000-000000000799'::uuid, $$SAM-001-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000079a'::uuid, $$SAM-002$$, $$SAM-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000079a'::uuid, '00000000-1111-0000-0000-00000000079a'::uuid, $$SAM-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000079b'::uuid, $$SBK-001$$, $$SBK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000079b'::uuid, '00000000-1111-0000-0000-00000000079b'::uuid, $$SBK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000079c'::uuid, $$SCP-001$$, $$SCP-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000079c'::uuid, '00000000-1111-0000-0000-00000000079c'::uuid, $$SCP-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000079d'::uuid, $$SDK$$, $$SDK$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000079d'::uuid, '00000000-1111-0000-0000-00000000079d'::uuid, $$SDK$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000079e'::uuid, $$SDK-001$$, $$SDK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000079e'::uuid, '00000000-1111-0000-0000-00000000079e'::uuid, $$SDK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000079f'::uuid, $$SDS-001$$, $$SDS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000079f'::uuid, '00000000-1111-0000-0000-00000000079f'::uuid, $$SDS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007a0'::uuid, $$SDSJ-001$$, $$SDSJ-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007a0'::uuid, '00000000-1111-0000-0000-0000000007a0'::uuid, $$SDSJ-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007a3'::uuid, $$SE-53Z$$, $$SE-53Z$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007a3'::uuid, '00000000-1111-0000-0000-0000000007a3'::uuid, $$SE-53Z$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007a4'::uuid, $$SEKYW-0006-1$$, $$SEKYW-0006-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007a4'::uuid, '00000000-1111-0000-0000-0000000007a4'::uuid, $$SEKYW-0006-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007a5'::uuid, $$SES-001$$, $$SES-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007a5'::uuid, '00000000-1111-0000-0000-0000000007a5'::uuid, $$SES-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007a6'::uuid, $$SES-002$$, $$SES-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007a6'::uuid, '00000000-1111-0000-0000-0000000007a6'::uuid, $$SES-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007a7'::uuid, $$SES-003$$, $$SES-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007a7'::uuid, '00000000-1111-0000-0000-0000000007a7'::uuid, $$SES-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007a8'::uuid, $$SES-004$$, $$SES-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007a8'::uuid, '00000000-1111-0000-0000-0000000007a8'::uuid, $$SES-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007a9'::uuid, $$SES-005$$, $$SES-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007a9'::uuid, '00000000-1111-0000-0000-0000000007a9'::uuid, $$SES-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007aa'::uuid, $$SESK-001$$, $$SESK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007aa'::uuid, '00000000-1111-0000-0000-0000000007aa'::uuid, $$SESK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007ab'::uuid, $$SFI-001$$, $$SFI-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007ab'::uuid, '00000000-1111-0000-0000-0000000007ab'::uuid, $$SFI-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007ac'::uuid, $$SG-001$$, $$SG-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007ac'::uuid, '00000000-1111-0000-0000-0000000007ac'::uuid, $$SG-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007ad'::uuid, $$SG-001PP$$, $$SG-001 PP$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$PP$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007ad'::uuid, '00000000-1111-0000-0000-0000000007ad'::uuid, $$SG-001PP$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007ae'::uuid, $$SGK-001$$, $$SGK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007ae'::uuid, '00000000-1111-0000-0000-0000000007ae'::uuid, $$SGK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007af'::uuid, $$SGK-006$$, $$SGK-006R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007af'::uuid, '00000000-1111-0000-0000-0000000007af'::uuid, $$SGK-006-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007b0'::uuid, $$SGK-2-001$$, $$SGK-2-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007b0'::uuid, '00000000-1111-0000-0000-0000000007b0'::uuid, $$SGK-2-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007b1'::uuid, $$SGK2-001$$, $$SGK2-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007b1'::uuid, '00000000-1111-0000-0000-0000000007b1'::uuid, $$SGK2-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007b2'::uuid, $$SHP-510x342x50$$, $$SHP-510x342x50$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007b2'::uuid, '00000000-1111-0000-0000-0000000007b2'::uuid, $$SHP-510x342x50$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007b3'::uuid, $$SHT-002$$, $$SHT-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007b3'::uuid, '00000000-1111-0000-0000-0000000007b3'::uuid, $$SHT-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007b4'::uuid, $$SHT-003$$, $$SHT-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007b4'::uuid, '00000000-1111-0000-0000-0000000007b4'::uuid, $$SHT-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007b5'::uuid, $$SHT-004$$, $$SHT-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007b5'::uuid, '00000000-1111-0000-0000-0000000007b5'::uuid, $$SHT-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007b6'::uuid, $$SHT-006$$, $$SHT-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007b6'::uuid, '00000000-1111-0000-0000-0000000007b6'::uuid, $$SHT-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007b7'::uuid, $$SHT-007$$, $$SHT-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007b7'::uuid, '00000000-1111-0000-0000-0000000007b7'::uuid, $$SHT-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007b8'::uuid, $$SHT-008$$, $$SHT-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007b8'::uuid, '00000000-1111-0000-0000-0000000007b8'::uuid, $$SHT-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007b9'::uuid, $$SHT-009$$, $$SHT-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007b9'::uuid, '00000000-1111-0000-0000-0000000007b9'::uuid, $$SHT-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007ba'::uuid, $$SHT-010$$, $$SHT-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007ba'::uuid, '00000000-1111-0000-0000-0000000007ba'::uuid, $$SHT-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007bb'::uuid, $$SHT-011$$, $$SHT-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007bb'::uuid, '00000000-1111-0000-0000-0000000007bb'::uuid, $$SHT-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007bc'::uuid, $$SHT-012$$, $$SHT-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007bc'::uuid, '00000000-1111-0000-0000-0000000007bc'::uuid, $$SHT-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007bd'::uuid, $$SHT-013$$, $$SHT-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007bd'::uuid, '00000000-1111-0000-0000-0000000007bd'::uuid, $$SHT-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007be'::uuid, '00000000-1111-0000-0000-0000000007bd'::uuid, $$SHT-013-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007bf'::uuid, $$SHT-014$$, $$SHT-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007bf'::uuid, '00000000-1111-0000-0000-0000000007bf'::uuid, $$SHT-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007c0'::uuid, $$SHT-015$$, $$SHT-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007c0'::uuid, '00000000-1111-0000-0000-0000000007c0'::uuid, $$SHT-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007c1'::uuid, $$SHT-016$$, $$SHT-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007c1'::uuid, '00000000-1111-0000-0000-0000000007c1'::uuid, $$SHT-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007c2'::uuid, $$SIT-001$$, $$SIT-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007c2'::uuid, '00000000-1111-0000-0000-0000000007c2'::uuid, $$SIT-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007c3'::uuid, $$SIT-002$$, $$SIT-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007c3'::uuid, '00000000-1111-0000-0000-0000000007c3'::uuid, $$SIT-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007c4'::uuid, $$SIT-010$$, $$SIT-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007c4'::uuid, '00000000-1111-0000-0000-0000000007c4'::uuid, $$SIT-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007c5'::uuid, $$SIT-011$$, $$SIT-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007c5'::uuid, '00000000-1111-0000-0000-0000000007c5'::uuid, $$SIT-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007c6'::uuid, $$SIT-012$$, $$SIT-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007c6'::uuid, '00000000-1111-0000-0000-0000000007c6'::uuid, $$SIT-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007c7'::uuid, $$SIT-013$$, $$SIT-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007c7'::uuid, '00000000-1111-0000-0000-0000000007c7'::uuid, $$SIT-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007c8'::uuid, $$SIT-014$$, $$SIT-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007c8'::uuid, '00000000-1111-0000-0000-0000000007c8'::uuid, $$SIT-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007c9'::uuid, $$SIT-015$$, $$SIT-015 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007c9'::uuid, '00000000-1111-0000-0000-0000000007c9'::uuid, $$SIT-015-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007ca'::uuid, $$SIT-016D$$, $$SIT-016D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007ca'::uuid, '00000000-1111-0000-0000-0000000007ca'::uuid, $$SIT-016D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007cb'::uuid, $$SIT-017$$, $$SIT-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007cb'::uuid, '00000000-1111-0000-0000-0000000007cb'::uuid, $$SIT-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007cc'::uuid, $$SIT-017D$$, $$SIT-017D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007cc'::uuid, '00000000-1111-0000-0000-0000000007cc'::uuid, $$SIT-017D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007cd'::uuid, $$SIT-018$$, $$SIT-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007cd'::uuid, '00000000-1111-0000-0000-0000000007cd'::uuid, $$SIT-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007ce'::uuid, $$SIT-018D$$, $$SIT-018D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007ce'::uuid, '00000000-1111-0000-0000-0000000007ce'::uuid, $$SIT-018D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007cf'::uuid, $$SIT-019$$, $$SIT-019$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007cf'::uuid, '00000000-1111-0000-0000-0000000007cf'::uuid, $$SIT-019$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007d0'::uuid, $$SIT-019D$$, $$SIT-019D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007d0'::uuid, '00000000-1111-0000-0000-0000000007d0'::uuid, $$SIT-019D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007d1'::uuid, $$SJI-001$$, $$SJI-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007d1'::uuid, '00000000-1111-0000-0000-0000000007d1'::uuid, $$SJI-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007d2'::uuid, $$SJI-002$$, $$SJI-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007d2'::uuid, '00000000-1111-0000-0000-0000000007d2'::uuid, $$SJI-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007d3'::uuid, $$SJI-003$$, $$SJI-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007d3'::uuid, '00000000-1111-0000-0000-0000000007d3'::uuid, $$SJI-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007d4'::uuid, $$SJI-007$$, $$SJI-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007d4'::uuid, '00000000-1111-0000-0000-0000000007d4'::uuid, $$SJI-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007d5'::uuid, $$SJI-008$$, $$SJI-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007d5'::uuid, '00000000-1111-0000-0000-0000000007d5'::uuid, $$SJI-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007d6'::uuid, $$SJI-009$$, $$SJI-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007d6'::uuid, '00000000-1111-0000-0000-0000000007d6'::uuid, $$SJI-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007d7'::uuid, $$SJI-010$$, $$SJI-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007d7'::uuid, '00000000-1111-0000-0000-0000000007d7'::uuid, $$SJI-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007d8'::uuid, $$SJI-012$$, $$SJI-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007d8'::uuid, '00000000-1111-0000-0000-0000000007d8'::uuid, $$SJI-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007d9'::uuid, $$SJI-013$$, $$SJI-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007d9'::uuid, '00000000-1111-0000-0000-0000000007d9'::uuid, $$SJI-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007da'::uuid, $$SJI-014$$, $$SJI-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007da'::uuid, '00000000-1111-0000-0000-0000000007da'::uuid, $$SJI-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007db'::uuid, $$SJI-015$$, $$SJI-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007db'::uuid, '00000000-1111-0000-0000-0000000007db'::uuid, $$SJI-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007dc'::uuid, $$SJI-016$$, $$SJI-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007dc'::uuid, '00000000-1111-0000-0000-0000000007dc'::uuid, $$SJI-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007dd'::uuid, $$SJI-017$$, $$SJI-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007dd'::uuid, '00000000-1111-0000-0000-0000000007dd'::uuid, $$SJI-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007de'::uuid, $$SJI-018$$, $$SJI-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007de'::uuid, '00000000-1111-0000-0000-0000000007de'::uuid, $$SJI-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007df'::uuid, $$SJI-019$$, $$SJI-019$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007df'::uuid, '00000000-1111-0000-0000-0000000007df'::uuid, $$SJI-019$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007e0'::uuid, $$SJI-020$$, $$SJI-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007e0'::uuid, '00000000-1111-0000-0000-0000000007e0'::uuid, $$SJI-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007e1'::uuid, $$SJI-021$$, $$SJI-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007e1'::uuid, '00000000-1111-0000-0000-0000000007e1'::uuid, $$SJI-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007e2'::uuid, $$SJI-021スタ$$, $$SJI-021 スタ$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007e2'::uuid, '00000000-1111-0000-0000-0000000007e2'::uuid, $$SJI-021スタ$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007e3'::uuid, $$SJK-002$$, $$SJK-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007e3'::uuid, '00000000-1111-0000-0000-0000000007e3'::uuid, $$SJK-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007e4'::uuid, $$SJK-004$$, $$SJK-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007e4'::uuid, '00000000-1111-0000-0000-0000000007e4'::uuid, $$SJK-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007e5'::uuid, $$SJK-005$$, $$SJK-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007e5'::uuid, '00000000-1111-0000-0000-0000000007e5'::uuid, $$SJK-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007e6'::uuid, $$SJK-006$$, $$SJK-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007e6'::uuid, '00000000-1111-0000-0000-0000000007e6'::uuid, $$SJK-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007e7'::uuid, $$SJK-007$$, $$SJK-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007e7'::uuid, '00000000-1111-0000-0000-0000000007e7'::uuid, $$SJK-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007e8'::uuid, $$SJK-008$$, $$SJK-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007e8'::uuid, '00000000-1111-0000-0000-0000000007e8'::uuid, $$SJK-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007e9'::uuid, $$SJK-009$$, $$SJK-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007e9'::uuid, '00000000-1111-0000-0000-0000000007e9'::uuid, $$SJK-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007ea'::uuid, $$SJK-010$$, $$SJK-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007ea'::uuid, '00000000-1111-0000-0000-0000000007ea'::uuid, $$SJK-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007eb'::uuid, $$SJK-011$$, $$SJK-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007eb'::uuid, '00000000-1111-0000-0000-0000000007eb'::uuid, $$SJK-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007ec'::uuid, $$SJK-012$$, $$SJK-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007ec'::uuid, '00000000-1111-0000-0000-0000000007ec'::uuid, $$SJK-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007ed'::uuid, $$SJT-001$$, $$SJT-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007ed'::uuid, '00000000-1111-0000-0000-0000000007ed'::uuid, $$SJT-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007ee'::uuid, $$SK-002EL-P-002$$, $$SK-002 EL-P-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007ee'::uuid, '00000000-1111-0000-0000-0000000007ee'::uuid, $$SK-002EL-P-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007ef'::uuid, $$SK-005EL-P-005$$, $$SK-005 EL-P-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007ef'::uuid, '00000000-1111-0000-0000-0000000007ef'::uuid, $$SK-005EL-P-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007f0'::uuid, $$SK-007$$, $$SK-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007f0'::uuid, '00000000-1111-0000-0000-0000000007f0'::uuid, $$SK-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007f1'::uuid, $$SK-008$$, $$SK-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007f1'::uuid, '00000000-1111-0000-0000-0000000007f1'::uuid, $$SK-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007f2'::uuid, $$SK-009$$, $$SK-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007f2'::uuid, '00000000-1111-0000-0000-0000000007f2'::uuid, $$SK-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007f3'::uuid, $$SK-010$$, $$SK-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007f3'::uuid, '00000000-1111-0000-0000-0000000007f3'::uuid, $$SK-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007f4'::uuid, $$SK-011(EL-P-09)$$, $$SK-011 (EL-P-09)$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007f4'::uuid, '00000000-1111-0000-0000-0000000007f4'::uuid, $$SK-011(EL-P-09)$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007f5'::uuid, $$SK-014$$, $$SK-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007f5'::uuid, '00000000-1111-0000-0000-0000000007f5'::uuid, $$SK-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007f6'::uuid, $$SK-015$$, $$SK-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007f6'::uuid, '00000000-1111-0000-0000-0000000007f6'::uuid, $$SK-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007f7'::uuid, $$SK-019$$, $$SK-019$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007f7'::uuid, '00000000-1111-0000-0000-0000000007f7'::uuid, $$SK-019$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007f8'::uuid, $$SK-020$$, $$SK-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007f8'::uuid, '00000000-1111-0000-0000-0000000007f8'::uuid, $$SK-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007f9'::uuid, $$SK-024$$, $$SK-024B$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007f9'::uuid, '00000000-1111-0000-0000-0000000007f9'::uuid, $$SK-024$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007fb'::uuid, $$SK-026$$, $$SK-026$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007fb'::uuid, '00000000-1111-0000-0000-0000000007fb'::uuid, $$SK-026$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007fc'::uuid, $$SK-029$$, $$SK-029$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007fc'::uuid, '00000000-1111-0000-0000-0000000007fc'::uuid, $$SK-029$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007fd'::uuid, $$SK-030$$, $$SK-030$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007fd'::uuid, '00000000-1111-0000-0000-0000000007fd'::uuid, $$SK-030$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007fe'::uuid, $$SK-031$$, $$SK-031$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007fe'::uuid, '00000000-1111-0000-0000-0000000007fe'::uuid, $$SK-031$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000007ff'::uuid, $$SK-037$$, $$SK-037$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000007ff'::uuid, '00000000-1111-0000-0000-0000000007ff'::uuid, $$SK-037$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000800'::uuid, $$SK-039$$, $$SK-039R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000800'::uuid, '00000000-1111-0000-0000-000000000800'::uuid, $$SK-039-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000801'::uuid, $$SK-043$$, $$SK-043B$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000801'::uuid, '00000000-1111-0000-0000-000000000801'::uuid, $$SK-043$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000803'::uuid, $$SK-046$$, $$SK-046$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000803'::uuid, '00000000-1111-0000-0000-000000000803'::uuid, $$SK-046$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000804'::uuid, $$SK-048$$, $$SK-048$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000804'::uuid, '00000000-1111-0000-0000-000000000804'::uuid, $$SK-048$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000805'::uuid, '00000000-1111-0000-0000-000000000804'::uuid, $$SK-048-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000806'::uuid, $$SK-051$$, $$SK-051$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000806'::uuid, '00000000-1111-0000-0000-000000000806'::uuid, $$SK-051$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000807'::uuid, $$SKC-001$$, $$SKC-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000807'::uuid, '00000000-1111-0000-0000-000000000807'::uuid, $$SKC-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000808'::uuid, $$SKK-002$$, $$SKK-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000808'::uuid, '00000000-1111-0000-0000-000000000808'::uuid, $$SKK-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000809'::uuid, $$SKK-003$$, $$SKK-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000809'::uuid, '00000000-1111-0000-0000-000000000809'::uuid, $$SKK-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000080a'::uuid, $$SKK-004$$, $$SKK-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000080a'::uuid, '00000000-1111-0000-0000-00000000080a'::uuid, $$SKK-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000080b'::uuid, $$SKK-006$$, $$SKK-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000080b'::uuid, '00000000-1111-0000-0000-00000000080b'::uuid, $$SKK-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000080c'::uuid, $$SKK-007$$, $$SKK-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000080c'::uuid, '00000000-1111-0000-0000-00000000080c'::uuid, $$SKK-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000080d'::uuid, '00000000-1111-0000-0000-00000000080c'::uuid, $$SKK-007-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000080e'::uuid, $$SKK-008?$$, $$SKK-008?$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000080e'::uuid, '00000000-1111-0000-0000-00000000080e'::uuid, $$SKK-008?$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000080f'::uuid, $$SKK-008$$, $$SKK-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000080f'::uuid, '00000000-1111-0000-0000-00000000080f'::uuid, $$SKK-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000810'::uuid, $$SKO-001$$, $$SKO-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000810'::uuid, '00000000-1111-0000-0000-000000000810'::uuid, $$SKO-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000811'::uuid, $$SKS-001$$, $$SKS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000811'::uuid, '00000000-1111-0000-0000-000000000811'::uuid, $$SKS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000812'::uuid, $$SKS-002$$, $$SKS-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000812'::uuid, '00000000-1111-0000-0000-000000000812'::uuid, $$SKS-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000813'::uuid, $$SKS-005$$, $$SKS-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000813'::uuid, '00000000-1111-0000-0000-000000000813'::uuid, $$SKS-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000814'::uuid, $$SKS-009$$, $$SKS-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000814'::uuid, '00000000-1111-0000-0000-000000000814'::uuid, $$SKS-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000815'::uuid, $$SKS-011$$, $$SKS-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000815'::uuid, '00000000-1111-0000-0000-000000000815'::uuid, $$SKS-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000816'::uuid, $$SKS-012$$, $$SKS-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000816'::uuid, '00000000-1111-0000-0000-000000000816'::uuid, $$SKS-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000817'::uuid, $$SKS-013$$, $$SKS-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;

COMMIT;
