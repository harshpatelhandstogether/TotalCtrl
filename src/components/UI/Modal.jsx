export default function Modal({ isOpen, onClose, children, className = "" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        // onClick={onClose}
      ></div>

      {/* Modal content */}
      <div
        className={`relative bg-white rounded-lg shadow-lg py-6 z-10 ${className}`}
      >
        {children}

        {/* Close button */}
        {/* <button
          onClick={onClose}
          className="mt-4 shadow-lg hover:border-2  border-2 border-gray-300 text-[#6b6b6f] px-4 py-1 rounded absolute bottom-6 left-6"
        >
          Cancel
        </button> */}
      </div>
    </div>
  );
}
