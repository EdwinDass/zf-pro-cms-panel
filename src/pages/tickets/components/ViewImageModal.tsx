import React from "react";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

const ViewImageModal: React.FC<Props> = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">Ticket Image</h2>
          <button className="text-gray-600 hover:text-gray-900" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* Image */}
        <div className="p-4 flex justify-center bg-black">
          <img
            src={imageUrl}
            alt="Ticket Image"
            className="max-h-[70vh] w-auto rounded-lg object-contain"
          />
        </div>

      </div>
    </div>
  );
};

export default ViewImageModal;
