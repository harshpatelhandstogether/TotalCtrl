import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFoodRange } from "../../../slices/AnalyticSlice";
import DatePicker from "../../UI/DatePicker";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { displayCurrency } from "../../../utils/formatCurrency";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function PurchaseTabSkeleton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inventoryId = useSelector((state) => state.inventoryId.inventoryId);
  const foodRange = useSelector((state) => state.analytic.byKey["Purchases"]);
  const DATE_FORMAT = "yyyy-MM-dd";

  const startDate =
    foodRange?.startDate ?? format(startOfMonth(new Date()), DATE_FORMAT);
  const endDate =
    foodRange?.endDate ?? format(endOfMonth(new Date()), DATE_FORMAT);

  const parsedRange = {
    ...foodRange,
    startDate: startDate,
    endDate: endDate,
  };

  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <div>
        <div className="flex items-center justify-between py-6 px-12">
          <h1 className="text-xl font-semibold">Purchases</h1>
          <div className="flex items-center gap-4">
            <button className="px-4 py-[6px] border border-gray-300 rounded-md text-sm font-semibold ">
              Export Data
            </button>

            <DatePicker
              value={parsedRange}
              onChange={(newRange) =>
                dispatch(
                  setFoodRange({
                    key: "Purchases",
                    startDate: format(newRange.startDate, "yyyy-MM-dd"),
                    endDate: format(newRange.endDate, "yyyy-MM-dd"),
                  }),
                )
              }
            />
          </div>
        </div>

        <div className="px-12 flex ">
          <div className="mt-5 w-[50%]">
            <div className="text-sm font-medium text-[#8d8d90]">
              TOTAL PURCHASES{" "}
            </div>
            <h1 className="text-6xl font-normal pt-5">
              <Skeleton width={200} height={60} />
            </h1>
          </div>
        </div>

        <div className="mx-12 mt-15 flex gap-15">
          <div className="w-[50%]">
            <span className="text-xs font-normal text-[#8d8d90]">
              BIGGEST ORDERS
            </span>
            {/* <div className="my-8 w-[10px] border-b border-[#e5e7eb] w-[80%]"></div> */}
            <div className="">
              <table className="w-full text-left mt-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr
                    className="text-sm border-b border-[#e5e7eb] nth-last-1:border-b-0"
                    key={index}
                  >
                    <td className="py-5 ">
                      <div className="flex-col ">
                       <Skeleton width={150} height={20} />
                        <div>
                          <span className="text-[#6b6b6f]"><Skeleton width={100} height={15} /></span>
                        </div>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex-col ">
                        <Skeleton width={100} height={20} />
                        <div>
                          <Skeleton width={80} height={15} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </table>
              
            </div>
          </div>
          <div className="w-[50%]">
            <span className="text-xs font-normal text-[#8d8d90]">
              BIGGEST SUPPLIERS
            </span>

            <div className="">
              <table className="w-full text-left mt-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr
                    className="text-sm border-b border-[#e5e7eb] nth-last-1:border-b-0"
                    key={index}
                  >
                    <td className="py-5 ">
                      <div className="flex-col ">
                        <Skeleton width={150} height={20} />
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex-col ">
                        <Skeleton width={100} height={20} />
                      </div>
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          </div>
        </div>

        <h1 className="mx-12 mt-15 text-xs text-[#8d8d90]">PRICE VARIATIONS</h1>
        <div className="mx-12 mt-5 flex gap-15">
          <div className="w-[50%]">
            <div className="">
              <table className="w-full text-left mt-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <tr
                    className="text-sm border-b border-[#e5e7eb] nth-last-1:border-b-0"
                    key={index}
                    >
                      <td className="py-5 ">
                        <div className="flex-col ">
                          <Skeleton width={150} height={20} />
                          <div>
                            <span className="text-[#6b6b6f]">
                              <Skeleton width={100} height={15} />
                            </span>
                          </div>
                          <div className="h-5"></div>
                        </div>
                      </td>
                      <td className="text-right ">
                        <div className="flex-col ">
                          <Skeleton width={100} height={20} />
                          <div className="text-[#6b6b6f]">
                            <Skeleton width={80} height={15} />
                          </div>
                          <div className="text-[#e2232e] font-semibold text-xs">
                            <Skeleton width={50} height={15} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </table>
            </div>
          </div>
          <div className="w-[50%]">
            <div className="">
              <table className="w-full text-left mt-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <tr
                    className="text-sm border-b border-[#e5e7eb] nth-last-1:border-b-0"
                    key={index}
                    >
                      <td className="py-5 items-start ">
                        <div className="flex-col ">
                          <Skeleton width={150} height={20} />
                          <div>
                            <span className="text-[#6b6b6f]">
                              <Skeleton width={100} height={15} />
                            </span>
                          </div>
                          <div className="h-5"></div>
                        </div>
                      </td>
                      <td className="text-right ">
                        <div className="flex-col ">
                          <Skeleton width={100} height={20} />
                          <div className="text-[#6b6b6f]">
                            <Skeleton width={80} height={15} />
                          </div>
                          <div className="text-[#228f50] font-semibold text-xs">
                            <Skeleton width={50} height={15} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </table>
             
            </div>
          </div>
        </div>

        <div className="h-10"></div>
      </div>
    </SkeletonTheme>
  );
}
