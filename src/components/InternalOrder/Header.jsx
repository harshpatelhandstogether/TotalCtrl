import React, { useEffect } from "react";
import Select from "react-select";
import { FaRegBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setInventoryId } from "../../slices/InventorySlice";
import { components } from "react-select";
import checked from "/check.png";
import { FiPlus } from "react-icons/fi";
import Header from "../UI/Header";
import TransferItemModal from "../Inventory/TransferItem/TransferItemModal";
import { useState } from "react";
import Modal from "../UI/Modal";
import HeaderSkeleton from "./skeleton/HeaderSkeleton";

export default function Headers({ refetchOrders }) {
  const [TransferModalOpen, setTransferModalOpen] = useState(false);
  const [mode, setMode] = useState("");
  const inventoryList = useSelector((state) => state.inventoryId.inventoryList);
  const inventoryLoading = useSelector((state) => state.inventoryId.loading);
  const inventoryError = useSelector((state) => state.inventoryId.error);
  const selectedInventoryId = useSelector(
    (state) => state.inventoryId.inventoryId,
  );
  const options = inventoryList?.map((inv) => ({
    value: inv.id,
    label: inv.name,
  }));
  const openEditModal = () => {
    setMode("edit");
    setTransferModalOpen(true);
  };
  const openAddModal = () => {
    setMode("add");
    setTransferModalOpen(true);
  };
  const groupedOptions = [
    {
      label: "Your can edit",
      options: inventoryList
        ?.filter((inv) => inv.permission === "Editor")
        .map((inv) => ({
          value: inv.id,
          label: inv.name,
        })),
    },
    {
      label: "Your can view",
      options: (inventoryList || [])
        .filter((inv) => inv.permission === "Viewer")
        .map((inv) => ({
          value: inv.id,
          label: inv.name,
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
  if (inventoryLoading) {
    return <HeaderSkeleton />;
  }

  const dispatch = useDispatch();
  return (
    <>
    
      <Header title={"Internal Orders"} className={"text-2xl"}>
        <div className="flex flex-col">
          <Select
            className="w-[300px]"
            isDisabled={inventoryError}
            options={inventoryError ? [] : groupedOptions}
            onChange={(selectedOption) => {
              if (!selectedOption) return;
              dispatch(setInventoryId(selectedOption.value));
            }}
            placeholder="Select Inventory"
            components={{
              IndicatorSeparator: () => null,
              Option: CustomOption,
            }}
            value={
              inventoryLoading
                ? null
                : options?.find(
                    (option) => option.value === selectedInventoryId,
                  )
            }
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
                width: "300px",
                borderRadius: "8px",

                // padding: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
              }),

              menuList: (base) => ({
                ...base,
                padding: "15px 0",
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
              groupHeading: (base) => ({
                ...base,
                padding: "10px 20px",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#868689",
                borderBottom: "1px solid #c5c9d2bb",
              }),
              control: (base) => ({
                //  dim while loading
                ...base,
                opacity: inventoryLoading ? 0.6 : 1,
                height: "40px",
              }),
            }}
          />
          {inventoryError && (
            <span className="text-red-500 text-sm">
              {"Failed to load inventories. Please try again."}
            </span>
          )}
        </div>

        <button
          className="flex items-center gap-2   font-medium py-2 px-8  rounded-md  cursor-pointer border-1 border-[#d7d7db] "
          onClick={() => {
            openAddModal();
          }}
        >
          <span>
            <FiPlus size={20} />
          </span>
          <span>Add Internal Order</span>
        </button>
      </Header>

      <Modal isOpen={TransferModalOpen} className="h-[950px] w-[1450px]">
        <TransferItemModal
          mode={mode || "add"}
          onClose={() => setTransferModalOpen(false)}
          refetchOrders={refetchOrders}
        />
      </Modal>
    </>
  );
}
