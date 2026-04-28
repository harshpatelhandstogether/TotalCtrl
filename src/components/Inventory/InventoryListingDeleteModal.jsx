import { IoMdClose } from "react-icons/io";
import deleteAddItem from "../../services/Inventory/deleteIAddItem";

export default function InventoryListingDeleteModal({
  onConfirm,
  onCancel,
  selectedItems,
  products,
}) {
  console.log("Selected items in InventoryListingDeleteModal:", selectedItems);

  async function handleDelete() {
    try {
      const productsToDelete = selectedItems
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean);

      if (!productsToDelete.length) return;

      const deletedIds = [];

      for (const product of productsToDelete) {
        const payload = { inventoryId: product?.products?.[0]?.inventoryId };
        await deleteAddItem(product.storeProductId, payload);
        deletedIds.push(product.id);
      }

      onConfirm(deletedIds);
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  }
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
            Are you sure you want to delete {selectedItems.length} selected
            items?{" "}
          </h2>
        </div>
        <div>
          <p className="text-[16px] px-2 text-[#737373]">
            This action is irreversible and you will lose all the information
            related to this product.
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
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
