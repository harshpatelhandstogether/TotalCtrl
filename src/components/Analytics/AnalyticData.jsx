import React, { useState, useRef, useEffect } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useApi } from "../../hooks/useApi";
import { fetchInventoryTotal } from "../../services/Analytics/InventoryTotal";
import { displayCurrency } from "../../utils/formatCurrency";
import { fetchTotalFoodUsage } from "../../services/Analytics/totalFoodUsage";
import { getTotalPurchase } from "../../services/Analytics/totalPurchase";

import { startOfMonth, endOfMonth } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./datepicker.css";

import { useNavigate, NavLink } from "react-router-dom";
import InventoryDataSkeleton from "./Skeleton/InventoryDataSkeleton";
import FoodUsageSkeleton from "./Skeleton/FoodUsageSkeleton";
import PurchaseSkeleton from "./Skeleton/PurchaseSkeleton";
import { useDispatch } from "react-redux";
import { setInventoryId } from "../../slices/InventorySlice";
import { setActiveTab } from "../../slices/AnalyticSlice";
import DatePicker from "../UI/DatePicker";

export default function AnalyticData() {
  const dispatch = useDispatch();
  const handleViewDetailsClick = (inventoryId) => {
    dispatch(setInventoryId(inventoryId));
    dispatch(setActiveTab("Inventory Stats"));
    navigate("/analytics-detail");
  };
  const navigate = useNavigate();

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
  } = useApi(
    () =>
      getTotalPurchase(purchaseRange[0].startDate, purchaseRange[0].endDate),
    [],
    { immediate: false },
  );

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
    !totalFoodUsageItems.some((item) => Number(item?.totalCheckoutValue) >= 1);

  return (
    <div className="overflow-y-auto overscroll-auto h-[calc(100vh-80px)]">
      <div className="mx-8 mt-10">
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

        {/* Inventory grid */}
        {inventoryTotalLoading && <InventoryDataSkeleton />}
        {inventoryTotalError && (
          <div className="p-6 text-sm text-red-600">
            Failed to load inventory data.
          </div>
        )}
       
            
        <div className="grid grid-cols-4 border border-[#e7e7ec] rounded-lg overflow-hidden shadow-lg">
          {inventoryItems.map((item) => (
            <div
              key={item.id}
              className="pl-15 pr-2 py-12 border-r border-b border-[#e7e7ec] last:border-r-0"
            >
              <h1 className="text-lg font-semibold">{item.name}</h1>

              <h1 className="text-3xl font-semibold pt-5">
                {displayCurrency(Math.round(item.total), currency)}
              </h1>

              <p className="text-xs text-gray-600 py-2">
                {item.totalInventoryPercentage}% of total inventories value
              </p>

              {/* Progress bar */}
              <div className="w-[70%] bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-[#66c888] h-1.5 rounded-full"
                  style={{
                    width: `${item.totalInventoryPercentage < 0.1 ? 0.1 : item.totalInventoryPercentage}%`,
                  }}
                ></div>
              </div>

              {/* Action */}
              <div
                className={`text-[#208e4e] pt-6 font-semibold ${
                  Number(item?.total) < 1
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
                onClick={() => handleViewDetailsClick(item.inventoryId)}
              >
                View details →
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
                <button
                  disabled={isFoodExportDisabled}
                  className={`border border-gray-300 rounded-md px-4 py-[6px] text-sm font-semibold transition-colors ${
                    isFoodExportDisabled
                      ? "bg-white text-[#ebecef] cursor-not-allowed  border border-[rgb(251, 251, 251)]"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Export Data
                </button>
              </div>
              {/* Date Picker Button */}

              <DatePicker value={foodRange} onChange={setFoodRange} />
            </div>
          </div>

          <div className="shadow-lg grid grid-cols-3 border border-[#e7e7ec] rounded-lg overflow-hidden   mt-10">
            {totalFoodUsageLoading && <FoodUsageSkeleton />}
            {totalFoodUsageError && (
              <div className="p-6 text-sm text-red-600">
                Failed to load total food usage.
              </div>
            )}
            {!totalFoodUsageLoading &&
              !totalFoodUsageError &&
              totalFoodUsageItems.map((totalFoodUsage) => (
                <div
                  className="inline-block p-15  border-r border-b border-[#e7e7ec] last:border-r-0"
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
                      navigate("/analytics-detail");
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

              <DatePicker value={purchaseRange} onChange={setPurchaseRange} />
            </div>
          </div>

          <div className="shadow-lg grid grid-cols-4 border border-[#e7e7ec] rounded-lg overflow-hidden mt-10">
            {totalPurchaseLoading && <PurchaseSkeleton />}
            {totalPurchaseError && (
              <div className="p-6 text-sm text-red-600">
                Failed to load purchase values.
              </div>
            )}
            {!totalPurchaseLoading &&
              !totalPurchaseError &&
              totalPurchaseItems.map((item) => (
                <div
                  className="inline-block pl-15 pr-2 py-12 border-r border-b border-[#e7e7ec] last:border-r-0"
                  key={item.id}
                >
                  <h1 className="text-lg font-semibold">{item.name}</h1>
                  <h1 className="text-3xl font-semibold pt-5">
                    {displayCurrency(Math.round(item.totalPurchases), currency)}
                  </h1>
                  <p className="text-xs text-gray-600 py-2">
                    {item.totalPurchasesPercentage.toFixed(2)}% of total
                    inventories value
                  </p>
                  <div className="w-[70%] bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-[#66c888] h-1.5 rounded-full"
                      style={{
                        width: `${item.totalPurchasesPercentage < 0.1 ? 0.1 : item.totalPurchasesPercentage}%`,
                      }}
                    ></div>
                  </div>
                  <div
                    className={`text-[#208e4e] pt-10  font-semibold ${Number(item?.totalPurchases) < 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                    disabled={Number(item?.totalPurchases) < 1}
                    onClick={() => navigate("/analytics-detail")}
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
