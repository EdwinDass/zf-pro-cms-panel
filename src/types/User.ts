export class UserDetails {
  userId: number;
  userName: string;
  userCode: string;
  userEmail: string;
  displayName: string;
  userMobile: string;
  userRole: string;
  userSubRole: string;
  userRoleId: number;
  userSubRoleId: number;
  age: string;
  blockStatus: "none" | "digilocker" | "kyc" | "incomplete-registration" | "kyc-admin" | "login" | "scan" | "redeem" | "inactive" | "dormant";
  gender: string;
  firmName: string;
  profileUrl: string;
  tier: string;
  notificationCount: string;
  kycApproval: boolean;
  pointSummary: PointSummary;
  addressDetails: AddressDetails;
  lastLoginAt: string = "";
  lastLogoutAt: string = "";
  jobTitle: string = "";
  tdsConsent: boolean = false;
  tdsSlabs: string = "";
  referralCode: string = ""
  constructor(data: any) {
    this.userId = data?.userId || "";
    this.userName = data?.userName || "";
    this.userCode = data?.userCode || "";
    this.userEmail = data?.userEmail || "";
    this.displayName = data?.displayName || "";
    this.userMobile = data?.userMobile || "";
    this.userRoleId = data?.userRoleId?.toString() || "";
    this.userSubRoleId = data?.userSubRoleId?.toString() || "";
    this.age = data?.age || "";
    this.userRole = data?.userRole || "";
    this.gender = data?.gender || "";
    this.userSubRole = data?.subRoleName || "";
    this.blockStatus = data?.blockStatus || "";
    this.firmName = data?.dfirmName || data?.rfirmName || "";
    this.profileUrl = data?.dprofileUrl || data?.rprofileUrl || "";
    this.notificationCount = data?.notificationCount || "";
    this.kycApproval = data?.kycApproval || false;
    this.jobTitle = data?.jobTitle || "";
    this.tier = data?.tier || "";
    this.tdsConsent = data?.tdsConsent || false;
    this.tdsSlabs = data?.tdsSlabs || false;
    this.referralCode = data?.referralCode || "";
    this.pointSummary = new PointSummary(data || {});
    this.addressDetails = new AddressDetails(data || {});
  }
}

export class PointSummary {
  earnedPoints: string;
  redeemedPoints: string;
  balancePoints: string;
  bonusPoints: string;
  constructor(data: PointSummary) {
    this.earnedPoints = data?.earnedPoints
    this.redeemedPoints = data?.redeemedPoints
    this.balancePoints = data?.balancePoints
    this.bonusPoints = data?.bonusPoints
  }
}

export interface BankDetails {
  accountNumber: string;
  accountIfsc: string;
  accountType: string;
  bankName: string;
  bankBranch: string;
  accountHolderName: string;
  vpaId: string;
  chequeUrl: string;
  updatedAt: string;
  upiId: string
}

export class AddressDetails {
  currentAddress: string;
  currentCity: string;
  currentDistrict: string;
  currentPincode: number;
  currentState: string;
  zone_id: string;
  branch_id: string;
  constructor(data: AddressDetails) {
    this.currentAddress = data?.currentAddress
    this.currentCity = data?.currentCity
    this.currentDistrict = data?.currentDistrict
    this.currentPincode = data?.currentPincode
    this.currentState = data?.currentState
    this.zone_id = data?.zone_id
    this.branch_id = data?.branch_id
  }
}

export default interface User {
  userId: number;
  userName: string;
  userCode: string;
  pointSummary?: PointSummary | undefined;
  bankDetails?: BankDetails | undefined;
  addressDetails?: AddressDetails | undefined;
}

export class RegisterUser1 {
  userEmail: string;
  userMobile: string;
  userRole: number | null;
  userPassword: string;
  constructor(data: Partial<RegisterUser1>) {
    this.userEmail = data?.userEmail || ""
    this.userMobile = data?.userMobile || ""
    this.userRole = data?.userRole || null
    this.userPassword = data?.userPassword || ""
  }
}


export class UserProfileUpdate {
  userName: string;
  gender: string;
  age: string;
  currentAddress: string;
  workshopName: string;
  pincode: string;
  district: string;
  workshopAddress: string;
  currentPincode: number | null;
  userProfile: string = "";
  constructor(data: Partial<UserProfileUpdate>) {
    this.userName = data?.userName || ""
    this.gender = data?.gender || ""
    this.age = data?.age || ""
    this.currentAddress = data?.currentAddress || ""
    this.workshopName = data?.workshopName || ""
    this.pincode = data?.pincode || ""
    this.district = data?.district || ""
    this.workshopAddress = data?.workshopAddress || ""
    this.currentPincode = Number(data?.currentPincode) ? Number(data?.currentPincode) : null
  }
}