import React from "react";
import { MdErrorOutline } from "react-icons/md"

export default function DeliveredData({ orderDetails }) {
  return (
    <div className="overflow-x-auto overflow-y-auto overscroll-auto h-[700px] min-h-[700px]">
      {orderDetails.data.map((item) => (
        <>
          <div
            className="px-9 py-3 bg-[#f8f9fa] text-lg font-semibold border-y border-[#e6e6ed]"
            key={item.id}
          >
            <h1>{item.title}</h1>
          </div>
          <div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-sm text-[#595959] bg-[#f8f9fa] ">
                  <th className="px-9 py-4 text-left text-xs font-semibold text-[#737373]">
                    ITEMS
                  </th>
                  <th className="pr-45 py-4 text-right text-xs font-semibold text-[#737373]">
                    QUANTITY
                  </th>
                </tr>
              </thead>
              <tbody>
                {item.products.map((items) => (
                  <>
                    <tr className={`${items.qualityIssue?'': 'border-b border-[#e6e6ed]'}`} key={items.id}>
                      <td className="px-9 py-6 text-left text-sm font-medium w-[70%]">
                        {items.name || "---"}
                      </td>
                      <td className="pr-45 py-6 text-right text-sm w-[30%]">
                        {items.orderQuantity > 1 ? (
                          <div>
                            {items?.displayQuantity || "---"}
                            {items?.units
                              ? ` ${items.units.stockTaking.pluralShortcut}`
                              : ""}
                          </div>
                        ) : (
                          <div>
                            {items?.displayQuantity || "---"}
                            {items?.units
                              ? ` ${items.units.stockTaking.singularShortcut}`
                              : ""}
                          </div>
                        )}
                      </td>
                    </tr>
                    {items.qualityIssue && (
                      <tr className="border-b border-[#e6e6ed]">
                        <td colSpan={2} className="px-9 pb-4 text-left text-sm font-medium w-[70%] ">
                          <div className="mx-10 error px-4 py-3 rounded">
                            <MdErrorOutline className="inline mr-2" size={20}/>
                          {items.qualityIssue}  {items?.notes ? `| ${items.notes}`: ""}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ))}
    </div>
  );
}
