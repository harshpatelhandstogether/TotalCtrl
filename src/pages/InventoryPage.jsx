import { use, useEffect, useState, useRef } from "react";
import InventoryHeader from "../components/Inventory/InventoryHeader";
import InventoryFilter from "../components/Inventory/InventoryFilter";
import InventoryTable from "../components/Inventory/InventoryTable";
import { useSelector } from "react-redux";
import useDebounce from "../hooks/useDebounce";
import fetchInventory from "../services/Inventory/fetchInventory";
import fetchSupplier from "../services/Inventory/fetchSupplier";
import fetchInventoryStockValue from "../services/Inventory/fetchInventoryStockValue";
import fetchProducts from "../services/Inventory/fetchProducts";
import { useApi } from "../hooks/useApi";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import transferdItemUndo from "../services/Inventory/transferedItemUndo";
import { setInventoryList } from "../slices/InventorySlice";
import { useDispatch } from "react-redux";

export default function InventoryPage() {
  const PAGE_SIZE = 20;
  const timerRef = useRef(null);
  console.log("Rendering InventoryPage");
  const [transferedId, setTransferedId] = useState(null);
  console.log("transferedId in InventoryPage:", transferedId);
  const [tranferedSucces, setTransferSuccess] = useState(false);
  const [input, setInput] = useState("");
  const [hideContent, setHideContent] = useState(false);
  const [filter, setFilter] = useState("0,1,2");
  const [supplierId, setSupplierId] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "productName",
    direction: "ASC",
  });
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [offset, setOffset] = useState(0);

  const selectedInventoryId = useSelector(
    (state) => state.inventoryId.inventoryId,
  );
  const debouncedQuery = useDebounce(input, 500);
 

  const {
    data: inventoryList = [],
    loading: inventoryLoading,
    error: inventoryError,
    refetch: refetchInventory,
  } = useApi(fetchInventory);
  console.log("Inventory list in InventoryPage:", inventoryList);

  const dispatch = useDispatch();
  dispatch(setInventoryList(inventoryList));


  const {
    data: suppliers = [],
    loading: supplierLoading,
    error: supplierError,
  } = useApi(fetchSupplier);
  console.log("Suppliers in InventoryPage:", suppliers);

  const {
    data: stockValue = [],
    refetch: refetchStockValue,
    loading: stockValueLoading,
    error: stockValueError,
  } = useApi(
    () => fetchInventoryStockValue(selectedInventoryId),
    [selectedInventoryId],
  );

  console.log("Current stock value:", stockValue);

  const fetchProductsPage = async (newOffset = 0) => {
    if (productLoading || isFetchingNextPage) return;

    // loading control
    if (newOffset === 0) {
      setProductLoading(true); // first load
    } else {
      setIsFetchingNextPage(true); // scroll load
    }

    setProductError(null);

    try {
      const nextItems = await fetchProducts(
        debouncedQuery,
        selectedInventoryId,
        supplierId,
        filter,
        sortConfig,
        PAGE_SIZE,
        newOffset,
      );

      const safeItems = Array.isArray(nextItems) ? nextItems : [];

      //  KEY LOGIC (no isNext)
      setProducts((prev) =>
        newOffset === 0 ? safeItems : [...prev, ...safeItems],
      );

      setHasNextPage(safeItems.length === PAGE_SIZE);
      setOffset(newOffset);
    } catch (error) {
      setProductError(error);
    } finally {
      setProductLoading(false);
      setIsFetchingNextPage(false);
    }
  };

  const refetchProducts = () => fetchProductsPage(0);
  const fetchNextPage = () => fetchProductsPage(offset + PAGE_SIZE);

  console.log("Products in InventoryPage:", products);

  // refetch products when filters change
  useEffect(() => {
    console.log(
      "Filters changed, refetching products with debouncedQuery:",
      debouncedQuery,
      "selectedInventoryId:",
      selectedInventoryId,
      "supplierId:",
      supplierId,
      "filter:",
      filter,
      "sortConfig:",
      sortConfig,
    );

    setOffset(0);
    fetchProductsPage(0);
    refetchStockValue();

    console.log("Products after refetching:", products);
  }, [debouncedQuery, selectedInventoryId, supplierId, filter, sortConfig]);

  console.log("supplierId in InventoryPage:", supplierId);

  const handleProductAdded = (newProducts) => {
    setProducts((prevProducts) => [
      ...newProducts,
      ...(Array.isArray(prevProducts) ? prevProducts : []),
    ]);
    refetchStockValue();
    console.log("Refetching stock value after adding products...");
  };

  const handleInventoryChange = () => {
    console.log("Inventory changed, resetting filters and refetching products");
    setFilter("0,1,2");
    setInput("");
    setSupplierId("");
  };
  useEffect(() => {
    if (tranferedSucces) {
      timerRef.current = setTimeout(() => {
        setTransferSuccess(false);
      }, 5000);
    }
    return () => clearTimeout(timerRef.current);
  }, [tranferedSucces]);

  const { refetch: undoTransfer } = useApi(
    () => transferdItemUndo(transferedId),
    [transferedId],
    { immediate: false },
  );

  const handleUndoTransfer = async () => {
    try {
      clearTimeout(timerRef.current);
      timerRef.current = null;

      const res = await undoTransfer();
      console.log("Undo transfer response:", res);

      setTransferSuccess(false);

      refetchProducts();
    } catch (error) {
      console.error("Error occurred while undoing transfer:", error);
    }
  };
  return (
    <>
      {tranferedSucces && (
        <div className="h-10 flex items-center justify-between px-12 bg-black text-white ">
          <div className="flex gap-5 item-center justify-between">
            <span className="pt-1">
              <FaCheckCircle />
            </span>
            <h1>Transfered product successfully!</h1>
          </div>
          <div
            className="pr-5 cursor-pointer"
            onClick={() => {
              handleUndoTransfer();
            }}
          >
            UNDO
          </div>
        </div>
      )}

      <InventoryHeader
        inventoryList={inventoryList}
        inventoryLoading={inventoryLoading}
        inventoryError={inventoryError}
        onRetry={refetchInventory}
        onInventoryChange={handleInventoryChange}
      />

      <InventoryFilter
        hideContent={hideContent}
        selectedInventoryId={selectedInventoryId}
        supplierId={supplierId}
        suppliers={suppliers}
        setFilter={setFilter}
        inventoryList={inventoryList}
        setInput={setInput}
        supplierLoading={supplierLoading}
        input={input}
        setSupplierId={setSupplierId}
        stockValue={stockValue}
        products={products}
        setProducts={setProducts}
        filter={filter}
        productLoading={productLoading}
        supplierError={supplierError}
        stockValueError={stockValueError}
        productError={productError}
        refetchProducts={refetchProducts}
        onProductAdded={handleProductAdded}
        refetchStockValue={refetchStockValue}
        stockValueLoading={stockValueLoading}
        tranferedSucces={tranferedSucces}
        setTransferSuccess={setTransferSuccess}
        // quantities={quantities}
        // setQuantities={setQuantities}
        transferedId={transferedId}
        setTransferedId={setTransferedId}
      />

      <InventoryTable
        setHideContent={setHideContent}
        hideContent={hideContent}
        products={products}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        isLoading={productLoading}
        inventoryList={inventoryList}
        input={input}
        setSupplierId={setSupplierId}
        supplierId={supplierId}
        filter={filter}
        stockValue={stockValue}
        supplierError={supplierError}
        stockValueError={stockValueError}
        productError={productError}
        refetchProducts={refetchProducts}
        refetchStockValue={refetchStockValue}
        stockValueLoading={stockValueLoading}
        productLoading={productLoading}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </>
  );
}
