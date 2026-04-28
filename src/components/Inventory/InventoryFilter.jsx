import { useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import Select from "react-select";
import { formatCurrency } from "../../utils/formatCurrency";
import InventoryFilterSkeleton from "./Skeleton/InventoryFilterSkeleton";
import { components } from "react-select";
import checked from "/check.png";
import AddItemModal from "./AddItemModal";
import { displayCurrency } from "../../utils/formatCurrency";
import { IoMdClose } from "react-icons/io";
import Modal from "../UI/Modal";
import TransferItemModal from "./TransferItem/TransferItemModal";

export default function InventoryFilter({
  hideContent,
  selectedInventoryId,
  supplierId,
  suppliers,
  setFilter,
  inventoryList,
  setInput,
  supplierLoading,
  input,
  setSupplierId,
  stockValue,
  products,
  setProducts,
  filter,
  setUpdate,
  productLoading,
  supplierError,
  stockValueError,
  refetchProducts,
  onProductAdded,
  refetchStockValue,
  stockValueLoading,
  tranferedSucces,
  setTransferSuccess,
  quantities,
  setQuantities,
    transferedId,
    setTransferedId,  
}) {
  const divRef = useRef(null);
  const [TransferModalOpen, setTransferModalOpen] = useState(false);
  console.log("Stock Value in InventoryFilter:", stockValue);
  const [isOpen, setIsOpen] = useState(false);
  const inventoryData = [
    { name: "ITEMS IN STOCK", value: stockValue?.totalItems || 0 },
    {
      name: "TOTAL STOCK VALUE",
      value: stockValue?.totalStockValue
        ? displayCurrency(
            stockValue?.totalStockValue,
            stockValue?.currency || "",
          )
        : `${0} kr`,
    },
    {
      name: "YOUR ACCESS TYPE",
      value:
        (inventoryList || []).find((inv) => inv.id === selectedInventoryId)
          ?.permission || "N/A",
    },
  ];

  const matchName =
    (inventoryList || []).find((inv) => inv.id === selectedInventoryId)?.name ||
    "No Inventory Selected";
  console.log("Match Name:", matchName);

  const options = [
    {
      value: [],

      label: "All Suppliers",
    },
    ...(Array.isArray(suppliers)
      ? suppliers.map((supplier) => ({
          value: [supplier.Id],
          label: supplier.Name,
        }))
      : []),
  ];

  const stocks = [
    { value: ["0", "1", "2"], label: "All items" },
    { value: ["1"], label: "In Stock" },
    { value: ["0"], label: "Out of Stock" },
    { value: ["2"], label: "Low in Stock" },
  ];

  const isEditor =
    (inventoryList || []).find((inv) => inv.id === selectedInventoryId)
      ?.permission === "Editor";

  const CustomOption = (props) => {
    const { isSelected, label } = props;

    return (
      <components.Option {...props} className="">
        <div className="flex items-center justify-between w-full">
          <span>{label}</span>

          {/* <input
            type="checkbox"
            checked={isSelected}
            readOnly
            className="w-4 h-4 accent-green-500 accent-none"
          /> */}
          {isSelected && (
            <img src={checked} alt="Checked" className="w-3 h-3" />
          )}
        </div>
      </components.Option>
    );
  };

  if (supplierLoading || stockValueLoading) {
    return <InventoryFilterSkeleton />;
  }

  return (
    <>
      <div className=" flex justify-between  transition-all duration-[500ms] ease-in-out px-8 pt-8  ">
        <div className=" flex flex-col py-5 transition-all duration-[1200ms] ease-in-out">
          <div className=" pl-4">
            <h1 className="text-3xl font-semibold">{matchName}</h1>
          </div>

          <div
            ref={divRef}
            className={`flex overflow-hidden transition-all duration-1000 ease-in-out ${
              hideContent
                ? "max-h-0 opacity-0 mt-0"
                : "max-h-[200px] opacity-100 mt-5"
            }`}
          >
            {inventoryData.map((item) => (
              <div
                key={item.name}
                className="flex flex-col gap-1 bg-white px-4 border-r-2 border-gray-300 nth-last-1:border-r-0 tracking-wide"
              >
                <label className="text-xs text-[#6b6b6f]">{item.name}</label>
                <label className="text-lg font-semibold">{item.value}</label>
              </div>
            ))}
          </div>
          {stockValueError && (
            <div className="text-red-500 text-sm mt-1 ml-4">
              {"Failed to load stock value. Please try again."}
            </div>
          )}
        </div>
        <div className=" py-5 flex justify-end gap-6 text-right w-[50%]  transition duration-300 ease-in-out font-medium pr-2">
          <button className="flex justify-center items-center gap-2 px-[6px] py-[9px] text-black cursor-pointer border border-gray-300 rounded-md h-10 text-[14px] ">
            <img src="https://dev.totalctrl.com/restaurant/admin/img/download.svg"></img>
            <label className="cursor-pointer">Download CSV</label>
          </button>
          {(inventoryList || []).find((inv) => inv.id === selectedInventoryId)
            ?.permission === "Editor" && (
            <button
              className={` flex justify-center items-center gap-2 px-[6px] py-[9px] text-black cursor-pointer border border-gray-300 rounded-md h-10 text-[14px]${!isEditor && "invisible flex justify-center items-center gap-2 px-[6px] py-[9px] text-black cursor-pointer border border-gray-300 rounded-md h-10 text-[14px]"}`}
              onClick={() => setTransferModalOpen(true)}
            >
              <img src="https://dev.totalctrl.com/restaurant/admin/img/swap-horizontal.svg"></img>
              <label className="cursor-pointer">Transfer items</label>
            </button>
          )}
          {(inventoryList || []).find((inv) => inv.id === selectedInventoryId)
            ?.permission === "Editor" ? (
            <button
              className="flex justify-center items-center gap-2 px-[6px] py-[9px] text-black cursor-pointer border border-gray-300 rounded-md bg-[#23a956] h-10 text-[14px] hover:bg-green-600"
              onClick={() => setIsOpen(true)}
            >
              <div className="flex justify-between items-center gap-2   text-white font-semibold cursor-pointer">
                <img src="https://dev.totalctrl.com/restaurant/admin/img/plus_icon.png"></img>
                <label className="cursor-pointer">Add items</label>
              </div>
            </button>
          ) : (
            <button
              disabled={!isEditor}
              className={`flex items-center gap-2 px-[6px] py-[9px] border rounded-md h-10 text-[14px]
                        ${
                          isEditor
                            ? "bg-[#23a956] hover:bg-green-600 text-white cursor-pointer"
                            : "bg-[#afdebf]  text-white cursor-not-allowed border-none"
                        }
                      `}
              onClick={() => setIsOpen(true)}
            >
              <div className="flex justify-between items-center gap-2   text-white font-semibold cursor-pointer">
                <img src="https://dev.totalctrl.com/restaurant/admin/img/plus_icon.png"></img>
                <label className="cursor-pointer">Add items</label>
              </div>
            </button>
          )}
        </div>
      </div>

      <div className="px-8 py-4  flex gap-5 w-full">
        <div className="pl-2">
          <Select
            className="w-[250px]"
            options={options}
            value={
              options.find((opt) => opt.value.join(",") === supplierId) ||
              options[0]
            }
            onChange={(selectedOption) => {
              const value =
                selectedOption.value.length === 0
                  ? ""
                  : selectedOption.value.join(",");

              setSupplierId(value);
            }}
            components={{
              IndicatorSeparator: () => null,
              Option: CustomOption,
            }}
            isSearchable={false}
            styles={{
              control: (base, state) => ({
                ...base,
                boxShadow: "none",
                borderColor: state.isFocused ? "#d1d5db" : "#d1d5db",
                "&:hover": {
                  borderColor: "#d1d5db",
                },
              }),
              menu: (base) => ({
                ...base,
                width: "250px",
                borderRadius: "8px",
                padding: "",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
                fontSize: "10px",
              }),

              menuList: (base) => ({
                ...base,
                padding: "20px 0",
              }),
              option: (base, state) => ({
                ...base,
                padding: "15px 20px",
                backgroundColor: state.isSelected
                  ? "#eaf7ee"
                  : state.isFocused
                    ? "#eaf7ee"
                    : "transparent",
                color: "black",
                "&:hover": {
                  backgroundColor: "rgba(201, 205, 201, 0.7)",
                  color: "black",
                },
                cursor: "pointer",
                fontWeight: "semibold",
                fontSize: "14px",
              }),
            }}
          />
          {supplierError && (
            <div className="text-red-500 text-sm mt-1">
              Failed to load suppliers
            </div>
          )}
        </div>
        <div className="">
          <Select
            className="w-[250px]"
            options={stocks}
            placeholder="All items"
            value={
              stocks.find((opt) => opt.value.join(",") === filter) || stocks[0]
            }
            onChange={(selectedOption) => {
              if (!selectedOption) {
                setFilter("");
                return;
              }

              const value = Array.isArray(selectedOption.value)
                ? selectedOption.value.join(",")
                : selectedOption.value;

              setFilter(value);
            }}
            components={{
              IndicatorSeparator: () => null,
              Option: CustomOption,
            }}
            isSearchable={false}
            styles={{
              control: (base, state) => ({
                ...base,
                boxShadow: "none",
                borderColor: state.isFocused ? "#d1d5db" : "#d1d5db",
                "&:hover": {
                  borderColor: "#d1d5db",
                },
              }),
              menu: (base) => ({
                ...base,
                width: "250px",
                borderRadius: "8px",
                // marginTop: "8px",
                padding: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
                fontSize: "10px",
              }),

              menuList: (base) => ({
                ...base,
                padding: " 0",
              }),
              option: (base, state) => ({
                ...base,
                padding: "15px 20px",
                backgroundColor: state.isSelected
                  ? "#eaf7ee"
                  : state.isFocused
                    ? "#eaf7ee"
                    : "transparent",
                color: "black",
                "&:hover": {
                  backgroundColor: "rgba(201, 205, 201, 0.7)",
                  color: "black",
                },
                cursor: "pointer",
                fontWeight: "semibold",
                fontSize: "14px",
              }),
            }}
          />
        </div>
        <div className=" relative">
          <IoSearch size={20} className="text-gray-500 absolute  ml-2 h-9" />
          <input
            type="text"
            placeholder="Search Main Inventory"
            className="px-12 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-600 h-[38px]"
            size={137}
            onChange={(e) => setInput(e.target.value)}
            value={input}
            isFocused={true}
          />
          {input && (
            <IoMdClose
              size={20}
              className="text-gray-500 absolute right-2 top-2  cursor-pointer"
              onClick={() => setInput("")}
            />
          )}
        </div>
      </div>
      <AddItemModal
        isOpen={isOpen}
        onConfirm={() => {
          setIsOpen(false);
          refetchStockValue();
        }}
        onClose={() => setIsOpen(false)}
        inventoryId={selectedInventoryId}
        products={products}
        matchName={matchName}
        stockValue={stockValue}
        selectedInventoryId={selectedInventoryId}
        inventoryList={inventoryList}
        refetchProducts={refetchProducts}
        setUpdate={setUpdate}
        onProductAdded={onProductAdded}
      />

      <Modal isOpen={TransferModalOpen} className="h-[950px] w-[1450px]">
        <TransferItemModal mode="transfer" onClose={() => setTransferModalOpen(false)} refetchProducts={refetchProducts} tranferedSucces={tranferedSucces} setTransferSuccess={setTransferSuccess} quantities={quantities} setQuantities={setQuantities} transferedId={transferedId} setTransferedId={setTransferedId} products={products} setProducts={setProducts}/>
      </Modal>
    </>
  );
}
