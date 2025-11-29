import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { getTicketImage } from "../../../services/ApiService";
import ViewImageModal from "./ViewImageModal";

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ticketData: any | null;
}

const ViewTicket: React.FC<Props> = ({ isOpen, onClose, ticketData }) => {
  if (!isOpen || !ticketData) return null;

  /** Image Modal State */
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  /** Table Fields */
  const fields = [
    { label: "Ticket ID", value: ticketData.TicketID },
    { label: "Category", value: ticketData.Category },
    { label: "Description", value: ticketData.Description },
    { label: "Status", value: ticketData.Status },
    { label: "Assigned Role", value: ticketData.roleAssigned },
    { label: "Username", value: ticketData.Username },
    { label: "Email", value: ticketData.email },
    { label: "Mobile Number", value: ticketData.mobile ?? "—" },
    { label: "Created At", value: formatDate(ticketData.createdAt) },
    { label: "Created By", value: ticketData.createdBy ?? "—" },
    { label: "Resolved Comments", value: ticketData.resolvedComments ?? "—" },
  ];

  /** Handler to Fetch Signed Image URL */
  const handleViewImage = async () => {
    try {
      const res = await getTicketImage(ticketData.TicketID);
      const signed = res?.data?.signedUrl;

      if (signed) {
        setImageUrl(signed);
        setImageModalOpen(true);
      } else {
        alert("Image not available.");
      }
    } catch (error) {
      console.error("Image fetch failed:", error);
      alert("Failed to load image.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3 border-b">
          <h2 className="text-lg font-semibold">Ticket Details</h2>
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={onClose}
            aria-label="Close Ticket Details"
          >
            <CloseIcon />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Table */}
        <div className="max-h-[70vh] overflow-y-auto">
          <table className="w-full border-collapse">
            <tbody>
              {fields.map((field, idx) => (
                <tr key={idx} className="border-b last:border-b-0">
                  <td className="w-1/3 px-4 py-3 text-gray-600 font-medium bg-gray-50">
                    {field.label}
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    {field.value}
                  </td>
                </tr>
              ))}

              {/* Image Row */}
              <tr className="border-b">
                <td className="px-4 py-3 text-gray-600 font-medium bg-gray-50">
                  Image
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={handleViewImage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    aria-label="View Ticket Image"
                  >
                    View Image
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            aria-label="Close Ticket Details"
          >
            Close
          </button>
        </div>
      </div>

      {/* Image Viewer Modal */}
      <ViewImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        imageUrl={imageUrl}
      />
    </div>
  );
};

export default ViewTicket;