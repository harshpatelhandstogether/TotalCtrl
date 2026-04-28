import React from 'react'
import Skeleton,{SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Header from '../Header'

export default function DetailPageSkeleton() {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5" className="rounded-lg">
    <div>
      <Header />
      <div>
        <div className="top flex justify-between px-12 pt-10 pb-6">
          <div className="left">
            <div className="flex gap-4 item-center">
              <div className="text-3xl font-semibold">
                <Skeleton width={300} height={30}/>

              </div>
              
            </div>
            <div className="py-2 ">
              <Skeleton width={200} height={20}/>
            </div>
            <div className="pt-4 flex gap-5  ">
              <div className="border-r border-[#d7d7db] pr-5">
                <p className="text-xs text-[#a0a0a3] font-medium">ORDERED</p>
                <h1 className="font-semibold text-xl">
                  <Skeleton width={100} height={10}/>
                </h1>
              </div>
              <div className="border-r border-[#d7d7db] pr-5">
                <p className="text-xs text-[#a0a0a3] font-medium">
                  LAST DELIVERED
                </p>
                
                  <h1 className="font-semibold text-xl">
                    <Skeleton width={100} height={10}/>
                  </h1>
              <h1 className="font-semibold text-xl">
                    <Skeleton width={100} height={10}/>
                  </h1>
              </div>
              <div>
                <p className="text-xs text-[#a0a0a3] font-medium">ITEMS</p>
                <h1 className="font-semibold text-xl">
                  <Skeleton width={100} height={10}/>
                </h1>
              </div>
            </div>
          </div>
          <div className="right flex  item-center">
            
          </div>
        </div>
      
      </div>
    </div>
    </SkeletonTheme>
  )
}
