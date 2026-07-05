import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) acc[m[1]] = m[2].trim().replace(/^"|"$/g, '');
    return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function seedBom() {
    console.log('--- SEEDING BOM (Phase 6 MRP Mock) ---');

    // 1. Ensure Plastics Exist
    const plastics = [
        { code: 'PS-100', family: 'PS', thickness_mm: 1.0, color: 'Trắng', width_mm: 600, is_active: true },
        { code: 'PP-080', family: 'PP', thickness_mm: 0.8, color: 'Trong', width_mm: 650, is_active: true },
        { code: 'PET-050', family: 'PET', thickness_mm: 0.5, color: 'Đen', width_mm: 550, is_active: true },
    ];

    const insertedPlastics = [];
    for (const p of plastics) {
        let { data, error } = await supabase.from('plastic_master').select('id').eq('code', p.code).single();
        if (!data) {
            const res = await supabase.from('plastic_master').insert(p).select('id').single();
            if (res.error) console.error('Plastic insert error:', res.error);
            data = res.data;
        }
        if (data) insertedPlastics.push(data.id);
    }
    console.log(`Ensured ${insertedPlastics.length} plastics exist.`);

    // 2. Fetch Revisions
    const { data: revisions, error: revErr } = await supabase.from('mold_design_revision').select('id');
    if (revErr || !revisions) {
        console.error('Error fetching revisions:', revErr);
        return;
    }

    console.log(`Found ${revisions.length} Mold Design Revisions. Seeding BOM...`);

    // 3. Upsert BOM Data
    let successCount = 0;
    const batchSize = 100;
    for (let i = 0; i < revisions.length; i += batchSize) {
        const batch = revisions.slice(i, i + batchSize);
        const bomInserts = batch.map((r, idx) => ({
            revision_id: r.id,
            plastic_id: insertedPlastics[(i + idx) % insertedPlastics.length],
            actual_weight_grams: Math.floor(Math.random() * (150 - 20 + 1) + 20), // 20g - 150g
            scrap_ratio: 0.05 // 5%
        }));

        const { error: insErr } = await supabase.from('mold_plastic_bom').insert(bomInserts);
        if (insErr) {
            console.error('Error inserting BOM:', insErr);
        } else {
            successCount += batch.length;
        }
    }

    console.log(`Successfully seeded ${successCount} BOM records.`);
}

seedBom();
