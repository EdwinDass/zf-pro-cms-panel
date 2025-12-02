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
}
