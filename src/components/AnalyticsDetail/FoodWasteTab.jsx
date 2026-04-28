import React from "react";
import DatePicker from "../UI/DatePicker";
import { useState } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import ProgressBar from "../UI/ProgressBar";
import { totalFoodWaste } from "../../services/AnalyticsDetail/FoodWaste/totalFoodWaste";
import { useApi } from "../../hooks/useApi";
import { useSelector } from "react-redux";
import { displayCurrency } from "../../utils/formatCurrency";

export default function FoodWasteTab() {
  const inventoryId = useSelector((state) => state.inventoryId.inventoryId);
  const [foodRange, setFoodRange] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: "selection",
    },
  ]);

  const { data: foodWasteData } = useApi(
    () =>
      totalFoodWaste(inventoryId, foodRange[0].startDate, foodRange[0].endDate),
    [inventoryId, foodRange],
  );
  console.log("Food waste data:", foodWasteData);

  return (
    <div className="">
      <div className="flex items-center justify-between py-6 px-12">
        <h1 className="text-xl font-semibold">Food Waste</h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-[6px] border border-gray-300 rounded-md text-sm font-semibold ">
            Export Data
          </button>

          <DatePicker
            value={foodRange}
            onChange={setFoodRange}
            className=" py-2"
          />
        </div>
      </div>
      <div className="px-12 flex ">
        <div className="mt-10 w-[50%]">
          <div className="text-lg font-medium">Total value of wasted food</div>
          <h1 className="text-6xl font-semibold pt-5">
            {displayCurrency(
              foodWasteData?.foodWaste?.[0]?.totalWasteValue,
              foodWasteData?.currency,
            )}
          </h1>
          <div className="my-8">
            <ProgressBar width="70%" className="h-2 w-[60%] " />
          </div>
          <div className="text-sm ">
            = {foodWasteData?.foodWaste?.[0]?.totalWastePercentage}% of all
            checked-out food
          </div>
        </div>
        <div className="w-[50%] mt-8">
          <div className="text-xl font-semibold mb-3 ">Food waste by cause</div>
          <div className="my-6">
            <div className="flex item-center justify-between w-[80%] mb-3 text-sm">
              <span>Expiration (10%)</span>
              <span>0,49 kr</span>
            </div>
            <ProgressBar width="10%" className="h-1 w-[80%] " />
          </div>
          <div className="my-6">
            <div className="flex item-center justify-between w-[80%] mb-3 mt-6">
              <span>Expiration (10%)</span>
              <span>0,49 kr</span>
            </div>
            <ProgressBar width="10%" className="h-1 w-[80%] bg-[#6053d2]" />
          </div>
          <div className="my-6">
            <div className="flex item-center justify-between w-[80%] mb-3 mt-6">
              <span>Expiration (10%)</span>
              <span>0,49 kr</span>
            </div>
            <ProgressBar width="10%" className="h-1 w-[80%] " />
          </div>
          <div className="my-6">
            <div className="flex item-center justify-between w-[80%] mb-3 mt-6">
              <span>Expiration (10%)</span>
              <span>0,49 kr</span>
            </div>
            <ProgressBar width="10%" className="h-1 w-[80%] " />
          </div>
        </div>
      </div>

      <div className="mx-12">
        <div className="w-[50%]">
          <span className="text-lg font-semibold">Top most wasted items</span>
          <div className="my-8 w-[10px] border-b border-[#e5e7eb] w-[80%]"></div>
          <div className="w-[80%]">
            <table className="w-full text-left mt-4">
              <tr className="text-sm">
                <td>1 L LETTMELK 0,5%</td>
                <td>0.01 Baskets</td>
                <td className="text-right">0,49 kr</td>
              </tr>
            </table>
          </div>
          <div className="my-8 w-[10px] border-b border-[#e5e7eb] w-[80%]"></div>
        </div>
      </div>
    </div>
  );
}
