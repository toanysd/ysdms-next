-- PART 11/14
BEGIN;

INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000042d'::uuid, $$OPA-001$$, '00000000-2222-0000-0000-000000000776'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000042e'::uuid, $$ASS-001$$, '00000000-2222-0000-0000-00000000016d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000042f'::uuid, $$KND-004$$, '00000000-2222-0000-0000-000000000434'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000430'::uuid, $$KKG-003$$, '00000000-2222-0000-0000-000000000429'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000431'::uuid, $$SKS-014$$, '00000000-2222-0000-0000-00000000085f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000432'::uuid, $$GMY-001$$, '00000000-2222-0000-0000-00000000026e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000433'::uuid, $$GMY-067$$, '00000000-2222-0000-0000-000000000279'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000434'::uuid, $$GMY-087$$, '00000000-2222-0000-0000-00000000027b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000435'::uuid, $$GMY-086$$, '00000000-2222-0000-0000-00000000027a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000436'::uuid, $$GMY-089$$, '00000000-2222-0000-0000-00000000027c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000437'::uuid, $$GMY-064$$, '00000000-2222-0000-0000-000000000278'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000438'::uuid, $$GMY-090$$, '00000000-2222-0000-0000-00000000027d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000439'::uuid, $$GMY-004$$, '00000000-2222-0000-0000-00000000026f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000043a'::uuid, $$GMY-092$$, '00000000-2222-0000-0000-00000000027e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000043b'::uuid, $$NWN-001$$, '00000000-2222-0000-0000-000000000714'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000043c'::uuid, $$JIC-001$$, '00000000-2222-0000-0000-0000000003ad'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000043d'::uuid, $$JIC-002$$, '00000000-2222-0000-0000-0000000003ae'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000043e'::uuid, $$GMY-093$$, '00000000-2222-0000-0000-00000000027f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000043f'::uuid, $$NSM-004$$, '00000000-2222-0000-0000-000000000712'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000440'::uuid, $$NSM-002$$, '00000000-2222-0000-0000-000000000710'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000441'::uuid, $$HKS-010$$, '00000000-2222-0000-0000-000000000290'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000442'::uuid, $$SHT-012$$, '00000000-2222-0000-0000-000000000803'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000443'::uuid, $$NGS-016$$, '00000000-2222-0000-0000-000000000690'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000444'::uuid, $$STD-002$$, '00000000-2222-0000-0000-000000000924'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000445'::uuid, $$KWE-002$$, '00000000-2222-0000-0000-000000000559'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000446'::uuid, $$KWE-003$$, '00000000-2222-0000-0000-00000000055a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000448'::uuid, $$KND-006$$, '00000000-2222-0000-0000-000000000436'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000449'::uuid, $$SDS-001$$, '00000000-2222-0000-0000-0000000007e6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000044a'::uuid, $$UNNAMED-001$$, '00000000-2222-0000-0000-0000000006d1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000044b'::uuid, $$OGR-013F$$, '00000000-2222-0000-0000-000000000742'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000044c'::uuid, $$SNM-003$$, '00000000-2222-0000-0000-0000000008af'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000044d'::uuid, $$NGS-012$$, '00000000-2222-0000-0000-00000000068a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000044e'::uuid, $$KWE-001（TEST?)$$, '00000000-2222-0000-0000-000000000558'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000044f'::uuid, $$STN-001$$, '00000000-2222-0000-0000-000000000937'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000450'::uuid, $$STN-002$$, '00000000-2222-0000-0000-000000000938'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000451'::uuid, $$SDK-001$$, '00000000-2222-0000-0000-0000000007e5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000452'::uuid, $$TRT-001$$, '00000000-2222-0000-0000-000000000c7c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000453'::uuid, $$Other-試作?$$, '00000000-2222-0000-0000-00000000079c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000454'::uuid, $$HYT-002$$, '00000000-2222-0000-0000-0000000002a7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000455'::uuid, $$HYT-001$$, '00000000-2222-0000-0000-0000000002a6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000456'::uuid, $$HSH-001$$, '00000000-2222-0000-0000-0000000002a0'::uuid, 1, 1, NULL, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000457'::uuid, $$HNS-001$$, '00000000-2222-0000-0000-00000000029a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000458'::uuid, $$AAT-008$$, '00000000-2222-0000-0000-00000000007d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000459'::uuid, $$AAT-007$$, '00000000-2222-0000-0000-00000000007c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000045a'::uuid, $$TBG-009$$, '00000000-2222-0000-0000-000000000957'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000045b'::uuid, $$SMK-212$$, '00000000-2222-0000-0000-0000000008a4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000045c'::uuid, $$OOT-039$$, '00000000-2222-0000-0000-00000000076e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000045d'::uuid, $$OOT-038$$, '00000000-2222-0000-0000-00000000076d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000045e'::uuid, $$KGM-005$$, '00000000-2222-0000-0000-000000000412'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000045f'::uuid, $$SMK-216$$, '00000000-2222-0000-0000-0000000008a8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000461'::uuid, $$JAE-285-R4$$, '00000000-2222-0000-0000-000000000383'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000462'::uuid, $$DHA-003$$, '00000000-2222-0000-0000-0000000001c2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000463'::uuid, $$TUK-002$$, '00000000-2222-0000-0000-000000000c89'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000465'::uuid, $$SRI-006$$, '00000000-2222-0000-0000-0000000008d2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000467'::uuid, $$JAE-293-R1$$, '00000000-2222-0000-0000-00000000038b'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000468'::uuid, $$ATS-030-R1$$, '00000000-2222-0000-0000-00000000018d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000469'::uuid, $$ATS-031$$, '00000000-2222-0000-0000-00000000018e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000046a'::uuid, $$ADY-090($$, '00000000-2222-0000-0000-0000000000b7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000046b'::uuid, $$RKK-001$$, '00000000-2222-0000-0000-0000000007d0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000046c'::uuid, $$KOS-015$$, '00000000-2222-0000-0000-000000000452'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000046d'::uuid, $$ADY-089$$, '00000000-2222-0000-0000-0000000000b5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000046e'::uuid, $$ASH-005$$, '00000000-2222-0000-0000-00000000016a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000046f'::uuid, $$TIH-020$$, '00000000-2222-0000-0000-000000000c0a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000470'::uuid, $$TE-2426410-1$$, '00000000-2222-0000-0000-000000000a8b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000471'::uuid, $$TE-2426409-1$$, '00000000-2222-0000-0000-000000000a8a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000472'::uuid, $$KSP-205$$, '00000000-2222-0000-0000-000000000549'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000473'::uuid, $$KSP-206$$, '00000000-2222-0000-0000-00000000054a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000475'::uuid, $$JAE-311$$, '00000000-2222-0000-0000-00000000039e'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000477'::uuid, $$KDS-049$$, '00000000-2222-0000-0000-0000000003c8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000478'::uuid, $$TE-2426387-1$$, '00000000-2222-0000-0000-000000000a89'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000479'::uuid, $$TE-2426386-1$$, '00000000-2222-0000-0000-000000000a88'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000047a'::uuid, $$TE-2423252-3-R1$$, '00000000-2222-0000-0000-000000000a82'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000047b'::uuid, $$TE-2423252-1-R1$$, '00000000-2222-0000-0000-000000000a79'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000047c'::uuid, $$JAE-250$$, '00000000-2222-0000-0000-000000000361'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000047d'::uuid, $$JAE-252$$, '00000000-2222-0000-0000-000000000363'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000047e'::uuid, $$TE-243252-1$$, '00000000-2222-0000-0000-000000000a8f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000047f'::uuid, $$TE-243252-2$$, '00000000-2222-0000-0000-000000000a91'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000480'::uuid, $$TE-2428383-1$$, '00000000-2222-0000-0000-000000000a8d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000481'::uuid, $$TE-2428384-1$$, '00000000-2222-0000-0000-000000000a8e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000482'::uuid, $$ATS-025$$, '00000000-2222-0000-0000-000000000181'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000483'::uuid, $$TE-8-162-5PS$$, '00000000-2222-0000-0000-000000000ba2'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000484'::uuid, $$ATS-024$$, '00000000-2222-0000-0000-000000000180'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000485'::uuid, $$SHT-014$$, '00000000-2222-0000-0000-000000000806'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000486'::uuid, $$TE-8-162-4PS$$, '00000000-2222-0000-0000-000000000ba1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000488'::uuid, $$WTN-006$$, '00000000-2222-0000-0000-000000000cab'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000489'::uuid, $$TE-2423252-3-R2$$, '00000000-2222-0000-0000-000000000a83'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000048b'::uuid, $$ATS-019$$, '00000000-2222-0000-0000-00000000017c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000048c'::uuid, $$TE-2445797-1$$, '00000000-2222-0000-0000-000000000a95'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000048d'::uuid, $$JAE-299$$, '00000000-2222-0000-0000-000000000392'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000048f'::uuid, $$JAE-292-R1$$, '00000000-2222-0000-0000-00000000038a'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000490'::uuid, $$TE-2421948-1$$, '00000000-2222-0000-0000-000000000a76'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000491'::uuid, $$JAE-276-R1$$, '00000000-2222-0000-0000-00000000037b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000492'::uuid, $$TE-2420081-1$$, '00000000-2222-0000-0000-000000000a75'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000493'::uuid, $$ODS-039$$, '00000000-2222-0000-0000-00000000072f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000494'::uuid, $$E-035-1$$, '00000000-2222-0000-0000-000000000d47'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000496'::uuid, $$FHJ-001PLUG$$, '00000000-2222-0000-0000-000000000262'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000497'::uuid, $$TE-1-177-7PLUG$$, '00000000-2222-0000-0000-000000000a17'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000049d'::uuid, $$KSP-141$$, '00000000-2222-0000-0000-00000000050b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000049e'::uuid, $$KSP-097$$, '00000000-2222-0000-0000-0000000004e9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000049f'::uuid, $$KSP-089$$, '00000000-2222-0000-0000-0000000004e1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004a0'::uuid, $$KSP-083$$, '00000000-2222-0000-0000-0000000004db'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004a1'::uuid, $$KSP-098$$, '00000000-2222-0000-0000-0000000004ea'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004a2'::uuid, $$KSP-110$$, '00000000-2222-0000-0000-0000000004f6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004a3'::uuid, $$KSP-128$$, '00000000-2222-0000-0000-000000000502'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004a4'::uuid, $$KSP-061$$, '00000000-2222-0000-0000-0000000004c8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004a5'::uuid, $$KSP-107$$, '00000000-2222-0000-0000-0000000004f3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004a6'::uuid, $$KSP-120$$, '00000000-2222-0000-0000-0000000004fe'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004a7'::uuid, $$KSP-131$$, '00000000-2222-0000-0000-000000000504'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004a8'::uuid, $$KSP-130$$, '00000000-2222-0000-0000-000000000503'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004a9'::uuid, $$KSP-080$$, '00000000-2222-0000-0000-0000000004d9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004aa'::uuid, $$KSP-078$$, '00000000-2222-0000-0000-0000000004d7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004ab'::uuid, $$KSP-104$$, '00000000-2222-0000-0000-0000000004ef'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004ac'::uuid, $$KSP-079$$, '00000000-2222-0000-0000-0000000004d8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004ad'::uuid, $$KSP-065$$, '00000000-2222-0000-0000-0000000004cb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004ae'::uuid, $$KSP-096$$, '00000000-2222-0000-0000-0000000004e8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004af'::uuid, $$KSP-086$$, '00000000-2222-0000-0000-0000000004de'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004b0'::uuid, $$KSP-119$$, '00000000-2222-0000-0000-0000000004fd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004b1'::uuid, $$KSP-112$$, '00000000-2222-0000-0000-0000000004f8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004b2'::uuid, $$KSP-093$$, '00000000-2222-0000-0000-0000000004e5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004b3'::uuid, $$KSP-140$$, '00000000-2222-0000-0000-00000000050a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004b4'::uuid, $$KSP-121$$, '00000000-2222-0000-0000-0000000004ff'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004b5'::uuid, $$KSP-114$$, '00000000-2222-0000-0000-0000000004fa'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004b6'::uuid, $$KSP-092$$, '00000000-2222-0000-0000-0000000004e4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004b7'::uuid, $$KSP-113$$, '00000000-2222-0000-0000-0000000004f9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004b8'::uuid, $$KSP-101$$, '00000000-2222-0000-0000-0000000004ec'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004b9'::uuid, $$KSP-075$$, '00000000-2222-0000-0000-0000000004d4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004ba'::uuid, $$KSP-084$$, '00000000-2222-0000-0000-0000000004dc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004bb'::uuid, $$KSP-070$$, '00000000-2222-0000-0000-0000000004cf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004bc'::uuid, $$KSP-072$$, '00000000-2222-0000-0000-0000000004d1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004bd'::uuid, $$KSP-074$$, '00000000-2222-0000-0000-0000000004d3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004be'::uuid, $$KSP-082$$, '00000000-2222-0000-0000-0000000004da'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004bf'::uuid, $$KSP-095$$, '00000000-2222-0000-0000-0000000004e7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004c0'::uuid, $$KSP-106$$, '00000000-2222-0000-0000-0000000004f2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004c1'::uuid, $$KSP-085$$, '00000000-2222-0000-0000-0000000004dd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004c2'::uuid, $$KSP-094$$, '00000000-2222-0000-0000-0000000004e6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004c3'::uuid, $$KSP-108$$, '00000000-2222-0000-0000-0000000004f4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004c4'::uuid, $$KSP-109$$, '00000000-2222-0000-0000-0000000004f5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004c6'::uuid, $$KSP-123$$, '00000000-2222-0000-0000-000000000500'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004c7'::uuid, $$KSP-124$$, '00000000-2222-0000-0000-000000000501'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004c8'::uuid, $$KSP-088$$, '00000000-2222-0000-0000-0000000004e0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004c9'::uuid, $$KSP-087$$, '00000000-2222-0000-0000-0000000004df'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004ca'::uuid, $$TKD-013$$, '00000000-2222-0000-0000-000000000c1f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004cb'::uuid, $$TKD-012$$, '00000000-2222-0000-0000-000000000c1e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004cc'::uuid, $$TKD-015$$, '00000000-2222-0000-0000-000000000c20'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004cd'::uuid, $$TKD-003$$, '00000000-2222-0000-0000-000000000c16'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004ce'::uuid, $$TKD-004$$, '00000000-2222-0000-0000-000000000c17'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004cf'::uuid, $$TKD-017$$, '00000000-2222-0000-0000-000000000c22'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004d0'::uuid, $$TKD-001xx$$, '00000000-2222-0000-0000-000000000c14'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004d1'::uuid, $$TKD-007$$, '00000000-2222-0000-0000-000000000c1a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004d2'::uuid, $$TKD-008$$, '00000000-2222-0000-0000-000000000c1b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004d3'::uuid, $$TKD-005$$, '00000000-2222-0000-0000-000000000c18'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004d4'::uuid, $$TKD-010$$, '00000000-2222-0000-0000-000000000c1d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004d5'::uuid, $$TKD-002$$, '00000000-2222-0000-0000-000000000c15'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004d6'::uuid, $$TKD-016$$, '00000000-2222-0000-0000-000000000c21'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004d7'::uuid, $$TKD-Nonumbe$$, '00000000-2222-0000-0000-000000000c2a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004d8'::uuid, $$YSM-037$$, '00000000-2222-0000-0000-000000000daa'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004d9'::uuid, $$YSM-043$$, '00000000-2222-0000-0000-000000000db0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004da'::uuid, $$YSM-008$$, '00000000-2222-0000-0000-000000000d8e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004db'::uuid, $$YSM-036$$, '00000000-2222-0000-0000-000000000da9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004dc'::uuid, $$YSM-013$$, '00000000-2222-0000-0000-000000000d92'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004dd'::uuid, $$YSM-001$$, '00000000-2222-0000-0000-000000000d87'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004de'::uuid, $$YSM-040$$, '00000000-2222-0000-0000-000000000dad'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004df'::uuid, $$YSM-035$$, '00000000-2222-0000-0000-000000000da8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004e0'::uuid, $$YSM-022$$, '00000000-2222-0000-0000-000000000d9b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004e1'::uuid, $$YSM-025$$, '00000000-2222-0000-0000-000000000d9e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004e2'::uuid, $$YSM-020$$, '00000000-2222-0000-0000-000000000d99'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004e3'::uuid, $$YSM-023$$, '00000000-2222-0000-0000-000000000d9c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004e4'::uuid, $$YSM-016$$, '00000000-2222-0000-0000-000000000d95'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004e5'::uuid, $$YSM-021$$, '00000000-2222-0000-0000-000000000d9a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004e6'::uuid, $$YSM-019$$, '00000000-2222-0000-0000-000000000d98'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004e7'::uuid, $$YSM-031$$, '00000000-2222-0000-0000-000000000da4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004e8'::uuid, $$YSM-024$$, '00000000-2222-0000-0000-000000000d9d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004e9'::uuid, $$YSM-015$$, '00000000-2222-0000-0000-000000000d94'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004ea'::uuid, $$YSM-032$$, '00000000-2222-0000-0000-000000000da5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004eb'::uuid, $$YSM-038$$, '00000000-2222-0000-0000-000000000dab'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004ec'::uuid, $$YSM-017$$, '00000000-2222-0000-0000-000000000d96'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004ed'::uuid, $$YSM-039$$, '00000000-2222-0000-0000-000000000dac'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004ee'::uuid, $$YSM-033$$, '00000000-2222-0000-0000-000000000da6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004ef'::uuid, $$YSM-028$$, '00000000-2222-0000-0000-000000000da1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004f0'::uuid, $$YSM-030$$, '00000000-2222-0000-0000-000000000da3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004f1'::uuid, $$YSM-026$$, '00000000-2222-0000-0000-000000000d9f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004f2'::uuid, $$YSM-042$$, '00000000-2222-0000-0000-000000000daf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004f3'::uuid, $$YSM-045$$, '00000000-2222-0000-0000-000000000db2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004f4'::uuid, $$YSM-044$$, '00000000-2222-0000-0000-000000000db1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004f5'::uuid, $$YSM-029$$, '00000000-2222-0000-0000-000000000da2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004f6'::uuid, $$YSM-027$$, '00000000-2222-0000-0000-000000000da0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004f7'::uuid, $$YSM-018$$, '00000000-2222-0000-0000-000000000d97'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004f8'::uuid, $$SLK-120$$, '00000000-2222-0000-0000-00000000086e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004f9'::uuid, $$SLK-107$$, '00000000-2222-0000-0000-000000000864'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004fa'::uuid, $$SLK-118$$, '00000000-2222-0000-0000-00000000086c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004fb'::uuid, $$SLK-117$$, '00000000-2222-0000-0000-00000000086b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004fc'::uuid, $$SLK-103$$, '00000000-2222-0000-0000-000000000861'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004fd'::uuid, $$SLK-100$$, '00000000-2222-0000-0000-000000000860'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004fe'::uuid, $$SLK-NoNumber$$, '00000000-2222-0000-0000-000000000871'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000004ff'::uuid, $$SLK-112$$, '00000000-2222-0000-0000-000000000868'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000500'::uuid, $$SLK-130$$, '00000000-2222-0000-0000-000000000870'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000501'::uuid, $$SLK-108$$, '00000000-2222-0000-0000-000000000865'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000502'::uuid, $$SLK-114$$, '00000000-2222-0000-0000-00000000086a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000503'::uuid, $$SLK-105$$, '00000000-2222-0000-0000-000000000862'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000504'::uuid, $$LPS-011$$, '00000000-2222-0000-0000-000000000574'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000505'::uuid, $$LPS-009$$, '00000000-2222-0000-0000-000000000572'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000506'::uuid, $$LPS-007$$, '00000000-2222-0000-0000-000000000571'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000507'::uuid, $$LPS-022$$, '00000000-2222-0000-0000-00000000057b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000508'::uuid, $$LPS-010$$, '00000000-2222-0000-0000-000000000573'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000509'::uuid, $$LPS-003$$, '00000000-2222-0000-0000-00000000056e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000050a'::uuid, $$LPS-020$$, '00000000-2222-0000-0000-00000000057a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000050b'::uuid, $$LPS-006$$, '00000000-2222-0000-0000-000000000570'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000050c'::uuid, $$LPS-004$$, '00000000-2222-0000-0000-00000000056f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000050d'::uuid, $$LPS-015$$, '00000000-2222-0000-0000-000000000577'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000050e'::uuid, $$LPS-013$$, '00000000-2222-0000-0000-000000000576'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000050f'::uuid, $$LPS-012$$, '00000000-2222-0000-0000-000000000575'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000510'::uuid, $$LPS-016$$, '00000000-2222-0000-0000-000000000578'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000511'::uuid, $$LPS-001$$, '00000000-2222-0000-0000-00000000056c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000512'::uuid, $$TE-025$$, '00000000-2222-0000-0000-0000000009c7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000513'::uuid, $$TYK-003$$, '00000000-2222-0000-0000-000000000c90'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000515'::uuid, $$SWJ-009$$, '00000000-2222-0000-0000-00000000093e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000516'::uuid, $$TDS-004$$, '00000000-2222-0000-0000-000000000974'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000517'::uuid, $$SBK-001$$, '00000000-2222-0000-0000-0000000007e2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000518'::uuid, $$THP-001$$, '00000000-2222-0000-0000-000000000be8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000519'::uuid, $$TYK-001$$, '00000000-2222-0000-0000-000000000c8e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000051c'::uuid, $$WDS-001$$, '00000000-2222-0000-0000-000000000ca0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000051d'::uuid, $$WKE-002$$, '00000000-2222-0000-0000-000000000ca3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000051e'::uuid, $$MBM-002$$, '00000000-2222-0000-0000-000000000581'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000051f'::uuid, $$MOK-003$$, '00000000-2222-0000-0000-0000000005b6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000520'::uuid, $$MBM-007$$, '00000000-2222-0000-0000-000000000581'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000521'::uuid, $$MBM-006$$, '00000000-2222-0000-0000-000000000581'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000522'::uuid, $$MDS-004$$, '00000000-2222-0000-0000-00000000058b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000523'::uuid, $$KGP-001210x160$$, '00000000-2222-0000-0000-000000000416'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000524'::uuid, $$NHK-005D-R2$$, '00000000-2222-0000-0000-0000000006a1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000525'::uuid, $$THP-004210x160$$, '00000000-2222-0000-0000-000000000bed'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000526'::uuid, $$NoName-210x160$$, '00000000-2222-0000-0000-0000000006c5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000527'::uuid, $$THP-003210x160$$, '00000000-2222-0000-0000-000000000beb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000528'::uuid, $$NoName-015210x160$$, '00000000-2222-0000-0000-0000000006bf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000529'::uuid, $$SWS-001$$, '00000000-2222-0000-0000-000000000940'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000052a'::uuid, $$ADY-110$$, '00000000-2222-0000-0000-0000000000c7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000052b'::uuid, $$ADY-085$$, '00000000-2222-0000-0000-0000000000b1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000052c'::uuid, $$YCM-009$$, '00000000-2222-0000-0000-000000000cb7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000052d'::uuid, $$CST-005$$, '00000000-2222-0000-0000-0000000001b8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000052e'::uuid, $$YCM-001$$, '00000000-2222-0000-0000-000000000cb6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000052f'::uuid, $$ETS-019$$, '00000000-2222-0000-0000-0000000000e4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000530'::uuid, $$ETS-003$$, '00000000-2222-0000-0000-0000000000d5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000531'::uuid, $$ETS-026$$, '00000000-2222-0000-0000-0000000000ea'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000532'::uuid, $$ETS-035$$, '00000000-2222-0000-0000-0000000000f3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000533'::uuid, $$ETS-007$$, '00000000-2222-0000-0000-0000000000d9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000534'::uuid, $$ETS-030$$, '00000000-2222-0000-0000-0000000000ee'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000535'::uuid, $$ADY-098$$, '00000000-2222-0000-0000-0000000000bc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000536'::uuid, $$SWS-002$$, '00000000-2222-0000-0000-000000000941'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000537'::uuid, $$ADY-084$$, '00000000-2222-0000-0000-0000000000b0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000538'::uuid, $$YCM-031$$, '00000000-2222-0000-0000-000000000cc3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000539'::uuid, $$ADY-076$$, '00000000-2222-0000-0000-0000000000a5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000053a'::uuid, $$ADY-051$$, '00000000-2222-0000-0000-000000000094'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000053b'::uuid, $$MKG-003$$, '00000000-2222-0000-0000-00000000059a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000053c'::uuid, $$MKG-001$$, '00000000-2222-0000-0000-000000000598'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000053d'::uuid, $$ETS-020$$, '00000000-2222-0000-0000-0000000000e5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000053e'::uuid, $$ETS-025$$, '00000000-2222-0000-0000-0000000000e9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000053f'::uuid, $$ETS-034$$, '00000000-2222-0000-0000-0000000000f2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000540'::uuid, $$CST-003$$, '00000000-2222-0000-0000-0000000001b6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000541'::uuid, $$CST-004$$, '00000000-2222-0000-0000-0000000001b7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000543'::uuid, $$ADY-061$$, '00000000-2222-0000-0000-00000000009a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000544'::uuid, $$ADY-067$$, '00000000-2222-0000-0000-00000000009e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000545'::uuid, $$CST-007$$, '00000000-2222-0000-0000-0000000001b9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000546'::uuid, $$CST-001$$, '00000000-2222-0000-0000-0000000001b4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000547'::uuid, $$ADY-082$$, '00000000-2222-0000-0000-0000000000ad'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000548'::uuid, $$CST-009$$, '00000000-2222-0000-0000-0000000001ba'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000054a'::uuid, $$ETS-018$$, '00000000-2222-0000-0000-0000000000e3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000054c'::uuid, $$YCM-019$$, '00000000-2222-0000-0000-000000000cbb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000054d'::uuid, $$YCM-032$$, '00000000-2222-0000-0000-000000000cc4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000054e'::uuid, $$ADY-006$$, '00000000-2222-0000-0000-000000000093'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000054f'::uuid, $$ADY-081$$, '00000000-2222-0000-0000-0000000000ac'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000550'::uuid, $$ADY-092$$, '00000000-2222-0000-0000-0000000000b8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000551'::uuid, $$MKG-002$$, '00000000-2222-0000-0000-000000000599'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000553'::uuid, $$ETS-022$$, '00000000-2222-0000-0000-0000000000e7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000554'::uuid, $$ETS-033$$, '00000000-2222-0000-0000-0000000000f1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000556'::uuid, $$ETS-029$$, '00000000-2222-0000-0000-0000000000ed'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000557'::uuid, $$ETS-028$$, '00000000-2222-0000-0000-0000000000ec'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000558'::uuid, $$ETS-017$$, '00000000-2222-0000-0000-0000000000e2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000559'::uuid, $$ETS-031$$, '00000000-2222-0000-0000-0000000000ef'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000055a'::uuid, $$ETS-032$$, '00000000-2222-0000-0000-0000000000f0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000055b'::uuid, $$ETS-027$$, '00000000-2222-0000-0000-0000000000eb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000055c'::uuid, $$ETS-013$$, '00000000-2222-0000-0000-0000000000de'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000055d'::uuid, $$ETS-015$$, '00000000-2222-0000-0000-0000000000e0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000055e'::uuid, $$ETS-016$$, '00000000-2222-0000-0000-0000000000e1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000055f'::uuid, $$ETS-021$$, '00000000-2222-0000-0000-0000000000e6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000560'::uuid, $$ETS-006$$, '00000000-2222-0000-0000-0000000000d8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000561'::uuid, $$ETS-004$$, '00000000-2222-0000-0000-0000000000d6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000562'::uuid, $$ETS-005$$, '00000000-2222-0000-0000-0000000000d7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000563'::uuid, $$TE-0-022-9$$, '00000000-2222-0000-0000-000000000997'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000564'::uuid, $$TE-0-129-9$$, '00000000-2222-0000-0000-0000000009b0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000565'::uuid, $$TE-0-129-5$$, '00000000-2222-0000-0000-0000000009ad'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000566'::uuid, $$ETS-002$$, '00000000-2222-0000-0000-0000000000d4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000567'::uuid, $$ETS-008$$, '00000000-2222-0000-0000-0000000000da'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000568'::uuid, $$ETS-001$$, '00000000-2222-0000-0000-0000000000d3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000569'::uuid, $$ETS-024$$, '00000000-2222-0000-0000-0000000000e8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000056a'::uuid, $$ETS-009$$, '00000000-2222-0000-0000-0000000000db'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000056d'::uuid, $$ETS-014$$, '00000000-2222-0000-0000-0000000000df'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000056e'::uuid, $$TE-7-077-6$$, '00000000-2222-0000-0000-000000000b64'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000056f'::uuid, $$TE-5-065-1$$, '00000000-2222-0000-0000-000000000b1d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000570'::uuid, $$TE-6-129-4$$, '00000000-2222-0000-0000-000000000b46'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000571'::uuid, $$TE-6-129-7$$, '00000000-2222-0000-0000-000000000b48'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000572'::uuid, $$TE-9-143-6$$, '00000000-2222-0000-0000-000000000bbc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000573'::uuid, $$TE-8-076-5$$, '00000000-2222-0000-0000-000000000b87'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000574'::uuid, $$TE-6-059-8$$, '00000000-2222-0000-0000-000000000b38'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000575'::uuid, $$TE-6-059-9$$, '00000000-2222-0000-0000-000000000b39'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000576'::uuid, $$TE-5-069-0$$, '00000000-2222-0000-0000-000000000b1e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000577'::uuid, $$TE-7-141-5$$, '00000000-2222-0000-0000-000000000b79'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000578'::uuid, $$TE-7-130-3$$, '00000000-2222-0000-0000-000000000b72'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000579'::uuid, $$TE-5-129-5$$, '00000000-2222-0000-0000-000000000b28'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000057a'::uuid, $$TE-6-142-9AB$$, '00000000-2222-0000-0000-000000000b4b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000057b'::uuid, $$TE-9-077-5$$, '00000000-2222-0000-0000-000000000bac'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000057c'::uuid, $$TE-5-060-3$$, '00000000-2222-0000-0000-000000000b1b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000057d'::uuid, $$TE-9-142-6$$, '00000000-2222-0000-0000-000000000bbb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000057e'::uuid, $$TE-6-129-3$$, '00000000-2222-0000-0000-000000000b45'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000057f'::uuid, $$TE-8-103-9$$, '00000000-2222-0000-0000-000000000b8a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000580'::uuid, $$TE-5-110-7$$, '00000000-2222-0000-0000-000000000b21'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000581'::uuid, $$TE-5-069-4AB$$, '00000000-2222-0000-0000-000000000b1f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000582'::uuid, $$TE-7-135-5$$, '00000000-2222-0000-0000-000000000b78'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000583'::uuid, $$TE-6-129-5$$, '00000000-2222-0000-0000-000000000b47'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000584'::uuid, $$TE-5-130-0$$, '00000000-2222-0000-0000-000000000b2b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000585'::uuid, $$TE-5-129-8$$, '00000000-2222-0000-0000-000000000b2a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000586'::uuid, $$TE-2-129-4$$, '00000000-2222-0000-0000-000000000a4b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000587'::uuid, $$KRE-039$$, '00000000-2222-0000-0000-000000000476'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000588'::uuid, $$KRE-028$$, '00000000-2222-0000-0000-000000000469'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000589'::uuid, $$KRE-038$$, '00000000-2222-0000-0000-000000000474'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000058a'::uuid, $$KRE-03$$, '00000000-2222-0000-0000-00000000046b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000058b'::uuid, $$TE-4-125-4$$, '00000000-2222-0000-0000-000000000aef'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000058c'::uuid, $$KRE-029$$, '00000000-2222-0000-0000-00000000046a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000058d'::uuid, $$KRE-035$$, '00000000-2222-0000-0000-000000000470'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000058e'::uuid, $$KRE-018$$, '00000000-2222-0000-0000-000000000461'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000058f'::uuid, $$NRK-004$$, '00000000-2222-0000-0000-0000000006e3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000590'::uuid, $$KRE-033$$, '00000000-2222-0000-0000-00000000046e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000591'::uuid, $$KRE-027$$, '00000000-2222-0000-0000-000000000468'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000592'::uuid, $$TE-2-023-2$$, '00000000-2222-0000-0000-000000000a2d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000593'::uuid, $$KRE-016$$, '00000000-2222-0000-0000-000000000460'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000594'::uuid, $$NSK-013$$, '00000000-2222-0000-0000-00000000070b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000595'::uuid, $$KRE-021$$, '00000000-2222-0000-0000-000000000464'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000596'::uuid, $$NSK-011$$, '00000000-2222-0000-0000-000000000709'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000597'::uuid, $$NSK-008$$, '00000000-2222-0000-0000-000000000706'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000598'::uuid, $$TE-3-157-6(旧）$$, '00000000-2222-0000-0000-000000000ad1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000599'::uuid, $$TE-4-129-5$$, '00000000-2222-0000-0000-000000000af4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000059a'::uuid, $$NSK-003(NKS003?)$$, '00000000-2222-0000-0000-000000000702'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000059b'::uuid, $$TE-2-129-7$$, '00000000-2222-0000-0000-000000000a4e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000059c'::uuid, $$KRE-037-R1$$, '00000000-2222-0000-0000-000000000472'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000059d'::uuid, $$KRE-034$$, '00000000-2222-0000-0000-00000000046f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000059e'::uuid, $$NSK-012$$, '00000000-2222-0000-0000-00000000070a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000059f'::uuid, $$NSK-006$$, '00000000-2222-0000-0000-000000000704'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005a0'::uuid, $$KRE-010$$, '00000000-2222-0000-0000-00000000045c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005a1'::uuid, $$KRE-038-R1$$, '00000000-2222-0000-0000-000000000475'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005a2'::uuid, $$TE-2-129-6$$, '00000000-2222-0000-0000-000000000a4d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005a3'::uuid, $$KRE-036$$, '00000000-2222-0000-0000-000000000471'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005a4'::uuid, $$KRE-032$$, '00000000-2222-0000-0000-00000000046d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005a5'::uuid, $$TE-2-023-4$$, '00000000-2222-0000-0000-000000000a2e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005a6'::uuid, $$KRE-043$$, '00000000-2222-0000-0000-000000000477'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005a7'::uuid, $$KRE-044$$, '00000000-2222-0000-0000-000000000478'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005a8'::uuid, $$KRE-023$$, '00000000-2222-0000-0000-000000000465'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005a9'::uuid, $$KRE-037J$$, '00000000-2222-0000-0000-000000000473'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005aa'::uuid, $$NSK-014$$, '00000000-2222-0000-0000-00000000070c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005ab'::uuid, $$NSK-010$$, '00000000-2222-0000-0000-000000000708'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005ac'::uuid, $$NSK-007$$, '00000000-2222-0000-0000-000000000705'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005ae'::uuid, $$TH-056$$, '00000000-2222-0000-0000-0000000011ec'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005b0'::uuid, $$KRE-024$$, '00000000-2222-0000-0000-000000000466'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005b1'::uuid, $$KRE-026$$, '00000000-2222-0000-0000-000000000467'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005b3'::uuid, $$TE-0-159-4$$, '00000000-2222-0000-0000-0000000009bc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005b4'::uuid, $$TE-0-021-4$$, '00000000-2222-0000-0000-00000000098f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005b5'::uuid, $$TE-0-021-1$$, '00000000-2222-0000-0000-00000000098c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005b6'::uuid, $$TE-0-021-2$$, '00000000-2222-0000-0000-00000000098d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005b7'::uuid, $$KMX-006$$, '00000000-2222-0000-0000-000000000432'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005b8'::uuid, $$KMX-003$$, '00000000-2222-0000-0000-00000000042f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005b9'::uuid, $$TKS-018$$, '00000000-2222-0000-0000-000000000c3f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005ba'::uuid, $$TKS-017$$, '00000000-2222-0000-0000-000000000c3e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005bb'::uuid, $$TKS-013$$, '00000000-2222-0000-0000-000000000c3a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005bc'::uuid, $$TKS-014$$, '00000000-2222-0000-0000-000000000c3b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005bd'::uuid, $$TKS-015-R1$$, '00000000-2222-0000-0000-000000000c3c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005be'::uuid, $$TKS-016$$, '00000000-2222-0000-0000-000000000c3d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005bf'::uuid, $$TE-0-159-8$$, '00000000-2222-0000-0000-0000000009bd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005c0'::uuid, $$TE-8-156-7$$, '00000000-2222-0000-0000-000000000b99'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005c1'::uuid, $$TE-1-079-4$$, '00000000-2222-0000-0000-0000000009eb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005c2'::uuid, $$KMX-004-R1$$, '00000000-2222-0000-0000-000000000430'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005c3'::uuid, $$TE-1447069-4$$, '00000000-2222-0000-0000-000000000a25'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005c4'::uuid, $$TKS-009$$, '00000000-2222-0000-0000-000000000c36'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005c5'::uuid, $$TKS-008$$, '00000000-2222-0000-0000-000000000c35'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005c6'::uuid, $$TKS-011$$, '00000000-2222-0000-0000-000000000c38'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005c7'::uuid, $$TKS-012$$, '00000000-2222-0000-0000-000000000c39'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005c8'::uuid, $$TKS-010$$, '00000000-2222-0000-0000-000000000c37'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005c9'::uuid, $$TKS-007$$, '00000000-2222-0000-0000-000000000c34'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005ca'::uuid, $$TE-9-127-3$$, '00000000-2222-0000-0000-000000000bb2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005cb'::uuid, $$TE-0-108-6$$, '00000000-2222-0000-0000-0000000009a4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005cc'::uuid, $$TE-0-136-3$$, '00000000-2222-0000-0000-0000000009b3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005cd'::uuid, $$TE-0-136-4$$, '00000000-2222-0000-0000-0000000009b4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005ce'::uuid, $$TE-1-019-5$$, '00000000-2222-0000-0000-0000000009d2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005cf'::uuid, $$TE-1-108-7$$, '00000000-2222-0000-0000-0000000009ee'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005d0'::uuid, $$TE-0-019-7$$, '00000000-2222-0000-0000-000000000986'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005d1'::uuid, $$TE-1-019-8$$, '00000000-2222-0000-0000-0000000009d4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005d2'::uuid, $$TE-1-019-7$$, '00000000-2222-0000-0000-0000000009d3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005d3'::uuid, $$TE-1-019-4$$, '00000000-2222-0000-0000-0000000009d1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005d4'::uuid, $$TE-0-019-3$$, '00000000-2222-0000-0000-000000000983'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005d5'::uuid, $$TE-0-019-4$$, '00000000-2222-0000-0000-000000000984'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005d6'::uuid, $$TE-1-017-6$$, '00000000-2222-0000-0000-0000000009ca'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005d7'::uuid, $$NEC-013$$, '00000000-2222-0000-0000-000000000673'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005d9'::uuid, $$SPJ-047$$, '00000000-2222-0000-0000-0000000008c7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005da'::uuid, $$SPJ-034$$, '00000000-2222-0000-0000-0000000008c3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005db'::uuid, $$SPJ-046$$, '00000000-2222-0000-0000-0000000008c6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005dc'::uuid, $$NEC-011-BN1$$, '00000000-2222-0000-0000-000000000670'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005dd'::uuid, $$NEC-002-BN1$$, '00000000-2222-0000-0000-000000000664'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005de'::uuid, $$TE-5-052-1$$, '00000000-2222-0000-0000-000000000b14'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005df'::uuid, $$TP-02-0510$$, '00000000-2222-0000-0000-000000000c79'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005e0'::uuid, $$TBG-018PP$$, '00000000-2222-0000-0000-000000000960'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005e1'::uuid, $$SPJ-008$$, '00000000-2222-0000-0000-0000000008b9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005e2'::uuid, $$TE-6-062-5$$, '00000000-2222-0000-0000-000000000b3a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005e3'::uuid, $$SPJ-018$$, '00000000-2222-0000-0000-0000000008bc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005e4'::uuid, $$SPJ-019$$, '00000000-2222-0000-0000-0000000008bd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005e5'::uuid, $$SPJ-016$$, '00000000-2222-0000-0000-0000000008bb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005e6'::uuid, $$TMC-018$$, '00000000-2222-0000-0000-000000000c49'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005e7'::uuid, $$TMC-005$$, '00000000-2222-0000-0000-000000000c47'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005e8'::uuid, $$NRK-012$$, '00000000-2222-0000-0000-0000000006ea'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005e9'::uuid, $$NEC-007-R1$$, '00000000-2222-0000-0000-000000000667'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005ea'::uuid, $$NEC-010$$, '00000000-2222-0000-0000-00000000066f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005eb'::uuid, $$NEC-002-TN1$$, '00000000-2222-0000-0000-000000000665'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005ec'::uuid, $$NEC-009Bxx$$, '00000000-2222-0000-0000-00000000066b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005ed'::uuid, $$NEC-009-BN1$$, '00000000-2222-0000-0000-00000000066a'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005ee'::uuid, $$NEC-009T3$$, '00000000-2222-0000-0000-00000000066d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005ef'::uuid, $$NEC-011-TN1$$, '00000000-2222-0000-0000-000000000671'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005f0'::uuid, $$TMC-003$$, '00000000-2222-0000-0000-000000000c45'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005f1'::uuid, $$KSE-022-R1$$, '00000000-2222-0000-0000-00000000048e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005f2'::uuid, $$TMC-003-R1$$, '00000000-2222-0000-0000-000000000c46'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005f3'::uuid, $$TMC-001$$, '00000000-2222-0000-0000-000000000c42'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005f4'::uuid, $$TMC-018-R1$$, '00000000-2222-0000-0000-000000000c4a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005f5'::uuid, $$TMC-001-R1$$, '00000000-2222-0000-0000-000000000c43'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005f6'::uuid, $$NEC-014-R1$$, '00000000-2222-0000-0000-000000000674'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005f7'::uuid, $$NRK-034$$, '00000000-2222-0000-0000-0000000006f3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005f8'::uuid, $$NEC-008$$, '00000000-2222-0000-0000-000000000668'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005f9'::uuid, $$NEC-007$$, '00000000-2222-0000-0000-000000000666'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005fa'::uuid, $$NEC-009Txx$$, '00000000-2222-0000-0000-00000000066e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005fb'::uuid, $$NEC-009-TN1$$, '00000000-2222-0000-0000-00000000066c'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005fc'::uuid, $$NEC-012-BN1$$, '00000000-2222-0000-0000-000000000672'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005fd'::uuid, $$NEC-001-BN1$$, '00000000-2222-0000-0000-000000000662'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000005fe'::uuid, $$NEC-001-TN1$$, '00000000-2222-0000-0000-000000000663'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000600'::uuid, $$KSE-021$$, '00000000-2222-0000-0000-00000000048b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000601'::uuid, $$KSE-023$$, '00000000-2222-0000-0000-00000000048f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000602'::uuid, $$KSE-002$$, '00000000-2222-0000-0000-000000000480'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000603'::uuid, $$KSE-006$$, '00000000-2222-0000-0000-000000000482'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000604'::uuid, $$KSE-021B-TN1$$, '00000000-2222-0000-0000-00000000048c'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000605'::uuid, $$SPJ-040-BN1$$, '00000000-2222-0000-0000-0000000008c4'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000606'::uuid, $$SPJ-040-TN1$$, '00000000-2222-0000-0000-0000000008c5'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000607'::uuid, $$KSE-007$$, '00000000-2222-0000-0000-000000000483'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000608'::uuid, $$KSE-015$$, '00000000-2222-0000-0000-000000000486'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000609'::uuid, $$KSE-020$$, '00000000-2222-0000-0000-00000000048a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000060a'::uuid, $$STF-005$$, '00000000-2222-0000-0000-00000000092f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000060b'::uuid, $$STF-006$$, '00000000-2222-0000-0000-000000000930'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000060d'::uuid, $$EXD-018$$, '00000000-2222-0000-0000-0000000000fe'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000060f'::uuid, $$TE-025-54580$$, '00000000-2222-0000-0000-0000000009c8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000610'::uuid, $$TE-025-54581$$, '00000000-2222-0000-0000-0000000009c9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000612'::uuid, $$STF-003$$, '00000000-2222-0000-0000-00000000092d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000613'::uuid, $$SSK-006$$, '00000000-2222-0000-0000-0000000008e5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000614'::uuid, $$JAE-034PLUG$$, '00000000-2222-0000-0000-0000000002d5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000615'::uuid, $$TE-3-141-4$$, '00000000-2222-0000-0000-000000000acb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000616'::uuid, $$KDS-028$$, '00000000-2222-0000-0000-0000000003c0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000617'::uuid, $$KDS-041$$, '00000000-2222-0000-0000-0000000003c4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000618'::uuid, $$KDS-068$$, '00000000-2222-0000-0000-0000000003d3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000619'::uuid, $$KDS-024$$, '00000000-2222-0000-0000-0000000003bd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000061b'::uuid, $$KDS-030$$, '00000000-2222-0000-0000-0000000003c1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000061c'::uuid, $$KDS-039$$, '00000000-2222-0000-0000-0000000003c3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000061d'::uuid, $$KDS-069$$, '00000000-2222-0000-0000-0000000003d4'::uuid, 1, 1, NULL, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000061e'::uuid, $$TH-009$$, '00000000-2222-0000-0000-000000000bcf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000061f'::uuid, $$TH-018$$, '00000000-2222-0000-0000-0000000010bb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000620'::uuid, $$TH-028$$, '00000000-2222-0000-0000-000000000bd5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000621'::uuid, $$TH-032$$, '00000000-2222-0000-0000-000000000bd8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000622'::uuid, $$TH-015$$, '00000000-2222-0000-0000-000000000bd4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000626'::uuid, $$KDS-057$$, '00000000-2222-0000-0000-0000000003cd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000627'::uuid, $$KDS-079$$, '00000000-2222-0000-0000-0000000003da'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000628'::uuid, $$KDS-080$$, '00000000-2222-0000-0000-0000000003db'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000629'::uuid, $$KDS-067$$, '00000000-2222-0000-0000-0000000003d1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000062a'::uuid, $$KDS-060$$, '00000000-2222-0000-0000-0000000003ce'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000062b'::uuid, $$KDS-037$$, '00000000-2222-0000-0000-0000000003c2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000062d'::uuid, $$KDS-027$$, '00000000-2222-0000-0000-0000000003bf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000062e'::uuid, $$KDS-048$$, '00000000-2222-0000-0000-0000000003c7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000631'::uuid, $$KMX-002$$, '00000000-2222-0000-0000-00000000042e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000632'::uuid, $$KMX-005$$, '00000000-2222-0000-0000-000000000431'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000633'::uuid, $$GMY-095$$, '00000000-2222-0000-0000-000000000281'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000634'::uuid, $$TE-4-156-2$$, '00000000-2222-0000-0000-000000000aff'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000635'::uuid, $$TE-3-160-1$$, '00000000-2222-0000-0000-000000000ad4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000636'::uuid, $$TE-3-160-0(旧）$$, '00000000-2222-0000-0000-000000000ad3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000637'::uuid, $$NRK-042$$, '00000000-2222-0000-0000-0000000006f8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000638'::uuid, $$KDS-074$$, '00000000-2222-0000-0000-0000000003d8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000639'::uuid, $$KSE-005$$, '00000000-2222-0000-0000-000000000481'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000063a'::uuid, $$KSE--TN1$$, '00000000-2222-0000-0000-000000000491'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000063b'::uuid, $$KMX-001$$, '00000000-2222-0000-0000-00000000042d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000063c'::uuid, $$ETS-011$$, '00000000-2222-0000-0000-0000000000dc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000063d'::uuid, $$EXD-041$$, '00000000-2222-0000-0000-00000000010e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000640'::uuid, $$KSE-010$$, '00000000-2222-0000-0000-000000000485'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000641'::uuid, $$NRK-035$$, '00000000-2222-0000-0000-0000000006f2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000642'::uuid, $$TE-0-018-9$$, '00000000-2222-0000-0000-000000000982'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000643'::uuid, $$TE-0-018-1$$, '00000000-2222-0000-0000-000000000981'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000644'::uuid, $$TE-0-023-8$$, '00000000-2222-0000-0000-00000000099a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000645'::uuid, $$TE-0-079-4$$, '00000000-2222-0000-0000-0000000009a1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000646'::uuid, $$TE-1-022-7$$, '00000000-2222-0000-0000-0000000009df'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000647'::uuid, $$TE-1-108-6$$, '00000000-2222-0000-0000-0000000009ed'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000648'::uuid, $$TE-1-022-0$$, '00000000-2222-0000-0000-0000000009da'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000649'::uuid, $$TE-1-130-7$$, '00000000-2222-0000-0000-0000000009ff'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000064a'::uuid, $$TE-1279334-1$$, '00000000-2222-0000-0000-000000000a18'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000064b'::uuid, $$TE-1-141-0$$, '00000000-2222-0000-0000-000000000a02'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000064c'::uuid, $$TE-1-023-2$$, '00000000-2222-0000-0000-0000000009e1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000064d'::uuid, $$TE-1-022-5$$, '00000000-2222-0000-0000-0000000009de'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000064e'::uuid, $$TE-1-023-6$$, '00000000-2222-0000-0000-0000000009e2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000064f'::uuid, $$TE-1-018-1$$, '00000000-2222-0000-0000-0000000009cc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000650'::uuid, $$TE-1-018-3$$, '00000000-2222-0000-0000-0000000009ce'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000651'::uuid, $$TE-1-018-4$$, '00000000-2222-0000-0000-0000000009cf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000652'::uuid, $$TE-0-021-9$$, '00000000-2222-0000-0000-000000000993'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000653'::uuid, $$TE-1-129-9$$, '00000000-2222-0000-0000-0000000009fb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000654'::uuid, $$TE-0-021-6$$, '00000000-2222-0000-0000-000000000991'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000655'::uuid, $$TE-1-021-0$$, '00000000-2222-0000-0000-0000000009d9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000656'::uuid, $$TE-0-045-1$$, '00000000-2222-0000-0000-00000000099c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000658'::uuid, $$TE-0-072-2$$, '00000000-2222-0000-0000-00000000099f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000659'::uuid, $$TE-0-128-1$$, '00000000-2222-0000-0000-0000000009ab'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000065a'::uuid, $$TE-0-023-3$$, '00000000-2222-0000-0000-000000000999'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000065b'::uuid, $$TE-1-022-4$$, '00000000-2222-0000-0000-0000000009dd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000065c'::uuid, $$TE-0-130-9$$, '00000000-2222-0000-0000-0000000009b2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000065d'::uuid, $$TE-1-018-0$$, '00000000-2222-0000-0000-0000000009cb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000065f'::uuid, $$TE-1-018-2$$, '00000000-2222-0000-0000-0000000009cd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000660'::uuid, $$TE-2-130-1$$, '00000000-2222-0000-0000-000000000a50'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000661'::uuid, $$TE-2-108-1$$, '00000000-2222-0000-0000-000000000a40'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000662'::uuid, $$TE-3-130-6$$, '00000000-2222-0000-0000-000000000aca'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000663'::uuid, $$TE-3-130-1$$, '00000000-2222-0000-0000-000000000ac8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000664'::uuid, $$TE-3-108-0$$, '00000000-2222-0000-0000-000000000abf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000665'::uuid, $$TE-2-129-5$$, '00000000-2222-0000-0000-000000000a4c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000666'::uuid, $$TE-2-108-0$$, '00000000-2222-0000-0000-000000000a3f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000667'::uuid, $$TE-2-130-4$$, '00000000-2222-0000-0000-000000000a53'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000668'::uuid, $$TE-4-130-3$$, '00000000-2222-0000-0000-000000000af7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000669'::uuid, $$TE-2-108-2$$, '00000000-2222-0000-0000-000000000a41'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000066a'::uuid, $$TE-2-130-7$$, '00000000-2222-0000-0000-000000000a55'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000066b'::uuid, $$TE-2-130-0$$, '00000000-2222-0000-0000-000000000a4f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000066c'::uuid, $$TE-4-141-7$$, '00000000-2222-0000-0000-000000000afb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000066d'::uuid, $$TE-4-130-4$$, '00000000-2222-0000-0000-000000000af8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000066e'::uuid, $$TE-4-130-2$$, '00000000-2222-0000-0000-000000000af6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000066f'::uuid, $$TE-2-110-5$$, '00000000-2222-0000-0000-000000000a45'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000670'::uuid, $$TE-2-156-8$$, '00000000-2222-0000-0000-000000000a5b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000671'::uuid, $$TE-2-130-2$$, '00000000-2222-0000-0000-000000000a51'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000672'::uuid, $$TE-2-108-7$$, '00000000-2222-0000-0000-000000000a42'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000673'::uuid, $$TE-2-130-3$$, '00000000-2222-0000-0000-000000000a52'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000674'::uuid, $$TE-2-130-6$$, '00000000-2222-0000-0000-000000000a54'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000675'::uuid, $$TE-2-130-8$$, '00000000-2222-0000-0000-000000000a56'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000676'::uuid, $$TE-3-130-2$$, '00000000-2222-0000-0000-000000000ac9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000677'::uuid, $$TE-4-130-6$$, '00000000-2222-0000-0000-000000000afa'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000678'::uuid, $$YSM-004$$, '00000000-2222-0000-0000-000000000d8a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000067a'::uuid, $$YSM-005$$, '00000000-2222-0000-0000-000000000d8b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000067b'::uuid, $$YSM-007$$, '00000000-2222-0000-0000-000000000d8d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000067c'::uuid, $$YSM-002$$, '00000000-2222-0000-0000-000000000d88'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000067d'::uuid, $$YSM-011$$, '00000000-2222-0000-0000-000000000d91'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000067e'::uuid, $$YSM-014$$, '00000000-2222-0000-0000-000000000d93'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000067f'::uuid, $$YSM-003$$, '00000000-2222-0000-0000-000000000d89'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000680'::uuid, $$YSM-009$$, '00000000-2222-0000-0000-000000000d8f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000681'::uuid, $$TE-2-023-7$$, '00000000-2222-0000-0000-000000000a2f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000682'::uuid, $$TE-3-129-1$$, '00000000-2222-0000-0000-000000000ac6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000683'::uuid, $$TE-3-023-7$$, '00000000-2222-0000-0000-000000000ab0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000684'::uuid, $$TE-3-023-4-R2$$, '00000000-2222-0000-0000-000000000aaf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000685'::uuid, $$TE-3-079-7$$, '00000000-2222-0000-0000-000000000abe'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000686'::uuid, $$TE-3-129-0$$, '00000000-2222-0000-0000-000000000ac5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000688'::uuid, $$TE-3-023-1-R1$$, '00000000-2222-0000-0000-000000000aac'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000689'::uuid, $$TE-2-130-9$$, '00000000-2222-0000-0000-000000000a57'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000068a'::uuid, $$YSM-010$$, '00000000-2222-0000-0000-000000000d90'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000068b'::uuid, $$YSM-006$$, '00000000-2222-0000-0000-000000000d8c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000068c'::uuid, $$TE-1-129-2$$, '00000000-2222-0000-0000-0000000009f9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000068d'::uuid, $$TE-3-023-1-R2$$, '00000000-2222-0000-0000-000000000aad'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000068e'::uuid, $$TE-3-023-3$$, '00000000-2222-0000-0000-000000000aae'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000068f'::uuid, $$TE-8-077-1$$, '00000000-2222-0000-0000-000000000b88'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000690'::uuid, $$TE-7-057-1$$, '00000000-2222-0000-0000-000000000b5d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000691'::uuid, $$TE-7-127-8-R6$$, '00000000-2222-0000-0000-000000000b6f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000692'::uuid, $$TE-6-075-4$$, '00000000-2222-0000-0000-000000000b3d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000693'::uuid, $$OOT-015$$, '00000000-2222-0000-0000-00000000075b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000694'::uuid, $$NSK-002$$, '00000000-2222-0000-0000-000000000701'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000695'::uuid, $$TE-7-141-6$$, '00000000-2222-0000-0000-000000000b7a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000696'::uuid, $$TE-7-073-9$$, '00000000-2222-0000-0000-000000000b61'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000697'::uuid, $$TE-7-079-0$$, '00000000-2222-0000-0000-000000000b65'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000698'::uuid, $$TE-9-077-2$$, '00000000-2222-0000-0000-000000000bab'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000699'::uuid, $$TE-5-075-8$$, '00000000-2222-0000-0000-000000000b20'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000069a'::uuid, $$TE-8-129-8$$, '00000000-2222-0000-0000-000000000b93'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000069b'::uuid, $$TE-5-129-1$$, '00000000-2222-0000-0000-000000000b27'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000069c'::uuid, $$TE-2-023-0$$, '00000000-2222-0000-0000-000000000a2b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000069d'::uuid, $$TE-0-023-1$$, '00000000-2222-0000-0000-000000000998'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000069e'::uuid, $$TE-0-022-1$$, '00000000-2222-0000-0000-000000000994'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000069f'::uuid, $$TE-0-129-8$$, '00000000-2222-0000-0000-0000000009af'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006a0'::uuid, $$TE-1-022-3$$, '00000000-2222-0000-0000-0000000009dc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006a1'::uuid, $$TE-1-130-9$$, '00000000-2222-0000-0000-000000000a01'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006a2'::uuid, $$TE-1-022-1$$, '00000000-2222-0000-0000-0000000009db'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006a3'::uuid, $$TE-0-022-3$$, '00000000-2222-0000-0000-000000000995'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006a4'::uuid, $$TE-8-156-7-R1$$, '00000000-2222-0000-0000-000000000b9a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006a5'::uuid, $$TE-1-022-8$$, '00000000-2222-0000-0000-0000000009e0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006a6'::uuid, $$TE-1-108-9$$, '00000000-2222-0000-0000-0000000009ef'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006a7'::uuid, $$TE-0-108-5$$, '00000000-2222-0000-0000-0000000009a3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006a8'::uuid, $$TE-0-108-2$$, '00000000-2222-0000-0000-0000000009a2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006a9'::uuid, $$TE-0-022-7$$, '00000000-2222-0000-0000-000000000996'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006ab'::uuid, $$TE-1-130-5$$, '00000000-2222-0000-0000-0000000009fe'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006ac'::uuid, $$TE-0-127-1$$, '00000000-2222-0000-0000-0000000009a6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006ad'::uuid, $$TE-0-021-3$$, '00000000-2222-0000-0000-00000000098e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006ae'::uuid, $$TE-0-128-2$$, '00000000-2222-0000-0000-0000000009ac'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006af'::uuid, $$TE-0-021-5$$, '00000000-2222-0000-0000-000000000990'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006c3'::uuid, $$TH-011$$, '00000000-2222-0000-0000-000000000bd1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006c4'::uuid, $$TH-031$$, '00000000-2222-0000-0000-000000000bd7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006c5'::uuid, $$DIC-019$$, '00000000-2222-0000-0000-0000000001d1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006c6'::uuid, $$OTAX-005$$, '00000000-2222-0000-0000-000000000781'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006c7'::uuid, $$OTAX-017$$, '00000000-2222-0000-0000-00000000078b'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006c8'::uuid, $$OTAX-002$$, '00000000-2222-0000-0000-00000000077e'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006c9'::uuid, $$OTAX-010$$, '00000000-2222-0000-0000-000000000786'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006ca'::uuid, $$OTAX-018$$, '00000000-2222-0000-0000-00000000078c'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006cb'::uuid, $$OTAX-009$$, '00000000-2222-0000-0000-000000000785'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006cc'::uuid, $$OTAX-001$$, '00000000-2222-0000-0000-00000000077d'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006cd'::uuid, $$OTAX-003$$, '00000000-2222-0000-0000-00000000077f'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006ce'::uuid, $$OTAX-007$$, '00000000-2222-0000-0000-000000000783'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006cf'::uuid, $$OTAX-006$$, '00000000-2222-0000-0000-000000000782'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006d0'::uuid, $$OTAX-013$$, '00000000-2222-0000-0000-000000000787'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006d1'::uuid, $$OTAX-008$$, '00000000-2222-0000-0000-000000000784'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006d2'::uuid, $$TNX-0133面$$, '00000000-2222-0000-0000-000000000c58'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006d3'::uuid, $$TE-2-162-42022.11.14$$, '00000000-2222-0000-0000-000000000a60'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006d4'::uuid, $$KSP-021$$, '00000000-2222-0000-0000-0000000004a6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006d5'::uuid, $$KSP-018$$, '00000000-2222-0000-0000-0000000004a1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006d6'::uuid, $$KSP-026$$, '00000000-2222-0000-0000-0000000004ab'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006d7'::uuid, $$KSP-133$$, '00000000-2222-0000-0000-000000000505'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006d8'::uuid, $$OTAX-004$$, '00000000-2222-0000-0000-000000000780'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006d9'::uuid, $$KSP-030$$, '00000000-2222-0000-0000-0000000004b0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006da'::uuid, $$KSP-025$$, '00000000-2222-0000-0000-0000000004aa'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006db'::uuid, $$KSP-036$$, '00000000-2222-0000-0000-0000000004b6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006dc'::uuid, $$KSP-033$$, '00000000-2222-0000-0000-0000000004b3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006dd'::uuid, $$KSP-027$$, '00000000-2222-0000-0000-0000000004ae'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006de'::uuid, $$DIC-047$$, '00000000-2222-0000-0000-0000000001e2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006df'::uuid, $$DIC-048$$, '00000000-2222-0000-0000-0000000001e3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006e0'::uuid, $$KSP-029$$, '00000000-2222-0000-0000-0000000004af'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006e1'::uuid, $$KSP-011$$, '00000000-2222-0000-0000-00000000049a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006e2'::uuid, $$KSP-012$$, '00000000-2222-0000-0000-00000000049b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006e3'::uuid, $$KSP-099$$, '00000000-2222-0000-0000-0000000004eb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006e4'::uuid, $$KSP-031$$, '00000000-2222-0000-0000-0000000004b1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006e5'::uuid, $$KSP-017$$, '00000000-2222-0000-0000-0000000004a0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006e6'::uuid, $$KSP-014$$, '00000000-2222-0000-0000-00000000049d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006e7'::uuid, $$KSP-035$$, '00000000-2222-0000-0000-0000000004b5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006e8'::uuid, $$SPJ-014$$, '00000000-2222-0000-0000-0000000008ba'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006e9'::uuid, $$TE-2-023-8$$, '00000000-2222-0000-0000-000000000a30'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006ea'::uuid, $$TE-4-157-3$$, '00000000-2222-0000-0000-000000000b01'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006ec'::uuid, $$TE-5-141-0$$, '00000000-2222-0000-0000-000000000b2d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006ed'::uuid, $$TE-4-159-6$$, '00000000-2222-0000-0000-000000000b08'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006ee'::uuid, $$TE-3-054-5$$, '00000000-2222-0000-0000-000000000ab4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006ef'::uuid, $$TE-3-157-3$$, '00000000-2222-0000-0000-000000000ad0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006f1'::uuid, $$TE-4-159-7$$, '00000000-2222-0000-0000-000000000b09'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006f2'::uuid, $$TE-4-159-4$$, '00000000-2222-0000-0000-000000000b06'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000006f4'::uuid, $$TE-4-159-3$$, '00000000-2222-0000-0000-000000000b05'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000708'::uuid, $$YGE-001$$, '00000000-2222-0000-0000-000000000cf5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000070a'::uuid, $$MPL-001$$, '00000000-2222-0000-0000-0000000005b7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000070b'::uuid, $$YCM-043$$, '00000000-2222-0000-0000-000000000ccf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000070c'::uuid, $$SSM-054-R5$$, '00000000-2222-0000-0000-00000000091f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000070d'::uuid, $$MZT-103$$, '00000000-2222-0000-0000-00000000063a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000070f'::uuid, $$SSJ-014$$, '00000000-2222-0000-0000-0000000008da'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000710'::uuid, $$SSJ-016$$, '00000000-2222-0000-0000-0000000008dc'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000711'::uuid, $$SSJ-018$$, '00000000-2222-0000-0000-0000000008de'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000712'::uuid, $$ATS-026$$, '00000000-2222-0000-0000-000000000182'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000713'::uuid, $$TE-7-050-8$$, '00000000-2222-0000-0000-000000000b5c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000715'::uuid, $$MZT-NoName$$, '00000000-2222-0000-0000-00000000065c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000716'::uuid, $$TE-3-052-7$$, '00000000-2222-0000-0000-000000000ab3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000071a'::uuid, $$SEKYW-0006-1$$, '00000000-2222-0000-0000-0000000007eb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000071b'::uuid, $$MZT-102$$, '00000000-2222-0000-0000-000000000639'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000071c'::uuid, $$ORM-003$$, '00000000-2222-0000-0000-000000000778'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000071e'::uuid, $$YMS-001$$, '00000000-2222-0000-0000-000000000d06'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000071f'::uuid, $$DIC-091?$$, '00000000-2222-0000-0000-000000000203'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000720'::uuid, $$DIC-036$$, '00000000-2222-0000-0000-0000000001d9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000721'::uuid, $$TE-3-161-8$$, '00000000-2222-0000-0000-000000000add'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000722'::uuid, $$TE-3-161-8-N2$$, '00000000-2222-0000-0000-000000000add'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000723'::uuid, $$DIM-014$$, '00000000-2222-0000-0000-000000000248'::uuid, 1, 1, NULL, $$2.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000724'::uuid, $$JAE-289-R2$$, '00000000-2222-0000-0000-000000000387'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000725'::uuid, $$SSM-034S$$, '00000000-2222-0000-0000-000000000904'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000726'::uuid, $$STF-007$$, '00000000-2222-0000-0000-000000000931'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000727'::uuid, $$STF-002$$, '00000000-2222-0000-0000-00000000092c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000728'::uuid, $$YKW-002$$, '00000000-2222-0000-0000-000000000cfd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000729'::uuid, $$NoName-405x?SSJ?$$, '00000000-2222-0000-0000-0000000006ca'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000072a'::uuid, $$NoName-405x?$$, '00000000-2222-0000-0000-0000000006c9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000072b'::uuid, $$PNS-010-R3$$, '00000000-2222-0000-0000-0000000007ba'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000072d'::uuid, $$TES-002$$, '00000000-2222-0000-0000-000000000bcf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000072e'::uuid, $$KGM-002$$, '00000000-2222-0000-0000-00000000040f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000072f'::uuid, $$NoName-299x?$$, '00000000-2222-0000-0000-0000000006c6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000730'::uuid, $$TE-4-161-0-N3$$, '00000000-2222-0000-0000-000000000b0d'::uuid, 1, 3, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000731'::uuid, $$TE-4-161-0$$, '00000000-2222-0000-0000-000000000b0d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000732'::uuid, $$TE-4-161-0-N2$$, '00000000-2222-0000-0000-000000000b0d'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000733'::uuid, $$TE-4-161-2$$, '00000000-2222-0000-0000-000000000b0f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000734'::uuid, $$SZT-004$$, '00000000-2222-0000-0000-000000000948'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000735'::uuid, $$YSD-001-N2$$, '00000000-2222-0000-0000-000000000d27'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000736'::uuid, $$YSD-001-N3$$, '00000000-2222-0000-0000-000000000d27'::uuid, 1, 3, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000738'::uuid, $$NKP-002$$, '00000000-2222-0000-0000-0000000006b1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000739'::uuid, $$NKP-002-N2$$, '00000000-2222-0000-0000-0000000006b1'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000073a'::uuid, $$NSM-001$$, '00000000-2222-0000-0000-00000000070f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000073b'::uuid, $$NSM-001-N2$$, '00000000-2222-0000-0000-00000000070f'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000073c'::uuid, $$PNS-010$$, '00000000-2222-0000-0000-0000000007b9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000073d'::uuid, $$JAE-007$$, '00000000-2222-0000-0000-0000000002c6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000073e'::uuid, $$JAE-008$$, '00000000-2222-0000-0000-0000000002c7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000073f'::uuid, $$DIM-011$$, '00000000-2222-0000-0000-000000000245'::uuid, 1, 1, NULL, $$2.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000740'::uuid, $$JAE-220-R1$$, '00000000-2222-0000-0000-000000000346'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000741'::uuid, $$JAE-220-R1-N2$$, '00000000-2222-0000-0000-000000000346'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000742'::uuid, $$TE-4-161-2-N2$$, '00000000-2222-0000-0000-000000000b0f'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000743'::uuid, $$DIM-012$$, '00000000-2222-0000-0000-000000000246'::uuid, 1, 1, NULL, $$2.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000744'::uuid, $$SSK-008$$, '00000000-2222-0000-0000-0000000008e7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000747'::uuid, $$DIC-092$$, '00000000-2222-0000-0000-000000000204'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000748'::uuid, $$JAE-147$$, '00000000-2222-0000-0000-00000000030b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000074a'::uuid, $$JAE-158$$, '00000000-2222-0000-0000-000000000314'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000074b'::uuid, $$JAE-155$$, '00000000-2222-0000-0000-000000000311'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000074c'::uuid, $$JAE-156$$, '00000000-2222-0000-0000-000000000312'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000074d'::uuid, $$JAE-157$$, '00000000-2222-0000-0000-000000000313'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000074e'::uuid, $$JAE-148$$, '00000000-2222-0000-0000-00000000030c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000752'::uuid, $$KGM-001$$, '00000000-2222-0000-0000-00000000040e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000753'::uuid, $$SSK-002$$, '00000000-2222-0000-0000-0000000008e1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000754'::uuid, $$NKP-001$$, '00000000-2222-0000-0000-0000000006b0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000756'::uuid, $$YNK-007$$, '00000000-2222-0000-0000-000000000d1c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000759'::uuid, $$OGS-004$$, '00000000-2222-0000-0000-000000000745'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000075d'::uuid, $$ATS-020$$, '00000000-2222-0000-0000-00000000017d'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000075e'::uuid, $$MZT-083$$, '00000000-2222-0000-0000-00000000062d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000075f'::uuid, $$MZT-082$$, '00000000-2222-0000-0000-00000000062c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000760'::uuid, $$MZT-105$$, '00000000-2222-0000-0000-00000000063b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000761'::uuid, $$JAE-211-R1$$, '00000000-2222-0000-0000-00000000033f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000763'::uuid, $$MZT-080$$, '00000000-2222-0000-0000-00000000062a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000764'::uuid, $$TE-3-161-7$$, '00000000-2222-0000-0000-000000000adc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000765'::uuid, $$NoName-ストッパー$$, '00000000-2222-0000-0000-0000000006d3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000766'::uuid, $$NoName-ダウンライト枠通箱トレイ$$, '00000000-2222-0000-0000-0000000006d4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000768'::uuid, $$TE-5-052-0$$, '00000000-2222-0000-0000-000000000b13'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000076a'::uuid, $$YKW-006$$, '00000000-2222-0000-0000-000000000d01'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000076b'::uuid, $$MZT-078$$, '00000000-2222-0000-0000-000000000628'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000076c'::uuid, $$YKW-004$$, '00000000-2222-0000-0000-000000000cff'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000076d'::uuid, $$SJI-019$$, '00000000-2222-0000-0000-000000000826'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000076e'::uuid, $$SJI-020$$, '00000000-2222-0000-0000-000000000827'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000076f'::uuid, $$NoName-SSJ?$$, '00000000-2222-0000-0000-0000000006d2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000770'::uuid, $$DIM-017$$, '00000000-2222-0000-0000-00000000024b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000771'::uuid, $$DIM-015$$, '00000000-2222-0000-0000-000000000249'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000772'::uuid, $$TPS-001$$, '00000000-2222-0000-0000-000000000c7a'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000773'::uuid, $$TE-1-096-2$$, '00000000-2222-0000-0000-0000000009ec'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000774'::uuid, $$TE-9-098-8$$, '00000000-2222-0000-0000-000000000bb0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000775'::uuid, $$TE-1-074-8$$, '00000000-2222-0000-0000-0000000009e9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000779'::uuid, $$TE-7-050-7$$, '00000000-2222-0000-0000-000000000b5b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000077a'::uuid, $$TE-1-162-3$$, '00000000-2222-0000-0000-000000000a13'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000077b'::uuid, $$RCH-002$$, '00000000-2222-0000-0000-0000000007c7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000077c'::uuid, $$TPS-002$$, '00000000-2222-0000-0000-000000000c7b'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000077d'::uuid, $$TE-3-161-6$$, '00000000-2222-0000-0000-000000000adb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000077e'::uuid, $$TE-3-161-6-N2$$, '00000000-2222-0000-0000-000000000adb'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000077f'::uuid, $$TE-3-161-6-N3$$, '00000000-2222-0000-0000-000000000adb'::uuid, 1, 3, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000780'::uuid, $$SSK-005$$, '00000000-2222-0000-0000-0000000008e4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000781'::uuid, $$NoName-D?$$, '00000000-2222-0000-0000-0000000006cf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000783'::uuid, $$SSK-004$$, '00000000-2222-0000-0000-0000000008e3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000785'::uuid, $$SSK-003$$, '00000000-2222-0000-0000-0000000008e2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000786'::uuid, $$YKW-008$$, '00000000-2222-0000-0000-000000000d04'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000787'::uuid, $$MYS-003$$, '00000000-2222-0000-0000-00000000060c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000788'::uuid, $$DIM-007$$, '00000000-2222-0000-0000-000000000241'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000789'::uuid, $$DIM-006$$, '00000000-2222-0000-0000-000000000240'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000078a'::uuid, $$DIM-008$$, '00000000-2222-0000-0000-000000000242'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000078b'::uuid, $$DIM-009$$, '00000000-2222-0000-0000-000000000243'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000078d'::uuid, $$ARK-001-N2$$, '00000000-2222-0000-0000-000000000161'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000078f'::uuid, $$CL-001$$, '00000000-2222-0000-0000-0000000001a7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000790'::uuid, $$NoName-570x380x(35)$$, '00000000-2222-0000-0000-0000000006ce'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000792'::uuid, $$ARK-002-N2$$, '00000000-2222-0000-0000-000000000162'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000793'::uuid, $$NoName-385x265x(40)$$, '00000000-2222-0000-0000-0000000006c8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000794'::uuid, $$TOW-001$$, '00000000-2222-0000-0000-000000000c76'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000795'::uuid, $$YCM-028$$, '00000000-2222-0000-0000-000000000cc1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000797'::uuid, $$TJS-003$$, '00000000-2222-0000-0000-000000000c10'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000799'::uuid, $$CSM-001$$, '00000000-2222-0000-0000-0000000001b3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000079a'::uuid, $$NoName-540x420x(40)$$, '00000000-2222-0000-0000-0000000006cd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000079c'::uuid, $$JAE-132$$, '00000000-2222-0000-0000-000000000304'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000079e'::uuid, $$TIH-013$$, '00000000-2222-0000-0000-000000000bff'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000079f'::uuid, $$SZT-002$$, '00000000-2222-0000-0000-000000000944'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007a0'::uuid, $$OOT-025$$, '00000000-2222-0000-0000-000000000764'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007a2'::uuid, $$STP-001$$, '00000000-2222-0000-0000-000000000939'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007a3'::uuid, $$ALP-002$$, '00000000-2222-0000-0000-000000000138'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007a4'::uuid, $$JAE-223-R3$$, '00000000-2222-0000-0000-000000000349'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007a5'::uuid, $$JAE-225$$, '00000000-2222-0000-0000-00000000034b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007a6'::uuid, $$JAE-227-R2$$, '00000000-2222-0000-0000-00000000034d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007a8'::uuid, $$JAE-113-R874H$$, '00000000-2222-0000-0000-0000000002f7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007a9'::uuid, $$NoName-200x560$$, '00000000-2222-0000-0000-0000000006c4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007aa'::uuid, $$SZT-007-BN1$$, '00000000-2222-0000-0000-00000000094a'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007ac'::uuid, $$YOK-003$$, '00000000-2222-0000-0000-000000000d1f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007ae'::uuid, $$TE-8-135-1$$, '00000000-2222-0000-0000-000000000b96'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007af'::uuid, $$TE-7-162-1$$, '00000000-2222-0000-0000-000000000b7e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007b0'::uuid, $$TE-003$$, '00000000-2222-0000-0000-00000000099b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007b1'::uuid, $$NoName-M-S->385x265$$, '00000000-2222-0000-0000-0000000006d0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007b2'::uuid, $$RCH-002-N2$$, '00000000-2222-0000-0000-0000000007c7'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007b3'::uuid, $$NoName-200x$$, '00000000-2222-0000-0000-0000000006c3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007b4'::uuid, $$TE-912160-6$$, '00000000-2222-0000-0000-000000000bb1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007b5'::uuid, $$NoName-175x340$$, '00000000-2222-0000-0000-0000000006c2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007b6'::uuid, $$TE-7-127-2$$, '00000000-2222-0000-0000-000000000b67'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007b7'::uuid, $$NoName-147x$$, '00000000-2222-0000-0000-0000000006c1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007b8'::uuid, $$STD-004$$, '00000000-2222-0000-0000-000000000926'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007bc'::uuid, $$NPK-test?$$, '00000000-2222-0000-0000-0000000006dd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007c0'::uuid, $$TE-9-079-0$$, '00000000-2222-0000-0000-000000000bad'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007c1'::uuid, $$JAE-267$$, '00000000-2222-0000-0000-000000000372'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007c2'::uuid, $$JAE-208-R3$$, '00000000-2222-0000-0000-00000000033c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007c3'::uuid, $$DIM-005$$, '00000000-2222-0000-0000-00000000023f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007c4'::uuid, $$TOK-018$$, '00000000-2222-0000-0000-000000000c75'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007c5'::uuid, $$MZT-113$$, '00000000-2222-0000-0000-000000000645'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007c6'::uuid, $$TIH-001-N2$$, '00000000-2222-0000-0000-000000000bf2'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007c7'::uuid, $$K-23$$, '00000000-2222-0000-0000-0000000003b4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007c8'::uuid, $$TOK-008$$, '00000000-2222-0000-0000-000000000c69'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007c9'::uuid, $$TOK-005$$, '00000000-2222-0000-0000-000000000c66'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007ca'::uuid, $$MZT-118$$, '00000000-2222-0000-0000-00000000064a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007cb'::uuid, $$MZT-114$$, '00000000-2222-0000-0000-000000000646'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007cc'::uuid, $$MZT-117$$, '00000000-2222-0000-0000-000000000649'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007cd'::uuid, $$TE-9-072-1$$, '00000000-2222-0000-0000-000000000baa'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007ce'::uuid, $$TE-9-062-0$$, '00000000-2222-0000-0000-000000000ba9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007cf'::uuid, $$TE-9-130-0$$, '00000000-2222-0000-0000-000000000bb8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007d0'::uuid, $$TE-9-129-6$$, '00000000-2222-0000-0000-000000000bb7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007d1'::uuid, $$TE-8-110-9$$, '00000000-2222-0000-0000-000000000b8b'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007d2'::uuid, $$TE-97-25175$$, '00000000-2222-0000-0000-000000000bc6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007d3'::uuid, $$TE-9-079-4$$, '00000000-2222-0000-0000-000000000baf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007d4'::uuid, $$TE-9-142-0$$, '00000000-2222-0000-0000-000000000bba'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007d5'::uuid, $$TE-9-079-3$$, '00000000-2222-0000-0000-000000000bae'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007d6'::uuid, $$TE-8-127-4$$, '00000000-2222-0000-0000-000000000b8f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007d7'::uuid, $$TE-8-050-2$$, '00000000-2222-0000-0000-000000000b81'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007da'::uuid, $$DIS-001$$, '00000000-2222-0000-0000-000000000250'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007db'::uuid, $$TE-9-156-1-R1$$, '00000000-2222-0000-0000-000000000bbd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007dc'::uuid, $$TOK-009$$, '00000000-2222-0000-0000-000000000c6a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007dd'::uuid, $$TE-9-127-8$$, '00000000-2222-0000-0000-000000000bb4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007de'::uuid, $$ODS-042$$, '00000000-2222-0000-0000-000000000732'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007df'::uuid, $$SMK-183$$, '00000000-2222-0000-0000-000000000895'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007e0'::uuid, $$TE-7-069-9$$, '00000000-2222-0000-0000-000000000b60'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007e1'::uuid, $$TE-9-129-5$$, '00000000-2222-0000-0000-000000000bb6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007e2'::uuid, $$TE-7-076-9$$, '00000000-2222-0000-0000-000000000b63'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007e3'::uuid, $$TE-7-057-9$$, '00000000-2222-0000-0000-000000000b5e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007e5'::uuid, $$TE-8-056-2$$, '00000000-2222-0000-0000-000000000b83'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007e6'::uuid, $$TE-8-127-2$$, '00000000-2222-0000-0000-000000000b8e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007e7'::uuid, $$TE-7-127-8-R1$$, '00000000-2222-0000-0000-000000000b6d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007e8'::uuid, $$TE-8-071-9$$, '00000000-2222-0000-0000-000000000b84'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007e9'::uuid, $$TE-002$$, '00000000-2222-0000-0000-000000000987'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007ea'::uuid, $$TE-8-161-5$$, '00000000-2222-0000-0000-000000000b9c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007eb'::uuid, $$TE-6-050-3$$, '00000000-2222-0000-0000-000000000b37'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007ec'::uuid, $$TE-7-993-3$$, '00000000-2222-0000-0000-000000000b80'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007ed'::uuid, $$TE-8-127-5$$, '00000000-2222-0000-0000-000000000b90'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007ee'::uuid, $$TE-8-127-0$$, '00000000-2222-0000-0000-000000000b8c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007ef'::uuid, $$TE-8-074-5$$, '00000000-2222-0000-0000-000000000b86'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007f0'::uuid, $$TE-8-162-5-R1$$, '00000000-2222-0000-0000-000000000ba4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007f1'::uuid, $$TE-8-127-6$$, '00000000-2222-0000-0000-000000000b91'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007f2'::uuid, $$TE-7-127-9$$, '00000000-2222-0000-0000-000000000b70'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007f3'::uuid, $$TE-8-127-8$$, '00000000-2222-0000-0000-000000000b92'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007f4'::uuid, $$TE-9-127-6$$, '00000000-2222-0000-0000-000000000bb3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007f5'::uuid, $$TE-8-130-0$$, '00000000-2222-0000-0000-000000000b94'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007f6'::uuid, $$TE-8-103-3$$, '00000000-2222-0000-0000-000000000b89'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007f7'::uuid, $$TE-8-130-5$$, '00000000-2222-0000-0000-000000000b95'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007f9'::uuid, $$TE-8-162-1$$, '00000000-2222-0000-0000-000000000b9f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007fa'::uuid, $$DHA-002$$, '00000000-2222-0000-0000-0000000001c1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007fb'::uuid, $$TE-7-127-6$$, '00000000-2222-0000-0000-000000000b69'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007fc'::uuid, $$AAT-004-BN1$$, '00000000-2222-0000-0000-000000000078'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000007fe'::uuid, $$APE-002$$, '00000000-2222-0000-0000-00000000015b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000800'::uuid, $$SCP-001$$, '00000000-2222-0000-0000-0000000007e3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000802'::uuid, $$NPR-002$$, '00000000-2222-0000-0000-0000000006df'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000803'::uuid, $$MDS-005$$, '00000000-2222-0000-0000-00000000058c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000804'::uuid, $$SMK-146$$, '00000000-2222-0000-0000-00000000088c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000805'::uuid, $$SMK-203$$, '00000000-2222-0000-0000-00000000089e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000806'::uuid, $$YMT-005$$, '00000000-2222-0000-0000-000000000d17'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000807'::uuid, $$SMK-188$$, '00000000-2222-0000-0000-000000000899'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000809'::uuid, $$SMK-171$$, '00000000-2222-0000-0000-000000000892'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000080a'::uuid, $$SMK-211$$, '00000000-2222-0000-0000-0000000008a3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000080b'::uuid, $$SMK-094$$, '00000000-2222-0000-0000-000000000881'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000080c'::uuid, $$SMK-149$$, '00000000-2222-0000-0000-00000000088d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000080e'::uuid, $$SSI-001$$, '00000000-2222-0000-0000-0000000008d5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000080f'::uuid, $$SSI-002$$, '00000000-2222-0000-0000-0000000008d6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000810'::uuid, $$TE-5-142-3$$, '00000000-2222-0000-0000-000000000b2e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000811'::uuid, $$TE-5-156-2$$, '00000000-2222-0000-0000-000000000b30'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000812'::uuid, $$SMK-205$$, '00000000-2222-0000-0000-0000000008a0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000813'::uuid, $$16POCKETS$$, '00000000-2222-0000-0000-0000000006c0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000814'::uuid, $$TE-7-130-8$$, '00000000-2222-0000-0000-000000000b74'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000816'::uuid, $$TEP-005$$, '00000000-2222-0000-0000-000000000bcc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000818'::uuid, $$TNG-001$$, '00000000-2222-0000-0000-000000000c4e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000819'::uuid, $$FDK-006$$, '00000000-2222-0000-0000-000000000114'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000081b'::uuid, $$THK-007$$, '00000000-2222-0000-0000-000000000be6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000081c'::uuid, $$THK-006$$, '00000000-2222-0000-0000-000000000be5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000081f'::uuid, $$THK-008$$, '00000000-2222-0000-0000-000000000be7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000823'::uuid, $$YMT-007$$, '00000000-2222-0000-0000-000000000d19'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000825'::uuid, $$AKR-001$$, '00000000-2222-0000-0000-000000000126'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000827'::uuid, $$IZK-001$$, '00000000-2222-0000-0000-0000000002bb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000828'::uuid, $$MNM-003$$, '00000000-2222-0000-0000-0000000005b1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000829'::uuid, $$YSM-041$$, '00000000-2222-0000-0000-000000000dae'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000082a'::uuid, $$TCB-005$$, '00000000-2222-0000-0000-00000000096f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000082c'::uuid, $$LSK-003$$, '00000000-2222-0000-0000-00000000057d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000082d'::uuid, $$TIH-017$$, '00000000-2222-0000-0000-000000000c03'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000082f'::uuid, $$SGK-001$$, '00000000-2222-0000-0000-0000000007f5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000830'::uuid, $$APE-001$$, '00000000-2222-0000-0000-00000000015a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000831'::uuid, $$RCH-001$$, '00000000-2222-0000-0000-0000000007c6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000832'::uuid, $$MNM-001$$, '00000000-2222-0000-0000-0000000005af'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000833'::uuid, $$MTE-001$$, '00000000-2222-0000-0000-0000000005d4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000835'::uuid, $$QAS-002$$, '00000000-2222-0000-0000-0000000007c1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000837'::uuid, $$SJK-006$$, '00000000-2222-0000-0000-00000000082d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000838'::uuid, $$SJK-007$$, '00000000-2222-0000-0000-00000000082e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000839'::uuid, $$SJK-008$$, '00000000-2222-0000-0000-00000000082f'::uuid, 1, 1, NULL, $$2.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000083a'::uuid, $$SJK-004$$, '00000000-2222-0000-0000-00000000082b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000083c'::uuid, $$LKS-007$$, '00000000-2222-0000-0000-00000000056a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000083d'::uuid, $$SGK-2-001$$, '00000000-2222-0000-0000-0000000007f8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000083e'::uuid, $$TIH-012$$, '00000000-2222-0000-0000-000000000bfe'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000083f'::uuid, $$QAS-004$$, '00000000-2222-0000-0000-0000000007c3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000841'::uuid, $$KKC-001$$, '00000000-2222-0000-0000-000000000424'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000843'::uuid, $$YZW-001$$, '00000000-2222-0000-0000-000000000dc9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000844'::uuid, $$NML-001$$, '00000000-2222-0000-0000-0000000006b2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000846'::uuid, $$SES-005$$, '00000000-2222-0000-0000-0000000007f0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000849'::uuid, $$ADY-099-TN1$$, '00000000-2222-0000-0000-0000000000bf'::uuid, 1, 1, $$T$$, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000084a'::uuid, $$ADY-099-BN1$$, '00000000-2222-0000-0000-0000000000be'::uuid, 1, 1, $$B$$, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000084b'::uuid, $$ADY-096$$, '00000000-2222-0000-0000-0000000000ba'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000084e'::uuid, $$SES-002$$, '00000000-2222-0000-0000-0000000007ed'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000850'::uuid, $$SE-53Z$$, '00000000-2222-0000-0000-0000000007ea'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000852'::uuid, $$SES-004$$, '00000000-2222-0000-0000-0000000007ef'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000853'::uuid, $$TNX-009$$, '00000000-2222-0000-0000-000000000c55'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000855'::uuid, $$TM-F$$, '00000000-2222-0000-0000-000000000c4d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000856'::uuid, $$KIK-005D$$, '00000000-2222-0000-0000-00000000041f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000857'::uuid, $$AZK-001$$, '00000000-2222-0000-0000-000000000192'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000858'::uuid, $$SJK-010$$, '00000000-2222-0000-0000-000000000831'::uuid, 1, 1, NULL, $$6.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000859'::uuid, $$SJK-011$$, '00000000-2222-0000-0000-000000000832'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000085a'::uuid, $$SJK-012$$, '00000000-2222-0000-0000-000000000833'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000085b'::uuid, $$YMT-003$$, '00000000-2222-0000-0000-000000000d15'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000085c'::uuid, $$YMT-004$$, '00000000-2222-0000-0000-000000000d16'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000085d'::uuid, $$YSM-034$$, '00000000-2222-0000-0000-000000000da7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000085e'::uuid, $$KOS-003$$, '00000000-2222-0000-0000-000000000447'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000085f'::uuid, $$YMT-002$$, '00000000-2222-0000-0000-000000000d14'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000860'::uuid, $$NML-006$$, '00000000-2222-0000-0000-0000000006b8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000861'::uuid, $$TIH-002$$, '00000000-2222-0000-0000-000000000bf3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000862'::uuid, $$MTM-106$$, '00000000-2222-0000-0000-0000000005e4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000863'::uuid, $$SWJ-006$$, '00000000-2222-0000-0000-00000000093c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000864'::uuid, $$SWJ-008$$, '00000000-2222-0000-0000-00000000093d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000865'::uuid, $$KOR-010$$, '00000000-2222-0000-0000-000000000443'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000866'::uuid, $$BMI-002$$, '00000000-2222-0000-0000-000000000195'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000867'::uuid, $$SFI-001$$, '00000000-2222-0000-0000-0000000007f2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000869'::uuid, $$NCD-001$$, '00000000-2222-0000-0000-000000000660'::uuid, 1, 1, NULL, $$2.0$$, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000086a'::uuid, $$QAS-005$$, '00000000-2222-0000-0000-0000000007c4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000086b'::uuid, $$SSK-001$$, '00000000-2222-0000-0000-0000000008e0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000086c'::uuid, $$NML-008$$, '00000000-2222-0000-0000-0000000006ba'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000086d'::uuid, $$SKS-013$$, '00000000-2222-0000-0000-00000000085e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000086e'::uuid, $$NML-002$$, '00000000-2222-0000-0000-0000000006b4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000086f'::uuid, $$NML-003$$, '00000000-2222-0000-0000-0000000006b5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000870'::uuid, $$NML-004$$, '00000000-2222-0000-0000-0000000006b6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000871'::uuid, $$NML-005$$, '00000000-2222-0000-0000-0000000006b7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000872'::uuid, $$KIK-005-BN1$$, '00000000-2222-0000-0000-000000000420'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000873'::uuid, $$KIK-005-TN1$$, '00000000-2222-0000-0000-000000000421'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000874'::uuid, $$ASH-001$$, '00000000-2222-0000-0000-000000000166'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000875'::uuid, $$YES-002$$, '00000000-2222-0000-0000-000000000cf1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000876'::uuid, $$TKS-021$$, '00000000-2222-0000-0000-000000000c41'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000877'::uuid, $$JPS-001$$, '00000000-2222-0000-0000-0000000003af'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000878'::uuid, $$YMT-001$$, '00000000-2222-0000-0000-000000000d13'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000879'::uuid, $$QSK-001$$, '00000000-2222-0000-0000-0000000007c5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000087a'::uuid, $$YCM-023$$, '00000000-2222-0000-0000-000000000cbc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000087b'::uuid, $$TIH-006$$, '00000000-2222-0000-0000-000000000bf7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000087c'::uuid, $$SJK-002$$, '00000000-2222-0000-0000-00000000082a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000087d'::uuid, $$SJK-005$$, '00000000-2222-0000-0000-00000000082c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000087e'::uuid, $$SJK-009$$, '00000000-2222-0000-0000-000000000830'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000087f'::uuid, $$SG-001$$, '00000000-2222-0000-0000-0000000007f3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000880'::uuid, $$TIH-003$$, '00000000-2222-0000-0000-000000000bf4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000881'::uuid, $$YMT-006$$, '00000000-2222-0000-0000-000000000d18'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000882'::uuid, $$SMK-209$$, '00000000-2222-0000-0000-0000000008a2'::uuid, 1, 1, NULL, $$2.0$$, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000883'::uuid, $$SMK-204$$, '00000000-2222-0000-0000-00000000089f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000884'::uuid, $$TEP-004$$, '00000000-2222-0000-0000-000000000bcb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000885'::uuid, $$TEP-002$$, '00000000-2222-0000-0000-000000000bc9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000887'::uuid, $$YES-001$$, '00000000-2222-0000-0000-000000000cf0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000888'::uuid, $$TEP-006$$, '00000000-2222-0000-0000-000000000bcd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000088a'::uuid, $$SNK-001$$, '00000000-2222-0000-0000-0000000008ac'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000088b'::uuid, $$LKS-004$$, '00000000-2222-0000-0000-000000000567'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000088c'::uuid, $$YMT-008$$, '00000000-2222-0000-0000-000000000d1a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000088d'::uuid, $$NPR-003$$, '00000000-2222-0000-0000-0000000006e0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000088e'::uuid, $$UTD-001$$, '00000000-2222-0000-0000-000000000c92'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000088f'::uuid, $$TEP-001$$, '00000000-2222-0000-0000-000000000bc8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000890'::uuid, $$TEP-003$$, '00000000-2222-0000-0000-000000000bca'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000892'::uuid, $$KMR-002$$, '00000000-2222-0000-0000-00000000042c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000893'::uuid, $$KOS-016$$, '00000000-2222-0000-0000-000000000453'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000894'::uuid, $$STD-006$$, '00000000-2222-0000-0000-000000000928'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000895'::uuid, $$SGK-006-R2$$, '00000000-2222-0000-0000-0000000007f6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000896'::uuid, $$NoName-45x347x$$, '00000000-2222-0000-0000-0000000006cb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000897'::uuid, $$KWE-001$$, '00000000-2222-0000-0000-000000000557'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000898'::uuid, $$LDV-001$$, '00000000-2222-0000-0000-000000000562'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000899'::uuid, $$MZT-130$$, '00000000-2222-0000-0000-00000000064d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000089a'::uuid, $$MZT-136$$, '00000000-2222-0000-0000-000000000653'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000089b'::uuid, $$MZT-074$$, '00000000-2222-0000-0000-000000000627'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000089c'::uuid, $$MZT-086$$, '00000000-2222-0000-0000-00000000062f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000089d'::uuid, $$SHT-010$$, '00000000-2222-0000-0000-000000000801'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000089e'::uuid, $$TE-4-161-3$$, '00000000-2222-0000-0000-000000000b10'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000089f'::uuid, $$ORM-004$$, '00000000-2222-0000-0000-000000000779'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008a0'::uuid, $$TSP-005$$, '00000000-2222-0000-0000-000000000c83'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008a1'::uuid, $$WTN-005$$, '00000000-2222-0000-0000-000000000caa'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008a2'::uuid, $$OSI-002$$, '00000000-2222-0000-0000-00000000077c'::uuid, 1, 1, NULL, $$2.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008a3'::uuid, $$KGM-007$$, '00000000-2222-0000-0000-000000000414'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008a4'::uuid, $$JAE-221$$, '00000000-2222-0000-0000-000000000347'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008a5'::uuid, $$KGM-006$$, '00000000-2222-0000-0000-000000000413'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008a6'::uuid, $$JAE-114-R2$$, '00000000-2222-0000-0000-0000000002f8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008a8'::uuid, $$JAE-101-R2$$, '00000000-2222-0000-0000-0000000002f3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008a9'::uuid, $$JAE-054$$, '00000000-2222-0000-0000-0000000002e3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008aa'::uuid, $$JAE-265$$, '00000000-2222-0000-0000-000000000370'::uuid, 1, 1, NULL, $$5.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008ab'::uuid, $$ATS-010$$, '00000000-2222-0000-0000-000000000175'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008ac'::uuid, $$JAE-150$$, '00000000-2222-0000-0000-00000000030e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008ad'::uuid, $$JAE-036-ZD$$, '00000000-2222-0000-0000-0000000002d7'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008ae'::uuid, $$KOS-002$$, '00000000-2222-0000-0000-000000000446'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008af'::uuid, $$JAE-180-R1$$, '00000000-2222-0000-0000-000000000323'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008b0'::uuid, $$TE-0-161-6$$, '00000000-2222-0000-0000-0000000009c1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008b1'::uuid, $$RCH-003$$, '00000000-2222-0000-0000-0000000007c8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008b3'::uuid, $$TE-5-159-9$$, '00000000-2222-0000-0000-000000000b34'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008b4'::uuid, $$TE-6-157-8$$, '00000000-2222-0000-0000-000000000b53'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008b5'::uuid, $$TE-6-143-3$$, '00000000-2222-0000-0000-000000000b4c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008b6'::uuid, $$TE-6-160-8$$, '00000000-2222-0000-0000-000000000b59'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008b7'::uuid, $$TE-6-157-6$$, '00000000-2222-0000-0000-000000000b52'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008b8'::uuid, $$TE-6-156-2$$, '00000000-2222-0000-0000-000000000b4e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008b9'::uuid, $$TE-6-079-1$$, '00000000-2222-0000-0000-000000000b3f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008ba'::uuid, $$TE-6-156-0$$, '00000000-2222-0000-0000-000000000b4d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008bb'::uuid, $$TE-6-127-5-R1$$, '00000000-2222-0000-0000-000000000b42'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008bc'::uuid, $$TE-6-127-6$$, '00000000-2222-0000-0000-000000000b43'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008bd'::uuid, $$TE-6-127-7$$, '00000000-2222-0000-0000-000000000b44'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008be'::uuid, $$TE-6-098-0$$, '00000000-2222-0000-0000-000000000b40'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008bf'::uuid, $$TE-5-056-7$$, '00000000-2222-0000-0000-000000000b1a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008c0'::uuid, $$TE-5-159-9-R7$$, '00000000-2222-0000-0000-000000000b36'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008c2'::uuid, $$TE-6-156-7$$, '00000000-2222-0000-0000-000000000b50'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008c3'::uuid, $$TE-6-110-9$$, '00000000-2222-0000-0000-000000000b41'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008c4'::uuid, $$TE-6-160-7$$, '00000000-2222-0000-0000-000000000b58'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;

COMMIT;
