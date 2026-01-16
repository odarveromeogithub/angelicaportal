import { useState } from "react";
import type { PlanholderFormData } from "@/app/core/interfaces/angelica-life-plan.interface";
import { Button } from "@/app/core/components/ui/button";
import { Input } from "@/app/core/components/ui/input";
import { Label } from "@/app/core/components/ui/label";
import { Calendar } from "@/app/core/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/core/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/core/components/ui/select";

interface Step2PlanholderProps {
  data: PlanholderFormData;
  onChange: (data: PlanholderFormData) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step2Planholder({
  data,
  onChange,
  onBack,
  onNext,
}: Step2PlanholderProps) {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: value,
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      onChange({
        ...data,
        dateOfBirth: formattedDate,
      });
    }
    setOpenDatePicker(false);
  };

  const handleSelectChange = (name: string, value: string) => {
    onChange({
      ...data,
      [name]: value,
    });
  };

  const isComplete =
    data.firstName &&
    data.lastName &&
    data.dateOfBirth &&
    data.gender &&
    data.civilStatus &&
    data.email &&
    data.contactNumber &&
    data.street &&
    data.barangay &&
    data.cityMunicipal &&
    data.province &&
    data.zipCode;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Planholder Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstName" className="text-xs sm:text-sm font-semibold">
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              value={data.firstName}
              onChange={handleInputChange}
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
              name="middleName"
              type="text"
              value={data.middleName}
              onChange={handleInputChange}
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
              name="lastName"
              type="text"
              value={data.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nameExtension" className="text-xs sm:text-sm font-semibold">
              Name Extension
            </Label>
            <Input
              id="nameExtension"
              name="nameExtension"
              type="text"
              value={data.nameExtension}
              onChange={handleInputChange}
              placeholder="ex. Jr, Sr, III..."
              className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="dateOfBirth" className="text-xs sm:text-sm font-semibold">
              Date of Birth
            </Label>
            <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="dateOfBirth"
                  className="h-9 sm:h-10 w-full justify-between rounded-lg border-gray-200 font-normal text-xs sm:text-sm"
                >
                  {data.dateOfBirth ? format(new Date(data.dateOfBirth), "MMM dd, yyyy") : "Select date"}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.dateOfBirth ? new Date(data.dateOfBirth) : undefined}
                  captionLayout="dropdown"
                  onSelect={handleDateSelect}
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-2">
            <Label htmlFor="gender" className="text-xs sm:text-sm font-semibold">
              Gender
            </Label>
            <Select value={data.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
              <SelectTrigger className="w-full h-9 sm:h-10 rounded-lg border-gray-200 text-sm">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="civilStatus" className="text-xs sm:text-sm font-semibold">
              Civil Status
            </Label>
            <Select value={data.civilStatus} onValueChange={(value) => handleSelectChange("civilStatus", value)}>
              <SelectTrigger className="w-full h-9 sm:h-10 rounded-lg border-gray-200 text-sm">
                <SelectValue placeholder="Select Civil Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-xs sm:text-sm font-semibold">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={data.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contactNumber" className="text-xs sm:text-sm font-semibold">
              Contact Number
            </Label>
            <div className="flex items-center h-9 sm:h-10 rounded-lg border border-gray-200 bg-white px-3">
              <span className="text-xs sm:text-sm font-semibold text-gray-600 mr-2">+63</span>
              <input
                id="contactNumber"
                name="contactNumber"
                type="text"
                value={data.contactNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  onChange({ ...data, contactNumber: value });
                }}
                placeholder="9150125456"
                maxLength={10}
                className="flex-1 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-2">
            <Label htmlFor="lotHouseNumber" className="text-xs sm:text-sm font-semibold">
              Lot House Number
            </Label>
            <Input
              id="lotHouseNumber"
              name="lotHouseNumber"
              type="text"
              value={data.lotHouseNumber}
              onChange={handleInputChange}
              placeholder="Lot House Number"
              className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="street" className="text-xs sm:text-sm font-semibold">
              Street
            </Label>
            <Input
              id="street"
              name="street"
              type="text"
              value={data.street}
              onChange={handleInputChange}
              placeholder="Street"
              className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-2">
            <Label htmlFor="barangay" className="text-xs sm:text-sm font-semibold">
              Barangay
            </Label>
            <Input
              id="barangay"
              name="barangay"
              type="text"
              value={data.barangay}
              onChange={handleInputChange}
              placeholder="Barangay"
              className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="cityMunicipal" className="text-xs sm:text-sm font-semibold">
              City/Municipal
            </Label>
            <Input
              id="cityMunicipal"
              name="cityMunicipal"
              type="text"
              value={data.cityMunicipal}
              onChange={handleInputChange}
              placeholder="City/Municipal"
              className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="province" className="text-xs sm:text-sm font-semibold">
              Province
            </Label>
            <Input
              id="province"
              name="province"
              type="text"
              value={data.province}
              onChange={handleInputChange}
              placeholder="Province"
              className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="zipCode" className="text-xs sm:text-sm font-semibold">
              Zip Code
            </Label>
            <Input
              id="zipCode"
              name="zipCode"
              type="number"
              value={data.zipCode}
              onChange={handleInputChange}
              placeholder="Zip Code"
              className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
            />
          </div>
        </div>
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
    </div>
  );
}
