import React from "react";
import { IoMdClose } from "react-icons/io";
import Modal from "../UI/Modal";

export default function DeleteModal({ orderDetails, onCancel, handleDelete  , id , deleteError}) {
  return (
    <div>
      <div className="flex justify-end pr-8 cursor-pointer pb-5">
        <button className="cursor-pointer" onClick={onCancel}>
          <IoMdClose size={25} />
        </button>
      </div>
      <div className="mx-20 text-center">
        <div className="py-3">
          <h2 className="text-2xl font-semibold">
            {" "}
            Delete order # {orderDetails?.orderNumber} from {orderDetails?.fromInventory.name} ?
            {" "}
          </h2>
        </div>
        <div>
          <p className="text-[16px] px-2 text-[#737373]">
            This action is irreversible and you will lose all the information
            related to this order.
          </p>
        </div>
        <div className="flex flex-col gap-5 justify-center mt-18 font-semibold">
          <button
            className="border border-black py-2 px-4 rounded-md  mx-30 hover:bg-black hover:text-white cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mx-30 cursor-pointer"
            onClick={() => handleDelete(id)}
          >
            Delete order
          </button>
            {deleteError && (<div className="error">Error deleting order. Please try again.</div>)}
        </div>
      </div>
    </div>
  );
}
