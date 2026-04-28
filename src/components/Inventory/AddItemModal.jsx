import Modal from "../UI/Modal";
import { use, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { HiUpload } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";

import AddItemCloseModal from "./InventoryItemAddConformationModal";
import { MdErrorOutline } from "react-icons/md";
import ImportItemModal from "./ImportItemModal";
import addItems from "../../services/Inventory/addItem";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { useApi } from "../../hooks/useApi";
import fetchUnits from "../../services/Inventory/fetchUnits";
import fetchSearchProduct from "../../services/Inventory/fetchSearchProduct";
import {
  displayCurrencyWithoutSymbol,
  formatCurrencyInput,
  displayCurrency,
} from "../../utils/formatCurrency";

export default function AddItemModal({
  matchName,
  isOpen,
  onClose,
  stockValue,
  selectedInventoryId,
  onConfirm,
  products,
  refetchProducts,
  onProductAdded,
}) {
  const [rows, setRows] = useState([
    {
      id: "0",
      product: null,
      quantity: "",
      unit: null,
      price: "",

      total: "",
    },
  ]);
  useEffect(() => {
  if (isOpen) {
    setRows([
      {
        id: "0",
        product: null,
        quantity: "",
        unit: null,
        price: "",
        total: "",
      },
    ]);
  }
}, [isOpen]);
  const [searchInput, setSearchInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [writingUnit, setWritingUnit] = useState(false);
  // const { searchProduct, searchInput, setSearchInput } = useSearchProducts();
  const {
    data: searchProduct,
    loading: searchProductLoading,
    error: searchProductError,
    refetch: refetchSearchProduct,
  } = useApi(fetchSearchProduct, [searchInput, selectedInventoryId], {
    immediate: false,
  });
  useEffect(() => {
    if (searchInput) {
      refetchSearchProduct(searchInput);
    }
  }, [searchInput]);

  const {
    data: unit,
    loading: unitLoading,
    error: unitError,
  } = useApi(fetchUnits, [], { immediate: true });
  console.log("Units in AddItemModal:", unit);
  const tbodyRef = useRef(null);
  const [closeModal, setCloseModal] = useState(false);
  const [errors, setErrors] = useState("");
  const [importModal, setImportModal] = useState(false);

  const handleImportSuccess = (data) => {
    const formattedRows = data.map((item, index) => {
      const selectedUnit = unit?.purchaseUnit
        .map((u) => ({
          value: u.id,
          singular: u.singularShortcut,
          plural: u.pluralShortcut,
        }))
        .find((u) => u.singular === item.unit || u.plural === item.unit);
      console.log(
        "Matching unit for item:",
        item.unit,
        "Selected Unit:",
        selectedUnit,
      );

      return {
        id: index.toString(),
        product: null,
        name: item.name || "",
        sku: item.sku || "",
        quantity: item.quantity || "",
        unit: selectedUnit
          ? {
              value: selectedUnit.value,
              label:
                Number(item.quantity) === 1
                  ? selectedUnit.singular
                  : selectedUnit.plural,
              singular: selectedUnit.singular,
              plural: selectedUnit.plural,
            }
          : null,

        price: item.pricePerStocktakingUnit || "",
        total:
          item.quantity && item.pricePerStocktakingUnit
            ? (item.quantity * item.pricePerStocktakingUnit).toFixed(2)
            : "",

        isUnitLocked: false,
      };
    });
    console.log("Formatted Rows from Import:", formattedRows);

    const emptyRow = {
      id: "0",
      product: null,
      name: "",
      sku: "",
      quantity: "",
      unit: null,
      price: "",
      total: "",
      isUnitLocked: false,
    };

    // setRows([...formattedRows, emptyRow]);
    setRows((prev) => {
    // Remove empty rows first, then append new ones + empty row
    const nonEmptyRows = prev.filter(
      (row) => row.name || row.quantity || row.price
    );
    return [...nonEmptyRows, ...formattedRows, emptyRow]; // 👈 append
  });
  };

  const handleItemChange = (index, newValue) => {
    console.log("Selected product ID:", newValue?.value);
    setRows((prevRows) =>
      prevRows.map((row, i) => {
        if (i !== index) return row;

        const existingProduct = searchProduct.find(
          (item) => item.id === newValue?.value,
        );
        console.log("Existing Product:", existingProduct);

        if (existingProduct) {
          return {
            ...row,
            product: newValue,
            name: existingProduct.name || "",
            price: existingProduct.pricePerPurchaseUnit || "",
            unit:
              formattedUnits.find(
                (u) => u.value === existingProduct.purchaseUnitId,
              ) || null,
            sku: existingProduct.sku || "",
            isUnitLocked: true,
          };
        } else {
          return {
            ...row,

            id: null,
            name: newValue?.label || "",
            sku: "",
            price: "",
            unit: null,
            isUnitLocked: false,
          };
        }
      }),
    );
  };

  const handleDeleteRow = (index) => {
    setRows((prev) => {
      if (prev.length === 1) {
        return [
          {
            product: null,
            name: "",
            quantity: "",
            unit: null,
            price: "",
            isUnitLocked: false,
          },
        ];
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  const parseValue = (val) => {
    if (val === "" || val === null || val === undefined) return "";
    const decimal = stockValue?.currency?.decimalSeparator || ",";

    // Replace currency decimal → dot for math
    const normalized = val.toString().replace(decimal, ".");
    const parsed = Number(normalized);
    return isNaN(parsed) ? "" : parsed;
  };

  const updateRowField = (index, field, value) => {
    // allow only numbers + dot + comma
    const cleanedValue = value.replace(/[^0-9.,]/g, ",");

    // prevent multiple dots/commas
    if ((cleanedValue.match(/[.,]/g) || []).length > 1) return;

    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;

        let updated = { ...row, [field]: cleanedValue };

        const qty = parseValue(updated.quantity);
        const price = parseValue(updated.price);
        const total = parseValue(updated.total);

        if (field === "quantity" || field === "price") {
          if (qty !== "" && price !== "") {
            updated.total = (qty * price).toFixed(2);
          } else {
            updated.total = "";
          }
        }

        if (field === "total") {
          if (qty !== "" && qty !== 0 && total !== "") {
            updated.price = (total / qty).toFixed(2);
          }
        }

        if (field === "quantity") {
          if (row.unit && qty !== "") {
            const selectedUnit = formattedUnits.find(
              (u) => u.value === row.unit.value,
            );

            if (selectedUnit) {
              updated.unit = {
                ...row.unit,
                label: qty === 1 ? selectedUnit.singular : selectedUnit.plural,
              };
            }
          }
        }

        return updated;
      }),
    );
  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (!tbodyRef.current) return;

  //     // if (tbodyRef.current.contains(event.target)) {
  //       // Check if click was directly on an existing row
  //       // const clickedRow = event.target.closest("tr");

  //       // If clicked inside any existing row, do nothing
  //       // if (clickedRow) return;
  //       setRows((prev) => {
  //         const lastRow = prev[prev.length - 1];

  //         if (lastRow.product || lastRow.quantity || lastRow.price) {
  //           return [
  //             ...prev,
  //             {
  //               product: null,
  //               quantity: "",
  //               unit: null,
  //               price: "",
  //               isUnitLocked: false,
  //             },
  //           ];
  //         }

  //         return prev;
  //       });
  //     }
  //   // };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const addRowOnFocus = () => {
    
    const emptyRow = rows.some((row) => !row.name||row.name.trim() ==="");

  !emptyRow && setRows((prev) => {

    return [
      ...prev,
      {
        
        product: null,
        name: "",
        quantity: "",
        unit: null,
        price: "",
        total: "",
        isUnitLocked: false,
      },
    ];
  });
};
  useEffect(() => {
    if (errors) {
      const isValid = rows.every(
        (row) =>
          row.name?.trim() &&
          row.quantity &&
          Number(row.quantity) > 0 &&
          row.unit &&
          row.price &&
          Number(row.price) > 0,
      );

      if (isValid) {
        setErrors("");
      }
    }
  }, [rows]);

  const formattedOptions = Array.isArray(searchProduct)
    ? searchProduct.map((item) => ({
        value: item.id,
        label: item.name.toLowerCase(),
      }))
    : [];
  console.log("Formatted Options for Autocomplete:", formattedOptions);

  const highlightText = (text, input) => {
    if (!input) return text;

    const escapedInput = input.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
    const regex = new RegExp(`(${escapedInput})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === input.toLowerCase() ? (
        <span
          key={index}
          style={{ color: "black", fontWeight: "bold", fontSize: "12px" }}
        >
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const formattedUnits =
    unit && Array.isArray(unit.purchaseUnit)
      ? unit.purchaseUnit.map((u) => ({
          value: u.id,
          singular: u.singularShortcut,
          plural: u.pluralShortcut,
          label: u.pluralShortcut,
        }))
      : [];
  console.log("Formatted Units:", formattedUnits);

  const validateForm = () => {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (!row.name || row.name.trim() === "") {
        setErrors(
          "Please fill in all the required fields before you continue.",
        );
        return false;
      }

      if (!row.quantity || isNaN(row.quantity) || Number(row.quantity) <= 0) {
        setErrors(
          "Please fill in all the required fields before you continue.",
        );
        return false;
      }

      if (!row.unit) {
        setErrors(
          "Please fill in all the required fields before you continue.",
        );
        return false;
      }

      const parsedPrice = parseValue(row.price);
      if (parsedPrice === "" || parsedPrice <= 0) {
        setErrors(
          "Please fill in all the required fields before you continue.",
        );
        return false;
      }
    }

    setErrors("");
    return true;
  };

  const createPayload = () => {
    return {
      dateAndTime: new Date().toLocaleString("sv-SE").replace("T", " "),
      language: "en",
      currencyId: "87664710-822b-4d9e-84e5-f5eb1d94ab6c",
      inventoryId: selectedInventoryId,
      userId: "933c82a7-1368-4ee3-8b98-36f2735b2d6a",

      products: rows
        .filter((row) => row && row.quantity && row.price)
        .map((row) => ({
          productId: row.id,
          sku: row?.sku || "",
          productName: row?.name,
          name: row?.name,
          qty: parseFloat(row.quantity) || 0,

          purchaseUnitId: row.unit?.value || null,
          stockTakingUnitId: row.unit?.value || null,

          stockTakingQuantityPerPurchaseUnit: 1,
          stockTakingQuantityPerBaseMeasurementUnit: 0,
          baseMeasurementUnitId: null,
          quantityBaseMeasurmentUnit: 0,

          preppingUnitId: null,
          purchaseSubUnitId: null,

          pricePerPurchaseUnit: 0,
          pricePerStockTakingUnit: parseValue(row.price) || 0,
          pricePerBaseUnit: 0,

          expirationDate: null,

          products: [
            {
              quantity: parseFloat(row.quantity) || 0,
              expirationDate: null,
              selected: false,
              id: "0",
              isManual: 1,
            },
          ],

          isSkuUpdate: false,
          productGroupId: null,
        })),
    };
  };
  const {
    loading: addItemLoading,
    refetch: submitItems,
    error: submitItemsError,
  } = useApi(addItems, [], { immediate: false });

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }
      const payload = createPayload();

      onProductAdded(rows);
      onClose();

      const response = await submitItems(payload);

      console.log("Success:", response.data);
      onConfirm();
      setRows([
        {
          product: null,
          name: "",
          quantity: "",
          unit: null,
          price: "",
          isUnitLocked: false,
        },
      ]);
      // setSupplierId("");
      refetchProducts();
      console.log("Products after refetch:", products);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const hasData = rows.some((row) => row.name || row.quantity || row.price);

  console.log("Rows state:", rows);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          if (hasData) {
            setCloseModal(true);
            setErrors("");
          } else {
            onClose();
            setErrors("");
          }
        }}
        className="w-[1200px] h-[900px]"
      >
        <div className="realtive w-full">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold align-middle pt-2 px-6">
              Add items to {matchName}
            </h2>
            <div className="flex gap-5  content-center">
              <div className="flex justify-between gap-2  text-white font-semibold cursor-pointer px-4 rounded-md bg-[#23a956] hover:bg-green-600 cursor-pointer">
                <span className="py-3">
                  <HiUpload size={20} />
                </span>
                <button
                  className="cursor-pointer "
                  onClick={() => setImportModal(true)}
                >
                  Import items using a spreadsheet template{" "}
                </button>
              </div>
              <div
                className="pt-3 pr-6"
                onClick={() => {
                  if (hasData) {
                    setCloseModal(true);
                    setErrors("");
                  } else {
                    onClose();
                    setErrors("");
                  }
                }}
              >
                <button className="cursor-pointer">
                  <IoMdClose size={25} />
                </button>
              </div>
            </div>
          </div>
          <div
            className="overflow-auto overscroll-contain h-[700px] relative mt-5"
            ref={tbodyRef}
          >
            <table className="w-full  table-auto px-6  " >
              <thead className="w-full bg-[#f8f9fa] sticky top-0 z-10 border-y border-[#e7e7ec]">
                <tr className="text-[12px] text-gray-700  uppercase  text-[#969697]">
                  <th className="font-semibold text-right py-3 px-4 w-[7%]">
                    SKU
                  </th>
                  <th className=" font-semibold text-left py-2 px-6 w-[30%]">
                    ITEM NAME <sup className="text-red-500">*</sup>
                  </th>
                  <th className="font-semibold text-right py-2 px-4 w-[10%]">
                    QUANTITY
                  </th>
                  <th className="font-semibold text-left py-2 px-4 pl-6 w-[15%]">
                    UNIT<sup className="text-red-500">*</sup>
                  </th>
                  <th className="font-semibold text-right py-2 px-4 w-[12%]">
                    COST PER UNIT<sup className="text-red-500">*</sup>
                  </th>
                  <th className="font-semibold text-right py-2 px-4 w-[10%]">
                    TOTAL VALUE<sup className="text-red-500">*</sup>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="px-6 overflow-y-auto overscroll-contain">
                {rows.map((row, index) => (
                  <tr key={index} className="border-b border-gray-200 px-6">
                    <td className="text-right py-6 px-4 w-[7%] text-[13px]">
                      <input
                        type="text"
                        className="w-full rounded-sm focus:outline-none  text-right  py-1 text-[13px] "
                        placeholder="SKU"
                        name="SKU"
                        value={row?.sku || ""}
                        onChange={(e) =>
                          setRows((prev) =>
                            prev.map((r, i) =>
                              i === index
                                ? {
                                    ...r,
                                    sku: e.target.value,
                                  }
                                : r,
                            ),
                          )
                        }
                      />
                    </td>
                    <td className="text-left py-2 px-4 w-[35%] text-[13px]">
                      <Autocomplete
                        freeSolo // allows typing new values
                        options={formattedOptions || []} // [{label, value}]
                        slotProps={{
                          paper: {
                            sx: {
                              "& .MuiAutocomplete-option": {
                                fontSize: "13px",
                                padding: "10px 15px",
                              },
                            },
                          },
                        }}
                        getOptionLabel={(option) =>
                          typeof option === "string"
                            ? option.toLowerCase()
                            : option.label?.toLowerCase()
                        }
                        //  control selected value
                        value={row.product || null}
                        //  control input text
                        inputValue={row.name || ""}
                        onInputChange={(event, newInputValue, reason) => {
                          // Ignore reset triggered by selecting an option,
                          // otherwise it unlocks the unit right after selection.
                          if (reason === "reset") return;

                          if (reason === "clear") {
                            setRows((prev) =>
                              prev.map((r, i) =>
                                i === index
                                  ? {
                                      ...r,
                                      product: null,
                                      name: "",
                                      unit: null,
                                      isUnitLocked: false,
                                    }
                                  : r,
                              ),
                            );
                            setSearchInput("");
                            return;
                          }

                          setRows((prev) =>
                            prev.map((r, i) =>
                              i === index
                                ? {
                                    ...r,
                                    name: newInputValue?.toUpperCase(),
                                    product: null,
                                    isUnitLocked: false,
                                  }
                                : r,
                            ),
                          );

                          setSearchInput(newInputValue);
                        }}
                        onChange={(event, newValue) => {
                          //  if user types new value
                          if (typeof newValue === "string") {
                            setRows((prev) =>
                              prev.map((r, i) =>
                                i === index
                                  ? {
                                      ...r,
                                      name: newValue,
                                      product: null,
                                      isUnitLocked: false,
                                    }
                                  : r,
                              ),
                            );
                          } else if (newValue) {
                            //  selected from dropdown
                            setRows((prev) =>
                              prev.map((r, i) =>
                                i === index
                                  ? {
                                      ...r,
                                      product: newValue,
                                      name: newValue.label,
                                      isUnitLocked: true,
                                    }
                                  : r,
                              ),
                            );

                            handleItemChange(index, newValue);
                          } else {
                            //  cleared
                            setRows((prev) =>
                              prev.map((r, i) =>
                                i === index
                                  ? {
                                      ...r,
                                      product: null,
                                      name: "",
                                      unit: null,
                                      isUnitLocked: false,
                                    }
                                  : r,
                              ),
                            );
                          }
                        }}
                        renderOption={(props, option, { inputValue }) => (
                          <li {...props}>
                            {highlightText(option.label, inputValue)}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="item name"
                            variant="outlined"
                            InputProps={{
                              ...params.InputProps,
                              disableUnderline: true, // match your UI
                            }}
                            />
                          )}
                          onBlur={() => addRowOnFocus()} 
                        sx={{
                          //  main container
                          width: "80%",

                          // input root (control)
                          "& .MuiInputBase-root": {
                            minHeight: "20px",
                            height: "20px",
                            padding: "10px !important",
                            margin: "10px",
                            boxShadow: "none",
                            border: "none",
                            fontSize: "13px",
                          },
                          "& .MuiAutocomplete-option": {
                            fontSize: "12px",
                            minHeight: "30px",
                            padding: "4px 8px",
                          },

                          //  remove outline border
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },

                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },

                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },

                          //  input field
                          "& .MuiInputBase-input": {
                            padding: "0 !important",
                            height: "20px",
                            fontWeight: 600,
                          },

                          //  placeholder
                          "& input::placeholder": {
                            color: errors[index]?.name ? "red" : "#6b6b6f",
                            opacity: 1,
                          },

                          //  remove dropdown icon spacing
                          "& .MuiAutocomplete-endAdornment": {
                            display: "none",
                          },
                        }}
                      />
                    </td>
                    <td className="text-right py-2 px-4 w-[10%]">
                      <input
                        type="text"
                        className={`w-full  rounded-sm focus:outline-none  text-right  py-1 text-[13px] ${errors ? "placeholder-red-500" : "placeholder-gray-400"}`}
                        placeholder="Quantity"
                        value={row.quantity}
                        onChange={(e) =>
                          updateRowField(index, "quantity", e.target.value)
                        }
                      />
                    </td>
                    <td className="text-left py-2 px-4 w-[15%] text-[13px]">
                      <Select
                        className={`w-full rounded-sm focus:outline-none text-[13px] ${errors ? "placeholder-red-500" : "placeholder-gray-400"} `}
                        
                        menuPlacement="auto"
                        isDisabled={unitLoading || row.isUnitLocked}
                        value={row.unit}
                        onChange={(val) =>
                          setRows((prev) =>
                            prev.map((r, i) => {
                              if (i !== index) return r;

                              const qty = Number(r.quantity);

                              return {
                                ...r,
                                unit: {
                                  ...val,
                                  label: qty === 1 ? val.singular : val.plural,
                                },
                              };
                            }),
                          )
                        }
                        options={formattedUnits}
                        placeholder={
                          unitLoading ? "Loading units..." : "Select unit"
                        }
                        components={{
                          IndicatorSeparator: () => null,
                        }}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            outline: "none",
                            boxShadow: "none",
                            borderColor: "none",
                            border: "none",
                            minHeight: "32px",
                            height: "32px",
                            margin: "0",
                            padding: "0",
                            "&:hover": {
                              borderColor: "none",
                            },
                          }),
                          indicatorsContainer: (base) => ({
                            ...base,
                            height: "30px",
                            padding: "0",
                          }),
                          container: (base) => ({
                            ...base,
                            outline: "none",
                            margin: "0",
                            padding: "0",
                          }),
                          input: (base) => ({
                            ...base,
                            margin: "0",
                            padding: "0",
                            height: "30px",
                          }),
                          selectContainer: (base) => ({
                            ...base,
                            height: "30px",
                            margin: "0",
                            padding: "0",
                          }),
                          placeholder: (base) => ({
                            ...base,

                            color: errors ? "red" : "#6b6b6f",
                          }),
                        }}
                      />
                      {unitError && (
                        <p className="text-red-500 text-[12px] mt-1">
                          Error loading units
                        </p>
                      )}
                    </td>
                    <td className="text-right py-5 px-4 w-[12%] flex items-center gap-1">
                      <input
                        type="text"
                        required
                        className={` w-[100px] rounded-sm focus:outline-none  text-right pl-2 py-[8px] ${errors ? "placeholder-red-500" : "placeholder-gray-400"} text-[13px] `}
                        placeholder={`0${stockValue?.currency?.decimalSeparator || ","}00 ${stockValue?.currency?.symbol || ""}`}
                        value={
                          editingIndex === index
                            ? row.price || "" // raw while typing "12.5"
                            : row.price
                              ? displayCurrencyWithoutSymbol(
                                  row.price,
                                  stockValue?.currency,
                                )
                              : ""
                        }
                        onFocus={() => setEditingIndex(index)}
                        onBlur={() => {
                          setEditingIndex(null);

                          if (row.price) {
                            const decimal =
                              stockValue?.currency?.decimalSeparator || ",";
                            const normalized = row.price
                              .toString()
                              .replace(decimal, ".");
                            const parsed = Number(normalized);

                            if (isNaN(parsed)) return;

                            const formatted = parsed
                              .toFixed(2)
                              .replace(".", decimal);

                            setRows((prev) =>
                              prev.map((r, i) =>
                                i === index ? { ...r, price: formatted } : r,
                              ),
                            );
                          }
                        }}
                        onChange={(e) =>
                          updateRowField(
                            index,
                            "price",
                            formatCurrencyInput(
                              e.target.value,
                              stockValue?.currency,
                            ),
                          )
                        }
                      />

                      <p
                        className={`text-[13px] ${errors && !row.price ? "text-red-500" : "text-black"} ${!row.price ? "placeholder:text-gray-400" : ""} `}
                      >
                        {row.price ? stockValue?.currency?.symbol || "" : ""}
                      </p>
                    </td>
                    <td className="text-right py-2 px-4 w-[12%] ">
                      <div className="flex item-center gap-1">
                        <input
                          type="text"
                          required
                          className="w-full  rounded-sm focus:outline-none  text-right px-2 py-1 text-black text-[13px]"
                          placeholder="0,00 kr"
                          value={
                            row.total
                              ? displayCurrency(row.total, stockValue?.currency)
                              : ""
                          }
                        />
                        <p className=" text-[13px] pt-[7px]"></p>
                      </div>
                    </td>
                    <td className="text-center py-2 px-4">
                      <button
                        className="cursor-pointer  p-3 rounded-[50%]  hover:bg-green-100"
                        onClick={() => handleDeleteRow(index)}
                      >
                        <RiDeleteBin6Line size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="absolute bottom-6  border-t border-gray-200 pt-4  flex justify-between w-full px-12 ">
            <button
              onClick={() => {
                if (hasData) {
                  setCloseModal(true);
                  setErrors("");
                } else {
                  onClose();
                  setErrors("");
                }
              }}
              className="    border-1 border-gray-300 text-[#6b6b6f] px-4 py-1 rounded hover:border-1 hover:border-gray-500"
            >
              Cancel
            </button>

            {errors ? (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded relative flex items-center gap-2">
                <span>
                  <MdErrorOutline size={20} className="text-red-500" />
                </span>
                <p className="error">{errors}</p>
              </div>
            ) : submitItemsError ? (
              <p className="error px-4 py-2">
                Not added product, please try again
              </p>
            ) : (
              <div /> // empty placeholder to keep layout
            )}
            <button
              onClick={handleSubmit}
              disabled={addItemLoading}
              className={`text-white font-semibold px-4 py-2 rounded-md ${
                addItemLoading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-[#23a956] hover:bg-green-600 cursor-pointer"
              }`}
            >
              {addItemLoading ? "Adding..." : `Add items to ${matchName}`}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={closeModal}
        onClose={() => setCloseModal(false)}
        className="z-50 w-[700px] h-[400px] "
      >
        <AddItemCloseModal
          onConfirm={() => {
            setRows([
              {
                id: "0",
                product: null,
                quantity: "",
                unit: null,
                price: "",
                total: "",
              },
            ]);
            setCloseModal(false);
            onClose();
          }}
          onCancel={() => setCloseModal(false)}
          matchName={matchName}
        />
      </Modal>

      <Modal
        isOpen={importModal}
        onClose={() => setImportModal(false)}
        className="z-50 w-[800px] h-[700px] "
      >
        <ImportItemModal
          onClose={() => setImportModal(false)}
          isOpen={importModal}
          onImportSuccess={handleImportSuccess}
          setRows={setRows}
          onConfirm={() => {
            setImportModal(false);
            setRows([
              {
                id: "0",
                product: null,
                quantity: "",
                unit: null,
                price: "",

                total: "",
              },
            ]);
          }}
        />
      </Modal>
    </>
  );
}
