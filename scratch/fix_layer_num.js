const fs = require('fs');
let data = fs.readFileSync('supabase/migrations/20260612000002_068_seed_legacy_v4_master.sql', 'utf8');

// Replace ON CONFLICT (rack_id, layer_code) with ON CONFLICT (layer_code) just in case
data = data.replace(/ON CONFLICT \(rack_id, layer_code\)/g, 'ON CONFLICT (layer_code)');

data = data.replace(/INSERT INTO rack_layers \(id, rack_id, layer_code, legacy_id\) VALUES \('([^']+)', '([^']+)', \$\$([^$]+)\$\$, \$\$([^$]+)\$\$\)/g, (match, p1, p2, p3, p4) => {
    let num = parseInt(p3.replace(/[^0-9]/g, '')) || 0;
    return `INSERT INTO rack_layers (id, rack_id, layer_code, layer_number, legacy_id) VALUES ('${p1}', '${p2}', $$${p3}$$, ${num}, $$${p4}$$)`;
});
fs.writeFileSync('supabase/migrations/20260612000002_068_seed_legacy_v4_master.sql', data);
console.log('Fixed rack_layers');
