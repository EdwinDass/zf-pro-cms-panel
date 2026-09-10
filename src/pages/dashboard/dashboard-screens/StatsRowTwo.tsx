import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import CardVariantTwo from "./CardVariantTwo";
import { getTotalScans, getKycStatus, getMemberCount, getTotalGenerated } from "../../../services/ApiService";

import { FaQrcode, FaUserCheck, FaUserShield } from "react-icons/fa";
import { stat } from "fs";

const StatsRowTwo: React.FC = () => {
    const navigate = useNavigate();
    const [totalScans, setTotalScans] = useState("0");
    const [totalQrGenerated, setTotalQrGenerated] = useState("0");
    const [kycStatus, setKycStatus] = useState({ approved: "0", pending: "0", percentage: "0" });
    const [blockedMembers, setBlockedMembers] = useState("0");
    const [activeMembers, setActiveMembers] = useState("0");
    React.useEffect(() => {
        fetchTotalScans();
        fetchTotalQrGenerated();
        fetchKycStatus();
        fetchBlockedMembers();
        fetchActiveMembers();
    }, []);

    const fetchTotalScans = async () => {
        try {
            const response = await getTotalScans({});
            setTotalScans(response?.data?.data?.totalScans?.toString() || "0");
        } catch (error) {
            console.error("Total scans error:", error);
        }
    };

    const fetchTotalQrGenerated = async () => {
        try {
            const response = await getTotalGenerated();
            setTotalQrGenerated(response?.data?.data?.totalCount?.toString() || "0");
        } catch (error) {
            console.error("Total QR generated error:", error);
        }
    };

    const fetchKycStatus = async () => {
        try {
            const response = await getKycStatus({});

            const approved = Number(response?.data?.data?.approved) || 0;
            const pending = Number(response?.data?.data?.pending) || 0;
            const total = approved + pending || 1;

            const percentage = ((approved / total) * 100).toFixed(2);

            setKycStatus({
                approved: approved.toString(),
                pending: pending.toString(),
                percentage: percentage
            });

            console.log(
                "KYC Status Response:",
                approved.toString(),
                pending.toString()
            );
        } catch (error) {
            console.error("KYC status error:", error);
        }
    };

    const fetchBlockedMembers = async () => {
        try {
            const response = await getMemberCount({ role: 1, status: "blocked" });
            setBlockedMembers(response?.data?.count?.toString() || "0");
        } catch (error) {
            console.error("Blocked members error:", error);
        }
    };

    const fetchActiveMembers = async () => {
        try {
            const [activeRes, tdsRes] = await Promise.all([
                getMemberCount({ role: 1, status: "none" }),
                getMemberCount({ role: 1, status: "tds-consent" })
            ]);
            const activeCount = parseInt(activeRes?.data?.count) || 0;
            const tdsCount = parseInt(tdsRes?.data?.count) || 0;
            setActiveMembers((activeCount + tdsCount).toString());
        } catch (error) {
            console.error("Active members error:", error);
        }
    };

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

            {/* 🔹 Scans vs QR Generated — CardVariantTwo */}
            <CardVariantTwo
                title="Scans vs QR Generated"
                icon={<FaQrcode />}
                iconColor="text-blue-500"
                leftValue={totalScans}
                leftLabel="Scans"
                rightValue={totalQrGenerated}
                rightLabel="QR Generated"
                progress={
                    Math.min(
                        100,
                        Number(totalQrGenerated) > 0
                            ? (Number(totalScans) / Number(totalQrGenerated)) * 100
                            : 0
                    )
                }
                footerText={`${totalQrGenerated !== "0" ? ((Number(totalScans) / Number(totalQrGenerated)) * 100).toFixed(2) : "0.00"}% of QR codes have been scanned`}
                // onClick={() => navigate("/qr")}
                onLeftClick={() => navigate("/reports?report=qr")}
                onRightClick={() => navigate("/qr")}
            />

            {/* 🔹 KYC Status — CardVariantTwo */}
            <CardVariantTwo
                title="KYC Status"
                icon={<FaUserCheck />}
                iconColor="text-teal-500"
                leftValue={kycStatus.approved}
                leftLabel="Approved"
                rightValue={kycStatus.pending}
                rightLabel="Pending"
                progress={Number(kycStatus.percentage)}
                footerText={`${kycStatus.percentage}% of members have completed KYC`}
                onLeftClick={() => navigate("/reports?report=kyc&kycDocStatus=Approved By Market Head")}
                onRightClick={() => navigate("/reports?report=kyc&kycDocStatus=Pending")}
            />

            {/* 🔹 User Status — CardVariantTwo */}
            <CardVariantTwo
                title="User Status"
                icon={<FaUserShield />}
                iconColor="text-amber-500"
                leftValue={activeMembers}
                leftLabel="Active"
                rightValue={blockedMembers}
                rightLabel="Blocked"
                progress={
                    Math.max(
                        0,
                        100 - ((Number(blockedMembers) || 0) /
                            ((Number(activeMembers) || 0) + (Number(blockedMembers) || 0) || 1) * 100)
                    )
                }
                footerText={`${Math.max(
                    0,
                    100 - ((Number(blockedMembers) || 0) /
                        ((Number(activeMembers) || 0) + (Number(blockedMembers) || 0) || 1) * 100)
                ).toFixed(2)}% of users are active (incl. TDS consent pending)`}
                onLeftClick={() => navigate("/reports?report=registered-users&status=active_members")}
                onRightClick={() => navigate("/reports?report=registered-users&status=blocked")}
            />

        </div>
    );
};

export default StatsRowTwo;
