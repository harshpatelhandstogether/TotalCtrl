import React from 'react'
import { FaAngleLeft } from "react-icons/fa";
import DatePicker from "../../UI/DatePicker";
import { useState } from "react";

import Skeleton,{SkeletonTheme} from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function MostWasteDetailSkeleton() {

    const [foodRange, setFoodRange] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
  return (
     <div>
      <div className="mx-12 flex item-center justify-start py-5 cursor-pointer border-b border-[#e5e7eb] ">
        <div className="flex items-center gap-2 text-sm text-[#228e50] font-medium"  >
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

          <DatePicker
            value={foodRange}
            onChange={setFoodRange}
            className=" py-2"
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
        <div className=" bg-white  overflow-x-auto overflow-y-auto overscroll-auto  h-[500px] border-t-0 border-b-0">
          <div className="mx-10  ">
            <table className="w-full text-left border-collapse">
             
                <tr className="border-b border-gray-300 nth-last-1:border-b-0 text-sm" >
                  <td className="py-8  w-[70%]"> <Skeleton width="50%" /> </td>
                  <td className="py-4  text-right w-[15%]">
                    <Skeleton width="80%" />
                  </td>
                  <td className="py-4 text-right w-[15%]">
                    <Skeleton width="80%" />    
                  </td>
                </tr>
              
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
