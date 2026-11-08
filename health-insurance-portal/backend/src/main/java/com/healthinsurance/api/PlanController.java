package com.healthinsurance.api;

import com.healthinsurance.entity.InsurancePlan;
import com.healthinsurance.entity.PlanCategory;
import com.healthinsurance.repository.InsurancePlanRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/plans")
@Transactional(readOnly = true)
public class PlanController {
    private final InsurancePlanRepository plans;

    public PlanController(InsurancePlanRepository plans) {
        this.plans = plans;
    }

    @GetMapping
    public List<PlanResponse> list(@RequestParam(required = false) PlanCategory category) {
        var results = category == null
                ? plans.findByActiveTrueAndCompanyActiveTrueOrderByPlanNameAsc()
                : plans.findByActiveTrueAndCompanyActiveTrueAndCategoryOrderByPlanNameAsc(category);
        return results.stream().map(PlanResponse::from).toList();
    }

    @GetMapping("/{id}")
    public PlanResponse get(@PathVariable long id) {
        var plan = plans.findByIdAndActiveTrueAndCompanyActiveTrue(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan not found"));
        return PlanResponse.from(plan);
    }

    public record PlanResponse(
            Long id, String planName, PlanCategory category, BigDecimal basePremium,
            BigDecimal coverageAmount, int minAge, int maxAge, int maxMembers,
            int waitingPeriodMonths, boolean preExistingCovered, int preExistingWaitMonths,
            String roomRentLimit, String hospitalizationBenefits, String description,
            String eligibilityCriteria, String requiredDocuments, CompanyResponse company,
            List<BenefitResponse> benefits, List<BenefitResponse> exclusions
    ) {
        static PlanResponse from(InsurancePlan plan) {
            return new PlanResponse(plan.getId(), plan.getPlanName(), plan.getCategory(),
                    plan.getBasePremium(), plan.getCoverageAmount(), plan.getMinAge(), plan.getMaxAge(),
                    plan.getMaxMembers(), plan.getWaitingPeriodMonths(), plan.isPreExistingCovered(),
                    plan.getPreExistingWaitMonths(), plan.getRoomRentLimit(), plan.getHospitalizationBenefits(),
                    plan.getDescription(), plan.getEligibilityCriteria(), plan.getRequiredDocuments(),
                    new CompanyResponse(plan.getCompany().getId(), plan.getCompany().getName(),
                            plan.getCompany().getClaimSettlementRatio(), plan.getCompany().getNetworkHospitals()),
                    plan.getBenefits().stream().map(b -> new BenefitResponse(b.getTitle(), b.getDescription())).toList(),
                    plan.getExclusions().stream().map(e -> new BenefitResponse(e.getTitle(), e.getDescription())).toList());
        }
    }

    public record CompanyResponse(Long id, String name, BigDecimal claimSettlementRatio, int networkHospitals) {}
    public record BenefitResponse(String title, String description) {}
}
