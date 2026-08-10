-- PART 12/14
BEGIN;

INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008c5'::uuid, $$TE-6-156-6$$, '00000000-2222-0000-0000-000000000b4f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008c6'::uuid, $$TE-6-076-7$$, '00000000-2222-0000-0000-000000000b3e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008c7'::uuid, $$TE-5-062-0$$, '00000000-2222-0000-0000-000000000b1c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008c8'::uuid, $$TE-5-159-9-R5$$, '00000000-2222-0000-0000-000000000b35'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008c9'::uuid, $$TE-5-127-0$$, '00000000-2222-0000-0000-000000000b23'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008ca'::uuid, $$TE-5-157-8$$, '00000000-2222-0000-0000-000000000b33'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008cb'::uuid, $$TE-5-130-8$$, '00000000-2222-0000-0000-000000000b2c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008cc'::uuid, $$TE-5-127-9$$, '00000000-2222-0000-0000-000000000b25'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008cd'::uuid, $$TE-5-129-0$$, '00000000-2222-0000-0000-000000000b26'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008ce'::uuid, $$TE-5-056-6$$, '00000000-2222-0000-0000-000000000b19'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008cf'::uuid, $$TE-5-052-4$$, '00000000-2222-0000-0000-000000000b18'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008d0'::uuid, $$TE-5-052-3$$, '00000000-2222-0000-0000-000000000b17'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008d1'::uuid, $$TE-4-159-1$$, '00000000-2222-0000-0000-000000000b03'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008d2'::uuid, $$TE-5-052-2PP.PS$$, '00000000-2222-0000-0000-000000000b16'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008d3'::uuid, $$TE-5-127-6$$, '00000000-2222-0000-0000-000000000b24'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008d4'::uuid, $$TE-5-142-6$$, '00000000-2222-0000-0000-000000000b2f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008d5'::uuid, $$TE-5-157-7$$, '00000000-2222-0000-0000-000000000b32'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008d6'::uuid, $$TE-4-142-3$$, '00000000-2222-0000-0000-000000000afc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008d7'::uuid, $$TE-4-003-0$$, '00000000-2222-0000-0000-000000000adf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008d8'::uuid, $$TE-4-157-6$$, '00000000-2222-0000-0000-000000000b02'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008d9'::uuid, $$TE-4-130-5$$, '00000000-2222-0000-0000-000000000af9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008da'::uuid, $$TE-4-127-1$$, '00000000-2222-0000-0000-000000000af0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008db'::uuid, $$TE-4-161-8$$, '00000000-2222-0000-0000-000000000b11'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008dc'::uuid, $$TE-4-129-3$$, '00000000-2222-0000-0000-000000000af3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008dd'::uuid, $$TE-4-129-9$$, '00000000-2222-0000-0000-000000000af5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008de'::uuid, $$TE-4-075-5$$, '00000000-2222-0000-0000-000000000ae8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008e0'::uuid, $$TE-4-077-4$$, '00000000-2222-0000-0000-000000000ae9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008e1'::uuid, $$TE-4-156-2-R1$$, '00000000-2222-0000-0000-000000000b00'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008e2'::uuid, $$TE-4-062-9$$, '00000000-2222-0000-0000-000000000ae2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008e3'::uuid, $$TE-4-159-2$$, '00000000-2222-0000-0000-000000000b04'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008e4'::uuid, $$TE-4-142-6$$, '00000000-2222-0000-0000-000000000afd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008e5'::uuid, $$TE-4-103-1$$, '00000000-2222-0000-0000-000000000aec'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008e6'::uuid, $$TE-4-159-5$$, '00000000-2222-0000-0000-000000000b07'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008e7'::uuid, $$TE-4-108-0$$, '00000000-2222-0000-0000-000000000aed'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008e8'::uuid, $$TE-4-127-7$$, '00000000-2222-0000-0000-000000000af2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008e9'::uuid, $$TE-4-127-2$$, '00000000-2222-0000-0000-000000000af1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008ea'::uuid, $$TE-4-156-0$$, '00000000-2222-0000-0000-000000000afe'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008eb'::uuid, $$TE-4-075-4$$, '00000000-2222-0000-0000-000000000ae7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008ec'::uuid, $$TE-4-059-5$$, '00000000-2222-0000-0000-000000000ae0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008ed'::uuid, $$TE-4-059-8$$, '00000000-2222-0000-0000-000000000ae1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008ef'::uuid, $$TE-3-078-0$$, '00000000-2222-0000-0000-000000000abc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008f0'::uuid, $$TE-3-020-0$$, '00000000-2222-0000-0000-000000000aa5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008f1'::uuid, $$TE-3-062-8$$, '00000000-2222-0000-0000-000000000ab7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008f2'::uuid, $$TE-3-020-5$$, '00000000-2222-0000-0000-000000000aa8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008f3'::uuid, $$TE-3-059-1$$, '00000000-2222-0000-0000-000000000ab6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008f4'::uuid, $$TE-3-143-0$$, '00000000-2222-0000-0000-000000000acc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008f5'::uuid, $$TE-3-127-1$$, '00000000-2222-0000-0000-000000000ac0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008f6'::uuid, $$TE-3-079-0$$, '00000000-2222-0000-0000-000000000abd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008f7'::uuid, $$TE-3-129-2$$, '00000000-2222-0000-0000-000000000ac7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008f8'::uuid, $$TE-3-127-9$$, '00000000-2222-0000-0000-000000000ac4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008f9'::uuid, $$TE-3-020-6$$, '00000000-2222-0000-0000-000000000aa9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008fa'::uuid, $$TE-3-050-3$$, '00000000-2222-0000-0000-000000000ab1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008fb'::uuid, $$TE-2-071-3$$, '00000000-2222-0000-0000-000000000a3a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008fc'::uuid, $$TE-3-127-2$$, '00000000-2222-0000-0000-000000000ac1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008fd'::uuid, $$TE-2-156-5$$, '00000000-2222-0000-0000-000000000a5a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000008fe'::uuid, $$TE-3-156-0$$, '00000000-2222-0000-0000-000000000acf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000900'::uuid, $$TE-2299204-1$$, '00000000-2222-0000-0000-000000000a65'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000901'::uuid, $$TE-3-159-0$$, '00000000-2222-0000-0000-000000000ad2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000902'::uuid, $$TE-3-077-2$$, '00000000-2222-0000-0000-000000000abb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000903'::uuid, $$TE-3-054-7$$, '00000000-2222-0000-0000-000000000ab5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000904'::uuid, $$TE-3-160-9-R3$$, '00000000-2222-0000-0000-000000000ad7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000905'::uuid, $$TE-3-145-1$$, '00000000-2222-0000-0000-000000000ace'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000906'::uuid, $$TE-3-145-0$$, '00000000-2222-0000-0000-000000000acd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000907'::uuid, $$TE-3-020-4$$, '00000000-2222-0000-0000-000000000aa7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000908'::uuid, $$TE-2425816-1$$, '00000000-2222-0000-0000-000000000a85'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000909'::uuid, $$TE-2404949-1$$, '00000000-2222-0000-0000-000000000a73'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000090a'::uuid, $$TE-3-020-1$$, '00000000-2222-0000-0000-000000000aa6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000090b'::uuid, $$TE-3-050-5$$, '00000000-2222-0000-0000-000000000ab2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000090c'::uuid, $$TE-3-161-1$$, '00000000-2222-0000-0000-000000000ad8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000090d'::uuid, $$TE-3-020-9$$, '00000000-2222-0000-0000-000000000aab'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000090e'::uuid, $$TE-2425819-1$$, '00000000-2222-0000-0000-000000000a86'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000090f'::uuid, $$TE-2-020-7$$, '00000000-2222-0000-0000-000000000a2a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000910'::uuid, $$TE-2-127-0$$, '00000000-2222-0000-0000-000000000a47'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000911'::uuid, $$TE-2-051-8$$, '00000000-2222-0000-0000-000000000a32'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000912'::uuid, $$TE-2-051-7$$, '00000000-2222-0000-0000-000000000a31'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000913'::uuid, $$TE-2-110-9$$, '00000000-2222-0000-0000-000000000a46'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000914'::uuid, $$TE-2317776-1$$, '00000000-2222-0000-0000-000000000a67'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000915'::uuid, $$TE-3-020-8$$, '00000000-2222-0000-0000-000000000aaa'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000916'::uuid, $$TE-2-145-0$$, '00000000-2222-0000-0000-000000000a58'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000917'::uuid, $$TE-3-202-3$$, '00000000-2222-0000-0000-000000000ade'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000918'::uuid, $$TE-2220494-1$$, '00000000-2222-0000-0000-000000000a61'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000919'::uuid, $$TE-2-110-4$$, '00000000-2222-0000-0000-000000000a44'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000091a'::uuid, $$TE-2374957-1$$, '00000000-2222-0000-0000-000000000a70'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000091b'::uuid, $$TE-2374959-1$$, '00000000-2222-0000-0000-000000000a71'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000091d'::uuid, $$TE-2434480-1$$, '00000000-2222-0000-0000-000000000a94'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000091e'::uuid, $$TE-2-127-1$$, '00000000-2222-0000-0000-000000000a48'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000091f'::uuid, $$TE-2-159-9$$, '00000000-2222-0000-0000-000000000a5d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000920'::uuid, $$TE-2-156-9$$, '00000000-2222-0000-0000-000000000a5c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000921'::uuid, $$TE-2-160-7$$, '00000000-2222-0000-0000-000000000a5e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000922'::uuid, $$TE-2301581-1$$, '00000000-2222-0000-0000-000000000a66'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000924'::uuid, $$TE-2078105-3$$, '00000000-2222-0000-0000-000000000a3e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000925'::uuid, $$TE-2-023-1$$, '00000000-2222-0000-0000-000000000a2c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000926'::uuid, $$TE-2325786-2$$, '00000000-2222-0000-0000-000000000a6a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000927'::uuid, $$TE-2-160-8$$, '00000000-2222-0000-0000-000000000a5f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000928'::uuid, $$TE-2-145-8$$, '00000000-2222-0000-0000-000000000a59'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000929'::uuid, $$TE-2822660-1-R1$$, '00000000-2222-0000-0000-000000000aa4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000092a'::uuid, $$TE-2320493-1$$, '00000000-2222-0000-0000-000000000a68'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000092b'::uuid, $$TE-2-127-7$$, '00000000-2222-0000-0000-000000000a49'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000092c'::uuid, $$TE-2366113-1$$, '00000000-2222-0000-0000-000000000a6b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000092d'::uuid, $$TE-2373028-1$$, '00000000-2222-0000-0000-000000000a6e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000092e'::uuid, $$TE-2-129-2$$, '00000000-2222-0000-0000-000000000a4a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000092f'::uuid, $$TE-2-020-6$$, '00000000-2222-0000-0000-000000000a29'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000930'::uuid, $$TE-2-063-7$$, '00000000-2222-0000-0000-000000000a39'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000933'::uuid, $$TE-2-077-7$$, '00000000-2222-0000-0000-000000000a3b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000934'::uuid, $$TE-2-060-8$$, '00000000-2222-0000-0000-000000000a38'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000935'::uuid, $$TE-2325786-1$$, '00000000-2222-0000-0000-000000000a69'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000936'::uuid, $$TE-2822118-1$$, '00000000-2222-0000-0000-000000000aa3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000937'::uuid, $$TE-2296618-R1$$, '00000000-2222-0000-0000-000000000a63'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000938'::uuid, $$TE-2289555-1$$, '00000000-2222-0000-0000-000000000a62'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000939'::uuid, $$TE-2297070-1$$, '00000000-2222-0000-0000-000000000a64'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000093a'::uuid, $$TE-2-020-4$$, '00000000-2222-0000-0000-000000000a27'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000093b'::uuid, $$TE-2457435-1$$, '00000000-2222-0000-0000-000000000a99'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000093c'::uuid, $$TE-2411390-1$$, '00000000-2222-0000-0000-000000000a74'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000093d'::uuid, $$TE-2379489-1$$, '00000000-2222-0000-0000-000000000a72'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000093e'::uuid, $$TE-2371191-1$$, '00000000-2222-0000-0000-000000000a6c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000093f'::uuid, $$TE-2371206-1$$, '00000000-2222-0000-0000-000000000a6d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000940'::uuid, $$TE-2457436-1-R2$$, '00000000-2222-0000-0000-000000000a9d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000941'::uuid, $$TE-2457436-1$$, '00000000-2222-0000-0000-000000000a9c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000942'::uuid, $$TE-8-050-3$$, '00000000-2222-0000-0000-000000000b82'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000943'::uuid, $$TE-1279509-3$$, '00000000-2222-0000-0000-000000000a21'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000945'::uuid, $$TE-1-141-7$$, '00000000-2222-0000-0000-000000000a06'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000946'::uuid, $$TE-1-130-8$$, '00000000-2222-0000-0000-000000000a00'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000947'::uuid, $$TE-1-073-1$$, '00000000-2222-0000-0000-0000000009e7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000094b'::uuid, $$KDS-023$$, '00000000-2222-0000-0000-0000000003bc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000094c'::uuid, $$TE-1-056-3$$, '00000000-2222-0000-0000-0000000009e5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000094d'::uuid, $$TE-1-143-9$$, '00000000-2222-0000-0000-000000000a07'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000094e'::uuid, $$TE-1-127-6$$, '00000000-2222-0000-0000-0000000009f6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000094f'::uuid, $$TE-1279509-2$$, '00000000-2222-0000-0000-000000000a20'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000950'::uuid, $$TE-1-145-1$$, '00000000-2222-0000-0000-000000000a08'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000951'::uuid, $$TE-0-156-1$$, '00000000-2222-0000-0000-0000000009b8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000952'::uuid, $$TE-1-141-1$$, '00000000-2222-0000-0000-000000000a03'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000953'::uuid, $$YCM-015$$, '00000000-2222-0000-0000-000000000cb8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000954'::uuid, $$YCM-016$$, '00000000-2222-0000-0000-000000000cb9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000955'::uuid, $$SMK-207$$, '00000000-2222-0000-0000-0000000008a1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000956'::uuid, $$TE-1-162-2旧金型$$, '00000000-2222-0000-0000-000000000a12'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000959'::uuid, $$KNC-001$$, '00000000-2222-0000-0000-000000000433'::uuid, 1, 1, NULL, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000095b'::uuid, $$TE-2457435-1-R1$$, '00000000-2222-0000-0000-000000000a9b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000095c'::uuid, $$TE-1-127-5$$, '00000000-2222-0000-0000-0000000009f6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000095d'::uuid, $$TE-1-020-2$$, '00000000-2222-0000-0000-0000000009d6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000095e'::uuid, $$TE-1-020-5$$, '00000000-2222-0000-0000-0000000009d7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000095f'::uuid, $$TE-0-127-8$$, '00000000-2222-0000-0000-0000000009aa'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000960'::uuid, $$TE-1-141-6$$, '00000000-2222-0000-0000-000000000a05'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000961'::uuid, $$TE-1-145-7$$, '00000000-2222-0000-0000-000000000a09'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000962'::uuid, $$TE-1-020-1$$, '00000000-2222-0000-0000-0000000009d5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000963'::uuid, $$TE-1-110-4$$, '00000000-2222-0000-0000-0000000009f0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000964'::uuid, $$TE-1-020-6$$, '00000000-2222-0000-0000-0000000009d8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000967'::uuid, $$MMC-003$$, '00000000-2222-0000-0000-00000000059f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000968'::uuid, $$MCC-002-R3$$, '00000000-2222-0000-0000-000000000588'::uuid, 1, 1, NULL, $$6.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000969'::uuid, $$APF-003$$, '00000000-2222-0000-0000-00000000015d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000096a'::uuid, $$NHK-006D-R2$$, '00000000-2222-0000-0000-0000000011b6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000096b'::uuid, $$TE-1-127-7$$, '00000000-2222-0000-0000-0000000009f8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000096c'::uuid, $$TE-1-161-9$$, '00000000-2222-0000-0000-000000000a10'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000096d'::uuid, $$TE-1-161-0$$, '00000000-2222-0000-0000-000000000a0f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000096e'::uuid, $$TE-1-156-1$$, '00000000-2222-0000-0000-000000000a0a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000096f'::uuid, $$AMP-0-130-6$$, '00000000-2222-0000-0000-00000000013f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000971'::uuid, $$TE-2457436-1-R5NEW$$, '00000000-2222-0000-0000-000000000aa0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000972'::uuid, $$TE-2457436-1-R3$$, '00000000-2222-0000-0000-000000000a9e'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000973'::uuid, $$TE-9-127-9$$, '00000000-2222-0000-0000-000000000bb5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000974'::uuid, $$TE-1-127-1-R1$$, '00000000-2222-0000-0000-0000000009f3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000975'::uuid, $$TE-Noname$$, '00000000-2222-0000-0000-000000000bc7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000976'::uuid, $$TE-2423252-3$$, '00000000-2222-0000-0000-000000000a81'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000977'::uuid, $$TE-1-127-4$$, '00000000-2222-0000-0000-0000000009f5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000978'::uuid, $$TE-1-127-3$$, '00000000-2222-0000-0000-0000000009f4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000979'::uuid, $$TE-0-161-9$$, '00000000-2222-0000-0000-0000000009c4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000097a'::uuid, $$TE-1-073-4$$, '00000000-2222-0000-0000-0000000009e8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000097b'::uuid, $$TE-1-130-3$$, '00000000-2222-0000-0000-0000000009fc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000097c'::uuid, $$TE-1-130-4$$, '00000000-2222-0000-0000-0000000009fd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000097d'::uuid, $$TE-1-065-2$$, '00000000-2222-0000-0000-0000000009e6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000097e'::uuid, $$TE-0-020-3$$, '00000000-2222-0000-0000-000000000989'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000097f'::uuid, $$TE-2423252-1$$, '00000000-2222-0000-0000-000000000a77'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000980'::uuid, $$TE-0-161-2$$, '00000000-2222-0000-0000-0000000009bf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000981'::uuid, $$TE-0-161-3$$, '00000000-2222-0000-0000-0000000009c0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000982'::uuid, $$TE-0-071-6$$, '00000000-2222-0000-0000-00000000099e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000983'::uuid, $$TE-1279600-1$$, '00000000-2222-0000-0000-000000000a23'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000984'::uuid, $$TE-1279508-4$$, '00000000-2222-0000-0000-000000000a1c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000985'::uuid, $$TE-0-161-7$$, '00000000-2222-0000-0000-0000000009c2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000986'::uuid, $$TE-1279508-3$$, '00000000-2222-0000-0000-000000000a1b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000987'::uuid, $$TE-1279509-1$$, '00000000-2222-0000-0000-000000000a1f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000988'::uuid, $$TE-0-020-2$$, '00000000-2222-0000-0000-000000000988'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000989'::uuid, $$TE-1279508-6$$, '00000000-2222-0000-0000-000000000a1e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000098a'::uuid, $$TE-1279508-5$$, '00000000-2222-0000-0000-000000000a1d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000098b'::uuid, $$TE-1279509-4$$, '00000000-2222-0000-0000-000000000a22'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000098c'::uuid, $$TE-0-127-3$$, '00000000-2222-0000-0000-0000000009a8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000098d'::uuid, $$TE-0-129-7$$, '00000000-2222-0000-0000-0000000009ae'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000098e'::uuid, $$TE-0-127-7$$, '00000000-2222-0000-0000-0000000009a9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000098f'::uuid, $$TE-0-143-7$$, '00000000-2222-0000-0000-0000000009b7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000990'::uuid, $$TE-0-019-6$$, '00000000-2222-0000-0000-000000000985'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000991'::uuid, $$TE-0-127-2$$, '00000000-2222-0000-0000-0000000009a7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000992'::uuid, $$TE-1554772-1$$, '00000000-2222-0000-0000-000000000a26'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000993'::uuid, $$TE-0-072-9$$, '00000000-2222-0000-0000-0000000009a0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000994'::uuid, $$TE-0-020-5$$, '00000000-2222-0000-0000-00000000098a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000995'::uuid, $$TE-1279508-2$$, '00000000-2222-0000-0000-000000000a1a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000996'::uuid, $$TE-0-110-9$$, '00000000-2222-0000-0000-0000000009a5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000997'::uuid, $$TE-0-020-6$$, '00000000-2222-0000-0000-00000000098b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000998'::uuid, $$SSM-006$$, '00000000-2222-0000-0000-0000000008ef'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000999'::uuid, $$SSM-039$$, '00000000-2222-0000-0000-000000000909'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000099a'::uuid, $$SSM-046$$, '00000000-2222-0000-0000-000000000910'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000099b'::uuid, $$SSM-049$$, '00000000-2222-0000-0000-000000000913'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000099c'::uuid, $$JAE-213$$, '00000000-2222-0000-0000-000000000341'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000099d'::uuid, $$JAE-050$$, '00000000-2222-0000-0000-0000000002df'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000099e'::uuid, $$JAE-123$$, '00000000-2222-0000-0000-0000000002fd'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000099f'::uuid, $$JAE-160$$, '00000000-2222-0000-0000-000000000316'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009a0'::uuid, $$JAE-162$$, '00000000-2222-0000-0000-000000000318'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009a1'::uuid, $$JAE-117$$, '00000000-2222-0000-0000-0000000002fa'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009a2'::uuid, $$JAE-126$$, '00000000-2222-0000-0000-0000000002ff'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009a3'::uuid, $$JAE-071$$, '00000000-2222-0000-0000-0000000002ea'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009a4'::uuid, $$JAE-181$$, '00000000-2222-0000-0000-000000000324'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009a5'::uuid, $$JAE-189$$, '00000000-2222-0000-0000-00000000032c'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009a6'::uuid, $$JAE-312$$, '00000000-2222-0000-0000-00000000039f'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009a8'::uuid, $$SMK-110$$, '00000000-2222-0000-0000-000000000883'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009aa'::uuid, $$SMK-202$$, '00000000-2222-0000-0000-00000000089d'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009ab'::uuid, $$SPJ-048-BN1$$, '00000000-2222-0000-0000-0000000008c8'::uuid, 1, 1, $$B$$, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009ac'::uuid, $$SPJ-048-TN1$$, '00000000-2222-0000-0000-0000000008c9'::uuid, 1, 1, $$T$$, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009ad'::uuid, $$ADY-055$$, '00000000-2222-0000-0000-000000000097'::uuid, 1, 1, NULL, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009ae'::uuid, $$DIC-003-BN1$$, '00000000-2222-0000-0000-0000000001c5'::uuid, 1, 1, $$B$$, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009af'::uuid, $$DIC-003-TN1$$, '00000000-2222-0000-0000-0000000001c6'::uuid, 1, 1, $$T$$, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009b0'::uuid, $$DIC-008$$, '00000000-2222-0000-0000-0000000001c9'::uuid, 1, 1, NULL, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009b1'::uuid, $$HIN-001$$, '00000000-2222-0000-0000-000000000286'::uuid, 1, 1, NULL, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009b2'::uuid, $$ATS-028-R1$$, '00000000-2222-0000-0000-000000000188'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009b3'::uuid, $$ATS-029-R2$$, '00000000-2222-0000-0000-00000000018b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009b4'::uuid, $$TE-7-129-2$$, '00000000-2222-0000-0000-000000000b71'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009b5'::uuid, $$TE-7-130-9$$, '00000000-2222-0000-0000-000000000b76'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009b7'::uuid, $$ENT-001$$, '00000000-2222-0000-0000-0000000000cf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009b8'::uuid, $$ENT-002$$, '00000000-2222-0000-0000-0000000000d0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009b9'::uuid, $$TE-7-142-9$$, '00000000-2222-0000-0000-000000000b7b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009ba'::uuid, $$TE-001$$, '00000000-2222-0000-0000-000000000980'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009bb'::uuid, $$TE-7-161-0$$, '00000000-2222-0000-0000-000000000b7d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009bc'::uuid, $$TE-7-130-8-R1$$, '00000000-2222-0000-0000-000000000b75'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009bd'::uuid, $$TE-8-127-1$$, '00000000-2222-0000-0000-000000000b8d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009be'::uuid, $$TE-7-127-5$$, '00000000-2222-0000-0000-000000000b68'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009bf'::uuid, $$LKS-002$$, '00000000-2222-0000-0000-000000000565'::uuid, 1, 1, NULL, $$2.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009c0'::uuid, $$LKS-005$$, '00000000-2222-0000-0000-000000000568'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009c1'::uuid, $$LKS-006$$, '00000000-2222-0000-0000-000000000569'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009c3'::uuid, $$SRD-001$$, '00000000-2222-0000-0000-0000000008cb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009c4'::uuid, $$KKC-002$$, '00000000-2222-0000-0000-000000000424'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009c5'::uuid, $$SSK-009$$, '00000000-2222-0000-0000-0000000008e8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009c6'::uuid, $$LKS-001$$, '00000000-2222-0000-0000-000000000564'::uuid, 1, 1, NULL, $$2.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009c8'::uuid, $$KBT-001$$, '00000000-2222-0000-0000-0000000003b9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009c9'::uuid, $$AAT-004-TN1$$, '00000000-2222-0000-0000-000000000079'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009cb'::uuid, $$KSE-D$$, '00000000-2222-0000-0000-000000000490'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009cc'::uuid, $$TSB-001$$, '00000000-2222-0000-0000-000000000c7d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009cd'::uuid, $$ADY-083-R1$$, '00000000-2222-0000-0000-0000000000af'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009ce'::uuid, $$MTD-002$$, '00000000-2222-0000-0000-0000000005d2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009cf'::uuid, $$TE-7-075-8-V01$$, '00000000-2222-0000-0000-000000000b62'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009d0'::uuid, $$TIH-023$$, '00000000-2222-0000-0000-000000000c0c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009d1'::uuid, $$QAS-003$$, '00000000-2222-0000-0000-0000000007c2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009d2'::uuid, $$YSR-020$$, '00000000-2222-0000-0000-000000000dc6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009d3'::uuid, $$KSP-032$$, '00000000-2222-0000-0000-0000000004b2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009d4'::uuid, $$KSP-034$$, '00000000-2222-0000-0000-0000000004b4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009d5'::uuid, $$KSP-024$$, '00000000-2222-0000-0000-0000000004a9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009d6'::uuid, $$KSP-010$$, '00000000-2222-0000-0000-000000000499'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009d7'::uuid, $$KSP-022$$, '00000000-2222-0000-0000-0000000004a7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009d9'::uuid, $$KSK-004$$, '00000000-2222-0000-0000-000000000494'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009da'::uuid, $$NRK-007$$, '00000000-2222-0000-0000-0000000006e5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009db'::uuid, $$NRK-013-R1$$, '00000000-2222-0000-0000-0000000006eb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009dc'::uuid, $$NRK-008$$, '00000000-2222-0000-0000-0000000006e6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009dd'::uuid, $$NRK-030$$, '00000000-2222-0000-0000-0000000006f0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009de'::uuid, $$KSP-013$$, '00000000-2222-0000-0000-00000000049c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009df'::uuid, $$KSP-019$$, '00000000-2222-0000-0000-0000000004a2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009e0'::uuid, $$KSP-015$$, '00000000-2222-0000-0000-00000000049e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009e1'::uuid, $$KSP-016$$, '00000000-2222-0000-0000-00000000049f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009e2'::uuid, $$NRK-024$$, '00000000-2222-0000-0000-0000000006ed'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009e3'::uuid, $$NRK-025$$, '00000000-2222-0000-0000-0000000006ee'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009e4'::uuid, $$NRK-026$$, '00000000-2222-0000-0000-0000000006ef'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009e5'::uuid, $$NRK-032$$, '00000000-2222-0000-0000-0000000006f2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009e6'::uuid, $$NRK-038$$, '00000000-2222-0000-0000-0000000006f6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009e7'::uuid, $$NRK-039$$, '00000000-2222-0000-0000-0000000006f7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009e8'::uuid, $$NRK-005$$, '00000000-2222-0000-0000-0000000006e4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009e9'::uuid, $$NRK-010$$, '00000000-2222-0000-0000-0000000006e8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009ea'::uuid, $$NRK-043$$, '00000000-2222-0000-0000-0000000006f9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009eb'::uuid, $$NRK-011$$, '00000000-2222-0000-0000-0000000006e9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009ec'::uuid, $$NRK-037$$, '00000000-2222-0000-0000-0000000006f5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009ed'::uuid, $$NRK-046$$, '00000000-2222-0000-0000-0000000006fb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009ee'::uuid, $$NSK-009$$, '00000000-2222-0000-0000-000000000707'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009ef'::uuid, $$NSK-001$$, '00000000-2222-0000-0000-000000000700'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009f0'::uuid, $$KSP-023$$, '00000000-2222-0000-0000-0000000004a8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009f1'::uuid, $$KSP-020$$, '00000000-2222-0000-0000-0000000004a3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009f2'::uuid, $$NSK-005$$, '00000000-2222-0000-0000-000000000703'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009f3'::uuid, $$NRK-001$$, '00000000-2222-0000-0000-0000000006e1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009f4'::uuid, $$NRK-002$$, '00000000-2222-0000-0000-0000000006e2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009f5'::uuid, $$NRK-044$$, '00000000-2222-0000-0000-0000000006fa'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009f6'::uuid, $$NRK-022-R1$$, '00000000-2222-0000-0000-0000000006ec'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009f8'::uuid, $$YSD-G-050-1$$, '00000000-2222-0000-0000-000000000d5f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009f9'::uuid, $$YSD-G-020-1$$, '00000000-2222-0000-0000-000000000d56'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009fa'::uuid, $$YSD-G-130-1$$, '00000000-2222-0000-0000-000000000d67'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009fc'::uuid, $$YSD-G-050-2$$, '00000000-2222-0000-0000-000000000d60'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009fd'::uuid, $$YSD-G-030-2$$, '00000000-2222-0000-0000-000000000d5a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009fe'::uuid, $$YSD-G-040-2$$, '00000000-2222-0000-0000-000000000d5e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000009ff'::uuid, $$YSD-Z-60$$, '00000000-2222-0000-0000-000000000d86'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a00'::uuid, $$YSD-F-050-1$$, '00000000-2222-0000-0000-000000000d4e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a01'::uuid, $$YSD-Z-100-1$$, '00000000-2222-0000-0000-000000000d83'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a02'::uuid, $$YSD-F-200-2-BN1$$, '00000000-2222-0000-0000-000000000d54'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a03'::uuid, $$YSD-G-040-1$$, '00000000-2222-0000-0000-000000000d5d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a04'::uuid, $$YSD-G-080-1$$, '00000000-2222-0000-0000-000000000d65'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a05'::uuid, $$YSD-G-070-1$$, '00000000-2222-0000-0000-000000000d64'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a06'::uuid, $$YSD-G-025-2$$, '00000000-2222-0000-0000-000000000d58'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a07'::uuid, $$YSD-G-030-1$$, '00000000-2222-0000-0000-000000000d59'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a08'::uuid, $$YSD-A-020-2$$, '00000000-2222-0000-0000-000000000d2f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a09'::uuid, $$YSD-A-010-1$$, '00000000-2222-0000-0000-000000000d28'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a0a'::uuid, $$YSD-F-015-1$$, '00000000-2222-0000-0000-000000000d49'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a0b'::uuid, $$YSD-Z-050-1$$, '00000000-2222-0000-0000-000000000d7c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a0c'::uuid, $$YSD-F-040-1$$, '00000000-2222-0000-0000-000000000d4c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a0d'::uuid, $$YSD-A-028-1$$, '00000000-2222-0000-0000-000000000d32'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a0e'::uuid, $$YSD-A-018-1$$, '00000000-2222-0000-0000-000000000d2e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a0f'::uuid, $$YSD-A-015-1$$, '00000000-2222-0000-0000-000000000d2c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a10'::uuid, $$YSD-A-012-2$$, '00000000-2222-0000-0000-000000000d2a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a11'::uuid, $$YSD-F-100-1$$, '00000000-2222-0000-0000-000000000d50'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a12'::uuid, $$YSD-Z-050-2$$, '00000000-2222-0000-0000-000000000d7d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a13'::uuid, $$YSD-F-045-1$$, '00000000-2222-0000-0000-000000000d4d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a14'::uuid, $$YSD-F-080-1$$, '00000000-2222-0000-0000-000000000d4f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a15'::uuid, $$YSD-F-030-1$$, '00000000-2222-0000-0000-000000000d4b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a16'::uuid, $$YSD-F-150-1$$, '00000000-2222-0000-0000-000000000d52'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a17'::uuid, $$YSD-Z-080-1$$, '00000000-2222-0000-0000-000000000d82'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a18'::uuid, $$YSD-A-060-1$$, '00000000-2222-0000-0000-000000000d39'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a19'::uuid, $$YSD-D-025-1$$, '00000000-2222-0000-0000-000000000d41'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a1a'::uuid, $$YSD-A-120-1$$, '00000000-2222-0000-0000-000000000d3d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a1b'::uuid, $$YSD-G-050-3$$, '00000000-2222-0000-0000-000000000d61'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a1c'::uuid, $$YSD-G-010-1$$, '00000000-2222-0000-0000-000000000d55'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a1d'::uuid, $$YSD-G-060-1$$, '00000000-2222-0000-0000-000000000d62'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a1e'::uuid, $$YSD-G-020-3$$, '00000000-2222-0000-0000-000000000d57'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a1f'::uuid, $$YSD-G-060-2$$, '00000000-2222-0000-0000-000000000d63'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a20'::uuid, $$YSD-Z-013-1$$, '00000000-2222-0000-0000-000000000d76'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a21'::uuid, $$YSD-F-200-1$$, '00000000-2222-0000-0000-000000000d53'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a22'::uuid, $$YSD-A-024-1$$, '00000000-2222-0000-0000-000000000d30'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a23'::uuid, $$YSD-A-075-2(PP)$$, '00000000-2222-0000-0000-000000000d3c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a24'::uuid, $$YSD-F-025-1$$, '00000000-2222-0000-0000-000000000d4a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a25'::uuid, $$YSD-A-032-1$$, '00000000-2222-0000-0000-000000000d34'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a26'::uuid, $$YSD-F-120-1$$, '00000000-2222-0000-0000-000000000d51'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a27'::uuid, $$YSD-A-075-1$$, '00000000-2222-0000-0000-000000000d3a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a28'::uuid, $$YSD-A-025-1$$, '00000000-2222-0000-0000-000000000d31'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a29'::uuid, $$YSD-A-030-1$$, '00000000-2222-0000-0000-000000000d33'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a2a'::uuid, $$YSD-A-040-1$$, '00000000-2222-0000-0000-000000000d37'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a2b'::uuid, $$YSD-Z-030-1$$, '00000000-2222-0000-0000-000000000d7b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a2c'::uuid, $$YSD-Z-060-2$$, '00000000-2222-0000-0000-000000000d81'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a2d'::uuid, $$YSD-D-020-1$$, '00000000-2222-0000-0000-000000000d40'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a2e'::uuid, $$YSD-D-050-1$$, '00000000-2222-0000-0000-000000000d44'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a2f'::uuid, $$YSD-D-100-1$$, '00000000-2222-0000-0000-000000000d45'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a30'::uuid, $$TCB-003$$, '00000000-2222-0000-0000-00000000096e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a31'::uuid, $$YSD-D-030-1$$, '00000000-2222-0000-0000-000000000d42'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a32'::uuid, $$YSD-A-045-1$$, '00000000-2222-0000-0000-000000000d38'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a33'::uuid, $$YSD-D-040-1$$, '00000000-2222-0000-0000-000000000d43'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a34'::uuid, $$YSD-A-036-1$$, '00000000-2222-0000-0000-000000000d36'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a35'::uuid, $$YSD-G-035-1$$, '00000000-2222-0000-0000-000000000d5b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a36'::uuid, $$YSD-A-012-1$$, '00000000-2222-0000-0000-000000000d29'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a37'::uuid, $$YSD-A-016-1$$, '00000000-2222-0000-0000-000000000d2d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a38'::uuid, $$YSD-D-100-2$$, '00000000-2222-0000-0000-000000000d46'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a39'::uuid, $$YSD-A-014-1$$, '00000000-2222-0000-0000-000000000d2b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a3a'::uuid, $$NPC-014$$, '00000000-2222-0000-0000-0000000006d9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a3b'::uuid, $$ODS-054$$, '00000000-2222-0000-0000-00000000073b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a3c'::uuid, $$NPC-013$$, '00000000-2222-0000-0000-0000000006d8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a3d'::uuid, $$ODS-055$$, '00000000-2222-0000-0000-00000000073c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a3e'::uuid, $$TCB-002$$, '00000000-2222-0000-0000-00000000096d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a3f'::uuid, $$TCB-001$$, '00000000-2222-0000-0000-00000000096c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a40'::uuid, $$NPC-011$$, '00000000-2222-0000-0000-0000000006d7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a41'::uuid, $$NoName-台湾機用$$, '00000000-2222-0000-0000-0000000006d5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a42'::uuid, $$ODS-031$$, '00000000-2222-0000-0000-000000000728'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a43'::uuid, $$ODS-012$$, '00000000-2222-0000-0000-000000000718'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a44'::uuid, $$ODS-010$$, '00000000-2222-0000-0000-000000000717'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a45'::uuid, $$ODS-032$$, '00000000-2222-0000-0000-000000000729'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a46'::uuid, $$ODS-051$$, '00000000-2222-0000-0000-000000000737'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a47'::uuid, $$ODS-041$$, '00000000-2222-0000-0000-000000000731'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a48'::uuid, $$ODS-029$$, '00000000-2222-0000-0000-000000000726'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a49'::uuid, $$ODS-015$$, '00000000-2222-0000-0000-00000000071a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a4a'::uuid, $$ODS-021$$, '00000000-2222-0000-0000-00000000071f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a4b'::uuid, $$ODS-001$$, '00000000-2222-0000-0000-000000000716'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a4c'::uuid, $$ODS-022$$, '00000000-2222-0000-0000-000000000720'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a4d'::uuid, $$ODS-016$$, '00000000-2222-0000-0000-00000000071b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a4e'::uuid, $$ODS-019$$, '00000000-2222-0000-0000-00000000071e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a4f'::uuid, $$ODS-023$$, '00000000-2222-0000-0000-000000000721'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a50'::uuid, $$ODS-025$$, '00000000-2222-0000-0000-000000000722'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a51'::uuid, $$ODS-045$$, '00000000-2222-0000-0000-000000000735'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a52'::uuid, $$ODS-037$$, '00000000-2222-0000-0000-00000000072d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a53'::uuid, $$ODS-048$$, '00000000-2222-0000-0000-000000000736'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a54'::uuid, $$ODS-052$$, '00000000-2222-0000-0000-000000000738'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a55'::uuid, $$ODS-040$$, '00000000-2222-0000-0000-000000000730'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a56'::uuid, $$ODS-018-R1$$, '00000000-2222-0000-0000-00000000071d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a57'::uuid, $$EXD-035$$, '00000000-2222-0000-0000-000000000109'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a58'::uuid, $$EXD-032$$, '00000000-2222-0000-0000-000000000107'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a59'::uuid, $$EXD-029-R1$$, '00000000-2222-0000-0000-000000000104'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a5a'::uuid, $$EXD-031$$, '00000000-2222-0000-0000-000000000106'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a5b'::uuid, $$EXD-034$$, '00000000-2222-0000-0000-000000000108'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a5c'::uuid, $$EXD-017$$, '00000000-2222-0000-0000-0000000000fc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a5d'::uuid, $$EXD-030$$, '00000000-2222-0000-0000-000000000105'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a5e'::uuid, $$EXD-036$$, '00000000-2222-0000-0000-00000000010a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a5f'::uuid, $$EXD-003$$, '00000000-2222-0000-0000-0000000000f6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a60'::uuid, $$EXD-040$$, '00000000-2222-0000-0000-00000000010d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a61'::uuid, $$ODS-013$$, '00000000-2222-0000-0000-000000000719'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a62'::uuid, $$ODS-030$$, '00000000-2222-0000-0000-000000000727'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a63'::uuid, $$ODS-035$$, '00000000-2222-0000-0000-00000000072c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a64'::uuid, $$ODS-034$$, '00000000-2222-0000-0000-00000000072b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a65'::uuid, $$EXD-037$$, '00000000-2222-0000-0000-00000000010b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a66'::uuid, $$EXD-021$$, '00000000-2222-0000-0000-0000000006bd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a67'::uuid, $$EXD-038$$, '00000000-2222-0000-0000-00000000010c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a68'::uuid, $$EXD-013$$, '00000000-2222-0000-0000-0000000000fb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a69'::uuid, $$EXD-028$$, '00000000-2222-0000-0000-000000000103'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a6a'::uuid, $$EXD-008$$, '00000000-2222-0000-0000-0000000000f8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a6b'::uuid, $$EXD-009-R1$$, '00000000-2222-0000-0000-0000000000f9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a6c'::uuid, $$EXD-020$$, '00000000-2222-0000-0000-0000000000ff'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a6d'::uuid, $$EXD-014$$, '00000000-2222-0000-0000-0000000000fc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a6e'::uuid, $$EXD-027$$, '00000000-2222-0000-0000-000000000102'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a6f'::uuid, $$EXD-025$$, '00000000-2222-0000-0000-000000000100'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a70'::uuid, $$NoName-(大）$$, '00000000-2222-0000-0000-0000000006be'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a71'::uuid, $$KDS-138$$, '00000000-2222-0000-0000-000000000408'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a72'::uuid, $$KDS-112$$, '00000000-2222-0000-0000-0000000003f3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a73'::uuid, $$KDS-119$$, '00000000-2222-0000-0000-0000000003f9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a74'::uuid, $$KDS-044-R1$$, '00000000-2222-0000-0000-0000000011c7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a75'::uuid, $$KDS-125$$, '00000000-2222-0000-0000-0000000003fd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a76'::uuid, $$KDS-113$$, '00000000-2222-0000-0000-0000000003f4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a77'::uuid, $$KDS-114$$, '00000000-2222-0000-0000-0000000003f5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a78'::uuid, $$KSP-181$$, '00000000-2222-0000-0000-000000000531'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a79'::uuid, $$KDS-105$$, '00000000-2222-0000-0000-0000000003ec'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a7a'::uuid, $$KDS-133$$, '00000000-2222-0000-0000-000000000404'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a7b'::uuid, $$KDS-131$$, '00000000-2222-0000-0000-000000000402'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a7c'::uuid, $$KDS-106$$, '00000000-2222-0000-0000-0000000003ed'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a7d'::uuid, $$KDS-123$$, '00000000-2222-0000-0000-0000000003fc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a7e'::uuid, $$KDS-081$$, '00000000-2222-0000-0000-0000000003dc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a80'::uuid, $$KDS-108$$, '00000000-2222-0000-0000-0000000003ef'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a81'::uuid, $$KDS-115$$, '00000000-2222-0000-0000-0000000003f6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a82'::uuid, $$KDS-093$$, '00000000-2222-0000-0000-0000000003e2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a83'::uuid, $$KDS-101$$, '00000000-2222-0000-0000-0000000003e8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a84'::uuid, $$KDS-064$$, '00000000-2222-0000-0000-0000000003d0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a85'::uuid, $$KDS-118$$, '00000000-2222-0000-0000-0000000003f8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a86'::uuid, $$KDS-109$$, '00000000-2222-0000-0000-0000000003f0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a87'::uuid, $$KDS-110$$, '00000000-2222-0000-0000-0000000003f1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a88'::uuid, $$KDS-130$$, '00000000-2222-0000-0000-000000000401'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a89'::uuid, $$KDS-127$$, '00000000-2222-0000-0000-0000000003ff'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a8a'::uuid, $$KDS-120$$, '00000000-2222-0000-0000-0000000003fa'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a8b'::uuid, $$KDS-111$$, '00000000-2222-0000-0000-0000000003f2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a8c'::uuid, $$KDS-047$$, '00000000-2222-0000-0000-0000000003c6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a8d'::uuid, $$KDS-075$$, '00000000-2222-0000-0000-0000000003d9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a8e'::uuid, $$KDS-107$$, '00000000-2222-0000-0000-0000000003ee'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a90'::uuid, $$KDS-100$$, '00000000-2222-0000-0000-0000000003e7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a91'::uuid, $$KDS-102$$, '00000000-2222-0000-0000-0000000003e9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a92'::uuid, $$KDS-103$$, '00000000-2222-0000-0000-0000000003ea'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a93'::uuid, $$KDS-096$$, '00000000-2222-0000-0000-0000000003e5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a94'::uuid, $$KDS-098$$, '00000000-2222-0000-0000-0000000003e6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a95'::uuid, $$KDS-088$$, '00000000-2222-0000-0000-0000000003de'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a96'::uuid, $$KDS-087$$, '00000000-2222-0000-0000-0000000003dd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a97'::uuid, $$KDS-089$$, '00000000-2222-0000-0000-0000000003df'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a98'::uuid, $$KDS-073$$, '00000000-2222-0000-0000-0000000003d7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a99'::uuid, $$KDS-122$$, '00000000-2222-0000-0000-0000000003fb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a9a'::uuid, $$KDS-063$$, '00000000-2222-0000-0000-0000000003ce'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a9b'::uuid, $$KDS-129$$, '00000000-2222-0000-0000-000000000400'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a9c'::uuid, $$KDS-095$$, '00000000-2222-0000-0000-0000000003e4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a9d'::uuid, $$KDS-094$$, '00000000-2222-0000-0000-0000000003e3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a9e'::uuid, $$KDS-126$$, '00000000-2222-0000-0000-0000000003fe'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000a9f'::uuid, $$KDS-052$$, '00000000-2222-0000-0000-0000000003c9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aa0'::uuid, $$KDS-136$$, '00000000-2222-0000-0000-000000000407'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aa2'::uuid, $$KDS-116$$, '00000000-2222-0000-0000-0000000003f7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aa3'::uuid, $$KDS-071$$, '00000000-2222-0000-0000-0000000003d6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aa4'::uuid, $$KDS-053$$, '00000000-2222-0000-0000-0000000003ca'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aa6'::uuid, $$IMT-003$$, '00000000-2222-0000-0000-0000000002b0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aa7'::uuid, $$IMT-002$$, '00000000-2222-0000-0000-0000000002af'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aa8'::uuid, $$IMT-001$$, '00000000-2222-0000-0000-0000000002ae'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aa9'::uuid, $$KSP-178$$, '00000000-2222-0000-0000-00000000052e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aaa'::uuid, $$KSP-187$$, '00000000-2222-0000-0000-000000000537'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aab'::uuid, $$KSP-198$$, '00000000-2222-0000-0000-000000000542'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aac'::uuid, $$TE-1-055-9$$, '00000000-2222-0000-0000-0000000009e4'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aad'::uuid, $$TE-9-056-2$$, '00000000-2222-0000-0000-000000000ba8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aae'::uuid, $$KSP-183$$, '00000000-2222-0000-0000-000000000533'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aaf'::uuid, $$KSP-197$$, '00000000-2222-0000-0000-000000000541'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ab0'::uuid, $$KSP-196$$, '00000000-2222-0000-0000-000000000540'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ab1'::uuid, $$KSP-202$$, '00000000-2222-0000-0000-000000000546'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ab2'::uuid, $$KSP-199$$, '00000000-2222-0000-0000-000000000543'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ab3'::uuid, $$KSP-103$$, '00000000-2222-0000-0000-0000000004ee'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ab4'::uuid, $$KSP-149$$, '00000000-2222-0000-0000-000000000513'::uuid, 1, 1, NULL, $$2.0$$, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ab5'::uuid, $$KSP-111$$, '00000000-2222-0000-0000-0000000004f7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ab6'::uuid, $$KSP-102$$, '00000000-2222-0000-0000-0000000004ed'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ab7'::uuid, $$KSP-148$$, '00000000-2222-0000-0000-000000000512'::uuid, 1, 1, NULL, $$2.0$$, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ab8'::uuid, $$KSP-069$$, '00000000-2222-0000-0000-0000000004ce'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ab9'::uuid, $$KSP-077$$, '00000000-2222-0000-0000-0000000004d6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aba'::uuid, $$KSP-073$$, '00000000-2222-0000-0000-0000000004d2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000abb'::uuid, $$KSP-105-R1$$, '00000000-2222-0000-0000-0000000004f1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000abc'::uuid, $$KSP-173$$, '00000000-2222-0000-0000-000000000529'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000abd'::uuid, $$KSP-166$$, '00000000-2222-0000-0000-000000000522'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000abe'::uuid, $$KSP-185$$, '00000000-2222-0000-0000-000000000535'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000abf'::uuid, $$KSP-152$$, '00000000-2222-0000-0000-000000000516'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ac0'::uuid, $$KSP-180$$, '00000000-2222-0000-0000-000000000530'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ac1'::uuid, $$KSP-177$$, '00000000-2222-0000-0000-00000000052d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ac2'::uuid, $$KSP-192$$, '00000000-2222-0000-0000-00000000053c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ac3'::uuid, $$KSP-193$$, '00000000-2222-0000-0000-00000000053d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ac4'::uuid, $$KSP-194$$, '00000000-2222-0000-0000-00000000053e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ac5'::uuid, $$KSP-188$$, '00000000-2222-0000-0000-000000000538'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ac6'::uuid, $$KSP-191$$, '00000000-2222-0000-0000-00000000053b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ac7'::uuid, $$KSP-207$$, '00000000-2222-0000-0000-00000000054c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ac8'::uuid, $$KSP-299$$, '00000000-2222-0000-0000-00000000054d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ac9'::uuid, $$KSP-201$$, '00000000-2222-0000-0000-000000000545'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aca'::uuid, $$KSP-203$$, '00000000-2222-0000-0000-000000000547'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000acb'::uuid, $$KSP-156$$, '00000000-2222-0000-0000-000000000519'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000acc'::uuid, $$KSP-153$$, '00000000-2222-0000-0000-000000000517'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000acd'::uuid, $$KSP-172$$, '00000000-2222-0000-0000-000000000528'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ace'::uuid, $$KSP-160$$, '00000000-2222-0000-0000-00000000051d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000acf'::uuid, $$KSP-165$$, '00000000-2222-0000-0000-000000000521'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ad0'::uuid, $$KSP-174$$, '00000000-2222-0000-0000-00000000052a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ad1'::uuid, $$KSP-175$$, '00000000-2222-0000-0000-00000000052b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ad2'::uuid, $$KSP-169$$, '00000000-2222-0000-0000-000000000525'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ad3'::uuid, $$KSP-167$$, '00000000-2222-0000-0000-000000000523'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ad4'::uuid, $$KSP-190$$, '00000000-2222-0000-0000-00000000053a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ad5'::uuid, $$KSP-157$$, '00000000-2222-0000-0000-00000000051a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ad6'::uuid, $$KSP-176$$, '00000000-2222-0000-0000-00000000052c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ad7'::uuid, $$KSP-195$$, '00000000-2222-0000-0000-00000000053f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ad8'::uuid, $$KSP-189$$, '00000000-2222-0000-0000-000000000539'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ad9'::uuid, $$KSP-179$$, '00000000-2222-0000-0000-00000000052f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ada'::uuid, $$KSP-161$$, '00000000-2222-0000-0000-00000000051e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000adb'::uuid, $$KSP-162$$, '00000000-2222-0000-0000-00000000051f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000adc'::uuid, $$KSP-NoName$$, '00000000-2222-0000-0000-000000000550'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000add'::uuid, $$KSP-145$$, '00000000-2222-0000-0000-00000000050f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ade'::uuid, $$KSP-163$$, '00000000-2222-0000-0000-000000000520'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000adf'::uuid, $$KSP-146$$, '00000000-2222-0000-0000-000000000510'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ae0'::uuid, $$KSP-091$$, '00000000-2222-0000-0000-0000000004e3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ae1'::uuid, $$KSP-155$$, '00000000-2222-0000-0000-000000000518'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ae2'::uuid, $$KSP-151$$, '00000000-2222-0000-0000-000000000515'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ae3'::uuid, $$KSP-137$$, '00000000-2222-0000-0000-000000000509'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ae4'::uuid, $$KSP-143$$, '00000000-2222-0000-0000-00000000050d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ae5'::uuid, $$KSP-134$$, '00000000-2222-0000-0000-000000000506'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ae6'::uuid, $$SK-043-TN1$$, '00000000-2222-0000-0000-000000000849'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ae7'::uuid, $$SK-030$$, '00000000-2222-0000-0000-000000000844'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ae8'::uuid, $$SK-031$$, '00000000-2222-0000-0000-000000000845'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ae9'::uuid, $$SK-029$$, '00000000-2222-0000-0000-000000000843'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aea'::uuid, $$SK-024-TN1$$, '00000000-2222-0000-0000-000000000841'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aeb'::uuid, $$SK-024-BN1$$, '00000000-2222-0000-0000-000000000840'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aec'::uuid, $$SK-007$$, '00000000-2222-0000-0000-000000000837'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aed'::uuid, $$SK-043-BN1$$, '00000000-2222-0000-0000-000000000848'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aee'::uuid, $$SK-010$$, '00000000-2222-0000-0000-00000000083a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aef'::uuid, $$SK-037$$, '00000000-2222-0000-0000-000000000846'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000af0'::uuid, $$KSP-158$$, '00000000-2222-0000-0000-00000000051b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000af1'::uuid, $$SK-008$$, '00000000-2222-0000-0000-000000000838'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000af2'::uuid, $$KSP-071$$, '00000000-2222-0000-0000-0000000004d0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000af3'::uuid, $$KSP-135$$, '00000000-2222-0000-0000-000000000507'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000af4'::uuid, $$KSP-062$$, '00000000-2222-0000-0000-0000000004c9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000af5'::uuid, $$KSP-147$$, '00000000-2222-0000-0000-000000000511'::uuid, 1, 1, NULL, $$2.0$$, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000af6'::uuid, $$KSP-142$$, '00000000-2222-0000-0000-00000000050c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000af7'::uuid, $$KSP-144$$, '00000000-2222-0000-0000-00000000050e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000af8'::uuid, $$KSP-186$$, '00000000-2222-0000-0000-000000000536'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000af9'::uuid, $$KSP-184$$, '00000000-2222-0000-0000-000000000534'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000afa'::uuid, $$KSP-182$$, '00000000-2222-0000-0000-000000000532'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000afb'::uuid, $$KSP-170$$, '00000000-2222-0000-0000-000000000526'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000afc'::uuid, $$KSP-150$$, '00000000-2222-0000-0000-000000000514'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000aff'::uuid, $$DIC-148$$, '00000000-2222-0000-0000-00000000023a'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b01'::uuid, $$MMT-016$$, '00000000-2222-0000-0000-0000000005ae'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b03'::uuid, $$TE-2423252-1-R3$$, '00000000-2222-0000-0000-000000000a7b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b04'::uuid, $$TE-2423252-2-R5$$, '00000000-2222-0000-0000-000000000a80'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b05'::uuid, $$TE-2423252-3-R3$$, '00000000-2222-0000-0000-000000000a84'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b06'::uuid, $$JAE-264$$, '00000000-2222-0000-0000-00000000036f'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b0a'::uuid, $$STF-010$$, '00000000-2222-0000-0000-000000000936'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b0b'::uuid, $$TE-8-162-4PP$$, '00000000-2222-0000-0000-000000000ba0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b0c'::uuid, $$YSD-Z-020-1$$, '00000000-2222-0000-0000-000000000d7a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b0d'::uuid, $$YSD-Z-050-3$$, '00000000-2222-0000-0000-000000000d80'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b0e'::uuid, $$YSD-Z-100-2$$, '00000000-2222-0000-0000-000000000d85'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b0f'::uuid, $$TH-017-BN1$$, '00000000-2222-0000-0000-000000000c04'::uuid, 1, 1, $$B$$, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b10'::uuid, $$TH-018-BN1$$, '00000000-2222-0000-0000-000000000c06'::uuid, 1, 1, $$B$$, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b12'::uuid, $$TH-018PS$$, '00000000-2222-0000-0000-000000000c07'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b13'::uuid, $$TH-019BM$$, '00000000-2222-0000-0000-000000000c09'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b14'::uuid, $$TH-022$$, '00000000-2222-0000-0000-000000000e13'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b15'::uuid, $$TH-022-BN1$$, '00000000-2222-0000-0000-000000000e14'::uuid, 1, 1, $$B$$, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b16'::uuid, $$TH-024$$, '00000000-2222-0000-0000-000000000c0d'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b17'::uuid, $$TH-026$$, '00000000-2222-0000-0000-000000000e15'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b18'::uuid, $$TH-030$$, '00000000-2222-0000-0000-000000000e16'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b19'::uuid, $$TH-034$$, '00000000-2222-0000-0000-000000000e17'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b1b'::uuid, $$TH-037$$, '00000000-2222-0000-0000-000000000e19'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b1c'::uuid, $$TH-038$$, '00000000-2222-0000-0000-000000000e1a'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b1d'::uuid, $$TH-039$$, '00000000-2222-0000-0000-000000000e1b'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b1e'::uuid, $$TH-040$$, '00000000-2222-0000-0000-000000000e1c'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b1f'::uuid, $$TH-043$$, '00000000-2222-0000-0000-000000000e1d'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b20'::uuid, $$TH-044$$, '00000000-2222-0000-0000-000000000e1e'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b21'::uuid, $$TH-046$$, '00000000-2222-0000-0000-000000000e1f'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b22'::uuid, $$TH-049$$, '00000000-2222-0000-0000-000000000e20'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b23'::uuid, $$ATS-030$$, '00000000-2222-0000-0000-00000000018c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b28'::uuid, $$TE-0-141-4$$, '00000000-2222-0000-0000-0000000009b6'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b2a'::uuid, $$TE-0-161-8$$, '00000000-2222-0000-0000-0000000009c3'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b2b'::uuid, $$TE-1-162-2-R1$$, '00000000-2222-0000-0000-000000000a11'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b2c'::uuid, $$TE-2486848-1$$, '00000000-2222-0000-0000-000000000aa1'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b2d'::uuid, $$TE-2486848-2$$, '00000000-2222-0000-0000-000000000aa2'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b2e'::uuid, $$YSR-010$$, '00000000-2222-0000-0000-000000000dbc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b31'::uuid, $$JAE-313-R1$$, '00000000-2222-0000-0000-0000000003a0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b32'::uuid, $$ADY-125$$, '00000000-2222-0000-0000-000000000120'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b33'::uuid, $$JAE-315-R1$$, '00000000-2222-0000-0000-0000000003a3'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b34'::uuid, $$JAE-173$$, '00000000-2222-0000-0000-00000000031f'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b35'::uuid, $$JAE-296-R1$$, '00000000-2222-0000-0000-00000000038e'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b36'::uuid, $$PNS-003-TN1$$, '00000000-2222-0000-0000-0000000007b4'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b37'::uuid, $$ASH-007$$, '00000000-2222-0000-0000-00000000016c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b38'::uuid, $$ASH-004$$, '00000000-2222-0000-0000-000000000169'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b39'::uuid, $$ASH-006$$, '00000000-2222-0000-0000-00000000016b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b3a'::uuid, $$ATS-005$$, '00000000-2222-0000-0000-000000000173'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b3b'::uuid, $$YCM-038$$, '00000000-2222-0000-0000-000000000cc9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b3c'::uuid, $$YCM-041$$, '00000000-2222-0000-0000-000000000ccd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b3d'::uuid, $$YCM-075D-R1$$, '00000000-2222-0000-0000-000000000cef'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b3e'::uuid, $$TIH-009-TN1$$, '00000000-2222-0000-0000-000000000bfb'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b40'::uuid, $$TOK-003$$, '00000000-2222-0000-0000-000000000c64'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b41'::uuid, $$EXD-006$$, '00000000-2222-0000-0000-0000000000f7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b44'::uuid, $$FJT-001$$, '00000000-2222-0000-0000-00000000026a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b45'::uuid, $$Te-4-159-4$$, '00000000-2222-0000-0000-000000000b06'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b46'::uuid, $$Te-4-160-4$$, '00000000-2222-0000-0000-000000000b0b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b47'::uuid, $$Te-0-161-1$$, '00000000-2222-0000-0000-0000000009be'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b48'::uuid, $$Te-9-160-9$$, '00000000-2222-0000-0000-000000000bc0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b49'::uuid, $$Te-4-161-8$$, '00000000-2222-0000-0000-000000000b11'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b4a'::uuid, $$Te-9-160-8$$, '00000000-2222-0000-0000-000000000bbf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b4d'::uuid, $$Te-9-160-7$$, '00000000-2222-0000-0000-000000000bbe'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b4e'::uuid, $$Te-4-159-8$$, '00000000-2222-0000-0000-000000000b0a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b4f'::uuid, $$JAE-317-R1$$, '00000000-2222-0000-0000-0000000003a5'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b50'::uuid, $$NIT-003$$, '00000000-2222-0000-0000-0000000006a7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b53'::uuid, $$DIM-016$$, '00000000-2222-0000-0000-00000000024a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b54'::uuid, $$DIM-013$$, '00000000-2222-0000-0000-000000000247'::uuid, 1, 1, NULL, $$2.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b56'::uuid, $$TE-4-160-4(旧）$$, '00000000-2222-0000-0000-000000000b0c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b57'::uuid, $$TE-0-161-1$$, '00000000-2222-0000-0000-0000000009be'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b58'::uuid, $$TE-9-160-9$$, '00000000-2222-0000-0000-000000000bc0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b5b'::uuid, $$TE-9-160-7$$, '00000000-2222-0000-0000-000000000bbe'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b5c'::uuid, $$TE-4-159-8$$, '00000000-2222-0000-0000-000000000b0a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b5f'::uuid, $$TE-9-160-8$$, '00000000-2222-0000-0000-000000000bbf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b63'::uuid, $$ATS-021$$, '00000000-2222-0000-0000-00000000017e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b65'::uuid, $$DIM-010?$$, '00000000-2222-0000-0000-000000000244'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b66'::uuid, $$TE-9-052-8$$, '00000000-2222-0000-0000-000000000ba7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b69'::uuid, $$TE-2-059-9$$, '00000000-2222-0000-0000-000000000a37'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b6a'::uuid, $$JAE-251-R1$$, '00000000-2222-0000-0000-000000000362'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b6d'::uuid, $$MS-042$$, '00000000-2222-0000-0000-0000000005c9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b6e'::uuid, $$TKD-001$$, '00000000-2222-0000-0000-000000000c13'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b70'::uuid, $$NGS-010$$, '00000000-2222-0000-0000-000000000688'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b72'::uuid, $$NGS-003$$, '00000000-2222-0000-0000-000000000680'::uuid, 1, 1, NULL, $$2.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b75'::uuid, $$THP-007$$, '00000000-2222-0000-0000-000000000bf0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b76'::uuid, $$SJI-003$$, '00000000-2222-0000-0000-00000000081a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b79'::uuid, $$STY-001$$, '00000000-2222-0000-0000-00000000093a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b7a'::uuid, $$H-015-2$$, '00000000-2222-0000-0000-000000000d6d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b7b'::uuid, $$MZT-108CUTTE-R1$$, '00000000-2222-0000-0000-00000000063f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b7d'::uuid, $$MBN-002$$, '00000000-2222-0000-0000-000000000585'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b7e'::uuid, $$OGR-009-R1$$, '00000000-2222-0000-0000-00000000073f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b7f'::uuid, $$MRY-011$$, '00000000-2222-0000-0000-0000000005c2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b80'::uuid, $$OGR-013H$$, '00000000-2222-0000-0000-000000000743'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b81'::uuid, $$NGT-011$$, '00000000-2222-0000-0000-000000000697'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b82'::uuid, $$KR-010(KORYO)$$, '00000000-2222-0000-0000-000000000458'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b83'::uuid, $$KR-001$$, '00000000-2222-0000-0000-000000000457'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b84'::uuid, $$KOS-012$$, '00000000-2222-0000-0000-00000000044f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b85'::uuid, $$GMY-095-R1$$, '00000000-2222-0000-0000-000000000282'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b86'::uuid, $$GMY-094$$, '00000000-2222-0000-0000-000000000280'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b88'::uuid, $$EMI-001$$, '00000000-2222-0000-0000-0000000000ce'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b8a'::uuid, $$CYD-001$$, '00000000-2222-0000-0000-0000000001bb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b8b'::uuid, $$CST-002$$, '00000000-2222-0000-0000-0000000001b5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b8c'::uuid, $$TE-2428382-1$$, '00000000-2222-0000-0000-000000000a8c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b8d'::uuid, $$TSS-001$$, '00000000-2222-0000-0000-000000000c84'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b8e'::uuid, $$TSS-003$$, '00000000-2222-0000-0000-000000000c86'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b90'::uuid, $$YKW-005$$, '00000000-2222-0000-0000-000000000d00'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b92'::uuid, $$TE-4-069-9$$, '00000000-2222-0000-0000-000000000ae4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b93'::uuid, $$TE-4-069-1$$, '00000000-2222-0000-0000-000000000ae3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b94'::uuid, $$SSJ$$, '00000000-2222-0000-0000-0000000008d7'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b96'::uuid, $$NoName-34?$$, '00000000-2222-0000-0000-0000000006c7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b97'::uuid, $$MYS-005$$, '00000000-2222-0000-0000-00000000060e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b98'::uuid, $$ADY-108$$, '00000000-2222-0000-0000-0000000000c6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b99'::uuid, $$NGS-002$$, '00000000-2222-0000-0000-00000000067f'::uuid, 1, 1, NULL, $$2.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b9b'::uuid, $$KIK-003-TN1$$, '00000000-2222-0000-0000-00000000041b'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b9c'::uuid, $$DNS-011$$, '00000000-2222-0000-0000-00000000025b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b9d'::uuid, $$KSP-171$$, '00000000-2222-0000-0000-000000000527'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b9e'::uuid, $$DIC-143-R2$$, '00000000-2222-0000-0000-000000000232'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000b9f'::uuid, $$TE-1-127-0$$, '00000000-2222-0000-0000-0000000009f2'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ba1'::uuid, $$TE-2-020-5$$, '00000000-2222-0000-0000-000000000a28'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ba4'::uuid, $$TE-6-720998-0$$, '00000000-2222-0000-0000-000000000b5a'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000baa'::uuid, $$DIC-127$$, '00000000-2222-0000-0000-000000000223'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bab'::uuid, $$DIC-138$$, '00000000-2222-0000-0000-00000000022d'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bac'::uuid, $$JAE-005$$, '00000000-2222-0000-0000-0000000002c4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bad'::uuid, $$JAE-045$$, '00000000-2222-0000-0000-0000000002dc'::uuid, 1, 1, NULL, $$5.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bae'::uuid, $$JAE-047$$, '00000000-2222-0000-0000-0000000002de'::uuid, 1, 1, NULL, $$5.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000baf'::uuid, $$JAE-131$$, '00000000-2222-0000-0000-000000000303'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bb0'::uuid, $$JAE-134$$, '00000000-2222-0000-0000-000000000305'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bb1'::uuid, $$JAE-135$$, '00000000-2222-0000-0000-000000000306'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bb2'::uuid, $$JAE-139$$, '00000000-2222-0000-0000-000000000307'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bb3'::uuid, $$JAE-145$$, '00000000-2222-0000-0000-000000000309'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bb4'::uuid, $$JAE-161$$, '00000000-2222-0000-0000-000000000317'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bb5'::uuid, $$JAE-235$$, '00000000-2222-0000-0000-000000000355'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bb6'::uuid, $$JAE-236$$, '00000000-2222-0000-0000-000000000356'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bb8'::uuid, $$JAE-270$$, '00000000-2222-0000-0000-000000000375'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bb9'::uuid, $$JAE-271$$, '00000000-2222-0000-0000-000000000376'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bba'::uuid, $$JAE-272$$, '00000000-2222-0000-0000-000000000377'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bbb'::uuid, $$JAE-273$$, '00000000-2222-0000-0000-000000000378'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bbc'::uuid, $$JAE-274$$, '00000000-2222-0000-0000-000000000379'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bbd'::uuid, $$JAE-286A/-BN1$$, '00000000-2222-0000-0000-000000000384'::uuid, 1, 1, $$B$$, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bbe'::uuid, $$JAE-287A/-BN1$$, '00000000-2222-0000-0000-000000000385'::uuid, 1, 1, $$B$$, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bbf'::uuid, $$JAE-288$$, '00000000-2222-0000-0000-000000000791'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bc0'::uuid, $$JAE-310-R1$$, '00000000-2222-0000-0000-00000000039d'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bc1'::uuid, $$KDS-091$$, '00000000-2222-0000-0000-0000000003e0'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bc2'::uuid, $$KDS-092$$, '00000000-2222-0000-0000-0000000003e1'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bc3'::uuid, $$KDS-140$$, '00000000-2222-0000-0000-00000000040a'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bc4'::uuid, $$KDS-141$$, '00000000-2222-0000-0000-00000000040c'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bc5'::uuid, $$KMR-001$$, '00000000-2222-0000-0000-00000000042b'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bc6'::uuid, $$MZT-089$$, '00000000-2222-0000-0000-000000000631'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bc7'::uuid, $$MZT-090$$, '00000000-2222-0000-0000-000000000632'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bc8'::uuid, $$MZT-111$$, '00000000-2222-0000-0000-000000000642'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bc9'::uuid, $$MZT-131$$, '00000000-2222-0000-0000-00000000064e'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bca'::uuid, $$MZT-135$$, '00000000-2222-0000-0000-000000000652'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bcb'::uuid, $$MZT-142$$, '00000000-2222-0000-0000-000000000658'::uuid, 1, 1, NULL, $$3.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bcc'::uuid, $$NPC-T010$$, '00000000-2222-0000-0000-0000000006da'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bcd'::uuid, $$NPC-T032$$, '00000000-2222-0000-0000-0000000006db'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bcf'::uuid, $$NPR-001$$, '00000000-2222-0000-0000-0000000006de'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bd0'::uuid, $$ODS-026$$, '00000000-2222-0000-0000-000000000723'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bd1'::uuid, $$ODS-027$$, '00000000-2222-0000-0000-000000000724'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bd2'::uuid, $$ODS-028$$, '00000000-2222-0000-0000-000000000725'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bd3'::uuid, $$OOT-027$$, '00000000-2222-0000-0000-000000000766'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bd4'::uuid, $$SAM-002$$, '00000000-2222-0000-0000-0000000007e1'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bd6'::uuid, $$SHT-011$$, '00000000-2222-0000-0000-000000000801'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bd7'::uuid, $$SHT-015$$, '00000000-2222-0000-0000-000000000807'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bd8'::uuid, $$SHT-016$$, '00000000-2222-0000-0000-000000000808'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bda'::uuid, $$SMK-192$$, '00000000-2222-0000-0000-00000000089a'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bdc'::uuid, $$TDS-008$$, '00000000-2222-0000-0000-00000000097a'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bdd'::uuid, $$TKD-020$$, '00000000-2222-0000-0000-000000000c23'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bde'::uuid, $$TSB-002$$, '00000000-2222-0000-0000-000000000c7e'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bdf'::uuid, $$WKE-003$$, '00000000-2222-0000-0000-000000000ca4'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000be0'::uuid, $$WTN-001$$, '00000000-2222-0000-0000-000000000ca6'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000be1'::uuid, $$WTN-003$$, '00000000-2222-0000-0000-000000000ca8'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000be2'::uuid, $$WTN-004$$, '00000000-2222-0000-0000-000000000ca9'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000be3'::uuid, $$WTN-008$$, '00000000-2222-0000-0000-000000000cb1'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000be4'::uuid, $$YCM-033$$, '00000000-2222-0000-0000-000000000cc5'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000be5'::uuid, $$YCM-051$$, '00000000-2222-0000-0000-000000000cd5'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000be7'::uuid, $$YMK-001$$, '00000000-2222-0000-0000-000000000d05'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000be8'::uuid, $$TE-1-110-5M(Y)$$, '00000000-2222-0000-0000-0000000009f1'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000be9'::uuid, $$TE-1-160-4AType$$, '00000000-2222-0000-0000-000000000a0d'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bea'::uuid, $$TE-4-090-2$$, '00000000-2222-0000-0000-000000000aea'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000beb'::uuid, $$TE$$, '00000000-2222-0000-0000-00000000097f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bec'::uuid, $$TE-4-090-2-R1$$, '00000000-2222-0000-0000-000000000aeb'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bed'::uuid, $$TE-6-157-1$$, '00000000-2222-0000-0000-000000000b51'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bee'::uuid, $$TE-7-157-3$$, '00000000-2222-0000-0000-000000000b7c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bef'::uuid, $$TE-8-157-8$$, '00000000-2222-0000-0000-000000000b9b'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bf0'::uuid, $$ADY-127$$, '00000000-2222-0000-0000-000000000122'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bf1'::uuid, $$ASC-002$$, '00000000-2222-0000-0000-000000000164'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bf2'::uuid, $$JAE-323-R2$$, '00000000-2222-0000-0000-0000000003ab'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bf4'::uuid, $$JAE-322-R1$$, '00000000-2222-0000-0000-0000000003aa'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bf5'::uuid, $$JAE-320$$, '00000000-2222-0000-0000-0000000003a8'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bf6'::uuid, $$JAE-321$$, '00000000-2222-0000-0000-0000000003a9'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bf7'::uuid, $$MZT-145$$, '00000000-2222-0000-0000-00000000065b'::uuid, 1, 1, NULL, $$2.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bf8'::uuid, $$JAE-319-R2$$, '00000000-2222-0000-0000-0000000003a7'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bf9'::uuid, $$JAE-153-R1$$, '00000000-2222-0000-0000-000000000310'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bfb'::uuid, $$TE-6-159-6$$, '00000000-2222-0000-0000-000000000b54'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bfc'::uuid, $$ADY-077$$, '00000000-2222-0000-0000-0000000000a6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bfd'::uuid, $$ADY-088$$, '00000000-2222-0000-0000-0000000000b4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bfe'::uuid, $$TE-6-159-7-R2$$, '00000000-2222-0000-0000-000000000b56'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000bff'::uuid, $$OOT-043$$, '00000000-2222-0000-0000-000000000775'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c00'::uuid, $$TE-9-162-7-R3$$, '00000000-2222-0000-0000-000000000e31'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c01'::uuid, $$DIC-042$$, '00000000-2222-0000-0000-0000000001dd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c02'::uuid, $$YCM-058$$, '00000000-2222-0000-0000-000000000cdb'::uuid, 1, 1, NULL, $$2.0$$, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c03'::uuid, $$YCM-057$$, '00000000-2222-0000-0000-000000000cda'::uuid, 1, 1, NULL, $$2.0$$, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c05'::uuid, $$KSP-159$$, '00000000-2222-0000-0000-00000000051c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c06'::uuid, $$WTN-009-R1$$, '00000000-2222-0000-0000-000000000cb4'::uuid, 1, 1, NULL, $$3.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c09'::uuid, $$EXD$$, '00000000-2222-0000-0000-0000000000f5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c0d'::uuid, $$SMK-125$$, '00000000-2222-0000-0000-000000000886'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c11'::uuid, $$ODS-038$$, '00000000-2222-0000-0000-00000000072e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c13'::uuid, $$MTD-001$$, '00000000-2222-0000-0000-0000000005cf'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c14'::uuid, $$KSP-045$$, '00000000-2222-0000-0000-0000000004be'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c15'::uuid, $$KSP-090$$, '00000000-2222-0000-0000-0000000004e2'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c18'::uuid, $$MZT-009$$, '00000000-2222-0000-0000-000000000614'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c19'::uuid, $$MZT-006$$, '00000000-2222-0000-0000-000000000611'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c1f'::uuid, $$MZT-010$$, '00000000-2222-0000-0000-000000000615'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c20'::uuid, $$MZT-012$$, '00000000-2222-0000-0000-000000000615'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c21'::uuid, $$MZT-002$$, '00000000-2222-0000-0000-000000000610'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c26'::uuid, $$KSP-046$$, '00000000-2222-0000-0000-0000000004bf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c29'::uuid, $$MZT-014$$, '00000000-2222-0000-0000-000000000617'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c2a'::uuid, $$Other-A　タイプ$$, '00000000-2222-0000-0000-000000000796'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c32'::uuid, $$NSK$$, '00000000-2222-0000-0000-0000000006ff'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c34'::uuid, $$KSP-051$$, '00000000-2222-0000-0000-0000000004c6'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c35'::uuid, $$KSP-053$$, '00000000-2222-0000-0000-0000000004c7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c38'::uuid, $$MZT-019$$, '00000000-2222-0000-0000-00000000061b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c39'::uuid, $$MZT-020$$, '00000000-2222-0000-0000-00000000061c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c3a'::uuid, $$Other-Achievement$$, '00000000-2222-0000-0000-000000000797'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c3b'::uuid, $$TE-1-141-3$$, '00000000-2222-0000-0000-000000000a04'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c3e'::uuid, $$TWG-001$$, '00000000-2222-0000-0000-000000000c8c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c3f'::uuid, $$KSE-018$$, '00000000-2222-0000-0000-000000000489'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c40'::uuid, $$TIH-004$$, '00000000-2222-0000-0000-000000000bf5'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c49'::uuid, $$MTM-A$$, '00000000-2222-0000-0000-000000000603'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c4f'::uuid, $$TIH-007$$, '00000000-2222-0000-0000-000000000bf8'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c50'::uuid, $$KDS-055$$, '00000000-2222-0000-0000-0000000003ca'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c51'::uuid, $$KSP-063$$, '00000000-2222-0000-0000-0000000004ca'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c52'::uuid, $$Other-PICKCASE$$, '00000000-2222-0000-0000-000000000799'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c58'::uuid, $$KDS-054$$, '00000000-2222-0000-0000-0000000003cb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c5e'::uuid, $$ADY-060$$, '00000000-2222-0000-0000-000000000099'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c62'::uuid, $$ADY-068$$, '00000000-2222-0000-0000-00000000009f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c63'::uuid, $$ADY-069$$, '00000000-2222-0000-0000-0000000000a0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c65'::uuid, $$KSP-049新$$, '00000000-2222-0000-0000-0000000004c2'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c66'::uuid, $$KSP-050$$, '00000000-2222-0000-0000-0000000004c3'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c67'::uuid, $$LPS-002新$$, '00000000-2222-0000-0000-00000000056d'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c68'::uuid, $$KSE-022$$, '00000000-2222-0000-0000-00000000048d'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c6a'::uuid, $$KSP-067$$, '00000000-2222-0000-0000-0000000004cd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c6c'::uuid, $$KSP-066$$, '00000000-2222-0000-0000-0000000004cc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c71'::uuid, $$LPS-037$$, '00000000-2222-0000-0000-00000000057c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c75'::uuid, $$KSP-050AB$$, '00000000-2222-0000-0000-0000000004c4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c76'::uuid, $$KSP-049AB$$, '00000000-2222-0000-0000-0000000004c1'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c78'::uuid, $$SMK-137$$, '00000000-2222-0000-0000-000000000889'::uuid, 1, 1, NULL, $$2.0$$, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c79'::uuid, $$SMK-143xx$$, '00000000-2222-0000-0000-00000000088b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c7a'::uuid, $$SMK-133$$, '00000000-2222-0000-0000-000000000888'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c7b'::uuid, $$SMK-141xx$$, '00000000-2222-0000-0000-00000000088a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c7c'::uuid, $$SMK-166xx$$, '00000000-2222-0000-0000-000000000890'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c7d'::uuid, $$YCM-025$$, '00000000-2222-0000-0000-000000000cbe'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c80'::uuid, $$KSP-076$$, '00000000-2222-0000-0000-0000000004d5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c84'::uuid, $$Other-シャープ$$, '00000000-2222-0000-0000-00000000079b'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c85'::uuid, $$MZT-056$$, '00000000-2222-0000-0000-00000000061c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c86'::uuid, $$MZT-057$$, '00000000-2222-0000-0000-000000000620'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c8b'::uuid, $$KSE-016-R1$$, '00000000-2222-0000-0000-000000000488'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c8c'::uuid, $$MTM-045$$, '00000000-2222-0000-0000-0000000005de'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c8d'::uuid, $$MTM-044$$, '00000000-2222-0000-0000-0000000005dd'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c8e'::uuid, $$MTM-087$$, '00000000-2222-0000-0000-0000000005e3'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c90'::uuid, $$KSE-（湾）$$, '00000000-2222-0000-0000-00000000047f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c91'::uuid, $$SDSJ-001$$, '00000000-2222-0000-0000-0000000007e7'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c92'::uuid, $$TMC-85Y?$$, '00000000-2222-0000-0000-000000000c4b'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c96'::uuid, $$SK-048-R1$$, '00000000-2222-0000-0000-00000000084c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c98'::uuid, $$TE-013$$, '00000000-2222-0000-0000-0000000009b1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c99'::uuid, $$TIH-008$$, '00000000-2222-0000-0000-000000000bf9'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000c9f'::uuid, $$TE-8-156-5$$, '00000000-2222-0000-0000-000000000b97'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ca1'::uuid, $$SMK$$, '00000000-2222-0000-0000-000000000872'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ca3'::uuid, $$STF-004$$, '00000000-2222-0000-0000-00000000092e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ca4'::uuid, $$SK-048$$, '00000000-2222-0000-0000-00000000084b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ca5'::uuid, $$PNS-002（PlugPNS-001）$$, '00000000-2222-0000-0000-0000000007b1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ca6'::uuid, $$STF-001$$, '00000000-2222-0000-0000-00000000092b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cae'::uuid, $$ADY-054$$, '00000000-2222-0000-0000-000000000096'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cb0'::uuid, $$AXN-001$$, '00000000-2222-0000-0000-000000000191'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cb2'::uuid, $$TIH-009-BN1$$, '00000000-2222-0000-0000-000000000bfa'::uuid, 1, 1, $$B$$, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cb4'::uuid, $$MTD-002AB$$, '00000000-2222-0000-0000-0000000005d3'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cb6'::uuid, $$YOK-002$$, '00000000-2222-0000-0000-000000000d1e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cbb'::uuid, $$SPK-001$$, '00000000-2222-0000-0000-0000000008ca'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cbd'::uuid, $$TE-2-053-3-TN1$$, '00000000-2222-0000-0000-000000000a34'::uuid, 1, 1, $$T$$, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cbe'::uuid, $$TE-2-053-3-BN1$$, '00000000-2222-0000-0000-000000000a33'::uuid, 1, 1, $$B$$, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cbf'::uuid, $$MTR-001$$, '00000000-2222-0000-0000-000000000605'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cc2'::uuid, $$MTR-004$$, '00000000-2222-0000-0000-000000000609'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cc4'::uuid, $$IZW-001$$, '00000000-2222-0000-0000-0000000002bc'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cc5'::uuid, $$IZW-002$$, '00000000-2222-0000-0000-0000000002bd'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cc6'::uuid, $$TJS-002$$, '00000000-2222-0000-0000-000000000c0f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cc7'::uuid, $$KSP-105$$, '00000000-2222-0000-0000-0000000004f0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ccb'::uuid, $$FDE-003$$, '00000000-2222-0000-0000-000000000110'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cce'::uuid, $$MTM-074$$, '00000000-2222-0000-0000-0000000005e0'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ccf'::uuid, $$MTM-080$$, '00000000-2222-0000-0000-0000000005e2'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cd8'::uuid, $$KSP-115$$, '00000000-2222-0000-0000-0000000004fb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cda'::uuid, $$Other-YO1014A(9K)$$, '00000000-2222-0000-0000-00000000079a'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cdb'::uuid, $$ADY-075$$, '00000000-2222-0000-0000-0000000000a4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cdc'::uuid, $$ADY-078-TN1$$, '00000000-2222-0000-0000-0000000000a9'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cdd'::uuid, $$ADY-078-BN1$$, '00000000-2222-0000-0000-0000000000a8'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cde'::uuid, $$KSP-330$$, '00000000-2222-0000-0000-00000000054e'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ce0'::uuid, $$SRD-049$$, '00000000-2222-0000-0000-0000000008cc'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ce4'::uuid, $$SK-051$$, '00000000-2222-0000-0000-00000000084d'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ceb'::uuid, $$ADY-090-R1$$, '00000000-2222-0000-0000-0000000000b6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cee'::uuid, $$MTM$$, '00000000-2222-0000-0000-0000000005d6'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cef'::uuid, $$JAE-075$$, '00000000-2222-0000-0000-0000000002eb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cf1'::uuid, $$DK-030$$, '00000000-2222-0000-0000-000000000251'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cf2'::uuid, $$DK-031$$, '00000000-2222-0000-0000-000000000252'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cf9'::uuid, $$CPL-サンプル用トレイ$$, '00000000-2222-0000-0000-0000000001b1'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cfd'::uuid, $$OOT-020$$, '00000000-2222-0000-0000-00000000075f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cfe'::uuid, $$ORM-001$$, '00000000-2222-0000-0000-00000000074f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000cff'::uuid, $$YMS-004$$, '00000000-2222-0000-0000-000000000d10'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d00'::uuid, $$YMS-005$$, '00000000-2222-0000-0000-000000000d11'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d01'::uuid, $$YCM-038-BN1$$, '00000000-2222-0000-0000-000000000cca'::uuid, 1, 1, $$B$$, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d03'::uuid, $$KIK-501$$, '00000000-2222-0000-0000-000000000422'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d04'::uuid, $$DIM-004$$, '00000000-2222-0000-0000-00000000023e'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d0f'::uuid, $$MYS-004$$, '00000000-2222-0000-0000-00000000060d'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d19'::uuid, $$YCM-017$$, '00000000-2222-0000-0000-000000000cba'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d1a'::uuid, $$SJI-014$$, '00000000-2222-0000-0000-000000000821'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d2a'::uuid, $$YCM-047$$, '00000000-2222-0000-0000-000000000cd3'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d2e'::uuid, $$ADY-123$$, '00000000-2222-0000-0000-00000000011e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d46'::uuid, $$YZP-004-BN1$$, '00000000-2222-0000-0000-000000000dc8'::uuid, 1, 1, $$B$$, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d48'::uuid, $$Other-8号機$$, '00000000-2222-0000-0000-000000000795'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d49'::uuid, $$KSP-040$$, '00000000-2222-0000-0000-0000000004b9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d4a'::uuid, $$KSP-041$$, '00000000-2222-0000-0000-0000000004ba'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d4b'::uuid, $$KSP-042$$, '00000000-2222-0000-0000-0000000004bb'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d4c'::uuid, $$KSP-043$$, '00000000-2222-0000-0000-0000000004bc'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d4d'::uuid, $$KSP-044$$, '00000000-2222-0000-0000-0000000004bd'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d4f'::uuid, $$MZT-112新$$, '00000000-2222-0000-0000-000000000644'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d50'::uuid, $$IRS-001$$, '00000000-2222-0000-0000-0000000002b6'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d52'::uuid, $$NEC$$, '00000000-2222-0000-0000-000000000661'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d56'::uuid, $$TKO$$, '00000000-2222-0000-0000-000000000c2d'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d57'::uuid, $$DIC-023$$, '00000000-2222-0000-0000-0000000001d3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d58'::uuid, $$DIC-024$$, '00000000-2222-0000-0000-0000000001d4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d59'::uuid, $$JAE-025$$, '00000000-2222-0000-0000-0000000002d0'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d5a'::uuid, $$JAE-051$$, '00000000-2222-0000-0000-0000000002e0'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d5b'::uuid, $$JAE-059$$, '00000000-2222-0000-0000-0000000002e4'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d5c'::uuid, $$JAE-067$$, '00000000-2222-0000-0000-0000000002e8'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d5f'::uuid, $$JAE-066$$, '00000000-2222-0000-0000-0000000002e7'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d61'::uuid, $$Other$$, '00000000-2222-0000-0000-000000000791'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d62'::uuid, $$TMC-014$$, '00000000-2222-0000-0000-000000000c48'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d63'::uuid, $$KSP-049$$, '00000000-2222-0000-0000-0000000004c0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d65'::uuid, $$LKS-003$$, '00000000-2222-0000-0000-000000000566'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d70'::uuid, $$YKW-007$$, '00000000-2222-0000-0000-000000000d02'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d71'::uuid, $$JAE-169$$, '00000000-2222-0000-0000-00000000031c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d73'::uuid, $$JAE-215$$, '00000000-2222-0000-0000-000000000343'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d78'::uuid, $$SSJ-015$$, '00000000-2222-0000-0000-0000000008db'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d7b'::uuid, $$MTM-161$$, '00000000-2222-0000-0000-0000000005eb'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d7e'::uuid, $$TE-5-157-0$$, '00000000-2222-0000-0000-000000000b31'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d80'::uuid, $$TE-3-161-5$$, '00000000-2222-0000-0000-000000000ada'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d84'::uuid, $$TE-4-161-1$$, '00000000-2222-0000-0000-000000000b0e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d8c'::uuid, $$TE-9-161-1$$, '00000000-2222-0000-0000-000000000bc1'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d90'::uuid, $$JAE-026-R2$$, '00000000-2222-0000-0000-0000000002d1'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000d96'::uuid, $$TE-3-160-4$$, '00000000-2222-0000-0000-000000000ad5'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dac'::uuid, $$TBG-024$$, '00000000-2222-0000-0000-000000000964'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dad'::uuid, $$SPJ-031-TN1$$, '00000000-2222-0000-0000-0000000008c0'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dae'::uuid, $$SPJ-031-BN1$$, '00000000-2222-0000-0000-0000000008bf'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000db1'::uuid, $$KSP-037AB$$, '00000000-2222-0000-0000-0000000004b7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000db2'::uuid, $$KSP-038AB$$, '00000000-2222-0000-0000-0000000004b8'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000db4'::uuid, $$ADV-023$$, '00000000-2222-0000-0000-000000000088'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000db5'::uuid, $$KSP-050-R1$$, '00000000-2222-0000-0000-0000000004c5'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000db7'::uuid, $$KRE-009$$, '00000000-2222-0000-0000-00000000045b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000db8'::uuid, $$KRE-008$$, '00000000-2222-0000-0000-00000000045a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000db9'::uuid, $$KRE-014$$, '00000000-2222-0000-0000-00000000045e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dba'::uuid, $$KRE-012$$, '00000000-2222-0000-0000-00000000045d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dbb'::uuid, $$KRE-019$$, '00000000-2222-0000-0000-000000000462'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dbc'::uuid, $$KRE-020$$, '00000000-2222-0000-0000-000000000463'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dbd'::uuid, $$MZT-060$$, '00000000-2222-0000-0000-000000000621'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dc2'::uuid, $$シャープ$$, '00000000-2222-0000-0000-000000000791'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dc3'::uuid, $$FUJIKURA$$, '00000000-2222-0000-0000-000000000791'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dc4'::uuid, $$ZD$$, '00000000-2222-0000-0000-000000000791'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dc5'::uuid, $$レーザーシート小$$, '00000000-2222-0000-0000-000000000791'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dc6'::uuid, $$テルモ$$, '00000000-2222-0000-0000-000000000791'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dc7'::uuid, $$Hシリーズ$$, '00000000-2222-0000-0000-000000000d26'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dc8'::uuid, $$ZA$$, '00000000-2222-0000-0000-000000000791'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dc9'::uuid, $$ソニー$$, '00000000-2222-0000-0000-000000000791'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dca'::uuid, $$AAT-001-TN1$$, '00000000-2222-0000-0000-000000000077'::uuid, 1, 1, $$T$$, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dcb'::uuid, $$AAT-001-BN1$$, '00000000-2222-0000-0000-000000000076'::uuid, 1, 1, $$B$$, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dcd'::uuid, $$ADV-006$$, '00000000-2222-0000-0000-000000000080'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dcf'::uuid, $$ADV-007$$, '00000000-2222-0000-0000-000000000081'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dd0'::uuid, $$ADV-014$$, '00000000-2222-0000-0000-000000000084'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dd3'::uuid, $$ADV-015$$, '00000000-2222-0000-0000-000000000083'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dd4'::uuid, $$ADV-019$$, '00000000-2222-0000-0000-000000000087'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dd5'::uuid, $$ADV-002$$, '00000000-2222-0000-0000-00000000007f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dd6'::uuid, $$ADV-008$$, '00000000-2222-0000-0000-000000000082'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dd7'::uuid, $$ADV-024$$, '00000000-2222-0000-0000-000000000089'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000dd8'::uuid, $$ADV-035$$, '00000000-2222-0000-0000-000000000091'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000def'::uuid, $$ALP-001$$, '00000000-2222-0000-0000-000000000135'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000df1'::uuid, $$AMP$$, '00000000-2222-0000-0000-000000000139'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000df7'::uuid, $$AMP-9面$$, '00000000-2222-0000-0000-00000000014d'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000df8'::uuid, $$AMP-大　PP　台湾機$$, '00000000-2222-0000-0000-00000000014f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000df9'::uuid, $$AMP-PP台湾機$$, '00000000-2222-0000-0000-00000000014e'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e01'::uuid, $$SSI$$, '00000000-2222-0000-0000-0000000008d4'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e02'::uuid, $$ATK-053$$, '00000000-2222-0000-0000-00000000016f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e03'::uuid, $$ATS-002$$, '00000000-2222-0000-0000-000000000170'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e0c'::uuid, $$BMI-001$$, '00000000-2222-0000-0000-000000000194'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e0e'::uuid, $$CIPS$$, '00000000-2222-0000-0000-00000000019d'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e1b'::uuid, $$DIC$$, '00000000-2222-0000-0000-0000000001c3'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e25'::uuid, $$DIC-049$$, '00000000-2222-0000-0000-0000000001e4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e29'::uuid, $$DIC-033$$, '00000000-2222-0000-0000-0000000001d8'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e33'::uuid, $$DIN-010$$, '00000000-2222-0000-0000-00000000024f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e42'::uuid, $$FJK$$, '00000000-2222-0000-0000-000000000263'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e44'::uuid, $$MRY-003PS$$, '00000000-2222-0000-0000-0000000005bb'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e46'::uuid, $$GMY-012$$, '00000000-2222-0000-0000-000000000271'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e47'::uuid, $$GMY-023$$, '00000000-2222-0000-0000-000000000273'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e48'::uuid, $$GMY-036$$, '00000000-2222-0000-0000-000000000274'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e49'::uuid, $$GMY-040$$, '00000000-2222-0000-0000-000000000275'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e4e'::uuid, $$SMK-066$$, '00000000-2222-0000-0000-00000000087f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e50'::uuid, $$SMK-131$$, '00000000-2222-0000-0000-000000000887'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e51'::uuid, $$SMK-114$$, '00000000-2222-0000-0000-000000000884'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e52'::uuid, $$SMK-117$$, '00000000-2222-0000-0000-000000000885'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e53'::uuid, $$SMK-152$$, '00000000-2222-0000-0000-00000000088e'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e5e'::uuid, $$HOKUTO$$, '00000000-2222-0000-0000-00000000029c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e60'::uuid, $$TK-001$$, '00000000-2222-0000-0000-000000000c12'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e61'::uuid, $$アンテナ50$$, '00000000-2222-0000-0000-000000000dce'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e62'::uuid, $$HYS-001$$, '00000000-2222-0000-0000-0000000002a5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e67'::uuid, $$IWD-004$$, '00000000-2222-0000-0000-0000000002ba'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e69'::uuid, $$KDS-066$$, '00000000-2222-0000-0000-0000000003d1'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e6e'::uuid, $$JAE-124$$, '00000000-2222-0000-0000-0000000002fe'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e77'::uuid, $$JAE-187-R1$$, '00000000-2222-0000-0000-00000000032a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e8b'::uuid, $$JAE-146$$, '00000000-2222-0000-0000-00000000030a'::uuid, 1, 1, NULL, $$5.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e93'::uuid, $$JPS-002$$, '00000000-2222-0000-0000-0000000003b0'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e94'::uuid, $$JR-0$$, '00000000-2222-0000-0000-0000000003b1'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e96'::uuid, $$TH-013$$, '00000000-2222-0000-0000-000000000bd2'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e98'::uuid, $$K-26$$, '00000000-2222-0000-0000-0000000003b6'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000e99'::uuid, $$KDS-026$$, '00000000-2222-0000-0000-0000000003be'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ea8'::uuid, $$KDS-070$$, '00000000-2222-0000-0000-0000000003d5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000eaf'::uuid, $$KIK-004-TN1$$, '00000000-2222-0000-0000-00000000041e'::uuid, 1, 1, $$T$$, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000eb0'::uuid, $$KIK-003Txx$$, '00000000-2222-0000-0000-00000000041c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000eb1'::uuid, $$KIK-003Bxx$$, '00000000-2222-0000-0000-00000000041a'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000eb2'::uuid, $$KIK-002-TN1$$, '00000000-2222-0000-0000-000000000418'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000eb5'::uuid, $$KIK-003-BN1$$, '00000000-2222-0000-0000-000000000419'::uuid, 1, 1, $$B$$, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000eb6'::uuid, $$KIK-001$$, '00000000-2222-0000-0000-000000000417'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000eb7'::uuid, $$KIK-004-BN1$$, '00000000-2222-0000-0000-00000000041d'::uuid, 1, 1, $$B$$, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000eb8'::uuid, $$KJK-001$$, '00000000-2222-0000-0000-000000000423'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000eba'::uuid, $$KKC-002新$$, '00000000-2222-0000-0000-000000000426'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ebc'::uuid, $$KOK$$, '00000000-2222-0000-0000-000000000440'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ebe'::uuid, $$KRE-045$$, '00000000-2222-0000-0000-000000000479'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ebf'::uuid, $$KRE-031$$, '00000000-2222-0000-0000-00000000046c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ec0'::uuid, $$KRE-015$$, '00000000-2222-0000-0000-00000000045f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ec3'::uuid, $$KSE-台湾機$$, '00000000-2222-0000-0000-000000000493'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ec4'::uuid, $$KSE-フタ$$, '00000000-2222-0000-0000-000000000492'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ec5'::uuid, $$KSE-009$$, '00000000-2222-0000-0000-000000000484'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ec7'::uuid, $$KSE-016$$, '00000000-2222-0000-0000-000000000487'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ec9'::uuid, $$KSP-116$$, '00000000-2222-0000-0000-0000000004fc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000eca'::uuid, $$KSP-136-R1$$, '00000000-2222-0000-0000-000000000508'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ecc'::uuid, $$KSP-020左$$, '00000000-2222-0000-0000-0000000004a5'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ecd'::uuid, $$KSP-026左$$, '00000000-2222-0000-0000-0000000004ad'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ece'::uuid, $$KSP-020右$$, '00000000-2222-0000-0000-0000000004a4'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ecf'::uuid, $$KSP-026右$$, '00000000-2222-0000-0000-0000000004ac'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ed0'::uuid, $$KSP-Inline$$, '00000000-2222-0000-0000-00000000054f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ed1'::uuid, $$KSP-002$$, '00000000-2222-0000-0000-000000000495'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ed2'::uuid, $$KSP-005$$, '00000000-2222-0000-0000-000000000496'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ed3'::uuid, $$KSP-009$$, '00000000-2222-0000-0000-000000000498'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ed4'::uuid, $$KSP-006$$, '00000000-2222-0000-0000-000000000497'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ed9'::uuid, $$KSP-168$$, '00000000-2222-0000-0000-000000000524'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ee4'::uuid, $$KW-025-1$$, '00000000-2222-0000-0000-000000000556'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ee8'::uuid, $$KYANON$$, '00000000-2222-0000-0000-00000000055b'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ee9'::uuid, $$LKS$$, '00000000-2222-0000-0000-000000000563'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000eec'::uuid, $$LPS-017$$, '00000000-2222-0000-0000-000000000579'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000ef1'::uuid, $$MCC-003-R3$$, '00000000-2222-0000-0000-000000000589'::uuid, 1, 1, NULL, $$6.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000efd'::uuid, $$MS-033$$, '00000000-2222-0000-0000-0000000005c7'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000efe'::uuid, $$MTM-129$$, '00000000-2222-0000-0000-0000000005e7'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000eff'::uuid, $$MTM-152$$, '00000000-2222-0000-0000-0000000005e9'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f00'::uuid, $$MTM-027$$, '00000000-2222-0000-0000-0000000005db'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f02'::uuid, $$MTM-026$$, '00000000-2222-0000-0000-0000000005da'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f03'::uuid, $$MTM-283x205$$, '00000000-2222-0000-0000-000000000602'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f04'::uuid, $$MTM-005$$, '00000000-2222-0000-0000-0000000005d7'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f06'::uuid, $$MTM-130$$, '00000000-2222-0000-0000-0000000005e8'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f07'::uuid, $$MZT-110$$, '00000000-2222-0000-0000-000000000641'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f08'::uuid, $$MZ-TN1$$, '00000000-2222-0000-0000-00000000060f'::uuid, 1, 1, $$T$$, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000000f0f'::uuid, $$MZT-013$$, '00000000-2222-0000-0000-000000000617'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;

COMMIT;
