import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InventoryStatsTab from "./InventoryStatsTab";
import FoodUsageTab from "./FoodUsageTab";
import { setActiveTab } from "../../slices/AnalyticSlice";
import { useDispatch } from "react-redux";
import FoodWasteTab from "./FoodWasteTab";
import MostWasteDetail from "./MostWasteDetail";

export default function DetailTab() {
  const navigate = useNavigate();
  const inventoryList = useSelector((state) => state.inventoryId.inventoryList);
  const selectedInventoryId = useSelector(
    (state) => state.inventoryId.inventoryId,
  );
  const resolvedInventoryId = Array.isArray(selectedInventoryId)
    ? selectedInventoryId[0]
    : selectedInventoryId;
  console.log("Selected Inventory ID in DetailTab:", resolvedInventoryId);
  // const [activeTab, setActiveTab] = useState("Inventory Stats");

  const activeTab = useSelector((state) => state.analytic.activeTab);
  const dispatch = useDispatch();
  const handleTabClick = (tabName) => {
    dispatch(setActiveTab(tabName));
  };
  return (
    <div>
      <div className="px-10  text-2xl font-semibold py-6">
        {inventoryList.find((inv) => inv.id === resolvedInventoryId)?.name}
      </div>
      <div className="flex gap-7 px-10  border-b-1 border-gray-200 text-[15px] font-medium">
        <div
          className={`cursor-pointer py-4 ${activeTab === "Inventory Stats" ? " border-b-2 border-green-500" : ""}`}
          onClick={() => handleTabClick("Inventory Stats")}
        >
          Inventory Stats
        </div>
        <div
          className={`cursor-pointer py-4 ${activeTab === "Food Usage" ? "border-b-2 border-green-500" : ""}`}
          onClick={() => handleTabClick("Food Usage")}
        >
          Food Usage
        </div>
        <div
          className={`cursor-pointer py-4 ${activeTab === "Food Waste" ? "border-b-2 border-green-500" : ""}`}
          onClick={() => handleTabClick("Food Waste")}
        >
          Food Waste
        </div>
        <div
          className={`cursor-pointer py-4 ${activeTab === "Purchases" ? "border-b-2 border-green-500" : ""}`}
          onClick={() => handleTabClick("Purchases")}
        >
          Purchases
        </div>
        <div
          className={`cursor-pointer py-4 ${activeTab === "Delivery Stats" ? "border-b-2 border-green-500" : ""}`}
          onClick={() => handleTabClick("Delivery Stats")}
        >
          Delivery Stats
        </div>
        <div
          className={`cursor-pointer py-4 ${activeTab === "Transfers" ? "border-b-2 border-green-500" : ""}`}
          onClick={() => handleTabClick("Transfers")}
        >
          Transfers
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-auto overscroll-auto h-[calc(100vh-220px)]">
        {activeTab === "Inventory Stats" && (
          <InventoryStatsTab selectedInventoryId={resolvedInventoryId} />
        )}
        {activeTab === "Food Usage" && (
          <FoodUsageTab selectedInventoryId={resolvedInventoryId} />
        )}
        {activeTab === "Food Waste" && <FoodWasteTab />}
        {activeTab === "Most Waste" && <MostWasteDetail />}
        {/* {activeTab === "Purchases" && <PurchasesTab />}
        {activeTab === "Delivery Stats" && <DeliveryStatsTab />}
        {activeTab === "Transfers" && <TransfersTab />} */}
      </div>
    </div>
  );
}
