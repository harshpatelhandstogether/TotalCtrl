import TableRow from "./TableRow";

export default function Table({ activeTab , refetchOrders , ordersLoading , ordersError , orders}) {
  return (
    <>
      <div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#f8f9fa]">
            <tr className="">
              <th className="border-y border-[#e6e6ed] py-4 px-4 pl-12 font-semibold text-xs text-[#777777] text-left w-[20%]">
                FROM INVENTORY
              </th>
              <th className="border-y border-[#e6e6ed] py-4 px-4 font-semibold text-xs text-[#777777] text-left w-[20%]">
                TO INVENTORY
              </th>
              <th className="border-y border-[#e6e6ed] py-4 px-4 font-semibold text-xs text-[#777777] text-right w-[10%]">
                ORDER NUMBER
              </th>
              <th className="border-y border-[#e6e6ed] py-4 px-4 font-semibold text-xs text-[#777777] text-right w-[12%]">
                ORDERED
              </th>
              <th className="border-y border-[#e6e6ed] py-4 px-4 font-semibold text-xs text-[#777777] text-right w-[12%]">
                LAST DELIVERED
              </th>
              <th className="border-y border-[#e6e6ed] py-4 px-4 font-semibold text-xs text-[#777777] text-right w-[12%]">
                ORDER STATUS
              </th>
              <th className="border-y border-[#e6e6ed] py-4 px-4 font-semibold text-xs text-[#777777] text-right"></th>
              <th className="border-y border-[#e6e6ed] py-4 px-4 font-semibold text-xs text-[#777777] text-right pr-14"></th>
            </tr>
          </thead>
        </table>
        <div className="px-12 overflow-x-auto overflow-y-auto overscroll-auto  h-[800px]">
          <table className="w-full text-left border-collapse "> 
            <tbody className="">
              {/* {Array.isArray(orders) && orders.length > 0 && ( */}
              <TableRow activeTab={activeTab} refetchOrders={refetchOrders} ordersLoading={ordersLoading} ordersError={ordersError} orders={orders} />
              {/* )} */}
            </tbody>
            </table>
          </div>
      </div>
    </>
  );
}
