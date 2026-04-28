import React, { use } from "react";
import Header from "../components/UI/Header";
import { useSelector } from "react-redux";
import Select, { components } from "react-select";
import checked from "/check.png";
import { useNavigate } from "react-router-dom";
import { setInventoryId } from "../slices/InventorySlice";
import { useDispatch } from "react-redux";
import { FaChevronLeft } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { fetchValueByStock } from "../services/AnalyticsDetail/InventoryStats/value-by-stock";
import { displayCurrency } from "../utils/formatCurrency";
import { fetchValueByCategory } from "../services/AnalyticsDetail/InventoryStats/value-by-category";
import { fetchCheckInValueByCategory } from "../services/AnalyticsDetail/InventoryStats/check-in";
import { fetchCheckOutValueByCategory } from "../services/AnalyticsDetail/InventoryStats/check-out";
import DatePicker from "../components/UI/DatePicker";
import { useState, useEffect } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import InventoryStatsTabSkeleton from "./InventoryStatsTabSkeleton";

export default function InventoryStatsTabPage() {
    const dispatch = useDispatch();
  const { name } = useParams();
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

  const [checkInRange, setCheckInRange] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: "selection",
    },
  ]);
  const [checkoutRange, setCheckoutRange] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: "selection",
    },
  ]);
  const {
    data: valueByStock,
    loading: valueByStockLoading,
    error: valueByStockError,
    refetch: refetchValueByStock,
  } = useApi(() => fetchValueByStock(selectedInventoryId, 20, 0));
  console.log("Value by Stock:", valueByStock);

  const {
    data: valueByCategory,
    loading: valueByCategoryLoading,
    error: valueByCategoryError,
    refetch: refetchValueByCategory,
  } = useApi(() => fetchValueByCategory(selectedInventoryId, 20, 0));
  console.log("Value by Category:", valueByCategory);

  const {
    data: checkInValueByCategory,
    loading: checkInValueByCategoryLoading,
    error: checkInValueByCategoryError,
    refetch: refetchCheckInValueByCategory,
  } = useApi(() =>
    fetchCheckInValueByCategory(
      selectedInventoryId,
      20,
      0,
      checkInRange[0].startDate,
      checkInRange[0].endDate,
    ),
  );
  console.log("checkInValueByCategory", checkInValueByCategory);

  const {
    data: checkOutValueByCategory,
    loading: checkOutValueByCategoryLoading,
    error: checkOutValueByCategoryError,
    refetch: refetchCheckOutValueByCategory,
  } = useApi(() =>
    fetchCheckOutValueByCategory(
      selectedInventoryId,
      20,
      0,
      checkoutRange[0].startDate,
      checkoutRange[0].endDate,
    ),
  );
  console.log("checkOutValueByCategory", checkOutValueByCategory);

  useEffect(() => {
    refetchValueByStock();
    refetchValueByCategory();
    refetchCheckInValueByCategory();
    refetchCheckOutValueByCategory();
    
  }, [selectedInventoryId, checkInRange, checkoutRange ]);

  if (
    inventoryLoading ||
    valueByStockLoading ||
    valueByCategoryLoading ||
    checkInValueByCategoryLoading ||
    checkOutValueByCategoryLoading
  ) {
    return <InventoryStatsTabSkeleton />;
  }
//   useEffect(() => {
//     dispatch(setInventoryId(options[0]?.value || null));
//   },[]);

  return (
    <div>
      <Header title={"Analytics"} className="text-2xl font-semibold">
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
                : options.find((option) => option.value === selectedInventoryId)
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
      </Header>
      <div>
        <nav className="bg-white py-5 flex justify-between  px-12 border-b-1 border-gray-200 ">
          <div
            className="flex items-center gap-2  cursor-pointer "
            onClick={() => navigate("/analytics-detail")}
          >
            <FaChevronLeft size={20} className="text-[#a1a1a5]" />
            <h1 className="font-source text-black text-md font-semibold">
              Inventory
            </h1>
          </div>
        </nav>
      </div>

      <div className="mx-12 py-8 flex items-center justify-between">
        {name === "byStock" && (
          <h1 className="text-xl font-semibold">Value By Supplier</h1>
        )}
        {name === "byCategory" && (
          <h1 className="text-xl font-semibold">Value by category</h1>
        )}
        {name === "byCheckInCategory" && (
          <>
            <h1 className="text-xl font-semibold">Check IN Values </h1>
            <div className="mr-20">
              <DatePicker
                value={checkInRange}
                onChange={setCheckInRange}
                className=""
              />
            </div>
          </>
        )}
        {name === "byCheckOutCategory" && (
          <>
            <h1 className="text-xl font-semibold">Check Out Values</h1>
            <div className="mr-20">
              <DatePicker
                value={checkoutRange}
                onChange={setCheckoutRange}
                className="mr-4"
              />
            </div>
          </>
        )}
      </div>
      <div className="overflow-x-auto overflow-y-auto overscroll-auto h-[calc(800px-50px)]">
        {name === "byStock" &&
          valueByStock?.map((item, index) => (
            <div className="flex mx-12 py-3 text-sm ">
              <h1 className="w-[5%] text-[#9a9eaf]">{index + 1}.</h1>
              <div className="w-[80%]">{item.name || "Not Specified"}</div>
              <div>{displayCurrency(item?.total, item?.currency)}</div>
            </div>
          ))}
        {name === "byCategory" &&
          valueByCategory?.map((item, index) => (
            <div className="flex mx-12 py-3 text-sm ">
              <h1 className="w-[5%] text-[#9a9eaf]">{index + 1}.</h1>
              <div className="w-[80%]">{item.name || "Not Specified"}</div>
              <div>{displayCurrency(item?.total, item?.currency)}</div>
            </div>
          ))}
        {name === "byCheckInCategory" &&
          checkInValueByCategory?.Data?.map((item, index) => (
            <div className="flex mx-12 py-3 text-sm ">
              <h1 className="w-[5%] text-[#9a9eaf]">{index + 1}.</h1>
              <div className="w-[80%]">{item.name || "Not Specified"}</div>
              <div>{displayCurrency(item?.total, item?.currency)}</div>
            </div>
          ))}
        {name === "byCheckOutCategory" &&
          checkOutValueByCategory?.Data?.map((item, index) => (
            <div className="flex mx-12 py-3 text-sm ">
              <h1 className="w-[5%] text-[#9a9eaf]">{index + 1}.</h1>
              <div className="w-[80%]">{item.name || "Not Specified"}</div>
              <div>{displayCurrency(item?.total, item?.currency)}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
