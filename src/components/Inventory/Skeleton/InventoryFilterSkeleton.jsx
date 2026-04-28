import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { IoSearch } from "react-icons/io5";

export default function InventoryFilterSkeleton() {
  return (
    <>
      <SkeletonTheme baseColor="#dcd7d7" highlightColor="#aaa7a7">
        <div className=" flex justify-between bg-gray-100 transition-all duration-[500ms] ease-in-out px-8  ">
          <div className=" flex flex-col py-5 transition-all duration-[1200ms] ease-in-out">
            <div className=" pl-4">
              <Skeleton width={200} height={20} />
            </div>

            <div
              className={`flex overflow-hidden transition-all duration-1000 ease-in-out mt-5 `}
            >
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1 bg-white px-4  nth-last-1:border-r-0 tracking-wide"
                >
                  <label className="text-xs text-[#6b6b6f]">
                    <Skeleton width={120} height={20} />
                  </label>
                  <label className="text-lg font-semibold">
                    <Skeleton width={120} height={20} />
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className=" py-5 flex justify-end gap-6 text-right w-[50%]  transition duration-300 ease-in-out font-medium pr-2">
            <button className="flex justify-center items-center gap-2 px-[6px] py-[9px] text-black cursor-pointer  rounded-md h-10 text-[14px] ">
              <Skeleton width={100} height={20} />
            </button>

            <button className="flex justify-center items-center gap-2 px-[6px] py-[9px] text-black cursor-pointer  rounded-md  h-10 text-[14px] ">
              <div className="flex justify-between items-center gap-2   text-white font-semibold cursor-pointer">
                <Skeleton width={100} height={20} />
              </div>
            </button>

            <button
              className={`flex items-center gap-2 px-[6px] py-[9px] rounded-md h-10 text-[14px]`}
            >
              <div className="flex justify-between items-center gap-2   text-white font-semibold cursor-pointer">
                <Skeleton width={100} height={20} />
              </div>
            </button>
          </div>
        </div>

        <div className="px-8 py-4 bg-gray-100 flex gap-5 w-full">
          <div className="pl-2">
            <Skeleton width={250} height={30} />
          </div>
          <div className="">
            <Skeleton width={250} height={30} />
          </div>
          <div className="">
            <IoSearch size={20} className="text-gray-500 absolute  ml-2 h-9" />
            <input
              type="text"
              placeholder="Search Main Inventory"
              className="px-12 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-600 h-9"
              size={137}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>
      </SkeletonTheme>
    </>
  );
}
