import React from 'react'
import Skeleton,{SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';

import { useSelector } from 'react-redux';

export default function HeaderSkeleton() {
    const selectedInventoryId = useSelector((state) => state.inventoryId.inventoryId);
    const inventoryList = useSelector((state) => state.inventoryId.inventoryList);
  return (
    <SkeletonTheme baseColor="#e6e6ed" highlightColor="#f5f5f5">
    <div className="px-10  border-b-1 border-gray-200">
      <nav className="bg-white h-20 flex justify-between items-center  text-sm ">
        <div className="flex item-centere ">
          <div
            className="flex items-center gap-3 cursor-pointer "
            // onClick={() => navigate("/analytics")}
          >
            <div className="text-[#a6a6a9] pr-1">Analytics /</div>
          </div>
          <div className="flex item-center ">
            <div>
              {" "} {inventoryList.find((inv) => inv.id === selectedInventoryId)?.name} {" "}
            </div>
          </div>
        </div>
         <div className="flex flex-col">
         <Skeleton  width={120} height={30} />
       
      </div>
      </nav>
    </div>
    </SkeletonTheme>
  )
}
