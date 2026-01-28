import { useState } from "react";
import type { Control, FieldErrors } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { IAngelicaLifePlanFormData } from "@/app/core/interfaces/angelica-life-plan.interface";
import { Button } from "@/app/core/components/ui/button";
import { FormField, FormSelect } from "@/app/core/components/form";
import { Trash2, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/core/components/ui/alert-dialog";
import {
  FIELD_CLASSES,
  GENDER_OPTIONS,
  GRID_LAYOUTS,
} from "@/app/core/constants/angelica-life-plan";
import { cn } from "@/app/core/lib/utils";

interface Step3BeneficiaryProps {
  control: Control<IAngelicaLifePlanFormData>;
  errors: FieldErrors<IAngelicaLifePlanFormData>;
  onBack: () => void;
  onNext: () => void;
}

export default function Step3Beneficiary({
  control,
  errors,
  onBack,
  onNext,
}: Step3BeneficiaryProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "beneficiaries",
  });

  const handleAddBeneficiary = () => {
    append({
      firstName: "",
      middleName: "",
      lastName: "",
      nameExtension: "",
      age: "",
      gender: "",
      address: "",
      relationship: "",
    });
    setEditingIndex(fields.length);
  };

  const handleRemoveBeneficiary = (index: number) => {
    remove(index);
    setDeleteIndex(null);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const currentBeneficiary =
    editingIndex !== null ? fields[editingIndex] : fields[0];

  const isComplete =
    fields.length > 0 &&
    fields.every((field, index) => {
      const beneficiary = control._formValues.beneficiaries?.[index];
      return (
        beneficiary?.firstName &&
        beneficiary?.lastName &&
        beneficiary?.age &&
        beneficiary?.gender &&
        beneficiary?.address &&
        beneficiary?.relationship
      );
    });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
          Beneficiaries Details
        </h2>

        {fields.length > 0 && (
          <div className="mb-6">
            <div className="flex gap-2 mb-4 overflow-x-auto items-center flex-wrap">
              {fields.map((field, index) => (
                <div
                  key={index}
                  className={`flex items-center rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition-colors ${
                    editingIndex === index
                      ? "bg-blue-600 text-white dark:bg-blue-500"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  <button
                    onClick={() => setEditingIndex(index)}
                    className={`px-2 sm:px-4 py-1 sm:py-2`}
                  >
                    Beneficiary {index + 1}
                  </button>
                  <Button
                    type="button"
                    onClick={() => setDeleteIndex(index)}
                    variant="ghost"
                    size="sm"
                    className="h-7 sm:h-8 w-7 sm:w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40"
                    aria-label={`Delete beneficiary ${index + 1}`}
                  >
                    <Trash2 className="size-3 sm:size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentBeneficiary && (
          <div className="space-y-4 sm:space-y-6">
            <div className={GRID_LAYOUTS.threeColumns}>
              <FormField
                label="First Name"
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First Name"
                required
                registerProps={control.register(
                  `beneficiaries.${editingIndex ?? 0}.firstName`,
                )}
                error={
                  errors.beneficiaries?.[editingIndex ?? 0]?.firstName?.message
                }
              />

              <FormField
                label="Middle Name"
                id="middleName"
                name="middleName"
                type="text"
                placeholder="Middle Name"
                registerProps={control.register(
                  `beneficiaries.${editingIndex ?? 0}.middleName`,
                )}
                error={
                  errors.beneficiaries?.[editingIndex ?? 0]?.middleName?.message
                }
              />

              <FormField
                label="Last Name"
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last Name"
                required
                registerProps={control.register(
                  `beneficiaries.${editingIndex ?? 0}.lastName`,
                )}
                error={
                  errors.beneficiaries?.[editingIndex ?? 0]?.lastName?.message
                }
              />
            </div>

            <div className={GRID_LAYOUTS.threeColumns}>
              <FormField
                label="Name Extension"
                id="nameExtension"
                name="nameExtension"
                type="text"
                placeholder="ex. Jr, Sr, III..."
                registerProps={control.register(
                  `beneficiaries.${editingIndex ?? 0}.nameExtension`,
                )}
                error={
                  errors.beneficiaries?.[editingIndex ?? 0]?.nameExtension
                    ?.message
                }
              />

              <FormField
                label="Age"
                id="age"
                name="age"
                type="number"
                placeholder="ex. 24"
                required
                registerProps={control.register(
                  `beneficiaries.${editingIndex ?? 0}.age`,
                )}
                error={errors.beneficiaries?.[editingIndex ?? 0]?.age?.message}
              />

              <FormSelect
                label="Gender"
                id="gender"
                control={control}
                name={`beneficiaries.${editingIndex ?? 0}.gender`}
                options={GENDER_OPTIONS}
                placeholder="Select Gender"
                required
                error={
                  errors.beneficiaries?.[editingIndex ?? 0]?.gender?.message
                }
              />
            </div>

            <div className={GRID_LAYOUTS.twoColumns}>
              <FormField
                label="Address"
                id="address"
                name="address"
                type="text"
                placeholder="Address"
                required
                registerProps={control.register(
                  `beneficiaries.${editingIndex ?? 0}.address`,
                )}
                error={
                  errors.beneficiaries?.[editingIndex ?? 0]?.address?.message
                }
              />

              <FormField
                label="Relationship"
                id="relationship"
                name="relationship"
                type="text"
                placeholder="Relationship"
                required
                registerProps={control.register(
                  `beneficiaries.${editingIndex ?? 0}.relationship`,
                )}
                error={
                  errors.beneficiaries?.[editingIndex ?? 0]?.relationship
                    ?.message
                }
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleAddBeneficiary}
          className={cn(
            "w-full mt-6 sm:mt-8 flex items-center justify-center gap-2",
            FIELD_CLASSES.button.base,
            FIELD_CLASSES.button.light,
          )}
          aria-label="Add new beneficiary"
        >
          <Plus className="size-4" />
          Add Beneficiary
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className={cn(
            FIELD_CLASSES.button.base,
            FIELD_CLASSES.button.secondary,
            "flex-1 sm:flex-none",
          )}
          aria-label="Go back to previous step"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isComplete}
          className={cn(
            FIELD_CLASSES.button.base,
            FIELD_CLASSES.button.primary,
            "flex-1 sm:flex-none",
          )}
          aria-label="Proceed to final step"
        >
          Next
        </Button>
      </div>

      <AlertDialog
        open={deleteIndex !== null}
        onOpenChange={(open) => !open && setDeleteIndex(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Beneficiary?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete Beneficiary{" "}
              {deleteIndex !== null ? deleteIndex + 1 : ""}? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel
              className={cn(FIELD_CLASSES.button.secondary, "h-9 sm:h-10")}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteIndex !== null && handleRemoveBeneficiary(deleteIndex)
              }
              className={cn(FIELD_CLASSES.button.danger)}
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
