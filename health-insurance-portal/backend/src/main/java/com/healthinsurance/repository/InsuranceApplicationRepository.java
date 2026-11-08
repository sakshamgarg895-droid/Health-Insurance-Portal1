package com.healthinsurance.repository;

import com.healthinsurance.entity.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.domain.*;
import org.springframework.data.repository.query.Param;
import java.util.*;

public interface InsuranceApplicationRepository extends JpaRepository<InsuranceApplication, Long> {
    List<InsuranceApplication> findByUserIdOrderByCreatedAtDesc(Long userId);

    /** Used so a user can only ever load THEIR OWN application. */
    Optional<InsuranceApplication> findByIdAndUserId(Long id, Long userId);

    Optional<InsuranceApplication> findByApplicationNumber(String applicationNumber);

    long countByStatus(ApplicationStatus status);

    long countByUserId(Long userId);
}
