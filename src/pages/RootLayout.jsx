import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

export default function RootLayout() {
  return (
    <>
      <div className="h-screen  overflow-hidden relative flex justify-start ">
        <div className=" ">
          <Sidebar />
        </div>
        <div className="w-full ">
          <Outlet />
        </div>
      </div>
    </>
  );
}
