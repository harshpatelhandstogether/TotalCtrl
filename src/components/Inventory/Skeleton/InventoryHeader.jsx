import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function NavbarSkeleton() {
  return (
    <SkeletonTheme baseColor="#dcd7d7" highlightColor="#aaa7a7">
      <div className="px-8  border-b-2 border-gray-200">
        <nav className="bg-white h-20 flex justify-between  pl-4 ">
          <div className="flex items-center gap-4 cursor-pointer ">
            <h1 className="font-source text-black text-2xl font-semibold">
              Inventories
            </h1>
          </div>

          <div className="flex items-center gap-4 pr-2 ">
            <Skeleton width={350} height={35} />

            <span className="text-black text-2xl px-2 cursor-pointer hover:text-gray-600">
              <Skeleton circle={true} width={30} height={30} />
            </span>
          </div>
        </nav>
      </div>
    </SkeletonTheme>
  );
}
