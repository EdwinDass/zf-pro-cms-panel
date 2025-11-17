// src/components/CardsContainer/CardsContainer.tsx

import React from "react";
import Card from "../dashboard-screens/Card";
import { FaCoins, FaGift, FaUsers, FaUserCheck } from "react-icons/fa";


const StatsRowOne: React.FC = () => {
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card
                title="Total Members"
                value="1,245"
                percentage="+12.5%"
                percentageColor="text-green-600"
                icon={<FaUsers />}
                iconColor='text-blue-500'
            />

            <Card
                title="Active Members"
                value="432"
                percentage="+4.2%"
                percentageColor="text-green-600"
                icon={<FaUserCheck />}
                iconColor='text-green-500'
            />

            <Card
                title="Total Points Issued"
                value="₹82,450"
                percentage="+9.1%"
                percentageColor="text-green-600"
                icon={<FaCoins />}
                iconColor='text-yellow-500'
            />

            <Card
                title="Points Redeemed"
                value="12"
                percentage="-3.4%"
                percentageColor="text-red-600"
                icon={<FaGift />}
                iconColor='text-purple-500'
            />
        </div>

    );
};

export default StatsRowOne;
