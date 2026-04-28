import React from "react";
import DetailPage from "../components/InternalOrederDetail/DetailPage";
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom"

export default function InternalOrderDetailPage() {
  const { id } = useParams();
  const refetchOrders = useOutletContext();
  return (
    <div>
      <DetailPage id={id} refetchOrders={refetchOrders} />
    </div>
  );
}
