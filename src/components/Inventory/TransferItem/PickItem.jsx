import React from "react";
import Select from "react-select";
import { IoSearch } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { useApi } from "../../../hooks/useApi";
import fetchProducts from "../../../services/Inventory/fetchProducts";
import { useEffect, useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import checked from "/check.png";
import { components } from "react-select";
import { ThreeDot } from "react-loading-indicators";

export default function PickItem({
  fromOptionSelected,
  selectedItems,
  setSelectedItems,
  orderDetails,
  isEdit,
}) {
  const PAGE_SIZE = 20;

  const [products, setProducts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const listRef = useRef();
  const hasPrefilledEditItems = useRef(false);

  //  Fetch data
  const loadProducts = async (newOffset) => {
    if (loading) return;

    setLoading(true);

    const res = await fetchProducts(
      "",
      fromOptionSelected,
      "",
      "1",
      { key: "productName", direction: "ASC" },
      PAGE_SIZE,
      newOffset,
    );

    const newData = Array.isArray(res) ? res : [];

    //  append data
    setProducts((prev) => [...prev, ...newData]);

    setLoading(false);
  };

  //  First load
  useEffect(() => {
    if (!fromOptionSelected) return;

    setProducts([]);
    setOffset(0);
    loadProducts(0);
  }, [fromOptionSelected]);

  //  Scroll detect
  useEffect(() => {
    const handleScroll = () => {
      const el = listRef.current;
      if (!el || loading) return;

      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
        const nextOffset = offset + PAGE_SIZE;
        setOffset(nextOffset);
        loadProducts(nextOffset);
      }
    };

    const el = listRef.current;
    el?.addEventListener("scroll", handleScroll);

    return () => el?.removeEventListener("scroll", handleScroll);
  }, [offset, loading]);
  console.log("Selected items:", selectedItems);

  const uniqueProducts = [
    ...new Map(products.map((item) => [item.productName, item])).values(),
  ];

  useEffect(() => {
    if (!isEdit || hasPrefilledEditItems.current || uniqueProducts.length === 0) {
      return;
    }

    const detailProducts =
      orderDetails?.products ||
      orderDetails?.data?.flatMap((section) => section?.products || []) ||
      [];

    if (detailProducts.length === 0) {
      hasPrefilledEditItems.current = true;
      return;
    }

    const detailIds = new Set(
      detailProducts
        .map((item) => item?.productId ?? item?.id ?? item?.storeProductId)
        .filter(Boolean)
        .map((id) => String(id)),
    );

    const detailNames = new Set(
      detailProducts
        .map((item) => item?.productName ?? item?.name)
        .filter(Boolean)
        .map((name) => String(name).toLowerCase()),
    );

    const preselectedItems = uniqueProducts.filter((product) => {
      const productIds = [product?.id, product?.productId, product?.storeProductId]
        .filter(Boolean)
        .map((id) => String(id));

      const idMatched = productIds.some((id) => detailIds.has(id));
      const nameMatched = detailNames.has(
        String(product?.productName || "").toLowerCase(),
      );

      return idMatched || nameMatched;
    });

    if (preselectedItems.length > 0) {
      setSelectedItems(preselectedItems);
    }

    hasPrefilledEditItems.current = true;
  }, [isEdit, orderDetails, uniqueProducts, setSelectedItems]);

  useEffect(() => {
    if (!isEdit || uniqueProducts.length === 0) return;

    const ids = (orderDetails?.products ?? [])
      .map((p) => p?.productId)
      .filter(Boolean)
      .map(String);

    if (ids.length === 0) return;

    const selected = uniqueProducts.filter((p) =>
      ids.includes(String(p?.id)),
    );

    setSelectedItems(selected);
  }, [isEdit, orderDetails, uniqueProducts, setSelectedItems]);

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
  const options = uniqueProducts.map((product) => ({
    value: product.id,
    label: product.productName,
  }));

  const CustomOption = (props) => {
    const { isSelected, label } = props;

    return (
      <components.Option {...props} className="">
        <div className={`flex items-center gap-4 w-full py-2 px-2`}>
          <label className="flex items-center cursor-pointer gap-2">
            <input
              type="checkbox"
              className="hidden peer"
              onChange={() =>
                handleSelect(
                  uniqueProducts.find((p) => p.productName === label),
                )
              }
              checked={selectedItems.some((item) => item.productName === label)}
            />

            {/* Custom box */}
            <div
              className="w-5 h-5 border-2 border-gray-300 rounded-md
                                  flex items-center justify-center
                                  peer-checked:bg-green-500 peer-checked:border-green-500"
            >
              {/* Tick */}
              <FaCheck color="white" size={14} />
            </div>
          </label>

          <span>{label}</span>
        </div>
      </components.Option>
    );
  };


  return (
    <div className="flex h-full ">
      <div className="left w-[70%] border-r-2 border-gray-200 ">
        <div className="top h-[20%] border-b-2 border-gray-200 ">
          <div className="py-7 pl-12">
            <h1 className="text-2xl font-semibold">Pick items to transfer</h1>
            <div className="pr-3 py-5 relative">
              <span className="absolute top-7 left-4 z-20">
                <IoSearch size={20} className="text-[#8b8b8b]" />
              </span>
              <Select
                className=""
                options={options}
                placeholder={"Search items..."}
                controlShouldRenderValue={false}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                isClearable={false}
                value={options.filter((opt) =>
                  selectedItems.some((item) => item.productName === opt.label),
                )}
                onChange={(selected) => {
                  const selectedNames = selected.map((s) => s.label);
                  setSelectedItems(
                    uniqueProducts.filter((p) =>
                      selectedNames.includes(p.productName),
                    ),
                  );
                }}
                components={{
                  IndicatorSeparator: () => null,
                  Option: CustomOption,
                }}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    border: state.isFocused ? "none" : "1px solid #c7c7cfb6",
                    boxShadow: state.isFocused
                      ? "0 0 0 2px rgba(34, 197, 94, 0.81)"
                      : "none",
                    paddingLeft: "40px",
                  }),

                  menu: (base) => ({
                    ...base,
                    // borderRadius: "10px",
                    // padding: "10px",
                    // boxShadow: "0 8px 20px rgba(60, 30, 30, 0.08)",
                  }),

                  option: (base, state) => ({
                    ...base,
                    margin: "5px",
                    padding: "5px 15px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    backgroundColor: state.isSelected
                      ? "#eaf7ee"
                      : state.isFocused
                        ? "rgba(34,197,94,0.1)"
                        : "white",
                    color: "#111",
                    fontSize: "14px",
                  }),
                }}
              />
            </div>
          </div>
        </div>
        <div className="bottom h-[80%] overflow-y-auto pt-5 " ref={listRef}>
          {uniqueProducts.map((product) => (
            <div
              key={product.id}
              className="pl-12 py-3 flex items-center gap-6 "
            >
              <div
                className={`flex items-center gap-4 w-full ${selectedItems.some((item) => item.id === product.id) ? "app-bg" : "bg-white"} py-2 px-2`}
              >
                <label className="flex items-center cursor-pointer gap-2">
                  <input
                    type="checkbox"
                    className="hidden peer"
                    onChange={() => handleSelect(product)}
                    checked={selectedItems.some((item) => item.id === product.id)}
                  />

                  {/* Custom box */}
                  <div
                    className="w-5 h-5 border-2 border-gray-300 rounded-md 
                                  flex items-center justify-center 
                                  peer-checked:bg-green-500 peer-checked:border-green-500"
                  >
                    {/* Tick */}
                    <FaCheck color="white" size={14} />
                  </div>
                </label>
                <div>
                  <h1 className="text-sm "> {product.productName} </h1>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-center pt-30">
              <ThreeDot color="#32cd32" size="medium" text="" textColor="" />
            </div>
          )}
        </div>
      </div>
      <div className="right w-[30%] bg-[#fbfbfc]">
        <div className="px-12 py-6 h-full">
          <h1 className="text-2xl font-semibold h-[10%]">Selected items</h1>
          <div className=" h-[90%] overflow-y-auto">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="py-2 flex justify-between items-center "
              >
                <div className="py-2">
                  <p className="text-sm">{item.productName}</p>
                </div>
                <div>
                  <span
                    className="cursor-pointer "
                    onClick={() => handleSelect(item)}
                  >
                    <IoMdClose size={20} className="text-[#aeaeb1]" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

