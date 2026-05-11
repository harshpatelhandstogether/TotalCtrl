import React from 'react'
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { setFoodRange } from "../../../slices/AnalyticSlice";
import DatePicker from "../../UI/DatePicker";
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
import ProgressBar from "../../UI/ProgressBar";
import SelectDropdown from "../../UI/SelectDropdown";
import { displayCurrency } from "../../../utils/formatCurrency";
import formatDate from "../../../utils/formateDate";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import Skeleton,{SkeletonTheme} from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function TransferTabSkeleton() {
      const [transferFilter, setTransferFilter] = useState("both");
  const [sortConfig, setSortConfig] = useState({
    key: "transferDate",
    direction: "DESC",
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();
  const inventoryId = useSelector((state) => state.inventoryId.inventoryId);
  const Transfer = useSelector((state) => state.analytic.byKey["Transfer"]);
  const DATE_FORMAT = "yyyy-MM-dd";

  const startDate =
    Transfer?.startDate ?? format(startOfMonth(new Date()), DATE_FORMAT);
  const endDate =
    Transfer?.endDate ?? format(endOfMonth(new Date()), DATE_FORMAT);

  const parsedRange = {
    ...Transfer,
    startDate: startDate,
    endDate: endDate,
  };
    const handleSort = (column) => {
    let direction = "ASC";

    if (sortConfig.key === column && sortConfig.direction === "ASC") {
      direction = "DESC";
    }

    // setIsSorting(true);

    setSortConfig({
      key: column,
      direction,
    });
  };
    const renderSortIcon = (column) => {
        if (sortConfig.key !== column) {
          return <FaChevronUp className="inline ml-1 text-gray-500" size={10} />;
        }
    
        if (sortConfig.direction === "ASC") {
          return <FaChevronUp className="inline ml-1 text-green-500" size={10} />;
        }
    
        return <FaChevronDown className="inline ml-1 text-green-500" size={10} />;
      };
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
   <div>
      <div className="flex items-center justify-between py-6 px-12">
        <h1 className="text-xl font-semibold">Transfers</h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-[6px] border border-gray-300 rounded-md text-sm font-semibold ">
            Export Data
          </button>

          <DatePicker
            value={parsedRange}
            onChange={(newRange) =>
              dispatch(
                setFoodRange({
                  key: "Transfer",
                  startDate: format(newRange.startDate, "yyyy-MM-dd"),
                  endDate: format(newRange.endDate, "yyyy-MM-dd"),
                }),
              )
            }
          />
        </div>
      </div>

      <div className="px-12 flex mt-10 w-[90%]">
        <div className="w-[50%]">
          <div className="flex gap-1 text-lg font-medium ">
            Total value Transferred
            <div className=" flex gap-1 item-center text-[#23a956]">
              <FaRegArrowAltCircleRight className="mt-1" />
              IN
            </div>
          </div>
          <div className="my-5 text-6xl font-normal">
            <Skeleton width={200} height={60} />
          </div>
          <div className="font-normal text-sm">
            <Skeleton width={300} height={20} />
          </div>
        </div>
        <div className="w-[50%]">
          <div>
            <div className="flex gap-1 text-lg font-medium ">
              Analysis of items transferred
              <div className=" flex gap-1 item-center text-[#23a956]">
                <FaRegArrowAltCircleRight className="mt-1" />
                IN
              </div>
            </div>
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className=" mt-4 text-sm">
                <div className="flex items-center justify-between gap-2 my-5">
                  <div>
                    <Skeleton width={150} height={20} />
                  </div>
                  <div>
                    <Skeleton width={100} height={20} />
                  </div>
                </div>
                <div className="my-2">
                  <Skeleton width={"100%"} height={10} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-12 flex mt-10 w-[90%]">
        <div className="w-[50%]">
          <div className="flex gap-1 text-lg font-medium ">
            Total value Transferred
            <div className=" flex gap-1 item-center text-[#e6464e]">
              <FaRegArrowAltCircleLeft className="mt-1" />
              OUT
            </div>
          </div>
          <div className="my-5 text-6xl font-normal">
            <Skeleton width={200} height={60} />
          </div>
          <div className="font-normal text-sm">
            <Skeleton width={300} height={20} />
          </div>
        </div>
        <div className="w-[50%]">
          <div>
            <div className="flex gap-1 text-lg font-medium ">
              Analysis of items transferred
              <div className=" flex gap-1 item-center text-[#e6464e]">
                <FaRegArrowAltCircleLeft className="mt-1" />
                OUT
              </div>
            </div>
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className=" mt-4 text-sm">
                <div className="flex items-center justify-between gap-2 my-5">
                  <div>
                    <Skeleton width={150} height={20} />
                  </div>
                  <div>
                    <Skeleton width={100} height={20} />
                  </div>
                </div>
                <div className="my-2">
                  <Skeleton width={"100%"} height={10} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 mx-12">
        <div className="flex justify-between ">
          <div className="text-lg font-medium ">Transfer information</div>
          <div className="flex gap-4">
            <SelectDropdown
            //   dataList={option}
            //   loading={false}
            //   error={false}
            //   value={
            //     option.find((o) => o.value === transferFilter) ?? option[0]
            //   }
            //   onChange={(selected) => setTransferFilter(selected.value)}
            //   placeholder="Show all"
            />
            <SelectDropdown
            //   dataList={ItemInventoryOption}
            //   loading={itemInventoriesLoading}
            //   error={itemInventoriesError}
            //   value={
            //     ItemInventoryOption.find((o) => o.value === selectedItem) ??
            //     null
            //   }
            //   onChange={(selected) => setSelectedItem(selected.value)}
            //   placeholder="Select Item"
            //   default={ItemInventoryOption[0]}
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg border-gray-200 mx-12 mt-10">
        <div className="bg-[#f8f9fa] rounded-lg border-b border-gray-200">
          <table className="w-[95%] border-collapse ml-[2.5%] rounded-lg ">
            <tr className=" ">
              <th className={`font-medium p-4 text-[#848484] text-xs text-left w-[10%] `}>
                TYPE
              </th>
              <th className={`font-medium p-2  text-xs text-left w-[20%] ${sortConfig.key === "name" ? "text-green-500" : "text-[#848484]"}` } onClick={() => handleSort("name")}>
                ITEM
                {renderSortIcon("name")}
              </th>
              <th className={`font-medium p-2  text-xs text-left w-[10%] ${sortConfig.key === "transferDate" ? "text-green-500" : "text-[#848484]"}` } onClick={() => handleSort("transferDate")}>
                TRANSFER DATE
                {renderSortIcon("transferDate")}
              </th>
              <th className={`font-medium p-2  text-xs text-left w-[15%] ${sortConfig.key === "transferredBy" ? "text-green-500" : "text-[#848484]"}` } onClick={() => handleSort("transferredBy")}>
                TRANSFERRED BY
                {renderSortIcon("transferredBy")}
              </th>
              <th className={`font-medium p-2  text-xs text-left w-[15%] ${sortConfig.key === "involvedInventoryName" ? "text-green-500" : "text-[#848484]"}` } onClick={() => handleSort("involvedInventoryName")}>
                INVENTORY
                {renderSortIcon("involvedInventoryName")}
              </th>
              <th className={`font-medium p-2  text-xs text-left w-[20%] ${sortConfig.key === "totalTransferredQty" ? "text-green-500" : "text-[#848484]"}` } onClick={() => handleSort("totalTransferredQty")}>
                QUANTITY
                {renderSortIcon("totalTransferredQty")}
              </th>
              <th className={`font-medium p-2  text-xs text-right w-[10%] ${sortConfig.key === "totalTransferredValue" ? "text-green-500" : "text-[#848484]"}` } onClick={() => handleSort("totalTransferredValue")}>
                VALUE
                {renderSortIcon("totalTransferredValue")}
              </th>
            </tr>
          </table>
        </div>
        <div className="overflow-x-auto overflow-y-auto overscroll-auto h-[400px]">
          <table className="w-[95%] border-collapse ml-[2.5%] rounded-lg ">
            
              <tr
                className="border-b border-gray-200 nth-last-1:border-b-0"
                
              >
                <td className="py-6 text-sm text-left w-[10%]">
                  <Skeleton width={80} height={20} />
                </td>
                <td className="py-2 text-sm text-left w-[20%]">
                  <Skeleton width={120} height={20} />
                </td>
                <td className="py-6 text-sm text-left w-[10%]">
                  <Skeleton width={100} height={20} />
                </td>
                <td className="py-2 text-sm text-left w-[15%]">
                    <Skeleton width={100} height={20} />
                </td>
                <td className="py-2 text-sm text-left w-[15%]">
                    <Skeleton width={120} height={20} />
                </td>
                <td className="py-2 text-sm text-left w-[20%]">
                  <Skeleton width={100} height={20} />
                </td>
                <td className="py-2 text-sm text-right w-[10%]">
                    <Skeleton width={80} height={20} />
                </td>
              </tr>
            
            
          </table>
        </div>
      </div>
      <div className="h-10"></div>
    </div>
    </SkeletonTheme>
  )
}
