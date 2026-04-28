import React from "react";

export default function ScheduleData({ orderDetails, refetchOrderDetails }) {
  return (
   <div className="overflow-x-auto overflow-y-auto overscroll-auto max-w-full">
      <table className="w-full border-collapse">
        <thead className="bg-[#f8f9fa] text-sm text-[#595959]">
          <tr className="border-y border-[#e6e6ed] text-[#777777]">
            <th className="py-4 pl-12 text-left font-medium text-xs">SKU</th>
            <th className="py-4 text-left px-4 font-medium text-xs">ITEMS</th>
            <th className="py-4 text-right px-4 font-medium text-xs">QUANTITY</th>
            <th className="py-4 text-right px-4 font-medium text-xs"></th>
          </tr>
        </thead>
      </table>
      <div className="overflow-x-auto overflow-y-auto overscroll-auto max-h-[400px]">
        <div className="px-12">
          <table className="w-full text-left border-collapse">
            <tbody>
              {orderDetails?.data[0]?.products.map((item) => (
                <tr className="border-b border-[#e6e6ed]" key={item.id}>
                  <td className="py-10 text-left font-medium text-sm w-[26%]">
                    {item?.sku || "---"}
                  </td>
                  <td className="py-4 text-left px-4 text-sm w-[34%]">
                    {item?.name || "---"}
                  </td>
                  <td className="py-4 text-right pr-8 text-sm w-[30%]">
                    {item.orderQuantity > 1 ? (
                      <div>
                        {item?.orderQuantity || "---"}
                        {item?.units
                          ? ` ${item.units.stockTaking.pluralShortcut}`
                          : ""}
                      </div>
                    ) : (
                      <div>
                        {item?.orderQuantity || "---"}
                        {item?.units
                          ? ` ${item.units.stockTaking.singularShortcut}`
                          : ""}
                      </div>
                    )}
                  </td>
                  <td className="py-4 text-right px-4 text-sm"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div> 
  );
}
