-- PART 14/14
BEGIN;

INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014eb'::uuid, $$SMK-111$$, '00000000-2222-0000-0000-0000000010ff'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014ec'::uuid, $$SMK-003?$$, '00000000-2222-0000-0000-000000001100'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014ed'::uuid, $$NONAME-034$$, '00000000-2222-0000-0000-000000001101'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014ee'::uuid, $$TE-4-075-7-N2$$, '00000000-2222-0000-0000-000000000f60'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014ef'::uuid, $$OTHER-A59-6903$$, '00000000-2222-0000-0000-000000001102'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014f0'::uuid, $$OTHER-B59-6903$$, '00000000-2222-0000-0000-000000001103'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014f1'::uuid, $$SLK-126$$, '00000000-2222-0000-0000-000000001104'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014f2'::uuid, $$SLK-124$$, '00000000-2222-0000-0000-000000001105'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014f3'::uuid, $$OTP-003$$, '00000000-2222-0000-0000-000000001106'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014f4'::uuid, $$ODS-020$$, '00000000-2222-0000-0000-000000001107'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014f6'::uuid, $$TE-60654$$, '00000000-2222-0000-0000-000000001108'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014f7'::uuid, $$GW-2K$$, '00000000-2222-0000-0000-000000000fba'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014f9'::uuid, $$TE-5-997-3$$, '00000000-2222-0000-0000-00000000110a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014fa'::uuid, $$TE-2-057-1$$, '00000000-2222-0000-0000-00000000110b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014fc'::uuid, $$TE-2-059-9-N3$$, '00000000-2222-0000-0000-000000000a37'::uuid, 1, 3, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014fd'::uuid, $$TE-3-066-6-N3$$, '00000000-2222-0000-0000-000000000ab9'::uuid, 1, 3, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014fe'::uuid, $$Te-3-066-6-N4$$, '00000000-2222-0000-0000-000000000ab9'::uuid, 1, 4, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000014ff'::uuid, $$TE-3-066-8-N4$$, '00000000-2222-0000-0000-000000000f18'::uuid, 1, 4, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001500'::uuid, $$Te-3-066-8-N4$$, '00000000-2222-0000-0000-000000000f18'::uuid, 1, 4, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001501'::uuid, $$TE-3-066-7-N3$$, '00000000-2222-0000-0000-000000000aba'::uuid, 1, 3, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001502'::uuid, $$TE-3-720996-6フタ?$$, '00000000-2222-0000-0000-000000001081'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001503'::uuid, $$TE-2-059-3$$, '00000000-2222-0000-0000-00000000110c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001504'::uuid, $$YES-004-R1$$, '00000000-2222-0000-0000-00000000110d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001506'::uuid, $$JAE-337-R2$$, '00000000-2222-0000-0000-00000000110e'::uuid, 1, 1, NULL, $$5.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001507'::uuid, $$STD-007$$, '00000000-2222-0000-0000-00000000110f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001508'::uuid, $$DIC-161D$$, '00000000-2222-0000-0000-000000001110'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001509'::uuid, $$KOS-022-R1$$, '00000000-2222-0000-0000-000000001111'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000150a'::uuid, $$WKE-004$$, '00000000-2222-0000-0000-000000001112'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000150b'::uuid, $$SHT-019-R1$$, '00000000-2222-0000-0000-000000001113'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000150c'::uuid, $$TE-1-019-6$$, '00000000-2222-0000-0000-000000001114'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001510'::uuid, $$TE-0-073-1$$, '00000000-2222-0000-0000-000000000fc3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001511'::uuid, $$TE-12793341-1$$, '00000000-2222-0000-0000-000000001115'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001512'::uuid, $$TE-1-023-8$$, '00000000-2222-0000-0000-000000001116'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001513'::uuid, $$TE-2-108-9$$, '00000000-2222-0000-0000-000000001117'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001514'::uuid, $$TE-2013973-1$$, '00000000-2222-0000-0000-000000001118'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001515'::uuid, $$TIH-010$$, '00000000-2222-0000-0000-000000000bfc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001516'::uuid, $$OGR-013M$$, '00000000-2222-0000-0000-000000001119'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001517'::uuid, $$NSE-004$$, '00000000-2222-0000-0000-00000000111a'::uuid, 1, 1, NULL, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001518'::uuid, $$WKE-005$$, '00000000-2222-0000-0000-00000000111b'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001519'::uuid, $$JAE-346$$, '00000000-2222-0000-0000-00000000111c'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000151a'::uuid, $$ADY-129$$, '00000000-2222-0000-0000-00000000012b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000151b'::uuid, $$SMK-169$$, '00000000-2222-0000-0000-00000000111e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000151c'::uuid, $$DIC-161$$, '00000000-2222-0000-0000-00000000111f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000151d'::uuid, $$SMK-100$$, '00000000-2222-0000-0000-000000001120'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000151e'::uuid, $$MTM-185D$$, '00000000-2222-0000-0000-000000001121'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001520'::uuid, $$MRD-001D$$, '00000000-2222-0000-0000-000000001122'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001521'::uuid, $$MTM-186D$$, '00000000-2222-0000-0000-000000001123'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001522'::uuid, $$MTM-187D$$, '00000000-2222-0000-0000-000000001124'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001523'::uuid, $$BSZ-001D$$, '00000000-2222-0000-0000-000000001125'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001524'::uuid, $$JAE-347$$, '00000000-2222-0000-0000-000000001126'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001525'::uuid, $$MTM-185-R1$$, '00000000-2222-0000-0000-000000001127'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001526'::uuid, $$SCW-003D$$, '00000000-2222-0000-0000-000000001128'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001527'::uuid, $$ASH-011$$, '00000000-2222-0000-0000-00000000112a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001529'::uuid, $$MTM-188D$$, '00000000-2222-0000-0000-00000000112c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000152a'::uuid, $$MRD-001-R1$$, '00000000-2222-0000-0000-00000000112d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000152b'::uuid, $$MTM-186$$, '00000000-2222-0000-0000-00000000112e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000152c'::uuid, $$JAE-348$$, '00000000-2222-0000-0000-00000000112f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000152d'::uuid, $$KSP-208$$, '00000000-2222-0000-0000-000000001130'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000152e'::uuid, $$KSP-209$$, '00000000-2222-0000-0000-000000001131'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001530'::uuid, $$SCW-001$$, '00000000-2222-0000-0000-000000001133'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001531'::uuid, $$SCW-002$$, '00000000-2222-0000-0000-000000001134'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001532'::uuid, $$BSZ-001$$, '00000000-2222-0000-0000-000000001135'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001533'::uuid, $$ENT-003$$, '00000000-2222-0000-0000-000000001136'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001534'::uuid, $$JAE-350-R1$$, '00000000-2222-0000-0000-000000001137'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001535'::uuid, $$JAE-351$$, '00000000-2222-0000-0000-000000001138'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001536'::uuid, $$JAE-349-R2$$, '00000000-2222-0000-0000-000000001139'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001538'::uuid, $$ADY-130$$, '00000000-2222-0000-0000-00000000113b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001539'::uuid, $$SCW-003D-R2$$, '00000000-2222-0000-0000-00000000113c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000153a'::uuid, $$TE-9-998-6$$, '00000000-2222-0000-0000-00000000113d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000153b'::uuid, $$RPD-001-R2$$, '00000000-2222-0000-0000-00000000113e'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000153c'::uuid, $$RPD-002-R3$$, '00000000-2222-0000-0000-000000001199'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000153d'::uuid, $$MTM-188$$, '00000000-2222-0000-0000-000000001140'::uuid, 1, 1, NULL, $$6.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000153e'::uuid, $$JAE-345A-R3$$, '00000000-2222-0000-0000-000000001141'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000153f'::uuid, $$JAE-345B-R3$$, '00000000-2222-0000-0000-000000001142'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001540'::uuid, $$JAE-352A$$, '00000000-2222-0000-0000-000000001143'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001541'::uuid, $$JAE-352-BN1$$, '00000000-2222-0000-0000-000000001144'::uuid, 1, 1, $$B$$, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001542'::uuid, $$JAE-344A-R4$$, '00000000-2222-0000-0000-000000001145'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001543'::uuid, $$JAE-344B-R4$$, '00000000-2222-0000-0000-000000001146'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001544'::uuid, $$ASH-013-R1(NG)$$, '00000000-2222-0000-0000-000000001147'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001545'::uuid, $$JAE-343B-R3$$, '00000000-2222-0000-0000-000000001148'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001546'::uuid, $$JAE-343A-R3$$, '00000000-2222-0000-0000-000000001149'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001547'::uuid, $$KSC-005$$, '00000000-2222-0000-0000-00000000114a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001548'::uuid, $$ASH-013-R1$$, '00000000-2222-0000-0000-000000001147'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001549'::uuid, $$YCM-076D$$, '00000000-2222-0000-0000-00000000114b'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000154a'::uuid, $$MTM-187D-R4$$, '00000000-2222-0000-0000-00000000114c'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000154b'::uuid, $$DIC-162-R2$$, '00000000-2222-0000-0000-00000000114d'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000154c'::uuid, $$TKD-023D$$, '00000000-2222-0000-0000-00000000114e'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000154d'::uuid, $$MTM-185D-R3$$, '00000000-2222-0000-0000-00000000114f'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000154e'::uuid, $$TE-5-159-2-R2$$, '00000000-2222-0000-0000-000000001150'::uuid, 1, 1, NULL, $$5.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000154f'::uuid, $$TE-5-159-3-R2$$, '00000000-2222-0000-0000-000000001151'::uuid, 1, 1, NULL, $$5.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001550'::uuid, $$MTM-187-R4$$, '00000000-2222-0000-0000-000000001152'::uuid, 1, 1, NULL, $$1540.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001554'::uuid, $$SHARP-SHARP$$, '00000000-2222-0000-0000-000000001154'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001555'::uuid, $$SLK-139$$, '00000000-2222-0000-0000-000000001155'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001556'::uuid, $$SK-$$, '00000000-2222-0000-0000-000000001156'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001557'::uuid, $$OST-010$$, '00000000-2222-0000-0000-000000001157'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001558'::uuid, $$OST-011$$, '00000000-2222-0000-0000-000000001158'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000155a'::uuid, $$DIM-001$$, '00000000-2222-0000-0000-00000000115a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000155b'::uuid, $$TE-3-103-3$$, '00000000-2222-0000-0000-00000000115b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000155d'::uuid, $$JAE-028$$, '00000000-2222-0000-0000-00000000115d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000155e'::uuid, $$JAE-028-R1$$, '00000000-2222-0000-0000-00000000115e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001561'::uuid, $$TE-7-127-7-R1$$, '00000000-2222-0000-0000-000000001161'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001565'::uuid, $$EXD-001$$, '00000000-2222-0000-0000-000000000e4e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001566'::uuid, $$TE-5-103-4$$, '00000000-2222-0000-0000-000000001165'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001567'::uuid, $$TE-2-156-0$$, '00000000-2222-0000-0000-000000001166'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001568'::uuid, $$HAYASHI-TELEM354X300$$, '00000000-2222-0000-0000-000000001167'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001569'::uuid, $$TE-6-129-2$$, '00000000-2222-0000-0000-000000001168'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000156b'::uuid, $$GMY-NONAME$$, '00000000-2222-0000-0000-00000000116a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000156c'::uuid, $$TE-7-129-5$$, '00000000-2222-0000-0000-00000000116b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000156d'::uuid, $$SK-035$$, '00000000-2222-0000-0000-00000000116c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000156f'::uuid, $$NRK-013$$, '00000000-2222-0000-0000-00000000116e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001570'::uuid, $$OTHER-364X243$$, '00000000-2222-0000-0000-00000000116f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001571'::uuid, $$TE-7-135-9$$, '00000000-2222-0000-0000-000000001170'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001572'::uuid, $$TKS-015$$, '00000000-2222-0000-0000-000000001171'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001573'::uuid, $$TKS-AB$$, '00000000-2222-0000-0000-000000001172'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001574'::uuid, $$SK-069$$, '00000000-2222-0000-0000-000000001173'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001575'::uuid, $$GMY-T-25$$, '00000000-2222-0000-0000-000000001174'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001576'::uuid, $$OTHER-プックグッスタ$$, '00000000-2222-0000-0000-000000001175'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001577'::uuid, $$JAE-015$$, '00000000-2222-0000-0000-000000001176'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001578'::uuid, $$OTHER-プックグッスタ2$$, '00000000-2222-0000-0000-000000001177'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001579'::uuid, $$OTHER-380カット$$, '00000000-2222-0000-0000-000000001178'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000157b'::uuid, $$OTHER-T8623518.5Φ　30面$$, '00000000-2222-0000-0000-000000001179'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000157c'::uuid, $$TE-5-110-8$$, '00000000-2222-0000-0000-00000000117a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000157d'::uuid, $$TE-5-110-8-N2$$, '00000000-2222-0000-0000-00000000117b'::uuid, 1, 2, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001581'::uuid, $$NRK-014$$, '00000000-2222-0000-0000-00000000117f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001582'::uuid, $$TE-8-127-5-R1$$, '00000000-2222-0000-0000-000000001180'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001583'::uuid, $$MTM-014(旧）$$, '00000000-2222-0000-0000-000000001181'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001587'::uuid, $$MTM-185-R3$$, '00000000-2222-0000-0000-000000001185'::uuid, 1, 1, NULL, $$1540.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001588'::uuid, $$JAE-353-R1$$, '00000000-2222-0000-0000-000000000a6b'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001589'::uuid, $$CHG-002DAB$$, '00000000-2222-0000-0000-000000000dc4'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000158a'::uuid, $$CHG-003DAB$$, '00000000-2222-0000-0000-000000001188'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000158b'::uuid, $$CHG-001-R8$$, '00000000-2222-0000-0000-0000000011d1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000158c'::uuid, $$ASH-014D$$, '00000000-2222-0000-0000-00000000028d'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000158d'::uuid, $$TKD-023$$, '00000000-2222-0000-0000-00000000118b'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000158e'::uuid, $$圧空BOX600$$, '00000000-2222-0000-0000-000000000b33'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000158f'::uuid, $$YCM-076-R1NG$$, '00000000-2222-0000-0000-000000000b51'::uuid, 1, 1, NULL, NULL, $$SCRAPPED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001590'::uuid, $$KOS-023$$, '00000000-2222-0000-0000-00000000118e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001591'::uuid, $$TE-5-159-1-R2$$, '00000000-2222-0000-0000-00000000118f'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001592'::uuid, $$JAE-354$$, '00000000-2222-0000-0000-000000001190'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001593'::uuid, $$SHT-020$$, '00000000-2222-0000-0000-000000001191'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001594'::uuid, $$MDS-006D$$, '00000000-2222-0000-0000-000000001192'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001595'::uuid, $$MMT-019-R1$$, '00000000-2222-0000-0000-00000000008c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001596'::uuid, $$KOS-024$$, '00000000-2222-0000-0000-000000001195'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001597'::uuid, $$APS-001D-R5$$, '00000000-2222-0000-0000-000000001196'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001598'::uuid, $$KOS-025$$, '00000000-2222-0000-0000-00000000068b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001599'::uuid, $$KOS-026$$, '00000000-2222-0000-0000-000000001198'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000159b'::uuid, $$YCM-076-R2$$, '00000000-2222-0000-0000-00000000119a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000159c'::uuid, $$MDS-007D-R1$$, '00000000-2222-0000-0000-00000000119b'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000159d'::uuid, $$ASC-003$$, '00000000-2222-0000-0000-00000000119c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000159e'::uuid, $$ADY-131$$, '00000000-2222-0000-0000-00000000119d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000159f'::uuid, $$APS-001-R6$$, '00000000-2222-0000-0000-00000000119e'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015a0'::uuid, $$ADY-132$$, '00000000-2222-0000-0000-00000000119f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015a1'::uuid, $$DIC-164$$, '00000000-2222-0000-0000-0000000011a0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015a2'::uuid, $$ASH-014-R1$$, '00000000-2222-0000-0000-0000000011a1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015a3'::uuid, $$ASC-004$$, '00000000-2222-0000-0000-0000000011a2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015a5'::uuid, $$SSM-057$$, '00000000-2222-0000-0000-0000000011a4'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015a6'::uuid, $$YCM-077D-R2$$, '00000000-2222-0000-0000-0000000011a5'::uuid, 1, 1, NULL, NULL, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015a7'::uuid, $$SMK-222$$, '00000000-2222-0000-0000-0000000011a5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015a9'::uuid, $$CHG-002AB-R1$$, '00000000-2222-0000-0000-000000000aea'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015ab'::uuid, $$NGT010$$, '00000000-2222-0000-0000-000000000e22'::uuid, 1, 1, NULL, NULL, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015ac'::uuid, $$TIH-025-R1$$, '00000000-2222-0000-0000-000000000165'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015ad'::uuid, $$CHG-003AB-R1$$, '00000000-2222-0000-0000-000000000e34'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015ae'::uuid, $$YCM-077-R2$$, '00000000-2222-0000-0000-0000000011aa'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015af'::uuid, $$MDS-006$$, '00000000-2222-0000-0000-0000000011ab'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015b0'::uuid, $$MDS-007-R1$$, '00000000-2222-0000-0000-0000000011ac'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015b1'::uuid, $$SIT-025D$$, '00000000-2222-0000-0000-0000000008ed'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015b2'::uuid, $$SIT-026D-R1$$, '00000000-2222-0000-0000-000000000266'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015b3'::uuid, $$SIT-027D$$, '00000000-2222-0000-0000-000000000267'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015b4'::uuid, $$SIT-028D$$, '00000000-2222-0000-0000-0000000011b0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015b5'::uuid, $$KWE-004$$, '00000000-2222-0000-0000-0000000011b1'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015b6'::uuid, $$YCM-010$$, '00000000-2222-0000-0000-0000000011b2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015b7'::uuid, $$KSP-210$$, '00000000-2222-0000-0000-0000000011b3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015b8'::uuid, $$JAE-246$$, '00000000-2222-0000-0000-000000000e6e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015b9'::uuid, $$NHR-006$$, '00000000-2222-0000-0000-0000000011b5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015ba'::uuid, $$ASP-001$$, '00000000-2222-0000-0000-0000000011b7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015bb'::uuid, $$BMI-003$$, '00000000-2222-0000-0000-0000000011b8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015be'::uuid, $$JAE-355-R1$$, '00000000-2222-0000-0000-00000000005d'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015c1'::uuid, $$JAE-356$$, '00000000-2222-0000-0000-00000000005e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015c5'::uuid, $$KDS-142-R3$$, '00000000-2222-0000-0000-00000000005f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015ca'::uuid, $$KDS-032$$, '00000000-2222-0000-0000-000000000060'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015cc'::uuid, $$KDS-058$$, '00000000-2222-0000-0000-000000000061'::uuid, 1, 1, NULL, $$0.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015cd'::uuid, $$KDS-022$$, '00000000-2222-0000-0000-000000000062'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015ce'::uuid, $$KDS-066-TN1$$, '00000000-2222-0000-0000-000000000063'::uuid, 1, 1, $$T$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015cf'::uuid, $$KDS-066-BN1$$, '00000000-2222-0000-0000-000000000064'::uuid, 1, 1, $$B$$, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015d0'::uuid, $$KDS-046$$, '00000000-2222-0000-0000-000000000065'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015d1'::uuid, $$KDS-059$$, '00000000-2222-0000-0000-000000000066'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015d2'::uuid, $$KDS-019$$, '00000000-2222-0000-0000-000000000066'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015d3'::uuid, $$KDS-031$$, '00000000-2222-0000-0000-000000000066'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015d4'::uuid, $$KDS-050$$, '00000000-2222-0000-0000-0000000010cf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015d5'::uuid, $$KDS-033$$, '00000000-2222-0000-0000-000000000066'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015d6'::uuid, $$KDS-016$$, '00000000-2222-0000-0000-000000000066'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015d7'::uuid, $$KDS-044$$, '00000000-2222-0000-0000-0000000003c5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015d8'::uuid, $$KDS-056$$, '00000000-2222-0000-0000-000000000e91'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015d9'::uuid, $$KDS-036$$, '00000000-2222-0000-0000-000000000066'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015da'::uuid, $$KDS-042$$, '00000000-2222-0000-0000-000000000fd9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015db'::uuid, $$KDS-034$$, '00000000-2222-0000-0000-000000000066'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015dc'::uuid, $$KDS-020$$, '00000000-2222-0000-0000-000000000066'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015dd'::uuid, $$KDS-025$$, '00000000-2222-0000-0000-000000000066'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015de'::uuid, $$KDS-040$$, '00000000-2222-0000-0000-000000000066'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015df'::uuid, $$KDS-035$$, '00000000-2222-0000-0000-000000000066'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015e2'::uuid, $$KDS-029$$, '00000000-2222-0000-0000-000000000066'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015e3'::uuid, $$KDS-043$$, '00000000-2222-0000-0000-000000000066'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015e4'::uuid, $$KYM-005$$, '00000000-2222-0000-0000-0000000011d0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015e5'::uuid, $$SMK-220-R1$$, '00000000-2222-0000-0000-0000000011d2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015e6'::uuid, $$SMK-221$$, '00000000-2222-0000-0000-0000000011d3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015e7'::uuid, $$SHT-021$$, '00000000-2222-0000-0000-000000000052'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015e8'::uuid, $$ASH-013xx$$, '00000000-2222-0000-0000-000000000053'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015e9'::uuid, $$TE-9-127-7-R1$$, '00000000-2222-0000-0000-000000000054'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015ea'::uuid, $$SIT-025$$, '00000000-2222-0000-0000-000000000055'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015eb'::uuid, $$SIT-026-R1$$, '00000000-2222-0000-0000-000000000056'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015ec'::uuid, $$KDS-144$$, '00000000-2222-0000-0000-000000000057'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015ed'::uuid, $$ENT-004$$, '00000000-2222-0000-0000-000000000058'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015ee'::uuid, $$SIT-027$$, '00000000-2222-0000-0000-000000000017'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015f8'::uuid, $$RPD-004-R2$$, '00000000-2222-0000-0000-000000000018'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-0000000015f9'::uuid, $$SIT-028-R1$$, '00000000-2222-0000-0000-000000000019'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001600'::uuid, $$RPD-005-R1$$, '00000000-2222-0000-0000-00000000001a'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001601'::uuid, $$RPD-006-R1$$, '00000000-2222-0000-0000-00000000001b'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001602'::uuid, $$JAE-359$$, '00000000-2222-0000-0000-00000000001c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001603'::uuid, $$ASH-015D-R1$$, '00000000-2222-0000-0000-00000000001d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001604'::uuid, $$JAE-357-R4$$, '00000000-2222-0000-0000-000000000020'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001605'::uuid, $$SCW-004$$, '00000000-2222-0000-0000-00000000001f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001606'::uuid, $$ASH-016D-R1$$, '00000000-2222-0000-0000-000000000058'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001607'::uuid, $$JAE-358-R2$$, '00000000-2222-0000-0000-000000000021'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001608'::uuid, $$TE-2493307-2$$, '00000000-2222-0000-0000-00000000005b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001609'::uuid, $$JAE-361$$, '00000000-2222-0000-0000-00000000005c'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000160b'::uuid, $$TE-2494147-1$$, '00000000-2222-0000-0000-0000000011d5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000160c'::uuid, $$MCT-004-R1$$, '00000000-2222-0000-0000-000000000026'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000160d'::uuid, $$TE-1-163-2-R6$$, '00000000-2222-0000-0000-0000000011d7'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000160e'::uuid, $$ASH-015-R1$$, '00000000-2222-0000-0000-0000000011d8'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000160f'::uuid, $$ASH-016-R1$$, '00000000-2222-0000-0000-0000000011d9'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001610'::uuid, $$ASH-017D$$, '00000000-2222-0000-0000-0000000011da'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001611'::uuid, $$YCM-078D$$, '00000000-2222-0000-0000-0000000011db'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001612'::uuid, $$JAE-362-R1$$, '00000000-2222-0000-0000-0000000011dc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001613'::uuid, $$RPD-003-R5$$, '00000000-2222-0000-0000-0000000011dd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001614'::uuid, $$THP-008-R2$$, '00000000-2222-0000-0000-000000000025'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001616'::uuid, $$NPC-T-409-N2$$, '00000000-2222-0000-0000-00000000094e'::uuid, 1, 2, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001619'::uuid, $$JAE-036-ZF$$, '00000000-2222-0000-0000-000000000003'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000161a'::uuid, $$CHG-004D-R1$$, '00000000-2222-0000-0000-000000000004'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000161b'::uuid, $$OOT-044$$, '00000000-2222-0000-0000-000000000005'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000161c'::uuid, $$TE-6-161-1-R2$$, '00000000-2222-0000-0000-000000000006'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000161d'::uuid, $$TOK-019$$, '00000000-2222-0000-0000-000000000007'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000161e'::uuid, $$TOK-020$$, '00000000-2222-0000-0000-000000000008'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000161f'::uuid, $$ASH-017$$, '00000000-2222-0000-0000-000000000009'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001620'::uuid, $$JAE-363D$$, '00000000-2222-0000-0000-00000000000a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001621'::uuid, $$JAE-364D$$, '00000000-2222-0000-0000-00000000000b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001622'::uuid, $$MCT-004D-R1$$, '00000000-2222-0000-0000-00000000000c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001623'::uuid, $$YCM-078$$, '00000000-2222-0000-0000-00000000000d'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001626'::uuid, $$KOS-027$$, '00000000-2222-0000-0000-000000000022'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001627'::uuid, $$KOS-029$$, '00000000-2222-0000-0000-000000000023'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001628'::uuid, $$ATS-022D-R1$$, '00000000-2222-0000-0000-000000000024'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001629'::uuid, $$KOS-028$$, '00000000-2222-0000-0000-000000000027'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000162a'::uuid, $$CHG-005-R1$$, '00000000-2222-0000-0000-000000000028'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000162c'::uuid, $$ODS-056D$$, '00000000-2222-0000-0000-000000000029'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000162d'::uuid, $$JAE-364$$, '00000000-2222-0000-0000-00000000002a'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000162e'::uuid, $$YCM-002$$, '00000000-2222-0000-0000-00000000002b'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000162f'::uuid, $$YCM-003$$, '00000000-2222-0000-0000-00000000002c'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001630'::uuid, $$YCM-004$$, '00000000-2222-0000-0000-00000000002d'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001631'::uuid, $$YCM-005$$, '00000000-2222-0000-0000-00000000002e'::uuid, 1, 1, NULL, $$4.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001632'::uuid, $$JAE-363-R1$$, '00000000-2222-0000-0000-00000000002f'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001633'::uuid, $$KWE-005$$, '00000000-2222-0000-0000-000000000030'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001634'::uuid, $$CHG-006-R1$$, '00000000-2222-0000-0000-000000000031'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001635'::uuid, $$TE-4-127-5$$, '00000000-2222-0000-0000-000000000032'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001636'::uuid, $$ODS-056$$, '00000000-2222-0000-0000-000000000033'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001637'::uuid, $$MTM-185-R3CAV3-4$$, '00000000-2222-0000-0000-000000000034'::uuid, 1, 1, NULL, $$6.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001638'::uuid, $$DIC-165-R1D$$, '00000000-2222-0000-0000-000000000035'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001639'::uuid, $$MTM-186-R1CAV3-4$$, '00000000-2222-0000-0000-000000000036'::uuid, 1, 1, NULL, $$2.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000163a'::uuid, $$ELI-001-R1$$, '00000000-2222-0000-0000-0000000000ca'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000163b'::uuid, $$MTM-187-R4CAV34$$, '00000000-2222-0000-0000-000000000037'::uuid, 1, 1, NULL, $$2.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000163d'::uuid, $$MTM-188CAV3-4$$, '00000000-2222-0000-0000-000000000038'::uuid, 1, 1, NULL, $$2.0$$, $$RETURNED$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000163e'::uuid, $$MTM-189D$$, '00000000-2222-0000-0000-000000000039'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000163f'::uuid, $$ASH-018$$, '00000000-2222-0000-0000-00000000003a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001640'::uuid, $$SMK-225$$, '00000000-2222-0000-0000-00000000003b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001641'::uuid, $$ASH-019-R1D$$, '00000000-2222-0000-0000-00000000003c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001642'::uuid, $$KSP-219$$, '00000000-2222-0000-0000-00000000000e'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001643'::uuid, $$AON-004$$, '00000000-2222-0000-0000-00000000000f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001644'::uuid, $$KSP-220-R1$$, '00000000-2222-0000-0000-000000000010'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001646'::uuid, $$KSP-221$$, '00000000-2222-0000-0000-000000000011'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001647'::uuid, $$JAE-369-R1$$, '00000000-2222-0000-0000-000000000011'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001648'::uuid, $$APF-001$$, '00000000-2222-0000-0000-000000000013'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001649'::uuid, $$JAE-368-R1$$, '00000000-2222-0000-0000-000000000013'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000164a'::uuid, $$KSP-222$$, '00000000-2222-0000-0000-000000000015'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000164b'::uuid, $$JAE-367D-R4$$, '00000000-2222-0000-0000-000000000048'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000164d'::uuid, $$サーブ木板-ZD-N2$$, '00000000-2222-0000-0000-000000000dd8'::uuid, 1, 2, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000164e'::uuid, $$ASH-019-R1$$, '00000000-2222-0000-0000-000000000049'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000164f'::uuid, $$YCM-020$$, '00000000-2222-0000-0000-00000000004a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001650'::uuid, $$MTM-190D-R2$$, '00000000-2222-0000-0000-00000000004b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001651'::uuid, $$SMK-218D-R3$$, '00000000-2222-0000-0000-00000000004c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001652'::uuid, $$SSM-058$$, '00000000-2222-0000-0000-00000000004d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001653'::uuid, $$JAE-370-R2$$, '00000000-2222-0000-0000-00000000004e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001654'::uuid, $$JAE-365-R4$$, '00000000-2222-0000-0000-0000000011c0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001655'::uuid, $$JAE-366-R2$$, '00000000-2222-0000-0000-0000000011e7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001656'::uuid, $$SIT-029D$$, '00000000-2222-0000-0000-000000000051'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001657'::uuid, $$KSP-211D-R3$$, '00000000-2222-0000-0000-0000000011df'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001659'::uuid, $$PB470x400x35$$, '00000000-2222-0000-0000-0000000011e0'::uuid, 1, 1, NULL, $$0.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000165a'::uuid, $$JAE-371-R1$$, '00000000-2222-0000-0000-0000000011e8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000165b'::uuid, $$SIT-029$$, '00000000-2222-0000-0000-0000000011e2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000165c'::uuid, $$STT-002D-R1$$, '00000000-2222-0000-0000-0000000011e3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000165d'::uuid, $$KOS-030$$, '00000000-2222-0000-0000-0000000011e4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000165e'::uuid, $$KOS-031$$, '00000000-2222-0000-0000-0000000011e5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000165f'::uuid, $$JAE-367-R5$$, '00000000-2222-0000-0000-0000000011e6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001660'::uuid, $$OOT-045-R2$$, '00000000-2222-0000-0000-0000000011bb'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001661'::uuid, $$MTM-192D-R3$$, '00000000-2222-0000-0000-0000000011bc'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001662'::uuid, $$CHG-004-R3$$, '00000000-2222-0000-0000-0000000011bd'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001663'::uuid, $$MTM-194D-R1$$, '00000000-2222-0000-0000-0000000011be'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001664'::uuid, $$MTM-193D-R2$$, '00000000-2222-0000-0000-0000000011bf'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001665'::uuid, $$CHG-011D$$, '00000000-2222-0000-0000-0000000011c3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001666'::uuid, $$MTM-190-R2$$, '00000000-2222-0000-0000-0000000011e9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001668'::uuid, $$JAE-372-R1$$, '00000000-2222-0000-0000-0000000011eb'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001669'::uuid, $$JAE-373$$, '00000000-2222-0000-0000-00000000003e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000166a'::uuid, $$MTM-189$$, '00000000-2222-0000-0000-00000000003f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000166b'::uuid, $$JAE-374$$, '00000000-2222-0000-0000-000000000040'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000166c'::uuid, $$DIC-167$$, '00000000-2222-0000-0000-000000000041'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000166d'::uuid, $$KSP-211D-R5$$, '00000000-2222-0000-0000-000000000042'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000166e'::uuid, $$MTM-191D-R5$$, '00000000-2222-0000-0000-000000000016'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000166f'::uuid, $$PB-355X240$$, '00000000-2222-0000-0000-000000000042'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001670'::uuid, $$AON-005$$, '00000000-2222-0000-0000-000000000042'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001671'::uuid, $$WB-470X347$$, '00000000-2222-0000-0000-000000000045'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001672'::uuid, $$MTM-193D-R3$$, '00000000-2222-0000-0000-000000000046'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001673'::uuid, $$KOS-032$$, '00000000-2222-0000-0000-000000000047'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001674'::uuid, $$SMK-227D$$, '00000000-2222-0000-0000-000000000001'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001675'::uuid, $$CHG-008D$$, '00000000-2222-0000-0000-000000000002'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001676'::uuid, $$CHG-009D$$, '00000000-2222-0000-0000-00000000128b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001677'::uuid, $$SMK-226D$$, '00000000-2222-0000-0000-00000000128c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001678'::uuid, $$SMK-228D$$, '00000000-2222-0000-0000-00000000128d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001679'::uuid, $$CHG-010D$$, '00000000-2222-0000-0000-00000000128e'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000167a'::uuid, $$MTM-194-R1$$, '00000000-2222-0000-0000-00000000128f'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000167b'::uuid, $$ASH-020D$$, '00000000-2222-0000-0000-000000001290'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000167c'::uuid, $$CHG-007D$$, '00000000-2222-0000-0000-000000001291'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000167e'::uuid, $$MTM-192-R3$$, '00000000-2222-0000-0000-000000001293'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000167f'::uuid, $$CHG-012D$$, '00000000-2222-0000-0000-000000001294'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001680'::uuid, $$CHG-013D$$, '00000000-2222-0000-0000-000000001295'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001681'::uuid, $$DIC-166$$, '00000000-2222-0000-0000-000000001296'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001682'::uuid, $$DIC-168-R1$$, '00000000-2222-0000-0000-000000001297'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001683'::uuid, $$DIC-169-R1$$, '00000000-2222-0000-0000-000000001298'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001684'::uuid, $$DIC-170-R1$$, '00000000-2222-0000-0000-000000001299'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001685'::uuid, $$NHC-009-R1$$, '00000000-2222-0000-0000-00000000129a'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001686'::uuid, $$PB-470X300ND$$, '00000000-2222-0000-0000-00000000129b'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001688'::uuid, $$MTM-195D-R1$$, '00000000-2222-0000-0000-00000000129c'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001689'::uuid, $$MTM-193-R3$$, '00000000-2222-0000-0000-00000000129d'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000168a'::uuid, $$JAE-376-R2$$, '00000000-2222-0000-0000-00000000129e'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000168b'::uuid, $$SMK-229$$, '00000000-2222-0000-0000-00000000129f'::uuid, 1, 1, NULL, $$3.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000168d'::uuid, $$TE-7-129-3$$, '00000000-2222-0000-0000-0000000012a0'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000168e'::uuid, $$JAE-375-R1$$, '00000000-2222-0000-0000-0000000012a1'::uuid, 1, 1, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000168f'::uuid, $$MDS-008D$$, '00000000-2222-0000-0000-0000000012a2'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001690'::uuid, $$ASH-020-R1$$, '00000000-2222-0000-0000-0000000012a3'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001691'::uuid, $$WB-355X240UPPE-R1$$, '00000000-2222-0000-0000-0000000012a4'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001692'::uuid, $$WB-355X240UNDE-R1$$, '00000000-2222-0000-0000-0000000012a5'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001693'::uuid, $$ATS-026-N2$$, '00000000-2222-0000-0000-000000000182'::uuid, 1, 2, NULL, $$1.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001694'::uuid, $$PB-460X330ZA$$, '00000000-2222-0000-0000-0000000012a6'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001695'::uuid, $$MTM-191-R5$$, '00000000-2222-0000-0000-0000000012a7'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001696'::uuid, $$MTM-197D-R1$$, '00000000-2222-0000-0000-0000000012a8'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001697'::uuid, $$MDS-009D$$, '00000000-2222-0000-0000-0000000012a9'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001698'::uuid, $$MTM-196D-R2$$, '00000000-2222-0000-0000-0000000012aa'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-000000001699'::uuid, $$SIT-030D-R1$$, '00000000-2222-0000-0000-0000000012ab'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000169a'::uuid, $$SRI-008D$$, '00000000-2222-0000-0000-0000000012ac'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000169b'::uuid, $$SMK-227-R1$$, '00000000-2222-0000-0000-0000000012ad'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000169c'::uuid, $$SMK-228-R1$$, '00000000-2222-0000-0000-0000000012ae'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000169d'::uuid, $$MTM-195-R1$$, '00000000-2222-0000-0000-0000000012af'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;
INSERT INTO mold_physical (id, physical_code, revision_id, cavity, unit_index, part_role, storage_location, status)
VALUES ('00000000-3333-0000-0000-00000000169e'::uuid, $$YCM-079D$$, '00000000-2222-0000-0000-0000000012b0'::uuid, 1, 1, NULL, $$2.0$$, $$ACTIVE$$)
ON CONFLICT (physical_code) DO UPDATE SET revision_id = EXCLUDED.revision_id, cavity = EXCLUDED.cavity, unit_index = EXCLUDED.unit_index, part_role = EXCLUDED.part_role, storage_location = EXCLUDED.storage_location, status = EXCLUDED.status;

COMMIT;
