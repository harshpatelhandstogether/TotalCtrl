import { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/formatCurrency";
import formatDate from "../../utils/formateDate";
import { FaCheck } from "react-icons/fa6";
import InventoryRowSkeleton from "./Skeleton/InventoryRowSkeleton";
import { editItem } from "../../services/Inventory/editItem";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Modal from "../UI/Modal";
import { IoMdMore } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { FaRedo } from "react-icons/fa";
import AddItemCloseModal from "./InventoryItemAddConformationModal";
import DeleteItemModal from "./DeleteItemModal";
import { displayCurrency } from "../../utils/formatCurrency";
import { displayCurrencyWithoutSymbol } from "../../utils/formatCurrency";


export default function InventoryRow({
  selectedItems,
  setSelectedItems,
  setHideDelete,
  products,
  isLoading,
  deletedIds,
  productError,
  refetchProducts,
  refetchStockValue,
  productLoading,
  stockValueLoading,
}) {
  
  const [editingId, setEditingId] = useState(false);
  const [changeQuantity, setChangeQuantity] = useState(false);
  const [updatedProducts, setUpdatedProducts] = useState({});
  const [localProducts, setLocalProducts] = useState(products);
  const [deleteModal, setDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [openTooltip, setOpenTooltip] = useState(null);
  const [update, setUpdate] = useState(false);

  //  add this useEffect
  useEffect(() => {
    if (deletedIds?.length) {
      setLocalProducts((prev) =>
        prev.filter((p) => !deletedIds.includes(p.id)),
      );
    }
  }, [deletedIds]);
  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".tooltip-wrapper")) {
        setOpenTooltip(null);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  if (isLoading || productLoading) {
    return <InventoryRowSkeleton rows={(products || []).length} />;
  }
  

  const createPayload = (product) => {
    console.log("Creating payload for product:", product.id);
    const updated = updatedProducts[product.id];
    console.log("Updated products for payload:", updated);

    return {
      products: updated.map((p) => ({
        id: p.storeProuductExpiryDateId,
        quantity: p.quantity,
        expirationDate: p.expirationDate || null,
        isManual: 1,
        isDeleted: 0,
        stockCountItemId: null,
      })),
      stockTakingUnitId: product.stockTakingUnitId,
      inventoryId: product.products?.[0]?.inventoryId,
      dateAndTime: new Date().toLocaleString("sv-SE").replace("T", " "),
    };
  };

  const handleSave = async (product) => {
    try {
      const payload = createPayload(product);
      const response = await editItem(product.storeProductId, payload);
      console.log("Edit item response:", response);

      //  Update localProducts so UI reflects instantly
      setLocalProducts((prev) =>
        prev.map((p) => {
          if (p.id !== product.id) return p;

          const updatedSubProducts = p.products.map((sub, index) => ({
            ...sub,
            quantity: payload.products[index]?.quantity ?? sub.quantity,
          }));

          const newTotal = updatedSubProducts.reduce(
            (sum, sub) => sum + (sub.quantity || 0),
            0,
          );

          return {
            ...p,
            products: updatedSubProducts,
            totalQuantity: newTotal,
          };
        }),
      );

      setEditingId(null);
      setChangeQuantity(false);
      refetchProducts();
      refetchStockValue();
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };

  return (
    <>
      

        {localProducts?.map((product, index) => (
          <tr key={index} className="align-top border-b-1  border-gray-200 ">
            <td className="px-3 pl-5 py-8  p-4">
              <label className="flex items-center cursor-pointer gap-2">
              <input
                type="checkbox"
                className="hidden peer"
                checked={selectedItems.includes(product.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItems([...selectedItems, product.id]);
                    setHideDelete(true);
                  } else {
                    setSelectedItems(
                      selectedItems.filter((id) => id !== product.id),
                    );
                    if (selectedItems.length - 1 === 0) {
                      setHideDelete(false);
                    }
                  }
                }}
              />

              {/* Custom box */}
              <div
                className="w-5 h-5 border-2 border-gray-300 rounded-md 
                  flex items-center justify-center 
                  peer-checked:bg-green-500 peer-checked:border-green-500"
              >
                {/* Tick */}
                <FaCheck color="white" />
              </div>
            </label>
          </td>
          <td className="px-3 pl-5 py-8 font-semibold  ">
            {product.productName}
          </td>

          <td className="px-3 py-8  ">
            <div className="flex flex-col gap-5 item-end">
              {product?.products?.length > 1 && (
                <div className="">
                  <span>Multiple</span>
                </div>
              )}
              {product?.products?.length > 1 ? (
                product.products.map((p) => (
                  <div key={p.id} className="text-[#868689]">
                    {p.arrivalDate ? (
                      formatDate(p.arrivalDate)
                    ) : (
                      <p className="mb-[24px]">Not specified </p>
                    )}
                    <p className="text-[#868689]">
                      {p.storageInDays} days in storage
                    </p>
                  </div>
                ))
              ) : product.totalQuantity > 0 ? (
                <div className="">
                  {formatDate(product.products[0].arrivalDate)}
                  <p className="text-[#868689]">
                    {product.products[0].storageInDays} days in storage
                  </p>
                </div>
              ) : (
                <div>- - -</div>
              )}
            </div>
          </td>

          <td className="px-3 py-8  ">
            <div className="flex flex-col gap-5 item-end">
              {product?.products?.length > 1 && (
                <div className="">
                  <span>Multiple</span>
                </div>
              )}
              {product?.products?.length > 1 ? (
                product.products.map((p) => (
                  <div key={p.id} className="text-[#868689]">
                    {p.expirationDate ? (
                      formatDate(p.expirationDate)
                    ) : (
                      <p className="mb-[21px]">Not specified </p>
                    )}
                    {p.expirationDate &&
                      (p.daysLeft > 0 ? (
                        <p className="text-[#4c41a2] bg-[#e6e3ff] w-max px-1 rounded-sm text-[12px] font-semibold">
                          {p.daysLeft} DAYS LEFT
                        </p>
                      ) : (
                        <p className="text-[#a71a23] bg-[#ffe3e5] w-max px-1 rounded-sm text-[12px] font-semibold">
                          EXPIRED
                        </p>
                      ))}
                  </div>
                ))
              ) : product.totalQuantity > 0 ? (
                <div className="">
                  {product?.products?.[0]?.expirationDate ? (
                    <div>
                      {formatDate(product.products[0].expirationDate)}
                      <p className="text-[#4c41a2] bg-[#e6e3ff] w-max px-1 rounded-sm text-[12px] font-semibold">
                        {product.products[0].daysLeft} DAYS LEFT
                      </p>
                    </div>
                  ) : (
                    <div>Not specified</div>
                  )}
                </div>
              ) : (
                <div>
                  - - -
                  {product?.products?.[0]?.daysLeft > 0 && (
                    <p className="text-[#4c41a2] bg-[#e6e3ff] w-max px-1 rounded-sm text-[12px] font-semibold">
                      {product.products[0].daysLeft} DAYS LEFT
                    </p>
                  )}
                </div>
              )}
            </div>
          </td>

          <td className="flex flex-col px-3 py-8 ">
            {changeQuantity && product.id === editingId ? (
              product.products.length > 1 ? (
                <div className="flex flex-col gap-5 item-end">
                  {product.totalQuantity < 1 ? (
                    <div className="bg-[#e7e7ec] w-max p-1 rounded-md text-[#5b5b60]">
                      Out of stock
                    </div>
                  ) : (
                    <div>
                      {displayCurrencyWithoutSymbol(
                        product.totalQuantity,
                        product?.currency,
                      ) +
                        "  " +
                        product?.stockTakingUnit}
                    </div>
                  )}
                  <div className="flex flex-col gap-5 item-end">
                    {product.products.map((p, index) => (
                      <div
                        key={index}
                        className="flex gap-1 item-end bg-gray-200 max-w-max px-2 rounded-md mb-[20px]"
                      >
                        <input
                          type="text"
                          className="w-15"
                          min={0}
                          value={
                            updatedProducts[product.id]?.[index]?.quantity ??
                            p.quantity
                          }
                          onChange={(e) => {
                            const value = e.target.value;

                            // Allow empty input while typing
                            if (value === "") {
                              setUpdatedProducts((prev) => {
                                const existing = prev[product.id] || [
                                  ...product.products,
                                ];
                                const updatedArray = [...existing];

                                updatedArray[index] = {
                                  ...updatedArray[index],
                                  quantity: "",
                                };

                                return {
                                  ...prev,
                                  [product.id]: updatedArray,
                                };
                              });
                              return;
                            }

                            // Only allow numbers
                            if (!/^\d+$/.test(value)) return;

                            const newQuantity = Number(value);

                            setUpdatedProducts((prev) => {
                              const existing = prev[product.id] || [
                                ...product.products,
                              ];
                              const updatedArray = [...existing];

                              updatedArray[index] = {
                                ...updatedArray[index],
                                quantity: newQuantity,
                              };

                              return {
                                ...prev,
                                [product.id]: updatedArray,
                              };
                            });
                          }}
                        />

                        <span>
                          {Number(
                            updatedProducts[product.id]?.[index]?.quantity ??
                              p.quantity,
                          ) > 1
                            ? product?.stockTakingUnitPlural
                            : product?.stockTakingUnit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6 item-end">
                  {product.products.map((p, index) => (
                    <div
                      key={index}
                      className="flex gap-1 item-end bg-gray-200 max-w-max px-2 rounded-md mb-[20px]"
                    >
                      <input
                        type="text"
                        className="w-15"
                        min={0}
                        value={
                          updatedProducts[product.id]?.[index]?.quantity ??
                          p.quantity
                        }
                        onChange={(e) => {
                          const value = e.target.value;

                          // Allow empty input while typing
                          if (value === "") {
                            setUpdatedProducts((prev) => {
                              const existing = prev[product.id] || [
                                ...product.products,
                              ];
                              const updatedArray = [...existing];

                              updatedArray[index] = {
                                ...updatedArray[index],
                                quantity: "",
                              };

                              return {
                                ...prev,
                                [product.id]: updatedArray,
                              };
                            });
                            return;
                          }

                          // Only allow numbers
                          if (!/^\d+$/.test(value)) return;

                          const newQuantity = Number(value);

                          setUpdatedProducts((prev) => {
                            const existing = prev[product.id] || [
                              ...product.products,
                            ];
                            const updatedArray = [...existing];

                            updatedArray[index] = {
                              ...updatedArray[index],
                              quantity: newQuantity,
                            };

                            return {
                              ...prev,
                              [product.id]: updatedArray,
                            };
                          });
                        }}
                      />

                      <span>
                        {Number(
                          updatedProducts[product.id]?.[index]?.quantity ??
                            p.quantity,
                        ) > 1
                          ? product?.stockTakingUnitPlural
                          : product?.stockTakingUnit}
                      </span>
                    </div>
                  ))}
                </div>
              )
            ) : product.totalQuantity < 1 ? (
              <div className="bg-[#e7e7ec] w-max p-1 rounded-md text-[#5b5b60]">
                Out of stock
              </div>
            ) : (
              <div className="flex flex-col gap-5 item-end">
                {product.totalQuantity < 1 ? (
                  <div className="bg-[#e7e7ec] w-max p-1 rounded-md text-[#5b5b60]">
                    Out of stock
                  </div>
                ) : (
                  <div>
                    {displayCurrencyWithoutSymbol(
                      product?.totalQuantity,
                      product?.currency,
                    ) + "  "}
                    {product.totalQuantity > 1
                      ? product?.stockTakingUnitPlural
                      : product?.stockTakingUnit}
                  </div>
                )}

                {product?.products?.length > 1 && (
                  <div className="flex flex-col gap-4 item-end text-[#868689] ">
                    {product.products.map((p) => (
                      <div key={p.id} className="text-[#868689] mb-[26px]">
                        {displayCurrencyWithoutSymbol(
                          p.quantity,
                          product?.currency,
                        ) + "  "}
                        {p.quantity > 1
                          ? product?.stockTakingUnitPlural
                          : product?.stockTakingUnit}
                        <p></p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </td>

          <td className="px-3 py-8 ">
            <div className="flex flex-col gap-5 item-end">
              {displayCurrency(
                product.pricePerStockTakingUnit,
                product?.currency,
              )}
              {product?.products?.length > 1 && (
                <div className="flex flex-col gap-4 item-end text-[#868689]">
                  {product.products.map((p) => (
                    <div key={p.id} className="text-[#868689] mb-[26px]">
                      {displayCurrency(
                        p.pricePerStockTakingUnit,
                        product?.currency,
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </td>

          <td className="px-3 py-8 pr-2 w-[10%] font-semibold ">
            <div className="flex flex-col gap-5 item-end">
              {product.totalPrice>0?displayCurrency(product?.totalPrice, product?.currency):"Not specified"}
              {product?.products?.length > 1 && (
                <div className="flex flex-col gap-4 item-end text-[#868689]">
                  {product.products.map((p) => (
                    <div key={p.id} className="text-[#868689] mb-[26px]">
                      {p.subTotalPrice>0?displayCurrency(p.subTotalPrice, product?.currency):"Not specified"}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </td>

          <td className="py-8 pr-2 align-top">
            {editingId === product.id ? (
              <div className="flex gap-3">
                <FaRedo
                  size={20}
                  alt="Cancel"
                  className="cursor-pointer text-[#a0a0a5] mt-1 "
                  onClick={() => {
                    setEditingId(null);
                    setChangeQuantity(false);
                  }}
                />
                <FaCheck
                  alt="Save"
                  size={25}
                  className="cursor-pointer text-[#a0a0a5]"
                  onClick={() => {
                    setEditingId(null);
                    setChangeQuantity(false);
                    handleSave(product);
                  }}
                />
              </div>
            ) : (
              <>
                <div
                  className="flex gap-2 tooltip-wrapper relative"
                  key={product.id}
                >
                  <MdEdit
                    size={25}
                    alt="Edit"
                    className="cursor-pointer text-[#a0a0a5]"
                    onClick={() => {
                      setEditingId(product.id);
                      setChangeQuantity(true);
                    }}
                  />

                  <IoMdMore
                    size={25}
                    className="cursor-pointer text-[#a0a0a5] hover:text-[#000000] transition"
                    onClick={() =>
                      setOpenTooltip(
                        openTooltip === product.id ? null : product.id,
                      )
                    }
                  />

                  {openTooltip === product.id && (
                    <div className="absolute top-full  left -translate-x-1/2 mb-2 bg-white rounded-lg shadow-md z-10 text-sm whitespace-nowrap px-4  mt-2 border-2 border-gray-300 ">
                      <div
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-black"
                        onClick={() => {
                          setProductToDelete(product);
                          setDeleteModal(true);
                          setOpenTooltip(null);
                        }}
                      >
                        Delete item
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </td>
        </tr>
      ))}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        className="w-[700px] h-[420px]  "
      >
        <DeleteItemModal
          onConfirm={() => {
            setLocalProducts((prev) =>
              prev.filter((p) => p.id !== productToDelete.id),
            );
            setDeleteModal(false);
            setProductToDelete(null);
            refetchProducts();
            refetchStockValue();
          }}
          onCancel={() => setDeleteModal(false)}
          product={productToDelete}
          refetchProducts={refetchProducts}
        />
      </Modal>
      {productError && (
        <div className="text-red-500 text-center mt-4">
          {"Failed to load products. Please try again."}
        </div>
      )}
    </>
  );
}
