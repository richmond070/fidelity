import { PlanConfigs, PlanConfig } from './payment.constants';

/**
 * Validates that the provided amount falls within the acceptable range for the given plan.
 * Throws an error if the amount is less than the minimum or exceeds the maximum (if defined).
 */
export function validatePlanAmount(planName: string, amount: number): void {
    // Validate the amount against the plan's price range.
    const { name, config } = getPlanConfig(planName);
    const { min, max } = config.price;

    // if (amount < min) {
    //     throw new Error(`Amount $${amount} is below the minimum required for ${name} plan: $${min}`);
    // }

    // Check if the plan has a maximum amount defined.
    if (typeof max === 'number' && amount > max) {
        throw new Error(`Amount $${amount} exceeds the maximum for ${name} plan: $${max}`);
    }
}

// Additional helper function to validate target amount
export function validateTargetAmount(planName: string, targetAmount: number): void {
    const { min, max } = getPlanPrice(planName);

    if (targetAmount < min) {
        throw new Error(`Target amount $${targetAmount} is below the minimum required for ${planName} plan: $${min}`);
    }

    if (typeof max === 'number' && targetAmount > max) {
        throw new Error(`Target amount $${targetAmount} exceeds the maximum for ${planName} plan: $${max}`);
    }
}

// this function normalizes the plan name to a standard format.
// It trims whitespace and converts it to uppercase.
export function normalizePlanName(planName: string): keyof typeof PlanConfigs {
    const normalized = planName.trim().toUpperCase();
    if (!(normalized in PlanConfigs)) {
        throw new Error(`Invalid plan name: "${planName}"`);
    }
    return normalized as keyof typeof PlanConfigs;
}

// this function retrieves the configuration for a given plan name.
export function getPlanConfig(planName: string): { name: string; config: PlanConfig } {
    const name = normalizePlanName(planName);
    return { name, config: PlanConfigs[name] };
}

// this function retrieves the duration of a plan in milliseconds.
export function getPlanDuration(planName: string): number {
    const { config } = getPlanConfig(planName);
    return config.durationInMs;
}

// this function retrieves the return rate of a plan.
export function getPlanReturnRate(planName: string): number {
    const { config } = getPlanConfig(planName);
    return config.returnRate;
}

// this function retrieves the price range of a plan.
export function getPlanPrice(planName: string): { min: number; max?: number } {
    const { config } = getPlanConfig(planName);
    if (config.price === undefined) {
        throw new Error(`No price defined for plan "${planName}"`);
    }
    return config.price;
}
