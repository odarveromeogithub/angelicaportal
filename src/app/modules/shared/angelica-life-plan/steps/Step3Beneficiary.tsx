import { useState } from "react";
import type { BeneficiaryFormData } from "@/app/core/interfaces/angelica-life-plan.interface";
import { Button } from "@/app/core/components/ui/button";
import { Input } from "@/app/core/components/ui/input";
import { Label } from "@/app/core/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/core/components/ui/select";

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
                    title="Delete this beneficiary"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName" className="text-xs sm:text-sm font-semibold">
                  First Name
                </Label>
                <Input
                  id="firstName"
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
                  className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="middleName" className="text-xs sm:text-sm font-semibold">
                  Middle Name
                </Label>
                <Input
                  id="middleName"
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
                  className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName" className="text-xs sm:text-sm font-semibold">
                  Last Name
                </Label>
                <Input
                  id="lastName"
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
                  className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nameExtension" className="text-xs sm:text-sm font-semibold">
                  Name Extension
                </Label>
                <Input
                  id="nameExtension"
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
                  className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="age" className="text-xs sm:text-sm font-semibold">
                  Age
                </Label>
                <Input
                  id="age"
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
                  className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="gender" className="text-xs sm:text-sm font-semibold">
                  Gender
                </Label>
                <Select
                  value={currentBeneficiary.gender}
                  onValueChange={(value) =>
                    handleBeneficiaryChange(
                      editingIndex ?? 0,
                      "gender",
                      value
                    )
                  }
                >
                  <SelectTrigger className="w-full h-9 sm:h-10 rounded-lg border-gray-200 text-sm">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="address" className="text-xs sm:text-sm font-semibold">
                  Address
                </Label>
                <Input
                  id="address"
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
                  className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="relationship" className="text-xs sm:text-sm font-semibold">
                  Relationship
                </Label>
                <Input
                  id="relationship"
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
                  className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleAddBeneficiary}
          className="w-full h-10 sm:h-11 mt-6 sm:mt-8 px-6 rounded-lg !bg-blue-100 text-xs sm:text-sm font-semibold uppercase tracking-wide !text-blue-600 hover:!bg-blue-200 flex items-center justify-center gap-2"
        >
          <Plus className="size-4" />
          Add Beneficiary
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="h-10 sm:h-11 px-6 sm:px-8 rounded-lg text-xs sm:text-sm font-semibold uppercase tracking-wide flex-1 sm:flex-none"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isComplete}
          className="h-10 sm:h-11 px-6 sm:px-8 rounded-lg !bg-blue-600 text-xs sm:text-sm font-semibold uppercase tracking-wide !text-white hover:!bg-blue-700 disabled:!bg-gray-300 disabled:cursor-not-allowed flex-1 sm:flex-none"
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
            <AlertDialogCancel className="h-9 sm:h-10 rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteIndex !== null && handleRemoveBeneficiary(deleteIndex)}
              className="h-9 sm:h-10 rounded-lg !bg-red-600 hover:!bg-red-700 !text-white"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
