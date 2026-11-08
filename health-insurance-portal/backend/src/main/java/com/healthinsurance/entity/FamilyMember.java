package com.healthinsurance.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;

@Entity
@Table(name = "family_members")
public class FamilyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "application_id")
    private InsuranceApplication application;

    private String fullName;

    private String relationship;

    private LocalDate dateOfBirth;

    private String gender;

    @Column(name = "has_pre_existing")
    private boolean hasPreExisting;

    public FamilyMember() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public InsuranceApplication getApplication() { return application; }
    public void setApplication(InsuranceApplication application) { this.application = application; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getRelationship() { return relationship; }
    public void setRelationship(String relationship) { this.relationship = relationship; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public boolean isHasPreExisting() { return hasPreExisting; }
    public void setHasPreExisting(boolean hasPreExisting) { this.hasPreExisting = hasPreExisting; }
}
