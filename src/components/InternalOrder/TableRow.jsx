import { MdKeyboardArrowRight } from 'react-icons/md';
import formateDate from "../../utils/formateDate";
import { useSelector } from "react-redux";
import { useApi } from "../../hooks/useApi";
import { useEffect } from "react";
import { fetchOrders } from "../../services/InventoryDetail/InternalOrders/fetchOrders";
import TableRowSkeleton from "./skeleton/TableRowSkeleton";
import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function TableRow({ activeTab , refetchOrders , ordersLoading , ordersError , orders}) {
  const inventoryId = useSelector((state) => state.inventoryId.inventoryId);
    const navigate = useNavigate();
  // const {
  //   data: orders = [],
  //   loading: ordersLoading,
  //   error: ordersError,
  //   refetch: refetchOrders,
  // } = useApi(() => fetchOrders(inventoryId, activeTab), [inventoryId, activeTab]);

  useEffect(() => {
    if (inventoryId) {
      refetchOrders();
    }
  }, [inventoryId, activeTab]);

  if (ordersLoading) {
    return (
      <tr>
        <td colSpan="8" className="text-center py-4 text-gray-500">
          <TableRowSkeleton rows={5} />
        </td>
      </tr>
    );
  }

  if (ordersError) {
    return (
      <tr>
        <td colSpan="8" className="text-center py-4 text-red-500">
          Error loading orders: {ordersError.message}
        </td>
      </tr>
    );
  }

  return (
    <>
      {Array.isArray(orders) && orders.length > 0 ? (
        orders.map((order, index) => (
          <tr key={order.id} className="border-b border-[#e6e6ed] cursor-pointer" onClick={() => navigate(`/internal-orders/${order.id}`)}>
            <td className="py-10 font-medium text-sm text-left w-[18%] font-semibold">
              {order.fromInventory.name}
            </td>
            <td className="py-4 px-4 text-sm text-[#595959] text-left w-[21%]">
              {order.toInventory.name}
            </td>
            <td className="py-4 px-4  text-sm text-[#595959] text-right w-[11%]">
              #{order.orderNumber}
            </td>
            <td className="py-4 px-4  text-sm text-[#595959] text-right w-[13%]">
              {formateDate(order.orderedAt)}
            </td>
            <td className="py-4 px-4  text-sm text-[#595959] text-right w-[12.5%]">
              {formateDate(order?.lastDeliveredAt) || "---"}
            </td>
            <td className="py-4 px-4  text-sm text-[#595959] font-semibold text-right w-[12.5%]">
              <span className={`${
                order.status === "scheduled"
                  ? "bg-[#e7e7ec]"
                  : order.status === "partially-delivered"
                  ? "bg-[#fff4bd] text-[#ab9311]"
                  : "app-bg text-[#147138]"
              } rounded-md py-1 px-2 text-xs `}>
                {order.status.toUpperCase()}
              </span>
            </td>
            <td className="py-4  text-sm text-[#595959] text-right">
              {/* Additional content can go here */}
            </td>
            <td className="py-4  text-sm text-[#595959] text-right">
              <span className="flex items-center gap-1 justify-end text-[#595959] text-sm cursor-pointer">
                <MdKeyboardArrowRight size={20} />
              </span>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="8" className="flex items-center justify-center py-4  h-[60vh] text-2xl">
            No {activeTab === "scheduled" ? "scheduled" : activeTab === "partially-delivered" ? "partially delivered" : "delivered"} orders
          </td>
        </tr>
      )}
    </>
  );
}
