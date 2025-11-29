import React, { useState, useEffect, useRef } from "react";
import { getTicketCategories, getUserList, raiseTicket } from "../../../services/ApiService"; // Adjust the import path as needed for raiseTicket
import { toast } from "react-toastify"; // Updated to use react-toastify

interface Category {
    categoryId: number;
    categoryName: string;
}

interface User {
    userId: number;
    userName: string;
    displayName?: string;
    userRole: string;
}

const CreateTicket = ({ onClose }: { onClose: () => void }) => {
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);

    const [users, setUsers] = useState<User[]>([]);
    const [assignedUser, setAssignedUser] = useState("");
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const userDropdownRef = useRef<HTMLDivElement>(null);

    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const fetchCategories = async () => {
        const response = await getTicketCategories();
        const raw = response?.data?.data || [];
        const mapped = raw.map((x: any) => ({
            categoryId: x.ticketId,
            categoryName: x.ticketCategory,
        }));
        setCategories(mapped);
    };

    const fetchUsers = async () => {
        try {
            const response = await getUserList({
                page: 1,
                limit: 500,
                role: [1],
            });
            const list = response?.data?.data || [];

            const filtered = list.filter(
                (u: any) => u.userRole?.toLowerCase() === "mechanic"
            );

            setUsers(filtered);

        } catch (err) {
            console.error("User list fetch failed:", err);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchUsers();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
                setIsCategoryDropdownOpen(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
        if (categoryDropdownRef.current?.querySelector('input[type="file"]')) {
            (categoryDropdownRef.current.querySelector('input[type="file"]') as HTMLInputElement).value = '';
        }
    };

    const submitTicket = async () => {
        if (!category || !description || !image) {
            toast.error("Please fill all required fields and upload an image.");
            return;
        }

        try {
            const response = await raiseTicket(
                category,
                description,
                assignedUser || "",
                image
            );

            if (response.data.code === 200) {
                toast.success(`Ticket has been raised successfully, reference ID: ${response.data.data.ticketRef}`);
                onClose();
            } else {
                toast.error(response.data.message || "Failed to raise ticket.");
            }
        } catch (error: any) {
            const errResponse = error.response?.data;
            if (errResponse?.code === 400) {
                toast.error(errResponse.message || "Please upload file");
            } else {
                toast.error(errResponse?.message || "Something went wrong while raising the ticket.");
            }
        }
    };

    const selectedCategory = categories.find((c) => c.categoryId.toString() === category);
    const displayCategory = selectedCategory ? selectedCategory.categoryName : "";

    const selectedUser = users.find((u) => u.userId.toString() === assignedUser);
    const displayName = selectedUser ? (selectedUser.displayName || selectedUser.userName) : "";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-[999]">
            <div className="bg-white p-6 rounded-xl w-full max-w-3xl shadow-xl animate-fadeIn max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Create New Ticket</h2>
                    <button className="text-gray-400 hover:text-gray-600 text-xl" onClick={onClose}>✕</button>
                </div>

                {/* UI LAYOUT FIX — 2 ROW FORM */}
                <div className="space-y-5">

                    {/* ROW 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Ticket Category */}
                        <div>
                            <label htmlFor="category" className="block mb-2 font-medium text-gray-700">
                                Ticket Category *
                            </label>
                            <div className="relative" ref={categoryDropdownRef}>
                                <input
                                    id="category"
                                    type="text"
                                    readOnly
                                    value={displayCategory || "Select Category"}
                                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                    className="border border-gray-300 p-3 rounded-lg w-full bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                    placeholder="Select Category"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                {isCategoryDropdownOpen && (
                                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                                        {categories.map((c) => (
                                            <div
                                                key={c.categoryId}
                                                onClick={() => {
                                                    setCategory(c.categoryId.toString());
                                                    setIsCategoryDropdownOpen(false);
                                                }}
                                                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                            >
                                                {c.categoryName}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Assign User */}
                        <div>
                            <label htmlFor="assignedUser" className="block mb-2 font-medium text-gray-700">
                                Assign User
                            </label>
                            <div className="relative" ref={userDropdownRef}>
                                <input
                                    id="assignedUser"
                                    type="text"
                                    readOnly
                                    value={displayName || "Select User"}
                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    className="border border-gray-300 p-3 rounded-lg w-full bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                    placeholder="Select User"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                {isUserDropdownOpen && (
                                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                                        {users.map((u) => (
                                            <div
                                                key={u.userId}
                                                onClick={() => {
                                                    setAssignedUser(u.userId.toString());
                                                    setIsUserDropdownOpen(false);
                                                }}
                                                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                            >
                                                {u.displayName || u.userName}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* ROW 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">

                        {/* Description */}
                        <div className="h-full flex flex-col">
                            <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                className="border border-gray-300 p-3 rounded-lg w-full h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Please describe the issue in detail..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Upload Image */}
                        <div className="h-full flex flex-col">
                            <label htmlFor="uploadImage" className="block mb-2 font-medium text-gray-700">
                                Upload Image
                            </label>
                            <div className="relative flex-1">
                                <input
                                    id="uploadImage"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                <label
                                    htmlFor="uploadImage"
                                    className={`block border-2 rounded-xl p-2 flex flex-col items-center justify-center h-full cursor-pointer transition-all duration-200 ${imagePreview
                                        ? 'border-blue-300 bg-blue-50'
                                        : 'border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                        }`}
                                >
                                    {imagePreview ? (
                                        <>
                                            <img
                                                src={imagePreview}
                                                alt="Uploaded preview"
                                                className="w-full h-full object-contain rounded-md"
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    removeImage();
                                                }}
                                                className="text-sm text-red-500 hover:text-red-700 mt-2"
                                            >
                                                Remove Image
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                                                <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-500 text-sm">Click to upload or drag and drop</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <button
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        onClick={submitTicket}
                    >
                        Submit Ticket
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTicket;