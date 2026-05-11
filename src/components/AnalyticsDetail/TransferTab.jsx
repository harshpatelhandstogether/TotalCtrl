import React, { useMemo, useState } from "react";
import DatePicker from "../UI/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { setFoodRange } from "../../slices/AnalyticSlice";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { useApi } from "../../hooks/useApi";
import { inTransfer } from "../../services/AnalyticsDetail/Transfer/inTransfer";
import { outTransfer } from "../../services/AnalyticsDetail/Transfer/outTransfer";
import { displayCurrency } from "../../utils/formatCurrency";
import { Progress } from "flowbite-react";
import ProgressBar from "../UI/ProgressBar";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import SelectDropdown from "../UI/SelectDropdown";
import { fetchItemInventories } from "../../services/AnalyticsDetail/Transfer/itemInventories";
import { fetchItems } from "../../services/AnalyticsDetail/Transfer/FetchItems";
import formatDate from "../../utils/formateDate";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import TransferTabSkeleton from "./Skeleton/TransferTabSkeleton";

export default function TransferTab() {
  const [transferFilter, setTransferFilter] = useState("both");
  const [sortConfig, setSortConfig] = useState({
    key: "transferDate",
    direction: "DESC",
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();
  const inventoryId = useSelector((state) => state.inventoryId.inventoryId);
  const Transfer = useSelector((state) => state.analytic.byKey["Transfer"]);
  const DATE_FORMAT = "yyyy-MM-dd";

  const startDate =
    Transfer?.startDate ?? format(startOfMonth(new Date()), DATE_FORMAT);
  const endDate =
    Transfer?.endDate ?? format(endOfMonth(new Date()), DATE_FORMAT);

  const parsedRange = {
    ...Transfer,
    startDate: startDate,
    endDate: endDate,
  };

  const {
    data: inTransferData,
    loading: inTransferLoading,
    refetch: inTransferRefetch,
    error: inTransferError,
  } = useApi(
    () => inTransfer(inventoryId, startDate, endDate),
    [inventoryId, startDate, endDate],
  );

  const {
    data: outTransferData,
    loading: outTransferLoading,
    refetch: outTransferRefetch,
    error: outTransferError,
  } = useApi(
    () => outTransfer(inventoryId, startDate, endDate),
    [inventoryId, startDate, endDate],
  );

  const {
    data: itemInventoriesData,
    loading: itemInventoriesLoading,
    error: itemInventoriesError,
    refetch: itemInventoriesRefetch,
  } = useApi(
    () => fetchItemInventories(inventoryId, startDate, endDate),
    [inventoryId, startDate, endDate],
  );

  const {
    data: fetchItemsData,
    loading: fetchItemsLoading,
    error: fetchItemsError,
    refetch: fetchItemsRefetch,
  } = useApi(
    () =>
      fetchItems(
        inventoryId,
        startDate,
        endDate,
        transferFilter,
        selectedItem,
        sortConfig,
      ),
    [inventoryId, startDate, endDate, transferFilter, selectedItem, sortConfig],
  );

  const option = [
    { value: "1,2", label: "Show all(Transferred in and Transferred out)" },
    { value: "1", label: "Transferred In" },
    { value: "2", label: "Transferred Out" },
  ];

  const allInventoryIds = useMemo(
    () =>
      Array.isArray(itemInventoriesData?.Data)
        ? itemInventoriesData.Data.map((item) => item.id)
        : [],
    [itemInventoriesData?.Data],
  );

  const ItemInventoryOption = [
    {
      value: "",
      label: "All Inventories from/to",
    },
    ...(Array.isArray(itemInventoriesData?.Data)
      ? itemInventoriesData.Data.map((item) => ({
          value: item.id,
          label: item.name,
        }))
      : []),
  ];
  const handleSort = (column) => {
    let direction = "ASC";

    if (sortConfig.key === column && sortConfig.direction === "ASC") {
      direction = "DESC";
    }

    // setIsSorting(true);

    setSortConfig({
      key: column,
      direction,
    });
  };

  if (
    fetchItemsLoading ||
    inTransferLoading ||
    outTransferLoading ||
    itemInventoriesLoading
  ) {
    return <TransferTabSkeleton />;
  }

  const renderSortIcon = (column) => {
    if (sortConfig.key !== column) {
      return <FaChevronUp className="inline ml-1 text-gray-500" size={10} />;
    }

    if (sortConfig.direction === "ASC") {
      return <FaChevronUp className="inline ml-1 text-green-500" size={10} />;
    }

    return <FaChevronDown className="inline ml-1 text-green-500" size={10} />;
  };

  return (
    <div>
      {inTransferData?.transferredValue === 0 &&
      outTransferData?.transferredValue === 0 ? (
        <>
        <div className="flex items-center justify-between py-6 px-12">
            <h1 className="text-xl font-semibold">Transfers</h1>
            <div className="flex items-center gap-4">
              <button className="px-4 py-[6px] border border-gray-300 rounded-md text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50" disabled>
                Export Data
              </button>

              <DatePicker
                value={parsedRange}
                onChange={(newRange) =>
                  dispatch(
                    setFoodRange({
                      key: "Transfer",
                      startDate: format(newRange.startDate, "yyyy-MM-dd"),
                      endDate: format(newRange.endDate, "yyyy-MM-dd"),
                    }),
                  )
                }
              />
            </div>
          </div>
        <div className="flex flex-col items-center justify-center gap-3 mt-20">
          <div className="text-2xl font-semibold">No items transferred</div>
          <div className="text-[#97979b]">
            There aren't any items transferred into or from this inventory yet.
          </div>
        </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between py-6 px-12">
            <h1 className="text-xl font-semibold">Transfers</h1>
            <div className="flex items-center gap-4">
              <button className="px-4 py-[6px] border border-gray-300 rounded-md text-sm font-semibold ">
                Export Data
              </button>

              <DatePicker
                value={parsedRange}
                onChange={(newRange) =>
                  dispatch(
                    setFoodRange({
                      key: "Transfer",
                      startDate: format(newRange.startDate, "yyyy-MM-dd"),
                      endDate: format(newRange.endDate, "yyyy-MM-dd"),
                    }),
                  )
                }
              />
            </div>
          </div>

          <div className="px-12 flex mt-10 w-[90%]">
            <div className="w-[50%]">
              <div className="flex gap-1 text-lg font-medium ">
                Total value Transferred
                <div className=" flex gap-1 item-center text-[#23a956]">
                  <FaRegArrowAltCircleRight className="mt-1" />
                  IN
                </div>
              </div>
              <div className="my-5 text-6xl font-normal">
                {displayCurrency(
                  inTransferData?.transferredValue,
                  inTransferData?.currency,
                )}
              </div>
              <div className="font-normal text-sm">
                {`${inTransferData?.totalItems} items transferred from ${inTransferData?.totalInventories} inventories`}
              </div>
            </div>
            <div className="w-[50%]">
              <div>
                <div className="flex gap-1 text-lg font-medium ">
                  Analysis of items transferred
                  <div className=" flex gap-1 item-center text-[#23a956]">
                    <FaRegArrowAltCircleRight className="mt-1" />
                    IN
                  </div>
                </div>
                {inTransferData?.inventories?.map((inventory) => (
                  <div key={inventory.id} className=" mt-4 text-sm">
                    <div className="flex items-center justify-between gap-2 my-5">
                      <div>
                        {inventory.name} ({inventory.percentage}%)
                      </div>
                      <div>
                        {displayCurrency(
                          inventory.value,
                          inTransferData?.currency,
                        )}
                      </div>
                    </div>
                    <div className="my-2">
                      <ProgressBar
                        className="h-1.5 "
                        color="#23a956"
                        width={inventory.percentage}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="px-12 flex mt-10 w-[90%]">
            <div className="w-[50%]">
              <div className="flex gap-1 text-lg font-medium ">
                Total value Transferred
                <div className=" flex gap-1 item-center text-[#e6464e]">
                  <FaRegArrowAltCircleLeft className="mt-1" />
                  OUT
                </div>
              </div>
              <div className="my-5 text-6xl font-normal">
                {displayCurrency(
                  outTransferData?.transferredValue,
                  outTransferData?.currency,
                )}
              </div>
              <div className="font-normal text-sm">
                {`${outTransferData?.totalItems} items transferred from ${outTransferData?.totalInventories} inventories`}
              </div>
            </div>
            <div className="w-[50%]">
              <div>
                <div className="flex gap-1 text-lg font-medium ">
                  Analysis of items transferred
                  <div className=" flex gap-1 item-center text-[#e6464e]">
                    <FaRegArrowAltCircleLeft className="mt-1" />
                    OUT
                  </div>
                </div>
                {outTransferData?.inventories?.map((inventory) => (
                  <div key={inventory.id} className=" mt-4 text-sm">
                    <div className="flex items-center justify-between gap-2 my-5">
                      <div>
                        {inventory.name} ({inventory.percentage}%)
                      </div>
                      <div>
                        {displayCurrency(
                          inventory.value,
                          outTransferData?.currency,
                        )}
                      </div>
                    </div>
                    <div className="my-2">
                      <ProgressBar
                        className="w-[100%] h-1.5 "
                        color="#23a956"
                        width={inventory?.percentage}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 mx-12">
            <div className="flex justify-between ">
              <div className="text-lg font-medium ">Transfer information</div>
              <div className="flex gap-4">
                <SelectDropdown
                  dataList={option}
                  loading={false}
                  error={false}
                  value={
                    option.find((o) => o.value === transferFilter) ?? option[0]
                  }
                  onChange={(selected) => setTransferFilter(selected.value)}
                  placeholder="Show all"
                />
                <SelectDropdown
                  dataList={ItemInventoryOption}
                  loading={itemInventoriesLoading}
                  error={itemInventoriesError}
                  value={
                    ItemInventoryOption.find((o) => o.value === selectedItem) ??
                    null
                  }
                  onChange={(selected) => setSelectedItem(selected.value)}
                  placeholder="Select Item"
                  default={ItemInventoryOption[0]}
                />
              </div>
            </div>
          </div>

          <div className="border rounded-lg border-gray-200 mx-12 mt-10">
            <div className="bg-[#f8f9fa] rounded-lg border-b border-gray-200">
              <table className="w-[95%] border-collapse ml-[2.5%] rounded-lg ">
                <tr className=" ">
                  <th
                    className={`font-medium p-4 text-[#848484] text-xs text-left w-[10%] `}
                  >
                    TYPE
                  </th>
                  <th
                    className={`font-medium p-2  text-xs text-left w-[20%] ${sortConfig.key === "name" ? "text-green-500" : "text-[#848484]"}`}
                    onClick={() => handleSort("name")}
                  >
                    ITEM
                    {renderSortIcon("name")}
                  </th>
                  <th
                    className={`font-medium p-2  text-xs text-left w-[10%] ${sortConfig.key === "transferDate" ? "text-green-500" : "text-[#848484]"}`}
                    onClick={() => handleSort("transferDate")}
                  >
                    TRANSFER DATE
                    {renderSortIcon("transferDate")}
                  </th>
                  <th
                    className={`font-medium p-2  text-xs text-left w-[15%] ${sortConfig.key === "transferredBy" ? "text-green-500" : "text-[#848484]"}`}
                    onClick={() => handleSort("transferredBy")}
                  >
                    TRANSFERRED BY
                    {renderSortIcon("transferredBy")}
                  </th>
                  <th
                    className={`font-medium p-2  text-xs text-left w-[15%] ${sortConfig.key === "involvedInventoryName" ? "text-green-500" : "text-[#848484]"}`}
                    onClick={() => handleSort("involvedInventoryName")}
                  >
                    INVENTORY
                    {renderSortIcon("involvedInventoryName")}
                  </th>
                  <th
                    className={`font-medium p-2  text-xs text-left w-[20%] ${sortConfig.key === "totalTransferredQty" ? "text-green-500" : "text-[#848484]"}`}
                    onClick={() => handleSort("totalTransferredQty")}
                  >
                    QUANTITY
                    {renderSortIcon("totalTransferredQty")}
                  </th>
                  <th
                    className={`font-medium p-2  text-xs text-right w-[10%] ${sortConfig.key === "totalTransferredValue" ? "text-green-500" : "text-[#848484]"}`}
                    onClick={() => handleSort("totalTransferredValue")}
                  >
                    VALUE
                    {renderSortIcon("totalTransferredValue")}
                  </th>
                </tr>
              </table>
            </div>
            <div className="overflow-x-auto overflow-y-auto overscroll-auto h-[400px]">
              <table className="w-[95%] border-collapse ml-[2.5%] rounded-lg ">
                {fetchItemsData?.products?.map((item, index) => (
                  <tr
                    className="border-b border-gray-200 nth-last-1:border-b-0"
                    key={index}
                  >
                    <td className="py-6 text-sm text-left w-[10%]">
                      {item.transferType === 2 && (
                        <div className=" flex gap-1 item-center text-[#e6464e]">
                          <FaRegArrowAltCircleLeft className="mt-1" />
                          OUT
                        </div>
                      )}
                      {item.transferType === 1 && (
                        <div className=" flex gap-1 item-center text-[#23a956]">
                          <FaRegArrowAltCircleRight className="mt-1" />
                          IN
                        </div>
                      )}
                    </td>
                    <td className="py-2 text-sm text-left w-[20%]">
                      {item.name}
                    </td>
                    <td className="py-6 text-sm text-left w-[10%]">
                      {formatDate(item?.transferDate)}
                    </td>
                    <td className="py-2 text-sm text-left w-[15%]">
                      {item.transferredBy}
                    </td>
                    <td className="py-2 text-sm text-left w-[15%]">
                      {item.involvedInventoryName}
                    </td>
                    <td className="py-2 text-sm text-left w-[20%]">
                      {item.totalTransferredQty > 1
                        ? `${item.totalTransferredQty} ${item.stockTakingUnitPlural}`
                        : `${item.totalTransferredQty} ${item.stockTakingUnit}`}
                    </td>
                    <td className="py-2 text-sm text-right w-[10%]">
                      {displayCurrency(
                        Math.round(item.totalTransferredValue || 0),
                        fetchItemsData?.currency,
                      )}
                    </td>
                  </tr>
                ))}
                <tr>
                  <div>
                    {fetchItemsData?.products?.length === 0 && (
                      <div className="flex flex-col items-center gap-3 mt-20">
                        <img
                          src=""
                          alt="No data"
                          className="w-32 h-32 object-contain"
                        />
                        <h1 className=" text-2xl">No Data Available</h1>
                        <h2 className="text-[#9e9ea1] text-lg">
                          No transfer data available for the selected date
                          range.
                        </h2>
                      </div>
                    )}
                  </div>
                </tr>
              </table>
            </div>
          </div>
          <div className="h-10"></div>
        </>
      )}
    </div>
  );
}
