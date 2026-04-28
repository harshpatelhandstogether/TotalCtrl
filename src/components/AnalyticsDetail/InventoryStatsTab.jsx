import React, { use, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { useState } from "react";
import {
  DateRangePicker,
  defaultStaticRanges,
  createStaticRanges,
} from "react-date-range";
import {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subYears,
  subMonths,
} from "date-fns";
import { useApi } from "../../hooks/useApi";
import { fetchInventoryTotal } from "../../services/Analytics/InventoryTotal";
import { useSelector } from "react-redux";
import { displayCurrency } from "../../utils/formatCurrency";
import { fetchValueByStock } from "../../services/AnalyticsDetail/InventoryStats/value-by-stock";
import { fetchValueByCategory } from "../../services/AnalyticsDetail/InventoryStats/value-by-category";
import { fetchCheckInValueByCategory } from "../../services/AnalyticsDetail/InventoryStats/check-in";
import { fetchCheckOutValueByCategory } from "../../services/AnalyticsDetail/InventoryStats/check-out";
import InventoryStateTabSkeleton from "./Skeleton/InventoryStateTabSkeleton";
import { Skeleton } from "boneyard-js/react";


function ValueByStock({ valueByStock, inventoryTotal , valueByStockLoading }) {
    const rows = valueByStockLoading
      ? Array.from({ length: 3 }, (_, index) => ({
          id: `value-by-stock-loading-${index}`,
          name: "",
          total: 0,
        }))
      : (valueByStock?.slice(0, 3) ?? []);

    return (
      <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-4 text-sm text-[#595959] text-left w-[18%] font-semibold">
                  <label className="text-xs text-[#adadaf] font-normal">
                    VALUE BY SUPPLIER
                  </label>
                </th>
                <th className="py-4 px-4" />
              </tr>
            </thead>
            <tbody>
            {rows.map((item, index) => (
              <tr
                className="border-b border-[#e6e6ed] nth-last-1:border-b-0 cursor-pointer"
                key={item.id ?? item.name ?? index}
              >
                <td className="py-5 px-4 text-sm text-[#595959] text-left w-[18%] ">
                  <Skeleton name="ValueByStock" loading={valueByStockLoading}>
                    <span>{valueByStockLoading ? "Loading" : item.name}</span>
                  </Skeleton>
                </td>

                <td className="py-4 px-4 text-sm text-[#595959] text-right w-[11%]">
                  <Skeleton name="ValueByStock" loading={valueByStockLoading}>
                  <span>
                      {valueByStockLoading ? "Loading" :
                      displayCurrency(
                          Math.round(item.total || 0),
                          inventoryTotal?.currency,
                        )}
                  </span>
                  </Skeleton>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
    )
}


export default function InventoryStatsTab({ selectedInventoryId }) {
  const {
    data: inventoryTotal,
    loading: inventoryTotalLoading,
    error: inventoryTotalError,
    refetch: refetchInventoryTotal,
  } = useApi(() => fetchInventoryTotal(selectedInventoryId));
  console.log("inventoryTotal", inventoryTotal);

  const {
    data: valueByStock,
    loading: valueByStockLoading,
    error: valueByStockError,
    refetch: refetchValueByStock,
  } = useApi(() => fetchValueByStock(selectedInventoryId, 6, 0));

  const {
    data: valueByCategory,
    loading: valueByCategoryLoading,
    error: valueByCategoryError,
    refetch: refetchValueByCategory,
  } = useApi(() => fetchValueByCategory(selectedInventoryId, 6, 0));

  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckoutPicker, setShowCheckoutPicker] = useState(false);
  const customStaticRanges = createStaticRanges([
    {
      label: "Today",
      range: () => ({
        startDate: new Date(),
        endDate: new Date(),
      }),
    },
    {
      label: "Yesterday",
      range: () => ({
        startDate: new Date(new Date().setDate(new Date().getDate() - 1)),
        endDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      }),
    },
    {
      label: "This Week",
      range: () => ({
        startDate: new Date(
          new Date().setDate(new Date().getDate() - new Date().getDay()),
        ),
        endDate: new Date(),
      }),
    },
    {
      label: "Last Week",
      range: () => ({
        startDate: new Date(
          new Date().setDate(new Date().getDate() - new Date().getDay() - 7),
        ),
        endDate: new Date(
          new Date().setDate(new Date().getDate() - new Date().getDay() - 1),
        ),
      }),
    },
    {
      label: "This Month",
      range: () => ({
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
      }),
    },
    {
      label: "Last Month",
      range: () => ({
        startDate: startOfMonth(subMonths(new Date(), 1)),
        endDate: endOfMonth(subMonths(new Date(), 1)),
      }),
    },
    {
      label: "This Year", // ← adds full current year range
      range: () => ({
        startDate: startOfYear(new Date()),
        endDate: endOfYear(new Date()),
      }),
    },
    {
      label: "Last Year", // ← adds full last year range
      range: () => ({
        startDate: startOfYear(subYears(new Date(), 1)),
        endDate: endOfYear(subYears(new Date(), 1)),
      }),
    },
  ]);

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

  const [tempCheckInRange, setTempCheckInRange] = useState(checkInRange);
  const [tempCheckoutRange, setTempCheckoutRange] = useState(checkoutRange);

  const getLabelForRange = (range) => {
    const matched = defaultStaticRanges.find((r) => r.isSelected(range[0]));
    return matched
      ? matched.label
      : `${range[0].startDate.toLocaleDateString()} - ${range[0].endDate.toLocaleDateString()}`;
  };
  const {
    data: checkInValueByCategory,
    loading: checkInValueByCategoryLoading,
    error: checkInValueByCategoryError,
    refetch: refetchCheckInValueByCategory,
  } = useApi(() =>
    fetchCheckInValueByCategory(
      selectedInventoryId,
      6,
      0,
      checkInRange[0].startDate,
      checkInRange[0].endDate,
    ),
  );
  console.log("checkInValueByCategory", checkInValueByCategory);

  const {
    data: checkOutValueByCategory,
    loading: checkOutValueByCategoryLoading,
    error: checkOutValueByCategoryError,
    refetch: refetchCheckOutValueByCategory,
  } = useApi(() =>
    fetchCheckOutValueByCategory(
      selectedInventoryId,
      6,
      0,
      checkoutRange[0].startDate,
      checkoutRange[0].endDate,
    ),
  );
  console.log("checkOutValueByCategory", checkOutValueByCategory);

  useEffect(() => {
    refetchInventoryTotal();
    refetchValueByStock();
    refetchValueByCategory();
    refetchCheckInValueByCategory();
    refetchCheckOutValueByCategory();
  }, [selectedInventoryId, checkInRange, checkoutRange]);

  // if(inventoryTotalLoading || valueByStockLoading || valueByCategoryLoading || checkInValueByCategoryLoading || checkOutValueByCategoryLoading){
  //   return <InventoryStateTabSkeleton />
  // }

  return (
    <div className="px-10 py-10">
      <div className="header flex items-start justify-between mb-10">
        <div>
          <div className="text-xl font-semibold">Inventory</div>
          <div className="mt-8">
            <h1 className="text-sm text-[#6b6b6f]">TOTAL INVENTORY VALUE</h1>
            <Skeleton name="InventoryTotal" loading={inventoryTotalLoading}>
              <h1 className="text-6xl font-normal mt-4">
                {displayCurrency(
                  Math.round(inventoryTotal?.inventoryValue[0]?.total || 0),
                  inventoryTotal?.currency,
                )}
              </h1>
            </Skeleton>
          </div>
        </div>
        <div>
          <div className="border border-gray-300 rounded-md px-4 py-[6px]">
            <button className="text-sm font-semibold">Export Data</button>
          </div>
        </div>
      </div>
      <div className="flex gap-10 mb-10">
        <div className="valuebysupplier w-[50%]">
          {/* <table className="w-full border-collapse">
            <th className="py-4 px-4 text-sm text-[#595959] text-left w-[18%] font-semibold">
              <label className="text-xs text-[#adadaf] font-normal">
                VALUE BY SUPPLIER
              </label>
            </th>
            {valueByStock?.slice(0, 3).map((item) => (
              <tr className="border-b border-[#e6e6ed] nth-last-1:border-b-0 cursor-pointer">
                <td className="py-5 px-4 text-sm text-[#595959] text-left w-[18%] ">
                  <Skeleton name="ValueByStock" loading={valueByStockLoading}>
                    <span>{item.name}</span>
                  </Skeleton>
                </td>

                <td className="py-4 px-4 text-sm text-[#595959] text-right w-[11%]">
                  <span>
                    {displayCurrency(
                      Math.round(item.total || 0),
                      inventoryTotal?.currency,
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </table> */}
          <ValueByStock valueByStock={valueByStock} inventoryTotal={inventoryTotal} valueByStockLoading={valueByStockLoading}/>
          
          {valueByStock && valueByStock.length > 3 && (
            <a
              href="#"
              className="text-[#228f50]  app-bg block py-2 w-full text-center"
            >
              View more
            </a>
          )}
        </div>
        <div className="valuebycategory w-[50%]">
          <table className="w-full border-collapse">
            <th className="py-4 px-4 text-sm text-[#595959] text-left w-[18%] font-semibold">
              <label className="text-xs text-[#adadaf] font-normal">
                VALUE BY CATEGORY
              </label>
            </th>
            {valueByCategory?.slice(0, 3).map((item) => (
              <tr className="border-b border-[#e6e6ed] nth-last-1:border-b-0 cursor-pointer">
                <td className="py-5 px-4 text-sm text-[#595959] text-left w-[18%] ">
                  {item.name}
                </td>
                <td className="py-4 px-4 text-sm text-[#595959] text-right w-[11%]">
                  {displayCurrency(
                    Math.round(item.total || 0),
                    inventoryTotal?.currency,
                  )}
                </td>
              </tr>
            ))}
          </table>
          {valueByCategory && valueByCategory.length > 3 && (
            <a
              href="#"
              className="text-[#228f50]  app-bg block py-2 w-full text-center"
            >
              View more
            </a>
          )}
        </div>
      </div>
      <div className="flex gap-10 mb-10">
        <div className="valuebysupplier w-[50%]">
          <label className="text-xs text-[#adadaf] font-normal px-4">
            CHECK IN & OUT VALUE
          </label>
          <div className="flex items-start justify-between px-4 mt-10">
            <h1>Check in</h1>
            <div className="relative">
              <div
                className="border border-gray-300 rounded-md px-4 py-[6px] item-center flex gap-14"
                onClick={() => {
                  setTempCheckInRange(checkInRange);
                  setShowCheckInPicker((prev) => !prev);
                }}
              >
                <button className="text-sm font-normal cursor-pointer">
                  {getLabelForRange(checkInRange)}
                </button>
                {!showCheckInPicker ? (
                  <button className="cursor-pointer ">
                    <FaAngleDown className="text-[#abb1c1]" />
                  </button>
                ) : (
                  <button className="cursor-pointer ">
                    <RxCross1 size={15} className="text-black" />
                  </button>
                )}
              </div>
              {showCheckInPicker && (
                <div className="absolute right-0 z-50 mt-2 shadow-xl rounded-lg overflow-hidden border border-gray-200">
                  <DateRangePicker
                    ranges={tempCheckInRange}
                    onChange={(item) => setTempCheckInRange([item.selection])}
                    months={1}
                    direction="horizontal"
                    showDateDisplay={false}
                    staticRanges={customStaticRanges}
                    inputRanges={[]}
                    datePickerClassName="datePicker"
                    navigatorRenderer={(
                      currentFocusedDate,
                      changeShownDate,
                    ) => (
                      <div className="flex items-center justify-between  py-2 z-20">
                        <button
                          onClick={() => changeShownDate(-1, "monthOffset")}
                          className="border-2 border-gray-300 rounded-md p-1 hover:bg-gray-100 h-10 w-10 cursor-pointer"
                        >
                          <MdOutlineKeyboardArrowLeft
                            size={30}
                            className="text-[#abb1c1]"
                          />
                        </button>

                        <button
                          onClick={() => changeShownDate(1, "monthOffset")}
                          className="border-2 border-gray-300 rounded-md p-1 hover:bg-gray-100 h-10 w-10 cursor-pointer"
                        >
                          <MdOutlineKeyboardArrowRight
                            size={30}
                            className="text-[#abb1c1]"
                          />
                        </button>
                      </div>
                    )}
                  />
                  <div className="flex justify-end gap-3 px-4 py-3 bg-white border-t border-gray-200">
                    <button
                      className="px-4 py-1 text-sm rounded border border-gray-300"
                      onClick={() => setShowCheckInPicker(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-1 text-sm rounded bg-[#23a956] text-white font-semibold"
                      onClick={() => {
                        setCheckInRange(tempCheckInRange);
                        setShowCheckInPicker(false);
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {checkInValueByCategory?.TotalValue > 0 && (
            <div className="text-2xl px-4 mt-2">
              {displayCurrency(
                Math.round(checkInValueByCategory?.TotalValue),
                checkInValueByCategory?.Currency,
              )}
            </div>
          )}
          {checkInValueByCategory?.Data?.length > 0 ? (
            <div className="px-4">
              <table className="w-full border-collapse mt-6 text-sm text-[#595959]">
                {checkInValueByCategory?.Data?.slice(0, 3)?.map((category) => (
                  <tr className="border-b border-[#e6e6ed] cursor-pointer nth-last-1:border-b-0">
                    <td>{category.name}</td>
                    <td className="text-right py-4 ">
                      +{" "}
                      {displayCurrency(
                        Math.round(category?.total),
                        category.currency,
                      )}{" "}
                    </td>
                  </tr>
                ))}
              </table>
              {checkInValueByCategory?.Data?.length > 3 && (
                <a
                  href="#"
                  className="text-[#228f50]  app-bg block py-2 w-full text-center"
                >
                  View more
                </a>
              )}
            </div>
          ) : (
            <div className="flex flex-col item-center justify-center h-[200px]">
              <div className="px-4 mt-6 text-2xl text-[#595959] text-center align-middle">
                No check ins
              </div>
              <div className="px-4 mt-2 text-sm text-[#595959] text-center align-middle">
                There hasn't been any check in made during the selected time
                range.
              </div>
            </div>
          )}
        </div>
        <div className="valuebysupplier w-[50%]">
          <label className="text-xs text-[#adadaf] font-normal px-4">
            CHECK IN & OUT VALUE
          </label>
          <div className="flex items-start justify-between px-4 mt-10">
            <h1>Check out</h1>
            <div className="relative">
              <div
                className="border border-gray-300 rounded-md px-4 py-[6px] item-center flex gap-14"
                onClick={() => {
                  setTempCheckoutRange(checkoutRange);
                  setShowCheckoutPicker((prev) => !prev);
                }}
              >
                <button className="text-sm font-normal cursor-pointer">
                  {getLabelForRange(checkoutRange)}
                </button>
                {!showCheckoutPicker ? (
                  <button className="cursor-pointer ">
                    <FaAngleDown className="text-[#abb1c1]" />
                  </button>
                ) : (
                  <button className="cursor-pointer ">
                    <RxCross1 size={15} className="text-black" />
                  </button>
                )}
              </div>
              {showCheckoutPicker && (
                <div className="absolute right-0 z-50 mt-2 shadow-xl rounded-lg overflow-hidden border border-gray-200">
                  <DateRangePicker
                    ranges={tempCheckoutRange}
                    onChange={(item) => setTempCheckoutRange([item.selection])}
                    months={1}
                    direction="horizontal"
                    showDateDisplay={false}
                    staticRanges={customStaticRanges}
                    inputRanges={[]}
                    datePickerClassName="datePicker"
                    navigatorRenderer={(
                      currentFocusedDate,
                      changeShownDate,
                    ) => (
                      <div className="flex items-center justify-between  py-2 z-20">
                        <button
                          onClick={() => changeShownDate(-1, "monthOffset")}
                          className="border-2 border-gray-300 rounded-md p-1 hover:bg-gray-100 h-10 w-10 cursor-pointer"
                        >
                          <MdOutlineKeyboardArrowLeft
                            size={30}
                            className="text-[#abb1c1]"
                          />
                        </button>

                        <button
                          onClick={() => changeShownDate(1, "monthOffset")}
                          className="border-2 border-gray-300 rounded-md p-1 hover:bg-gray-100 h-10 w-10 cursor-pointer"
                        >
                          <MdOutlineKeyboardArrowRight
                            size={30}
                            className="text-[#abb1c1]"
                          />
                        </button>
                      </div>
                    )}
                  />
                  <div className="flex justify-end gap-3 px-4 py-3 bg-white border-t border-gray-200">
                    <button
                      className="px-4 py-1 text-sm rounded border border-gray-300"
                      onClick={() => setShowCheckoutPicker(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-1 text-sm rounded bg-[#23a956] text-white font-semibold"
                      onClick={() => {
                        setCheckoutRange(tempCheckoutRange);
                        setShowCheckoutPicker(false);
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {checkOutValueByCategory?.TotalValue > 0 && (
            <div className="text-2xl px-4 mt-2">
              {Math.round(checkOutValueByCategory?.TotalValue)}
            </div>
          )}
          {checkOutValueByCategory?.Data?.length > 0 ? (
            <div className="px-4">
              <table className="w-full border-collapse mt-6 text-sm text-[#595959]">
                {checkOutValueByCategory?.Data?.slice(0, 3).map(
                  (item, index) => (
                    <tr
                      className="border-b border-[#e6e6ed] cursor-pointer nth-last-1:border-b-0"
                      key={index}
                    >
                      <td>{item.name}</td>
                      <td className="text-right py-4 ">
                        -{" "}
                        {displayCurrency(Math.round(item.total), item.currency)}
                      </td>
                    </tr>
                  ),
                )}
              </table>
              {checkOutValueByCategory?.Data?.length > 3 && (
                <a
                  href="#"
                  className="text-[#228f50]  app-bg block py-2 w-full text-center"
                >
                  View more
                </a>
              )}
            </div>
          ) : (
            <div className="flex flex-col item-center justify-center h-[200px]">
              <div className="px-4 mt-6 text-2xl text-[#595959] text-center align-middle">
                No check outs
              </div>
              <div className="px-4 mt-2 text-sm text-[#595959] text-center align-middle">
                There hasn't been any check out made during the selected time
                range.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
