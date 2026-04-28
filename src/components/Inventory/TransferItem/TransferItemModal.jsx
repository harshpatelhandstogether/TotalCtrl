import { IoMdClose } from "react-icons/io";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import SelectInventory from "./SelectInventory";
import { useEffect, useState } from "react";
import PickItem from "./PickItem";
import { useApi } from "../../../hooks/useApi";
import { useSelector } from "react-redux";
import SpecifyQuantity from "./SpecifyQuantity";
import transferedItem from "../../../services/Inventory/transferedItem";
import { MdErrorOutline } from "react-icons/md";
import { addInternalOrder } from "../../../services/api/InternalOrders/AddInternalOrder";
import { editInternalOrder } from "../../../services/api/InternalOrders/EditInternalOrder";
import { ToastContainer, toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";


export default function TransferItemModal({
  mode,
  orderDetails,
  onClose,
  refetchProducts,
  refetchOrderDetails,
  refetchOrders,
}) {
  // const notify = () => toast("Order updated successfully!",{
  //   position: "bottom-center",
  //   autoClose: 5000,
  //   hideProgressBar: true,
  //   closeOnClick: true,
  //   pauseOnHover: true,
  //   draggable: true,
  //   progress: undefined,
  //   theme: "dark",
  //   borderRadius: "0px",
  //   icon: ({theme, type}) =>  <FaCheckCircle className="h-6 w-6" />

  // });

  const notify = () => {
      toast(
    ({ closeToast }) => (
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          width: "100%",
        }}
      >
        <FaCheckCircle size={20} className="text-green-500 mr-2" />
        <span style={{ flex: 1, textAlign: "start" }}>
          Order updated successfully!
        </span>

        <IoMdClose
          size={20}
          style={{ cursor: "pointer" }}
          onClick={closeToast} // ✅ closes toast
          
        />
      </div>
    ),
    {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: true,
     closeButton: false, // ✅ removes default top-right button

      theme: "dark",
      style: {
        width: "400px",
      },
    }
  );

  };

  const isEdit = mode === "edit";
  const isTransfer = mode === "transfer";
  const isAdd = mode === "add";

  const [errors, setErrors] = useState("");
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemsToTransferError, setItemsToTransferError] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [onclickedContinue, setOnClickedContinue] = useState(false);

  const inventoryList = useSelector((state) => state.inventoryId.inventoryList);
  const selectedInventoryId = useSelector(
    (state) => state.inventoryId.inventoryId,
  );

  const filteredOptions = inventoryList
    .filter(
      (inv) =>
        String(inv.permission || "")
          .toLowerCase()
          .trim() === "editor",
    )
    .map((inv) => ({ value: inv.id, label: inv.name }));

  //  Pre-fill for edit mode
  const [toSelectedOption, setToSelectedOption] = useState(
    isEdit ? orderDetails?.toInventory?.id : "",
  );
  const [fromOptionSelected, setFromOptionSelected] = useState(
    isEdit ? orderDetails?.fromInventory?.id : "",
  );

  useEffect(() => {
    if (!isEdit || !orderDetails) return;

    setFromOptionSelected(orderDetails?.fromInventory?.id || "");
    setToSelectedOption(orderDetails?.toInventory?.id || "");
  }, [isEdit, orderDetails]);

  useEffect(() => {
    setSelectedItems([]);
    setQuantities({});
    setItemsToTransferError(false);
  }, [fromOptionSelected]);

  const hasEmptyQuantity = selectedItems.some(
    (item) => !quantities[item.id] || quantities[item.id] < 1,
  );

  const AddInternalTransferPayload = {
    fromInventoryId: fromOptionSelected,
    toInventoryId: toSelectedOption,
    products: selectedItems.map((item) => ({
      storeProductItemId: item.storeProductId,
      quantity: quantities[item.id] || 0,
    })),
  };

  const { refetch: refetchAddInternalOrder } = useApi(
    () => addInternalOrder(AddInternalTransferPayload),
    [],
    { immediate: false },
  );

  const createPayload = () => ({
    fromInventoryId: fromOptionSelected,
    toInventoryId: toSelectedOption,
    products: selectedItems.map((item) => ({
      storeProductItemId: item.storeProductId,
      quantity: quantities[item.id] || 0,
    })),
  });

  const { refetch: refetchTransfer } = useApi(
    () => transferedItem(createPayload()),
    [],
    { immediate: false },
  );

  const handleTransfer = async () => {
    setErrors("");
    setHasError(false);
    setLoading(true);
    try {
      await refetchTransfer();
      setSelectedItems([]);
      setQuantities({});
      onClose();
      refetchProducts?.();
    } catch (error) {
      setErrors("Transfer failed. Please try again.");
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInternalOrder = async () => {
    setErrors("");
    setHasError(false);
    setLoading(true);
    try {
      await refetchAddInternalOrder();
      setSelectedItems([]);
      setQuantities({});
      onClose();

      refetchOrders?.();
    } catch (error) {
      setErrors("Creation failed. Please try again.");
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const { refetch: refetchEditInternalOrder } = useApi(
    () => editInternalOrder(createPayload(), orderDetails?.id),
    [],
    { immediate: false },
  );

  const handleEditInternalOrder = async () => {
    setErrors("");
    setHasError(false);
    setLoading(true);
    try {
      await refetchEditInternalOrder();
      setSelectedItems([]);
      setQuantities({});
      onClose();
      refetchOrderDetails?.();
      // refetchOrders?.();
    } catch (error) {
      setErrors("Update failed. Please try again.");
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="header h-[5%] flex items-center justify-between px-12 border-b border-gray-200 pb-6">
        <div className="flex gap-4 w-[50%] items-center justify-start text-lg font-semibold">
          {/*  Title changes based on mode */}
          <h1>
            {isEdit
              ? `Order item from  ${filteredOptions.find((opt) => opt.value === fromOptionSelected)?.label || ""} `
              : `Transfer items from ${filteredOptions.find((opt) => opt.value === fromOptionSelected)?.label || ""}`}
          </h1>
          <h1>Step {currentStep}/3</h1>
        </div>
        <button className="cursor-pointer" onClick={onClose}>
          <IoMdClose size={25} />
        </button>
      </div>

      {/* Main */}
      <div className="main h-[90%]">
        {currentStep === 1 && (
          <SelectInventory
            isEdit={isEdit}
            orderDetails={orderDetails}
            toSelectedOption={toSelectedOption}
            setToSelectedOption={setToSelectedOption}
            fromOptionSelected={fromOptionSelected}
            setFromOptionSelected={setFromOptionSelected}
            onclickedContinue={onclickedContinue}
            filteredOptions={filteredOptions}
            selectedInventoryId={selectedInventoryId}
          />
        )}
        {currentStep === 2 && (
          <PickItem
            fromOptionSelected={fromOptionSelected}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            orderDetails={orderDetails}
            isEdit={isEdit}
          />
        )}
        {currentStep === 3 && (
          <SpecifyQuantity
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            quantities={quantities}
            setQuantities={setQuantities}
            isEdit={isEdit}
            orderDetails={orderDetails}
          />
        )}
      </div>

      {/* Footer */}
      <div className="footer h-[5%] flex items-center border-t border-gray-200">
        <div className="flex justify-between gap-4 px-10 pt-6 w-full">
          <button
            className="border border-gray-300 text-[#595959] font-medium py-2 px-5 rounded-md hover:bg-gray-100 cursor-pointer hover:border-black"
            onClick={onClose}
          >
            Cancel
          </button>

          {selectedItems.length === 0 && itemsToTransferError && (
            <span className="flex items-center gap-1 text-[#ac272e] text-sm">
              <MdErrorOutline size={18} />
              Please select items to transfer.
            </span>
          )}
          {errors && hasError && (
            <span className="flex items-center gap-1 text-[#ac272e] text-sm">
              <MdErrorOutline size={18} />
              {errors}
            </span>
          )}
          {selectedItems.length === 0 && currentStep === 3 && (
            <div className="text-red-500 text-sm">Sorry no product found</div>
          )}

          <div className="flex gap-5">
            {currentStep > 1 && (
              <button
                className="border border-gray-300 text-[#595959] font-medium py-2 px-5 rounded-md hover:bg-gray-100 cursor-pointer flex items-center gap-2 hover:border-black"
                onClick={() => {
                  setCurrentStep((prev) => prev - 1);
                  setItemsToTransferError(false);
                  setHasError(false);
                }}
              >
                <FaArrowLeftLong size={15} />
                <span>Previous step</span>
              </button>
            )}

            {currentStep === 3 ? (
              <button
                className="bg-[#23a956] text-white font-medium py-2 px-5 rounded-md hover:bg-green-600 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                disabled={loading}
                onClick={() => {
                  if (hasEmptyQuantity) {
                    setErrors("Please select products or set qty to transfer");
                    setHasError(true);
                    return;
                  }
                  if (isAdd) {
                    handleCreateInternalOrder();
                  } else if (isEdit) {
                    notify();
                    handleEditInternalOrder();
                  } else {
                    handleTransfer();
                  }

                  setHasError(false);
                }}
              >
                {/*  Button label changes based on mode */}
                {loading
                  ? isEdit
                    ? "Updating..."
                    : "Transferring..."
                  : isEdit
                    ? `Update Order`
                    : `Transfer to ${filteredOptions.find((opt) => opt.value === toSelectedOption)?.label}`}
              </button>
            ) : (
              <button
                className="bg-[#23a956] text-white font-medium py-2 px-5 rounded-md hover:bg-green-600 cursor-pointer flex items-center gap-2"
                onClick={() => {
                  if (!toSelectedOption || !fromOptionSelected) {
                    setOnClickedContinue(true);
                    return;
                  }
                  if (currentStep === 2 && selectedItems.length === 0) {
                    setItemsToTransferError(true);
                    return;
                  }
                  setCurrentStep((prev) => prev + 1);
                  setItemsToTransferError(false);
                }}
              >
                Continue
                <FaArrowRightLong size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
