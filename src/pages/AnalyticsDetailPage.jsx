import React from "react";
import Header from "../components/AnalyticsDetail/Header";
import DetailPage from "../components/AnalyticsDetail/DetailTab";
import { Outlet } from "react-router-dom";

export default function AnalyticsDetailPage() {


  return (
    <>
  
        <div>
          <Header />
          <DetailPage />
        </div>
      
    </>
  );
}
