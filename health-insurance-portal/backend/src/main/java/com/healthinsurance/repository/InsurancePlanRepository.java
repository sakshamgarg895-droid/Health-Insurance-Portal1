package com.healthinsurance.repository;

import com.healthinsurance.entity.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.domain.*;
import org.springframework.data.repository.query.Param;
import java.util.*;

public interface InsurancePlanRepository extends JpaRepository<InsurancePlan, Long>, org.springframework.data.jpa.repository.JpaSpecificationExecutor<InsurancePlan> {
    List<InsurancePlan> findByCompanyId(Long companyId);

    List<InsurancePlan> findByActiveTrueAndCompanyActiveTrueOrderByPlanNameAsc();

    Optional<InsurancePlan> findByIdAndActiveTrueAndCompanyActiveTrue(Long id);

    List<InsurancePlan> findByActiveTrueAndCompanyActiveTrueAndCategoryOrderByPlanNameAsc(PlanCategory category);

    long countByActiveTrue();
}
