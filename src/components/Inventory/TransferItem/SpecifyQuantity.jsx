import React from "react";
import { IoMdClose } from "react-icons/io";
import { useEffect, useRef, useState } from "react";

export default function SpecifyQuantity({
  selectedItems,
  setSelectedItems,
  quantities,
  setQuantities,
  isEdit,
  orderDetails,
}) {
  const [errors, setErrors] = useState({});
  const [quantityError, setQuantityError] = useState(false);
  const hasPrefilledQuantities = useRef(false);

  // useEffect(() => {
  //   if (!isEdit || hasPrefilledQuantities.current || selectedItems.length === 0) {
  //     return;
  //   }

  //   const detailProducts =
  //     orderDetails?.products ||
  //     orderDetails?.data?.flatMap((section) => section?.products || []) ||
  //     [];

  //   if (detailProducts.length === 0) {
  //     hasPrefilledQuantities.current = true;
  //     return;
  //   }

  //   const quantityById = new Map();
  //   const quantityByName = new Map();

  //   detailProducts.forEach((product) => {
  //     const quantity = Number(product?.orderQuantity ?? product?.quantity ?? 0);

  //     if (quantity < 1) return;

  //     [product?.id, product?.productId, product?.storeProductId]
  //       .filter(Boolean)
  //       .map(String)
  //       .forEach((id) => quantityById.set(id, quantity));

  //     const normalizedName = String(product?.productName ?? product?.name ?? "")
  //       .toLowerCase()
  //       .trim();

  //     if (normalizedName) {
  //       quantityByName.set(normalizedName, quantity);
  //     }
  //   });

  //   setQuantities((prev) => {
  //     const next = { ...prev };

  //     selectedItems.forEach((item) => {
  //       if (next[item.id] != null) return;

  //       const matchedById = [item?.id, item?.productId, item?.storeProductId]
  //         .filter(Boolean)
  //         .map(String)
  //         .find((id) => quantityById.has(id));

  //       const matchedQuantity = matchedById
  //         ? quantityById.get(matchedById)
  //         : quantityByName.get(String(item?.productName || "").toLowerCase().trim());

  //       if (matchedQuantity >= 1) {
  //         next[item.id] = matchedQuantity;
  //       }
  //     });

  //     return next;
  //   });

  //   hasPrefilledQuantities.current = true;
  // }, [isEdit, orderDetails, selectedItems, setQuantities]);

  useEffect(() => {
  if (!isEdit || selectedItems.length === 0) return;

  const detailProducts =
    orderDetails?.products ||
    orderDetails?.data?.flatMap((s) => s?.products || []) ||
    [];

  if (detailProducts.length === 0) return;

  const nextQuantities = {};

  selectedItems.forEach((item) => {
    const match = detailProducts.find(
      (p) =>
        String(p.productId || p.id || p.storeProductId) ===
        String(item.id || item.productId || item.storeProductId)
    );

    if (match) {
      nextQuantities[item.id] = Number(
        match.orderQuantity || match.quantity || 1
      );
    }
  });

  setQuantities(nextQuantities);
}, [isEdit, orderDetails, selectedItems]);

  console.log("Selected items in SpecifyQuantity:", selectedItems);

  const handleQuantityChange = (id, value, totalQuantity) => {
    const parsedValue = parseInt(value);

    //  Validate per item here
    if (parsedValue > totalQuantity) {
      setQuantityError(true);
      setErrors((prev) => ({
        ...prev,
        [id]: `Quantity cannot exceed ${totalQuantity}`,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [id]: "" })); //  clear error
      setQuantityError(false);
    }

    setQuantities((prev) => ({
      ...prev,
      [id]: parsedValue,
    }));
  };
  console.log("Selected items in SpecifyQuantity:", quantities);
  const handleSelect = (product) => {
    setSelectedItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  return (
    <div className="h-full">
      <div className="py-10 pl-12">
        <h1 className="text-2xl font-semibold">Specify Quantity</h1>
      </div>
      <div className="mx-12 border border-gray-300">
        <div className="px-6">
          <table className="w-full text-left mr-5">
            <tbody className="">
              {selectedItems.map((item) => (
                <tr
                  key={item.id}
                  className={`${selectedItems.length < 2 ? "" : "border-b border-gray-300"}`}
                >
                  <td className="pl-5 ">
                    <div className="py-10 px-2 0">{item.productName}</div>
                  </td>
                  <td className="">
                    <div className="py-10 px-2 ">
                      {item.totalQuantity} available to transfer
                    </div>
                  </td>
                  <td className="text-right">
                    <div className=" px-2 flex items-center gap-2 bg-gray-200 rounded-md w-max">
                      <div></div>
                      <input
                        className=" rounded-md py-2 px-3 w-[100px] focus:outline-none "
                        type=""
                        placeholder=""
                        value={quantities[item.id] || ""}
                        min={1}
                        max={item.totalQuantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            e.target.value,
                            item.totalQuantity,
                          )
                        }
                        isClearable={true}
                      />
                      <p>
                        {quantities[item.id] > 1
                          ? item.stockTakingUnitPlural
                          : item.stockTakingUnit}
                      </p>
                    </div>
                    {errors[item.id] && (
                      <p className="text-red-500 text-sm text-left pt-1">
                        {errors[item.id]}
                      </p>
                    )}
                  </td>
                  <td className="pr-5">
                    <div className=" py-[40px] px-2 flex items-center justify-end">
                      <span
                        className="cursor-pointer"
                        onClick={() => handleSelect(item)}
                      >
                        <IoMdClose size={25} />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedItems.length === 0 && (
          <div className="text-center py-10 text-2xl font-semibold">
            Sorry no product found
          </div>
        )}
      </div>
    </div>
  );
}
