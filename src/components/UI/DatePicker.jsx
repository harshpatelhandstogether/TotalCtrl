import { useState } from "react";
import { DateRangePicker, defaultStaticRanges, createStaticRanges } from "react-date-range";
import { startOfMonth, endOfMonth, startOfYear, endOfYear, subYears, subMonths } from "date-fns";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";


const customStaticRanges = createStaticRanges([
  { label: "Today", range: () => ({ startDate: new Date(), endDate: new Date() }) },
  {
    label: "Yesterday",
    range: () => ({
      startDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      endDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    }),
  },
  {
    label: "This Week",
    range: () => ({
      startDate: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())),
      endDate: new Date(),
    }),
  },
  {
    label: "Last Week",
    range: () => ({
      startDate: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() - 7)),
      endDate: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() - 1)),
    }),
  },
  { label: "This Month", range: () => ({ startDate: startOfMonth(new Date()), endDate: endOfMonth(new Date()) }) },
  {
    label: "Last Month",
    range: () => ({ startDate: startOfMonth(subMonths(new Date(), 1)), endDate: endOfMonth(subMonths(new Date(), 1)) }),
  },
  { label: "This Year", range: () => ({ startDate: startOfYear(new Date()), endDate: endOfYear(new Date()) }) },
  {
    label: "Last Year",
    range: () => ({ startDate: startOfYear(subYears(new Date(), 1)), endDate: endOfYear(subYears(new Date(), 1)) }),
  },
]);

const getLabelForRange = (rangeInput) => {
  if (!rangeInput) return "Select date range";
  const range = Array.isArray(rangeInput) ? rangeInput[0] : rangeInput;
  if (!range || !range.startDate || !range.endDate) return "Select date range";
  const matched = defaultStaticRanges.find((r) => {
    try {
      return r.isSelected(range);
    } catch (e) {
      return false;
    }
  });
  return matched
    ? matched.label
    : `${range.startDate.toLocaleDateString ? range.startDate.toLocaleDateString() : range.startDate} - ${range.endDate.toLocaleDateString ? range.endDate.toLocaleDateString() : range.endDate}`;
};

export default function DatePicker({ value, onChange, months }) {
  const isValueArray = Array.isArray(value);
  const normalizeToArray = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    return [{ ...(v || {}), key: v?.key || "selection" }];
  };

  const [showPicker, setShowPicker] = useState(false);
  const [tempRange, setTempRange] = useState(normalizeToArray(value));

  return (
    <div className="relative">
      <div
        className="border border-gray-300 rounded-md px-4 py-[6px] flex items-center gap-14 cursor-pointer"
        onClick={() => {
          setTempRange(normalizeToArray(value)); // reset temp on open
          setShowPicker((prev) => !prev);
        }}
      >
        <span className="text-sm font-normal">{getLabelForRange(value)}</span>
        {showPicker
          ? <RxCross1 size={15} className="text-black" />
          : <FaAngleDown className="text-[#abb1c1]" />
        }
      </div>

      {showPicker && (
        <div className="absolute right-0 z-50 mt-2 shadow-xl rounded-lg overflow-hidden border border-gray-200">
          <DateRangePicker
            ranges={tempRange}
            onChange={(item) => setTempRange([item.selection])}
            months={months || 2}
            direction="horizontal"
            showDateDisplay={false}
            staticRanges={customStaticRanges}
            inputRanges={[]}
            navigatorRenderer={(_, changeShownDate) => (
              <div className="flex items-center justify-between py-2 z-20">
                <button
                  onClick={() => changeShownDate(-1, "monthOffset")}
                  className="border-2 border-gray-300 rounded-md p-1 hover:bg-gray-100 h-10 w-10 cursor-pointer"
                >
                  <MdOutlineKeyboardArrowLeft size={30} className="text-[#abb1c1]" />
                </button>
                <button
                  onClick={() => changeShownDate(1, "monthOffset")}
                  className="border-2 border-gray-300 rounded-md p-1 hover:bg-gray-100 h-10 w-10 cursor-pointer"
                >
                  <MdOutlineKeyboardArrowRight size={30} className="text-[#abb1c1]" />
                </button>
              </div>
            )}
          />
          <div className="flex justify-end gap-3 px-4 py-3 bg-white border-t border-gray-200">
            <button
              className="px-4 py-1 text-sm rounded border border-gray-300"
              onClick={() => setShowPicker(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-1 text-sm rounded bg-[#23a956] text-white font-semibold"
              onClick={() => {
                // lift state up to parent in the same shape as input
                if (onChange) {
                  if (isValueArray) onChange(tempRange);
                  else onChange(tempRange[0]);
                }
                setShowPicker(false);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}