package com.healthinsurance.repository;

import com.healthinsurance.entity.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.domain.*;
import org.springframework.data.repository.query.Param;
import java.util.*;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    long countByReadFlagFalse();
}
