-- =====================================================================
-- HealthCare Insurance Portal - SAMPLE DATA
-- ALL COMPANIES, PLANS AND FIGURES BELOW ARE FICTIONAL, FOR EDUCATION ONLY.
-- Run AFTER schema.sql:   mysql -u root -p health_insurance_portal < sample_data.sql
-- Sample users and applications are created by the Java class
-- SampleDataSeeder (Phase 3) so their passwords are hashed with BCrypt.
-- =====================================================================
USE health_insurance_portal;

-- 5 fictional insurance companies (ids 1-5) ----------------------------
INSERT INTO insurance_companies (name, description, website, claim_settlement_ratio, network_hospitals) VALUES
('Arogya Shield Insurance',  '[SAMPLE] Fictional insurer created for a college project. Not a real company.', 'https://example.com/arogya-shield', 96.40, 7200),
('LifeBridge Health Cover',  '[SAMPLE] Fictional insurer created for a college project. Not a real company.', 'https://example.com/lifebridge',    94.80, 5400),
('Nirvana Care Assurance',   '[SAMPLE] Fictional insurer created for a college project. Not a real company.', 'https://example.com/nirvana-care',  97.10, 8600),
('BluePeak Health Insurance','[SAMPLE] Fictional insurer created for a college project. Not a real company.', 'https://example.com/bluepeak',      93.50, 4300),
('Jeevan Setu Assurance',    '[SAMPLE] Fictional insurer created for a college project. Not a real company.', 'https://example.com/jeevan-setu',   95.60, 6100);

-- 15 fictional plans (3 per company) -----------------------------------
-- columns: company_id, plan_name, category, base_premium, coverage_amount, min_age, max_age,
--          max_members, waiting_period_months, pre_existing_covered, pre_existing_wait_months,
--          room_rent_limit, hospitalization_benefits, network_hospital_info,
--          description, eligibility_criteria, required_documents
INSERT INTO insurance_plans
(company_id, plan_name, category, base_premium, coverage_amount, min_age, max_age, max_members,
 waiting_period_months, pre_existing_covered, pre_existing_wait_months, room_rent_limit,
 hospitalization_benefits, network_hospital_info, description, eligibility_criteria, required_documents) VALUES
(1,'Shield Basic Individual','INDIVIDUAL',6500,500000,18,65,1,1,TRUE,36,'1% of sum insured per day',
 'In-patient hospitalisation, day-care procedures, 30 days pre and 60 days post hospitalisation.','7,200 sample network hospitals across India.',
 'A simple individual plan covering everyday hospital stays. [SAMPLE DATA]','Age 18-65. One adult.','Identity proof, address proof, age proof, passport photo'),
(1,'Shield Family Floater','FAMILY_FLOATER',14500,1000000,18,65,4,1,TRUE,36,'2% of sum insured per day',
 'In-patient care, day-care, maternity after waiting period, ambulance cover.','7,200 sample network hospitals across India.',
 'One shared sum insured for the whole family. [SAMPLE DATA]','Self, spouse and up to 2 children.','Identity proof, address proof, age proof for all members'),
(1,'Shield Senior Care','SENIOR_CITIZEN',21000,500000,60,80,2,2,TRUE,24,'Single private room',
 'Hospitalisation, domiciliary treatment, annual health check-up.','7,200 sample network hospitals across India.',
 'Designed for senior citizens with a shorter waiting period for existing conditions. [SAMPLE DATA]','Age 60-80.','Identity proof, age proof, previous medical summary (sample)'),

(2,'LifeBridge Essential','INDIVIDUAL',5800,300000,18,60,1,1,FALSE,48,'1% of sum insured per day',
 'In-patient hospitalisation and day-care procedures.','5,400 sample network hospitals.',
 'Budget-friendly cover for young adults. [SAMPLE DATA]','Age 18-60.','Identity proof, address proof, age proof'),
(2,'LifeBridge Family Plus','FAMILY_FLOATER',13200,1000000,18,65,5,1,TRUE,36,'No room rent limit',
 'Hospitalisation, maternity, newborn cover, ambulance, annual check-up.','5,400 sample network hospitals.',
 'Family floater with no room rent cap. [SAMPLE DATA]','Self, spouse, up to 3 children.','Identity proof, address proof, age proof for all members'),
(2,'LifeBridge Critical Guard','CRITICAL_ILLNESS',4200,1500000,21,65,1,3,FALSE,48,'Not applicable (lump sum)',
 'Lump-sum payout on diagnosis of listed critical illnesses.','5,400 sample network hospitals.',
 'Fixed lump-sum benefit for listed critical illnesses. [SAMPLE DATA]','Age 21-65.','Identity proof, age proof, medical questionnaire'),

(3,'Nirvana Care Classic','INDIVIDUAL',7200,700000,18,65,1,1,TRUE,24,'2% of sum insured per day',
 'Hospitalisation, day-care, AYUSH treatment, organ donor expenses.','8,600 sample network hospitals.',
 'Balanced individual plan with AYUSH cover. [SAMPLE DATA]','Age 18-65.','Identity proof, address proof, age proof'),
