package com.healthinsurance.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;

@Entity
@Table(name = "insurance_plans")
public class InsurancePlan extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "company_id")
    private InsuranceCompany company;

    private String planName;

    @Enumerated(EnumType.STRING)
    private PlanCategory category;

    private BigDecimal basePremium;

    private BigDecimal coverageAmount;

    private int minAge;

    private int maxAge;

    private int maxMembers = 1;

    private int waitingPeriodMonths;

    private boolean preExistingCovered;

    private int preExistingWaitMonths;

    private String roomRentLimit;

    private String hospitalizationBenefits;

    private String networkHospitalInfo;

    private String description;

    private String eligibilityCriteria;

    private String requiredDocuments;

    @Column(name = "is_sample_data")
    private boolean sampleData = true;

    private boolean active = true;

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlanBenefit> benefits = new ArrayList<>();

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlanExclusion> exclusions = new ArrayList<>();

    public InsurancePlan() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public InsuranceCompany getCompany() { return company; }
    public void setCompany(InsuranceCompany company) { this.company = company; }
    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }
    public PlanCategory getCategory() { return category; }
    public void setCategory(PlanCategory category) { this.category = category; }
    public BigDecimal getBasePremium() { return basePremium; }
    public void setBasePremium(BigDecimal basePremium) { this.basePremium = basePremium; }
    public BigDecimal getCoverageAmount() { return coverageAmount; }
    public void setCoverageAmount(BigDecimal coverageAmount) { this.coverageAmount = coverageAmount; }
    public int getMinAge() { return minAge; }
    public void setMinAge(int minAge) { this.minAge = minAge; }
    public int getMaxAge() { return maxAge; }
    public void setMaxAge(int maxAge) { this.maxAge = maxAge; }
    public int getMaxMembers() { return maxMembers; }
    public void setMaxMembers(int maxMembers) { this.maxMembers = maxMembers; }
    public int getWaitingPeriodMonths() { return waitingPeriodMonths; }
    public void setWaitingPeriodMonths(int waitingPeriodMonths) { this.waitingPeriodMonths = waitingPeriodMonths; }
    public boolean isPreExistingCovered() { return preExistingCovered; }
    public void setPreExistingCovered(boolean preExistingCovered) { this.preExistingCovered = preExistingCovered; }
    public int getPreExistingWaitMonths() { return preExistingWaitMonths; }
    public void setPreExistingWaitMonths(int preExistingWaitMonths) { this.preExistingWaitMonths = preExistingWaitMonths; }
    public String getRoomRentLimit() { return roomRentLimit; }
    public void setRoomRentLimit(String roomRentLimit) { this.roomRentLimit = roomRentLimit; }
    public String getHospitalizationBenefits() { return hospitalizationBenefits; }
    public void setHospitalizationBenefits(String hospitalizationBenefits) { this.hospitalizationBenefits = hospitalizationBenefits; }
    public String getNetworkHospitalInfo() { return networkHospitalInfo; }
    public void setNetworkHospitalInfo(String networkHospitalInfo) { this.networkHospitalInfo = networkHospitalInfo; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getEligibilityCriteria() { return eligibilityCriteria; }
    public void setEligibilityCriteria(String eligibilityCriteria) { this.eligibilityCriteria = eligibilityCriteria; }
    public String getRequiredDocuments() { return requiredDocuments; }
    public void setRequiredDocuments(String requiredDocuments) { this.requiredDocuments = requiredDocuments; }
    public boolean isSampleData() { return sampleData; }
    public void setSampleData(boolean sampleData) { this.sampleData = sampleData; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public List<PlanBenefit> getBenefits() { return benefits; }
    public void setBenefits(List<PlanBenefit> benefits) { this.benefits = benefits; }
    public List<PlanExclusion> getExclusions() { return exclusions; }
    public void setExclusions(List<PlanExclusion> exclusions) { this.exclusions = exclusions; }
}
