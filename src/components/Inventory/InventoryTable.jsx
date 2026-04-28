import { useRef, useEffect, useState } from "react";
import InventoryRow from "./InventoryRow";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import Modal from "../UI/Modal";
import InventoryListingDeleteModal from "./InventoryListingDeleteModal";
import InfiniteScroll from "react-infinite-scroll-component";

export default function InventoryTable({
  setHideContent,
  hideContent,
  products,
  sortConfig,
  setSortConfig,
  isLoading,

  setSupplierId,
  productLoading,
  stockValueLoading,
  productError,
  stockValue,
  refetchProducts,
  refetchStockValue,
  hasNextPage,
  fetchNextPage,
}) {
  const tableRef = useRef(null);
  console.log("Products Loading", productLoading);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [tableHeight, setTableHeight] = useState(0); // Initial height, will be updated on mount
  const [isSorting, setIsSorting] = useState(false);

  const [hideDelete, setHideDelete] = useState(false);
  const [deletedIds, setDeletedIds] = useState([]); // track deleted ids
  const safeProducts = Array.isArray(products) ? products : [];

  // Calculate height based on viewport
  const calculateHeight = () => {
    if (!tableRef.current) return;

    const rect = tableRef.current.getBoundingClientRect();

    const baseHeight = window.innerHeight - rect.top;

    const finalHeight = hideContent ? baseHeight + 52 : baseHeight;

    setTableHeight(finalHeight);
  };

  useEffect(() => {
    calculateHeight();
  }, [hideContent]); // Recalculate height when hideContent changes

  // Initial + resize
  useEffect(() => {
    calculateHeight();

    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  //  Scroll logic (ONLY behavior, no DOM height changes)
  useEffect(() => {
    const handleScroll = () => {
      if (!tableRef.current) return;

      if (isLoading || isSorting) return;

      const scrollTop = tableRef.current.scrollTop;

      if (scrollTop > 300) {
        setHideContent(true);
      } else {
        setHideContent(false);
      }
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;

      if (isNearBottom && hasNextPage && !fetchNextPage) {
        fetchNextPage();
      }
    };

    const el = tableRef.current;
    el?.addEventListener("scroll", handleScroll);

    return () => el?.removeEventListener("scroll", handleScroll);
  }, [setHideContent, isLoading, isSorting , hasNextPage, fetchNextPage]);

  const handleSort = (column) => {
    let direction = "ASC";

    if (sortConfig.key === column && sortConfig.direction === "ASC") {
      direction = "DESC";
    }

    setIsSorting(true);

    setSortConfig({
      key: column,
      direction,
    });
  };

  useEffect(() => {
    if (!isLoading) {
      setIsSorting(false);
    }
  }, [isLoading]);

  const renderSortIcon = (column) => {
    if (sortConfig.key !== column) {
      return <FaChevronUp className="inline ml-1 text-gray-500" size={10} />;
    }

    if (sortConfig.direction === "ASC") {
      return <FaChevronUp className="inline ml-1 text-green-500" size={10} />;
    }

    return <FaChevronDown className="inline ml-1 text-green-500" size={10} />;
  };

  console.log("Selected items in InventoryTable:", selectedItems);
  return (
    <>
      {hideDelete && (
        <div className="flex justify-end item-center px-10 ">
          <div className="my-1 bg-[#dcf1e3] text-[14px] p-1 rounded-md text-[#0f6f36] font-semibold px-2">
            <label>{selectedItems.length} Items Selected</label>
          </div>
          <div>
            <div className="bg-[#e2232e] ml-3 text-white rounded-md  cursor-pointer ">
              <button
                className="flex item-center p-2 cursor-pointer"
                onClick={() => {
                  setShowDeleteModal(true);
                }}
              >
                <span className="align-item-center mt-[2px] mr-2">
                  <MdDeleteOutline size={20} />
                </span>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        className="w-[650px] h-[450px]"
      >
        <InventoryListingDeleteModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={(deletedItemIds = []) => {
            setDeletedIds((prev) => [...prev, ...deletedItemIds]);
            setShowDeleteModal(false);
            setSelectedItems([]);
            setHideDelete(false);
            refetchProducts();
            refetchStockValue();
          }}
          selectedItems={selectedItems}
          products={safeProducts}
        />
      </Modal>
      <div
        ref={tableRef}
        style={{ height: tableHeight }}
        id="scrollableTable"
        className="relative overflow-x-auto overflow-y-scroll overscroll-auto border-gray-200 mt-5 w-full"
      >
        <InfiniteScroll
          dataLength={safeProducts.length}
          next={fetchNextPage || (() => {})}
          hasMore={Boolean(hasNextPage) && !isSorting && !isLoading}
          loader={
            <h4 className="text-center py-3 text-gray-400">Loading...</h4>
          }
          scrollableTarget="scrollableTable"
          style={{ overflow: "visible" }}
        >
          <table className="  bg-white  table-fixed text-[13px] relative w-full  ">
            <colgroup>
              <col style={{ width: "4%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "5%" }} />
            </colgroup>
            <thead className="bg-[#f8f9fa] align-top h-12 w-full">
              <tr className="sticky top-0 tracking-wide border-y-1 border-[#d7d7db]">
                <th className=" bg-[#f8f9fa] text-[11px] px-3 pl-5 py-2 text-left ">
                  <label className="flex items-center cursor-pointer gap-2">
                    <input
                      type="checkbox"
                      className="hidden peer"
                      checked={
                        safeProducts.length > 0 &&
                        selectedItems.length === safeProducts.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(safeProducts.map((p) => p.id));
                          setHideDelete(true);
                        } else {
                          setSelectedItems([]);
                          setHideDelete(false);
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
                      <FaCheck color="white" size={14} />
                    </div>
                  </label>
                </th>

                <th
                  onClick={() => handleSort("productName")}
                  className={` bg-[#f8f9fa] cursor-pointer text-[12px] px-3 pl-5 py-2 text-left text-[#757575] ${sortConfig.key === "productName" ? "text-green-500" : ""} w-[25%] tracking-wide font-semibold`}
                >
                  ITEM
                  {renderSortIcon("productName")}
                </th>
                <th
                  className={` bg-[#f8f9fa] cursor-pointer text-[12px] px-3 py-2 text-left text-[#757575] w-[15%] ${sortConfig.key === "arrivalDate" ? "text-green-500" : ""} tracking-wide font-semibold`}
                  onClick={() => handleSort("arrivalDate")}
                >
                  ARRIVAL INFO.
                  {renderSortIcon("arrivalDate")}
                </th>
                <th
                  className={` bg-[#f8f9fa] cursor-pointer text-[12px] px-3 py-2 text-left text-[#757575] w-[15%] ${sortConfig.key === "expirationDate" ? "text-green-500" : ""} tracking-wide font-semibold`}
                  onClick={() => handleSort("expirationDate")}
                >
                  EXPIRATION INFO.
                  {renderSortIcon("expirationDate")}
                </th>
                <th
                  className={` bg-[#f8f9fa] cursor-pointer text-[12px] px-3 py-2 text-left text-[#757575] ${sortConfig.key === "totalQuantity" ? "text-green-500" : ""} tracking-wide font-semibold`}
                  onClick={() => handleSort("totalQuantity")}
                >
                  QUANTITY
                  {renderSortIcon("totalQuantity")}
                </th>
                <th
                  className={` bg-[#f8f9fa] cursor-pointer text-[12px] px-3 py-2 text-left text-[#757575] ${sortConfig.key === "pricePerStockTakingUnit" ? "text-green-500" : ""} tracking-wide font-semibold`}
                  onClick={() => handleSort("pricePerStockTakingUnit")}
                >
                  UNIT PRICE
                  {renderSortIcon("pricePerStockTakingUnit")}
                </th>
                <th
                  className={`bg-[#f8f9fa] cursor-pointer text-[12px] px-3 py-2 text-left text-[#757575] ${sortConfig.key === "totalPrice" ? "text-green-500" : ""} tracking-wide font-semibold`}
                  onClick={() => handleSort("totalPrice")}
                >
                  TOTAL VALUE
                  {renderSortIcon("totalPrice")}
                </th>
                <th className="sticky top-0 z-20 bg-[#f8f9fa]"></th>
              </tr>
            </thead>

            <tbody className=" px-5 py-2 table-body">
              <InventoryRow
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                hideDelete={hideDelete}
                setHideDelete={setHideDelete}
                products={safeProducts}
                setSupplierId={setSupplierId}
                deletedIds={deletedIds}
                productError={productError}
                refetchProducts={refetchProducts}
                refetchStockValue={refetchStockValue}
                productLoading={productLoading}
                stockValueLoading={stockValueLoading}
              />
            </tbody>
          </table>
        </InfiniteScroll>

        {stockValue?.totalItems === 0 && (
          <div className="mx-100">
            <div className="mx-50 my-20">
              <div>
                <h4 className="px-50 mb-10">
                  <img src="https://dev.totalctrl.com/restaurant/admin/static/media/empty-state-NotFound.4948b95a.svg"></img>
                </h4>
              </div>
              <div className="text-[26px] text-black font-semibold text-center ">
                There’s nothing in this inventory yet
              </div>
              <div>
                <ul>
                  <li className="my-5 text-center text-[#6b6b6f]">
                    Start by counting and adding your current stock.
                    <br></br>
                    Use the mobile app to do it, or
                    <span className="underline"> print a paper template</span>
                    to help you note down all the required information. When
                    you’re done counting, hit the button below to add the
                    initial stock in bulk.
                  </li>
                </ul>
              </div>
              <div>
                <div className="flex justify-center bg-[#23a956] max-w-max mx-auto px-5 py-2 rounded-md text-white cursor-pointer">
                  <a>
                    <span>Set up initial stock</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        {products?.length === 0 && stockValue?.totalItems > 0 && (
          <div className="mt-5 flex justify-center">No products found</div>
        )}
      </div>
    </>
  );
}
