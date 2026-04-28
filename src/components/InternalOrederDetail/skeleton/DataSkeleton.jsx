import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function DataSkeleton({row=2}) {
  return (
    <SkeletonTheme
      baseColor="#e0e0e0"
      highlightColor="#f5f5f5"
      className="rounded-lg"
    >
     
      <div className="overflow-x-auto overflow-y-auto overscroll-auto max-w-full">
        <table className="w-full border-collapse">
          <thead className="bg-[#f8f9fa] text-sm text-[#595959]">
            <tr className="border-y border-[#e6e6ed] text-[#777777]">
              <th className="py-4 pl-12 text-left font-medium text-xs">SKU</th>
              <th className="py-4 text-left px-4 font-medium text-xs">ITEMS</th>
              <th className="py-4 text-right px-4 font-medium text-xs">
                QUANTITY
              </th>
              <th className="py-4 text-right px-4 font-medium text-xs"></th>
            </tr>
          </thead>
        </table>
        <div className="overflow-x-auto overflow-y-auto overscroll-auto max-h-[400px]">
          {Array.from({ length: row }).map((_, index) => (
          <div className="px-12">
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-[#e6e6ed]">
                  <td className="py-10 text-left font-medium text-sm w-[26%]">
                    <Skeleton width={250} height={10} />
                  </td>
                  <td className="py-4 text-left px-4 text-sm w-[34%]">
                    <Skeleton width={200} height={10} />
                  </td>
                  <td className="py-4 text-right pr-8 text-sm w-[30%]">
                    <div>
                      <Skeleton width={100} height={10} />
                    </div>
                  </td>
                  <td className="py-4 text-right px-4 text-sm"></td>
                </tr>
              </tbody>
            </table>
          </div>)
            )}
        </div>
      </div>
        
    </SkeletonTheme>
  );
}
