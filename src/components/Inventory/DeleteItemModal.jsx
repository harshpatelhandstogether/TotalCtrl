import { IoMdClose } from "react-icons/io";
import deleteAddItem from "../../services/Inventory/deleteIAddItem";
import { useApi } from "../../hooks/useApi";



export default function DeleteItemModal({
  onConfirm,
  onCancel,
  product,
  refetchProducts,
}) {
  console.log("Product in DeleteItemModal:", product);


  const createDeletePayload = (product) => {
    return {
      inventoryId: product.products?.[0]?.inventoryId,
    };
  };
  console.log("Delete payload:", createDeletePayload(product));

  const {
    loading: deleteLoading,
    refetch: refetchDeleteItem,
    error: deleteError,
  } = useApi(deleteAddItem, [], { immediate: false });
  async function handleDelete() {
    try {
      const payload = createDeletePayload(product);
      const response = await refetchDeleteItem(product.storeProductId, payload);

      if (response) {
        onConfirm();
      } else {
        console.error("Failed to delete item:", response);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  return (
    <div>
      <div className="flex justify-end pr-8 cursor-pointer pb-5">
        <button className="cursor-pointer" onClick={onCancel}>
          <IoMdClose size={25} />
        </button>
      </div>
      <div className="mx-30 text-center">
        <div className="py-3">
          <h2 className="text-2xl font-semibold">Do you want to delete {product?.productName} from the Inventory</h2>
        </div>

        <div>
          <p className="text-[16px] px-2 text-[#737373]">
            This action is irreversible and you will lose all the information
            related to this product.
          </p>
        </div>
        <div className="flex flex-col gap-5 justify-center mt-18 font-semibold">
          <button
            className="border border-black py-3 px-4 rounded-md  mx-25 hover:bg-black hover:text-white cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 mx-25 cursor-pointer"
            onClick={handleDelete}
          >
            Delete
          </button>
          {deleteError && (
            <div className="text-red-500 text-sm mt-2">
              {"An error occurred while deleting the item."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
