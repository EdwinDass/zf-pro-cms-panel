import React, { useEffect, useState } from "react";
import Card from "../dashboard-screens/Card";
import { FaCoins, FaGift, FaUsers, FaUserCheck } from "react-icons/fa";
import { getMemberCount, getScannedPoints, getRedeemedPoints } from "../../../services/ApiService";

const StatsRowOne: React.FC = () => {

    const [totalMembers, setTotalMembers] = useState("0");
    const [activeMembers, setActiveMembers] = useState("0");
    const [scannedPoints, setScannedPoints] = useState("0");
    const [redeemedPoints, setRedeemedPoints] = useState("0");

    useEffect(() => {
        fetchTotalMembers();
        fetchActiveMembers();
        fetchScannedPoints();
        fetchRedeemedPoints();
    }, []);

    const fetchTotalMembers = async () => {
        try {
            const response = await getMemberCount({ role: 1 });
            setTotalMembers(response?.data?.count?.toString() || "0");
        } catch (error) {
            console.error("Total members error:", error);
        }
    };

    const fetchActiveMembers = async () => {
        try {
            const response = await getMemberCount({ role: 1, status: "none" });
            setActiveMembers(response?.data?.count?.toString() || "0");
        } catch (error) {
            console.error("Active members error:", error);
        }
    };

    const fetchScannedPoints = async () => {
        try {
            const response = await getScannedPoints({});
            setScannedPoints(response?.data?.data?.totalPointsScanned?.toString() || "0");
        } catch (error) {
            console.error("Scanned points error:", error);
        }
    };

    const fetchRedeemedPoints = async () => {
        try {
            const response = await getRedeemedPoints({});
            setRedeemedPoints(response?.data?.data?.totalPointsRedeemed?.toString() || "0");
        } catch (error) {
            console.error("Redeemed points error:", error);
        }
    };

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

            {/* CARD 1 */}
            <Card
                title="Total Members"
                value={totalMembers}
                percentage="+12.5%"
                percentageColor="text-green-600"
                icon={<FaUsers />}
                iconColor='text-blue-500'
            />

            {/* CARD 2 */}
            <Card
                title="Active Members"
                value={activeMembers}
                percentage="+4.2%"
                percentageColor="text-green-600"
                icon={<FaUserCheck />}
                iconColor='text-green-500'
            />

            {/* CARD 3 (static now) */}
            <Card
                title="Total Points Issued"
                value={scannedPoints}
                percentage="+9.1%"
                percentageColor="text-green-600"
                icon={<FaCoins />}
                iconColor='text-yellow-500'
            />

            {/* CARD 4 (static now) */}
            <Card
                title="Points Redeemed"
                value={redeemedPoints}
                percentage="-3.4%"
                percentageColor="text-red-600"
                icon={<FaGift />}
                iconColor='text-purple-500'
            />
        </div>
    );
};

export default StatsRowOne;
