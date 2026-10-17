import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) env[parts[0]] = parts.slice(1).join('=');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL.trim(), env.SUPABASE_SERVICE_ROLE_KEY.trim());

async function check() {
    const fromDate = '2026-08-25';
    const toDate = '2026-09-07';
    const toDateEnd = toDate + ' 23:59:59';

    // 1. Check job_steps.deadline in range
    const { data: stepHits, count: stepCount } = await supabase
        .from('job_steps')
        .select('job_id, step_name, deadline, planned_start, planned_end, planned_hours, estimated_hours, step_status, track', { count: 'exact' })
        .or(`and(deadline.gte.${fromDate},deadline.lte.${toDateEnd}),and(planned_start.gte.${fromDate},planned_start.lte.${toDateEnd}),and(planned_end.gte.${fromDate},planned_end.lte.${toDateEnd})`)
        .limit(50);
    
    console.log(`\n=== JOB_STEPS with deadline/planned dates in ${fromDate}..${toDate} ===`);
    console.log(`Total matching steps: ${stepCount}`);
    
    if (stepHits && stepHits.length > 0) {
        // Get unique job_ids
        const jobIds = [...new Set(stepHits.map(s => s.job_id))];
        console.log(`Unique job_ids: ${jobIds.length}`);
        
        // Fetch the jobs
        const { data: jobs } = await supabase
            .from('jobs')
            .select('job_id, job_code, mold_deadline, target_completion_date, deadline, ship_date, job_status')
            .in('job_id', jobIds);
        
        const jobMap = new Map();
        jobs?.forEach(j => jobMap.set(j.job_id, j));

        stepHits.forEach(s => {
            const j = jobMap.get(s.job_id);
            const jobCode = j?.job_code || 'UNKNOWN';
            const jobMoldDl = j?.mold_deadline ? j.mold_deadline.split('T')[0] : null;
            const jobTargetDl = j?.target_completion_date ? j.target_completion_date.split('T')[0] : (jobMoldDl || null);
            
            // Simulate isStepOnDate logic
            const stepDl = s.deadline ? s.deadline.split('T')[0] : null;
            const hasHours = Number(s.planned_hours) > 0 || Number(s.estimated_hours) > 0;
            const isActive = s.step_status === 'COMPLETED' || s.step_status === 'IN_PROGRESS';
            
            // Note: Since this is a check script, we don't fetch actual work_logs for each step here.
            // But we know isActive = true for these 13 steps, which bypasses the hasLogs check anyway.
            const hasLogs = false; // dummy

            const effectiveTargetDl = jobTargetDl || stepDl;

            let matchResult = 'NO_MATCH';
            // Case 1: Custom deadline
            if (stepDl && effectiveTargetDl && stepDl !== effectiveTargetDl) {
                matchResult = `CUSTOM_DL → matches on ${stepDl}`;
            }
            // Case 2: Main step
            else if (!stepDl || stepDl === effectiveTargetDl) {
                if (effectiveTargetDl) {
                    if (hasLogs || hasHours || isActive) {
                        matchResult = `MAIN_STEP → MATCHES on ${effectiveTargetDl} (hasHours=${hasHours}, isActive=${isActive})`;
                    } else {
                        matchResult = `BLOCKED! (no hours, not active, no logs)`;
                    }
                } else {
                    matchResult = `⚠️ BLOCKED: effectiveTargetDl=null`;
                }
            }
            
            console.log(`  Job ${jobCode} | Step "${s.step_name}" (${s.track || 'MOLD'}): stepDl=${stepDl}, status=${s.step_status}, planned_hours=${s.planned_hours}, est_hours=${s.estimated_hours} → ${matchResult}`);
        });
    } else {
        console.log('\nNo steps found in date range either.');
        
        // Check what the latest step deadlines are
        const { data: latestSteps } = await supabase
            .from('job_steps')
            .select('deadline, step_name, planned_start, planned_end')
            .not('deadline', 'is', null)
            .order('deadline', { ascending: false })
            .limit(10);
        console.log('\nLatest 10 job_steps by deadline:');
        latestSteps?.forEach(s => console.log(`  deadline=${s.deadline}, planned_start=${s.planned_start}, planned_end=${s.planned_end}, name="${s.step_name}"`));
    }
    
    // 2. Also check: what does the Gantt page URL actually send?
    // The schedule page uses: jobs with mold_deadline OR job_steps.deadline in range
    const { data: jobsViaOr } = await supabase
        .from('jobs')
        .select('job_id, job_code, mold_deadline, target_completion_date, deadline, ship_date')
        .or(`and(mold_deadline.gte.${fromDate},mold_deadline.lte.${toDateEnd}),and(deadline.gte.${fromDate},deadline.lte.${toDateEnd}),and(ship_date.gte.${fromDate},ship_date.lte.${toDateEnd}),and(target_completion_date.gte.${fromDate},target_completion_date.lte.${toDateEnd})`)
        .limit(50);
    
    console.log(`\n=== JOBS directly matching date range via jobs table columns ===`);
    console.log(`Count: ${jobsViaOr?.length || 0}`);
    jobsViaOr?.forEach(j => console.log(`  ${j.job_code}: mold_dl=${j.mold_deadline}, target=${j.target_completion_date}, deadline=${j.deadline}, ship=${j.ship_date}`));
    
    // 3. Check: jobs.deadline column (different from mold_deadline!)
    const { data: latestJobDl } = await supabase
        .from('jobs')
        .select('job_code, deadline, mold_deadline, ship_date')
        .not('deadline', 'is', null)
        .order('deadline', { ascending: false })
        .limit(10);
    console.log(`\n=== Latest 10 jobs by jobs.deadline column ===`);
    latestJobDl?.forEach(j => console.log(`  ${j.job_code}: deadline=${j.deadline}, mold_deadline=${j.mold_deadline}, ship_date=${j.ship_date}`));
}

check().catch(console.error);
