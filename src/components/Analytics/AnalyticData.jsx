import React, { useState, useRef, useEffect } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useApi } from "../../hooks/useApi";
import { fetchInventoryTotal } from "../../services/Analytics/InventoryTotal";
import { displayCurrency } from "../../utils/formatCurrency";
import { fetchTotalFoodUsage } from "../../services/Analytics/totalFoodUsage";
import { getTotalPurchase } from "../../services/Analytics/totalPurchase";
import {
  DateRangePicker,
  defaultStaticRanges,
  createStaticRanges,
} from "react-date-range";
import {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subYears,
  subMonths,
} from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./datepicker.css";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { it } from "date-fns/locale";
import { useNavigate , NavLink} from "react-router-dom";
import InventoryDataSkeleton from "./Skeleton/InventoryDataSkeleton";
import FoodUsageSkeleton from "./Skeleton/FoodUsageSkeleton";
import PurchaseSkeleton from "./Skeleton/PurchaseSkeleton";
import { useDispatch } from "react-redux";
import { setInventoryId } from "../../slices/InventorySlice";
import { setActiveTab } from "../../slices/AnalyticSlice";

export default function AnalyticData() {
  const [showFoodPicker, setShowFoodPicker] = useState(false);
  const [showPurchasePicker, setShowPurchasePicker] = useState(false);
  const dispatch = useDispatch();
  const handleViewDetailsClick = (inventoryId) => {
    dispatch(setInventoryId(inventoryId));
    dispatch(setActiveTab("Inventory Stats"));
    navigate("/analytics-detail");
  };
  const navigate = useNavigate();

  const customStaticRanges = createStaticRanges([
    {
      label: "Today",
      range: () => ({
        startDate: new Date(),
        endDate: new Date(),
      }),
    },
    {
      label: "Yesterday",
      range: () => ({
        startDate: new Date(new Date().setDate(new Date().getDate() - 1)),
        endDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      }),
    },
    {
      label: "This Week",
      range: () => ({
        startDate: new Date(
          new Date().setDate(new Date().getDate() - new Date().getDay()),
        ),
        endDate: new Date(),
      }),
    },
    {
      label: "Last Week",
      range: () => ({
        startDate: new Date(
          new Date().setDate(new Date().getDate() - new Date().getDay() - 7),
        ),
        endDate: new Date(
          new Date().setDate(new Date().getDate() - new Date().getDay() - 1),
        ),
      }),
    },
    {
      label: "This Month",
      range: () => ({
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
      }),
    },
    {
      label: "Last Month",
      range: () => ({
        startDate: startOfMonth(subMonths(new Date(), 1)),
        endDate: endOfMonth(subMonths(new Date(), 1)),
      }),
    },
    {
      label: "This Year", // ← adds full current year range
      range: () => ({
        startDate: startOfYear(new Date()),
        endDate: endOfYear(new Date()),
      }),
    },
    {
      label: "Last Year", // ← adds full last year range
      range: () => ({
        startDate: startOfYear(subYears(new Date(), 1)),
        endDate: endOfYear(subYears(new Date(), 1)),
      }),
    },
  ]);

  const [foodRange, setFoodRange] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: "selection",
    },
  ]);
  const [purchaseRange, setPurchaseRange] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: "selection",
    },
  ]);

  // Temp ranges (before Apply is clicked)
  const [tempFoodRange, setTempFoodRange] = useState(foodRange);
  const [tempPurchaseRange, setTempPurchaseRange] = useState(purchaseRange);

  const getLabelForRange = (range) => {
    const matched = defaultStaticRanges.find((r) => r.isSelected(range[0]));
    return matched
      ? matched.label
      : `${range[0].startDate.toLocaleDateString()} - ${range[0].endDate.toLocaleDateString()}`;
  };

  const {
    data: inventoryTotal = [],
    error: inventoryTotalError,
    loading: inventoryTotalLoading,
  } = useApi(() => fetchInventoryTotal(), []);
  const inventoryItems = Array.isArray(inventoryTotal?.inventoryValue)
    ? inventoryTotal.inventoryValue
    : [];
    console.log("Inventory total data:", inventoryTotal); // Debug log
  const currency = inventoryTotal?.currency || "";

  const {
    data: totalFoodUsage,
    error: totalFoodUsageError,
    loading: totalFoodUsageLoading,
    refetch: refetchFoodUsage,
  } = useApi(
    () => fetchTotalFoodUsage(foodRange[0].startDate, foodRange[0].endDate),
    [],
    { immediate: false },
  );
  
  useEffect(() => {
    refetchFoodUsage();
   
  }, [foodRange]);
  
  const totalFoodUsageItems = Array.isArray(totalFoodUsage?.foodUsage)
  ? totalFoodUsage?.foodUsage
  : [];
  
  const {
    data: totalPurchase,
    loading: totalPurchaseLoading,
    error: totalPurchaseError,
    refetch: refetchTotalPurchase,
  } = useApi(() => getTotalPurchase(purchaseRange[0].startDate, purchaseRange[0].endDate), [], { immediate: false });

  useEffect(() => {
    refetchTotalPurchase();
  }, [purchaseRange]);


  const totalPurchaseItems = Array.isArray(totalPurchase?.purchaseValue)
  ? totalPurchase?.purchaseValue
  : [];

  const isPurchaseExportDisabled =
    totalPurchaseLoading ||
    !!totalPurchaseError ||
    !totalPurchaseItems.some((item) => Number(item?.totalPurchases) >= 1);

  const isFoodExportDisabled =
    totalFoodUsageLoading ||
    !!totalFoodUsageError ||
    !totalFoodUsageItems.some(
      (item) => Number(item?.totalCheckoutValue) >= 1,
    );
  
  return (
    <div className="overflow-y-auto overscroll-auto h-[calc(100vh-80px)]">
      <div className="mx-12 mt-10">
        {/* Banner */}
        <div className="bg-[#f2f1ff] py-4 px-6 rounded-lg mb-10">
          <h1 className="text-[#362a96] font-semibold">
            Using Lightspeed POS to track your sales?
            <a href="#" className="underline">
              {" "}
              Connect it to TotalCtrl
            </a>{" "}
            to automatically calculate the food cost percentage for each day and
            compare its historic values to help you optimize your restaurant's
            performance.
          </h1>
          <div className="mt-4">
            <button className="bg-[#23a956] text-white px-4 py-2 rounded font-semibold text-sm">
              Connect Lightspeed to TotalCtrl
            </button>
          </div>
        </div>

        {/* Real time inventory value */}
        <div className="filter flex items-center justify-between mb-4">
          <div className="font-semibold text-xl">Real time inventory value</div>
          <div className="flex items-center gap-15">
            <div className="text-[#bababc] text-sm">
              Last updated on Invalid date
            </div>
            <div className="border border-gray-300 rounded-md px-4 py-[6px]">
              <button className="text-sm font-semibold">Export Data</button>
            </div>
          </div>
        </div>

        <div className="shadow-lg border border-[#e7e7ec] rounded-lg h-full mt-10">
          {inventoryTotalLoading && (
            <InventoryDataSkeleton col={4} />
          )}
          {inventoryTotalError && (
            <div className="p-6 text-sm text-red-600">
              Failed to load inventory values.
            </div>
          )}
          {!inventoryTotalLoading &&
            !inventoryTotalError &&
            inventoryItems.map((item) => (
              <div
                className="inline-block pl-15 w-[25%] pr-2 py-10 border border-[#e7e7ec]"
                key={item.id}
              >
                <h1 className="text-lg font-semibold">{item.name}</h1>
                <h1 className="text-3xl font-semibold pt-5">
                  {displayCurrency(Math.round(item.total), currency)}
                </h1>
                <p className="text-xs text-gray-600 py-2">
                  {item.totalInventoryPercentage}% of total inventories value
                </p>
                <div className="w-[70%] bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-[#66c888] h-1.5 rounded-full"
                    style={{
                      width: `${item.totalInventoryPercentage < 0.1 ? 0.1 : item.totalInventoryPercentage}%`,
                    }}
                  ></div>
                </div>
                <div className={`text-[#208e4e] pt-10  font-semibold ${Number(item?.total) < 1 ? 'cursor-not-allowed  opacity-50' : 'cursor-pointer'}`} disabled={Number(item?.total) < 1} onClick={() => handleViewDetailsClick(item.inventoryId)}>
                  View details{" "}
                  <MdOutlineKeyboardArrowRight size={20} className="inline" />
                </div>
              </div>
            ))}
        </div>

        {/* Food Usage */}
        <div className="mt-25">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-semibold">Food usage</div>
            <div className="flex items-center gap-5">
              <div className=" rounded-md px-4 py-1">
                <button disabled={isFoodExportDisabled}
                className={`border border-gray-300 rounded-md px-4 py-[6px] text-sm font-semibold transition-colors ${
                  isFoodExportDisabled
                    ? "bg-white text-[#ebecef] cursor-not-allowed  border border-[rgb(251, 251, 251)]"
                    : "hover:bg-gray-100"
                }`}>
                  Export Data
                </button>
              </div>
              {/* Date Picker Button */}
              <div className="relative">
                <div
                  className="border border-gray-300 rounded-md px-4 py-[6px] item-center flex gap-14"
                  onClick={() => {
                    setTempFoodRange(foodRange);
                    setShowFoodPicker((prev) => !prev);
                  }}
                >
                  <button className="text-sm font-normal cursor-pointer">
                    {getLabelForRange(foodRange)}
                  </button>
                  {!showFoodPicker ? (
                    <button className="cursor-pointer ">
                      <FaAngleDown className="text-[#abb1c1]" />
                    </button>
                  ) : (
                    <button className="cursor-pointer ">
                      <RxCross1 size={15} className="text-black" />
                    </button>
                  )}
                </div>
                {showFoodPicker && (
                  <div className="absolute right-0 z-50 mt-2 shadow-xl rounded-lg overflow-hidden border border-gray-200">
                    <DateRangePicker
                      ranges={tempFoodRange}
                      onChange={(item) => setTempFoodRange([item.selection])}
                      months={2}
                      direction="horizontal"
                      showDateDisplay={false}
                      staticRanges={customStaticRanges}
                      inputRanges={[]}
                      datePickerClassName="datePicker"
                      navigatorRenderer={(
                        currentFocusedDate,
                        changeShownDate,
                      ) => (
                        <div className="flex items-center justify-between  py-2 z-20">
                          <button
                            onClick={() => changeShownDate(-1, "monthOffset")}
                            className="border-2 border-gray-300 rounded-md p-1 hover:bg-gray-100 h-10 w-10 cursor-pointer"
                          >
                            <MdOutlineKeyboardArrowLeft
                              size={30}
                              className="text-[#abb1c1]"
                            />
                          </button>

                          <button
                            onClick={() => changeShownDate(1, "monthOffset")}
                            className="border-2 border-gray-300 rounded-md p-1 hover:bg-gray-100 h-10 w-10 cursor-pointer"
                          >
                            <MdOutlineKeyboardArrowRight
                              size={30}
                              className="text-[#abb1c1]"
                            />
                          </button>
                        </div>
                      )}
                    />
                    <div className="flex justify-end gap-3 px-4 py-3 bg-white border-t border-gray-200">
                      <button
                        className="px-4 py-1 text-sm rounded border border-gray-300"
                        onClick={() => setShowFoodPicker(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-1 text-sm rounded bg-[#23a956] text-white font-semibold"
                        onClick={() => {
                          setFoodRange(tempFoodRange);
                          setShowFoodPicker(false);
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="shadow-lg border border-[#e7e7ec] rounded-lg h-full mt-10">
            {totalFoodUsageLoading && (
              <FoodUsageSkeleton />
            )}
            {totalFoodUsageError && (
              <div className="p-6 text-sm text-red-600">
                Failed to load total food usage.
              </div>
            )}
            {!totalFoodUsageLoading &&
              !totalFoodUsageError &&
              totalFoodUsageItems.map((totalFoodUsage) => (
                <div
                  className="inline-block p-15 w-[33.33%] border border-[#e7e7ec]"
                  key={totalFoodUsage.id}
                >
                  <h1 className="text-lg font-semibold">
                    {totalFoodUsage.name}
                  </h1>
                  <h1 className="text-3xl font-semibold pt-5">
                    {displayCurrency(
                      Math.round(totalFoodUsage.totalCheckoutValue),
                      currency,
                    )}
                  </h1>
                  <p className="text-gray-600 py-2 text-xs">
                    Total value of checked out food
                  </p>
                  <div className="flex items-center justify-between pt-10 text-sm">
                    <div>Used food ({totalFoodUsage.usagePercentage} %)</div>
                    <div>
                      {displayCurrency(
                        Math.round(totalFoodUsage.totalUseValue),
                        currency,
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-[#66c888] h-1.5 rounded-full"
                      style={{ width: `${totalFoodUsage.usagePercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between pt-10 text-sm">
                    <div>Food waste ({totalFoodUsage.wastePercentage} %)</div>
                    <div>
                      {displayCurrency(
                        Math.round(totalFoodUsage.totalWasteValue),
                        currency,
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-[#66c888] h-1.5 rounded-full"
                      style={{ width: `${totalFoodUsage.wastePercentage}%` }}
                    ></div>
                  </div>
                  <button
                    type="button"
                    disabled={Number(totalFoodUsage?.totalCheckoutValue) < 1}
                    className={`text-[#208e4e] pt-10 font-semibold ${
                      Number(totalFoodUsage?.totalCheckoutValue) < 1
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                    onClick={() => {
                      dispatch(setActiveTab("Food Usage"));
                      navigate('/analytics-detail');
                    }}
                  >
                    View details{" "}
                    <MdOutlineKeyboardArrowRight size={20} className="inline" />
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Purchases */}
        <div className="mt-25">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-semibold">Purchases</div>
            <div className="flex items-center gap-5">

              <button
                type="button"
                disabled={isPurchaseExportDisabled}
                className={`border border-gray-300 rounded-md px-4 py-[6px] text-sm font-semibold transition-colors ${
                  isPurchaseExportDisabled
                    ? "bg-white text-[#ebecef] cursor-not-allowed  border border-[rgb(251, 251, 251)]"
                    : "hover:bg-gray-100"
                }`}
              >
                Export Data
              </button>
              
              {/* Date Picker Button */}
              <div className="relative">
                <div
                  className="border border-gray-300 rounded-md px-4 py-[6px] item-center flex gap-14 cursor-pointer"
                  onClick={() => {
                    setTempPurchaseRange(purchaseRange);
                    setShowPurchasePicker((prev) => !prev);
                  }}
                >
                  <button className="text-sm font-normal cursor-pointer">
                    {getLabelForRange(purchaseRange)}
                  </button>
                  {!showPurchasePicker ? (
                    <button className="cursor-pointer ">
                      <FaAngleDown className="text-[#abb1c1]" />
                    </button>
                  ) : (
                    <button className="cursor-pointer ">
                      <RxCross1 size={15} className="text-black" />
                    </button>
                  )}
                </div>
                {showPurchasePicker && (
                  <div className="absolute right-0 z-50 mt-2 shadow-xl rounded-lg overflow-hidden border border-gray-200">
                    <DateRangePicker
                      ranges={tempPurchaseRange}
                      onChange={(item) =>
                        setTempPurchaseRange([item.selection])
                      }
                      months={2}
                      direction="horizontal"
                      showDateDisplay={false}
                      staticRanges={customStaticRanges}
                      inputRanges={[]}
                      navigatorRenderer={(
                        currentFocusedDate,
                        changeShownDate,
                      ) => (
                        <div className="flex items-center justify-between  py-2 z-20">
                          <button
                            onClick={() => changeShownDate(-1, "monthOffset")}
                            className="border-2 border-gray-300 rounded-md p-1 hover:bg-gray-100 h-10 w-10 cursor-pointer"
                          >
                            <MdOutlineKeyboardArrowLeft
                              size={30}
                              className="text-[#abb1c1]"
                            />
                          </button>

                          <button
                            onClick={() => changeShownDate(1, "monthOffset")}
                            className="border-2 border-gray-300 rounded-md p-1 hover:bg-gray-100 h-10 w-10 cursor-pointer"
                          >
                            <MdOutlineKeyboardArrowRight
                              size={30}
                              className="text-[#abb1c1]"
                            />
                          </button>
                        </div>
                      )}
                    />
                    <div className="flex justify-end gap-3 px-4 py-3 bg-white border-t border-gray-200">
                      <button
                        className="px-4 py-1 text-sm rounded border border-gray-300"
                        onClick={() => setShowPurchasePicker(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-1 text-sm rounded bg-[#23a956] text-white font-semibold"
                        onClick={() => {
                          setPurchaseRange(tempPurchaseRange);
                          setShowPurchasePicker(false);
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="shadow-lg border border-[#e7e7ec] rounded-lg h-full mt-10">
            {totalPurchaseLoading && (
              <PurchaseSkeleton  />
            )}
            {totalPurchaseError && (
              <div className="p-6 text-sm text-red-600">
                Failed to load purchase values.
              </div>
            )}
            {!totalPurchaseLoading &&
              !totalPurchaseError &&
              totalPurchaseItems.map((item) => (
                <div
                  className="inline-block pl-15 w-[25%] pr-2 py-10 border border-[#e7e7ec]"
                  key={item.id}
                >
                  <h1 className="text-lg font-semibold">{item.name}</h1>
                  <h1 className="text-3xl font-semibold pt-5">
                    {displayCurrency(Math.round(item.totalPurchases), currency)}
                  </h1>
                  <p className="text-xs text-gray-600 py-2">
                    {item.totalPurchasesPercentage.toFixed(2)}% of total inventories value
                  </p>
                  <div className="w-[70%] bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-[#66c888] h-1.5 rounded-full"
                      style={{
                        width: `${item.totalPurchasesPercentage < 0.1 ? 0.1 : item.totalPurchasesPercentage}%`,
                      }}
                    ></div>
                  </div>
                  <div className={`text-[#208e4e] pt-10  font-semibold ${Number(item?.totalPurchases) < 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`} disabled={Number(item?.totalPurchases) < 1}
                   onClick={() =>navigate('/analytics-detail')}
                  >
                    View details{" "}
                    <MdOutlineKeyboardArrowRight size={20} className="inline" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-25"></div>
      </div>
    </div>
  );
}
