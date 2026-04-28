import React from "react";
import { useState } from "react";

export default function OrderTabs({ activeTab, setActiveTab }) {
  
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="flex gap-7 px-12  border-b-1 border-gray-200 text-sm font-semibold">
      <div
        className={`cursor-pointer py-4 ${activeTab === "scheduled" ? " border-b-2 border-green-500" : ""}`}
        onClick={() => handleTabClick("scheduled")}
      >
        Scheduled
      </div>
      <div
        className={`cursor-pointer py-4 ${activeTab === "partially-delivered" ? "border-b-2 border-green-500" : ""}`}
        onClick={() => handleTabClick("partially-delivered")}
      >
        Partially Delivered
      </div>
      <div
        className={`cursor-pointer py-4 ${activeTab === "delivered" ? "border-b-2 border-green-500" : ""}`}
        onClick={() => handleTabClick("delivered")}
      >
        Delivered
      </div>
    </div>
  );
}
