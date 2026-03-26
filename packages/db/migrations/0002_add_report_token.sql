-- Add report token to job cards for shareable customer reports
ALTER TABLE job_cards ADD COLUMN report_token uuid DEFAULT gen_random_uuid();
CREATE INDEX idx_job_cards_report_token ON job_cards(report_token) WHERE report_token IS NOT NULL;
