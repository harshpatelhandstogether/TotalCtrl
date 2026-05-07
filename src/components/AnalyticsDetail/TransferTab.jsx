import React, { useEffect } from "react";
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

export default function TransferTab() {
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
  } = useApi(() => inTransfer(inventoryId, startDate, endDate));
  console.log("In Transfer data in TransferTab:", inTransferData);

  const {
    data: outTransferData,
    loading: outTransferLoading,
    refetch: outTransferRefetch,
    error: outTransferError,
  } = useApi(() => outTransfer(inventoryId, startDate, endDate));
  console.log("Out Transfer data in TransferTab:", outTransferData);

  useEffect(() => {
    inTransferRefetch();
    outTransferRefetch();
  }, [Transfer, inventoryId]);

  const option = [
    { value: "both", label: "Show all(Transferred in and Transferred out)" },
    { value: "1", label: "Transferred In" },
    { value: "2", label: "Transferred Out" },
  ];

  return (
    <div>
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
                    {displayCurrency(inventory.value, inTransferData?.currency)}
                  </div>
                </div>
                <div className="my-2">
                  <ProgressBar className="h-1.5 " color="#23a956" width={inventory.percentage}/>
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
                  <ProgressBar className="w-[100%] h-1.5 " color="#23a956" width={inventory?.percentage}/>
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
            <SelectDropdown dataList={option} loading={false} error={false} />
            <SelectDropdown />
          </div>
        </div>
      </div>
    </div>
  );
}
