import React, { useEffect } from "react";
import { components } from "react-select";
import checked from "/check.png";
import Select from "react-select";

export default function SelectInventory({
  setToSelectedOption,
  toSelectedOption,
  onclickedContinue,
  fromOptionSelected,
  setFromOptionSelected,
  filteredOptions,
  selectedInventoryId,
  inventoryLoading,
}) {
  const normalizeId = (value) => String(value ?? "");

  const selectedFromOption =
    filteredOptions.find(
      (option) => normalizeId(option.value) === normalizeId(fromOptionSelected),
    ) ||
    null;

  const selectedToOption =
    filteredOptions.find(
      (option) => normalizeId(option.value) === normalizeId(toSelectedOption),
    ) || null;

  useEffect(() => {
    if (!fromOptionSelected && selectedInventoryId) {
      const defaultOption = filteredOptions.find(
        (option) =>
          normalizeId(option.value) === normalizeId(selectedInventoryId),
      );
      if (defaultOption) {
        setFromOptionSelected(defaultOption.value);
      }
    }
  }, [
    selectedInventoryId,
    filteredOptions,
    fromOptionSelected,
    setFromOptionSelected,
  ]);

  const CustomOption = (props) => {
    const { isSelected, label } = props;

    return (
      <components.Option {...props} className="">
        <div className="flex items-center justify-between w-full">
          <span>{label}</span>

          {isSelected && (
            <img src={checked} alt="Checked" className="w-3 h-3" />
          )}
        </div>
      </components.Option>
    );
  };

  return (
    <>
      <div className="mx-12">
        <div className="text-[24px] font-medium pt-12">Select location</div>
        <div className="mt-8 w-[25%] flex flex-col gap-1">
          <label className="text-xs text-[#6b6b6f]">FROM</label>
          <Select
            className=""
            options={filteredOptions}
            isLoading={inventoryLoading}
            value={selectedFromOption}
            placeholder="Select inventory"
            components={{
              IndicatorSeparator: () => null,
              Option: CustomOption,
            }}
            onChange={(option) => {
              setFromOptionSelected(option?.value || "");
              setToSelectedOption("");
            }}
            styles={{
              menu: (base) => ({
                ...base,
                width: "350px",
                height: "245px",
                borderRadius: "8px",

                // padding: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
              }),

              menuList: (base) => ({
                ...base,
                padding: "15px 0",
                height: "230px",
              }),
              option: (base, state) => ({
                ...base,
                padding: "15px 20px",

                backgroundColor: state.isSelected
                  ? "rgba(0, 128, 0, 0.2)"
                  : state.isFocused
                    ? "rgba(0, 128, 0, 0.1)"
                    : "transparent",
                color: "black",
                "&:hover": {
                  backgroundColor: "rgba(201, 205, 201, 0.7)",
                  color: "black",
                },
                cursor: "pointer",
                fontWeight: "semibold",
                fontSize: "14px",
              }),

              control: (base, state) => ({
                ...base,

                height: "45px",
                boxShadow: "none",
                borderColor: state.isFocused ? "#d1d5db" : "#d1d5db",
                "&:hover": {
                  borderColor: "#d1d5db",
                },
              }),
            }}
          />
        </div>
        <div className="mt-8 w-[25%] flex flex-col gap-1">
          <label className="text-xs text-[#6b6b6f]">TO</label>
          <Select
            className=""
            options={filteredOptions.filter(
              (option) =>
                normalizeId(option.value) !== normalizeId(fromOptionSelected),
            )}
            isLoading={inventoryLoading}
            value={selectedToOption}
            components={{
              IndicatorSeparator: () => null,
              Option: CustomOption,
            }}
            placeholder="Select inventory"
            onChange={(option) => {
              setToSelectedOption(option?.value || "");
            }}
            styles={{
              menu: (base) => ({
                ...base,
                width: "350px",
                height: "245px",
                borderRadius: "8px",

                // padding: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
              }),

              menuList: (base) => ({
                ...base,
                padding: "15px 0",
                height: "230px",
              }),
              option: (base, state) => ({
                ...base,
                padding: "15px 20px",
                backgroundColor: state.isSelected
                  ? "rgba(0, 128, 0, 0.2)"
                  : state.isFocused
                    ? "rgba(0, 128, 0, 0.1)"
                    : "transparent",
                color: "black",
                "&:hover": {
                  backgroundColor: "rgba(201, 205, 201, 0.7)",
                  color: "black",
                },
                cursor: "pointer",
                fontWeight: "semibold",
                fontSize: "14px",
              }),

              control: (base, state) => ({
                ...base,

                height: "45px",
                boxShadow: "none",
                borderColor: state.isFocused ? "#d1d5db" : "#d1d5db",
                "&:hover": {
                  borderColor: "#d1d5db",
                },
              }),
              placeholder: (base) => ({
                ...base,
                color: "black",
                fontSize: "14px",
              }),
            }}
          />
          {toSelectedOption === "" && onclickedContinue && (
            <p className="text-xs text-red-400">
              Please select "from" and "to" locations
            </p>
          )}
        </div>
      </div>
    </>
  );
}
