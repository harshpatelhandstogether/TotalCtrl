import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function InventoryRowSkeleton({ rows = 5 }) {
  const safeRows = Math.max(5, rows);

  return (
    <>
      <SkeletonTheme baseColor="#dcd7d7" highlightColor="#aaa7a7">
        {[...Array(safeRows)].map((_, index) => (
          <tr key={index} className="align-top border-b-1  border-gray-200 ">
            <td className="px-3 pl-5 py-8  p-4"> <Skeleton width={30} height={20} /> </td>
            <td className="px-3 pl-5 py-8 font-semibold  ">
              <Skeleton width={90} height={20} />
            </td>
            <td className="px-3 py-8  ">
              <div className="flex flex-col gap-5 item-end">
                <div className="">
                  <Skeleton width={90} height={20} />
                </div>

                <div className="text-[#868689]">
                  <Skeleton width={90} height={20} />

                  <p className="text-[#868689]">
                    <Skeleton width={80} height={15} />
                  </p>
                </div>

                <div className="">
                  <Skeleton width={90} height={20} />
                  <p className="text-[#868689]">
                    <Skeleton width={90} height={20} />
                  </p>
                </div>

                <div>
                  <Skeleton width={90} height={20} />
                </div>
              </div>
            </td>

            <td className="px-3 py-8  ">
              <div className="flex flex-col gap-5 item-end">
                <div className="">
                  <Skeleton width={90} height={20} />
                </div>

                <div className="text-[#868689]">
                  <Skeleton width={90} height={20} />

                  <p className="text-[#4c41a2] bg-[#e6e3ff] w-max px-1 rounded-sm text-[12px] font-semibold">
                    <Skeleton width={80} height={15} />
                  </p>

                  <p className="text-[#a71a23] bg-[#ffe3e5] w-max px-1 rounded-sm text-[12px] font-semibold">
                    <Skeleton width={80} height={15} />
                  </p>
                </div>

                <div className="">
                  <Skeleton width={90} height={20} />
                  <p className="text-[#4c41a2] bg-[#e6e3ff] w-max px-1 rounded-sm text-[12px] font-semibold">
                    <Skeleton width={80} height={15} />
                  </p>
                </div>

                <div>
                  <Skeleton width={90} height={20} />

                  <p className="text-[#4c41a2] bg-[#e6e3ff] w-max px-1 rounded-sm text-[12px] font-semibold">
                    <Skeleton width={80} height={15} />
                  </p>
                </div>
              </div>
            </td>

            <td className="px-3 py-8 ">
              <div className="flex flex-col gap-5 item-end">
                <div className="bg-[#e7e7ec] w-max p-1 rounded-md text-[#5b5b60]">
                  <Skeleton width={90} height={20} />
                </div>

                <div>
                  <Skeleton width={90} height={20} />
                </div>

                <div className="flex flex-col gap-4 item-end text-[#868689] ">
                  <div className="text-[#868689] mb-[26px]">
                    <Skeleton width={90} height={20} />
                    <p></p>
                  </div>
                </div>
              </div>
            </td>

            <td className="px-3 py-8 ">
              <div className="flex flex-col gap-5 item-end">
                <Skeleton width={94} height={20} />

                <div className="flex flex-col gap-4 item-end text-[#868689]">
                  <div className="text-[#868689] mb-[26px]">
                    <Skeleton width={94} height={20} />
                  </div>
                </div>
              </div>
            </td>

            <td className="px-3 py-8 pr-2 w-[10%] font-semibold ">
              <div className="flex flex-col gap-5 item-end">
                <Skeleton width={85} height={20} />

                <div className="flex flex-col gap-4 item-end text-[#868689]">
                  <div className="text-[#868689] mb-[26px]">
                    <Skeleton width={85} height={20} />
                  </div>
                </div>
              </div>
            </td>

            <td className="py-8 pr-5 align-top">
              <div className="flex gap-5">
                <Skeleton width={20} height={20} />
                <Skeleton width={20} height={20} />
              </div>
              <div className="flex gap-5">
                <Skeleton width={20} height={20} />
                <Skeleton width={20} height={20} />
              </div>
            </td>
          </tr>
        ))}
      </SkeletonTheme>
    </>
  );
}
