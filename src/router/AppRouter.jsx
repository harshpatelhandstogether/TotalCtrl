import { Route, Routes } from "react-router-dom";
import InventoryPage from "../pages/InventoryPage";
import RootLayout from "../pages/RootLayout";
import ExternalOrder from "../pages/ExternalOrder";
import InternalOrder from "../pages/InternalOrder";
import InternalOrderDetailPage from "../pages/InternalOrderDetailPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import AnalyticsDetailPage from "../pages/AnalyticsDetailPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route path="/inventories" element={<InventoryPage />} />
        <Route path="/external-orders" element={<ExternalOrder />} />
        <Route path="/internal-orders" element={<InternalOrder />}>
          <Route path=":id" element={<InternalOrderDetailPage />} />
        </Route>
        <Route path="/analytics" element={<AnalyticsPage />}>
        </Route>
        <Route
          path="/inventory-count"
          element={<div>Inventory Count Page</div>}
        />
        <Route
          path="/cogs-calculator"
          element={<div>COGS Calculator Page</div>}
        />
        <Route path="/analytics-detail" element={<AnalyticsDetailPage />} />
      </Route>
    </Routes>
  );
}
