import React from "react";
import Header from "./Header";
import { useApi } from "../../hooks/useApi";
import { fetchDetailOrder } from "../../services/InventoryDetail/InternalOrders/fetchDetailOrder";
import formateDate, { formatDateWithWeekday } from "../../utils/formateDate";
import { MdEdit } from "react-icons/md";
import { IoMdMore } from "react-icons/io";
import ScheduleData from "./ScheduleData";
import DeliveredData from "./DeliveredData";
import DetailPageSkeleton from "./skeleton/DetailPageSkeleton";
import { useState } from "react";
import Modal from "../UI/Modal";
import TransferItemModal from "../Inventory/TransferItem/TransferItemModal";
import { deleteInternalOrder } from "../../services/api/InternalOrders/DeleteInternalOrder";
import { MdDeleteOutline } from "react-icons/md";
import DeleteModal from "./DeleteModal";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { IoMdClose } from "react-icons/io";
import DataSkeleton from "./skeleton/DataSkeleton";

export default function DetailPage({ id, refetchOrders }) {
  const {
    data: orderDetails,
    refetch: refetchOrderDetails,
    loading: orderDetailsLoading,
  } = useApi(() => fetchDetailOrder(id), [id]);
  console.log("Order details:", orderDetails);
  const [TransferModalOpen, setTransferModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [mode, setMode] = useState(""); // "add" | "edit"
  const [openTooltip, setOpenTooltip] = useState(false);
  const navigate = useNavigate();

  const toastdelete = () => {
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
            Order #{orderDetails?.orderNumber} from{" "}
            {orderDetails?.fromInventory.name} has been deleted successfully!
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
        closeButton: false,
        theme: "dark",
        style: {
          width: "800px",
        },
      },
    );
  };

  const openEditModal = () => {
    setMode("edit");
    setTransferModalOpen(true);
  };

  const openAddModal = () => {
    setMode("add");
    setTransferModalOpen(true);
  };

  const { refetch: refetchDeleteInternalOrder, error: deleteError } = useApi(
    () => deleteInternalOrder(id),
    [id],
    { immediate: false },
  );
  const handleDeleted = async (id) => {
    try {
      const res = await refetchDeleteInternalOrder(id);

      setDeleteModal(false);
      navigate("/internal-orders");

      toastdelete();
      refetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  if (orderDetailsLoading) {
    return (
    <>
    <DetailPageSkeleton />
    <DataSkeleton row={3}/>
    </>
    );
  }

  return (
    <>
      <div>
        <Header orderDetails={orderDetails} />
        <div>
          <div className="top flex justify-between px-12 pt-10 pb-6">
            <div className="left">
              <div className="flex gap-4 item-center">
                <div className="text-3xl font-semibold">
                  {orderDetails?.fromInventory.name} to{" "}
                  {orderDetails?.toInventory.name}
                </div>
                <div className="pt-2 text-xs  ">
                  <p
                    className={`${orderDetails?.status === "delivered" ? "app-bg text-[#0f6f36]" : "bg-[#e7e7ec] text-[#57575b] "}${orderDetails?.status === "partially-delivered" ? "bg-[#fff3cd] text-[#ab9311]" : ""} py-1 px-3 rounded-md font-semibold`}
                  >
                    {orderDetails?.status.toUpperCase() || "---"}
                  </p>
                </div>
              </div>
              <div className="py-2 ">#{orderDetails?.orderNumber}</div>
              <div className="pt-4 flex gap-5  ">
                <div className="border-r border-[#d7d7db] pr-5">
                  <p className="text-xs text-[#a0a0a3] font-medium">ORDERED</p>
                  <h1 className="font-semibold text-xl">
                    {formateDate(orderDetails?.orderedAt) || "---"}
                  </h1>
                </div>
                <div className="border-r border-[#d7d7db] pr-5">
                  <p className="text-xs text-[#a0a0a3] font-medium">
                    LAST DELIVERED
                  </p>
                  {orderDetails?.status ? (
                    <h1 className="font-semibold text-xl">
                      {formatDateWithWeekday(orderDetails?.lastDeliveredAt) ||
                        "---"}
                    </h1>
                  ) : (
                    <h1 className="font-semibold text-xl">
                      {formateDate(orderDetails?.lastDeliveredAt) || "---"}
                    </h1>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#a0a0a3] font-medium">ITEMS</p>
                  <h1 className="font-semibold text-xl">
                    {orderDetails?.totalItems}
                  </h1>
                </div>
              </div>
            </div>
            {orderDetails?.status === "scheduled" && (
              <div className="right flex  item-center">
                <div
                  className="px-3 cursor-pointer  "
                  onClick={() => openEditModal()}
                >
                  <div className="p-2 hover:app-bg rounded-[100%] ">
                    <MdEdit size={25} />
                  </div>
                </div>
                <div className="relative">
                  <div
                    className="px-3 cursor-pointer "
                    onClick={() => setOpenTooltip((prev) => !prev)}
                  >
                    <div className="p-2 hover:app-bg rounded-[100%]">
                      <IoMdMore size={25} />
                    </div>
                  </div>
                  {openTooltip && (
                    <div className="absolute right-0  mt-2 bg-white rounded-md shadow-md z-20 text-sm whitespace-nowrap border border-gray-300 w-[200px]">
                      <div
                        className=" my-3 py-1 cursor-pointer text-black text-left pl-4 flex hover:app-bg "
                        onClick={() => {
                          setDeleteModal(true);
                          setOpenTooltip(false);
                        }}
                      >
                        <MdDeleteOutline size={18} className="inline mr-2" />

                        <p>Delete order</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="bottom">
            {orderDetails?.status == "delivered" ||
            orderDetails?.status == "partially-delivered" ? (
              <DeliveredData orderDetails={orderDetails} />
            ) : (
              <ScheduleData
                orderDetails={orderDetails}
                refetchOrderDetails={refetchOrderDetails}
              />
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={TransferModalOpen} className="h-[950px] w-[1450px]">
        <TransferItemModal
          mode={mode || "edit"}
          orderDetails={orderDetails}
          onClose={() => setTransferModalOpen(false)}
          // refetchProducts={refetchOrderDetails}
          refetchOrderDetails={refetchOrderDetails}
        />
      </Modal>
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        className="w-[650px] h-[450px]"
      >
        <DeleteModal
          orderDetails={orderDetails}
          onCancel={() => setDeleteModal(false)}
          handleDelete={handleDeleted}
          id={id}
          deleteError={deleteError}
          
        />
      </Modal>
    </>
  );
}
