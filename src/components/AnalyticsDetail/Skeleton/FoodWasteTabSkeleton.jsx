import React from "react";
import DatePicker from "../../UI/DatePicker";
import ProgressBar from "../../UI/ProgressBar";
import { FaAngleRight } from "react-icons/fa6";
import Chart from "../../UI/Chart";
import { displayCurrency } from "../../../utils/formatCurrency";
import Skeleton,{SkeletonTheme} from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { startOfMonth, endOfMonth } from "date-fns";
import { useState } from "react";

export default function FoodWasteTab() {
  const [foodRange, setFoodRange] = useState([
      {
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
        key: "selection",
      },
    ]);
  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
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
            <Skeleton width={200} height={60} />
          </h1>
          <div className="my-8">
            <Skeleton width={"60%"} height={20} />
          </div>
          <div className="text-sm ">
            <Skeleton width={250} height={15} />
          </div>
        </div>
        <div className="w-[50%] mt-8">
          <div className="text-xl font-semibold mb-3 ">Food waste by cause</div>
          {[1, 2, 3, 4].map((item) => (
              <div className="my-6">
                <div className="flex item-center justify-between w-[80%] mb-3 text-sm">
                  <span>
                    <Skeleton width={150} height={20} />
                  </span>
                  <span>
                    <Skeleton width={100} height={20} />
                    
                  </span>
                </div>
                <Skeleton width={"80%"} height={15} />
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
               {[1, 2, 3, 4].map((item) => (
                <tr className="text-sm" >
                  <td className="py-3"><Skeleton width={150} height={20} /></td>
                  <td>
                    <Skeleton width={100} height={20} />
                    
                  </td>
                  <td className="text-right">
                    <Skeleton width={80} height={20} />
                  </td>
                </tr>
              ))}
            </table>

            
          </div>
          <div className="my-8 w-[10px] border-b border-[#e5e7eb] w-[80%]"></div>
          <div className={`flex gap-1`}>
            <a
              href="#"
              className="text-[#208e4e] "
             >
              See all wasted items
            </a>
            <span
              className="pt-1.5"
            >
              <FaAngleRight size={14} color="#208e4e" />
            </span>
          </div>
        </div>
        <div className="w-[50%]">
          <span className="text-lg font-semibold">Food waste by category</span>
              {[1, 2, 3, 4].map((item) => (
                <div className="my-6">
                  <div className="flex item-center justify-between w-[80%] mb-3 text-sm">
                    <span>
                      <Skeleton width={150} height={20} />
                    </span>
                    <span>
                      <Skeleton width={100} height={20} />
                    </span>
                  </div>
                  <Skeleton width={"80%"} height={15} />
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
          <Chart  />
        </div>
      </div>
    </div>
    </SkeletonTheme>
  );
}
