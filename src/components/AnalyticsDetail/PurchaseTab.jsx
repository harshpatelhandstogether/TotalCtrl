import React from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../../slices/AnalyticSlice";
import DatePicker from "../UI/DatePicker";
import { useSelector } from "react-redux";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { setFoodRange } from "../../slices/AnalyticSlice";
import { totalPurchases } from "../../services/AnalyticsDetail/Purchases/totalPurchases";
import { useApi } from "../../hooks/useApi";
import { displayCurrency } from "../../utils/formatCurrency";
import ProgressBar from "../UI/ProgressBar";
import { biggestOrder } from "../../services/AnalyticsDetail/Purchases/biggestOrder";
import { FaAngleRight } from "react-icons/fa6";
import { biggestSupplier } from "../../services/AnalyticsDetail/Purchases/biggestSupplier";
import { priceVariation } from "../../services/AnalyticsDetail/Purchases/priceVariation";
import { FaCaretUp } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import PurchaseTabSkeleton from "./Skeleton/PurchaseTabSkeleton";

export default function PurchaseTab() {
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

  const {
    data: totalPurchasesData,
    loading: totalPurchasesLoading,
    refetch: totalPurchasesRefetch,
    error: totalPurchasesError,
  } = useApi(() => totalPurchases(inventoryId, startDate, endDate));
  console.log("Total purchases data in PurchaseTab:", totalPurchasesData);

  const {
    data: biggestOrderData,
    loading: biggestOrderLoading,
    refetch: biggestOrderRefetch,
    error: biggestOrderError,
  } = useApi(() => biggestOrder(inventoryId, startDate, endDate));
  console.log("Biggest order data in PurchaseTab:", biggestOrderData);

  const {
    data: biggestSupplierData,
    loading: biggestSupplierLoading,
    refetch: biggestSupplierRefetch,
    error: biggestSupplierError,
  } = useApi(() => biggestSupplier(inventoryId, startDate, endDate));
  console.log("Biggest supplier data in PurchaseTab:", biggestSupplierData);

  const {
    data: priceVariationData,
    loading: priceVariationLoading,
    refetch: priceVariationRefetch,
    error: priceVariationError,
  } = useApi(() => priceVariation(inventoryId, startDate, endDate));
  console.log("Price variation data in PurchaseTab:", priceVariationData);

  React.useEffect(() => {
    totalPurchasesRefetch();
    biggestOrderRefetch();
    biggestSupplierRefetch();
    priceVariationRefetch();
  }, [foodRange, inventoryId]);

  if (
    totalPurchasesLoading ||
    biggestOrderLoading ||
    biggestSupplierLoading ||
    priceVariationLoading
  ) {
    return <PurchaseTabSkeleton />;
  }

  if (
    totalPurchasesError ||
    biggestOrderError ||
    biggestSupplierError ||
    priceVariationError
  ) {
    return <div>Error loading data.</div>;
  }
  return (
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
            {displayCurrency(
              totalPurchasesData?.purchaseValue?.[0].totalPurchases || 0,
              totalPurchasesData?.currency,
            )}
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
              {biggestOrderData?.Data?.slice(0, 3).map((item, index) => (
                <tr
                  className="text-sm border-b border-[#e5e7eb] nth-last-1:border-b-0"
                  key={index}
                >
                  <td className="py-5 ">
                    <div className="flex-col ">
                      {item.supplierName}
                      <div>
                        <span className="text-[#6b6b6f]">#{item.number}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex-col ">
                      {displayCurrency(item.total, item?.currency)}
                      <div>
                        <a href="#" className="text-[#208e4e] font-semibold">
                          View details
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </table>
            {biggestSupplierData?.Data?.length > 3 && (
              <a
                href={`/biggestorders`}
                className="text-[#228f50]  app-bg block py-2 w-full text-center"
              >
                View more
              </a>
            )}

            {biggestOrderData?.products?.length === 0 && (
              <div className="py-10">
                <div className="text-xl font-semibold text-center">
                  No Wasted Items
                </div>
                <div className="text-sm text-gray-500 text-center">
                  No wasted items found for the selected period.
                </div>
              </div>
            )}
          </div>
          {/* <div className="my-8 w-[10px] border-b border-[#e5e7eb] w-[80%]"></div> */}
          {/* <div className={`flex gap-1`}>
            <div
              // href="#"
              className={`text-[#208e4e]  ${biggestOrderData?.Data.length > 0 ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
              disabled={biggestOrderData?.Data.length > 0 ? false : true}
              onClick={() => {
                dispatch(setActiveTab("Biggest Orders"));
                navigate("/analytics-detail");
              }}
            >
              See all biggest orders
            </div>
            <span
              className={`pt-1.5 ${biggestOrderData?.Data.length > 0 ? "" : "cursor-not-allowed opacity-50"}`}
              disabled={biggestOrderData?.Data.length > 0 ? false : true}
            >
              <FaAngleRight size={14} color="#208e4e" />
            </span>
          </div> */}
        </div>
        <div className="w-[50%]">
          <span className="text-xs font-normal text-[#8d8d90]">
            BIGGEST SUPPLIERS
          </span>

          <div className="">
            <table className="w-full text-left mt-4">
              {biggestSupplierData?.Data?.slice(0, 5).map((item, index) => (
                <tr
                  className="text-sm border-b border-[#e5e7eb] nth-last-1:border-b-0"
                  key={index}
                >
                  <td className="py-5 ">
                    <div className="flex-col ">{item.name}</div>
                  </td>
                  <td className="text-right">
                    <div className="flex-col ">
                      {displayCurrency(item.total, item?.currency)}
                    </div>
                  </td>
                </tr>
              ))}
            </table>
            {biggestSupplierData?.Data?.length >= 5 && (
              <a
                href={`/biggestsuppliers`}
                className="text-[#228f50]  app-bg block py-2 w-full text-center"
              >
                View more
              </a>
            )}

            {biggestOrderData?.products?.length === 0 && (
              <div className="py-10">
                <div className="text-xl font-semibold text-center">
                  No Wasted Items
                </div>
                <div className="text-sm text-gray-500 text-center">
                  No wasted items found for the selected period.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <h1 className="mx-12 mt-15 text-xs text-[#8d8d90]">PRICE VARIATIONS</h1>
      <div className="mx-12 mt-5 flex gap-15">
        <div className="w-[50%]">
          <div className="">
            <table className="w-full text-left mt-4">
              {priceVariationData?.increase?.slice(0, 4).map((item, index) => (
                <tr
                  className="text-sm border-b border-[#e5e7eb] nth-last-1:border-b-0"
                  key={index}
                >
                  <td className="py-5 ">
                    <div className="flex-col ">
                      {item.name}
                      <div>
                        <span className="text-[#6b6b6f]">{item.supplierName}</span>
                      </div>
                      <div className="h-5"></div>
                    </div>
                  </td>
                  <td className="text-right ">
                    <div className="flex-col ">
                      {displayCurrency(item.pricePerPurchaseUnit, item?.currency)}
                      <div className="text-[#6b6b6f]">
                        per {item.measurementUnitName}
                      </div>
                      <div className="text-[#e2232e] font-semibold text-xs">
                        <FaCaretUp className="inline" />
                        {item.variation.toFixed(2)}%
                      </div>
                      
                    </div>
                  </td>
                </tr>
              ))}
            </table>
            {priceVariationData?.increase?.length >= 4 && (
              <a
                href={`/PriceVariations`}
                className="text-[#228f50]  app-bg block py-2 w-full text-center"
              >
                View more
              </a>
            )}

            {priceVariationData?.increase?.length === 0 && (
              <div className="py-10">
                <div className="text-xl font-semibold text-center">
                  No Wasted Items
                </div>
                <div className="text-sm text-gray-500 text-center">
                  No wasted items found for the selected period.
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-[50%]">
          <div className="">
            <table className="w-full text-left mt-4">
              {priceVariationData?.decrease?.slice(0, 4).map((item, index) => (
                <tr
                  className="text-sm border-b border-[#e5e7eb] nth-last-1:border-b-0"
                  key={index}
                >
                  <td className="py-5 items-start ">
                    <div className="flex-col ">
                      {item.name}
                      <div>
                        <span className="text-[#6b6b6f]">{item.supplierName}</span>
                      </div>
                      <div className="h-5">
                      </div>
                    </div>
                  </td>
                  <td className="text-right ">
                    <div className="flex-col ">
                      {displayCurrency(item.pricePerPurchaseUnit, item?.currency)}
                      <div className="text-[#6b6b6f]">
                        per {item.measurementUnitName}
                      </div>
                      <div className="text-[#228f50] font-semibold text-xs">
                        <FaCaretDown className="inline" />
                        {item.variation.toFixed(2)}%
                      </div>
                      
                    </div>
                  </td>
                </tr>
              ))}
            </table>
            {priceVariationData?.decrease?.length >= 4 && (
              <a
                href={`/PriceVariations`}
                className="text-[#228f50]  app-bg block py-2 w-full text-center"
              >
                View more
              </a>
            )}

            {priceVariationData?.increase?.length === 0 && (
              <div className="py-10">
                <div className="text-xl font-semibold text-center">
                  No Wasted Items
                </div>
                <div className="text-sm text-gray-500 text-center">
                  No wasted items found for the selected period.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-10"></div>
    </div>
  );
}
