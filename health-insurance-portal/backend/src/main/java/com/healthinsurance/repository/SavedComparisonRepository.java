package com.healthinsurance.repository;

import com.healthinsurance.entity.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.domain.*;
import org.springframework.data.repository.query.Param;
import java.util.*;
import org.springframework.transaction.annotation.Transactional;

public interface SavedComparisonRepository extends JpaRepository<SavedComparison, Long> {
    List<SavedComparison> findByUserIdOrderByCreatedAtDesc(Long userId);

    boolean existsByUserIdAndPlanId(Long userId, Long planId);

    long countByUserId(Long userId);

    @Transactional
    void deleteByUserIdAndPlanId(Long userId, Long planId);
}
