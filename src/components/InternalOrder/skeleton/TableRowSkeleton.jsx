import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function TableRowSkeleton({ rows = 5 }) {
  return (
    <SkeletonTheme baseColor="#dcd7d7" highlightColor="#aaa7a7">
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="border-b border-[#e6e6ed] cursor-pointer">
          <td className="py-10 font-medium text-sm text-left w-[18%] font-semibold">
            <Skeleton width={250} height={10} />
          </td>
          <td className="py-4 px-4 text-sm text-[#595959] text-left w-[21%]">
            <Skeleton  width={250} height={10} />    
          </td>
          <td className="py-4 px-4  text-sm text-[#595959] text-right w-[11%]">
            <Skeleton width={100} height={10} />
          </td>
          <td className="py-4 px-4  text-sm text-[#595959] text-right w-[13%]">
            <Skeleton width={100} height={10} />
          </td>
          <td className="py-4 px-4  text-sm text-[#595959] text-right w-[12.5%]">
            <Skeleton width={100} height={10} />
          </td>
          <td className="py-4 px-4  text-sm text-[#595959] text-right w-[12.5%]">
            <Skeleton  height={10} width={60} />
          </td>
          <td className="py-4 px-4  text-sm text-[#595959] font-semibold text-right w-[12.5%]">
            <span
              className={`
               rounded-md py-1 px-2 text-xs `}
            >
              
                <Skeleton  height={10} width={60} />
            </span>
          </td>
        </tr>
      ))}
    </SkeletonTheme>
  );
}
