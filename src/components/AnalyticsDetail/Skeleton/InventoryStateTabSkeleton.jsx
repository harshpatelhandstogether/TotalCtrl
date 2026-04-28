import React from 'react'
import Skeleton,{SkeletonTheme} from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaAngleDown } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useState } from 'react';
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


export default function InventoryStateTabSkeleton() {

      const [showCheckInPicker, setShowCheckInPicker] = useState(false);
      const [showCheckoutPicker, setShowCheckoutPicker] = useState(false);
    //   const [tempCheckInRange, setTempCheckInRange] = useState(checkInRange);
    //   const [tempCheckoutRange, setTempCheckoutRange] = useState(checkoutRange);
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
    
      const getLabelForRange = (range) => {
        const matched = defaultStaticRanges.find((r) => r.isSelected(range[0]));
        return matched
          ? matched.label
          : `${range[0].startDate.toLocaleDateString()} - ${range[0].endDate.toLocaleDateString()}`;
      };
  return (
    <SkeletonTheme baseColor="#e6e6ed" highlightColor="#f5f5f5">
    <div className="px-10 py-10">
      <div className="header flex items-start justify-between mb-10">
        <div>
          <div className="text-xl font-semibold">Inventory</div>
          <div className="mt-8">
            <h1 className="text-sm text-[#6b6b6f]">TOTAL INVENTORY VALUE</h1>

            
              <Skeleton width={200} height={30} />
            
          </div>
        </div>
        <div>
          <div className="border border-gray-300 rounded-md px-4 py-[6px]">
            <button className="text-sm font-semibold">Export Data</button>
          </div>
        </div>
      </div>
      <div className="flex gap-10 mb-10">
        <div className="valuebysupplier w-[50%]">
          <table className="w-full border-collapse">
            <th className="py-4 px-4 text-sm text-[#595959] text-left w-[18%] font-semibold">
              <label className="text-xs text-[#adadaf] font-normal">
                VALUE BY SUPPLIER
              </label>
            </th>
            {Array(3).fill().map((_, index) => (
              <tr className="border-b border-[#e6e6ed] nth-last-1:border-b-0 cursor-pointer">
                <td>
                  <Skeleton width={100} height={20} />
                </td>
                <td className="text-right py-4 ">
                  <Skeleton width={80} height={20} />
                </td>
              </tr>
            ))}
          </table>
          
        </div>
        <div className="valuebycategory w-[50%]">
          <table className="w-full border-collapse">
            <th className="py-4 px-4 text-sm text-[#595959] text-left w-[18%] font-semibold">
              <label className="text-xs text-[#adadaf] font-normal">
                VALUE BY CATEGORY
              </label>
            </th>
            {Array(3).fill().map((_, index) => (
              <tr className="border-b border-[#e6e6ed] nth-last-1:border-b-0 cursor-pointer">
                <td>
                  <Skeleton width={100} height={20} />
                </td>
                <td className="text-right py-4 ">
                  <Skeleton width={80} height={20} />
                </td>
              </tr>
            ))}
          </table>
          
        </div>
      </div>
      <div className="flex gap-10 mb-10">
        <div className="valuebysupplier w-[50%]">
          <label className="text-xs text-[#adadaf] font-normal px-4">
            CHECK IN & OUT VALUE
          </label>
          <div className="flex items-start justify-between px-4 mt-10">
            <h1>Check in</h1>
            <div className="relative">
              <div
                className="border border-gray-300 rounded-md px-4 py-[6px] item-center flex gap-14"
              
              >
                <button className="text-sm font-normal cursor-pointer">
                  {getLabelForRange(checkInRange)}
                </button>
                {!showCheckInPicker ? (
                  <button className="cursor-pointer ">
                    <FaAngleDown className="text-[#abb1c1]" />
                  </button>
                ) : (
                  <button className="cursor-pointer ">
                    <RxCross1 size={15} className="text-black" />
                  </button>
                )}
              </div>
              
            </div>
          </div>
          <Skeleton width={120} height={30} className="mt-2" />
          
            <div className="px-4">
              <table className="w-full border-collapse mt-6 text-sm text-[#595959]">
                {Array(3).fill().map((_, index) => (
                  <tr className="border-b border-[#e6e6ed] cursor-pointer nth-last-1:border-b-0">
                    <td>
                      <Skeleton width={100} height={20} />
                    </td>
                    <td className="text-right py-4 ">
                        <Skeleton width={80} height={20} />
                    </td>
                  </tr>
                ))}
              </table>
              
            </div>
         
            
        </div>
        <div className="valuebysupplier w-[50%]">
          <label className="text-xs text-[#adadaf] font-normal px-4">
            CHECK IN & OUT VALUE
          </label>
          <div className="flex items-start justify-between px-4 mt-10">
            <h1>Check out</h1>
            <div className="relative">
              <div
                className="border border-gray-300 rounded-md px-4 py-[6px] item-center flex gap-14"
                
              >
                <button className="text-sm font-normal cursor-pointer">
                  {getLabelForRange(checkoutRange)}
                </button>
                {!showCheckoutPicker ? (
                  <button className="cursor-pointer ">
                    <FaAngleDown className="text-[#abb1c1]" />
                  </button>
                ) : (
                  <button className="cursor-pointer ">
                    <RxCross1 size={15} className="text-black" />
                  </button>
                )}
              </div>
              
            </div>
          </div>
            <Skeleton width={120} height={30} className="mt-2" />
          
            <div className="px-4">
              <table className="w-full border-collapse mt-6 text-sm text-[#595959]">
                {Array(3).fill().map((_, index) => (
                    <tr
                      className="border-b border-[#e6e6ed] cursor-pointer nth-last-1:border-b-0"
                      key={index}
                    >
                      <td><Skeleton width={100} height={20} /></td>
                      <td className="text-right py-4 ">
                        <Skeleton width={80} height={20} />
                      </td>
                    </tr>
                  ),
                )}
              </table>
          
            </div>
          
            
         
        </div>
      </div>
    </div>
    </SkeletonTheme>
  )
}
