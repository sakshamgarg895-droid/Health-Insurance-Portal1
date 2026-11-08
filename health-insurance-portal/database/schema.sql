-- =====================================================================
-- HealthCare Insurance Portal - Database Schema (MySQL 8)
-- EDUCATIONAL PROJECT: all companies/plans loaded later are FICTIONAL.
-- Run:  mysql -u root -p < schema.sql
-- =====================================================================

CREATE DATABASE IF NOT EXISTS health_insurance_portal
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE health_insurance_portal;

-- Drop in reverse dependency order (safe re-runs during development)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS notifications, contact_messages, saved_comparisons, nominees,
  application_status_history, application_documents, insurance_applications,
  family_members, plan_exclusions, plan_benefits, insurance_plans,
  insurance_companies, user_roles, roles, users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. users ------------------------------------------------------------
CREATE TABLE users (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL,
  phone         VARCHAR(15)  NOT NULL,
  date_of_birth DATE         NOT NULL,
  password_hash VARCHAR(100) NOT NULL,          -- BCrypt hash only, never plain text
  address       VARCHAR(255),
  city          VARCHAR(80),
  state         VARCHAR(80),
  pin_code      VARCHAR(6),
  enabled       BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_users_email UNIQUE (email),
  INDEX idx_users_name (full_name)
) ENGINE=InnoDB;

-- 2. roles ------------------------------------------------------------
CREATE TABLE roles (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL UNIQUE               -- ROLE_USER, ROLE_ADMIN
) ENGINE=InnoDB;

