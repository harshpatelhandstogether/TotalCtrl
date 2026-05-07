import React, { useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import DatePicker from "../UI/DatePicker";
import { useState } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import { useApi } from "../../hooks/useApi";
import { mostWasteItem } from "../../services/AnalyticsDetail/FoodWaste/mostWasteItem";
import { useSelector } from "react-redux";
import { displayCurrency } from "../../utils/formatCurrency";
import { useNavigate } from "react-router-dom";
import { setActiveTab } from "../../slices/AnalyticSlice";
import { useDispatch } from "react-redux";
import MostWasteDetailSkeleton from "./Skeleton/MostWasteDetailSkeleton";
import { setFoodRange } from "../../slices/AnalyticSlice";
import { format } from "date-fns";


export default function MostWasteDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inventoryId = useSelector((state) => state.inventoryId.inventoryId);
  const foodRange = useSelector((state) => state.analytic.byKey["foodrange"]);

  const DATE_FORMAT = "yyyy-MM-dd";

  const startDate =
    foodRange?.startDate ?? format(startOfMonth(new Date()), DATE_FORMAT);
  const endDate =
    foodRange?.endDate ?? format(endOfMonth(new Date()), DATE_FORMAT);

  const parsedRange = {
    ...foodRange,
    startDate: startDate,
    endDate: endDate,
  };
  const {
    data: mostWasteData,
    loading: mostWasteLoading,
    refetch: refetchMostWasteData,
  } = useApi(() => mostWasteItem(inventoryId, startDate, endDate), [inventoryId, startDate, endDate]);
  console.log("Most waste item data in MostWasteDetail:", mostWasteData);

  // useEffect(() => {
  //   refetchMostWasteData();
  // }, [foodRange]);

  if (mostWasteLoading) {
    return <MostWasteDetailSkeleton />;
  }

  return (
    <div>
      <div className="mx-12 flex item-center justify-start py-5 cursor-pointer border-b border-[#e5e7eb] ">
        <div
          className="flex items-center gap-2 text-sm text-[#228e50] font-medium"
          onClick={() => {
            dispatch(setActiveTab("Food Waste"));
            navigate("/analytics-detail");
          }}
        >
          <span>
            <FaAngleLeft size={14} />
          </span>
          <h1>Back to full report of Food Waste</h1>
        </div>
      </div>
      <div className="mx-12 mt-10 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Top most wasted items</h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-[6px] border border-gray-300 rounded-md text-sm font-semibold ">
            Export Data
          </button>

          {/* <DatePicker
            value={foodRange}
            onChange={(newRange) => dispatch(setFoodRange(newRange))}
            className=" py-2"
          /> */}
          <DatePicker
            value={parsedRange}
            onChange={(newRange) =>
              dispatch(
                setFoodRange({
                  key: "foodrange",
                  startDate: format(newRange.startDate, "yyyy-MM-dd"),
                  endDate: format(newRange.endDate, "yyyy-MM-dd"),
                }),
              )
            }
          />
        </div>
      </div>

      <div className="mx-12 mt-6  bg-[#f8f9fa]   rounded-md shadow-md border border-[#e5e7eb]">
        <div className=" border-b border-gray-300  ">
          <div className="mx-10">
            <table className="w-full text-left border-collapse">
              <tr className="text-[#737373] ">
                <th className="text-sm font-medium py-3 w-[70%]">Item Name</th>
                <th className="text-right text-sm font-medium w-[15%] pr-4">
                  Amount
                </th>
                <th className="text-right text-sm font-medium w-[15%] pr-4">
                  Value
                </th>
              </tr>
            </table>
          </div>
        </div>
        <div className=" bg-white  overflow-x-auto overflow-y-auto overscroll-auto  h-[500px] border-t-0 border-b-0 rounded-b-lg">
          <div className="mx-10  ">
            <table className="w-full text-left border-collapse">
              {Array.isArray(mostWasteData?.products) &&
                mostWasteData?.products.map((item) => (
                  <tr
                    className="border-b border-gray-300 nth-last-1:border-b-0 text-sm"
                    key={item.id}
                  >
                    <td className="py-8  w-[70%]">{item.name}</td>
                    <td className="py-4  text-right w-[15%]">
                      {item.totalWasteQty}{" "}
                      {item.totalWasteQty > 1
                        ? `${item.stockTakingUnitPlural}s`
                        : `${item.stockTakingUnit}`}
                    </td>
                    <td className="py-4 text-right w-[15%]">
                      {displayCurrency(
                        item.totalWasteValue,
                        mostWasteData?.currency,
                      )}
                    </td>
                  </tr>
                ))}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
