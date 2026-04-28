import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setInventoryId } from "../../slices/InventorySlice";
import { components } from "react-select";
import checked from "/check.png";
import HeaderSkeleton from "./Skeleton/HeaderSkeleton";
import { set } from "date-fns";
import { Skeleton } from "boneyard-js/react";
// import './bones/registry'

export default function Header() {
  const navigate = useNavigate();
  const inventoryList = useSelector((state) => state.inventoryId.inventoryList);
  const inventoryLoading = useSelector((state) => state.inventoryId.loading);
  const inventoryError = useSelector((state) => state.inventoryId.error);
  const selectedInventoryId = useSelector(
    (state) => state.inventoryId.inventoryId,
  );
  const options = (inventoryList || []).map((inv) => ({
    value: inv.id,
    label: inv.name,
  }));

  const groupedOptions = [
    {
      label: "Your can edit",
      options: (inventoryList || [])
        .filter((inv) => inv.permission === "Editor")
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

          {/* <input
            type="checkbox"
            checked={isSelected}
            readOnly
            className="w-4 h-4 accent-green-500 accent-none"
          /> */}
          {isSelected && (
            <img src={checked} alt="Checked" className="w-3 h-3" />
          )}
        </div>
      </components.Option>
    );
  };

  const dispatch = useDispatch();
  //   useEffect(() => {
  //   if(inventoryLoading){
  //     return <HeaderSkeleton />
  //   }
  // }, [inventoryLoading , setInventoryId]);

  return (
    <Skeleton name="Header" loading={inventoryLoading}>
      <div className="px-10  border-b-1 border-gray-200">
        <nav className="bg-white h-20 flex justify-between items-center  text-sm ">
          <div className="flex item-centere ">
            <div
              className="flex items-center gap-3 cursor-pointer "
              onClick={() => navigate("/analytics")}
            >
              <div className="text-[#a6a6a9] pr-1">Analytics /</div>
            </div>
            <div className="flex item-center ">
              <div>
                {" "}
                {
                  inventoryList.find((inv) => inv.id === selectedInventoryId)
                    ?.name
                }{" "}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <Select
              className="w-[350px]"
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
                  : options.find(
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
                  //  dim while loading
                  ...base,
                  opacity: inventoryLoading ? 0.6 : 1,
                }),
              }}
            />
            {inventoryError && (
              <span className="text-red-500 text-sm">
                {"Failed to load inventories. Please try again."}
              </span>
            )}
          </div>
        </nav>
      </div>
    </Skeleton>
  );
}
