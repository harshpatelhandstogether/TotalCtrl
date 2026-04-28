import { IoMdClose } from "react-icons/io";

export default function AddItemCloseModal({ onConfirm, onCancel, matchName }) {
  return (
    <div>
      <div className="flex justify-end pr-8 cursor-pointer">
        <button className="cursor-pointer" onClick={onCancel}>
          <IoMdClose size={25} />
        </button>
      </div>

      <div className="my-7 flex justify-center text-2xl font-semibold">
        <h1>Cancel adding items to {matchName}?</h1>
      </div>

      <div className="flex justify-center mx-10 ">
        <p className="mx-20 text-center text-[#7e7e7e]">
          Any unsaved changes will be lost and the items you entered here won’t
          be added to {matchName}.
        </p>
      </div>

      <div className="my-12 flex flex-col gap-5 justify-center items-center ">
        <button
          className="bg-[#e1464d] text-white font-semibold py-2 px-5 rounded-md w-[35%] cursor-pointer"
          onClick={onConfirm}
        >
          Yes, cancel
        </button>
        <button
          className="border border-black text-[#595959] font-semibold py-2 px-5 rounded-md w-[35%] hover:bg-black hover:text-white cursor-pointer"
          onClick={onCancel}
        >
          No, continue adding items
        </button>
      </div>
    </div>
  );
}
