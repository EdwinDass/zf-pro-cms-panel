import React, { useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ticketId: number | null;
  roles: Option[];                      // dropdown options
  assignApi: (ticketId: number, roleId: number) => Promise<any>;
  onAssigned: () => void;               // callback to refresh
}

const AssignTicket: React.FC<Props> = ({
  isOpen,
  onClose,
  ticketId,
  roles,
  assignApi,
  onAssigned
}) => {

  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!ticketId || !selectedRole) return;

    setLoading(true);

    try {
      await assignApi(ticketId, Number(selectedRole));
      setLoading(false);
      onAssigned();
      onClose();
      setSelectedRole("");
    } catch (e) {
      console.error("Assign ticket error:", e);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">

        <h2 className="text-xl font-semibold mb-4">Assign Ticket</h2>

        <label htmlFor="roleSelect" className="sr-only">
          Select Role
        </label>

        <select
          id="roleSelect"
          aria-label="Select Role"
          className="w-full border rounded-lg p-3 mb-4"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AssignTicket;