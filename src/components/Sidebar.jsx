import { FiSettings } from "react-icons/fi";
import { FiBox } from "react-icons/fi";
import { FiTruck } from "react-icons/fi";
import { IoStatsChart } from "react-icons/io5";
import { HiOutlineArchiveBox } from "react-icons/hi2";
import { IoCalculatorSharp } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Sidebar() {
  const menuItems = [
    { name: "Inventories", path: "/inventories", icon: <FiBox size={25} /> },
    {
      name: "External Orders",
      path: "/external-orders",
      icon: <FiTruck size={25} />,
    },
    {
      name: "Internal Orders",
      path: "/internal-orders",
      icon: <FiTruck size={25} />,
    },
    { name: "Analytics", path: "/analytics", icon: <IoStatsChart size={25} /> },
    {
      name: "Inventory Count",
      path: "/inventory-count",
      icon: <HiOutlineArchiveBox size={25} />,
    },
    {
      name: "COGS Calculator",
      path: "/cogs-calculator",
      icon: <IoCalculatorSharp size={25} />,
    },
  ];
  return (
    <div className="bg-white h-full px-3  border-r-1 border-gray-200  w-[220px] flex flex-col justify-between ">
      <div className=" border-b-2 border-gray-200  pb-3">
        <div className="flex  justify-center gap-4 cursor-pointer pt-7 pb-8">
          <NavLink to="/">
            <img src={logo} alt="Logo" width={110} height={100} />
          </NavLink>
        </div>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 py-2  rounded-md text-[12px] font-medium
               ${
                 isActive
                   ? " text-green-600"
                   : "text-[#6b6b6f]  hover:text-black"
               }`
            }
          >
            <span className="pl-6  ">{item.icon}</span>
            <p className=" text-sm ">{item.name}</p>
          </NavLink>
        ))}
      </div>

      <div className="h-[40%] flex flex-col justify-end gap-3 pb-5">
        <div>
          <div className="mx-[10px] px-[16px] py-[4px] flex flex-col gap-3 app-bg mb-5 rounded-md text-[13px] font-semibold">
            <div className="flex justify-center text-[#0f6f36] border-b border-[#cdead6] pb-[10px] pt-3">
              Get the mobile app
            </div>
            <div className="flex gap-2 justify-center border-b border-[#cdead6] pb-[10px] ">
              <img
                src="https://dev.totalctrl.com/restaurant/admin/img/app-store-logo.svg"
                alt="App Store"
              />
              <span className="text-[#0f6f36]"> App Store</span>
            </div>
            <div className="flex gap-2 justify-center  pb-3">
              <img
                src="	https://dev.totalctrl.com/restaurant/admin/img/google-play-icon.svg"
                alt="Google Play"
              ></img>
              <span className="text-[#0f6f36]"> Google Play</span>
            </div>
          </div>
          <a
            href="https://www.youtube.com/watch?v=dHJzsYbJbrE"
            target="_blank"
            rel="noopener noreferrer"
            className="m-[10px] px-[12px] bg-[#f2f1ff] flex flex-col rounded-md"
          >
            <div className="flex justify-start py-[10px] item-center border-b border-[#e6e3ff] ">
              <img
                src="	https://dev.totalctrl.com/restaurant/admin/img/video-library.svg"
                className="pr-[17px]"
              ></img>
              <span className="text-[#372b96] font-semibold text-[14px] align-center">
                Video Library
              </span>
            </div>
            <div className="flex justify-center">
              <p className="text-[#372b96] text-[11px] py-[6px]">
                Master the basics of inventory count with TotalCtrl
              </p>
            </div>
          </a>
        </div>
        <div className="flex justify-start item-center gap-4 px-[12px]   cursor-pointer border-b-2 border-gray-200 pb-3">
          <button className="text-white cursor-pointer bg-[#23a956] text-sm w-full py-3 rounded-md font-semibold">
            Refer a Friend
          </button>
        </div>
        <div className="flex justify-start item-center gap-4 cursor-pointer pt-4 text-[#6b6b6f] hover:text-black cursor-pointer">
          <span className=" pl-6 ">
            <FiSettings size={20} />
          </span>
          <button className=" text-sm ">Settings</button>
        </div>
      </div>
    </div>
  );
}
