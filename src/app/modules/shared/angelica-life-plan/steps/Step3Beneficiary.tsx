import { useState } from "react";
import type { BeneficiaryFormData } from "@/app/core/interfaces/angelica-life-plan.interface";
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
  data: BeneficiaryFormData[];
  onChange: (data: BeneficiaryFormData[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step3Beneficiary({
  data,
  onChange,
  onBack,
  onNext,
}: Step3BeneficiaryProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleAddBeneficiary = () => {
    const newBeneficiary: BeneficiaryFormData = {
      firstName: "",
      middleName: "",
      lastName: "",
      nameExtension: "",
      age: "",
      gender: "",
      address: "",
      relationship: "",
    };
    onChange([...data, newBeneficiary]);
    setEditingIndex(data.length);
  };

  const handleRemoveBeneficiary = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
    setDeleteIndex(null);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleBeneficiaryChange = (
    index: number,
    field: keyof BeneficiaryFormData,
    value: string | number
  ) => {
    const updated = [...data];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  const currentBeneficiary =
    editingIndex !== null ? data[editingIndex] : data[0];

  const isComplete =
    data.length > 0 &&
    data.every(
      (b) =>
        b.firstName &&
        b.lastName &&
        b.age &&
        b.gender &&
        b.address &&
        b.relationship
    );

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Beneficiaries Details</h2>

        {data.length > 0 && (
          <div className="mb-6">
            <div className="flex gap-2 mb-4 overflow-x-auto items-center flex-wrap">
              {data.map((_, index) => (
                <div key={index} className={`flex items-center rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition-colors ${
                      editingIndex === index
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}>
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
                    className="h-7 sm:h-8 w-7 sm:w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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
                value={currentBeneficiary.firstName}
                onChange={(e) =>
                  handleBeneficiaryChange(
                    editingIndex ?? 0,
                    "firstName",
                    e.target.value
                  )
                }
                placeholder="First Name"
                required
              />

              <FormField
                label="Middle Name"
                id="middleName"
                name="middleName"
                type="text"
                value={currentBeneficiary.middleName}
                onChange={(e) =>
                  handleBeneficiaryChange(
                    editingIndex ?? 0,
                    "middleName",
                    e.target.value
                  )
                }
                placeholder="Middle Name"
              />

              <FormField
                label="Last Name"
                id="lastName"
                name="lastName"
                type="text"
                value={currentBeneficiary.lastName}
                onChange={(e) =>
                  handleBeneficiaryChange(
                    editingIndex ?? 0,
                    "lastName",
                    e.target.value
                  )
                }
                placeholder="Last Name"
                required
              />
            </div>

            <div className={GRID_LAYOUTS.threeColumns}>
              <FormField
                label="Name Extension"
                id="nameExtension"
                name="nameExtension"
                type="text"
                value={currentBeneficiary.nameExtension}
                onChange={(e) =>
                  handleBeneficiaryChange(
                    editingIndex ?? 0,
                    "nameExtension",
                    e.target.value
                  )
                }
                placeholder="ex. Jr, Sr, III..."
              />

              <FormField
                label="Age"
                id="age"
                name="age"
                type="number"
                value={currentBeneficiary.age}
                onChange={(e) =>
                  handleBeneficiaryChange(
                    editingIndex ?? 0,
                    "age",
                    e.target.value
                  )
                }
                placeholder="ex. 24"
                required
              />

              <FormSelect
                label="Gender"
                id="gender"
                value={currentBeneficiary.gender}
                onValueChange={(value) =>
                  handleBeneficiaryChange(
                    editingIndex ?? 0,
                    "gender",
                    value
                  )
                }
                options={GENDER_OPTIONS}
                placeholder="Select Gender"
                required
              />
            </div>

            <div className={GRID_LAYOUTS.twoColumns}>
              <FormField
                label="Address"
                id="address"
                name="address"
                type="text"
                value={currentBeneficiary.address}
                onChange={(e) =>
                  handleBeneficiaryChange(
                    editingIndex ?? 0,
                    "address",
                    e.target.value
                  )
                }
                placeholder="Address"
                required
              />

              <FormField
                label="Relationship"
                id="relationship"
                name="relationship"
                type="text"
                value={currentBeneficiary.relationship}
                onChange={(e) =>
                  handleBeneficiaryChange(
                    editingIndex ?? 0,
                    "relationship",
                    e.target.value
                  )
                }
                placeholder="Relationship"
                required
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleAddBeneficiary}
          className={cn("w-full mt-6 sm:mt-8 flex items-center justify-center gap-2", FIELD_CLASSES.button.base, FIELD_CLASSES.button.light)}
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
          className={cn(FIELD_CLASSES.button.base, FIELD_CLASSES.button.secondary, "flex-1 sm:flex-none")}
          aria-label="Go back to previous step"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isComplete}
          className={cn(FIELD_CLASSES.button.base, FIELD_CLASSES.button.primary, "flex-1 sm:flex-none")}
          aria-label="Proceed to final step"
        >
          Next
        </Button>
      </div>

      <AlertDialog open={deleteIndex !== null} onOpenChange={(open) => !open && setDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Beneficiary?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete Beneficiary {deleteIndex !== null ? deleteIndex + 1 : ""}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className={cn(FIELD_CLASSES.button.secondary, "h-9 sm:h-10")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteIndex !== null && handleRemoveBeneficiary(deleteIndex)}
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
