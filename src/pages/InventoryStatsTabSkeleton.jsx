import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParams } from "react-router-dom";
import Header from "../components/UI/Header";
import DatePicker from "../components/UI/DatePicker";
import { startOfMonth, endOfMonth } from "date-fns";
import { FaChevronLeft } from "react-icons/fa";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function InventoryStatsTabSkeleton() {
  const { name } = useParams();
  const [checkInRange, setCheckInRange] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: "selection",
    },
  ]);
  const [checkoutRange, setCheckoutRange] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: "selection",
    },
  ]);

  const purchaseRange = useSelector(
    (state) => state.analytic.byKey["Purchases"],
  );
  console.log("Purchase Range:", purchaseRange);

  const startDate =
    purchaseRange?.startDate ?? format(startOfMonth(new Date()), DATE_FORMAT);
  const endDate =
    purchaseRange?.endDate ?? format(endOfMonth(new Date()), DATE_FORMAT);

  const parsedRange = {
    ...purchaseRange,
    startDate: startDate,
    endDate: endDate,
  };

  return (
    <div>
      <Header title={"Analytics"} className="text-2xl font-semibold">
        <div className="flex flex-col">
          <Skeleton width={350} height={30} className="mb-2" />
        </div>
      </Header>
      <div>
        <nav className="bg-white py-5 flex justify-between  px-12 border-b-1 border-gray-200 ">
          <div
            className="flex items-center gap-2  cursor-pointer "
            onClick={() => navigate("/analytics-detail")}
          >
            <FaChevronLeft size={20} className="text-[#a1a1a5]" />
            <h1 className="font-source text-black text-md font-semibold">
              Inventory
            </h1>
          </div>
        </nav>
      </div>
      <div className="mx-12 py-8 flex items-center justify-between">
        {name === "byStock" && (
          <h1 className="text-xl font-semibold">Value By Supplier</h1>
        )}
        {name === "byCategory" && (
          <h1 className="text-xl font-semibold">Value by category</h1>
        )}
        {name === "byCheckInCategory" && (
          <>
            <h1 className="text-xl font-semibold">Check IN Values </h1>
            <div className="mr-20">
              <DatePicker
                value={checkInRange}
                onChange={setCheckInRange}
                className=""
              />
            </div>
          </>
        )}
        {name === "byCheckOutCategory" && (
          <>
            <h1 className="text-xl font-semibold">Check Out Values</h1>
            <div className="mr-20">
              <DatePicker
                value={checkoutRange}
                onChange={setCheckoutRange}
                className="mr-4"
              />
            </div>
          </>
        )}
        {name === "biggestorders" && (
          <>
            <h1 className="text-xl font-semibold">Biggest Orders</h1>
            <DatePicker
              value={parsedRange}
              onChange={(newRange) =>
                dispatch(
                  setFoodRange({
                    key: "purchases",
                    startDate: format(newRange.startDate, "yyyy-MM-dd"),
                    endDate: format(newRange.endDate, "yyyy-MM-dd"),
                  }),
                )
              }
            />
          </>
        )}
        {name === "biggestsuppliers" && (
          <>
            <h1 className="text-xl font-semibold">Biggest Suppliers</h1>
            <DatePicker
              value={parsedRange}
              onChange={(newRange) =>
                dispatch(
                  setFoodRange({
                    key: "purchases",
                    startDate: format(newRange.startDate, "yyyy-MM-dd"),
                    endDate: format(newRange.endDate, "yyyy-MM-dd"),
                  }),
                )
              }
            />
          </>
        )}
        {name === "PriceVariations" && (
          <>
            <h1 className="text-xl font-semibold">Price Variations</h1>
            <DatePicker
              value={parsedRange}
              onChange={(newRange) =>
                dispatch(
                  setFoodRange({
                    key: "purchases",
                    startDate: format(newRange.startDate, "yyyy-MM-dd"),
                    endDate: format(newRange.endDate, "yyyy-MM-dd"),
                  }),
                )
              }
            />
          </>
        )}
      </div>
      {name === "byStock" && (
        <div className="flex mx-12 py-3 text-sm ">
          <h1>
            <Skeleton width={30} className="mr-4" />
          </h1>
          <div className="w-[80%] ml-4">
            <Skeleton width={100} />
          </div>
          <div className="">
            <Skeleton width={100} />
          </div>
        </div>
      )}
      {name === "byCategory" && (
        <div className="flex mx-12 py-3 text-sm ">
          <h1>
            <Skeleton width={30} className="mr-4" />
          </h1>
          <div className="w-[80%] ml-4">
            <Skeleton width={100} />
          </div>
          <div className="">
            <Skeleton width={100} />
          </div>
        </div>
      )}
      {name === "byCheckInCategory" && (
        <div className="flex mx-12 py-3 text-sm ">
          <h1>
            <Skeleton width={30} className="mr-4" />
          </h1>
          <div className="w-[80%] ml-4">
            <Skeleton width={100} />
          </div>
          <div className="">
            <Skeleton width={100} />
          </div>
        </div>
      )}
      {name === "byCheckOutCategory" && (
        <div className="flex mx-12 py-3 text-sm ">
          <h1>
            <Skeleton width={30} className="mr-4" />
          </h1>
          <div className="w-[80%] ml-4">
            <Skeleton width={100} />
          </div>
          <div className="">
            <Skeleton width={100} />
          </div>
        </div>
      )}
      {name === "biggestorders" &&
        
          <div className="flex mx-12 py-3 text-sm ">
            <h1 className="w-[5%] text-[#9a9eaf]"><Skeleton width={30} /></h1>
            <div className="w-[80%]">
              <Skeleton width={100} />
              <div className="text-[#6b6b6f] text-xs"><Skeleton width={50} /></div>
            </div>
            <div className="">
              <Skeleton width={100} />
            </div>
          </div>
        }
      {name === "biggestsuppliers" &&
     
          <div className="flex mx-12 py-3 text-sm ">
            <h1 className="w-[5%] text-[#9a9eaf]"><Skeleton width={30} /></h1>
            <div className="w-[80%]"><Skeleton width={100} /></div>
            <div className="">
              <Skeleton width={100} />
            </div>
          </div>
        }
      {name === "PriceVariations" && (
        <div className="flex mx-12 py-3 text-sm gap-15">
          <div className="w-[50%]">
            <div className="">
              <table className="w-full text-left mt-4">
               
                  <tr
                    className="text-sm border-b border-[#e5e7eb] nth-last-1:border-b-0"
                   
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
                
              </table>

              
            </div>
          </div>
          <div className="w-[50%]">
            <div className="">
              <table className="w-full text-left mt-4">
               
                  <tr
                    className="text-sm border-b border-[#e5e7eb] nth-last-1:border-b-0"
                    
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
                        <Skeleton width={100} height={20}/>
                        <div className="text-[#6b6b6f]">
                          <Skeleton width={80} height={20}/>
                        </div>
                        <div className="text-[#228f50] font-semibold text-xs">
                          <Skeleton width={50} height={15}/>
                        </div>
                      </div>
                    </td>
                  </tr>
                
              </table>

              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
