import React, { FC } from "react";

interface Option {
  label: string;
  value: string;
}

interface FiltersBarProps {
  statusOptions: Option[];
  roleOptions: Option[];
  categoryOptions: Option[];

  onSearch?: (value: string) => void;
  onFilterChange?: (filters: {
    status: string;
    role: string;
    category: string;
  }) => void;

  onApply?: () => void;
}

const FiltersBar: FC<FiltersBarProps> = ({
  statusOptions = [],
  roleOptions = [],
  categoryOptions = [],
  onSearch,
  onFilterChange,
  onApply,
}) => {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [role, setRole] = React.useState("all");
  const [category, setCategory] = React.useState("all");

  const emitFilterChange = (
    updated: Partial<{ status: string; role: string; category: string }>
  ) => {
    const newFilters = {
      status,
      role,
      category,
      ...updated,
    };
    onFilterChange?.(newFilters);
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm mb-6">

      {/* Search Input */}
      <label htmlFor="searchInput" className="sr-only">
        Search Tickets
      </label>
      <input
        id="searchInput"
        type="text"
        placeholder="Search tickets..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          onSearch?.(e.target.value);
        }}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
      />

      {/* Status Dropdown */}
      {statusOptions.length > 0 && (
        <>
          <label htmlFor="statusSelect" className="sr-only">
            Filter by Status
          </label>
          <select
            id="statusSelect"
            aria-label="Filter by Status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              emitFilterChange({ status: e.target.value });
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg cursor-pointer"
          >
            <option value="all">All Status</option>
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Role Dropdown */}
      <label htmlFor="roleSelect" className="sr-only">
        Filter by Role
      </label>
      <select
        id="roleSelect"
        aria-label="Filter by Role"
        value={role}
        onChange={(e) => {
          setRole(e.target.value);
          emitFilterChange({ role: e.target.value });
        }}
        className="px-3 py-2 border border-gray-300 rounded-lg cursor-pointer"
      >
        <option value="all">All Roles</option>
        {roleOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Category Dropdown */}
      <label htmlFor="categorySelect" className="sr-only">
        Filter by Category
      </label>
      <select
        id="categorySelect"
        aria-label="Filter by Category"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          emitFilterChange({ category: e.target.value });
        }}
        className="px-3 py-2 border border-gray-300 rounded-lg cursor-pointer"
      >
        <option value="all">All Category</option>
        {categoryOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

    </div>
  );
};

export default FiltersBar;