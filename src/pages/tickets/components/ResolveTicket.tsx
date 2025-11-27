import React, { useState } from "react";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   ticketId: number | null;
//   onResolved: () => void; // callback to refresh table
//   resolveApi: (ticketId: number, comments: string) => Promise<void>;
// }

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ticketId: number | null;
  onResolved: () => void;
  resolveApi: (ticketId: number, comments: string) => Promise<any>;
}


const ResolveTicket: React.FC<Props> = ({
  isOpen,
  onClose,
  ticketId,
  onResolved,
  resolveApi
}) => {
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!ticketId) return;

    setLoading(true);

    try {
      await resolveApi(ticketId, comments);
      setLoading(false);
      onResolved();
      onClose();
      setComments("");
    } catch (e) {
      console.error("Resolve error:", e);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">

        <h2 className="text-xl font-semibold mb-4">Resolve Ticket</h2>

        <textarea
          className="w-full border rounded-lg p-3 h-32 text-sm"
          placeholder="Enter resolve comments..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />

        <div className="flex justify-end mt-4 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            {loading ? "Saving..." : "Resolve"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResolveTicket;
