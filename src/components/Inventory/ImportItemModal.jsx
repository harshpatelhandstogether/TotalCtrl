import { IoMdClose } from "react-icons/io";
import { HiDownload } from "react-icons/hi";
import { GrDocumentUpload } from "react-icons/gr";
import { useState , useRef , useEffect} from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import api from "../../services/api/api";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import uploadExcelFile from "../../services/Inventory/uploadExcelFile";

export default function ImportItemModal({ onClose, onImportSuccess, setRows , isOpen}) {
  const [inputKey, setInputKey] = useState(0); // 👈 add this
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const selectedInventoryId = useSelector(
    (state) => state.inventoryId.inventoryId,
  );

  const expectedHeader = [
    "Item Name *",
    "SKU",
    "Category / subcategory",
    "Unit *",
    "Cost per unit *",
    "Quantity",
  ];

  const processExcel = (file) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);

      const workbook = XLSX.read(data, { type: "array" });
      console.log("Workbook:", workbook);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      console.log("Sheet:", sheet);

      const excelData = XLSX.utils.sheet_to_json(sheet, {
        //  range: 1, // skip first row
        header: 1, // get raw 2D array
        defval: "", // avoid undefined
      });
      console.log("Raw Excel Data:", excelData);
      let rows = excelData.map((row) => {
        // if first cell is empty → remove it
        if (row[0] === "" || row[0] === null) {
          return row.slice(1);
        }
        return row;
      });
      rows = rows.filter((row) => row.some((cell) => cell !== ""));

      //  clean + trim all values
      rows = rows
        .filter((row) => row.length > 0)
        .map((row) =>
          row.map((cell) => (cell !== undefined ? String(cell).trim() : "")),
        );
      //  Remove NOTE row
      rows = rows.filter((row) => !row[0]?.toLowerCase().includes("note"));

      // Remove duplicate header row (optional)
      rows = rows.filter(
        (row, index) => index === 0 || row[0] !== "Item name *",
      );
      //  keep ONLY valid rows (length check)
      rows = rows.map((row) => row.slice(0, 6));

      rows[0] = expectedHeader;
      console.log("Excel Header:", rows[0]);
      //  send to API
      uploadFile(rows);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    setFile(droppedFile);
    processExcel(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    processExcel(selectedFile);
  };

  const handleCancel = () => {
    setFile(null);
    setLoading(false);
  };

  const formatSize = (size) => {
    return (size / 1024).toFixed(1) + " KB";
  };
  
 useEffect(() => {
  if (isOpen) {
    setFile(null);      // 👈 reset file every time modal opens
    setLoading(false);
  }
}, [isOpen]);


  const uploadFile = async (rows) => {
    rows = rows.map((row, index) => {
      // skip header
      if (index === 0) return row;

      return [
        row[0],
        row[1],
        row[2],
        row[3],
        Number(row[4]) || 0,
        Number(row[5]) || 0,
      ];
    });
    console.log("Prepared rows for upload:", rows);
    try {
      setLoading(true);
      const payload = {
        language: "en",
        inventoryId: selectedInventoryId,
        parseData: rows,
      };

      const response = await uploadExcelFile(payload);
      setFile(null);
      setInputKey(prev => prev + 1); 

      const apiData = response.data?.Data || [];
      onImportSuccess(apiData);

      console.log("Upload success:", response.data);
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const link = document.createElement("a");
      link.href =
        "https://dev.totalctrl.com/restaurant/resources/productexcel/TotalCtrl_Item_Import_Template_en.xlsx";
      link.setAttribute("download", " TotalCtrl_Item_Import_Template_en.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="h-[50%]">
        <div className="flex justify-end pr-8 cursor-pointer">
          <button className="cursor-pointer" onClick={onClose}>
            <IoMdClose size={25} />
          </button>
        </div>
        <div className=" ">
          <div className="text-center my-8 ">
            <h1 className="text-2xl font-semibold">
              Import items using a spreadsheet template
            </h1>
          </div>
          <div className="text-left text-[#7e7e7e] mx-60 ">
            <ol className="flex flex-col gap-3 list-decimal ">
              <li>Download the spreadsheet template</li>
              <li>Fill in all the required information</li>
              <li>
                Upload the filled-in template here to set up all inventory items
                at once
              </li>
            </ol>
          </div>
          <div className="mt-8 flex justify-center ">
            <button
              className="flex gap-3 px-6 py-2  text-white font-medium rounded-md bg-[#23a956] cursor-pointer"
              onClick={handleDownload}
            >
              <span>
                <HiDownload size={20} />
              </span>
              <p>Download template</p>
            </button>
          </div>
        </div>
      </div>
      {!file ? (
        <div
          className={`mx-15 my-10 flex flex-col items-center justify-center border-2 border-dashed border-[#d7d7db]  rounded-lg py-10 cursor-pointer  ${isDragging ? "border-green-500 bg-green-50" : "border-gray-300"}`}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="">
            <span>
              <GrDocumentUpload size={40} />
            </span>
          </div>
          <div className="py-4 text-xl text-center text-[#252527]">
            <h1>Drag & drop the filled-in template here</h1>
            <h1 className="pt-2">or</h1>
          </div>
          <div>
            <label className="flex gap-3 px-6 py-2  text-white font-medium rounded-md bg-[#23a956] cursor-pointer">
              Select a file from your computer
              <input
                type="file"
                key={inputKey} 
                id="fileUpload"
                className="hidden"  
                onChange={handleFileSelect}
                accept=".csv,.xlsx"
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="mx-15 my-10 flex flex-col items-center justify-center border-2 border-dashed border-[#d7d7db]  rounded-lg py-10 cursor-pointer h-[250px] ">
          <div className="flex gap-3 items-center  px-6 py-4 rounded-md border border-gray-300">
            <span className="pt-2">
              <AiOutlineLoading3Quarters
                size={30}
                className="animate-spin text-gray-400 mx-auto"
              />
            </span>
            <p className="mt-1 text-sm text-gray-700 font-semibold text-[16px] ">
              {" "}
              {file.name}
            </p>
            <p className="mt-1 text-sm ">{formatSize(file.size)}</p>
            <button
              className="mt-1 ml-15 text-green-500 cursor-pointer"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
