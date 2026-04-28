import Select from "react-select";
import { FaRegBell } from "react-icons/fa";
import { setInventoryId } from "../../slices/InventorySlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { components } from "react-select";
import checked from "/check.png";
import NavbarSkeleton from "./Skeleton/InventoryHeader";
import Header from "../UI/Header";

export default function InventoryHeader({
  inventoryList,
  inventoryLoading,
  inventoryError,
  onRetry,
  onInventoryChange,
}) {
  const selectedInventoryId = useSelector(
    (state) => state.inventoryId.inventoryId,
  );
  const options = (inventoryList || []).map((inv) => ({
    value: inv.id,
    label: inv.name,
  }));

  const groupedOptions = [
    {
      label: "Your can edit",
      options: (inventoryList || [])
        .filter((inv) => inv.permission === "Editor")
        .map((inv) => ({
          value: inv.id,
          label: inv.name,
        })),
    },
    {
      label: "Your can view",
      options: (inventoryList || [])
        .filter((inv) => inv.permission === "Viewer")
        .map((inv) => ({
          value: inv.id,
          label: inv.name,
        })),
    },
  ];

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

  const dispatch = useDispatch();

  if (inventoryLoading) {
    return <NavbarSkeleton />;
  }

  return (
    <Header title="Inventories" className="text-2xl">
      <div className="flex flex-col">
        <Select
          className="w-[350px]"
          isDisabled={inventoryError}
          options={inventoryError ? [] : groupedOptions}
          onChange={(selectedOption) => {
            if (!selectedOption) return;
            onInventoryChange?.();
            dispatch(setInventoryId(selectedOption.value));
          }}
          placeholder="Select Inventory"
          components={{
            IndicatorSeparator: () => null,

            Option: CustomOption,
          }}
          value={
            inventoryLoading
              ? null
              : options.find((option) => option.value === selectedInventoryId)
          }
          theme={(theme) => ({
            ...theme,
            borderRadius: 5,
            colors: {
              ...theme.colors,
              primary25: "neutral20",
              primary: "green",
            },
          })}
          styles={{
            menu: (base) => ({
              ...base,
              width: "350px",
              borderRadius: "8px",

              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              border: "1px solid #e5e7eb",
            }),

            menuList: (base) => ({
              ...base,
              padding: "15px 0",
            }),
            option: (base, state) => ({
              ...base,
              padding: "15px 45px",
              backgroundColor: state.isSelected
                ? "rgba(0, 128, 0, 0.2)"
                : state.isFocused
                  ? "rgba(0, 128, 0, 0.1)"
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
            groupHeading: (base) => ({
              ...base,
              margin: "0 30px",
              paddingBottom: "10px",
              fontSize: "12px",
              fontWeight: "bold",
              color: "#a9a9ae",
              borderBottom: "1px solid #c5c9d2bb",
            }),
            control: (base) => ({
              //  dim while loading
              ...base,
              opacity: inventoryLoading ? 0.6 : 1,
            }),
          }}
        />
        {inventoryError && (
          <span className="text-red-500 text-sm">
            {"Failed to load inventories. Please try again."}
          </span>
        )}
      </div>

      <span className="text-black text-2xl px-2 cursor-pointer hover:text-gray-600">
        <FaRegBell />
      </span>
    </Header>
  );
}
