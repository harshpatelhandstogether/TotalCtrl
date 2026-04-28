import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function InventoryDataSkeleton({ col = 4 }) {
  return (
    <SkeletonTheme baseColor="#dcd7d7" highlightColor="#aaa7a7">
    
        
          
          {/* <div className="shadow-lg border border-[#e7e7ec] rounded-lg h-full mt-10"> */}
            <div className="inline-block pl-15 w-[25%] pr-2 py-10 border border-[#e7e7ec]">
              <h1 className="text-lg font-semibold">
                <Skeleton width={150} />
              </h1>
              <h1 className="text-3xl font-semibold pt-5">
                <Skeleton width={100} height={30} />
              </h1>
              <p className="text-xs text-gray-600 py-2">
                <Skeleton width={150} height={20} />
              </p>
              <div className="w-[70%] bg-gray-200 rounded-full h-1.5">
                <skeleton width={"100%"} height={10} className="rounded-full" />
              </div>
              <div className={`text-[#208e4e] pt-10  font-semibold `}>
                <Skeleton width={100} height={20} />
              </div>
            </div>
             <div className="inline-block pl-15 w-[25%] pr-2 py-10 border border-[#e7e7ec]">
              <h1 className="text-lg font-semibold">
                <Skeleton width={150} />
              </h1>
              <h1 className="text-3xl font-semibold pt-5">
                <Skeleton width={100} height={30} />
              </h1>
              <p className="text-xs text-gray-600 py-2">
                <Skeleton width={150} height={20} />
              </p>
              <div className="w-[70%] bg-gray-200 rounded-full h-1.5">
                <skeleton width={"100%"} height={10} className="rounded-full" />
              </div>
              <div className={`text-[#208e4e] pt-10  font-semibold `}>
                <Skeleton width={100} height={20} />
              </div>
            </div>
             <div className="inline-block pl-15 w-[25%] pr-2 py-10 border border-[#e7e7ec]">
              <h1 className="text-lg font-semibold">
                <Skeleton width={150} />
              </h1>
              <h1 className="text-3xl font-semibold pt-5">
                <Skeleton width={100} height={30} />
              </h1>
              <p className="text-xs text-gray-600 py-2">
                <Skeleton width={150} height={20} />
              </p>
              <div className="w-[70%] bg-gray-200 rounded-full h-1.5">
                <skeleton width={"100%"} height={10} className="rounded-full" />
              </div>
              <div className={`text-[#208e4e] pt-10  font-semibold `}>
                <Skeleton width={100} height={20} />
              </div>
            </div>
             <div className="inline-block pl-15 w-[25%] pr-2 py-10 border border-[#e7e7ec]">
              <h1 className="text-lg font-semibold">
                <Skeleton width={150} />
              </h1>
              <h1 className="text-3xl font-semibold pt-5">
                <Skeleton width={100} height={30} />
              </h1>
              <p className="text-xs text-gray-600 py-2">
                <Skeleton width={150} height={20} />
              </p>
              <div className="w-[70%] bg-gray-200 rounded-full h-1.5">
                <skeleton width={"100%"} height={10} className="rounded-full" />
              </div>
              <div className={`text-[#208e4e] pt-10  font-semibold `}>
                <Skeleton width={100} height={20} />
              </div>
            </div>
          {/* </div> */}

          

            
            
        
     
    </SkeletonTheme>
  );
}
