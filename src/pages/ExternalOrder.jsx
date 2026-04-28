import { FaRegBell } from "react-icons/fa";

export default function ExternalOrder() {
  return (
    <div>
      <div className="px-8  border-b-2 border-gray-200 ">
        <nav className="bg-white h-20 flex justify-between  pl-4 ">
          <div className="flex items-center gap-4 cursor-pointer ">
            <h1 className="font-source text-black text-2xl font-semibold">
              Inventories
            </h1>
          </div>

          <div className="flex items-center gap-4 pr-2 ">
            <span className="text-black text-2xl px-2 cursor-pointer hover:text-gray-600">
              <FaRegBell />
            </span>
          </div>
        </nav>
      </div>
    </div>
  );
}
