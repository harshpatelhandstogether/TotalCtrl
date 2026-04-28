import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function FoodUsageSkeleton() {
  return (
    <SkeletonTheme baseColor="#dcd7d7" highlightColor="#aaa7a7">
      {/* <div className="shadow-lg border border-[#e7e7ec] rounded-lg h-full mt-10"> */}
      <div className="inline-block p-15 w-[33.33%] border border-[#e7e7ec]">
        <h1 className="text-lg font-semibold">
          <Skeleton width={150} />
        </h1>
        <h1 className="text-3xl font-semibold pt-5">
          <Skeleton width={100} height={30} />
        </h1>
        <p className="text-gray-600 py-2 text-xs">
          <Skeleton width={150} height={20} />
        </p>
        <div className="flex items-center justify-between pt-10 text-sm">
       
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <Skeleton width={"100%"} height={10} className="rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-10 text-sm">
        
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <Skeleton width={"100%"} height={10} className="rounded-full" />
        </div>
        <button className="mt-10">
          <Skeleton width={80} height={30} />
        </button>
      </div>
      <div className="inline-block p-15 w-[33.33%] border border-[#e7e7ec]">
        <h1 className="text-lg font-semibold">
          <Skeleton width={150} />
        </h1>
        <h1 className="text-3xl font-semibold pt-5">
          <Skeleton width={100} height={30} />
        </h1>
        <p className="text-gray-600 py-2 text-xs">
          <Skeleton width={150} height={20} />
        </p>
        <div className="flex items-center justify-between pt-10 text-sm">
          
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <Skeleton width={"100%"} height={10} className="rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-10 text-sm">
         
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <Skeleton width={"100%"} height={10} className="rounded-full" />
        </div>
        <button className="mt-10">
          <Skeleton width={80} height={30} />
        </button>
      </div>
      <div className="inline-block p-15 w-[33.33%] border border-[#e7e7ec]">
        <h1 className="text-lg font-semibold">
          <Skeleton width={150} />
        </h1>
        <h1 className="text-3xl font-semibold pt-5">
          <Skeleton width={100} height={30} />
        </h1>
        <p className="text-gray-600 py-2 text-xs">
          <Skeleton width={150} height={20} />
        </p>
        <div className="flex items-center justify-between pt-10 text-sm">
          
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <Skeleton width={"100%"} height={10} className="rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-10 text-sm">
          
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <Skeleton width={"100%"} height={10} className="rounded-full" />
        </div>
        <button className="mt-10">
          <Skeleton width={80} height={30} />
        </button>
      </div>
      {/* </div> */}
    </SkeletonTheme>
  );
}
