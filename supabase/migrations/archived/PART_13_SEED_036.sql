-- PART 13/14
BEGIN;

INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f12'::uuid, $$MZT-016$$, '00000000-2222-0000-0000-00000000061a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f17'::uuid, $$MZT-079?$$, '00000000-2222-0000-0000-000000000629'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f1a'::uuid, $$NFC-001$$, '00000000-2222-0000-0000-000000000677'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f1e'::uuid, $$NGS-013AB$$, '00000000-2222-0000-0000-00000000068c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f1f'::uuid, $$NHK-001$$, '00000000-2222-0000-0000-00000000069f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f20'::uuid, $$NHK-009$$, '00000000-2222-0000-0000-0000000006a3'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f2c'::uuid, $$SMK-053$$, '00000000-2222-0000-0000-00000000087d'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f35'::uuid, $$NRK-031$$, '00000000-2222-0000-0000-0000000006f1'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f41'::uuid, $$NRK-009$$, '00000000-2222-0000-0000-0000000006e7'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f44'::uuid, $$ODS$$, '00000000-2222-0000-0000-000000000715'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f46'::uuid, $$ODS-043$$, '00000000-2222-0000-0000-000000000733'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f47'::uuid, $$ODS-033$$, '00000000-2222-0000-0000-00000000072a'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f49'::uuid, $$ODS-044$$, '00000000-2222-0000-0000-000000000734'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f53'::uuid, $$OOT-021$$, '00000000-2222-0000-0000-000000000760'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f54'::uuid, $$OOT-004AB$$, '00000000-2222-0000-0000-000000000753'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f60'::uuid, $$OTAX-015$$, '00000000-2222-0000-0000-000000000789'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f61'::uuid, $$OTAX-016$$, '00000000-2222-0000-0000-00000000078a'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f62'::uuid, $$OTAX-014$$, '00000000-2222-0000-0000-000000000788'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f6e'::uuid, $$RYK-002$$, '00000000-2222-0000-0000-0000000007d7'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f70'::uuid, $$SP-030$$, '00000000-2222-0000-0000-0000000008b6'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f71'::uuid, $$SP-014$$, '00000000-2222-0000-0000-0000000008b4'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f72'::uuid, $$RYOKA-002$$, '00000000-2222-0000-0000-0000000007dc'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f75'::uuid, $$SDK$$, '00000000-2222-0000-0000-0000000007e4'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f79'::uuid, $$SES-003$$, '00000000-2222-0000-0000-0000000007ee'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f7b'::uuid, $$SG-001PP$$, '00000000-2222-0000-0000-0000000007f4'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f7f'::uuid, $$SJI-016$$, '00000000-2222-0000-0000-000000000823'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f81'::uuid, $$SJI-021スタ$$, '00000000-2222-0000-0000-000000000829'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f83'::uuid, $$SJI-015$$, '00000000-2222-0000-0000-000000000822'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f84'::uuid, $$SJI-001$$, '00000000-2222-0000-0000-000000000818'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f87'::uuid, $$SJI-013$$, '00000000-2222-0000-0000-000000000820'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f8f'::uuid, $$MTM-108$$, '00000000-2222-0000-0000-0000000005e5'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f93'::uuid, $$SK-026$$, '00000000-2222-0000-0000-000000000842'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f94'::uuid, $$SK-009$$, '00000000-2222-0000-0000-000000000839'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f95'::uuid, $$ELP-009$$, '00000000-2222-0000-0000-0000000000cb'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f96'::uuid, $$ELP-200$$, '00000000-2222-0000-0000-0000000000cc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f97'::uuid, $$SK-046$$, '00000000-2222-0000-0000-00000000084a'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f99'::uuid, $$SK-039-R1$$, '00000000-2222-0000-0000-000000000847'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f9a'::uuid, $$YSD-Z-015-1$$, '00000000-2222-0000-0000-000000000d77'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f9b'::uuid, $$APF-002$$, '00000000-2222-0000-0000-00000000015c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f9e'::uuid, $$SKK-003$$, '00000000-2222-0000-0000-000000000850'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f9f'::uuid, $$SKS-012$$, '00000000-2222-0000-0000-00000000085d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fa1'::uuid, $$SLK-113$$, '00000000-2222-0000-0000-000000000869'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fa4'::uuid, $$SLK-110$$, '00000000-2222-0000-0000-000000000866'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fa5'::uuid, $$SLK-128$$, '00000000-2222-0000-0000-00000000086f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fa7'::uuid, $$SLK-111$$, '00000000-2222-0000-0000-000000000867'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fab'::uuid, $$SLK-119$$, '00000000-2222-0000-0000-00000000086d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fad'::uuid, $$SMK-014$$, '00000000-2222-0000-0000-000000000875'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fb3'::uuid, $$SMK-050$$, '00000000-2222-0000-0000-00000000087c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fb4'::uuid, $$SMK-036$$, '00000000-2222-0000-0000-000000000878'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fb7'::uuid, $$SMK-010$$, '00000000-2222-0000-0000-000000000874'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fb8'::uuid, $$SMK-015$$, '00000000-2222-0000-0000-000000000876'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fb9'::uuid, $$TKS-001$$, '00000000-2222-0000-0000-000000000c30'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fbb'::uuid, $$SMK-108$$, '00000000-2222-0000-0000-000000000881'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fbc'::uuid, $$SMK-039$$, '00000000-2222-0000-0000-00000000087a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fbd'::uuid, $$SMK-040$$, '00000000-2222-0000-0000-00000000087b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fbe'::uuid, $$SMK-061$$, '00000000-2222-0000-0000-00000000087d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fc2'::uuid, $$SMK-025$$, '00000000-2222-0000-0000-000000000877'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fc3'::uuid, $$SMK-090$$, '00000000-2222-0000-0000-000000000880'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fc4'::uuid, $$SMK-163$$, '00000000-2222-0000-0000-00000000088f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fc5'::uuid, $$SMK-028$$, '00000000-2222-0000-0000-000000000878'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fc8'::uuid, $$SP-016$$, '00000000-2222-0000-0000-0000000008b5'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fcf'::uuid, $$SSJ-012PP,PS$$, '00000000-2222-0000-0000-0000000008d9'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fd4'::uuid, $$SSJ-017$$, '00000000-2222-0000-0000-0000000008dd'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fd9'::uuid, $$SSK-006-R2$$, '00000000-2222-0000-0000-0000000008e6'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fea'::uuid, $$STD-02$$, '00000000-2222-0000-0000-00000000092a'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fee'::uuid, $$SWJ-004?$$, '00000000-2222-0000-0000-00000000093b'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ff0'::uuid, $$SZT-007-TN1$$, '00000000-2222-0000-0000-00000000094b'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ff1'::uuid, $$SZT-003$$, '00000000-2222-0000-0000-000000000945'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ffd'::uuid, $$TE-0-021-7$$, '00000000-2222-0000-0000-000000000992'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000fff'::uuid, $$TE-2-059-2$$, '00000000-2222-0000-0000-000000000a36'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001002'::uuid, $$TE-2-059-1$$, '00000000-2222-0000-0000-000000000a35'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001006'::uuid, $$TE-1279508-1$$, '00000000-2222-0000-0000-000000000a19'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001008'::uuid, $$TE-2-059-9-N2$$, '00000000-2222-0000-0000-000000000a37'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001009'::uuid, $$TE-7-135-4$$, '00000000-2222-0000-0000-000000000b77'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001013'::uuid, $$TE-3-066-6$$, '00000000-2222-0000-0000-000000000ab9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001014'::uuid, $$TE-3-066-7A$$, '00000000-2222-0000-0000-000000000aba'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001016'::uuid, $$TE-7-127-7-R3$$, '00000000-2222-0000-0000-000000000b6b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001017'::uuid, $$TE-7-127-8-R3$$, '00000000-2222-0000-0000-000000000b6e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001018'::uuid, $$TE-3-127-7$$, '00000000-2222-0000-0000-000000000ac2'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001019'::uuid, $$TE-3-127-8$$, '00000000-2222-0000-0000-000000000ac3'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000101d'::uuid, $$TE-5-124-6$$, '00000000-2222-0000-0000-000000000b22'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000101e'::uuid, $$TE-6-142-9A$$, '00000000-2222-0000-0000-000000000b49'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000101f'::uuid, $$TE-6-142-9-BN1$$, '00000000-2222-0000-0000-000000000b4a'::uuid, 1, 1, $$B$$, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001024'::uuid, $$TE-7-936993-3$$, '00000000-2222-0000-0000-000000000b7f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001027'::uuid, $$TE-0-156-9$$, '00000000-2222-0000-0000-0000000009b9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001028'::uuid, $$TE-0-156-9Ver2$$, '00000000-2222-0000-0000-0000000009ba'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000102a'::uuid, $$TE-9-130-2$$, '00000000-2222-0000-0000-000000000bb9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000102c'::uuid, $$TE-3-160-9$$, '00000000-2222-0000-0000-000000000ad6'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000102e'::uuid, $$TE-1-019-2-R1$$, '00000000-2222-0000-0000-0000000009d0'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001034'::uuid, $$TE-1279600-1新$$, '00000000-2222-0000-0000-000000000a24'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001035'::uuid, $$TE-7-127-7-R4$$, '00000000-2222-0000-0000-000000000b6c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001038'::uuid, $$TE-5-129-7$$, '00000000-2222-0000-0000-000000000b29'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000103b'::uuid, $$TE-3-065-6$$, '00000000-2222-0000-0000-000000000ab8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000103c'::uuid, $$TE-6-072-0$$, '00000000-2222-0000-0000-000000000b3c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001040'::uuid, $$TE-4-072-3$$, '00000000-2222-0000-0000-000000000ae5'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001041'::uuid, $$TE-4-072-4$$, '00000000-2222-0000-0000-000000000ae6'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001042'::uuid, $$TE-2-077-8旧セガ用$$, '00000000-2222-0000-0000-000000000a3c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001043'::uuid, $$TE-4-720999-8$$, '00000000-2222-0000-0000-000000000b12'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001044'::uuid, $$TE-1-024-8$$, '00000000-2222-0000-0000-0000000009e3'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001045'::uuid, $$TE-7-068-2$$, '00000000-2222-0000-0000-000000000b5f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000104e'::uuid, $$TE-1-129-3$$, '00000000-2222-0000-0000-0000000009fa'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001050'::uuid, $$TE-2423252-2$$, '00000000-2222-0000-0000-000000000a7c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001052'::uuid, $$TES-001$$, '00000000-2222-0000-0000-000000000bcd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001057'::uuid, $$TH-014$$, '00000000-2222-0000-0000-000000000bd3'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000105b'::uuid, $$JAE$$, '00000000-2222-0000-0000-0000000002be'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001065'::uuid, $$TJS-004$$, '00000000-2222-0000-0000-000000000c11'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001067'::uuid, $$TKD-006$$, '00000000-2222-0000-0000-000000000c19'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000106a'::uuid, $$TKS-006$$, '00000000-2222-0000-0000-000000000c33'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000106e'::uuid, $$ADY-117$$, '00000000-2222-0000-0000-00000000011b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001070'::uuid, $$AA-TN1$$, '00000000-2222-0000-0000-000000000075'::uuid, 1, 1, $$T$$, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000107a'::uuid, $$TDW-001-R3$$, '00000000-2222-0000-0000-00000000097d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000107e'::uuid, $$NPK-001$$, '00000000-2222-0000-0000-0000000006dc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000107f'::uuid, $$JAE-324$$, '00000000-2222-0000-0000-0000000003ac'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001080'::uuid, $$MTS-001$$, '00000000-2222-0000-0000-00000000060a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001082'::uuid, $$MZT-140$$, '00000000-2222-0000-0000-000000000657'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001083'::uuid, $$SIT-017$$, '00000000-2222-0000-0000-000000000812'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001084'::uuid, $$OOT-005$$, '00000000-2222-0000-0000-000000000754'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001086'::uuid, $$YGE-002$$, '00000000-2222-0000-0000-000000000cf6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001088'::uuid, $$TE-2373028-2-R2$$, '00000000-2222-0000-0000-000000000a6f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000108d'::uuid, $$SIT-018$$, '00000000-2222-0000-0000-000000000814'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000108e'::uuid, $$SIT-019$$, '00000000-2222-0000-0000-000000000816'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000108f'::uuid, $$TE-6-159-6-R1$$, '00000000-2222-0000-0000-000000000b55'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001092'::uuid, $$OOT-006$$, '00000000-2222-0000-0000-000000000755'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001093'::uuid, $$TE-1-157-1$$, '00000000-2222-0000-0000-000000000a0b'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001094'::uuid, $$TE-0-159-2$$, '00000000-2222-0000-0000-0000000009bb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001095'::uuid, $$SMK-168$$, '00000000-2222-0000-0000-000000000891'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001096'::uuid, $$OOT-011$$, '00000000-2222-0000-0000-000000000758'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001098'::uuid, $$DK-121$$, '00000000-2222-0000-0000-000000000254'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001099'::uuid, $$DK-120$$, '00000000-2222-0000-0000-000000000253'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000109b'::uuid, $$DK-129$$, '00000000-2222-0000-0000-000000000255'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000109c'::uuid, $$OOT-013$$, '00000000-2222-0000-0000-00000000075a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000109d'::uuid, $$DK-136$$, '00000000-2222-0000-0000-000000000256'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000109e'::uuid, $$DK-139$$, '00000000-2222-0000-0000-000000000257'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000109f'::uuid, $$DK-144$$, '00000000-2222-0000-0000-000000000258'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010a2'::uuid, $$JAE-099$$, '00000000-2222-0000-0000-0000000002f2'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010a3'::uuid, $$ADY-074$$, '00000000-2222-0000-0000-0000000000a3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010a5'::uuid, $$JAE-013$$, '00000000-2222-0000-0000-0000000002ca'::uuid, 1, 1, NULL, $$2.0$$, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010a6'::uuid, $$JAE-202$$, '00000000-2222-0000-0000-000000000338'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010a9'::uuid, $$TNR-001$$, '00000000-2222-0000-0000-000000000de9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010aa'::uuid, $$OOT-016$$, '00000000-2222-0000-0000-000000000dea'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010ab'::uuid, $$JAE-028$$, '00000000-2222-0000-0000-000000000deb'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010ac'::uuid, $$SWT-001$$, '00000000-2222-0000-0000-000000000dec'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010ad'::uuid, $$ADY-094$$, '00000000-2222-0000-0000-000000000ded'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010ae'::uuid, $$MTM-085$$, '00000000-2222-0000-0000-000000000dee'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010b0'::uuid, $$MYS-001$$, '00000000-2222-0000-0000-000000000def'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010b2'::uuid, $$KDS-097$$, '00000000-2222-0000-0000-000000000df0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010b3'::uuid, $$MZT-045$$, '00000000-2222-0000-0000-000000000df1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010b4'::uuid, $$MZT-062$$, '00000000-2222-0000-0000-000000000df2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010b7'::uuid, $$MZT-065$$, '00000000-2222-0000-0000-000000000df6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010ba'::uuid, $$JAE-103$$, '00000000-2222-0000-0000-000000000dfc'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010bb'::uuid, $$ADY-073$$, '00000000-2222-0000-0000-000000000df6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010bc'::uuid, $$ADY-072$$, '00000000-2222-0000-0000-000000000dfd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010bd'::uuid, $$CST-006$$, '00000000-2222-0000-0000-000000000dfb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010be'::uuid, $$KDS-090$$, '00000000-2222-0000-0000-000000000dfa'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010bf'::uuid, $$KND-007$$, '00000000-2222-0000-0000-000000000dfe'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010c0'::uuid, $$TE-9-127-0$$, '00000000-2222-0000-0000-000000000dff'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010c2'::uuid, $$JAE-049$$, '00000000-2222-0000-0000-000000000e00'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010c3'::uuid, $$ODS-017$$, '00000000-2222-0000-0000-00000000071c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010c4'::uuid, $$TMC-002$$, '00000000-2222-0000-0000-000000000c44'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010c5'::uuid, $$YSD-Z-060-1$$, '00000000-2222-0000-0000-000000000e04'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010c7'::uuid, $$JAE-179$$, '00000000-2222-0000-0000-000000000e01'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010c8'::uuid, $$JAE-093$$, '00000000-2222-0000-0000-000000000e02'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010c9'::uuid, $$TNX-002$$, '00000000-2222-0000-0000-000000000c50'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010ca'::uuid, $$TE-9-127-1$$, '00000000-2222-0000-0000-000000000e03'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010cb'::uuid, $$YCM-030$$, '00000000-2222-0000-0000-000000000e07'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010cc'::uuid, $$JAE-154$$, '00000000-2222-0000-0000-000000000e05'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010cd'::uuid, $$AON-002$$, '00000000-2222-0000-0000-000000000e08'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010cf'::uuid, $$PB470x400x50ND$$, '00000000-2222-0000-0000-0000000007a0'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010d0'::uuid, $$PB74H20YMS-001$$, '00000000-2222-0000-0000-0000000007aa'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010d4'::uuid, $$OOT-042$$, '00000000-2222-0000-0000-000000000774'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010d6'::uuid, $$OOT-042D$$, '00000000-2222-0000-0000-000000000773'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010d7'::uuid, $$TE-9-612056-2$$, '00000000-2222-0000-0000-000000000bc4'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010d8'::uuid, $$その他$$, '00000000-2222-0000-0000-000000000ddd'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010d9'::uuid, $$PB460x330WTN007$$, '00000000-2222-0000-0000-00000000079f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010da'::uuid, $$OKH-002$$, '00000000-2222-0000-0000-00000000074a'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010db'::uuid, $$PB470x450x50HIGHPLUG$$, '00000000-2222-0000-0000-0000000007a0'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010dc'::uuid, $$PB590x350$$, '00000000-2222-0000-0000-0000000007a0'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010dd'::uuid, $$PBAType490x320x15$$, '00000000-2222-0000-0000-0000000007a3'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010de'::uuid, $$PBCTYPE499x347$$, '00000000-2222-0000-0000-0000000007a4'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010df'::uuid, $$PBJAE　300ｘ285$$, '00000000-2222-0000-0000-0000000007a5'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010e0'::uuid, $$PBNB620x310$$, '00000000-2222-0000-0000-0000000007a6'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010e1'::uuid, $$PB-ZDTYPE$$, '00000000-2222-0000-0000-0000000007a7'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010e2'::uuid, $$PB74530x350$$, '00000000-2222-0000-0000-0000000007a8'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010e3'::uuid, $$ALCUTTE-R1248.4x198.4YMS4P$$, '00000000-2222-0000-0000-00000000012a'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010e4'::uuid, $$PB375x367$$, '00000000-2222-0000-0000-00000000079e'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010e5'::uuid, $$NHC-006$$, '00000000-2222-0000-0000-00000000069c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010e6'::uuid, $$SIT-017D$$, '00000000-2222-0000-0000-000000000813'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010e7'::uuid, $$ALBASE10x557x704$$, '00000000-2222-0000-0000-000000000128'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010e9'::uuid, $$NFC-001ASANOPLATE$$, '00000000-2222-0000-0000-000000000678'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010ea'::uuid, $$NFC-001追加工・治具$$, '00000000-2222-0000-0000-000000000679'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010ed'::uuid, $$NGS-017-R2$$, '00000000-2222-0000-0000-000000000692'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010ee'::uuid, $$TE-9-162-6$$, '00000000-2222-0000-0000-000000000bc2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010ef'::uuid, $$NGT-012$$, '00000000-2222-0000-0000-000000000698'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010f0'::uuid, $$PLATE5x600x745$$, '00000000-2222-0000-0000-0000000007ab'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010f1'::uuid, $$ADY-125D$$, '00000000-2222-0000-0000-00000000011f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010f2'::uuid, $$ADY-099$$, '00000000-2222-0000-0000-0000000000bd'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010f3'::uuid, $$ODS-052-R1$$, '00000000-2222-0000-0000-000000000739'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010f4'::uuid, $$ODS-053$$, '00000000-2222-0000-0000-00000000073a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010f5'::uuid, $$YSD-A-075-2$$, '00000000-2222-0000-0000-000000000d3b'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010f6'::uuid, $$YSD-A-035-1$$, '00000000-2222-0000-0000-000000000d35'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010f7'::uuid, $$A別抜き$$, '00000000-2222-0000-0000-000000000074'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010f8'::uuid, $$ODS-055D$$, '00000000-2222-0000-0000-00000000073d'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010f9'::uuid, $$OKH-001$$, '00000000-2222-0000-0000-000000000749'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010fa'::uuid, $$NGS-017D$$, '00000000-2222-0000-0000-000000000691'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010fb'::uuid, $$SIT-012$$, '00000000-2222-0000-0000-00000000080d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010fc'::uuid, $$PB74FHJ515x347$$, '00000000-2222-0000-0000-0000000007a9'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000010fe'::uuid, $$SHT-013-R3$$, '00000000-2222-0000-0000-000000000805'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001100'::uuid, $$TE-8-161-52P$$, '00000000-2222-0000-0000-000000000b9e'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001103'::uuid, $$SIT-011$$, '00000000-2222-0000-0000-00000000080c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001104'::uuid, $$SGK2-001$$, '00000000-2222-0000-0000-0000000007f8'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001107'::uuid, $$SIT-013$$, '00000000-2222-0000-0000-00000000080e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001109'::uuid, $$SIT-014$$, '00000000-2222-0000-0000-00000000080f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000110b'::uuid, $$SIT-015-R2$$, '00000000-2222-0000-0000-000000000810'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000110d'::uuid, $$SIT-016D$$, '00000000-2222-0000-0000-000000000811'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000110e'::uuid, $$SIT-016$$, '00000000-2222-0000-0000-000000000f11'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000110f'::uuid, $$74Cスタック用NPC-T-409$$, '00000000-2222-0000-0000-000000000072'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001111'::uuid, $$KSP-204$$, '00000000-2222-0000-0000-000000000548'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001112'::uuid, $$PLATE5x606x830$$, '00000000-2222-0000-0000-0000000007ac'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001114'::uuid, $$PLX-002D$$, '00000000-2222-0000-0000-0000000007ae'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001115'::uuid, $$TE-9-162-7$$, '00000000-2222-0000-0000-000000000bc3'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001118'::uuid, $$PNS-011$$, '00000000-2222-0000-0000-0000000007bb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001119'::uuid, $$P-P12127-P$$, '00000000-2222-0000-0000-0000000007bd'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000111a'::uuid, $$TE-8-162-5-R1PP$$, '00000000-2222-0000-0000-000000000ba3'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000111b'::uuid, $$RDF85CUTTE-R1JIG$$, '00000000-2222-0000-0000-0000000007cf'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000111c'::uuid, $$ALCUTTE-R1270x270JAE$$, '00000000-2222-0000-0000-00000000012b'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000111e'::uuid, $$RV53BLowerVerD32$$, '00000000-2222-0000-0000-0000000007d2'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000111f'::uuid, $$Rv53BLowerVerD25$$, '00000000-2222-0000-0000-0000000007d1'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001120'::uuid, $$RV-53BMountingPlate$$, '00000000-2222-0000-0000-0000000007d3'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001121'::uuid, $$RV74CLowerTableVer23.4.19$$, '00000000-2222-0000-0000-0000000007d5'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001122'::uuid, $$RV74CLowerTable$$, '00000000-2222-0000-0000-0000000007d4'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001124'::uuid, $$TE-8-161-51P$$, '00000000-2222-0000-0000-000000000b9d'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001125'::uuid, $$SES-001$$, '00000000-2222-0000-0000-0000000007ec'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001127'::uuid, $$ATS-032　PLATE$$, '00000000-2222-0000-0000-00000000018f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001128'::uuid, $$KOS-016-R1$$, '00000000-2222-0000-0000-000000000454'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001129'::uuid, $$JAE-314D$$, '00000000-2222-0000-0000-0000000003a1'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000112a'::uuid, $$DIC-037$$, '00000000-2222-0000-0000-0000000001da'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000112c'::uuid, $$ALCUTTE-R1PLATE-YMS4P$$, '00000000-2222-0000-0000-000000000131'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000112d'::uuid, $$CMX800V$$, '00000000-2222-0000-0000-0000000001a9'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000112e'::uuid, $$CMX1100V$$, '00000000-2222-0000-0000-0000000001a8'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001130'::uuid, $$DIC-133$$, '00000000-2222-0000-0000-000000000228'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001131'::uuid, $$C別抜き$$, '00000000-2222-0000-0000-000000000197'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001132'::uuid, $$JAE-296D$$, '00000000-2222-0000-0000-00000000038f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001133'::uuid, $$KDS-134$$, '00000000-2222-0000-0000-000000000405'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001134'::uuid, $$KDS-135$$, '00000000-2222-0000-0000-000000000406'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001135'::uuid, $$ATS-032$$, '00000000-2222-0000-0000-000000000190'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001136'::uuid, $$ATS-029D-R2$$, '00000000-2222-0000-0000-00000000018a'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001137'::uuid, $$KDS-141D$$, '00000000-2222-0000-0000-00000000040b'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001138'::uuid, $$ATS-029D$$, '00000000-2222-0000-0000-000000000189'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000113b'::uuid, $$ALCUTTE-R1234x184YMS3P$$, '00000000-2222-0000-0000-000000000129'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000113c'::uuid, $$ALCUTTE-R1PLATE-ADY2P$$, '00000000-2222-0000-0000-000000000130'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000113d'::uuid, $$YSD-E-100-1$$, '00000000-2222-0000-0000-000000000d48'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000113e'::uuid, $$JAE-スタキング$$, '00000000-2222-0000-0000-0000000002bf'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000113f'::uuid, $$HKS-012$$, '00000000-2222-0000-0000-000000000292'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001141'::uuid, $$HKS-011$$, '00000000-2222-0000-0000-000000000291'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001142'::uuid, $$GAS-005$$, '00000000-2222-0000-0000-00000000026c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001143'::uuid, $$YSD-G-100-1$$, '00000000-2222-0000-0000-000000000d66'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001144'::uuid, $$FHJ-001-R4$$, '00000000-2222-0000-0000-000000000261'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001145'::uuid, $$FHJ-001$$, '00000000-2222-0000-0000-000000000260'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001146'::uuid, $$DIC-064$$, '00000000-2222-0000-0000-0000000001f3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001147'::uuid, $$ESJ-002D$$, '00000000-2222-0000-0000-0000000000d1'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001148'::uuid, $$ATS-028D$$, '00000000-2222-0000-0000-000000000186'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001149'::uuid, $$DuraVertical5080$$, '00000000-2222-0000-0000-00000000025c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000114a'::uuid, $$DIM-019-R1$$, '00000000-2222-0000-0000-00000000024d'::uuid, 1, 1, NULL, $$1.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000114b'::uuid, $$DIM-018$$, '00000000-2222-0000-0000-00000000024c'::uuid, 1, 1, NULL, $$1.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000114c'::uuid, $$DIC-151$$, '00000000-2222-0000-0000-00000000023b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000114d'::uuid, $$DIC-147D$$, '00000000-2222-0000-0000-000000000238'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000114e'::uuid, $$DIC-147-R4$$, '00000000-2222-0000-0000-000000000239'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000114f'::uuid, $$DIC-146D$$, '00000000-2222-0000-0000-000000000236'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001150'::uuid, $$DIC-146-R3$$, '00000000-2222-0000-0000-000000000235'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001151'::uuid, $$DIC-145$$, '00000000-2222-0000-0000-000000000234'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001152'::uuid, $$ESJ-003D$$, '00000000-2222-0000-0000-0000000000d2'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001153'::uuid, $$MTM-179$$, '00000000-2222-0000-0000-0000000005fb'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001154'::uuid, $$KOS-016-R3$$, '00000000-2222-0000-0000-000000000455'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001155'::uuid, $$MTM-172X$$, '00000000-2222-0000-0000-0000000005f1'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001156'::uuid, $$MTM-173$$, '00000000-2222-0000-0000-0000000005f2'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001157'::uuid, $$MTM-173X$$, '00000000-2222-0000-0000-0000000005f3'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001158'::uuid, $$MTM-174$$, '00000000-2222-0000-0000-0000000005f4'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001159'::uuid, $$MTM-178D-R6$$, '00000000-2222-0000-0000-0000000005fa'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000115a'::uuid, $$MTM-178-R6ZM3cav/4cav$$, '00000000-2222-0000-0000-0000000005f8'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000115b'::uuid, $$MTM-178D-R3$$, '00000000-2222-0000-0000-0000000005f9'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000115c'::uuid, $$MTM-171$$, '00000000-2222-0000-0000-0000000005ef'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000115d'::uuid, $$MTM-1793cav.4cavVN$$, '00000000-2222-0000-0000-0000000005fc'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000115e'::uuid, $$MTM-170$$, '00000000-2222-0000-0000-0000000005ee'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001160'::uuid, $$MTM-1803CAV/4CAVVn$$, '00000000-2222-0000-0000-0000000005fe'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001161'::uuid, $$MTM-180$$, '00000000-2222-0000-0000-0000000005fd'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001163'::uuid, $$MTM-1813CAV/4CAVVn$$, '00000000-2222-0000-0000-000000000600'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001164'::uuid, $$MTM-181$$, '00000000-2222-0000-0000-0000000005ff'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001166'::uuid, $$MTM-182-R2$$, '00000000-2222-0000-0000-000000000601'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001167'::uuid, $$ALCUTTE-R1310x210JAE$$, '00000000-2222-0000-0000-00000000012c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001169'::uuid, $$KYD-001$$, '00000000-2222-0000-0000-00000000055f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000116a'::uuid, $$ATS-026ASANOROD$$, '00000000-2222-0000-0000-000000000184'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000116c'::uuid, $$ATS-023D$$, '00000000-2222-0000-0000-00000000017f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000116d'::uuid, $$KSP-200-R2$$, '00000000-2222-0000-0000-0000000011b4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000116e'::uuid, $$ASC-002D$$, '00000000-2222-0000-0000-000000000165'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000116f'::uuid, $$ALCUTTE-R1PlateJAE270x270$$, '00000000-2222-0000-0000-000000000132'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001170'::uuid, $$TE-0-057-3$$, '00000000-2222-0000-0000-00000000099d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001171'::uuid, $$ALCUTTE-R1ADY2P$$, '00000000-2222-0000-0000-00000000012f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001172'::uuid, $$MTM-172$$, '00000000-2222-0000-0000-0000000005f0'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001175'::uuid, $$KYD-001D$$, '00000000-2222-0000-0000-00000000055e'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001176'::uuid, $$LMN-001$$, '00000000-2222-0000-0000-00000000056b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001177'::uuid, $$MCT-001D$$, '00000000-2222-0000-0000-00000000058a'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001178'::uuid, $$MILLAC468V$$, '00000000-2222-0000-0000-00000000058f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001179'::uuid, $$ALCUTTE-R1510x340ADY$$, '00000000-2222-0000-0000-00000000012e'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000117a'::uuid, $$ALCUTTE-R1508x335FHJ$$, '00000000-2222-0000-0000-00000000012d'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000117b'::uuid, $$MTM-015$$, '00000000-2222-0000-0000-0000000005d8'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000117c'::uuid, $$MTM-167VN$$, '00000000-2222-0000-0000-0000000005ec'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000117d'::uuid, $$MTM-169$$, '00000000-2222-0000-0000-0000000005ed'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001180'::uuid, $$ドア修理$$, '00000000-2222-0000-0000-000000000ddf'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001181'::uuid, $$WB74ND470x300$$, '00000000-2222-0000-0000-000000000c9f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001182'::uuid, $$TE-243252-1-R1$$, '00000000-2222-0000-0000-000000000a90'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001183'::uuid, $$74CPB-H20$$, '00000000-2222-0000-0000-000000000070'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001184'::uuid, $$サーブ木板　Z-BN1$$, '00000000-2222-0000-0000-000000000dd7'::uuid, 1, 1, $$B$$, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001186'::uuid, $$WTN-006-R1$$, '00000000-2222-0000-0000-000000000cac'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001187'::uuid, $$WB74590x400H60SMK$$, '00000000-2222-0000-0000-000000000c9e'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001189'::uuid, $$WB74530x350$$, '00000000-2222-0000-0000-000000000c9b'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000118a'::uuid, $$WTN-008D$$, '00000000-2222-0000-0000-000000000cb2'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000118b'::uuid, $$サーブ木板ZA$$, '00000000-2222-0000-0000-000000000dd6'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000118c'::uuid, $$WTN-009D-R1$$, '00000000-2222-0000-0000-000000000cb5'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000118d'::uuid, $$TE-2426384-1$$, '00000000-2222-0000-0000-000000000a87'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000118e'::uuid, $$YCM-064$$, '00000000-2222-0000-0000-000000000cdf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000118f'::uuid, $$TE-2423252-2D-R3$$, '00000000-2222-0000-0000-000000000a7e'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001190'::uuid, $$サーブ木板　K$$, '00000000-2222-0000-0000-000000000dd5'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001191'::uuid, $$YCM-069-R1$$, '00000000-2222-0000-0000-000000000ce4'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001193'::uuid, $$TE-243252-2-R1$$, '00000000-2222-0000-0000-000000000a92'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001194'::uuid, $$スタキング共通$$, '00000000-2222-0000-0000-000000000ddb'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001195'::uuid, $$スタキング　Aタイプ$$, '00000000-2222-0000-0000-000000000dda'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001196'::uuid, $$サーブ木板-ZD$$, '00000000-2222-0000-0000-000000000dd8'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001197'::uuid, $$TE-2445925-1$$, '00000000-2222-0000-0000-000000000a97'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001198'::uuid, $$TE-2445924-1$$, '00000000-2222-0000-0000-000000000a96'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000119b'::uuid, $$WB74590x350H65$$, '00000000-2222-0000-0000-000000000c9d'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000119c'::uuid, $$TE-2432957-1$$, '00000000-2222-0000-0000-000000000a93'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000119d'::uuid, $$YCM-071$$, '00000000-2222-0000-0000-000000000ce9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000119f'::uuid, $$WBND470x300x38$$, '00000000-2222-0000-0000-000000000c94'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011a0'::uuid, $$WB74499x347$$, '00000000-2222-0000-0000-000000000c98'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011a1'::uuid, $$WB74500x400x50YMS$$, '00000000-2222-0000-0000-000000000c99'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011a2'::uuid, $$WB74590x350$$, '00000000-2222-0000-0000-000000000c9c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011a3'::uuid, $$WB74UPPE-R1-620x250$$, '00000000-2222-0000-0000-000000000ca0'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011a4'::uuid, $$WB74470x450$$, '00000000-2222-0000-0000-000000000c97'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011a5'::uuid, $$WB74515x347FHJ$$, '00000000-2222-0000-0000-000000000c9a'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011a7'::uuid, $$YSD-Z-100-2D$$, '00000000-2222-0000-0000-000000000d84'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011a8'::uuid, $$TE-2423252-1-R2$$, '00000000-2222-0000-0000-000000000a7a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011a9'::uuid, $$12X356X460$$, '00000000-2222-0000-0000-000000000066'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011aa'::uuid, $$YSD-Z-020-1D$$, '00000000-2222-0000-0000-000000000d79'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011ab'::uuid, $$TE-1-163-2D-R1$$, '00000000-2222-0000-0000-000000000a16'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011ad'::uuid, $$TE-1-163-2D$$, '00000000-2222-0000-0000-000000000a15'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011ae'::uuid, $$TE-1-163-1D$$, '00000000-2222-0000-0000-000000000a14'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011b0'::uuid, $$TE-1-078-9$$, '00000000-2222-0000-0000-0000000009ea'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011b1'::uuid, $$YMS-002D-R2VN$$, '00000000-2222-0000-0000-000000000d0e'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011b2'::uuid, $$YSD-Z-050-3D$$, '00000000-2222-0000-0000-000000000d7f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011b3'::uuid, $$WBZA$$, '00000000-2222-0000-0000-000000000c96'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011b4'::uuid, $$ZA別抜き$$, '00000000-2222-0000-0000-000000000dcb'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011b5'::uuid, $$ZB木板$$, '00000000-2222-0000-0000-000000000dcc'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011b6'::uuid, $$エアコン室外機カーバー$$, '00000000-2222-0000-0000-000000000dcf'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011b7'::uuid, $$カットライン別抜き$$, '00000000-2222-0000-0000-000000000dd0'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011b8'::uuid, $$キリコだし$$, '00000000-2222-0000-0000-000000000dd1'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011b9'::uuid, $$コンプレッサー　PB11MNB5$$, '00000000-2222-0000-0000-000000000dd2'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011ba'::uuid, $$TE-1-160-4(Kaizen)$$, '00000000-2222-0000-0000-000000000a0e'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011bb'::uuid, $$サーブ木板　A$$, '00000000-2222-0000-0000-000000000dd3'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011bc'::uuid, $$Vプーリー$$, '00000000-2222-0000-0000-000000000c93'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011bd'::uuid, $$YCM-071D$$, '00000000-2222-0000-0000-000000000ce8'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011be'::uuid, $$YCM-072$$, '00000000-2222-0000-0000-000000000ceb'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011bf'::uuid, $$YCM-072D$$, '00000000-2222-0000-0000-000000000cea'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011c0'::uuid, $$YCM-073D$$, '00000000-2222-0000-0000-000000000ced'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011c1'::uuid, $$サーブ木板　D$$, '00000000-2222-0000-0000-000000000dd4'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011c2'::uuid, $$YCM-074D$$, '00000000-2222-0000-0000-000000000cee'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011c3'::uuid, $$YES-004$$, '00000000-2222-0000-0000-000000000cf3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011c4'::uuid, $$YMS-069$$, '00000000-2222-0000-0000-000000000d12'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011c6'::uuid, $$YMS-002DVN$$, '00000000-2222-0000-0000-000000000d0f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011c7'::uuid, $$TE-2423252-2-R4$$, '00000000-2222-0000-0000-000000000a7f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011c9'::uuid, $$YMS-001-R2$$, '00000000-2222-0000-0000-000000000d0b'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011cb'::uuid, $$YMS-001D-R1$$, '00000000-2222-0000-0000-000000000d08'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011cc'::uuid, $$YMS-001D-R2$$, '00000000-2222-0000-0000-000000000d09'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011cd'::uuid, $$YMS-002A/BVN$$, '00000000-2222-0000-0000-000000000d0d'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011ce'::uuid, $$YCM-070D-R1$$, '00000000-2222-0000-0000-000000000ce6'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011cf'::uuid, $$TE-2423252-2D-R1$$, '00000000-2222-0000-0000-000000000a7d'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011d0'::uuid, $$SSM-051D$$, '00000000-2222-0000-0000-000000000917'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011d1'::uuid, $$3x246x335$$, '00000000-2222-0000-0000-000000000069'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011d2'::uuid, $$WBRv53470x300$$, '00000000-2222-0000-0000-000000000c95'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011d4'::uuid, $$機械治具$$, '00000000-2222-0000-0000-000000000de1'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011d5'::uuid, $$TE-4-110-6$$, '00000000-2222-0000-0000-000000000aee'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011d6'::uuid, $$SSJ-020$$, '00000000-2222-0000-0000-0000000008df'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011d9'::uuid, $$SMK-217-R6$$, '00000000-2222-0000-0000-0000000008aa'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011db'::uuid, $$SMK-217$$, '00000000-2222-0000-0000-0000000008a9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011dd'::uuid, $$SSM-052D$$, '00000000-2222-0000-0000-000000000918'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011df'::uuid, $$SSM-053D$$, '00000000-2222-0000-0000-00000000091b'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011e0'::uuid, $$SSM-054$$, '00000000-2222-0000-0000-00000000091e'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011e1'::uuid, $$SSM-054D-R2$$, '00000000-2222-0000-0000-00000000091d'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011e3'::uuid, $$SSM-055D$$, '00000000-2222-0000-0000-000000000921'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011e4'::uuid, $$STD-016$$, '00000000-2222-0000-0000-000000000929'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011e5'::uuid, $$SSM-050D$$, '00000000-2222-0000-0000-000000000915'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011e7'::uuid, $$SIT-018D$$, '00000000-2222-0000-0000-000000000815'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011e8'::uuid, $$74CJAECUTTE-R1BASEPLATE$$, '00000000-2222-0000-0000-00000000006f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011e9'::uuid, $$SIT-019D$$, '00000000-2222-0000-0000-000000000817'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011ea'::uuid, $$74CCommonUpperParts$$, '00000000-2222-0000-0000-00000000006e'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011eb'::uuid, $$74CALUMCUTTE-R1BASE$$, '00000000-2222-0000-0000-00000000006d'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011ec'::uuid, $$74CABFO-R1STAKING$$, '00000000-2222-0000-0000-00000000006b'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011ed'::uuid, $$74C-H15UPPE-R1$$, '00000000-2222-0000-0000-000000000073'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011ee'::uuid, $$74CVENEE-R1BASE$$, '00000000-2222-0000-0000-000000000071'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011ef'::uuid, $$TE-5-052-2$$, '00000000-2222-0000-0000-000000000b15'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011f0'::uuid, $$SKK-007-R1$$, '00000000-2222-0000-0000-000000000854'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011f1'::uuid, $$SRI-009$$, '00000000-2222-0000-0000-0000000008d3'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011f6'::uuid, $$TE-7-130-7$$, '00000000-2222-0000-0000-000000000b73'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011f7'::uuid, $$TE-7-127-7$$, '00000000-2222-0000-0000-000000000b6a'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011f8'::uuid, $$TE-6-159-7D$$, '00000000-2222-0000-0000-000000000b57'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011f9'::uuid, $$TE-6-065-3$$, '00000000-2222-0000-0000-000000000b3b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011fa'::uuid, $$5x600x745DIM-018$$, '00000000-2222-0000-0000-00000000006a'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011fb'::uuid, $$SKK-006$$, '00000000-2222-0000-0000-000000000852'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011fc'::uuid, $$26.5ｘ82.5ｘ480$$, '00000000-2222-0000-0000-000000000067'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011fd'::uuid, $$TE-2445926-1$$, '00000000-2222-0000-0000-000000000a98'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000011ff'::uuid, $$TKD-020D$$, '00000000-2222-0000-0000-000000000c24'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001200'::uuid, $$TE-2457435-1M-R1$$, '00000000-2222-0000-0000-000000000a9a'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001201'::uuid, $$TKD-021$$, '00000000-2222-0000-0000-000000000c27'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001202'::uuid, $$TKD-021D$$, '00000000-2222-0000-0000-000000000c26'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001204'::uuid, $$TKD-022$$, '00000000-2222-0000-0000-000000000c28'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001205'::uuid, $$TE-2457436-1-R5$$, '00000000-2222-0000-0000-000000000a9f'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001206'::uuid, $$金型整理$$, '00000000-2222-0000-0000-000000000de2'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001207'::uuid, $$TDW-001D-R3$$, '00000000-2222-0000-0000-00000000097e'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001208'::uuid, $$36x260x380$$, '00000000-2222-0000-0000-000000000068'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000120a'::uuid, $$STF-010D$$, '00000000-2222-0000-0000-000000000935'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000120b'::uuid, $$TBG-031$$, '00000000-2222-0000-0000-00000000096a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000120c'::uuid, $$TKD-022D$$, '00000000-2222-0000-0000-000000000c29'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000120d'::uuid, $$TBG-032$$, '00000000-2222-0000-0000-00000000096b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001211'::uuid, $$SHT-017-R3$$, '00000000-2222-0000-0000-000000000e74'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001212'::uuid, $$SHT-018-R2$$, '00000000-2222-0000-0000-000000000e0a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001213'::uuid, $$TIH-024D$$, '00000000-2222-0000-0000-0000000003c9'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001215'::uuid, $$JAE-326D$$, '00000000-2222-0000-0000-000000000e0e'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001216'::uuid, $$JAE-328D$$, '00000000-2222-0000-0000-000000000e10'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001217'::uuid, $$JAE-330D$$, '00000000-2222-0000-0000-000000000e21'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001218'::uuid, $$JAE-327D$$, '00000000-2222-0000-0000-000000000e0f'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000121a'::uuid, $$MMT-017$$, '00000000-2222-0000-0000-000000000e23'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000121c'::uuid, $$KIK-002-BN1$$, '00000000-2222-0000-0000-000000000e26'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000121d'::uuid, $$NGS-018-R2$$, '00000000-2222-0000-0000-000000000e94'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000121e'::uuid, $$JAE-333-R1$$, '00000000-2222-0000-0000-000000000e25'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000121f'::uuid, $$TDW-001D-R2$$, '00000000-2222-0000-0000-000000000e2c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001220'::uuid, $$HYS-002D$$, '00000000-2222-0000-0000-000000000e2a'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001221'::uuid, $$PNS-010D$$, '00000000-2222-0000-0000-000000000e27'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001222'::uuid, $$WB-ZD470x347UpperH60$$, '00000000-2222-0000-0000-000000000e0b'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001223'::uuid, $$JAE-288A/-BN1$$, '00000000-2222-0000-0000-000000000386'::uuid, 1, 1, $$B$$, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001224'::uuid, $$ATS-027D$$, '00000000-2222-0000-0000-000000000e29'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001225'::uuid, $$JAE-329D-R1$$, '00000000-2222-0000-0000-000000000e24'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001226'::uuid, $$NPK-002$$, '00000000-2222-0000-0000-000000000e2d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001227'::uuid, $$JAE-326-R1$$, '00000000-2222-0000-0000-000000000e2e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001228'::uuid, $$SMK-164$$, '00000000-2222-0000-0000-000000000e2f'::uuid, 1, 1, NULL, $$2.0$$, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000122b'::uuid, $$JAE-327$$, '00000000-2222-0000-0000-000000000e30'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000122f'::uuid, $$JAE-325D-R1$$, '00000000-2222-0000-0000-000000000e32'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001231'::uuid, $$ATS-023$$, '00000000-2222-0000-0000-000000000e33'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001232'::uuid, $$JAE-330-R1$$, '00000000-2222-0000-0000-000000000e34'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001233'::uuid, $$JAE-064-R2$$, '00000000-2222-0000-0000-000000000e35'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001234'::uuid, $$TE-0-720992-4$$, '00000000-2222-0000-0000-000000000e36'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001235'::uuid, $$JAE-328$$, '00000000-2222-0000-0000-000000000e37'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001236'::uuid, $$JAE-329-R1$$, '00000000-2222-0000-0000-000000000e38'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001238'::uuid, $$JAE-009$$, '00000000-2222-0000-0000-000000000e3a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001239'::uuid, $$JAE-207$$, '00000000-2222-0000-0000-000000000e3b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000123b'::uuid, $$JAE-325-R3$$, '00000000-2222-0000-0000-00000000003d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000123c'::uuid, $$JAE-332-R1$$, '00000000-2222-0000-0000-000000000e3d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000123e'::uuid, $$JAE-334$$, '00000000-2222-0000-0000-000000000e4f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000123f'::uuid, $$JAE-335$$, '00000000-2222-0000-0000-000000000e50'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001240'::uuid, $$SIT-020$$, '00000000-2222-0000-0000-000000000e51'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001243'::uuid, $$SIT-021$$, '00000000-2222-0000-0000-000000000e52'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001246'::uuid, $$DIC-149-R5$$, '00000000-2222-0000-0000-000000000e54'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001247'::uuid, $$JAE-336-R1$$, '00000000-2222-0000-0000-000000000e55'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001248'::uuid, $$DIC-150-R3$$, '00000000-2222-0000-0000-000000000e56'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001249'::uuid, $$JAE-143$$, '00000000-2222-0000-0000-000000000e58'::uuid, 1, 1, NULL, $$5.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000124a'::uuid, $$JAE-136$$, '00000000-2222-0000-0000-000000000e59'::uuid, 1, 1, NULL, $$5.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000124c'::uuid, $$JAE-144$$, '00000000-2222-0000-0000-000000000e5b'::uuid, 1, 1, NULL, $$5.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000124d'::uuid, $$JAE-172$$, '00000000-2222-0000-0000-000000000e5c'::uuid, 1, 1, NULL, $$5.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000124e'::uuid, $$JAE-138$$, '00000000-2222-0000-0000-000000000e5d'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000124f'::uuid, $$JAE-142-R1$$, '00000000-2222-0000-0000-000000000e5e'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001252'::uuid, $$MCT-001D-R1$$, '00000000-2222-0000-0000-000000000e61'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001253'::uuid, $$JAE-140-R2$$, '00000000-2222-0000-0000-000000000e62'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001255'::uuid, $$JAE-076$$, '00000000-2222-0000-0000-000000000e63'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000125c'::uuid, $$JAE-077$$, '00000000-2222-0000-0000-000000000e64'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001261'::uuid, $$JAE-068$$, '00000000-2222-0000-0000-000000000e65'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001262'::uuid, $$JAE-084$$, '00000000-2222-0000-0000-000000000e66'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001265'::uuid, $$JAE-115$$, '00000000-2222-0000-0000-000000000e67'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001268'::uuid, $$JAE-125-R1$$, '00000000-2222-0000-0000-000000000e68'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001269'::uuid, $$JAE-151-R1$$, '00000000-2222-0000-0000-000000000e69'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000126a'::uuid, $$JAE-163-R3$$, '00000000-2222-0000-0000-000000000e6a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000126c'::uuid, $$JAE-205$$, '00000000-2222-0000-0000-000000000e6b'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000126e'::uuid, $$JAE-218$$, '00000000-2222-0000-0000-000000000e6c'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000126f'::uuid, $$JAE-237$$, '00000000-2222-0000-0000-000000000e6d'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001270'::uuid, $$JAE-$$, '00000000-2222-0000-0000-000000000e6e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001272'::uuid, $$MOK-006D$$, '00000000-2222-0000-0000-000000000e70'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001273'::uuid, $$JAE-046-N2$$, '00000000-2222-0000-0000-0000000002dd'::uuid, 1, 2, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001276'::uuid, $$GKD-001$$, '00000000-2222-0000-0000-000000000e71'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001277'::uuid, $$TIH-024-R2$$, '00000000-2222-0000-0000-000000000e72'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001279'::uuid, $$HYS-002$$, '00000000-2222-0000-0000-000000000e73'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000127b'::uuid, $$JAE-110$$, '00000000-2222-0000-0000-000000000e75'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000127d'::uuid, $$TE-1-163-1D-R1$$, '00000000-2222-0000-0000-000000000e76'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001281'::uuid, $$TE-1-163-2D-R3$$, '00000000-2222-0000-0000-000000000e77'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001282'::uuid, $$ADY-107$$, '00000000-2222-0000-0000-000000000e78'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001284'::uuid, $$ADY-120$$, '00000000-2222-0000-0000-000000000e79'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001286'::uuid, $$MOK-006$$, '00000000-2222-0000-0000-000000000e7a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001288'::uuid, $$SLK-121$$, '00000000-2222-0000-0000-000000000e7b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001289'::uuid, $$ADV-022$$, '00000000-2222-0000-0000-000000000e7c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000128a'::uuid, $$ODS-024$$, '00000000-2222-0000-0000-000000000e7d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000128b'::uuid, $$NGT-006$$, '00000000-2222-0000-0000-000000000e7e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000128c'::uuid, $$NGT-009$$, '00000000-2222-0000-0000-000000000e7f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000128d'::uuid, $$NGT-004$$, '00000000-2222-0000-0000-000000000e80'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000128e'::uuid, $$Mry-020$$, '00000000-2222-0000-0000-000000000e81'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000128f'::uuid, $$CPL-002$$, '00000000-2222-0000-0000-000000000e82'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001290'::uuid, $$MZT-021$$, '00000000-2222-0000-0000-000000000e83'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001291'::uuid, $$SPJ-007$$, '00000000-2222-0000-0000-000000000e84'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001292'::uuid, $$SMK-017$$, '00000000-2222-0000-0000-000000000e85'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001293'::uuid, $$SMK-030$$, '00000000-2222-0000-0000-000000000e86'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001294'::uuid, $$SMK-045$$, '00000000-2222-0000-0000-000000000e87'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001295'::uuid, $$KDS-051$$, '00000000-2222-0000-0000-000000000e88'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001298'::uuid, $$DIC-152-R1$$, '00000000-2222-0000-0000-000000000e93'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000129a'::uuid, $$TE-3-159-1$$, '00000000-2222-0000-0000-000000000eb2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000129b'::uuid, $$SIT-023$$, '00000000-2222-0000-0000-000000000eb3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000129c'::uuid, $$KOS-018$$, '00000000-2222-0000-0000-000000000eb4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012a2'::uuid, $$NKB-001$$, '00000000-2222-0000-0000-000000000eb6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012a5'::uuid, $$MTM-132$$, '00000000-2222-0000-0000-000000000eb7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012a7'::uuid, $$CPL-001M$$, '00000000-2222-0000-0000-000000000eb9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012a8'::uuid, $$CPL-001C$$, '00000000-2222-0000-0000-000000000eba'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012a9'::uuid, $$DIC-017$$, '00000000-2222-0000-0000-000000000ea4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012aa'::uuid, $$DIC-026$$, '00000000-2222-0000-0000-000000000ebb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012b0'::uuid, $$OTAX-012$$, '00000000-2222-0000-0000-000000000ebc'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012b1'::uuid, $$OTAX-011$$, '00000000-2222-0000-0000-000000000ebd'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012b2'::uuid, $$DIC-006M$$, '00000000-2222-0000-0000-000000000ebe'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012b3'::uuid, $$DIC-006-TN1$$, '00000000-2222-0000-0000-000000000ebf'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012b4'::uuid, $$FDK-001$$, '00000000-2222-0000-0000-000000000ec0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012b5'::uuid, $$FDK-002$$, '00000000-2222-0000-0000-000000000ec1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012b6'::uuid, $$EFC-001$$, '00000000-2222-0000-0000-000000000ec2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012b7'::uuid, $$ADV-028$$, '00000000-2222-0000-0000-000000000e44'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012b8'::uuid, $$TE-2-072-5A$$, '00000000-2222-0000-0000-000000000ec3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012b9'::uuid, $$TE-2-072-5-BN1$$, '00000000-2222-0000-0000-000000000ec4'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012ba'::uuid, $$ODS-036-R1$$, '00000000-2222-0000-0000-000000000ec5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012bb'::uuid, $$TE-2-156-4$$, '00000000-2222-0000-0000-000000000e98'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012bd'::uuid, $$TH-057$$, '00000000-2222-0000-0000-000000000ec7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012be'::uuid, $$TE-2418183-1TYPE1$$, '00000000-2222-0000-0000-000000000ec8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012bf'::uuid, $$TE-2418183-1TYPE2$$, '00000000-2222-0000-0000-000000000ec9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012c0'::uuid, $$ADV-038$$, '00000000-2222-0000-0000-000000000eca'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012c1'::uuid, $$TE-2-145-9$$, '00000000-2222-0000-0000-000000000ecb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012c2'::uuid, $$KDS-124$$, '00000000-2222-0000-0000-000000000ecc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012c3'::uuid, $$SJI-011$$, '00000000-2222-0000-0000-000000000ecd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012c4'::uuid, $$TE-6-073-6$$, '00000000-2222-0000-0000-000000000ece'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012c5'::uuid, $$SEW-001$$, '00000000-2222-0000-0000-000000000ecf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012c6'::uuid, $$TE-1-447287-1$$, '00000000-2222-0000-0000-000000000ed0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012c7'::uuid, $$OMG-003$$, '00000000-2222-0000-0000-000000000e96'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012c8'::uuid, $$BSP-001$$, '00000000-2222-0000-0000-000000000ed1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012cb'::uuid, $$KND-002$$, '00000000-2222-0000-0000-000000000e99'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012cc'::uuid, $$TE-9-130-4$$, '00000000-2222-0000-0000-000000000ed4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012cd'::uuid, $$A3C-002$$, '00000000-2222-0000-0000-000000000ed5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012ce'::uuid, $$TE-023$$, '00000000-2222-0000-0000-000000000ed6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012cf'::uuid, $$TE-7-174-1$$, '00000000-2222-0000-0000-000000000ed7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012d0'::uuid, $$TMT-001$$, '00000000-2222-0000-0000-000000000ed8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012d1'::uuid, $$OPK-001$$, '00000000-2222-0000-0000-000000000ed9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012d2'::uuid, $$TE-6-157-0$$, '00000000-2222-0000-0000-000000000ea0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012d3'::uuid, $$MSP-002$$, '00000000-2222-0000-0000-000000000eda'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012d4'::uuid, $$SWT-002$$, '00000000-2222-0000-0000-000000000edb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012d5'::uuid, $$OOT-029$$, '00000000-2222-0000-0000-000000000edc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012d6'::uuid, $$OMG-004$$, '00000000-2222-0000-0000-000000000edd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012d7'::uuid, $$SJI-003-N2$$, '00000000-2222-0000-0000-00000000081a'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012d8'::uuid, $$ADV-031$$, '00000000-2222-0000-0000-000000000eab'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012d9'::uuid, $$ADV-030$$, '00000000-2222-0000-0000-000000000ede'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012da'::uuid, $$SHT-001$$, '00000000-2222-0000-0000-000000000edf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012db'::uuid, $$SIT-008$$, '00000000-2222-0000-0000-000000000ee0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012dc'::uuid, $$TH-007$$, '00000000-2222-0000-0000-000000000ee1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012dd'::uuid, $$A3C-001$$, '00000000-2222-0000-0000-000000000ee2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012de'::uuid, $$TE-6-074-9$$, '00000000-2222-0000-0000-000000000ee3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012df'::uuid, $$TE-9-142-2$$, '00000000-2222-0000-0000-000000000ee4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012e0'::uuid, $$NGT-003$$, '00000000-2222-0000-0000-000000000ee5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012e1'::uuid, $$TE-3-143-5$$, '00000000-2222-0000-0000-000000000ee6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012e2'::uuid, $$TE-9-143-2$$, '00000000-2222-0000-0000-000000000ee7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012e3'::uuid, $$KKG-004$$, '00000000-2222-0000-0000-000000000ee8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012e4'::uuid, $$TMC-004$$, '00000000-2222-0000-0000-000000000ee9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012e5'::uuid, $$SIT-009$$, '00000000-2222-0000-0000-000000000eea'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012e6'::uuid, $$ADY-116$$, '00000000-2222-0000-0000-000000000eeb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012e7'::uuid, $$KOS-004$$, '00000000-2222-0000-0000-000000000eec'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012e9'::uuid, $$MTY-001$$, '00000000-2222-0000-0000-000000000eee'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012ea'::uuid, $$KOK-005$$, '00000000-2222-0000-0000-000000000eef'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012ec'::uuid, $$KDS-128$$, '00000000-2222-0000-0000-000000000ef1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012ed'::uuid, $$TMT-002$$, '00000000-2222-0000-0000-000000000ef2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012ee'::uuid, $$TBG-029$$, '00000000-2222-0000-0000-000000000ef3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012ef'::uuid, $$TBG-021$$, '00000000-2222-0000-0000-000000000ef4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012f0'::uuid, $$TE-6-142-3$$, '00000000-2222-0000-0000-000000000e4b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012f1'::uuid, $$TE-9-157-7$$, '00000000-2222-0000-0000-000000000ef5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012f2'::uuid, $$TE-2307445-1$$, '00000000-2222-0000-0000-000000000ef6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012f4'::uuid, $$SIT-004$$, '00000000-2222-0000-0000-000000000ef7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012f5'::uuid, $$KND-016$$, '00000000-2222-0000-0000-000000000ef8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012f6'::uuid, $$SLK-131$$, '00000000-2222-0000-0000-000000000ef9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012f7'::uuid, $$SLK-137$$, '00000000-2222-0000-0000-000000000efa'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000012f8'::uuid, $$SLK-139-R1$$, '00000000-2222-0000-0000-000000000efb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000130a'::uuid, $$SLK-132$$, '00000000-2222-0000-0000-000000000efc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000130d'::uuid, $$SLK-134$$, '00000000-2222-0000-0000-000000000efd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000130e'::uuid, $$SLK-138$$, '00000000-2222-0000-0000-000000000efe'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000130f'::uuid, $$SLK-135$$, '00000000-2222-0000-0000-000000000eff'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001310'::uuid, $$SLK-140$$, '00000000-2222-0000-0000-000000000f00'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001311'::uuid, $$SLK-129$$, '00000000-2222-0000-0000-000000000f01'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001312'::uuid, $$SLK-123$$, '00000000-2222-0000-0000-000000000f02'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001313'::uuid, $$SLK-136$$, '00000000-2222-0000-0000-000000000f03'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001314'::uuid, $$SLK-116$$, '00000000-2222-0000-0000-000000000f04'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001315'::uuid, $$SLK-125$$, '00000000-2222-0000-0000-000000000f05'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001316'::uuid, $$SLK-141$$, '00000000-2222-0000-0000-000000000f06'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001317'::uuid, $$SLK-133$$, '00000000-2222-0000-0000-000000000f07'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001318'::uuid, $$OTP-004$$, '00000000-2222-0000-0000-000000000f08'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001319'::uuid, $$OTP-002$$, '00000000-2222-0000-0000-000000000f09'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000131a'::uuid, $$OTP-001$$, '00000000-2222-0000-0000-000000000f0a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000131b'::uuid, $$OTP-005$$, '00000000-2222-0000-0000-000000000f0b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000131c'::uuid, $$OTHER-613$$, '00000000-2222-0000-0000-000000000f0c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000131d'::uuid, $$TE-3-066-6-N2$$, '00000000-2222-0000-0000-000000000ab9'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000131e'::uuid, $$TE-1-145-2$$, '00000000-2222-0000-0000-000000000f0d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000131f'::uuid, $$A3C-003$$, '00000000-2222-0000-0000-000000000f0e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001320'::uuid, $$TE-3-023-0-BN1$$, '00000000-2222-0000-0000-000000000f0f'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001324'::uuid, $$TE-2289554-1$$, '00000000-2222-0000-0000-000000000f13'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001325'::uuid, $$PS-100$$, '00000000-2222-0000-0000-000000000f14'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001326'::uuid, $$PS-050$$, '00000000-2222-0000-0000-000000000f15'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001327'::uuid, $$GMY-091$$, '00000000-2222-0000-0000-000000000f16'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001328'::uuid, $$EFC-002$$, '00000000-2222-0000-0000-000000000f17'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001329'::uuid, $$TE-3-066-8$$, '00000000-2222-0000-0000-000000000f18'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000132a'::uuid, $$TE-3-066-8-N2$$, '00000000-2222-0000-0000-000000000f18'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000132b'::uuid, $$TE-7-162-7$$, '00000000-2222-0000-0000-000000000f19'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000132c'::uuid, $$SKK-005$$, '00000000-2222-0000-0000-000000000e41'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000132d'::uuid, $$KDS-117$$, '00000000-2222-0000-0000-000000000f1a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000132e'::uuid, $$TE-3-066-7-BN1$$, '00000000-2222-0000-0000-000000000aba'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000132f'::uuid, $$TE-2421086-1$$, '00000000-2222-0000-0000-000000000f1b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001330'::uuid, $$YCM-052$$, '00000000-2222-0000-0000-000000000f1c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001332'::uuid, $$KDS-062$$, '00000000-2222-0000-0000-000000000f1d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001333'::uuid, $$TE-5-072-7$$, '00000000-2222-0000-0000-000000000f1e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001334'::uuid, $$TE-3-066-3$$, '00000000-2222-0000-0000-000000000f1f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001335'::uuid, $$TE-5-072-8$$, '00000000-2222-0000-0000-000000000f20'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001336'::uuid, $$TE-5-072-5$$, '00000000-2222-0000-0000-000000000f21'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001337'::uuid, $$A3C-004$$, '00000000-2222-0000-0000-000000000f22'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001338'::uuid, $$YPC-001$$, '00000000-2222-0000-0000-000000000f23'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001339'::uuid, $$TCT-001$$, '00000000-2222-0000-0000-000000000f24'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000133a'::uuid, $$TE-5-072-9$$, '00000000-2222-0000-0000-000000000f25'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000133b'::uuid, $$TE-5-072-3$$, '00000000-2222-0000-0000-000000000f26'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000133c'::uuid, $$CK-003$$, '00000000-2222-0000-0000-000000000e4c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000133d'::uuid, $$YPC-004$$, '00000000-2222-0000-0000-000000000f27'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000133e'::uuid, $$TE-3-059-6$$, '00000000-2222-0000-0000-000000000f28'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000133f'::uuid, $$TE-4-061-3$$, '00000000-2222-0000-0000-000000000f29'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001340'::uuid, $$TE-5-072-2$$, '00000000-2222-0000-0000-000000000f2a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001342'::uuid, $$TE-1-162-9$$, '00000000-2222-0000-0000-000000000f2c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001343'::uuid, $$HIN-003$$, '00000000-2222-0000-0000-000000000f2d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001344'::uuid, $$TE-9-078-7$$, '00000000-2222-0000-0000-000000000f2e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001345'::uuid, $$TE-9-157-6$$, '00000000-2222-0000-0000-000000000f2f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001346'::uuid, $$APF-005$$, '00000000-2222-0000-0000-000000000f30'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001347'::uuid, $$TE-2-156-0-R1$$, '00000000-2222-0000-0000-000000000eac'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001348'::uuid, $$SMK-009$$, '00000000-2222-0000-0000-000000000f31'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001349'::uuid, $$SMK-034$$, '00000000-2222-0000-0000-000000000f32'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000134a'::uuid, $$SMK-001?$$, '00000000-2222-0000-0000-000000000873'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000134b'::uuid, $$TSP-006$$, '00000000-2222-0000-0000-000000000f33'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001354'::uuid, $$SMK-012$$, '00000000-2222-0000-0000-000000000f34'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001355'::uuid, $$SMK-148$$, '00000000-2222-0000-0000-000000000f35'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001356'::uuid, $$SMK-078$$, '00000000-2222-0000-0000-000000000f36'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001357'::uuid, $$SMK-081$$, '00000000-2222-0000-0000-000000000f37'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001359'::uuid, $$SMK-095$$, '00000000-2222-0000-0000-000000000f38'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000135a'::uuid, $$SMK-022$$, '00000000-2222-0000-0000-000000000f39'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000135b'::uuid, $$SMK-021$$, '00000000-2222-0000-0000-000000000f3a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000135c'::uuid, $$SMK-016$$, '00000000-2222-0000-0000-000000000f3b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000135d'::uuid, $$SMK-018$$, '00000000-2222-0000-0000-000000000f3c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000135e'::uuid, $$SMK-064$$, '00000000-2222-0000-0000-000000000f3d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000135f'::uuid, $$SMK-077$$, '00000000-2222-0000-0000-000000000f3e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001360'::uuid, $$SMK-170$$, '00000000-2222-0000-0000-000000000f3f'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001361'::uuid, $$ADY-030$$, '00000000-2222-0000-0000-000000000f40'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001362'::uuid, $$SMK-024$$, '00000000-2222-0000-0000-000000000f41'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001363'::uuid, $$SMK-035$$, '00000000-2222-0000-0000-000000000f42'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001364'::uuid, $$SMK-063$$, '00000000-2222-0000-0000-000000000f43'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001365'::uuid, $$SMK-072$$, '00000000-2222-0000-0000-000000000f44'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001366'::uuid, $$SMK-067$$, '00000000-2222-0000-0000-000000000f45'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001367'::uuid, $$SMK-073$$, '00000000-2222-0000-0000-000000000f46'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001368'::uuid, $$SMK-069$$, '00000000-2222-0000-0000-000000000f47'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001369'::uuid, $$SMK-080$$, '00000000-2222-0000-0000-000000000f48'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000136c'::uuid, $$SMK-082$$, '00000000-2222-0000-0000-000000000f4b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000136d'::uuid, $$SMK-002$$, '00000000-2222-0000-0000-000000000f4c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001371'::uuid, $$SMK-084$$, '00000000-2222-0000-0000-000000000f4e'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001372'::uuid, $$SMK-062$$, '00000000-2222-0000-0000-000000000f4f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001374'::uuid, $$TE-9-103-8$$, '00000000-2222-0000-0000-000000000f50'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001375'::uuid, $$TE-3-156-8$$, '00000000-2222-0000-0000-000000000f51'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001376'::uuid, $$TE-4-156-5$$, '00000000-2222-0000-0000-000000000f52'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001377'::uuid, $$TE-7-157-2$$, '00000000-2222-0000-0000-000000000f53'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001378'::uuid, $$MSP-001$$, '00000000-2222-0000-0000-000000000f54'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001379'::uuid, $$TE-2-145-6$$, '00000000-2222-0000-0000-000000000f55'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000137a'::uuid, $$KSP-127$$, '00000000-2222-0000-0000-000000000f56'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000137b'::uuid, $$TE-016$$, '00000000-2222-0000-0000-000000000f57'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000137c'::uuid, $$TE-004$$, '00000000-2222-0000-0000-000000000f58'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000137d'::uuid, $$TE-021$$, '00000000-2222-0000-0000-000000000f59'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000137e'::uuid, $$TE-8-130-9$$, '00000000-2222-0000-0000-000000000f5a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000137f'::uuid, $$TE-8-130-6$$, '00000000-2222-0000-0000-000000000f5b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001383'::uuid, $$DIC-153$$, '00000000-2222-0000-0000-000000000f5c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001384'::uuid, $$KND-012$$, '00000000-2222-0000-0000-000000000eaa'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001385'::uuid, $$KSC-004$$, '00000000-2222-0000-0000-000000000f5d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001386'::uuid, $$ADV-036$$, '00000000-2222-0000-0000-000000000f5e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001387'::uuid, $$TE-1-108-5$$, '00000000-2222-0000-0000-000000000f5f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001389'::uuid, $$TE-4-075-7$$, '00000000-2222-0000-0000-000000000f60'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000138a'::uuid, $$TE-2289529-1$$, '00000000-2222-0000-0000-000000000f61'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000138b'::uuid, $$TE-1-074-2$$, '00000000-2222-0000-0000-000000000f62'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000138c'::uuid, $$TE-2289548-1$$, '00000000-2222-0000-0000-000000000f63'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000138d'::uuid, $$TE-2289538-1$$, '00000000-2222-0000-0000-000000000f64'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000138e'::uuid, $$TE-7-157-1$$, '00000000-2222-0000-0000-000000000ea8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000138f'::uuid, $$DIC-156$$, '00000000-2222-0000-0000-000000000f65'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001390'::uuid, $$DIC-157$$, '00000000-2222-0000-0000-000000000f66'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001391'::uuid, $$YCM-036-R1$$, '00000000-2222-0000-0000-000000000f67'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001392'::uuid, $$YCM-021$$, '00000000-2222-0000-0000-000000000e9a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001393'::uuid, $$YMT-009$$, '00000000-2222-0000-0000-000000000e9b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001394'::uuid, $$SSK-007$$, '00000000-2222-0000-0000-000000000f68'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001395'::uuid, $$TE-2289513-1$$, '00000000-2222-0000-0000-000000000f69'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001396'::uuid, $$TE-2289530-1$$, '00000000-2222-0000-0000-000000000f6a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001397'::uuid, $$TE-1-074-3$$, '00000000-2222-0000-0000-000000000f6b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001398'::uuid, $$TE-2289556-1$$, '00000000-2222-0000-0000-000000000f6c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001399'::uuid, $$TE-8-142-4$$, '00000000-2222-0000-0000-000000000f6d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000139a'::uuid, $$CK-001$$, '00000000-2222-0000-0000-000000000f6e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000139b'::uuid, $$CK-002$$, '00000000-2222-0000-0000-000000000f6f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000139c'::uuid, $$TE-9-143-0$$, '00000000-2222-0000-0000-000000000f70'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000139d'::uuid, $$TE-9-130-1$$, '00000000-2222-0000-0000-000000000f71'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000139e'::uuid, $$TE-9-130-5$$, '00000000-2222-0000-0000-000000000f72'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000139f'::uuid, $$TE-9-130-3$$, '00000000-2222-0000-0000-000000000f73'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013a0'::uuid, $$YCM-063$$, '00000000-2222-0000-0000-000000000f74'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013a1'::uuid, $$YCM-062$$, '00000000-2222-0000-0000-000000000f75'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013a2'::uuid, $$TE-1-130-1$$, '00000000-2222-0000-0000-000000000f76'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013a3'::uuid, $$TE-2-143-0$$, '00000000-2222-0000-0000-000000000f77'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013a5'::uuid, $$TE-1-108-4$$, '00000000-2222-0000-0000-000000000f79'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013a6'::uuid, $$ODS-039-N2$$, '00000000-2222-0000-0000-00000000072f'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013a8'::uuid, $$TE-9-130-6$$, '00000000-2222-0000-0000-000000000f7a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013a9'::uuid, $$TE-2822661-1$$, '00000000-2222-0000-0000-000000000f7b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013aa'::uuid, $$SMK-150xx$$, '00000000-2222-0000-0000-000000000f7c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013ab'::uuid, $$SMK-159$$, '00000000-2222-0000-0000-000000000f7d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013ac'::uuid, $$SMK-201$$, '00000000-2222-0000-0000-000000000f7e'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013ad'::uuid, $$SMK-145xx$$, '00000000-2222-0000-0000-000000000f7f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013ae'::uuid, $$SMK-154xx$$, '00000000-2222-0000-0000-000000000f80'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013af'::uuid, $$SMK-102$$, '00000000-2222-0000-0000-000000000f81'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013b0'::uuid, $$SMK-083$$, '00000000-2222-0000-0000-000000000f82'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013b1'::uuid, $$SMK-172$$, '00000000-2222-0000-0000-000000000f83'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013b2'::uuid, $$SMK-165$$, '00000000-2222-0000-0000-000000000f84'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013b3'::uuid, $$SMK-046$$, '00000000-2222-0000-0000-000000000f85'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013b4'::uuid, $$SMK-195$$, '00000000-2222-0000-0000-000000000f86'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013b5'::uuid, $$SMK-139$$, '00000000-2222-0000-0000-000000000e92'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013b6'::uuid, $$SMK-199$$, '00000000-2222-0000-0000-000000000f87'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013b7'::uuid, $$SMK-181$$, '00000000-2222-0000-0000-000000000ea2'::uuid, 1, 1, NULL, $$2.0$$, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013b8'::uuid, $$SMK-179$$, '00000000-2222-0000-0000-000000000f88'::uuid, 1, 1, NULL, $$2.0$$, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013b9'::uuid, $$SMK-098$$, '00000000-2222-0000-0000-000000000f89'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013ba'::uuid, $$DIC-072$$, '00000000-2222-0000-0000-000000000f8a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013bb'::uuid, $$DIC-124$$, '00000000-2222-0000-0000-000000000f8b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013bc'::uuid, $$DIC-123$$, '00000000-2222-0000-0000-000000000f8c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013be'::uuid, $$DIC-019-R1$$, '00000000-2222-0000-0000-000000000f8e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013bf'::uuid, $$DIC-020$$, '00000000-2222-0000-0000-000000000f8f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013c0'::uuid, $$DIC-080$$, '00000000-2222-0000-0000-000000000f90'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013c1'::uuid, $$DIC-071$$, '00000000-2222-0000-0000-000000000f91'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013c2'::uuid, $$DIC-081$$, '00000000-2222-0000-0000-000000000f92'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013c3'::uuid, $$DIC-069$$, '00000000-2222-0000-0000-000000000f93'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013c4'::uuid, $$DIC-128$$, '00000000-2222-0000-0000-000000000f94'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013c5'::uuid, $$DIC-025$$, '00000000-2222-0000-0000-000000000f95'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013c6'::uuid, $$DIC-079$$, '00000000-2222-0000-0000-000000000f96'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013c7'::uuid, $$DIC-191$$, '00000000-2222-0000-0000-000000000f97'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013c8'::uuid, $$DIC-182$$, '00000000-2222-0000-0000-000000000f98'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013c9'::uuid, $$DIC-103$$, '00000000-2222-0000-0000-000000000f99'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013ca'::uuid, $$DIC-163$$, '00000000-2222-0000-0000-000000000f9a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013cb'::uuid, $$DIC-035$$, '00000000-2222-0000-0000-000000000f9b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013cc'::uuid, $$DIC-073$$, '00000000-2222-0000-0000-000000000f9c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013cd'::uuid, $$DIC-032$$, '00000000-2222-0000-0000-000000000f9d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013ce'::uuid, $$DIC-082$$, '00000000-2222-0000-0000-000000000f9e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013cf'::uuid, $$DIC-029$$, '00000000-2222-0000-0000-000000000f9f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013d0'::uuid, $$DIC-034$$, '00000000-2222-0000-0000-000000000fa0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013d1'::uuid, $$SMK-157$$, '00000000-2222-0000-0000-000000000fa1'::uuid, 1, 1, NULL, $$2.0$$, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013d2'::uuid, $$SMK-206$$, '00000000-2222-0000-0000-000000000fa2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013d3'::uuid, $$SMK-196$$, '00000000-2222-0000-0000-000000000fa3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013d4'::uuid, $$SMK-076-R1$$, '00000000-2222-0000-0000-000000000fa4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013d5'::uuid, $$SMK-101$$, '00000000-2222-0000-0000-000000000fa5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013d6'::uuid, $$SMK-136$$, '00000000-2222-0000-0000-000000000fa6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013d7'::uuid, $$SMK-197$$, '00000000-2222-0000-0000-000000000fa7'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013d8'::uuid, $$SMK-142$$, '00000000-2222-0000-0000-000000000e97'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013d9'::uuid, $$SMK-173$$, '00000000-2222-0000-0000-000000000fa8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013da'::uuid, $$SMK-153$$, '00000000-2222-0000-0000-000000000fa9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013db'::uuid, $$SMK-105$$, '00000000-2222-0000-0000-000000000faa'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013dc'::uuid, $$SMK-190$$, '00000000-2222-0000-0000-000000000fab'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013dd'::uuid, $$SMK-180$$, '00000000-2222-0000-0000-000000000ea3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013de'::uuid, $$SMK-138$$, '00000000-2222-0000-0000-000000000fac'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013e0'::uuid, $$HSK-046$$, '00000000-2222-0000-0000-000000000fae'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013e2'::uuid, $$YMT-011$$, '00000000-2222-0000-0000-000000000fdf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013e4'::uuid, $$DIC-154$$, '00000000-2222-0000-0000-000000000fe0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013e5'::uuid, $$TKS-020$$, '00000000-2222-0000-0000-000000000fe1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013e6'::uuid, $$TE-6-159-8D$$, '00000000-2222-0000-0000-000000000fe2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013e7'::uuid, $$DIC-155$$, '00000000-2222-0000-0000-000000000fe3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013e8'::uuid, $$TE-1-163-1-R2$$, '00000000-2222-0000-0000-000000000fe4'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013e9'::uuid, $$TE-1-163-2-R4$$, '00000000-2222-0000-0000-000000000fe5'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013ea'::uuid, $$KBY-002-R1$$, '00000000-2222-0000-0000-000000000fe6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013eb'::uuid, $$TE-9-162-7-R4$$, '00000000-2222-0000-0000-000000000fe7'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013ec'::uuid, $$ASH-008D$$, '00000000-2222-0000-0000-000000000fe8'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013ee'::uuid, $$TE-6-159-7-R4$$, '00000000-2222-0000-0000-000000000fe9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013ef'::uuid, $$TE-6-159-8-R1$$, '00000000-2222-0000-0000-000000000fea'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013f0'::uuid, $$ASH-009D$$, '00000000-2222-0000-0000-000000000feb'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013f1'::uuid, $$KRE-013$$, '00000000-2222-0000-0000-000000000fec'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013f3'::uuid, $$TH-002$$, '00000000-2222-0000-0000-000000000fee'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013f4'::uuid, $$TH-003$$, '00000000-2222-0000-0000-000000000fef'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013f5'::uuid, $$TH-005$$, '00000000-2222-0000-0000-000000000ff0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013f6'::uuid, $$JAE-337$$, '00000000-2222-0000-0000-000000000ff1'::uuid, 1, 1, NULL, $$5.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013f7'::uuid, $$SIT-024$$, '00000000-2222-0000-0000-000000000ff2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013f8'::uuid, $$YCM-075-R1$$, '00000000-2222-0000-0000-000000000ff3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013fb'::uuid, $$SK-013$$, '00000000-2222-0000-0000-000000000ff6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013fd'::uuid, $$SK-017$$, '00000000-2222-0000-0000-000000000fca'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013fe'::uuid, $$SK-021$$, '00000000-2222-0000-0000-000000000ff8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000013ff'::uuid, $$SK-022$$, '00000000-2222-0000-0000-000000000fcc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001400'::uuid, $$SK-023$$, '00000000-2222-0000-0000-000000000ff9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001402'::uuid, $$SK-027$$, '00000000-2222-0000-0000-000000000ffb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001404'::uuid, $$SK-034$$, '00000000-2222-0000-0000-000000000ffd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001405'::uuid, $$SK-038$$, '00000000-2222-0000-0000-000000000ffe'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001406'::uuid, $$SK-040$$, '00000000-2222-0000-0000-000000000fff'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001407'::uuid, $$SK-041$$, '00000000-2222-0000-0000-000000001000'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001408'::uuid, $$SK-044$$, '00000000-2222-0000-0000-000000001001'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001409'::uuid, $$SK-045$$, '00000000-2222-0000-0000-000000001002'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000140a'::uuid, $$SK-046-R1$$, '00000000-2222-0000-0000-000000001003'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000140b'::uuid, $$SK-047$$, '00000000-2222-0000-0000-000000001004'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000140c'::uuid, $$ADV-001$$, '00000000-2222-0000-0000-000000000f07'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000140d'::uuid, $$ADV-003$$, '00000000-2222-0000-0000-000000001005'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000140e'::uuid, $$ADV-005$$, '00000000-2222-0000-0000-000000001006'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000140f'::uuid, $$ADV-010$$, '00000000-2222-0000-0000-000000001007'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001410'::uuid, $$ADV-011$$, '00000000-2222-0000-0000-000000001008'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001411'::uuid, $$ADV-012$$, '00000000-2222-0000-0000-000000001009'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001412'::uuid, $$ADV-013$$, '00000000-2222-0000-0000-00000000100a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001413'::uuid, $$ADV-016$$, '00000000-2222-0000-0000-00000000100b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001414'::uuid, $$ADV-020$$, '00000000-2222-0000-0000-00000000100c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001415'::uuid, $$ADV-021$$, '00000000-2222-0000-0000-00000000100d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001416'::uuid, $$TH-020$$, '00000000-2222-0000-0000-00000000100e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001417'::uuid, $$TH-021$$, '00000000-2222-0000-0000-00000000100f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001418'::uuid, $$TH-025$$, '00000000-2222-0000-0000-000000001010'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001419'::uuid, $$TH-041$$, '00000000-2222-0000-0000-000000001011'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000141a'::uuid, $$TH-054$$, '00000000-2222-0000-0000-000000001012'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000141b'::uuid, $$TH-053$$, '00000000-2222-0000-0000-000000001013'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000141c'::uuid, $$TH-052$$, '00000000-2222-0000-0000-000000001014'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000141d'::uuid, $$SPJ-035$$, '00000000-2222-0000-0000-000000001015'::uuid, 1, 1, NULL, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000141e'::uuid, $$SPJ-037$$, '00000000-2222-0000-0000-000000001016'::uuid, 1, 1, NULL, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000141f'::uuid, $$SPJ-038$$, '00000000-2222-0000-0000-000000001017'::uuid, 1, 1, NULL, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001420'::uuid, $$SPJ-039$$, '00000000-2222-0000-0000-000000001018'::uuid, 1, 1, NULL, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001421'::uuid, $$SPJ-041$$, '00000000-2222-0000-0000-000000001019'::uuid, 1, 1, NULL, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001422'::uuid, $$SPJ-045$$, '00000000-2222-0000-0000-00000000101a'::uuid, 1, 1, NULL, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001423'::uuid, $$SPJ-049$$, '00000000-2222-0000-0000-00000000101b'::uuid, 1, 1, NULL, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001424'::uuid, $$SPJ-042$$, '00000000-2222-0000-0000-00000000101c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001425'::uuid, $$SPJ-043$$, '00000000-2222-0000-0000-000000000e46'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001426'::uuid, $$SPJ-050$$, '00000000-2222-0000-0000-00000000101d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001427'::uuid, $$KRE-002$$, '00000000-2222-0000-0000-00000000101e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001428'::uuid, $$KRE-004$$, '00000000-2222-0000-0000-00000000101f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001429'::uuid, $$KRE-005$$, '00000000-2222-0000-0000-000000001020'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000142a'::uuid, $$KRE-006$$, '00000000-2222-0000-0000-000000001021'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000142b'::uuid, $$KRE-007$$, '00000000-2222-0000-0000-000000001022'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000142c'::uuid, $$KRE-011$$, '00000000-2222-0000-0000-000000001023'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000142d'::uuid, $$KRE-017$$, '00000000-2222-0000-0000-000000001024'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000142e'::uuid, $$KRE-040-R1$$, '00000000-2222-0000-0000-000000001025'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000142f'::uuid, $$KRE-041$$, '00000000-2222-0000-0000-000000001026'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001430'::uuid, $$KRE-042$$, '00000000-2222-0000-0000-000000001027'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001431'::uuid, $$KRE-047$$, '00000000-2222-0000-0000-000000001028'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001432'::uuid, $$KRE-051$$, '00000000-2222-0000-0000-000000001029'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001433'::uuid, $$CST-012$$, '00000000-2222-0000-0000-00000000102a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001434'::uuid, $$CST-013$$, '00000000-2222-0000-0000-00000000102b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001435'::uuid, $$KSP-019-BN1$$, '00000000-2222-0000-0000-00000000102c'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001436'::uuid, $$KSP-028$$, '00000000-2222-0000-0000-00000000102d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001437'::uuid, $$KSP-047$$, '00000000-2222-0000-0000-00000000102e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001438'::uuid, $$KSP-048$$, '00000000-2222-0000-0000-00000000102f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001439'::uuid, $$KSP-049A$$, '00000000-2222-0000-0000-000000001030'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000143a'::uuid, $$KSP-051AB$$, '00000000-2222-0000-0000-000000001031'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000143b'::uuid, $$KSP-052$$, '00000000-2222-0000-0000-000000001032'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000143c'::uuid, $$KSP-054AB$$, '00000000-2222-0000-0000-000000001033'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000143d'::uuid, $$KSP-055$$, '00000000-2222-0000-0000-000000001034'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000143e'::uuid, $$KSP-056$$, '00000000-2222-0000-0000-000000001035'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000143f'::uuid, $$KSP-057$$, '00000000-2222-0000-0000-000000001036'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001440'::uuid, $$KSP-058$$, '00000000-2222-0000-0000-000000001037'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001441'::uuid, $$KSP-059$$, '00000000-2222-0000-0000-000000001038'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001442'::uuid, $$KSP-060$$, '00000000-2222-0000-0000-000000001039'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001443'::uuid, $$KSP-068$$, '00000000-2222-0000-0000-000000000e9c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001444'::uuid, $$KSP-076AB$$, '00000000-2222-0000-0000-00000000103a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001445'::uuid, $$KSP-081$$, '00000000-2222-0000-0000-000000000e9e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001446'::uuid, $$KSP-090-R1$$, '00000000-2222-0000-0000-00000000103b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001447'::uuid, $$KSP-100$$, '00000000-2222-0000-0000-00000000103c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001448'::uuid, $$ADY-052$$, '00000000-2222-0000-0000-000000000454'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001449'::uuid, $$ADY-056$$, '00000000-2222-0000-0000-00000000103e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000144a'::uuid, $$ADY-057$$, '00000000-2222-0000-0000-00000000103f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000144b'::uuid, $$ADY-058$$, '00000000-2222-0000-0000-000000001040'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000144c'::uuid, $$ADY-065$$, '00000000-2222-0000-0000-000000000eae'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000144d'::uuid, $$ADY-066$$, '00000000-2222-0000-0000-000000000eaf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000144e'::uuid, $$ADY-093$$, '00000000-2222-0000-0000-000000001041'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000144f'::uuid, $$ADY-095$$, '00000000-2222-0000-0000-000000001042'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001450'::uuid, $$ADY-100$$, '00000000-2222-0000-0000-000000001043'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001451'::uuid, $$ADY-109$$, '00000000-2222-0000-0000-000000001044'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001452'::uuid, $$ETS-023$$, '00000000-2222-0000-0000-000000001045'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001454'::uuid, $$DIC-047旧$$, '00000000-2222-0000-0000-000000001046'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001455'::uuid, $$DIC-048旧$$, '00000000-2222-0000-0000-000000001047'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001456'::uuid, $$MZT-003$$, '00000000-2222-0000-0000-000000001048'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001457'::uuid, $$MZT-004$$, '00000000-2222-0000-0000-000000001049'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001458'::uuid, $$MZT-011$$, '00000000-2222-0000-0000-00000000104a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001459'::uuid, $$MZT-017$$, '00000000-2222-0000-0000-00000000104b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000145a'::uuid, $$MZT-018$$, '00000000-2222-0000-0000-00000000104c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000145b'::uuid, $$MZT-022$$, '00000000-2222-0000-0000-00000000104d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000145c'::uuid, $$下スタキング　Aタイプ$$, '00000000-2222-0000-0000-00000000104e'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000145d'::uuid, $$MZT-024$$, '00000000-2222-0000-0000-00000000104f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000145e'::uuid, $$MZT-025$$, '00000000-2222-0000-0000-000000000e8e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000145f'::uuid, $$MZT-026$$, '00000000-2222-0000-0000-000000000e8f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001460'::uuid, $$MZT-027$$, '00000000-2222-0000-0000-000000001050'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001461'::uuid, $$MZT-028$$, '00000000-2222-0000-0000-000000000e8a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001462'::uuid, $$MZT-029$$, '00000000-2222-0000-0000-000000000e8b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001463'::uuid, $$MZT-030$$, '00000000-2222-0000-0000-000000001051'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001464'::uuid, $$MZT-031$$, '00000000-2222-0000-0000-000000000e8c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001466'::uuid, $$MZT-035$$, '00000000-2222-0000-0000-000000001053'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001467'::uuid, $$MZT-039$$, '00000000-2222-0000-0000-000000001054'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001468'::uuid, $$MZT-040$$, '00000000-2222-0000-0000-000000001055'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001469'::uuid, $$MZT-041$$, '00000000-2222-0000-0000-000000000e90'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000146a'::uuid, $$MZT-043$$, '00000000-2222-0000-0000-000000001056'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000146b'::uuid, $$MZT-044$$, '00000000-2222-0000-0000-000000001057'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000146d'::uuid, $$MZT-059$$, '00000000-2222-0000-0000-000000001059'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000146e'::uuid, $$MZT-061$$, '00000000-2222-0000-0000-000000000eb0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000146f'::uuid, $$MZT-066$$, '00000000-2222-0000-0000-00000000105a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001470'::uuid, $$MZT-071$$, '00000000-2222-0000-0000-00000000105b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001471'::uuid, $$MZT-072$$, '00000000-2222-0000-0000-00000000105c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001472'::uuid, $$HSH-002-R1$$, '00000000-2222-0000-0000-00000000105d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001475'::uuid, $$MCT-003-R2$$, '00000000-2222-0000-0000-0000000010d5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001479'::uuid, $$K-タイプ　70$$, '00000000-2222-0000-0000-000000001065'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000147a'::uuid, $$TBG-020$$, '00000000-2222-0000-0000-000000001066'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000147c'::uuid, $$NHC-004$$, '00000000-2222-0000-0000-000000001068'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000147f'::uuid, $$QAS-001$$, '00000000-2222-0000-0000-000000001069'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001480'::uuid, $$KDS-072$$, '00000000-2222-0000-0000-00000000106a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001481'::uuid, $$KDS-086$$, '00000000-2222-0000-0000-00000000106b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001482'::uuid, $$HKS-009$$, '00000000-2222-0000-0000-00000000106c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001483'::uuid, $$NHC-005$$, '00000000-2222-0000-0000-00000000106d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001484'::uuid, $$KDS-076$$, '00000000-2222-0000-0000-00000000106e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001485'::uuid, $$KDS-077$$, '00000000-2222-0000-0000-00000000106f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001486'::uuid, $$KDS-245$$, '00000000-2222-0000-0000-000000001070'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001487'::uuid, $$KDS-099$$, '00000000-2222-0000-0000-000000001071'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001488'::uuid, $$MIS-2-002$$, '00000000-2222-0000-0000-000000001072'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001489'::uuid, $$MIS-2-003$$, '00000000-2222-0000-0000-000000001073'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000148a'::uuid, $$KDS-083$$, '00000000-2222-0000-0000-000000001074'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000148b'::uuid, $$KDS-084$$, '00000000-2222-0000-0000-000000001075'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000148c'::uuid, $$KDS-085$$, '00000000-2222-0000-0000-000000001076'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000148d'::uuid, $$JAE-109$$, '00000000-2222-0000-0000-000000001077'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000148f'::uuid, $$TE-3-157-7$$, '00000000-2222-0000-0000-000000001078'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001490'::uuid, $$SMK-194$$, '00000000-2222-0000-0000-000000001079'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001491'::uuid, $$SMK-200$$, '00000000-2222-0000-0000-00000000107a'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001492'::uuid, $$SSI-003$$, '00000000-2222-0000-0000-00000000107b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001493'::uuid, $$OTAX-021$$, '00000000-2222-0000-0000-00000000107c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001495'::uuid, $$KYM-001$$, '00000000-2222-0000-0000-00000000107e'::uuid, 1, 1, NULL, $$2.0$$, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001496'::uuid, $$KYM-002$$, '00000000-2222-0000-0000-00000000107f'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001497'::uuid, $$KYM-003$$, '00000000-2222-0000-0000-000000001080'::uuid, 1, 1, NULL, $$2.0$$, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001498'::uuid, $$TE-3-720996-6$$, '00000000-2222-0000-0000-000000001081'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001499'::uuid, $$MZT-104$$, '00000000-2222-0000-0000-000000001082'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000149a'::uuid, $$SNS-002$$, '00000000-2222-0000-0000-000000001083'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000149e'::uuid, $$J-R1$$, '00000000-2222-0000-0000-000000001086'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000149f'::uuid, $$TE-0-108-3$$, '00000000-2222-0000-0000-000000001087'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014a0'::uuid, $$NPC$$, '00000000-2222-0000-0000-000000001088'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014a1'::uuid, $$SMK-155$$, '00000000-2222-0000-0000-000000001089'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014a2'::uuid, $$YSD-E$$, '00000000-2222-0000-0000-00000000108a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014a3'::uuid, $$PS-100-1$$, '00000000-2222-0000-0000-00000000108b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014a4'::uuid, $$TH$$, '00000000-2222-0000-0000-00000000108c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014a5'::uuid, $$TE-2-135-8$$, '00000000-2222-0000-0000-00000000108d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014a6'::uuid, $$KGD-002$$, '00000000-2222-0000-0000-00000000108e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014a7'::uuid, $$YSD-H$$, '00000000-2222-0000-0000-00000000108f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014a8'::uuid, $$SSJ-013$$, '00000000-2222-0000-0000-000000001090'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014a9'::uuid, $$SSJ-019$$, '00000000-2222-0000-0000-000000001091'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014aa'::uuid, $$YPC-005$$, '00000000-2222-0000-0000-000000001092'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014ab'::uuid, $$YPC-008$$, '00000000-2222-0000-0000-000000001093'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014ac'::uuid, $$KRE-049-R1$$, '00000000-2222-0000-0000-000000001094'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014ae'::uuid, $$TE-9-127-2$$, '00000000-2222-0000-0000-000000001096'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014af'::uuid, $$ADY$$, '00000000-2222-0000-0000-000000001097'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014b0'::uuid, $$EXD-005$$, '00000000-2222-0000-0000-000000001098'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014b1'::uuid, $$MZT-049$$, '00000000-2222-0000-0000-000000001099'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014b2'::uuid, $$SMK-089$$, '00000000-2222-0000-0000-00000000109a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014b3'::uuid, $$GMY-088$$, '00000000-2222-0000-0000-00000000109b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014b4'::uuid, $$SSM$$, '00000000-2222-0000-0000-00000000109c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014b5'::uuid, $$JAE-021$$, '00000000-2222-0000-0000-00000000109d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014b6'::uuid, $$JAE-022$$, '00000000-2222-0000-0000-00000000109e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014b7'::uuid, $$MTM-003$$, '00000000-2222-0000-0000-00000000109f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014b8'::uuid, $$KSP-118$$, '00000000-2222-0000-0000-0000000010a0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014b9'::uuid, $$V$$, '00000000-2222-0000-0000-0000000010a1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014ba'::uuid, $$SMK-104$$, '00000000-2222-0000-0000-0000000010a2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014bb'::uuid, $$SMK-119$$, '00000000-2222-0000-0000-0000000010a3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014bc'::uuid, $$CLDS$$, '00000000-2222-0000-0000-0000000010a4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014bd'::uuid, $$OOT-036$$, '00000000-2222-0000-0000-0000000010bc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014be'::uuid, $$TE-1-163-2-R5$$, '00000000-2222-0000-0000-0000000010d6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014bf'::uuid, $$DIC-158-R1$$, '00000000-2222-0000-0000-0000000010d7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014c0'::uuid, $$DIC-159-R1$$, '00000000-2222-0000-0000-0000000010d8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014c1'::uuid, $$YSD-E-025-1$$, '00000000-2222-0000-0000-0000000010d9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014c2'::uuid, $$YSD-E-032-1$$, '00000000-2222-0000-0000-0000000010da'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014c3'::uuid, $$ODS-049$$, '00000000-2222-0000-0000-0000000010db'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014c4'::uuid, $$ODS-050$$, '00000000-2222-0000-0000-0000000010dc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014c5'::uuid, $$ODS-046$$, '00000000-2222-0000-0000-0000000010dd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014c6'::uuid, $$YSD-E-080$$, '00000000-2222-0000-0000-0000000010de'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014c7'::uuid, $$YSD-E-050-1$$, '00000000-2222-0000-0000-0000000010df'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014c8'::uuid, $$SMK-191$$, '00000000-2222-0000-0000-0000000010e0'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014c9'::uuid, $$JAE-337D-R1$$, '00000000-2222-0000-0000-0000000010e1'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014cc'::uuid, $$JAE-338D-R2$$, '00000000-2222-0000-0000-0000000010e4'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014cd'::uuid, $$TE-4-720990-2$$, '00000000-2222-0000-0000-0000000010e5'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014ce'::uuid, $$PLX-003$$, '00000000-2222-0000-0000-0000000010e6'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014cf'::uuid, $$KOS-021$$, '00000000-2222-0000-0000-0000000010e7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014d0'::uuid, $$KOS-022$$, '00000000-2222-0000-0000-000000000822'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014d1'::uuid, $$SRI-007D-R1$$, '00000000-2222-0000-0000-0000000010e9'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014d2'::uuid, $$BSP-002D$$, '00000000-2222-0000-0000-0000000010eb'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014d3'::uuid, $$ADY-128-R2$$, '00000000-2222-0000-0000-0000000010ec'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014d4'::uuid, $$SMK-219-R1$$, '00000000-2222-0000-0000-0000000010ed'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014d5'::uuid, $$JAE-342$$, '00000000-2222-0000-0000-0000000010ee'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014d6'::uuid, $$JAE-341$$, '00000000-2222-0000-0000-0000000010ef'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014d9'::uuid, $$SRI-007-R1$$, '00000000-2222-0000-0000-0000000010f0'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014da'::uuid, $$JAE-338-R2$$, '00000000-2222-0000-0000-0000000010f1'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014db'::uuid, $$ASH-008-R1$$, '00000000-2222-0000-0000-0000000010f2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014dc'::uuid, $$ASH-009-R1$$, '00000000-2222-0000-0000-0000000010f3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014dd'::uuid, $$BSP-002$$, '00000000-2222-0000-0000-0000000010f4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014de'::uuid, $$TKP-001$$, '00000000-2222-0000-0000-0000000010f5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014e2'::uuid, $$ODS-R-31$$, '00000000-2222-0000-0000-0000000010f8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014e4'::uuid, $$TY-001$$, '00000000-2222-0000-0000-0000000010f9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014e5'::uuid, $$DIC-037-N2$$, '00000000-2222-0000-0000-0000000010fa'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014e6'::uuid, $$SMK-140$$, '00000000-2222-0000-0000-0000000010fb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014e8'::uuid, $$SMK-103$$, '00000000-2222-0000-0000-0000000010fc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014e9'::uuid, $$SMK-128$$, '00000000-2222-0000-0000-0000000010fd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014ea'::uuid, $$SMK-134$$, '00000000-2222-0000-0000-0000000010fe'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;

COMMIT;
