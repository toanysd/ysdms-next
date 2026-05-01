-- PART 3/14
BEGIN;

INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000412'::uuid, $$KRE-016$$, $$KRE-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000412'::uuid, '00000000-1111-0000-0000-000000000412'::uuid, $$KRE-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000413'::uuid, $$KRE-018$$, $$KRE-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000413'::uuid, '00000000-1111-0000-0000-000000000413'::uuid, $$KRE-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000414'::uuid, $$KRE-019$$, $$KRE-019$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000414'::uuid, '00000000-1111-0000-0000-000000000414'::uuid, $$KRE-019$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000415'::uuid, $$KRE-020$$, $$KRE-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000415'::uuid, '00000000-1111-0000-0000-000000000415'::uuid, $$KRE-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000416'::uuid, $$KRE-021$$, $$KRE-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000416'::uuid, '00000000-1111-0000-0000-000000000416'::uuid, $$KRE-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000417'::uuid, $$KRE-023$$, $$KRE-023$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000417'::uuid, '00000000-1111-0000-0000-000000000417'::uuid, $$KRE-023$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000418'::uuid, $$KRE-024$$, $$KRE-024$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000418'::uuid, '00000000-1111-0000-0000-000000000418'::uuid, $$KRE-024$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000419'::uuid, $$KRE-026$$, $$KRE-026$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000419'::uuid, '00000000-1111-0000-0000-000000000419'::uuid, $$KRE-026$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000041a'::uuid, $$KRE-027$$, $$KRE-027$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000041a'::uuid, '00000000-1111-0000-0000-00000000041a'::uuid, $$KRE-027$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000041b'::uuid, $$KRE-028$$, $$KRE-028$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000041b'::uuid, '00000000-1111-0000-0000-00000000041b'::uuid, $$KRE-028$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000041c'::uuid, $$KRE-029$$, $$KRE-029$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000041c'::uuid, '00000000-1111-0000-0000-00000000041c'::uuid, $$KRE-029$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000041d'::uuid, $$KRE-03$$, $$KRE-03$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000041d'::uuid, '00000000-1111-0000-0000-00000000041d'::uuid, $$KRE-03$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000041e'::uuid, $$KRE-031$$, $$KRE-031$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000041e'::uuid, '00000000-1111-0000-0000-00000000041e'::uuid, $$KRE-031$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000041f'::uuid, $$KRE-032$$, $$KRE-032$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000041f'::uuid, '00000000-1111-0000-0000-00000000041f'::uuid, $$KRE-032$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000420'::uuid, $$KRE-033$$, $$KRE-033$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000420'::uuid, '00000000-1111-0000-0000-000000000420'::uuid, $$KRE-033$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000421'::uuid, $$KRE-034$$, $$KRE-034$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000421'::uuid, '00000000-1111-0000-0000-000000000421'::uuid, $$KRE-034$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000422'::uuid, $$KRE-035$$, $$KRE-035$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000422'::uuid, '00000000-1111-0000-0000-000000000422'::uuid, $$KRE-035$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000423'::uuid, $$KRE-036$$, $$KRE-036$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000423'::uuid, '00000000-1111-0000-0000-000000000423'::uuid, $$KRE-036$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000424'::uuid, $$KRE-037$$, $$KRE-037$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000424'::uuid, '00000000-1111-0000-0000-000000000424'::uuid, $$KRE-037$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000426'::uuid, $$KRE-038$$, $$KRE-038$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000426'::uuid, '00000000-1111-0000-0000-000000000426'::uuid, $$KRE-038$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000427'::uuid, '00000000-1111-0000-0000-000000000426'::uuid, $$KRE-038-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000428'::uuid, $$KRE-039$$, $$KRE-039$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000428'::uuid, '00000000-1111-0000-0000-000000000428'::uuid, $$KRE-039$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000429'::uuid, $$KRE-043$$, $$KRE-043$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000429'::uuid, '00000000-1111-0000-0000-000000000429'::uuid, $$KRE-043$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000042a'::uuid, $$KRE-044$$, $$KRE-044$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000042a'::uuid, '00000000-1111-0000-0000-00000000042a'::uuid, $$KRE-044$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000042b'::uuid, $$KRE-045$$, $$KRE-045$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000042b'::uuid, '00000000-1111-0000-0000-00000000042b'::uuid, $$KRE-045$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000042c'::uuid, $$KRE-049$$, $$KRE-049$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000042c'::uuid, '00000000-1111-0000-0000-00000000042c'::uuid, $$KRE-049$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000042d'::uuid, $$KSC-001$$, $$KSC-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000042d'::uuid, '00000000-1111-0000-0000-00000000042d'::uuid, $$KSC-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000042e'::uuid, $$KSC-002$$, $$KSC-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000042e'::uuid, '00000000-1111-0000-0000-00000000042e'::uuid, $$KSC-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000042f'::uuid, $$KSC-003$$, $$KSC-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000042f'::uuid, '00000000-1111-0000-0000-00000000042f'::uuid, $$KSC-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000430'::uuid, $$KSE$$, $$KSE$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000430'::uuid, '00000000-1111-0000-0000-000000000430'::uuid, $$KSE$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000431'::uuid, $$KSE（湾）$$, $$KSE（湾）$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000431'::uuid, '00000000-1111-0000-0000-000000000431'::uuid, $$KSE（湾）$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000432'::uuid, $$KSE-002$$, $$KSE-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000432'::uuid, '00000000-1111-0000-0000-000000000432'::uuid, $$KSE-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000433'::uuid, $$KSE-005$$, $$KSE-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000433'::uuid, '00000000-1111-0000-0000-000000000433'::uuid, $$KSE-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000434'::uuid, $$KSE-006$$, $$KSE-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000434'::uuid, '00000000-1111-0000-0000-000000000434'::uuid, $$KSE-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000435'::uuid, $$KSE-007$$, $$KSE-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000435'::uuid, '00000000-1111-0000-0000-000000000435'::uuid, $$KSE-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000436'::uuid, $$KSE-009$$, $$KSE-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000436'::uuid, '00000000-1111-0000-0000-000000000436'::uuid, $$KSE-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000437'::uuid, $$KSE-010$$, $$KSE-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000437'::uuid, '00000000-1111-0000-0000-000000000437'::uuid, $$KSE-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000438'::uuid, $$KSE-015$$, $$KSE-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000438'::uuid, '00000000-1111-0000-0000-000000000438'::uuid, $$KSE-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000439'::uuid, $$KSE-016$$, $$KSE-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000439'::uuid, '00000000-1111-0000-0000-000000000439'::uuid, $$KSE-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000043a'::uuid, '00000000-1111-0000-0000-000000000439'::uuid, $$KSE-016-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000043b'::uuid, $$KSE-018$$, $$KSE-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000043b'::uuid, '00000000-1111-0000-0000-00000000043b'::uuid, $$KSE-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000043c'::uuid, $$KSE-020$$, $$KSE-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000043c'::uuid, '00000000-1111-0000-0000-00000000043c'::uuid, $$KSE-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000043d'::uuid, $$KSE-021$$, $$KSE-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000043d'::uuid, '00000000-1111-0000-0000-00000000043d'::uuid, $$KSE-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000043e'::uuid, $$KSE-021B$$, $$KSE-021BT$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000043e'::uuid, '00000000-1111-0000-0000-00000000043e'::uuid, $$KSE-021B$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000043f'::uuid, $$KSE-022$$, $$KSE-022$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000043f'::uuid, '00000000-1111-0000-0000-00000000043f'::uuid, $$KSE-022$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000440'::uuid, '00000000-1111-0000-0000-00000000043f'::uuid, $$KSE-022-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000441'::uuid, $$KSE-023$$, $$KSE-023$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000441'::uuid, '00000000-1111-0000-0000-000000000441'::uuid, $$KSE-023$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000442'::uuid, $$KSE-D$$, $$KSE-D$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000442'::uuid, '00000000-1111-0000-0000-000000000442'::uuid, $$KSE-D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000443'::uuid, $$KSE-$$, $$KSE-T$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000443'::uuid, '00000000-1111-0000-0000-000000000443'::uuid, $$KSE-$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000444'::uuid, $$KSE-フタ$$, $$KSE-フタ$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000444'::uuid, '00000000-1111-0000-0000-000000000444'::uuid, $$KSE-フタ$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000445'::uuid, $$KSE-台湾機$$, $$KSE-台湾機$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000445'::uuid, '00000000-1111-0000-0000-000000000445'::uuid, $$KSE-台湾機$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000446'::uuid, $$KSK-004$$, $$KSK-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000446'::uuid, '00000000-1111-0000-0000-000000000446'::uuid, $$KSK-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000447'::uuid, $$KSP-002$$, $$KSP-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000447'::uuid, '00000000-1111-0000-0000-000000000447'::uuid, $$KSP-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000448'::uuid, $$KSP-005$$, $$KSP-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000448'::uuid, '00000000-1111-0000-0000-000000000448'::uuid, $$KSP-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000449'::uuid, $$KSP-006$$, $$KSP-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000449'::uuid, '00000000-1111-0000-0000-000000000449'::uuid, $$KSP-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000044a'::uuid, $$KSP-009$$, $$KSP-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000044a'::uuid, '00000000-1111-0000-0000-00000000044a'::uuid, $$KSP-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000044b'::uuid, $$KSP-010$$, $$KSP-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000044b'::uuid, '00000000-1111-0000-0000-00000000044b'::uuid, $$KSP-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000044c'::uuid, $$KSP-011$$, $$KSP-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000044c'::uuid, '00000000-1111-0000-0000-00000000044c'::uuid, $$KSP-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000044d'::uuid, $$KSP-012$$, $$KSP-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000044d'::uuid, '00000000-1111-0000-0000-00000000044d'::uuid, $$KSP-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000044e'::uuid, $$KSP-013$$, $$KSP-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000044e'::uuid, '00000000-1111-0000-0000-00000000044e'::uuid, $$KSP-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000044f'::uuid, $$KSP-014$$, $$KSP-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000044f'::uuid, '00000000-1111-0000-0000-00000000044f'::uuid, $$KSP-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000450'::uuid, $$KSP-015$$, $$KSP-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000450'::uuid, '00000000-1111-0000-0000-000000000450'::uuid, $$KSP-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000451'::uuid, $$KSP-016$$, $$KSP-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000451'::uuid, '00000000-1111-0000-0000-000000000451'::uuid, $$KSP-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000452'::uuid, $$KSP-017$$, $$KSP-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000452'::uuid, '00000000-1111-0000-0000-000000000452'::uuid, $$KSP-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000453'::uuid, $$KSP-018$$, $$KSP-018$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000453'::uuid, '00000000-1111-0000-0000-000000000453'::uuid, $$KSP-018$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000454'::uuid, $$KSP-019$$, $$KSP-019$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000454'::uuid, '00000000-1111-0000-0000-000000000454'::uuid, $$KSP-019$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000455'::uuid, $$KSP-020$$, $$KSP-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000455'::uuid, '00000000-1111-0000-0000-000000000455'::uuid, $$KSP-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000456'::uuid, $$KSP-020右$$, $$KSP-020右$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000456'::uuid, '00000000-1111-0000-0000-000000000456'::uuid, $$KSP-020右$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000457'::uuid, $$KSP-020左$$, $$KSP-020左$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000457'::uuid, '00000000-1111-0000-0000-000000000457'::uuid, $$KSP-020左$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000458'::uuid, $$KSP-021$$, $$KSP-021$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000458'::uuid, '00000000-1111-0000-0000-000000000458'::uuid, $$KSP-021$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000459'::uuid, $$KSP-022$$, $$KSP-022$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000459'::uuid, '00000000-1111-0000-0000-000000000459'::uuid, $$KSP-022$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000045a'::uuid, $$KSP-023$$, $$KSP-023$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000045a'::uuid, '00000000-1111-0000-0000-00000000045a'::uuid, $$KSP-023$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000045b'::uuid, $$KSP-024$$, $$KSP-024$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000045b'::uuid, '00000000-1111-0000-0000-00000000045b'::uuid, $$KSP-024$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000045c'::uuid, $$KSP-025$$, $$KSP-025$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000045c'::uuid, '00000000-1111-0000-0000-00000000045c'::uuid, $$KSP-025$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000045d'::uuid, $$KSP-026$$, $$KSP-026$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000045d'::uuid, '00000000-1111-0000-0000-00000000045d'::uuid, $$KSP-026$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000045e'::uuid, $$KSP-026右$$, $$KSP-026右$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000045e'::uuid, '00000000-1111-0000-0000-00000000045e'::uuid, $$KSP-026右$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000045f'::uuid, $$KSP-026左$$, $$KSP-026左$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000045f'::uuid, '00000000-1111-0000-0000-00000000045f'::uuid, $$KSP-026左$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000460'::uuid, $$KSP-027$$, $$KSP-027$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000460'::uuid, '00000000-1111-0000-0000-000000000460'::uuid, $$KSP-027$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000461'::uuid, $$KSP-029$$, $$KSP-029$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000461'::uuid, '00000000-1111-0000-0000-000000000461'::uuid, $$KSP-029$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000462'::uuid, $$KSP-030$$, $$KSP-030$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000462'::uuid, '00000000-1111-0000-0000-000000000462'::uuid, $$KSP-030$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000463'::uuid, $$KSP-031$$, $$KSP-031$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000463'::uuid, '00000000-1111-0000-0000-000000000463'::uuid, $$KSP-031$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000464'::uuid, $$KSP-032$$, $$KSP-032$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000464'::uuid, '00000000-1111-0000-0000-000000000464'::uuid, $$KSP-032$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000465'::uuid, $$KSP-033$$, $$KSP-033$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000465'::uuid, '00000000-1111-0000-0000-000000000465'::uuid, $$KSP-033$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000466'::uuid, $$KSP-034$$, $$KSP-034$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000466'::uuid, '00000000-1111-0000-0000-000000000466'::uuid, $$KSP-034$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000467'::uuid, $$KSP-035$$, $$KSP-035$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000467'::uuid, '00000000-1111-0000-0000-000000000467'::uuid, $$KSP-035$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000468'::uuid, $$KSP-036$$, $$KSP-036$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000468'::uuid, '00000000-1111-0000-0000-000000000468'::uuid, $$KSP-036$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000469'::uuid, $$KSP-037AB$$, $$KSP-037AB$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$AB$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000469'::uuid, '00000000-1111-0000-0000-000000000469'::uuid, $$KSP-037AB$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000046a'::uuid, $$KSP-038AB$$, $$KSP-038AB$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$AB$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000046a'::uuid, '00000000-1111-0000-0000-00000000046a'::uuid, $$KSP-038AB$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000046b'::uuid, $$KSP-040$$, $$KSP-040$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000046b'::uuid, '00000000-1111-0000-0000-00000000046b'::uuid, $$KSP-040$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000046c'::uuid, $$KSP-041$$, $$KSP-041$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000046c'::uuid, '00000000-1111-0000-0000-00000000046c'::uuid, $$KSP-041$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000046d'::uuid, $$KSP-042$$, $$KSP-042$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000046d'::uuid, '00000000-1111-0000-0000-00000000046d'::uuid, $$KSP-042$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000046e'::uuid, $$KSP-043$$, $$KSP-043$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000046e'::uuid, '00000000-1111-0000-0000-00000000046e'::uuid, $$KSP-043$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000046f'::uuid, $$KSP-044$$, $$KSP-044$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000046f'::uuid, '00000000-1111-0000-0000-00000000046f'::uuid, $$KSP-044$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000470'::uuid, $$KSP-045$$, $$KSP-045$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000470'::uuid, '00000000-1111-0000-0000-000000000470'::uuid, $$KSP-045$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000471'::uuid, $$KSP-046$$, $$KSP-046$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000471'::uuid, '00000000-1111-0000-0000-000000000471'::uuid, $$KSP-046$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000472'::uuid, $$KSP-049$$, $$KSP-049$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000472'::uuid, '00000000-1111-0000-0000-000000000472'::uuid, $$KSP-049$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000473'::uuid, $$KSP-049AB$$, $$KSP-049AB$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$AB$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000473'::uuid, '00000000-1111-0000-0000-000000000473'::uuid, $$KSP-049AB$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000474'::uuid, $$KSP-049新$$, $$KSP-049新$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000474'::uuid, '00000000-1111-0000-0000-000000000474'::uuid, $$KSP-049新$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000475'::uuid, $$KSP-050$$, $$KSP-050$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000475'::uuid, '00000000-1111-0000-0000-000000000475'::uuid, $$KSP-050$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000476'::uuid, $$KSP-050AB$$, $$KSP-050AB$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$AB$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000476'::uuid, '00000000-1111-0000-0000-000000000476'::uuid, $$KSP-050AB$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000477'::uuid, '00000000-1111-0000-0000-000000000475'::uuid, $$KSP-050-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000478'::uuid, $$KSP-051$$, $$KSP-051$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000478'::uuid, '00000000-1111-0000-0000-000000000478'::uuid, $$KSP-051$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000479'::uuid, $$KSP-053$$, $$KSP-053$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000479'::uuid, '00000000-1111-0000-0000-000000000479'::uuid, $$KSP-053$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000047a'::uuid, $$KSP-061$$, $$KSP-061$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000047a'::uuid, '00000000-1111-0000-0000-00000000047a'::uuid, $$KSP-061$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000047b'::uuid, $$KSP-062$$, $$KSP-062$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000047b'::uuid, '00000000-1111-0000-0000-00000000047b'::uuid, $$KSP-062$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000047c'::uuid, $$KSP-063$$, $$KSP-063$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000047c'::uuid, '00000000-1111-0000-0000-00000000047c'::uuid, $$KSP-063$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000047d'::uuid, $$KSP-065$$, $$KSP-065$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000047d'::uuid, '00000000-1111-0000-0000-00000000047d'::uuid, $$KSP-065$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000047e'::uuid, $$KSP-066$$, $$KSP-066$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000047e'::uuid, '00000000-1111-0000-0000-00000000047e'::uuid, $$KSP-066$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000047f'::uuid, $$KSP-067$$, $$KSP-067$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000047f'::uuid, '00000000-1111-0000-0000-00000000047f'::uuid, $$KSP-067$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000480'::uuid, $$KSP-069$$, $$KSP-069$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000480'::uuid, '00000000-1111-0000-0000-000000000480'::uuid, $$KSP-069$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000481'::uuid, $$KSP-070$$, $$KSP-070$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000481'::uuid, '00000000-1111-0000-0000-000000000481'::uuid, $$KSP-070$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000482'::uuid, $$KSP-071$$, $$KSP-071$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000482'::uuid, '00000000-1111-0000-0000-000000000482'::uuid, $$KSP-071$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000483'::uuid, $$KSP-072$$, $$KSP-072$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000483'::uuid, '00000000-1111-0000-0000-000000000483'::uuid, $$KSP-072$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000484'::uuid, $$KSP-073$$, $$KSP-073$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000484'::uuid, '00000000-1111-0000-0000-000000000484'::uuid, $$KSP-073$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000485'::uuid, $$KSP-074$$, $$KSP-074$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000485'::uuid, '00000000-1111-0000-0000-000000000485'::uuid, $$KSP-074$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000486'::uuid, $$KSP-075$$, $$KSP-075$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000486'::uuid, '00000000-1111-0000-0000-000000000486'::uuid, $$KSP-075$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000487'::uuid, $$KSP-076$$, $$KSP-076$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000487'::uuid, '00000000-1111-0000-0000-000000000487'::uuid, $$KSP-076$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000488'::uuid, $$KSP-077$$, $$KSP-077$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000488'::uuid, '00000000-1111-0000-0000-000000000488'::uuid, $$KSP-077$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000489'::uuid, $$KSP-078$$, $$KSP-078$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000489'::uuid, '00000000-1111-0000-0000-000000000489'::uuid, $$KSP-078$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000048a'::uuid, $$KSP-079$$, $$KSP-079$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000048a'::uuid, '00000000-1111-0000-0000-00000000048a'::uuid, $$KSP-079$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000048b'::uuid, $$KSP-080$$, $$KSP-080$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000048b'::uuid, '00000000-1111-0000-0000-00000000048b'::uuid, $$KSP-080$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000048c'::uuid, $$KSP-082$$, $$KSP-082$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000048c'::uuid, '00000000-1111-0000-0000-00000000048c'::uuid, $$KSP-082$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000048d'::uuid, $$KSP-083$$, $$KSP-083$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000048d'::uuid, '00000000-1111-0000-0000-00000000048d'::uuid, $$KSP-083$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000048e'::uuid, $$KSP-084$$, $$KSP-084$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000048e'::uuid, '00000000-1111-0000-0000-00000000048e'::uuid, $$KSP-084$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000048f'::uuid, $$KSP-085$$, $$KSP-085$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000048f'::uuid, '00000000-1111-0000-0000-00000000048f'::uuid, $$KSP-085$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000490'::uuid, $$KSP-086$$, $$KSP-086$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000490'::uuid, '00000000-1111-0000-0000-000000000490'::uuid, $$KSP-086$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000491'::uuid, $$KSP-087$$, $$KSP-087$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000491'::uuid, '00000000-1111-0000-0000-000000000491'::uuid, $$KSP-087$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000492'::uuid, $$KSP-088$$, $$KSP-088$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000492'::uuid, '00000000-1111-0000-0000-000000000492'::uuid, $$KSP-088$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000493'::uuid, $$KSP-089$$, $$KSP-089$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000493'::uuid, '00000000-1111-0000-0000-000000000493'::uuid, $$KSP-089$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000494'::uuid, $$KSP-090$$, $$KSP-090$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000494'::uuid, '00000000-1111-0000-0000-000000000494'::uuid, $$KSP-090$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000495'::uuid, $$KSP-091$$, $$KSP-091$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000495'::uuid, '00000000-1111-0000-0000-000000000495'::uuid, $$KSP-091$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000496'::uuid, $$KSP-092$$, $$KSP-092$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000496'::uuid, '00000000-1111-0000-0000-000000000496'::uuid, $$KSP-092$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000497'::uuid, $$KSP-093$$, $$KSP-093$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000497'::uuid, '00000000-1111-0000-0000-000000000497'::uuid, $$KSP-093$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000498'::uuid, $$KSP-094$$, $$KSP-094$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000498'::uuid, '00000000-1111-0000-0000-000000000498'::uuid, $$KSP-094$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000499'::uuid, $$KSP-095$$, $$KSP-095$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000499'::uuid, '00000000-1111-0000-0000-000000000499'::uuid, $$KSP-095$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000049a'::uuid, $$KSP-096$$, $$KSP-096$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000049a'::uuid, '00000000-1111-0000-0000-00000000049a'::uuid, $$KSP-096$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000049b'::uuid, $$KSP-097$$, $$KSP-097$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000049b'::uuid, '00000000-1111-0000-0000-00000000049b'::uuid, $$KSP-097$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000049c'::uuid, $$KSP-098$$, $$KSP-098$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000049c'::uuid, '00000000-1111-0000-0000-00000000049c'::uuid, $$KSP-098$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000049d'::uuid, $$KSP-099$$, $$KSP-099$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000049d'::uuid, '00000000-1111-0000-0000-00000000049d'::uuid, $$KSP-099$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000049e'::uuid, $$KSP-101$$, $$KSP-101$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000049e'::uuid, '00000000-1111-0000-0000-00000000049e'::uuid, $$KSP-101$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000049f'::uuid, $$KSP-102$$, $$KSP-102$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000049f'::uuid, '00000000-1111-0000-0000-00000000049f'::uuid, $$KSP-102$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004a0'::uuid, $$KSP-103$$, $$KSP-103$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004a0'::uuid, '00000000-1111-0000-0000-0000000004a0'::uuid, $$KSP-103$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004a1'::uuid, $$KSP-104$$, $$KSP-104$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004a1'::uuid, '00000000-1111-0000-0000-0000000004a1'::uuid, $$KSP-104$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004a2'::uuid, $$KSP-105$$, $$KSP-105$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004a2'::uuid, '00000000-1111-0000-0000-0000000004a2'::uuid, $$KSP-105$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004a3'::uuid, '00000000-1111-0000-0000-0000000004a2'::uuid, $$KSP-105-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004a4'::uuid, $$KSP-106$$, $$KSP-106$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004a4'::uuid, '00000000-1111-0000-0000-0000000004a4'::uuid, $$KSP-106$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004a5'::uuid, $$KSP-107$$, $$KSP-107$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004a5'::uuid, '00000000-1111-0000-0000-0000000004a5'::uuid, $$KSP-107$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004a6'::uuid, $$KSP-108$$, $$KSP-108$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004a6'::uuid, '00000000-1111-0000-0000-0000000004a6'::uuid, $$KSP-108$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004a7'::uuid, $$KSP-109$$, $$KSP-109$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004a7'::uuid, '00000000-1111-0000-0000-0000000004a7'::uuid, $$KSP-109$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004a8'::uuid, $$KSP-110$$, $$KSP-110$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004a8'::uuid, '00000000-1111-0000-0000-0000000004a8'::uuid, $$KSP-110$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004a9'::uuid, $$KSP-111$$, $$KSP-111$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004a9'::uuid, '00000000-1111-0000-0000-0000000004a9'::uuid, $$KSP-111$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004aa'::uuid, $$KSP-112$$, $$KSP-112$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004aa'::uuid, '00000000-1111-0000-0000-0000000004aa'::uuid, $$KSP-112$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004ab'::uuid, $$KSP-113$$, $$KSP-113$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004ab'::uuid, '00000000-1111-0000-0000-0000000004ab'::uuid, $$KSP-113$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004ac'::uuid, $$KSP-114$$, $$KSP-114$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004ac'::uuid, '00000000-1111-0000-0000-0000000004ac'::uuid, $$KSP-114$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004ad'::uuid, $$KSP-115$$, $$KSP-115$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004ad'::uuid, '00000000-1111-0000-0000-0000000004ad'::uuid, $$KSP-115$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004ae'::uuid, $$KSP-116$$, $$KSP-116$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004ae'::uuid, '00000000-1111-0000-0000-0000000004ae'::uuid, $$KSP-116$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004af'::uuid, $$KSP-119$$, $$KSP-119$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004af'::uuid, '00000000-1111-0000-0000-0000000004af'::uuid, $$KSP-119$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004b0'::uuid, $$KSP-120$$, $$KSP-120$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004b0'::uuid, '00000000-1111-0000-0000-0000000004b0'::uuid, $$KSP-120$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004b1'::uuid, $$KSP-121$$, $$KSP-121$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004b1'::uuid, '00000000-1111-0000-0000-0000000004b1'::uuid, $$KSP-121$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004b2'::uuid, $$KSP-123$$, $$KSP-123$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004b2'::uuid, '00000000-1111-0000-0000-0000000004b2'::uuid, $$KSP-123$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004b3'::uuid, $$KSP-124$$, $$KSP-124$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004b3'::uuid, '00000000-1111-0000-0000-0000000004b3'::uuid, $$KSP-124$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004b4'::uuid, $$KSP-128$$, $$KSP-128$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004b4'::uuid, '00000000-1111-0000-0000-0000000004b4'::uuid, $$KSP-128$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004b5'::uuid, $$KSP-130$$, $$KSP-130$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004b5'::uuid, '00000000-1111-0000-0000-0000000004b5'::uuid, $$KSP-130$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004b6'::uuid, $$KSP-131$$, $$KSP-131$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004b6'::uuid, '00000000-1111-0000-0000-0000000004b6'::uuid, $$KSP-131$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004b7'::uuid, $$KSP-133$$, $$KSP-133$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004b7'::uuid, '00000000-1111-0000-0000-0000000004b7'::uuid, $$KSP-133$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004b8'::uuid, $$KSP-134$$, $$KSP-134$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004b8'::uuid, '00000000-1111-0000-0000-0000000004b8'::uuid, $$KSP-134$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004b9'::uuid, $$KSP-135$$, $$KSP-135$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004b9'::uuid, '00000000-1111-0000-0000-0000000004b9'::uuid, $$KSP-135$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004ba'::uuid, $$KSP-136$$, $$KSP-136R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004ba'::uuid, '00000000-1111-0000-0000-0000000004ba'::uuid, $$KSP-136-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004bb'::uuid, $$KSP-137$$, $$KSP-137$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004bb'::uuid, '00000000-1111-0000-0000-0000000004bb'::uuid, $$KSP-137$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004bc'::uuid, $$KSP-140$$, $$KSP-140$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004bc'::uuid, '00000000-1111-0000-0000-0000000004bc'::uuid, $$KSP-140$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004bd'::uuid, $$KSP-141$$, $$KSP-141$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004bd'::uuid, '00000000-1111-0000-0000-0000000004bd'::uuid, $$KSP-141$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004be'::uuid, $$KSP-142$$, $$KSP-142$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004be'::uuid, '00000000-1111-0000-0000-0000000004be'::uuid, $$KSP-142$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004bf'::uuid, $$KSP-143$$, $$KSP-143$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004bf'::uuid, '00000000-1111-0000-0000-0000000004bf'::uuid, $$KSP-143$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004c0'::uuid, $$KSP-144$$, $$KSP-144$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004c0'::uuid, '00000000-1111-0000-0000-0000000004c0'::uuid, $$KSP-144$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004c1'::uuid, $$KSP-145$$, $$KSP-145$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004c1'::uuid, '00000000-1111-0000-0000-0000000004c1'::uuid, $$KSP-145$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004c2'::uuid, $$KSP-146$$, $$KSP-146$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004c2'::uuid, '00000000-1111-0000-0000-0000000004c2'::uuid, $$KSP-146$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004c3'::uuid, $$KSP-147$$, $$KSP-147$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004c3'::uuid, '00000000-1111-0000-0000-0000000004c3'::uuid, $$KSP-147$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004c4'::uuid, $$KSP-148$$, $$KSP-148$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004c4'::uuid, '00000000-1111-0000-0000-0000000004c4'::uuid, $$KSP-148$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004c5'::uuid, $$KSP-149$$, $$KSP-149$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004c5'::uuid, '00000000-1111-0000-0000-0000000004c5'::uuid, $$KSP-149$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004c6'::uuid, $$KSP-150$$, $$KSP-150$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004c6'::uuid, '00000000-1111-0000-0000-0000000004c6'::uuid, $$KSP-150$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004c7'::uuid, $$KSP-151$$, $$KSP-151$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004c7'::uuid, '00000000-1111-0000-0000-0000000004c7'::uuid, $$KSP-151$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004c8'::uuid, $$KSP-152$$, $$KSP-152$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004c8'::uuid, '00000000-1111-0000-0000-0000000004c8'::uuid, $$KSP-152$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004c9'::uuid, $$KSP-153$$, $$KSP-153$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004c9'::uuid, '00000000-1111-0000-0000-0000000004c9'::uuid, $$KSP-153$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004ca'::uuid, $$KSP-155$$, $$KSP-155$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004ca'::uuid, '00000000-1111-0000-0000-0000000004ca'::uuid, $$KSP-155$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004cb'::uuid, $$KSP-156$$, $$KSP-156$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004cb'::uuid, '00000000-1111-0000-0000-0000000004cb'::uuid, $$KSP-156$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004cc'::uuid, $$KSP-157$$, $$KSP-157$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004cc'::uuid, '00000000-1111-0000-0000-0000000004cc'::uuid, $$KSP-157$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004cd'::uuid, $$KSP-158$$, $$KSP-158$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004cd'::uuid, '00000000-1111-0000-0000-0000000004cd'::uuid, $$KSP-158$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004ce'::uuid, $$KSP-159$$, $$KSP-159$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004ce'::uuid, '00000000-1111-0000-0000-0000000004ce'::uuid, $$KSP-159$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004cf'::uuid, $$KSP-160$$, $$KSP-160$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004cf'::uuid, '00000000-1111-0000-0000-0000000004cf'::uuid, $$KSP-160$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004d0'::uuid, $$KSP-161$$, $$KSP-161$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004d0'::uuid, '00000000-1111-0000-0000-0000000004d0'::uuid, $$KSP-161$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004d1'::uuid, $$KSP-162$$, $$KSP-162$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004d1'::uuid, '00000000-1111-0000-0000-0000000004d1'::uuid, $$KSP-162$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004d2'::uuid, $$KSP-163$$, $$KSP-163$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004d2'::uuid, '00000000-1111-0000-0000-0000000004d2'::uuid, $$KSP-163$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004d3'::uuid, $$KSP-165$$, $$KSP-165$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004d3'::uuid, '00000000-1111-0000-0000-0000000004d3'::uuid, $$KSP-165$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004d4'::uuid, $$KSP-166$$, $$KSP-166$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004d4'::uuid, '00000000-1111-0000-0000-0000000004d4'::uuid, $$KSP-166$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004d5'::uuid, $$KSP-167$$, $$KSP-167$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004d5'::uuid, '00000000-1111-0000-0000-0000000004d5'::uuid, $$KSP-167$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004d6'::uuid, $$KSP-168$$, $$KSP-168$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004d6'::uuid, '00000000-1111-0000-0000-0000000004d6'::uuid, $$KSP-168$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004d7'::uuid, $$KSP-169$$, $$KSP-169$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004d7'::uuid, '00000000-1111-0000-0000-0000000004d7'::uuid, $$KSP-169$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004d8'::uuid, $$KSP-170$$, $$KSP-170$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004d8'::uuid, '00000000-1111-0000-0000-0000000004d8'::uuid, $$KSP-170$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004d9'::uuid, $$KSP-171$$, $$KSP-171$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004d9'::uuid, '00000000-1111-0000-0000-0000000004d9'::uuid, $$KSP-171$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004da'::uuid, $$KSP-172$$, $$KSP-172$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004da'::uuid, '00000000-1111-0000-0000-0000000004da'::uuid, $$KSP-172$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004db'::uuid, $$KSP-173$$, $$KSP-173$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004db'::uuid, '00000000-1111-0000-0000-0000000004db'::uuid, $$KSP-173$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004dc'::uuid, $$KSP-174$$, $$KSP-174$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004dc'::uuid, '00000000-1111-0000-0000-0000000004dc'::uuid, $$KSP-174$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004dd'::uuid, $$KSP-175$$, $$KSP-175$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004dd'::uuid, '00000000-1111-0000-0000-0000000004dd'::uuid, $$KSP-175$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004de'::uuid, $$KSP-176$$, $$KSP-176$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004de'::uuid, '00000000-1111-0000-0000-0000000004de'::uuid, $$KSP-176$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004df'::uuid, $$KSP-177$$, $$KSP-177$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004df'::uuid, '00000000-1111-0000-0000-0000000004df'::uuid, $$KSP-177$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004e0'::uuid, $$KSP-178$$, $$KSP-178$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004e0'::uuid, '00000000-1111-0000-0000-0000000004e0'::uuid, $$KSP-178$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004e1'::uuid, $$KSP-179$$, $$KSP-179$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004e1'::uuid, '00000000-1111-0000-0000-0000000004e1'::uuid, $$KSP-179$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004e2'::uuid, $$KSP-180$$, $$KSP-180$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004e2'::uuid, '00000000-1111-0000-0000-0000000004e2'::uuid, $$KSP-180$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004e3'::uuid, $$KSP-181$$, $$KSP-181$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004e3'::uuid, '00000000-1111-0000-0000-0000000004e3'::uuid, $$KSP-181$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004e4'::uuid, $$KSP-182$$, $$KSP-182$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004e4'::uuid, '00000000-1111-0000-0000-0000000004e4'::uuid, $$KSP-182$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004e5'::uuid, $$KSP-183$$, $$KSP-183$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004e5'::uuid, '00000000-1111-0000-0000-0000000004e5'::uuid, $$KSP-183$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004e6'::uuid, $$KSP-184$$, $$KSP-184$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004e6'::uuid, '00000000-1111-0000-0000-0000000004e6'::uuid, $$KSP-184$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004e7'::uuid, $$KSP-185$$, $$KSP-185$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004e7'::uuid, '00000000-1111-0000-0000-0000000004e7'::uuid, $$KSP-185$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004e8'::uuid, $$KSP-186$$, $$KSP-186$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004e8'::uuid, '00000000-1111-0000-0000-0000000004e8'::uuid, $$KSP-186$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004e9'::uuid, $$KSP-187$$, $$KSP-187$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004e9'::uuid, '00000000-1111-0000-0000-0000000004e9'::uuid, $$KSP-187$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004ea'::uuid, $$KSP-188$$, $$KSP-188$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004ea'::uuid, '00000000-1111-0000-0000-0000000004ea'::uuid, $$KSP-188$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004eb'::uuid, $$KSP-189$$, $$KSP-189$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004eb'::uuid, '00000000-1111-0000-0000-0000000004eb'::uuid, $$KSP-189$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004ec'::uuid, $$KSP-190$$, $$KSP-190$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004ec'::uuid, '00000000-1111-0000-0000-0000000004ec'::uuid, $$KSP-190$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004ed'::uuid, $$KSP-191$$, $$KSP-191$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004ed'::uuid, '00000000-1111-0000-0000-0000000004ed'::uuid, $$KSP-191$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004ee'::uuid, $$KSP-192$$, $$KSP-192$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004ee'::uuid, '00000000-1111-0000-0000-0000000004ee'::uuid, $$KSP-192$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004ef'::uuid, $$KSP-193$$, $$KSP-193$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004ef'::uuid, '00000000-1111-0000-0000-0000000004ef'::uuid, $$KSP-193$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004f0'::uuid, $$KSP-194$$, $$KSP-194$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004f0'::uuid, '00000000-1111-0000-0000-0000000004f0'::uuid, $$KSP-194$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004f1'::uuid, $$KSP-195$$, $$KSP-195$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004f1'::uuid, '00000000-1111-0000-0000-0000000004f1'::uuid, $$KSP-195$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004f2'::uuid, $$KSP-196$$, $$KSP-196$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004f2'::uuid, '00000000-1111-0000-0000-0000000004f2'::uuid, $$KSP-196$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004f3'::uuid, $$KSP-197$$, $$KSP-197$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004f3'::uuid, '00000000-1111-0000-0000-0000000004f3'::uuid, $$KSP-197$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004f4'::uuid, $$KSP-198$$, $$KSP-198$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004f4'::uuid, '00000000-1111-0000-0000-0000000004f4'::uuid, $$KSP-198$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004f5'::uuid, $$KSP-199$$, $$KSP-199$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004f5'::uuid, '00000000-1111-0000-0000-0000000004f5'::uuid, $$KSP-199$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004f6'::uuid, $$KSP-200$$, $$KSP-200 R1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004f6'::uuid, '00000000-1111-0000-0000-0000000004f6'::uuid, $$KSP-200-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004f7'::uuid, $$KSP-201$$, $$KSP-201$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004f7'::uuid, '00000000-1111-0000-0000-0000000004f7'::uuid, $$KSP-201$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004f8'::uuid, $$KSP-202$$, $$KSP-202$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004f8'::uuid, '00000000-1111-0000-0000-0000000004f8'::uuid, $$KSP-202$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004f9'::uuid, $$KSP-203$$, $$KSP-203$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004f9'::uuid, '00000000-1111-0000-0000-0000000004f9'::uuid, $$KSP-203$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004fa'::uuid, $$KSP-204$$, $$KSP-204$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004fa'::uuid, '00000000-1111-0000-0000-0000000004fa'::uuid, $$KSP-204$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004fb'::uuid, $$KSP-205$$, $$KSP-205$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004fb'::uuid, '00000000-1111-0000-0000-0000000004fb'::uuid, $$KSP-205$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004fc'::uuid, $$KSP-206$$, $$KSP-206$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004fc'::uuid, '00000000-1111-0000-0000-0000000004fc'::uuid, $$KSP-206$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004fd'::uuid, $$KSP-207?$$, $$KSP-207?$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004fd'::uuid, '00000000-1111-0000-0000-0000000004fd'::uuid, $$KSP-207?$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004fe'::uuid, $$KSP-207$$, $$KSP-207$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004fe'::uuid, '00000000-1111-0000-0000-0000000004fe'::uuid, $$KSP-207$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000004ff'::uuid, $$KSP-299$$, $$KSP-299$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000004ff'::uuid, '00000000-1111-0000-0000-0000000004ff'::uuid, $$KSP-299$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000500'::uuid, $$KSP-330$$, $$KSP-330$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000500'::uuid, '00000000-1111-0000-0000-000000000500'::uuid, $$KSP-330$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000501'::uuid, $$KSP-Inline$$, $$KSP-Inline$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000501'::uuid, '00000000-1111-0000-0000-000000000501'::uuid, $$KSP-Inline$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000502'::uuid, $$KSP-NoName$$, $$KSP-No Name$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000502'::uuid, '00000000-1111-0000-0000-000000000502'::uuid, $$KSP-NoName$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000503'::uuid, $$KSR-010????YS$$, $$KSR-010 ???? YSR$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000503'::uuid, '00000000-1111-0000-0000-000000000503'::uuid, $$KSR-010????YS-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000504'::uuid, $$KTK$$, $$KTK$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000504'::uuid, '00000000-1111-0000-0000-000000000504'::uuid, $$KTK$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000505'::uuid, $$KTK-002$$, $$KTK-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000505'::uuid, '00000000-1111-0000-0000-000000000505'::uuid, $$KTK-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000506'::uuid, $$KW-012-1$$, $$KW-012-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000506'::uuid, '00000000-1111-0000-0000-000000000506'::uuid, $$KW-012-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000507'::uuid, $$KW-025$$, $$KW-025$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000507'::uuid, '00000000-1111-0000-0000-000000000507'::uuid, $$KW-025$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000508'::uuid, $$KW-025-1$$, $$KW-025-1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000508'::uuid, '00000000-1111-0000-0000-000000000508'::uuid, $$KW-025-1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000509'::uuid, $$KWE-001$$, $$KWE-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000509'::uuid, '00000000-1111-0000-0000-000000000509'::uuid, $$KWE-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000050a'::uuid, $$KWE-001（TEST?)$$, $$KWE-001（TEST?)$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000050a'::uuid, '00000000-1111-0000-0000-00000000050a'::uuid, $$KWE-001（TEST?)$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000050b'::uuid, $$KWE-002$$, $$KWE-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000050b'::uuid, '00000000-1111-0000-0000-00000000050b'::uuid, $$KWE-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000050c'::uuid, $$KWE-003$$, $$KWE-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000050c'::uuid, '00000000-1111-0000-0000-00000000050c'::uuid, $$KWE-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000050d'::uuid, $$KYANON$$, $$KYANON$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000050d'::uuid, '00000000-1111-0000-0000-00000000050d'::uuid, $$KYANON$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000050e'::uuid, $$KYANON-Nonumber1$$, $$KYANON-No number1$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000050e'::uuid, '00000000-1111-0000-0000-00000000050e'::uuid, $$KYANON-Nonumber1$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000050f'::uuid, $$KYANON-Nonumber2$$, $$KYANON-No number2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000050f'::uuid, '00000000-1111-0000-0000-00000000050f'::uuid, $$KYANON-Nonumber2$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000510'::uuid, $$KYD-001D$$, $$KYD-001D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000510'::uuid, '00000000-1111-0000-0000-000000000510'::uuid, $$KYD-001D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000511'::uuid, $$KYD-001$$, $$KYD-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000511'::uuid, '00000000-1111-0000-0000-000000000511'::uuid, $$KYD-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000512'::uuid, '00000000-1111-0000-0000-000000000511'::uuid, $$KYD-001-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000513'::uuid, $$KYM-004$$, $$KYM-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000513'::uuid, '00000000-1111-0000-0000-000000000513'::uuid, $$KYM-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000514'::uuid, $$LDV-001$$, $$LDV-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000514'::uuid, '00000000-1111-0000-0000-000000000514'::uuid, $$LDV-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000515'::uuid, $$LKS$$, $$LKS$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000515'::uuid, '00000000-1111-0000-0000-000000000515'::uuid, $$LKS$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000516'::uuid, $$LKS-001$$, $$LKS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000516'::uuid, '00000000-1111-0000-0000-000000000516'::uuid, $$LKS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000517'::uuid, $$LKS-002$$, $$LKS-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000517'::uuid, '00000000-1111-0000-0000-000000000517'::uuid, $$LKS-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000518'::uuid, $$LKS-003$$, $$LKS-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000518'::uuid, '00000000-1111-0000-0000-000000000518'::uuid, $$LKS-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000519'::uuid, $$LKS-004$$, $$LKS-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000519'::uuid, '00000000-1111-0000-0000-000000000519'::uuid, $$LKS-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000051a'::uuid, $$LKS-005$$, $$LKS-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000051a'::uuid, '00000000-1111-0000-0000-00000000051a'::uuid, $$LKS-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000051b'::uuid, $$LKS-006$$, $$LKS-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000051b'::uuid, '00000000-1111-0000-0000-00000000051b'::uuid, $$LKS-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000051c'::uuid, $$LKS-007$$, $$LKS-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000051c'::uuid, '00000000-1111-0000-0000-00000000051c'::uuid, $$LKS-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000051d'::uuid, $$LMN-001$$, $$LMN-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000051d'::uuid, '00000000-1111-0000-0000-00000000051d'::uuid, $$LMN-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000051e'::uuid, $$LPS-001$$, $$LPS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000051e'::uuid, '00000000-1111-0000-0000-00000000051e'::uuid, $$LPS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000051f'::uuid, $$LPS-002新$$, $$LPS-002新$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000051f'::uuid, '00000000-1111-0000-0000-00000000051f'::uuid, $$LPS-002新$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000520'::uuid, $$LPS-003$$, $$LPS-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000520'::uuid, '00000000-1111-0000-0000-000000000520'::uuid, $$LPS-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000521'::uuid, $$LPS-004$$, $$LPS-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000521'::uuid, '00000000-1111-0000-0000-000000000521'::uuid, $$LPS-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000522'::uuid, $$LPS-006$$, $$LPS-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000522'::uuid, '00000000-1111-0000-0000-000000000522'::uuid, $$LPS-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000523'::uuid, $$LPS-007$$, $$LPS-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000523'::uuid, '00000000-1111-0000-0000-000000000523'::uuid, $$LPS-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000524'::uuid, $$LPS-009$$, $$LPS-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000524'::uuid, '00000000-1111-0000-0000-000000000524'::uuid, $$LPS-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000525'::uuid, $$LPS-010$$, $$LPS-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000525'::uuid, '00000000-1111-0000-0000-000000000525'::uuid, $$LPS-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000526'::uuid, $$LPS-011$$, $$LPS-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000526'::uuid, '00000000-1111-0000-0000-000000000526'::uuid, $$LPS-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000527'::uuid, $$LPS-012$$, $$LPS-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000527'::uuid, '00000000-1111-0000-0000-000000000527'::uuid, $$LPS-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000528'::uuid, $$LPS-013$$, $$LPS-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000528'::uuid, '00000000-1111-0000-0000-000000000528'::uuid, $$LPS-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000529'::uuid, $$LPS-015$$, $$LPS-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000529'::uuid, '00000000-1111-0000-0000-000000000529'::uuid, $$LPS-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000052a'::uuid, $$LPS-016$$, $$LPS-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000052a'::uuid, '00000000-1111-0000-0000-00000000052a'::uuid, $$LPS-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000052b'::uuid, $$LPS-017$$, $$LPS-017$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000052b'::uuid, '00000000-1111-0000-0000-00000000052b'::uuid, $$LPS-017$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000052c'::uuid, $$LPS-020$$, $$LPS-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000052c'::uuid, '00000000-1111-0000-0000-00000000052c'::uuid, $$LPS-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000052d'::uuid, $$LPS-022$$, $$LPS-022$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000052d'::uuid, '00000000-1111-0000-0000-00000000052d'::uuid, $$LPS-022$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000052e'::uuid, $$LPS-037$$, $$LPS-037$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000052e'::uuid, '00000000-1111-0000-0000-00000000052e'::uuid, $$LPS-037$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000052f'::uuid, $$LSK-003$$, $$LSK-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000052f'::uuid, '00000000-1111-0000-0000-00000000052f'::uuid, $$LSK-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000530'::uuid, $$M2T-139$$, $$M2T-139$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000530'::uuid, '00000000-1111-0000-0000-000000000530'::uuid, $$M2T-139$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000531'::uuid, $$MBC-001$$, $$MBC-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000531'::uuid, '00000000-1111-0000-0000-000000000531'::uuid, $$MBC-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000532'::uuid, $$MBM-001$$, $$MBM-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000532'::uuid, '00000000-1111-0000-0000-000000000532'::uuid, $$MBM-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000533'::uuid, $$MBM-002$$, $$MBM-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000533'::uuid, '00000000-1111-0000-0000-000000000533'::uuid, $$MBM-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000534'::uuid, $$MBM-006$$, $$MBM-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000534'::uuid, '00000000-1111-0000-0000-000000000534'::uuid, $$MBM-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000535'::uuid, $$MBM-007$$, $$MBM-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000535'::uuid, '00000000-1111-0000-0000-000000000535'::uuid, $$MBM-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000536'::uuid, $$MBM-008$$, $$MBM-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000536'::uuid, '00000000-1111-0000-0000-000000000536'::uuid, $$MBM-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000537'::uuid, $$MBN-002$$, $$MBN-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000537'::uuid, '00000000-1111-0000-0000-000000000537'::uuid, $$MBN-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000538'::uuid, $$MBS-001$$, $$MBS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000538'::uuid, '00000000-1111-0000-0000-000000000538'::uuid, $$MBS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000539'::uuid, $$MBS-002$$, $$MBS-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000539'::uuid, '00000000-1111-0000-0000-000000000539'::uuid, $$MBS-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000053a'::uuid, $$MCC-002$$, $$MCC-002 R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000053a'::uuid, '00000000-1111-0000-0000-00000000053a'::uuid, $$MCC-002-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000053b'::uuid, $$MCC-003$$, $$MCC-003 R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000053b'::uuid, '00000000-1111-0000-0000-00000000053b'::uuid, $$MCC-003-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000053c'::uuid, $$MCT-001D$$, $$MCT-001D$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000053c'::uuid, '00000000-1111-0000-0000-00000000053c'::uuid, $$MCT-001D$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000053d'::uuid, $$MDS-004$$, $$MDS-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000053d'::uuid, '00000000-1111-0000-0000-00000000053d'::uuid, $$MDS-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000053e'::uuid, $$MDS-005$$, $$MDS-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000053e'::uuid, '00000000-1111-0000-0000-00000000053e'::uuid, $$MDS-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000053f'::uuid, $$MH-001$$, $$MH-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000053f'::uuid, '00000000-1111-0000-0000-00000000053f'::uuid, $$MH-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000540'::uuid, $$MIC-001$$, $$MIC-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000540'::uuid, '00000000-1111-0000-0000-000000000540'::uuid, $$MIC-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000541'::uuid, $$MILLAC468V$$, $$MILLAC468V$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000541'::uuid, '00000000-1111-0000-0000-000000000541'::uuid, $$MILLAC468V$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000542'::uuid, $$MIS-001$$, $$MIS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000542'::uuid, '00000000-1111-0000-0000-000000000542'::uuid, $$MIS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000543'::uuid, $$MIS-002$$, $$MIS-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000543'::uuid, '00000000-1111-0000-0000-000000000543'::uuid, $$MIS-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000544'::uuid, $$MIS-003$$, $$MIS-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000544'::uuid, '00000000-1111-0000-0000-000000000544'::uuid, $$MIS-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000545'::uuid, $$MIS-2-001$$, $$MIS-2-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000545'::uuid, '00000000-1111-0000-0000-000000000545'::uuid, $$MIS-2-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000546'::uuid, $$MIS-2-004$$, $$MIS-2-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000546'::uuid, '00000000-1111-0000-0000-000000000546'::uuid, $$MIS-2-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000547'::uuid, $$MIS-2-005$$, $$MIS-2-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000547'::uuid, '00000000-1111-0000-0000-000000000547'::uuid, $$MIS-2-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000548'::uuid, $$MIY-001$$, $$MIY-001 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000548'::uuid, '00000000-1111-0000-0000-000000000548'::uuid, $$MIY-001-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000549'::uuid, $$MIY-002$$, $$MIY-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000549'::uuid, '00000000-1111-0000-0000-000000000549'::uuid, $$MIY-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000054a'::uuid, $$MKG-001$$, $$MKG-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000054a'::uuid, '00000000-1111-0000-0000-00000000054a'::uuid, $$MKG-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000054b'::uuid, $$MKG-002$$, $$MKG-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000054b'::uuid, '00000000-1111-0000-0000-00000000054b'::uuid, $$MKG-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000054c'::uuid, $$MKG-003$$, $$MKG-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000054c'::uuid, '00000000-1111-0000-0000-00000000054c'::uuid, $$MKG-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000054d'::uuid, $$MKN-001$$, $$MKN-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000054d'::uuid, '00000000-1111-0000-0000-00000000054d'::uuid, $$MKN-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000054e'::uuid, $$MKP-001$$, $$MKP-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000054e'::uuid, '00000000-1111-0000-0000-00000000054e'::uuid, $$MKP-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000054f'::uuid, $$MKP-002$$, $$MKP-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000054f'::uuid, '00000000-1111-0000-0000-00000000054f'::uuid, $$MKP-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000550'::uuid, $$MKP-003$$, $$MKP-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000550'::uuid, '00000000-1111-0000-0000-000000000550'::uuid, $$MKP-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000551'::uuid, $$MMC-003$$, $$MMC-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000551'::uuid, '00000000-1111-0000-0000-000000000551'::uuid, $$MMC-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000552'::uuid, $$MMT-001$$, $$MMT-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000552'::uuid, '00000000-1111-0000-0000-000000000552'::uuid, $$MMT-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000553'::uuid, $$MMT-002$$, $$MMT-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000553'::uuid, '00000000-1111-0000-0000-000000000553'::uuid, $$MMT-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000554'::uuid, $$MMT-003$$, $$MMT-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000554'::uuid, '00000000-1111-0000-0000-000000000554'::uuid, $$MMT-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000555'::uuid, $$MMT-004$$, $$MMT-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000555'::uuid, '00000000-1111-0000-0000-000000000555'::uuid, $$MMT-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000556'::uuid, $$MMT-005$$, $$MMT-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000556'::uuid, '00000000-1111-0000-0000-000000000556'::uuid, $$MMT-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000557'::uuid, $$MMT-006$$, $$MMT-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000557'::uuid, '00000000-1111-0000-0000-000000000557'::uuid, $$MMT-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000558'::uuid, $$MMT-008$$, $$MMT-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000558'::uuid, '00000000-1111-0000-0000-000000000558'::uuid, $$MMT-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000559'::uuid, $$MMT-009$$, $$MMT-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000559'::uuid, '00000000-1111-0000-0000-000000000559'::uuid, $$MMT-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000055a'::uuid, $$MMT-010$$, $$MMT-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000055a'::uuid, '00000000-1111-0000-0000-00000000055a'::uuid, $$MMT-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000055b'::uuid, $$MMT-011$$, $$MMT-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000055b'::uuid, '00000000-1111-0000-0000-00000000055b'::uuid, $$MMT-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000055c'::uuid, $$MMT-012$$, $$MMT-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000055c'::uuid, '00000000-1111-0000-0000-00000000055c'::uuid, $$MMT-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000055d'::uuid, $$MMT-013$$, $$MMT-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000055d'::uuid, '00000000-1111-0000-0000-00000000055d'::uuid, $$MMT-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000055e'::uuid, $$MMT-014$$, $$MMT-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000055e'::uuid, '00000000-1111-0000-0000-00000000055e'::uuid, $$MMT-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000055f'::uuid, $$MMT-015$$, $$MMT-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000055f'::uuid, '00000000-1111-0000-0000-00000000055f'::uuid, $$MMT-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000560'::uuid, $$MMT-016$$, $$MMT-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000560'::uuid, '00000000-1111-0000-0000-000000000560'::uuid, $$MMT-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000561'::uuid, $$MNM-001$$, $$MNM-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000561'::uuid, '00000000-1111-0000-0000-000000000561'::uuid, $$MNM-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000562'::uuid, $$MNM-002$$, $$MNM-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000562'::uuid, '00000000-1111-0000-0000-000000000562'::uuid, $$MNM-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000563'::uuid, $$MNM-003$$, $$MNM-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000563'::uuid, '00000000-1111-0000-0000-000000000563'::uuid, $$MNM-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000564'::uuid, $$MNM-004$$, $$MNM-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000564'::uuid, '00000000-1111-0000-0000-000000000564'::uuid, $$MNM-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000565'::uuid, $$MNM-005$$, $$MNM-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000565'::uuid, '00000000-1111-0000-0000-000000000565'::uuid, $$MNM-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000566'::uuid, $$MNM-006$$, $$MNM-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000566'::uuid, '00000000-1111-0000-0000-000000000566'::uuid, $$MNM-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000567'::uuid, $$MOK-001$$, $$MOK-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000567'::uuid, '00000000-1111-0000-0000-000000000567'::uuid, $$MOK-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000568'::uuid, $$MOK-003$$, $$MOK-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000568'::uuid, '00000000-1111-0000-0000-000000000568'::uuid, $$MOK-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000569'::uuid, $$MPL-001$$, $$MPL-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000569'::uuid, '00000000-1111-0000-0000-000000000569'::uuid, $$MPL-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000056a'::uuid, $$MRY-001$$, $$MRY-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000056a'::uuid, '00000000-1111-0000-0000-00000000056a'::uuid, $$MRY-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000056b'::uuid, $$MRY-002$$, $$MRY-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000056b'::uuid, '00000000-1111-0000-0000-00000000056b'::uuid, $$MRY-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000056c'::uuid, $$MRY-003$$, $$MRY-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000056c'::uuid, '00000000-1111-0000-0000-00000000056c'::uuid, $$MRY-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000056d'::uuid, $$MRY-003PS$$, $$MRY-003PS$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$PS$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000056d'::uuid, '00000000-1111-0000-0000-00000000056d'::uuid, $$MRY-003PS$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000056e'::uuid, $$MRY-004$$, $$MRY-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000056e'::uuid, '00000000-1111-0000-0000-00000000056e'::uuid, $$MRY-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000056f'::uuid, $$MRY-006$$, $$MRY-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000056f'::uuid, '00000000-1111-0000-0000-00000000056f'::uuid, $$MRY-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000570'::uuid, $$MRY-007$$, $$MRY-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000570'::uuid, '00000000-1111-0000-0000-000000000570'::uuid, $$MRY-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000571'::uuid, $$MRY-008$$, $$MRY-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000571'::uuid, '00000000-1111-0000-0000-000000000571'::uuid, $$MRY-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000572'::uuid, $$MRY-009$$, $$MRY-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000572'::uuid, '00000000-1111-0000-0000-000000000572'::uuid, $$MRY-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000573'::uuid, $$MRY-010$$, $$MRY-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000573'::uuid, '00000000-1111-0000-0000-000000000573'::uuid, $$MRY-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000574'::uuid, $$MRY-011$$, $$MRY-011$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000574'::uuid, '00000000-1111-0000-0000-000000000574'::uuid, $$MRY-011$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000575'::uuid, $$MRY-012$$, $$MRY-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000575'::uuid, '00000000-1111-0000-0000-000000000575'::uuid, $$MRY-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000576'::uuid, $$MRY-013$$, $$MRY-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000576'::uuid, '00000000-1111-0000-0000-000000000576'::uuid, $$MRY-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000577'::uuid, $$MRY-014$$, $$MRY-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000577'::uuid, '00000000-1111-0000-0000-000000000577'::uuid, $$MRY-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000578'::uuid, $$MRY-015$$, $$MRY-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000578'::uuid, '00000000-1111-0000-0000-000000000578'::uuid, $$MRY-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000579'::uuid, $$MS-033$$, $$MS-033$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000579'::uuid, '00000000-1111-0000-0000-000000000579'::uuid, $$MS-033$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000057a'::uuid, $$MS-034$$, $$MS-034$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000057a'::uuid, '00000000-1111-0000-0000-00000000057a'::uuid, $$MS-034$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000057b'::uuid, $$MS-042$$, $$MS-042$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000057b'::uuid, '00000000-1111-0000-0000-00000000057b'::uuid, $$MS-042$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000057c'::uuid, $$MS-043$$, $$MS-043$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000057c'::uuid, '00000000-1111-0000-0000-00000000057c'::uuid, $$MS-043$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000057d'::uuid, $$MSM-040$$, $$MSM-040$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000057d'::uuid, '00000000-1111-0000-0000-00000000057d'::uuid, $$MSM-040$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000057e'::uuid, $$MSM-044$$, $$MSM-044$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000057e'::uuid, '00000000-1111-0000-0000-00000000057e'::uuid, $$MSM-044$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000057f'::uuid, $$MSM-048$$, $$MSM-048$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000057f'::uuid, '00000000-1111-0000-0000-00000000057f'::uuid, $$MSM-048$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000580'::uuid, $$MSM-051$$, $$MSM-051$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000580'::uuid, '00000000-1111-0000-0000-000000000580'::uuid, $$MSM-051$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000581'::uuid, $$MTD-001$$, $$MTD-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000581'::uuid, '00000000-1111-0000-0000-000000000581'::uuid, $$MTD-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000584'::uuid, $$MTD-002$$, $$MTD-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000584'::uuid, '00000000-1111-0000-0000-000000000584'::uuid, $$MTD-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000585'::uuid, $$MTD-002AB$$, $$MTD-002AB$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$AB$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000585'::uuid, '00000000-1111-0000-0000-000000000585'::uuid, $$MTD-002AB$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000586'::uuid, $$MTE-001$$, $$MTE-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000586'::uuid, '00000000-1111-0000-0000-000000000586'::uuid, $$MTE-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000587'::uuid, $$MTE-002$$, $$MTE-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000587'::uuid, '00000000-1111-0000-0000-000000000587'::uuid, $$MTE-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000588'::uuid, $$MTM$$, $$MTM$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$M$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000588'::uuid, '00000000-1111-0000-0000-000000000588'::uuid, $$MTM$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000589'::uuid, $$MTM-005$$, $$MTM-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000589'::uuid, '00000000-1111-0000-0000-000000000589'::uuid, $$MTM-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000058a'::uuid, $$MTM-015$$, $$MTM-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000058a'::uuid, '00000000-1111-0000-0000-00000000058a'::uuid, $$MTM-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000058b'::uuid, $$MTM-015PLUG$$, $$MTM-015PLUG$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000058b'::uuid, '00000000-1111-0000-0000-00000000058b'::uuid, $$MTM-015PLUG$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000058c'::uuid, $$MTM-026$$, $$MTM-026$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000058c'::uuid, '00000000-1111-0000-0000-00000000058c'::uuid, $$MTM-026$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000058d'::uuid, $$MTM-027$$, $$MTM-027$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000058d'::uuid, '00000000-1111-0000-0000-00000000058d'::uuid, $$MTM-027$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000058e'::uuid, $$MTM-035$$, $$MTM-035$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000058e'::uuid, '00000000-1111-0000-0000-00000000058e'::uuid, $$MTM-035$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000058f'::uuid, $$MTM-044$$, $$MTM-044$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000058f'::uuid, '00000000-1111-0000-0000-00000000058f'::uuid, $$MTM-044$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000590'::uuid, $$MTM-045$$, $$MTM-045$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000590'::uuid, '00000000-1111-0000-0000-000000000590'::uuid, $$MTM-045$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000591'::uuid, $$MTM-060$$, $$MTM-060$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000591'::uuid, '00000000-1111-0000-0000-000000000591'::uuid, $$MTM-060$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000592'::uuid, $$MTM-074$$, $$MTM-074$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000592'::uuid, '00000000-1111-0000-0000-000000000592'::uuid, $$MTM-074$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000593'::uuid, $$MTM-075$$, $$MTM-075R$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000593'::uuid, '00000000-1111-0000-0000-000000000593'::uuid, $$MTM-075-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000594'::uuid, $$MTM-080$$, $$MTM-080$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000594'::uuid, '00000000-1111-0000-0000-000000000594'::uuid, $$MTM-080$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000595'::uuid, $$MTM-087$$, $$MTM-087$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000595'::uuid, '00000000-1111-0000-0000-000000000595'::uuid, $$MTM-087$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000596'::uuid, $$MTM-106$$, $$MTM-106$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000596'::uuid, '00000000-1111-0000-0000-000000000596'::uuid, $$MTM-106$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000597'::uuid, $$MTM-108$$, $$MTM-108$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000597'::uuid, '00000000-1111-0000-0000-000000000597'::uuid, $$MTM-108$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000598'::uuid, $$MTM-115$$, $$MTM-115$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000598'::uuid, '00000000-1111-0000-0000-000000000598'::uuid, $$MTM-115$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000599'::uuid, $$MTM-129$$, $$MTM-129$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000599'::uuid, '00000000-1111-0000-0000-000000000599'::uuid, $$MTM-129$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000059a'::uuid, $$MTM-130$$, $$MTM-130$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000059a'::uuid, '00000000-1111-0000-0000-00000000059a'::uuid, $$MTM-130$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000059b'::uuid, $$MTM-152$$, $$MTM-152$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000059b'::uuid, '00000000-1111-0000-0000-00000000059b'::uuid, $$MTM-152$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000059c'::uuid, $$MTM-155$$, $$MTM-155$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000059c'::uuid, '00000000-1111-0000-0000-00000000059c'::uuid, $$MTM-155$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000059d'::uuid, $$MTM-161$$, $$MTM-161$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000059d'::uuid, '00000000-1111-0000-0000-00000000059d'::uuid, $$MTM-161$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000059e'::uuid, $$MTM-167VN$$, $$MTM-167 VN$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000059e'::uuid, '00000000-1111-0000-0000-00000000059e'::uuid, $$MTM-167VN$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000059f'::uuid, $$MTM-169$$, $$MTM-169$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000059f'::uuid, '00000000-1111-0000-0000-00000000059f'::uuid, $$MTM-169$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005a0'::uuid, $$MTM-170$$, $$MTM-170$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005a0'::uuid, '00000000-1111-0000-0000-0000000005a0'::uuid, $$MTM-170$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005a1'::uuid, $$MTM-171$$, $$MTM-171$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005a1'::uuid, '00000000-1111-0000-0000-0000000005a1'::uuid, $$MTM-171$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005a2'::uuid, $$MTM-172$$, $$MTM-172$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005a2'::uuid, '00000000-1111-0000-0000-0000000005a2'::uuid, $$MTM-172$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005a3'::uuid, $$MTM-172X$$, $$MTM-172 増面$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$X$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005a3'::uuid, '00000000-1111-0000-0000-0000000005a3'::uuid, $$MTM-172X$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005a4'::uuid, $$MTM-173$$, $$MTM-173$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005a4'::uuid, '00000000-1111-0000-0000-0000000005a4'::uuid, $$MTM-173$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005a5'::uuid, $$MTM-173X$$, $$MTM-173 増面$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$X$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005a5'::uuid, '00000000-1111-0000-0000-0000000005a5'::uuid, $$MTM-173X$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005a6'::uuid, $$MTM-174$$, $$MTM-174$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005a6'::uuid, '00000000-1111-0000-0000-0000000005a6'::uuid, $$MTM-174$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005a7'::uuid, $$MTM-175$$, $$MTM-175$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005a7'::uuid, '00000000-1111-0000-0000-0000000005a7'::uuid, $$MTM-175$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005a8'::uuid, $$MTM-176$$, $$MTM-176$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005a8'::uuid, '00000000-1111-0000-0000-0000000005a8'::uuid, $$MTM-176$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005a9'::uuid, $$MTM-177$$, $$MTM-177$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005a9'::uuid, '00000000-1111-0000-0000-0000000005a9'::uuid, $$MTM-177$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005aa'::uuid, $$MTM-178-R6ZM3cav/4cav$$, $$MTM-178 R6 ZM 3cav/4cav$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005aa'::uuid, '00000000-1111-0000-0000-0000000005aa'::uuid, $$MTM-178-R6ZM3cav/4cav$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005ab'::uuid, $$MTM-178D$$, $$MTM-178D R3$$, (SELECT id FROM public.customers LIMIT 1), NULL, $$D$$, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005ab'::uuid, '00000000-1111-0000-0000-0000000005ab'::uuid, $$MTM-178D-R3$$, 3, $$R3$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005ac'::uuid, '00000000-1111-0000-0000-0000000005ab'::uuid, $$MTM-178D-R6$$, 6, $$R6$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005ad'::uuid, $$MTM-179$$, $$MTM-179$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005ad'::uuid, '00000000-1111-0000-0000-0000000005ad'::uuid, $$MTM-179$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005ae'::uuid, $$MTM-1793cav.4cavVN$$, $$MTM-179 3cav.4cav VN$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005ae'::uuid, '00000000-1111-0000-0000-0000000005ae'::uuid, $$MTM-1793cav.4cavVN$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005af'::uuid, $$MTM-180$$, $$MTM-180$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005af'::uuid, '00000000-1111-0000-0000-0000000005af'::uuid, $$MTM-180$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005b0'::uuid, $$MTM-1803CAV/4CAVVn$$, $$MTM-180 3CAV/4CAV Vn$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005b0'::uuid, '00000000-1111-0000-0000-0000000005b0'::uuid, $$MTM-1803CAV/4CAVVn$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005b1'::uuid, $$MTM-181$$, $$MTM-181$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005b1'::uuid, '00000000-1111-0000-0000-0000000005b1'::uuid, $$MTM-181$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005b2'::uuid, $$MTM-1813CAV/4CAVVn$$, $$MTM-181 3CAV/4CAV Vn$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005b2'::uuid, '00000000-1111-0000-0000-0000000005b2'::uuid, $$MTM-1813CAV/4CAVVn$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005b3'::uuid, $$MTM-182$$, $$MTM-182 R2$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005b3'::uuid, '00000000-1111-0000-0000-0000000005b3'::uuid, $$MTM-182-R2$$, 2, $$R2$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005b4'::uuid, $$MTM-283x205$$, $$MTM-283x205$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005b4'::uuid, '00000000-1111-0000-0000-0000000005b4'::uuid, $$MTM-283x205$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005b5'::uuid, $$MTM-A$$, $$MTM-A$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005b5'::uuid, '00000000-1111-0000-0000-0000000005b5'::uuid, $$MTM-A$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005b6'::uuid, $$MTM-NoName$$, $$MTM-No Name$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005b6'::uuid, '00000000-1111-0000-0000-0000000005b6'::uuid, $$MTM-NoName$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005b7'::uuid, $$MTR-001$$, $$MTR-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005b7'::uuid, '00000000-1111-0000-0000-0000000005b7'::uuid, $$MTR-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005b8'::uuid, '00000000-1111-0000-0000-0000000005b7'::uuid, $$MTR-001-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005b9'::uuid, $$MTR-002$$, $$MTR-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005b9'::uuid, '00000000-1111-0000-0000-0000000005b9'::uuid, $$MTR-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005ba'::uuid, $$MTR-003$$, $$MTR-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005ba'::uuid, '00000000-1111-0000-0000-0000000005ba'::uuid, $$MTR-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005bb'::uuid, $$MTR-004$$, $$MTR-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005bb'::uuid, '00000000-1111-0000-0000-0000000005bb'::uuid, $$MTR-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005bc'::uuid, $$MTS-001$$, $$MTS-001$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005bc'::uuid, '00000000-1111-0000-0000-0000000005bc'::uuid, $$MTS-001$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005bd'::uuid, $$MYS-002$$, $$MYS-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005bd'::uuid, '00000000-1111-0000-0000-0000000005bd'::uuid, $$MYS-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005be'::uuid, $$MYS-003$$, $$MYS-003$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005be'::uuid, '00000000-1111-0000-0000-0000000005be'::uuid, $$MYS-003$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005bf'::uuid, $$MYS-004$$, $$MYS-004$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005bf'::uuid, '00000000-1111-0000-0000-0000000005bf'::uuid, $$MYS-004$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005c0'::uuid, $$MYS-005$$, $$MYS-005$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005c0'::uuid, '00000000-1111-0000-0000-0000000005c0'::uuid, $$MYS-005$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005c1'::uuid, $$MZ$$, $$MZT$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005c1'::uuid, '00000000-1111-0000-0000-0000000005c1'::uuid, $$MZ$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005c2'::uuid, $$MZT-002$$, $$MZT-002$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005c2'::uuid, '00000000-1111-0000-0000-0000000005c2'::uuid, $$MZT-002$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005c3'::uuid, $$MZT-006$$, $$MZT-006$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005c3'::uuid, '00000000-1111-0000-0000-0000000005c3'::uuid, $$MZT-006$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005c4'::uuid, $$MZT-007$$, $$MZT-007$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005c4'::uuid, '00000000-1111-0000-0000-0000000005c4'::uuid, $$MZT-007$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005c5'::uuid, $$MZT-008$$, $$MZT-008$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005c5'::uuid, '00000000-1111-0000-0000-0000000005c5'::uuid, $$MZT-008$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005c6'::uuid, $$MZT-009$$, $$MZT-009$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005c6'::uuid, '00000000-1111-0000-0000-0000000005c6'::uuid, $$MZT-009$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005c7'::uuid, $$MZT-010$$, $$MZT-010$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005c7'::uuid, '00000000-1111-0000-0000-0000000005c7'::uuid, $$MZT-010$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005c8'::uuid, $$MZT-012$$, $$MZT-012$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005c8'::uuid, '00000000-1111-0000-0000-0000000005c8'::uuid, $$MZT-012$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005c9'::uuid, $$MZT-013$$, $$MZT-013$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005c9'::uuid, '00000000-1111-0000-0000-0000000005c9'::uuid, $$MZT-013$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005ca'::uuid, $$MZT-014$$, $$MZT-014$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005ca'::uuid, '00000000-1111-0000-0000-0000000005ca'::uuid, $$MZT-014$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005cb'::uuid, $$MZT-015$$, $$MZT-015$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005cb'::uuid, '00000000-1111-0000-0000-0000000005cb'::uuid, $$MZT-015$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005cc'::uuid, $$MZT-016$$, $$MZT-016$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005cc'::uuid, '00000000-1111-0000-0000-0000000005cc'::uuid, $$MZT-016$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005cd'::uuid, $$MZT-019$$, $$MZT-019$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005cd'::uuid, '00000000-1111-0000-0000-0000000005cd'::uuid, $$MZT-019$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005ce'::uuid, $$MZT-020$$, $$MZT-020$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005ce'::uuid, '00000000-1111-0000-0000-0000000005ce'::uuid, $$MZT-020$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005cf'::uuid, $$MZT-032$$, $$MZT-032$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005cf'::uuid, '00000000-1111-0000-0000-0000000005cf'::uuid, $$MZT-032$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005d0'::uuid, $$MZT-051$$, $$MZT-051$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005d0'::uuid, '00000000-1111-0000-0000-0000000005d0'::uuid, $$MZT-051$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005d1'::uuid, $$MZT-056$$, $$MZT-056$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005d1'::uuid, '00000000-1111-0000-0000-0000000005d1'::uuid, $$MZT-056$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005d2'::uuid, $$MZT-057$$, $$MZT-057$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005d2'::uuid, '00000000-1111-0000-0000-0000000005d2'::uuid, $$MZT-057$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005d3'::uuid, $$MZT-060$$, $$MZT-060$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005d3'::uuid, '00000000-1111-0000-0000-0000000005d3'::uuid, $$MZT-060$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005d4'::uuid, $$MZT-063$$, $$MZT-063$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005d4'::uuid, '00000000-1111-0000-0000-0000000005d4'::uuid, $$MZT-063$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005d5'::uuid, $$MZT-068$$, $$MZT-068$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005d5'::uuid, '00000000-1111-0000-0000-0000000005d5'::uuid, $$MZT-068$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005d6'::uuid, $$MZT-069$$, $$MZT-069$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005d6'::uuid, '00000000-1111-0000-0000-0000000005d6'::uuid, $$MZT-069$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005d7'::uuid, $$MZT-070$$, $$MZT-070$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005d7'::uuid, '00000000-1111-0000-0000-0000000005d7'::uuid, $$MZT-070$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005d8'::uuid, $$MZT-073$$, $$MZT-073$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005d8'::uuid, '00000000-1111-0000-0000-0000000005d8'::uuid, $$MZT-073$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005d9'::uuid, $$MZT-074$$, $$MZT-074$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005d9'::uuid, '00000000-1111-0000-0000-0000000005d9'::uuid, $$MZT-074$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005da'::uuid, $$MZT-078$$, $$MZT-078$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005da'::uuid, '00000000-1111-0000-0000-0000000005da'::uuid, $$MZT-078$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005db'::uuid, $$MZT-079$$, $$MZT-079$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005db'::uuid, '00000000-1111-0000-0000-0000000005db'::uuid, $$MZT-079$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005dc'::uuid, $$MZT-080$$, $$MZT-080$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005dc'::uuid, '00000000-1111-0000-0000-0000000005dc'::uuid, $$MZT-080$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005dd'::uuid, $$MZT-081$$, $$MZT-081$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005dd'::uuid, '00000000-1111-0000-0000-0000000005dd'::uuid, $$MZT-081$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005de'::uuid, $$MZT-082$$, $$MZT-082$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005de'::uuid, '00000000-1111-0000-0000-0000000005de'::uuid, $$MZT-082$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005df'::uuid, $$MZT-083$$, $$MZT-083$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005df'::uuid, '00000000-1111-0000-0000-0000000005df'::uuid, $$MZT-083$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005e0'::uuid, $$MZT-084$$, $$MZT-084$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005e0'::uuid, '00000000-1111-0000-0000-0000000005e0'::uuid, $$MZT-084$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005e1'::uuid, $$MZT-086$$, $$MZT-086$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005e1'::uuid, '00000000-1111-0000-0000-0000000005e1'::uuid, $$MZT-086$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005e2'::uuid, $$MZT-087$$, $$MZT-087$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005e2'::uuid, '00000000-1111-0000-0000-0000000005e2'::uuid, $$MZT-087$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005e3'::uuid, $$MZT-089$$, $$MZT-089$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005e3'::uuid, '00000000-1111-0000-0000-0000000005e3'::uuid, $$MZT-089$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005e4'::uuid, $$MZT-090$$, $$MZT-090$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005e4'::uuid, '00000000-1111-0000-0000-0000000005e4'::uuid, $$MZT-090$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005e5'::uuid, $$MZT-091$$, $$MZT-091$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005e5'::uuid, '00000000-1111-0000-0000-0000000005e5'::uuid, $$MZT-091$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005e6'::uuid, $$MZT-092$$, $$MZT-092$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005e6'::uuid, '00000000-1111-0000-0000-0000000005e6'::uuid, $$MZT-092$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005e7'::uuid, $$MZT-093$$, $$MZT-093$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005e7'::uuid, '00000000-1111-0000-0000-0000000005e7'::uuid, $$MZT-093$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005e8'::uuid, $$MZT-099$$, $$MZT-099$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005e8'::uuid, '00000000-1111-0000-0000-0000000005e8'::uuid, $$MZT-099$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005e9'::uuid, $$MZT-100$$, $$MZT-100$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005e9'::uuid, '00000000-1111-0000-0000-0000000005e9'::uuid, $$MZT-100$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005ea'::uuid, $$MZT-101$$, $$MZT-101$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005ea'::uuid, '00000000-1111-0000-0000-0000000005ea'::uuid, $$MZT-101$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005eb'::uuid, $$MZT-102$$, $$MZT-102$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005eb'::uuid, '00000000-1111-0000-0000-0000000005eb'::uuid, $$MZT-102$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005ec'::uuid, $$MZT-103$$, $$MZT-103$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005ec'::uuid, '00000000-1111-0000-0000-0000000005ec'::uuid, $$MZT-103$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005ed'::uuid, $$MZT-105$$, $$MZT-105$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005ed'::uuid, '00000000-1111-0000-0000-0000000005ed'::uuid, $$MZT-105$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005ee'::uuid, $$MZT-106$$, $$MZT-106$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005ee'::uuid, '00000000-1111-0000-0000-0000000005ee'::uuid, $$MZT-106$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005ef'::uuid, $$MZT-107$$, $$MZT-107$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005ef'::uuid, '00000000-1111-0000-0000-0000000005ef'::uuid, $$MZT-107$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005f0'::uuid, $$MZT-108$$, $$MZT-108$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005f0'::uuid, '00000000-1111-0000-0000-0000000005f0'::uuid, $$MZT-108$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005f1'::uuid, $$MZT-108CUTTE$$, $$MZT-108 CUTTER$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005f1'::uuid, '00000000-1111-0000-0000-0000000005f1'::uuid, $$MZT-108CUTTE-R1$$, 1, $$R1$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005f2'::uuid, $$MZT-109$$, $$MZT-109$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005f2'::uuid, '00000000-1111-0000-0000-0000000005f2'::uuid, $$MZT-109$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005f3'::uuid, $$MZT-110$$, $$MZT-110$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005f3'::uuid, '00000000-1111-0000-0000-0000000005f3'::uuid, $$MZT-110$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005f4'::uuid, $$MZT-111$$, $$MZT-111$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005f4'::uuid, '00000000-1111-0000-0000-0000000005f4'::uuid, $$MZT-111$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005f5'::uuid, $$MZT-112$$, $$MZT-112$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005f5'::uuid, '00000000-1111-0000-0000-0000000005f5'::uuid, $$MZT-112$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005f6'::uuid, $$MZT-112新$$, $$MZT-112新$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005f6'::uuid, '00000000-1111-0000-0000-0000000005f6'::uuid, $$MZT-112新$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005f7'::uuid, $$MZT-113$$, $$MZT-113$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005f7'::uuid, '00000000-1111-0000-0000-0000000005f7'::uuid, $$MZT-113$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005f8'::uuid, $$MZT-114$$, $$MZT-114$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005f8'::uuid, '00000000-1111-0000-0000-0000000005f8'::uuid, $$MZT-114$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005f9'::uuid, $$MZT-115$$, $$MZT-115$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005f9'::uuid, '00000000-1111-0000-0000-0000000005f9'::uuid, $$MZT-115$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005fa'::uuid, $$MZT-116$$, $$MZT-116$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005fa'::uuid, '00000000-1111-0000-0000-0000000005fa'::uuid, $$MZT-116$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005fb'::uuid, $$MZT-117$$, $$MZT-117$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005fb'::uuid, '00000000-1111-0000-0000-0000000005fb'::uuid, $$MZT-117$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005fc'::uuid, $$MZT-118$$, $$MZT-118$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005fc'::uuid, '00000000-1111-0000-0000-0000000005fc'::uuid, $$MZT-118$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005fd'::uuid, $$MZT-128$$, $$MZT-128$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005fd'::uuid, '00000000-1111-0000-0000-0000000005fd'::uuid, $$MZT-128$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005fe'::uuid, $$MZT-129$$, $$MZT-129$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005fe'::uuid, '00000000-1111-0000-0000-0000000005fe'::uuid, $$MZT-129$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-0000000005ff'::uuid, $$MZT-130$$, $$MZT-130$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-0000000005ff'::uuid, '00000000-1111-0000-0000-0000000005ff'::uuid, $$MZT-130$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000600'::uuid, $$MZT-131$$, $$MZT-131$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000600'::uuid, '00000000-1111-0000-0000-000000000600'::uuid, $$MZT-131$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000601'::uuid, $$MZT-132$$, $$MZT-132$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000601'::uuid, '00000000-1111-0000-0000-000000000601'::uuid, $$MZT-132$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000602'::uuid, $$MZT-133$$, $$MZT-133$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000602'::uuid, '00000000-1111-0000-0000-000000000602'::uuid, $$MZT-133$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000603'::uuid, $$MZT-134$$, $$MZT-134$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000603'::uuid, '00000000-1111-0000-0000-000000000603'::uuid, $$MZT-134$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000604'::uuid, $$MZT-135$$, $$MZT-135$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000604'::uuid, '00000000-1111-0000-0000-000000000604'::uuid, $$MZT-135$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000605'::uuid, $$MZT-136$$, $$MZT-136$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000605'::uuid, '00000000-1111-0000-0000-000000000605'::uuid, $$MZT-136$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000606'::uuid, $$MZT-137$$, $$MZT-137$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000606'::uuid, '00000000-1111-0000-0000-000000000606'::uuid, $$MZT-137$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000607'::uuid, $$MZT-138$$, $$MZT-138$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000607'::uuid, '00000000-1111-0000-0000-000000000607'::uuid, $$MZT-138$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000608'::uuid, $$MZT-139$$, $$MZT-139$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000608'::uuid, '00000000-1111-0000-0000-000000000608'::uuid, $$MZT-139$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-000000000609'::uuid, $$MZT-140$$, $$MZT-140$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-000000000609'::uuid, '00000000-1111-0000-0000-000000000609'::uuid, $$MZT-140$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000060a'::uuid, $$MZT-142$$, $$MZT-142$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000060a'::uuid, '00000000-1111-0000-0000-00000000060a'::uuid, $$MZT-142$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000060b'::uuid, $$MZT-143$$, $$MZT-143$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000060b'::uuid, '00000000-1111-0000-0000-00000000060b'::uuid, $$MZT-143$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;
INSERT INTO mold_base (id, code, name, customer_id, cav_model_id, part_qualifier, is_active)
VALUES ('00000000-1111-0000-0000-00000000060c'::uuid, $$MZT-144$$, $$MZT-144$$, (SELECT id FROM public.customers LIMIT 1), NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, cav_model_id = EXCLUDED.cav_model_id;
INSERT INTO mold_design_revision (id, mold_base_id, revision_code, revision_num, version_label)
VALUES ('00000000-2222-0000-0000-00000000060c'::uuid, '00000000-1111-0000-0000-00000000060c'::uuid, $$MZT-144$$, 0, $$R0$$)
ON CONFLICT (id) DO UPDATE SET revision_code = EXCLUDED.revision_code, version_label = EXCLUDED.version_label, revision_num = EXCLUDED.revision_num;

COMMIT;
