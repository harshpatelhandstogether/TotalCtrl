import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function HeaderSkeleton() {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className="px-8  border-b-1 border-gray-200">
        <nav className="bg-white h-20 flex justify-between  pl-4 ">
          <div className="flex items-center gap-4 cursor-pointer ">
            <Skeleton width={150} height={30} />
          </div>

          <div className="flex items-center gap-4 pr-2 ">
            <div className="flex flex-col">
                <Skeleton width={100} height={20} />
              
            </div>

            <button
              className="flex items-center gap-2   font-medium py-2 px-8  rounded-md  cursor-pointer border-1 border-[#d7d7db] "
     
            >
                <Skeleton width={100} height={20} />
            </button>
          </div>
        </nav>
      </div>
    </SkeletonTheme>
  );
}
