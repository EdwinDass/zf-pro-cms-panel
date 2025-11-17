// src/components/CardsContainer/CardsContainer.tsx

import React from "react";
import Card from "./Card";
import CardVariantTwo from "./CardVariantTwo";

import { FaQrcode, FaUserCheck, FaUserShield } from "react-icons/fa";

const StatsRowTwo: React.FC = () => {
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

            {/* 🔹 Normal Card */}
            <Card
                title="Total Scans"
                value="24,369"
                percentage="+15.2%"
                percentageColor="text-green-600"
                icon={<FaQrcode />}
                iconColor="text-indigo-500"
            />

            {/* 🔹 KYC Status — CardVariantTwo */}
            <CardVariantTwo
                title="KYC Status"
                icon={<FaUserCheck />}
                iconColor="text-teal-500"

                leftValue="9,362"
                leftLabel="Approved"

                rightValue="3,056"
                rightLabel="Pending"

                progress={75}
                footerText="75% of members have completed KYC"
            />

            {/* 🔹 User Status — CardVariantTwo */}
            <CardVariantTwo
                title="User Status"
                icon={<FaUserShield />}
                iconColor="text-amber-500"

                leftValue="10,089"
                leftLabel="Active"

                rightValue="2,297"
                rightLabel="Blocked"

                progress={81}
                footerText="81% of users are active"
            />

        </div>
    );
};

export default StatsRowTwo;
