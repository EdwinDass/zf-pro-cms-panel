import React from 'react';

const RolesScreen = () => {
    const roles = [
        {
            id: 1,
            name: 'Super Admin',
            subtitle: 'System Administrator',
            icon: 'fa-user-shield',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            badge: 'System',
            badgeColor: 'bg-blue-100 text-blue-600',
            description: 'Full system access with all permissions including user management and system configuration.',
            users: 2,
            crownIcon: true,
            mainIcon: 'fa-crown',
            mainIconColor: 'text-yellow-500'
        },
        {
            id: 2,
            name: 'Manager',
            subtitle: 'Department Manager',
            icon: 'fa-user-tie',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            badge: 'Active',
            badgeColor: 'bg-green-100 text-green-600',
            description: 'Department-level access with team management and reporting capabilities.',
            users: 12,
            crownIcon: false,
            mainIcon: 'fa-briefcase',
            mainIconColor: 'text-gray-500'
        },
        {
            id: 3,
            name: 'Operator',
            subtitle: 'System Operator',
            icon: 'fa-user-cog',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            badge: 'Active',
            badgeColor: 'bg-green-100 text-green-600',
            description: 'Operational access for daily tasks and routine system management.',
            users: 45,
            crownIcon: false,
            mainIcon: 'fa-tools',
            mainIconColor: 'text-gray-500'
        },
        {
            id: 4,
            name: 'Viewer',
            subtitle: 'Read-only Access',
            icon: 'fa-eye',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            badge: 'Active',
            badgeColor: 'bg-green-100 text-green-600',
            description: 'Read-only access for viewing reports and analytics without modification rights.',
            users: 89,
            crownIcon: false,
            mainIcon: 'fa-chart-bar',
            mainIconColor: 'text-gray-500'
        },
        {
            id: 5,
            name: 'Support',
            subtitle: 'Customer Support',
            icon: 'fa-headset',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            badge: 'Active',
            badgeColor: 'bg-green-100 text-green-600',
            description: 'Support team access for handling customer inquiries and ticket management.',
            users: 18,
            crownIcon: false,
            mainIcon: 'fa-headset',
            mainIconColor: 'text-gray-500'
        },
        {
            id: 6,
            name: 'Analyst',
            subtitle: 'Data Analyst',
            icon: 'fa-chart-line',
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
            badge: 'Active',
            badgeColor: 'bg-green-100 text-green-600',
            description: 'Analytics access for creating reports and analyzing business data.',
            users: 8,
            crownIcon: false,
            mainIcon: 'fa-chart-pie',
            mainIconColor: 'text-gray-500'
        }
    ];

    return (
        <div>

            {/* Role Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100 transition-transform transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Total Roles</h4>
                        <i className="fas fa-shield-alt text-blue-500"></i>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-2">8</p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">System Roles</span>
                            <span className="font-medium">4</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Custom Roles</span>
                            <span className="font-medium">4</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border border-gray-100 transition-transform transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Role Assignments</h4>
                        <i className="fas fa-users text-green-500"></i>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-2">248</p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Active Assignments</span>
                            <span className="font-medium">186</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Inactive Assignments</span>
                            <span className="font-medium">62</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border border-gray-100 transition-transform transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Permission Sets</h4>
                        <i className="fas fa-key text-purple-500"></i>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-2">42</p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Module Permissions</span>
                            <span className="font-medium">28</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Custom Permissions</span>
                            <span className="font-medium">14</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Roles Grid Container - ONLY THIS SHOULD HOVER */}
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100 transition-transform transform hover:scale-[1.01] hover:shadow-lg">

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">System Roles</h3>
                    <button className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition">
                        <i className="fas fa-plus mr-1"></i> Create Role
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            className="border border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-shadow cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div className={`w-10 h-10 ${role.iconBg} rounded-lg flex items-center justify-center mr-3`}>
                                        <i className={`fas ${role.icon} ${role.iconColor}`}></i>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{role.name}</h4>
                                        <p className="text-xs text-gray-500">{role.subtitle}</p>
                                    </div>
                                </div>
                                <i className={`fas ${role.mainIcon} ${role.mainIconColor}`}></i>
                            </div>

                            <p className="text-sm text-gray-600 mb-3">{role.description}</p>

                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs text-gray-500">Users: {role.users}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${role.badgeColor}`}>
                                    {role.badge}
                                </span>
                            </div>

                            <div className="flex space-x-2">
                                <button className="text-xs text-blue-600 hover:text-blue-800">View</button>
                                <button className="text-xs text-gray-600 hover:text-gray-800">Edit</button>
                                <button className="text-xs text-gray-600 hover:text-gray-800">Duplicate</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default RolesScreen;