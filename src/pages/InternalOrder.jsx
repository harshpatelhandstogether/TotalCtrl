import React, { act, use, useEffect } from "react";
import Header from "../components/InternalOrder/Header";
import OrderTabs from "../components/InternalOrder/OrderTabs";
import Table from "../components/InternalOrder/Table";
import { useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import HeaderSkeleton from "../components/InternalOrder/skeleton/HeaderSkeleton";
import TableRowSkeleton from "../components/InternalOrder/skeleton/TableRowSkeleton";
import { useSelector } from "react-redux";
import { useApi } from "../hooks/useApi";
import { fetchOrders } from "../services/api/InternalOrders/fetchOrders";

export default function InternalOrder() {
  const [activeTab, setActiveTab] = useState("scheduled");
  const { id } = useParams();
  const inventoryId = useSelector((state) => state.inventoryId.inventoryId);
    const {
      data: orders = [],
      loading: ordersLoading,
      error: ordersError,
      refetch: refetchOrders,
    } = useApi(() => fetchOrders(inventoryId, activeTab), [inventoryId, activeTab]);

  return (
    <>
      {!id ? (
        <>
          <Header refetchOrders={refetchOrders} />
          <OrderTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <Table activeTab={activeTab}  refetchOrders={refetchOrders} ordersLoading={ordersLoading} ordersError={ordersError} orders={orders} />
        </>
      ) : (
        <Outlet context={refetchOrders}/>
      )}
    </>
  );
}
