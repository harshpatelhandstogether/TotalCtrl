import React, { useEffect } from "react";
import DatePicker from "../UI/DatePicker";
import { useState } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import ProgressBar from "../UI/ProgressBar";
import { totalFoodWaste } from "../../services/AnalyticsDetail/FoodWaste/totalFoodWaste";
import { useApi } from "../../hooks/useApi";
import { useSelector } from "react-redux";
import { displayCurrency } from "../../utils/formatCurrency";
import { foodWasteByCause } from "../../services/AnalyticsDetail/FoodWaste/foodWasteByCause";
import { mostWasteItem } from "../../services/AnalyticsDetail/FoodWaste/mostWasteItem";
import { foodWasteByCategory } from "../../services/AnalyticsDetail/FoodWaste/foodWasteByCategory";
import { FaAngleRight } from "react-icons/fa6";
import Chart from "../UI/Chart";
import { foodWasteOverview } from "../../services/AnalyticsDetail/FoodWaste/foodWasteOverview";

export default function FoodWasteTab() {
  const inventoryId = useSelector((state) => state.inventoryId.inventoryId);
  const [foodRange, setFoodRange] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: "selection",
    },
  ]);

  const {
    data: foodWasteData,
    loading: foodWasteLoading,
    refetch: refetchFoodWaste,
  } = useApi(() =>
    totalFoodWaste(inventoryId, foodRange[0].startDate, foodRange[0].endDate),
  );
  console.log("Food waste data:", foodWasteData);

  const {
    data: foodWasteByCauseData,
    loading: foodWasteByCauseLoading,
    refetch: refetchFoodWasteByCause,
  } = useApi(() =>
    foodWasteByCause(inventoryId, foodRange[0].startDate, foodRange[0].endDate),
  );
  console.log("Food waste by cause data:", foodWasteByCauseData);

  const {
    data: mostWasteItemData,
    loading: mostWasteItemLoading,
    refetch: refetchMostWasteItem,
  } = useApi(() =>
    mostWasteItem(inventoryId, foodRange[0].startDate, foodRange[0].endDate),
  );
  console.log("Most waste item data:", mostWasteItemData);

  const {
    data: foodWasteByCategoryData,
    loading: foodWasteByCategoryLoading,
    refetch: refetchFoodWasteByCategory,
  } = useApi(() =>
    foodWasteByCategory(
      inventoryId,
      foodRange[0].startDate,
      foodRange[0].endDate,
    ),
  );
  console.log("Food waste by category data:", foodWasteByCategoryData);

  const { data: foodWasteOverviewData, refetch: refetchFoodWasteOverview } =
    useApi(() =>
      foodWasteOverview(
        inventoryId,
        foodRange[0].startDate,
        foodRange[0].endDate,
        foodRange,
      ),
    );
  console.log("Food waste overview data:", foodWasteOverviewData);

  useEffect(() => {
    refetchFoodWaste();
    refetchFoodWasteByCause();
    refetchMostWasteItem();
    refetchFoodWasteByCategory();
    refetchFoodWasteOverview();
  }, [foodRange, inventoryId]);

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
              foodWasteData?.foodWaste?.[0]?.totalWasteValue || 0,
              foodWasteData?.currency,
            )}
          </h1>
          <div className="my-8">
            <ProgressBar
              width={`${foodWasteData?.foodWaste?.[0]?.totalWastePercentage || 0}%`}
              className="h-2 w-[60%] "
            />
          </div>
          <div className="text-sm ">
            = {foodWasteData?.foodWaste?.[0]?.totalWastePercentage || 0} % of
            all checked-out food
          </div>
        </div>
        <div className="w-[50%] mt-8">
          <div className="text-xl font-semibold mb-3 ">Food waste by cause</div>
          {Array.isArray(foodWasteByCauseData?.cause) &&
            foodWasteByCauseData?.cause?.map((item, index) => (
              <div className="my-6">
                <div className="flex item-center justify-between w-[80%] mb-3 text-sm">
                  <span>
                    {item.name} ({item.foodWastePercentage || 0}%)
                  </span>
                  <span>
                    {displayCurrency(
                      item.foodWasteValue,
                      foodWasteData?.currency,
                    )}
                  </span>
                </div>
                <ProgressBar
                  width={`${item.foodWastePercentage || 0}%`}
                  className={`h-1.5 w-[80%] `}
                  color={item?.displayColor}
                />
              </div>
            ))}
        </div>
      </div>

      <div className="mx-12 mt-15 flex">
        <div className="w-[50%]">
          <span className="text-lg font-semibold">Top most wasted items</span>
          <div className="my-8 w-[10px] border-b border-[#e5e7eb] w-[80%]"></div>
          <div className="w-[80%]">
            
              <table className="w-full text-left mt-4">
                {mostWasteItemData?.products?.slice(0, 4).map((item, index) => (
                  <tr className="text-sm" key={index}>
                    <td className="py-3">{item.name}</td>
                    <td>
                      {item.totalWasteQty}
                      {item.totalWasteQty > 1
                        ? ` ${item.stockTakingUnitPlural}`
                        : `${item.stockTakingUnit}`}
                    </td>
                    <td className="text-right">
                      {displayCurrency(
                        item.totalWasteValue,
                        foodWasteData?.currency,
                      )}
                    </td>
                  </tr>
                ))}
              </table>
            
              { mostWasteItemData?.products?.length === 0 && (
                <div className="py-10">
                  <div className="text-xl font-semibold text-center">
                    No Wasted Items
                  </div>
                  <div className="text-sm text-gray-500 text-center">
                    No wasted items found for the selected period.
                </div>
              </div>)}
            
          </div>
          <div className="my-8 w-[10px] border-b border-[#e5e7eb] w-[80%]"></div>
          <div className={`flex gap-1`}>
            <a
              href="#"
              className={`text-[#208e4e] ${mostWasteItemData?.products > 0 ? "" : "cursor-not-allowed opacity-50"}`}
              disabled={mostWasteItemData?.products > 0 ? false : true}
            >
              See all wasted items
            </a>
            <span
              className={`pt-1.5 ${mostWasteItemData?.products > 0 ? "" : "cursor-not-allowed opacity-50"}`}
              disabled={mostWasteItemData?.products > 0 ? false : true}
            >
              <FaAngleRight size={14} color="#208e4e" />
            </span>
          </div>
        </div>
        <div className="w-[50%]">
          <span className="text-lg font-semibold">Food waste by category</span>
          {Array.isArray(foodWasteByCategoryData?.categories) &&
            foodWasteByCategoryData?.categories
              ?.slice(0, 4)
              .map((item, index) => (
                <div className="my-6">
                  <div className="flex item-center justify-between w-[80%] mb-3 text-sm">
                    <span>
                      {item.name} ({item.totalWastePercentage || 0}%)
                    </span>
                    <span>
                      {displayCurrency(
                        item.totalWasteValue,
                        foodWasteData?.currency,
                      )}
                    </span>
                  </div>
                  <ProgressBar
                    width={`${item.totalWastePercentage || 0}%`}
                    className={`h-1.5 w-[80%] `}
                  />
                </div>
              ))}
          <div className="flex gap-1 mt-14">
            <a href="#" className="text-[#208e4e] ">
              See all categories
            </a>
            <span className="pt-1.5">
              <FaAngleRight size={14} color="#208e4e" />
            </span>
          </div>
        </div>
      </div>

      <div className="mx-12 mt-15">
        <div className="flex item-center justify-between">
          <h1 className="text-lg font-semibold">Overview of wasted food</h1>
          <div>
            <DatePicker value={foodRange} onChange={setFoodRange} />
          </div>
        </div>
        <div>
          <Chart apiResponse={foodWasteOverviewData} />
        </div>
      </div>
    </div>
  );
}
