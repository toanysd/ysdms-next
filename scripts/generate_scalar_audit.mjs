/**
 * Helper to generate syntactically safe PostgreSQL json_build_object scalar queries
 * Prevents syntax issues like missing commas or unmatched parenthesis (L001, L002)
 */

export function buildScalarAuditQuery(fields) {
  const parts = fields.map(([key, expr]) => {
    return `'${key}', (${expr.trim()})`;
  });

  return `SELECT json_build_object(\n  ${parts.join(',\n  ')}\n) AS audit_result;`;
}

// Example usage / self-test when run directly:
if (process.argv[1]?.endsWith('generate_scalar_audit.mjs')) {
  const sampleFields = [
    ['pilot_log_count', 'SELECT COUNT(*) FROM work_logs WHERE job_id = \'380d3e19-6074-4701-a0bd-d0e8a2892202\''],
    ['work_logs_total_after', 'SELECT COUNT(*) FROM work_logs'],
    ['step_processing_status_id', 'SELECT processing_status_id FROM job_steps WHERE step_id = \'6ba5c7b9-4ec3-4d41-bbd2-057613287bff\''],
    ['step_status_after', 'SELECT step_status FROM job_steps WHERE step_id = \'6ba5c7b9-4ec3-4d41-bbd2-057613287bff\''],
    ['job_status_after', 'SELECT job_status FROM jobs WHERE job_id = \'380d3e19-6074-4701-a0bd-d0e8a2892202\''],
    ['step_actual_hours_after', 'SELECT actual_hours FROM job_steps WHERE step_id = \'6ba5c7b9-4ec3-4d41-bbd2-057613287bff\'']
  ];

  console.log('--- GENERATED SYNTAX-SAFE SQL QUERY ---');
  console.log(buildScalarAuditQuery(sampleFields));
}
