export interface Plan {
  id: string;
  lpafNumber: string;
  fullName: string;
  status: "Active" | "Lapsed" | "Pending";
  contractPrice: number;
  planType: string;
  modeOfPayment: string;
  termOfPayment: string;
  installment: number;
  docStamp: number;
  dateOfBirth: string;
  gender: string;
  civilStatus: string;
  email: string;
  contactNumber: string;
  address: string;
}

export interface ClientPlan {
  id: string;
  lpafNo: string;
  policyNo: string;
  name: string;
  status: "Active" | "Lapsed" | "Pending";
  accountStatus?: "Verified" | "Unverified";
  contractPrice: string;
  planType: string;
  modeOfPayment: string;
  termOfPayment: string;
  installment: string;
  docStamp: string;
  dateOfBirth: string;
  gender: string;
  civilStatus: string;
  email: string;
  contactNumber: string;
  address: string;
}

export interface WaitingListItem {
  id: string;
  policyNo: string;
  lpafNo: string;
  name: string;
  status: string;
}

export type WaitingList = WaitingListItem; // Alias for consistency

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountStatus: "Verified" | "Unverified";
}

export interface Agent {
  id: string;
  salesCounselorCode: string;
  name: string;
  scStatus: "Active" | "Expired";
}

export interface User {
  id: string;
  username: string;
  name: string;
  agentCode: string;
  userType: "ADMIN" | "SC";
  contactNo: string;
}

export type SystemUser = User; // Alias for backward compatibility

export type DashboardUserRole = "client" | "sales" | "admin";

export interface DashboardUser {
  id: string;
  name: string;
  role: DashboardUserRole;
  email: string;
  avatar?: string;
}
