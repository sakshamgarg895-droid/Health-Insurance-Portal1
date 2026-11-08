package com.healthinsurance.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;

@Entity
@Table(name = "application_documents")
public class ApplicationDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "application_id")
    private InsuranceApplication application;

    private String documentName;

    @Column(name = "is_provided")
    private boolean provided;

    public ApplicationDocument() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public InsuranceApplication getApplication() { return application; }
    public void setApplication(InsuranceApplication application) { this.application = application; }
    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }
    public boolean isProvided() { return provided; }
    public void setProvided(boolean provided) { this.provided = provided; }
}