-- 3. user_roles -------------------------------------------------------
CREATE TABLE user_roles (
  user_id BIGINT NOT NULL,
  role_id INT    NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. insurance_companies ----------------------------------------------
CREATE TABLE insurance_companies (
  id                     BIGINT AUTO_INCREMENT PRIMARY KEY,
  name                   VARCHAR(120) NOT NULL UNIQUE,
  description            TEXT,
  website                VARCHAR(200),
  claim_settlement_ratio DECIMAL(5,2),           -- sample value, e.g. 96.50
  network_hospitals      INT          NOT NULL DEFAULT 0,
  is_sample_data         BOOLEAN      NOT NULL DEFAULT TRUE,
  active                 BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. insurance_plans --------------------------------------------------
CREATE TABLE insurance_plans (
  id                       BIGINT AUTO_INCREMENT PRIMARY KEY,
  company_id               BIGINT       NOT NULL,
  plan_name                VARCHAR(150) NOT NULL,
  category                 VARCHAR(30)  NOT NULL, -- INDIVIDUAL, FAMILY_FLOATER, SENIOR_CITIZEN, CRITICAL_ILLNESS, TOP_UP
  base_premium             DECIMAL(10,2) NOT NULL, -- sample annual premium for base age/sum insured
  coverage_amount          DECIMAL(12,2) NOT NULL,
  min_age                  INT          NOT NULL,
  max_age                  INT          NOT NULL,
  max_members              INT          NOT NULL DEFAULT 1,
  waiting_period_months    INT          NOT NULL DEFAULT 0,
  pre_existing_covered     BOOLEAN      NOT NULL DEFAULT FALSE,
  pre_existing_wait_months INT          NOT NULL DEFAULT 0,
  room_rent_limit          VARCHAR(100),
  hospitalization_benefits TEXT,
  network_hospital_info    TEXT,
  description              TEXT,
  eligibility_criteria     TEXT,
  required_documents       TEXT,
  is_sample_data           BOOLEAN      NOT NULL DEFAULT TRUE,
  active                   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at               DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at               DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_plan_company FOREIGN KEY (company_id) REFERENCES insurance_companies(id),
  INDEX idx_plan_category (category),
  INDEX idx_plan_premium (base_premium),
  INDEX idx_plan_coverage (coverage_amount),
  INDEX idx_plan_company (company_id)
) ENGINE=InnoDB;

-- 6. plan_benefits ----------------------------------------------------
CREATE TABLE plan_benefits (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  plan_id     BIGINT       NOT NULL,
  title       VARCHAR(150) NOT NULL,
  description VARCHAR(500),
  CONSTRAINT fk_benefit_plan FOREIGN KEY (plan_id) REFERENCES insurance_plans(id) ON DELETE CASCADE,
  INDEX idx_benefit_plan (plan_id)
) ENGINE=InnoDB;

-- 7. plan_exclusions --------------------------------------------------
CREATE TABLE plan_exclusions (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  plan_id     BIGINT       NOT NULL,
  title       VARCHAR(150) NOT NULL,
  description VARCHAR(500),
  CONSTRAINT fk_exclusion_plan FOREIGN KEY (plan_id) REFERENCES insurance_plans(id) ON DELETE CASCADE,
  INDEX idx_exclusion_plan (plan_id)
) ENGINE=InnoDB;

-- 9. insurance_applications (created before family_members, which references it)
CREATE TABLE insurance_applications (
  id                BIGINT AUTO_INCREMENT PRIMARY KEY,
  application_number VARCHAR(30) NOT NULL UNIQUE,   -- e.g. HIP-2026-000001
  user_id           BIGINT       NOT NULL,
  plan_id           BIGINT       NOT NULL,
  applicant_name    VARCHAR(100) NOT NULL,
  date_of_birth     DATE         NOT NULL,
  phone             VARCHAR(15)  NOT NULL,
  email             VARCHAR(150) NOT NULL,
  address           VARCHAR(255) NOT NULL,
  city              VARCHAR(80)  NOT NULL,
  state             VARCHAR(80)  NOT NULL,
  pin_code          VARCHAR(6)   NOT NULL,
  sum_insured       DECIMAL(12,2) NOT NULL,
  estimated_premium DECIMAL(10,2) NOT NULL,         -- illustrative only
  status            VARCHAR(20)  NOT NULL DEFAULT 'DRAFT', -- DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED
  admin_remarks     VARCHAR(500),
  submitted_at      DATETIME,
  reviewed_at       DATETIME,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_app_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_app_plan FOREIGN KEY (plan_id) REFERENCES insurance_plans(id),
  INDEX idx_app_user (user_id),
  INDEX idx_app_status (status),
  INDEX idx_app_plan (plan_id)
) ENGINE=InnoDB;

-- 8. family_members ---------------------------------------------------
CREATE TABLE family_members (
  id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
  application_id     BIGINT       NOT NULL,
  full_name          VARCHAR(100) NOT NULL,
  relationship       VARCHAR(30)  NOT NULL,
  date_of_birth      DATE         NOT NULL,
  gender             VARCHAR(10)  NOT NULL,
  has_pre_existing   BOOLEAN      NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_fm_app FOREIGN KEY (application_id) REFERENCES insurance_applications(id) ON DELETE CASCADE,
  INDEX idx_fm_app (application_id)
) ENGINE=InnoDB;

-- 10. application_documents (checklist only - no real uploads) --------
CREATE TABLE application_documents (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  application_id BIGINT       NOT NULL,
  document_name  VARCHAR(100) NOT NULL,             -- e.g. "Identity proof (sample)"
  is_provided    BOOLEAN      NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_doc_app FOREIGN KEY (application_id) REFERENCES insurance_applications(id) ON DELETE CASCADE,
  INDEX idx_doc_app (application_id)
) ENGINE=InnoDB;

-- 11. application_status_history --------------------------------------
CREATE TABLE application_status_history (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  application_id BIGINT      NOT NULL,
  old_status     VARCHAR(20),
  new_status     VARCHAR(20) NOT NULL,
  remarks        VARCHAR(500),
  changed_by     BIGINT,                            -- user id of whoever changed it
  changed_at     DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_hist_app  FOREIGN KEY (application_id) REFERENCES insurance_applications(id) ON DELETE CASCADE,
  CONSTRAINT fk_hist_user FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_hist_app (application_id)
) ENGINE=InnoDB;

-- 12. nominees --------------------------------------------------------
CREATE TABLE nominees (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  application_id BIGINT       NOT NULL UNIQUE,      -- one nominee per application
  full_name      VARCHAR(100) NOT NULL,
  relationship   VARCHAR(30)  NOT NULL,
  date_of_birth  DATE         NOT NULL,
  phone          VARCHAR(15),
  CONSTRAINT fk_nominee_app FOREIGN KEY (application_id) REFERENCES insurance_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. saved_comparisons -----------------------------------------------
CREATE TABLE saved_comparisons (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT   NOT NULL,
  plan_id    BIGINT   NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_saved UNIQUE (user_id, plan_id),
  CONSTRAINT fk_sc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_sc_plan FOREIGN KEY (plan_id) REFERENCES insurance_plans(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 14. contact_messages ------------------------------------------------
CREATE TABLE contact_messages (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  phone      VARCHAR(15),
  subject    VARCHAR(150) NOT NULL,
  message    TEXT         NOT NULL,
  is_read    BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_read (is_read)
) ENGINE=InnoDB;

-- 15. notifications ---------------------------------------------------
CREATE TABLE notifications (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT       NOT NULL,
  title      VARCHAR(150) NOT NULL,
  message    VARCHAR(500) NOT NULL,
  is_read    BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notif_user (user_id, is_read)
) ENGINE=InnoDB;

-- Roles are static reference data, so they live in the schema.
-- The admin ACCOUNT is NOT created here; the Spring Boot app creates it
-- at startup from environment variables (so no password sits in SQL/GitHub).
INSERT INTO roles (name) VALUES ('ROLE_USER'), ('ROLE_ADMIN');
