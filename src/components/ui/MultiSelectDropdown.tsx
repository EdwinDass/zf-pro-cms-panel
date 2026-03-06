import React, { useState, useRef, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface MultiSelectDropdownProps {
    label: string;
    options: string[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    disabled?: boolean;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
    label,
    options,
    selectedValues,
    onChange,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleOption = (option: string) => {
        if (selectedValues.includes(option)) {
            onChange(selectedValues.filter(val => val !== option));
        } else {
            onChange([...selectedValues, option]);
        }
    };

    const removeOption = (e: React.MouseEvent, option: string) => {
        e.stopPropagation();
        onChange(selectedValues.filter(val => val !== option));
    };

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isAllSelected = filteredOptions.length > 0 && filteredOptions.every(opt => selectedValues.includes(opt));

    const handleSelectAll = () => {
        if (isAllSelected) {
            // Deselect all filtered options
            onChange(selectedValues.filter(val => !filteredOptions.includes(val)));
        } else {
            // Select all filtered options (don't duplicate)
            const newValues = [...selectedValues];
            filteredOptions.forEach(opt => {
                if (!newValues.includes(opt)) newValues.push(opt);
            });
            onChange(newValues);
        }
    };

    // Derived placeholder text
    const displayLabel = label.replace(" Filter", "");
    const placeholder = `Search ${displayLabel.toLowerCase()}`;

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Label outside the box */}
            <label className="block text-sm font-medium text-gray-600 mb-2">{displayLabel}</label>

            {/* Outline Input Container */}
            <div
                className={`relative w-full min-h-[46px] border border-gray-300 rounded-md bg-white pr-10 cursor-text flex flex-wrap items-center gap-2 p-1.5 ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}`}
                onClick={() => {
                    if (!disabled && !isOpen) {
                        setIsOpen(true);
                    }
                }}
            >
                {/* Selected Pills */}
                {selectedValues.map(val => (
                    <div key={val} className="flex items-center px-3 py-1 bg-[#005bd3] rounded-full text-[13px] font-medium text-white border border-[#005bd3]">
                        {val}
                        <button
                            type="button"
                            onClick={(e) => removeOption(e, val)}
                            className="ml-1.5 text-white hover:text-gray-200 focus:outline-none flex items-center justify-center p-0.5"
                        >
                            <CloseIcon style={{ fontSize: '14px' }} />
                        </button>
                    </div>
                ))}

                {/* Search Input inline with pills */}
                <input
                    type="text"
                    className="flex-grow min-w-[120px] outline-none text-sm text-gray-700 bg-transparent py-1 px-2"
                    placeholder={selectedValues.length === 0 ? placeholder : ""}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onClick={(e) => {
                        if (!disabled) setIsOpen(true);
                    }}
                    disabled={disabled}
                />

                {/* Dropdown Icon */}
                <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer p-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!disabled) setIsOpen(!isOpen);
                    }}
                >
                    <ArrowDropDownIcon />
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-3 bg-white border border-gray-300 rounded-md shadow-lg">
                    {/* Upward pointing triangle matching the screenshot */}
                    <div className="absolute top-[-6px] left-6 w-3 h-3 bg-white border-l border-t border-gray-300 transform rotate-45"></div>

                    <div className="relative z-10 bg-white rounded-t-md">
                        {/* Select All */}
                        <label className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-200">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 mr-3 shrink-0"
                                checked={isAllSelected}
                                onChange={handleSelectAll}
                            />
                            <span className="text-sm text-gray-800 font-medium">Select All</span>
                        </label>

                        <div className="max-h-60 overflow-y-auto">
                            {filteredOptions.length === 0 ? (
                                <div className="px-4 py-4 text-sm text-gray-500">No options found</div>
                            ) : (
                                filteredOptions.map((option, idx) => (
                                    <label
                                        key={idx}
                                        className="flex items-center px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 mr-3 shrink-0"
                                            checked={selectedValues.includes(option)}
                                            onChange={() => toggleOption(option)}
                                        />
                                        <span className="text-sm text-gray-700">{option}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Clear All Footer */}
                    <div className="border-t border-gray-200 p-3 bg-white rounded-b-md relative z-10">
                        <button
                            type="button"
                            onClick={() => {
                                onChange([]);
                                setSearchTerm("");
                            }}
                            className="text-[#005bd3] text-sm font-semibold hover:text-blue-800"
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
