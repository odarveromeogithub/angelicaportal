/**
 * Angelica Life Plan Form Steps Configuration
 * Centralized configuration for form wizard steps
 */

export interface FormStep {
  number: number;
  label: string;
}

/**
 * Form steps for the Angelica Life Plan creation process
 * Shows 4-step wizard: Plan → Planholder → Beneficiary → Submit
 */
export const ANGELICA_FORM_STEPS: FormStep[] = [
  {
    number: 1,
    label: 'Plan',
  },
  {
    number: 2,
    label: 'Planholder',
  },
  {
    number: 3,
    label: 'Beneficiary',
  },
  {
    number: 4,
    label: 'Submit',
  },
] as const;

/**
 * Total number of steps in the form wizard
 */
export const TOTAL_FORM_STEPS = ANGELICA_FORM_STEPS.length;
