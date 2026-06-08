import {
    ApplicationLoginReportKeys,
    RegisteredUsersReportKeys,
    QRTransactionReportKeys,
    ReferralsReportKeys,
    RedemptionReportKeys,
    OtpReportKeys,
    AmazonMarketplaceKeys,
    BankDetailsReportKeys,
    KycReportKeys,
    ProductWiseReportKeys,
    CategoryReportKeys,
    ErrorTransactionReportKeys,
    NotificationReportKeys,
    BlockedMemberReportKeys,
    BlockedMemberScanReportKeys,
    AnomalyTransactionsReportKeys,
    CategoriesListKeys,
    SubCategoriesListKeys,
    ShockReplacementReportKeys,
    TicketsListKeys,
} from "../utils/ExportKeyMappings";
import * as XLSX from "xlsx";
import { ExporterType } from "../types/Export";
import DownloadIcon from "@mui/icons-material/Download";

const ExporterButton = ({
    exporter,
    reportName,
}: ExporterType) => {

    const downloadExcel = async () => {
        try {
            const data = await exporter();
            if (!data?.length) return;

            let mappings: any;

            switch (reportName) {
                case "Application Login Report":
                    mappings = ApplicationLoginReportKeys;
                    break;

                case "Registered Users Report":
                    mappings = RegisteredUsersReportKeys;
                    break;

                case "QR Transaction Report":
                    mappings = QRTransactionReportKeys;
                    break;

                case "Referrals Report":
                    mappings = ReferralsReportKeys;
                    break;

                case "Redemption Report":
                    mappings = RedemptionReportKeys;
                    break;
                case "OTP Report":
                    mappings = OtpReportKeys;
                    break;
                case "Amazon Marketplace":
                    mappings = AmazonMarketplaceKeys;
                    break;
                case "Bank Details Report":
                    mappings = BankDetailsReportKeys;
                    break;
                case "KYC Report":
                    mappings = KycReportKeys;
                    break;
                case "Product Wise Report":
                    mappings = ProductWiseReportKeys;
                    break;
                case "Category Report":
                    mappings = CategoryReportKeys;
                    break;
                case "Error Transaction Report":
                    mappings = ErrorTransactionReportKeys;
                    break;
                case "Notification Report":
                    mappings = NotificationReportKeys;
                    break;
                case "Blocked Member Report":
                    mappings = BlockedMemberReportKeys;
                    break;
                case "Blocked Member Scan Report":
                    mappings = BlockedMemberScanReportKeys;
                    break;
                case "Anomaly Transactions Report":
                    mappings = AnomalyTransactionsReportKeys;
                    break;
                case "Categories List":
                    mappings = CategoriesListKeys;
                    break;
                case "Subcategories List":
                    mappings = SubCategoriesListKeys;
                    break;
                case "Shock Replacement Report":
                    mappings = ShockReplacementReportKeys;
                    break;
                case "Tickets List":
                    mappings = TicketsListKeys;
                    break;

                default:
                    console.warn("❗ Export mapping not found for:", reportName);
                    return;
            }

            const dateFields = [
                "firstLogin",
                "lastLogin",
                "logoutDate",
                "transactionDate",
                "dob",
                "dateOfReferral",
                "createdAt",
                "redemptionProcessedDate",
                "dateOfJoining",
                "scanDate",
                "deliveredDate",
                "sentDate",
                "redemptionRequestDate",
                "dateOfScan",
                "firstScanDate",
                "lastScanDate",
                "updatedAt"
            ];

            const numberFields: string[] = [
                "TicketID",
                "quantity",
                "welcomePoints",
                "totalScannedPoints",
                "totalRewardPoints",
                "totalRedeemedPoints",
                "totalBalancePoints",
                "pointsEarnedBySender",
                "pointsEarnedByReceiver",
                "redeemedPoints",
                "totalEarnedPoints",
                "amount",
                "productsInCategory",
                "bonusPoints",
                "basePoint",
                "extraBonusPoint",
                "totalPoints",
                "anomalyValueScanned",
                "totalPointsScanned",
                "frequencyOfAnomaly"
            ];

            const worksheet = XLSX.utils.json_to_sheet(
                data.map((ele: any) => {
                    return Object.keys(mappings).reduce((acc: any, key: any) => {

                        if (dateFields.includes(key)) {
                            acc[mappings[key]] = ele[key]
                                ? new Date(ele[key]).toLocaleString()
                                : "";
                        }
                        else if (numberFields.includes(key)) {
                            acc[mappings[key]] = ele[key] ?? 0;
                        }
                        else {
                            acc[mappings[key]] = ele[key] ?? "";
                        }

                        return acc;
                    }, {});
                })
            );

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, `${reportName}.xlsx`);

        } catch (e) {
            console.error("EXPORT ERROR:", e);
        }
    };

    return (
        <button
            className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-700 bg-white hover:bg-green-50 rounded-lg text-sm font-medium transition-all active:scale-95 shadow-sm"
            onClick={downloadExcel}
            title="Export to Excel"
        >
            <DownloadIcon fontSize="small" />
            Export
        </button>

    );
};

export default ExporterButton;