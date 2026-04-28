import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import {
  DateRangePicker,
  defaultStaticRanges,
  createStaticRanges,
} from "react-date-range";
import { FaAngleDown } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  subYears,
} from "date-fns";
import { useApi } from "../../hooks/useApi";
import { fetchTotalFoodUsage } from "../../services/Analytics/totalFoodUsage";
import { displayCurrency } from "../../utils/formatCurrency";
import { fetchFoodUsageProduct } from "../../services/AnalyticsDetail/FoodUsage/fetchFoodUsageProduct";

export default function FoodUsageTab({ selectedInventoryId }) {
  const [showFoodPicker, setShowFoodPicker] = useState(false);
  const [showPurchasePicker, setShowPurchasePicker] = useState(false);

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
    data: totalFoodUsage,
    loading: totalFoodUsageLoading,
    error: totalFoodUsageError,
    refetch: refetchTotalFoodUsage,
  } = useApi(fetchTotalFoodUsage, [], { immediate: false });
  console.log("Total Food Usage:", totalFoodUsage);

  const {
    data: foodUsageData,
    loading: foodUsageDataLoading,
    error: foodUsageDataError,
    refetch: refetchFoodUsageData,
  } = useApi(
    fetchFoodUsageProduct,
    [foodRange[0].startDate, foodRange[0].endDate, selectedInventoryId],
    { immediate: true },
  );

  useEffect(() => {
    if (!selectedInventoryId) return;
    refetchTotalFoodUsage(
      foodRange[0].startDate,
      foodRange[0].endDate,
      selectedInventoryId,
    );
    refetchFoodUsageData(
      foodRange[0].startDate,
      foodRange[0].endDate,
      selectedInventoryId,
    );
  }, [selectedInventoryId, foodRange, refetchTotalFoodUsage]);
  return (
    <div className="px-10 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-medium">Food usage</div>
        <div className="flex items-center gap-5">
          <div className=" rounded-md px-4 py-1">
            <button
              className={`border border-gray-300 rounded-md px-4 py-[6px] text-sm font-semibold transition-colors `}
            >
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
                  navigatorRenderer={(currentFocusedDate, changeShownDate) => (
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

      <div className="flex my-10">
        <div className="inline-block mr-15">
          <h1 className="text-sm">Total value of checked out food</h1>
          <h1 className="text-3xl font-medium mb-2">
            {displayCurrency(
              Math.round(totalFoodUsage?.allCheckoutValue || 0),
              totalFoodUsage?.currency,
            )}
          </h1>
          <div className=" bg-gray-200 rounded-full h-1.5 w-[200px]">
            <div
              className="bg-[#66c888] h-1.5 rounded-full "
              style={{
                width: `${
                  totalFoodUsage?.foodUsage?.[0]?.totalCheckoutPercentage || 0
                }%`,
              }}
            ></div>
          </div>
        </div>
        <div className="inline-block mr-15">
          <h1 className="text-sm">
            Used Food ({totalFoodUsage?.foodUsage?.[0]?.usagePercentage || 0}%)
          </h1>
          <h1 className="text-3xl font-medium mb-2">
            {displayCurrency(
              Math.round(totalFoodUsage?.foodUsage?.[0]?.totalUseValue || 0),
              totalFoodUsage?.currency,
            )}
          </h1>
          <div className=" bg-gray-200 rounded-full h-1.5 w-[200px]">
            <div
              className="bg-[#66c888] h-1.5 rounded-full"
              style={{
                width: `${totalFoodUsage?.foodUsage?.[0]?.usagePercentage || 0}%`,
              }}
            ></div>
          </div>
        </div>
        <div className="inline-block">
          <h1 className="text-sm">
            Food Waste ({totalFoodUsage?.foodUsage?.[0]?.wastePercentage || 0}%)
          </h1>
          <h1 className="text-3xl font-medium mb-2">
            {displayCurrency(
              Math.round(totalFoodUsage?.foodUsage?.[0]?.totalWasteValue || 0),
              totalFoodUsage?.currency,
            )}
          </h1>
          <div className=" bg-gray-200 rounded-full h-1.5 w-[200px]">
            <div
              className="bg-[#66c888] h-1.5 rounded-full"
              style={{
                width: `${totalFoodUsage?.foodUsage?.[0]?.wastePercentage || 0}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg border-gray-200">
        <div className="bg-[#f8f9fa] rounded-lg border-b border-gray-200">
          <table className="w-[95%] border-collapse ml-[2.5%] rounded-lg ">
            <tr className=" ">
              <th className="font-medium p-4 text-[#848484] text-sm text-left w-[35%]">
                Item Name
              </th>
              <th className="font-medium p-2 text-[#848484] text-sm text-left w-[10%]">
                Used Food
              </th>
              <th className="font-medium p-2 text-[#848484] text-sm text-left w-[10%]">
                Value
              </th>
              <th className="font-medium p-2 text-[#848484] text-sm text-left w-[10%]">
                Food Waste
              </th>
              <th className="font-medium p-2 text-[#848484] text-sm text-left w-[10%]">
                Value
              </th>
              <th className="font-medium p-2 text-[#848484] text-sm text-right w-[10%]">
                Total
              </th>
              <th className="font-medium p-2 text-[#848484] text-sm text-left w-[10%]">
                Checked Out
              </th>
            </tr>
          </table>
        </div>
        <div className="overflow-x-auto overflow-y-auto overscroll-auto h-[600px]">
          <table className="w-[95%] border-collapse ml-[2.5%] rounded-lg ">
            {foodUsageData?.products?.map((item, index) => (
              <tr className="border-b border-gray-200 nth-last-1:border-b-0" key={index}>
                <td className="p-6 text-sm text-left w-[35%]">{item.name}</td>
                <td className="p-2 text-sm text-left w-[10%]">
                  {item.totalUseQty > 1
                    ? `${item.totalUseQty} ${item.stockTakingUnitPlural}`
                    : `${item.totalUseQty} ${item.stockTakingUnit}`}
                </td>
                <td className="p-2 text-sm text-left w-[10%]">
                  {displayCurrency(
                    Math.round(item.totalUseValue || 0),
                    foodUsageData?.currency,
                  )}
                </td>
                <td className="p-2 text-sm text-left w-[10%]">
                  {item.totalWasteQty > 1
                    ? `${item.totalWasteQty} ${item.stockTakingUnitPlural}`
                    : `${item.totalWasteQty} ${item.stockTakingUnit}`}
                </td>
                <td className="p-2 text-sm text-left w-[10%]">
                  {displayCurrency(
                    Math.round(item.totalWasteValue || 0),
                    foodUsageData?.currency,
                  )}
                </td>
                <td className="p-2 text-sm text-right w-[10%]">
                  {item.totalCheckoutQty > 1
                    ? `${item.totalCheckoutQty} ${item.stockTakingUnitPlural}`
                    : `${item.totalCheckoutQty} ${item.stockTakingUnit}`}
                </td>
                <td className="p-2 text-sm text-left w-[10%]">
                  {displayCurrency(
                    Math.round(item.totalCheckoutValue || 0),
                    foodUsageData?.currency,
                  )}
                </td>
              </tr>
            ))}
            <tr>
                <div>
                    {foodUsageData?.products?.length === 0 && (
                        <div className="flex flex-col items-center gap-3 mt-20">
                            <img src="" alt="No data" className="w-32 h-32 object-contain" />
                            <h1 className=" text-2xl">No Food Usage</h1>
                            <h2 className="text-[#9e9ea1] text-lg">No food usage data available for the selected date range.</h2>
                        </div>
                    )}  
                </div>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}
