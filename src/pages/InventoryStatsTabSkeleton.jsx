import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParams } from "react-router-dom";
import Header from "../components/UI/Header";
import DatePicker from "../components/UI/DatePicker";
import { startOfMonth, endOfMonth } from "date-fns";
import { FaChevronLeft } from "react-icons/fa";
import { useState } from "react";

export default function InventoryStatsTabSkeleton() {
  const { name } = useParams();
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

  return (
    <div>
      <Header title={"Analytics"} className="text-2xl font-semibold">
        <div className="flex flex-col">
          <Skeleton width={350} height={30} className="mb-2" />
          
          
        </div>
      </Header>
      <div>
        <nav className="bg-white py-5 flex justify-between  px-12 border-b-1 border-gray-200 ">
          <div
            className="flex items-center gap-2  cursor-pointer "
            onClick={() => navigate("/analytics-detail")}
          >
            <FaChevronLeft size={20} className="text-[#a1a1a5]" />
            <h1 className="font-source text-black text-md font-semibold">
              Inventory
            </h1>
          </div>
        </nav>
      </div>
      <div className="mx-12 py-8 flex items-center justify-between">
        {name === "byStock" && (
          <h1 className="text-xl font-semibold">Value By Supplier</h1>
        )}
        {name === "byCategory" && (
          <h1 className="text-xl font-semibold">Value by category</h1>
        )}
        {name === "byCheckInCategory" && (
          <>
            <h1 className="text-xl font-semibold">Check IN Values </h1>
            <div className="mr-20">
              <DatePicker
                value={checkInRange}
                onChange={setCheckInRange}
                className=""
              />
            </div>
          </>
        )}
        {name === "byCheckOutCategory" && (
          <>
            <h1 className="text-xl font-semibold">Check Out Values</h1>
            <div className="mr-20">
              <DatePicker
                value={checkoutRange}
                onChange={setCheckoutRange}
                className="mr-4"
              />
            </div>
          </>
        )}
      </div>
      {name === "byStock" && (
        <div className="flex mx-12 py-3 text-sm ">
          <h1>
            <Skeleton width={30} className="mr-4" />
          </h1>
          <div className="w-[80%] ml-4">
            <Skeleton width={100} />
          </div>
          <div className="">
            <Skeleton width={100} />
          </div>
        </div>
      )}
      {name === "byCategory" && (
        <div className="flex mx-12 py-3 text-sm ">
          <h1>
            <Skeleton width={30} className="mr-4" />
          </h1>
          <div className="w-[80%] ml-4">
            <Skeleton width={100} />
          </div>
          <div className="">
            <Skeleton width={100} />
          </div>
        </div>
      )}
      {name === "byCheckInCategory" && (
        <div className="flex mx-12 py-3 text-sm ">
          <h1>
            <Skeleton width={30} className="mr-4" />
          </h1>
          <div className="w-[80%] ml-4">
            <Skeleton width={100} />
          </div>
          <div className="">
            <Skeleton width={100} />
          </div>
        </div>
      )}
      {name === "byCheckOutCategory" && (
        <div className="flex mx-12 py-3 text-sm ">
          <h1>
            <Skeleton width={30} className="mr-4" />
          </h1>
          <div className="w-[80%] ml-4">
            <Skeleton width={100} />
          </div>
          <div className="">
            <Skeleton width={100} />
          </div>
        </div>
      )}
    </div>
  );
}
