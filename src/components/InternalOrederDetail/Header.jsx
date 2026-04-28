import React from "react";
import { useSelector } from "react-redux";
import { RiArrowLeftLongLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export default function Header({ orderDetails }) {
  const navigate = useNavigate();
  const inventoryList = useSelector((state) => state.inventoryId.inventoryList);
  const selectedInventoryId = useSelector(
    (state) => state.inventoryId.inventoryId,
  );
  const selectedInventory = inventoryList.find(
    (inv) => inv.id === selectedInventoryId,
  );
  return (
    <div className="px-8  border-b-1 border-gray-200">
      <nav className="bg-white h-20 flex justify-start items-center pl-4 text-sm ">
        <div
          className="flex items-center gap-3 cursor-pointer "
          onClick={() => navigate("/internal-orders")}
        >
          <span>
            <RiArrowLeftLongLine size={25} />
          </span>
          <div className="text-[#a6a6a9] pr-1">Internal Orders </div>
        </div>
        <div className="flex item-center ">
          <div>
            {/* {" "} */}/ {selectedInventory?.name} (
            {orderDetails?.orderNumber}){" "}
          </div>
        </div>
      </nav>
    </div>
  );
}