(3,'Nirvana Family Secure','FAMILY_FLOATER',16800,1500000,18,65,6,1,TRUE,24,'Single private room',
 'Hospitalisation, maternity, vaccination cover, restore benefit.','8,600 sample network hospitals.',
 'Comprehensive family cover with sum-insured restore. [SAMPLE DATA]','Self, spouse, children and parents.','Identity proof, address proof, age proof for all members'),
(3,'Nirvana Top-Up Saver','TOP_UP',2800,2000000,18,70,4,1,FALSE,36,'As per base policy',
 'Pays after a deductible of Rs 3,00,000 is crossed in a policy year.','8,600 sample network hospitals.',
 'Low-cost top-up for high medical bills. [SAMPLE DATA]','Age 18-70.','Identity proof, existing policy copy (sample)'),

(4,'BluePeak Young Starter','INDIVIDUAL',4900,300000,18,45,1,2,FALSE,48,'1% of sum insured per day',
 'Hospitalisation and day-care procedures, online consultation.','4,300 sample network hospitals.',
 'Entry-level plan for students and young professionals. [SAMPLE DATA]','Age 18-45.','Identity proof, age proof'),
(4,'BluePeak Family Care','FAMILY_FLOATER',12100,800000,18,60,4,1,TRUE,36,'1.5% of sum insured per day',
 'Hospitalisation, maternity, newborn, ambulance.','4,300 sample network hospitals.',
 'Affordable family floater. [SAMPLE DATA]','Self, spouse, up to 2 children.','Identity proof, address proof, age proof'),
(4,'BluePeak Senior Plus','SENIOR_CITIZEN',23500,1000000,60,85,2,2,TRUE,24,'No room rent limit',
 'Hospitalisation, domiciliary care, annual check-up, co-pay 10%.','4,300 sample network hospitals.',
 'Senior plan with higher coverage and 10% co-payment. [SAMPLE DATA]','Age 60-85.','Identity proof, age proof, medical summary (sample)'),

(5,'Jeevan Setu Prime','INDIVIDUAL',8100,1000000,18,65,1,1,TRUE,24,'No room rent limit',
 'Hospitalisation, day-care, robotic surgery, restore benefit.','6,100 sample network hospitals.',
 'Premium individual plan with high sum insured. [SAMPLE DATA]','Age 18-65.','Identity proof, address proof, age proof'),
(5,'Jeevan Setu Family Shield','FAMILY_FLOATER',17900,2000000,18,65,6,1,TRUE,24,'No room rent limit',
 'Hospitalisation, maternity, newborn, mental health cover, restore benefit.','6,100 sample network hospitals.',
 'High-cover family plan with mental health benefit. [SAMPLE DATA]','Self, spouse, children, parents.','Identity proof, address proof, age proof for all members'),
(5,'Jeevan Setu Critical Plus','CRITICAL_ILLNESS',5200,2500000,21,65,1,3,FALSE,48,'Not applicable (lump sum)',
 'Lump-sum payout on diagnosis of listed critical illnesses, plus second-opinion service.','6,100 sample network hospitals.',
 'Higher-value critical illness cover. [SAMPLE DATA]','Age 21-65.','Identity proof, age proof, medical questionnaire');

-- Benefits: every plan gets 3 standard benefits (45 rows) -------------
INSERT INTO plan_benefits (plan_id, title, description)
SELECT id, 'Cashless hospitalisation', 'Cashless treatment at sample network hospitals (illustrative).' FROM insurance_plans;
INSERT INTO plan_benefits (plan_id, title, description)
SELECT id, 'Pre and post hospitalisation', 'Medical expenses before and after admission are covered for a fixed number of days.' FROM insurance_plans
WHERE category <> 'CRITICAL_ILLNESS';
INSERT INTO plan_benefits (plan_id, title, description)
SELECT id, 'Annual health check-up', 'One free preventive health check-up per policy year (illustrative).' FROM insurance_plans;
-- Extra benefits for specific categories
INSERT INTO plan_benefits (plan_id, title, description)
SELECT id, 'Maternity cover', 'Delivery and newborn expenses after the maternity waiting period.' FROM insurance_plans
WHERE category = 'FAMILY_FLOATER';
INSERT INTO plan_benefits (plan_id, title, description)
SELECT id, 'Lump-sum payout', 'Fixed amount paid on diagnosis of a listed critical illness.' FROM insurance_plans
WHERE category = 'CRITICAL_ILLNESS';

-- Exclusions: every plan gets 3 standard exclusions --------------------
INSERT INTO plan_exclusions (plan_id, title, description)
SELECT id, 'Cosmetic treatment', 'Cosmetic or aesthetic procedures are not covered unless needed after an accident.' FROM insurance_plans;
INSERT INTO plan_exclusions (plan_id, title, description)
SELECT id, 'Self-inflicted injury', 'Injuries caused intentionally by the insured person are not covered.' FROM insurance_plans;
INSERT INTO plan_exclusions (plan_id, title, description)
SELECT id, 'War and nuclear risks', 'Hospitalisation due to war, invasion or nuclear events is excluded.' FROM insurance_plans;
INSERT INTO plan_exclusions (plan_id, title, description)
SELECT id, 'Dental and vision (routine)', 'Routine dental treatment, spectacles and contact lenses are not covered.' FROM insurance_plans
WHERE category IN ('INDIVIDUAL','FAMILY_FLOATER','SENIOR_CITIZEN');
