export interface ExporterType {
    exporter: () => Promise<any[]>;
    reportName:
    | "Application Login Report"
    | "Registered Users Report"
    | "QR Transaction Report"
    | "Redemption Report"
    | "Referrals Report"
    | "Process Redemption"
    | "OTP Report"
    | "Amazon Marketplace"
    | "Bank Details Report"
    | "KYC Report"
    | "Product Wise Report"
    | "Category Report"
    | "Error Transaction Report"
    | "Notification Report"
    | "Blocked Member Report"
    | "Blocked Member Scan Report"
    | "Anomaly Transactions Report"
}
