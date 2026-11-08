package com.healthinsurance.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;

@Entity
@Table(name = "insurance_companies")
public class InsuranceCompany extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private String website;

    private BigDecimal claimSettlementRatio;

    private int networkHospitals;

    @Column(name = "is_sample_data")
    private boolean sampleData = true;

    private boolean active = true;

    public InsuranceCompany() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    public BigDecimal getClaimSettlementRatio() { return claimSettlementRatio; }
    public void setClaimSettlementRatio(BigDecimal claimSettlementRatio) { this.claimSettlementRatio = claimSettlementRatio; }
    public int getNetworkHospitals() { return networkHospitals; }
    public void setNetworkHospitals(int networkHospitals) { this.networkHospitals = networkHospitals; }
    public boolean isSampleData() { return sampleData; }
    public void setSampleData(boolean sampleData) { this.sampleData = sampleData; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
