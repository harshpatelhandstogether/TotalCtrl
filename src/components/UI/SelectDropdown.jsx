import React from "react";
import Select, { components } from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { setInventoryId } from "../../slices/InventorySlice";
import checked from "/check.png";
import { useState } from "react";

export default function SelectDropdown({
  DataList,
  Loading,
  Error,
  onChange,
  className = "",
  dataList,
  loading,
  error,
  options: explicitOptions,
  value: externalValue,
  placeholder = "Select Inventory",
  default: defaultValue,
}) {
  const dispatch = useDispatch();
  const selectedInventoryId = useSelector(
    (state) => state.inventoryId.inventoryId,
  );
  const resolvedLoading = Loading ?? loading ?? false;
  const resolvedError = Error ?? error ?? false;
  const resolvedList = DataList ?? dataList ?? [];

  const options = (explicitOptions || resolvedList || []).map((data) => ({
    value: data?.id ?? data?.value,
    label: data?.name ?? data?.label,
    permission: data?.permission,
  }));

  const hasPermissions = options.some((item) => item.permission);

  const groupedOptions = [
    {
      label: "Your can edit",
      options: options
        .filter((data) => data.permission === "Editor")
        .map((data) => ({
          value: data.value,
          label: data.label,
        })),
    },
    {
      label: "Your can view",
      options: options
        .filter((data) => data.permission === "Viewer")
        .map((data) => ({
          value: data.value,
          label: data.label,
        })),
    },
  ];

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
    <div>
      <Select
        className={`w-[350px] ${className}`}
        isDisabled={resolvedLoading}
        options={resolvedError ? [] : hasPermissions ? groupedOptions : options}
        onChange={(selectedOption) => {
          if (!selectedOption) return;
          if (onChange) {
            onChange(selectedOption); // local usage — just call parent handler
          } else {
            dispatch(setInventoryId(selectedOption.value)); // global inventory selector
            onInventoryChange?.();
          }
        }}
        placeholder={placeholder}
        components={{
          IndicatorSeparator: () => null,
          Option: CustomOption,
        }}
        value={
          resolvedLoading
            ? null
            : externalValue !== undefined && externalValue !== null
              ? externalValue
              : defaultValue ??
                options.find((option) => option.value === selectedInventoryId)
        }
        defaultValue={defaultValue}
        theme={(theme) => ({
          ...theme,
          borderRadius: 5,
          colors: {
            ...theme.colors,
            primary25: "neutral20",
            primary: "green",
          },
        })}
        styles={{
          menu: (base) => ({
            ...base,
            width: "350px",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb",
          }),

          menuList: (base) => ({
            ...base,
            padding: "15px 0",
          }),
          option: (base, state) => ({
            ...base,
            padding: "15px 45px",
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
          groupHeading: (base) => ({
            ...base,
            margin: "0 30px",
            paddingBottom: "10px",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#a9a9ae",
            borderBottom: "1px solid #c5c9d2bb",
          }),
          control: (base) => ({
            // dim while loading
            ...base,
            opacity: resolvedLoading ? 0.6 : 1,
            fontSize: "14px",
          }),
        }}
      />
    </div>
  );
}
