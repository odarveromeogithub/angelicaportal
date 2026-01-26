import type { FetchArgs } from "@reduxjs/toolkit/query";
import type {
  Plan,
  ClientPlan,
  Agent,
  User,
  WaitingList,
} from "../interfaces/dashboard.interface";
import type { IAngelicaLifePlanFormData } from "../interfaces/angelica-life-plan.interface";

interface AngelicaLifePlanListItem {
  id: string;
  planId: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  planholderName: string;
  planType: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard mock data
const MOCK_PLANS: Plan[] = [
  {
    id: "plan-001",
    lpafNumber: "LPAF-2024-001",
    fullName: "Jane Doe",
    status: "Active",
    contractPrice: 30000,
    planType: "Angelica Life Plan 5",
    modeOfPayment: "Monthly",
    termOfPayment: "Installment",
    installment: 540,
    docStamp: 60,
    dateOfBirth: "1990-05-12",
    gender: "Female",
    civilStatus: "Single",
    email: "jane.doe@example.com",
    contactNumber: "+63 912 345 6789",
    address: "123 Mango Ave, Cebu City",
  },
  {
    id: "plan-002",
    lpafNumber: "LPAF-2024-002",
    fullName: "John Smith",
    status: "Pending",
    contractPrice: 48000,
    planType: "Angelica Life Plan 10",
    modeOfPayment: "Quarterly",
    termOfPayment: "Installment",
    installment: 4000,
    docStamp: 120,
    dateOfBirth: "1988-09-22",
    gender: "Male",
    civilStatus: "Married",
    email: "john.smith@example.com",
    contactNumber: "+63 917 555 0000",
    address: "45 Molave St, Makati City",
  },
  {
    id: "plan-003",
    lpafNumber: "LPAF-2024-003",
    fullName: "Maria Santos",
    status: "Lapsed",
    contractPrice: 25000,
    planType: "Angelica Life Plan 15",
    modeOfPayment: "Annual",
    termOfPayment: "Single Premium",
    installment: 0,
    docStamp: 150,
    dateOfBirth: "1979-01-15",
    gender: "Female",
    civilStatus: "Widowed",
    email: "maria.santos@example.com",
    contactNumber: "+63 927 222 1111",
    address: "89 Banilad Rd, Cebu City",
  },
];

const MOCK_CLIENT_PLANS: ClientPlan[] = MOCK_PLANS.map((plan) => ({
  id: plan.id,
  lpafNo: plan.lpafNumber,
  policyNo: `POL-${plan.id.slice(-3)}`,
  name: plan.fullName,
  status: plan.status,
  accountStatus: plan.status === "Active" ? "Verified" : "Unverified",
  contractPrice: plan.contractPrice.toLocaleString(),
  planType: plan.planType,
  modeOfPayment: plan.modeOfPayment,
  termOfPayment: plan.termOfPayment,
  installment: plan.installment.toLocaleString(),
  docStamp: plan.docStamp.toLocaleString(),
  dateOfBirth: plan.dateOfBirth,
  gender: plan.gender,
  civilStatus: plan.civilStatus,
  email: plan.email,
  contactNumber: plan.contactNumber,
  address: plan.address,
}));

const MOCK_AGENTS: Agent[] = [
  {
    id: "agent-001",
    salesCounselorCode: "SC-001",
    name: "Alex Torres",
    scStatus: "Active",
  },
  {
    id: "agent-002",
    salesCounselorCode: "SC-002",
    name: "Bianca Cruz",
    scStatus: "Expired",
  },
];

const MOCK_USERS: User[] = [
  {
    id: "user-001",
    username: "admin",
    name: "Admin User",
    agentCode: "SC-000",
    userType: "ADMIN",
    contactNo: "+63 900 000 0000",
  },
  {
    id: "user-002",
    username: "sc.juan",
    name: "Juan Dela Cruz",
    agentCode: "SC-001",
    userType: "SC",
    contactNo: "+63 912 333 4444",
  },
];

const MOCK_WAITING_LIST: WaitingList[] = [
  {
    id: "wait-001",
    policyNo: "POL-201",
    lpafNo: "LPAF-2024-010",
    name: "Peter Parker",
    status: "Review",
  },
  {
    id: "wait-002",
    policyNo: "POL-202",
    lpafNo: "LPAF-2024-011",
    name: "Mary Jane",
    status: "For Payment",
  },
];

// Angelica Life Plan mocks
const MOCK_LIFE_PLAN_LIST: AngelicaLifePlanListItem[] = [
  {
    id: "alp-001",
    planId: "ALP-001",
    status: "draft",
    planholderName: "Jane Doe",
    planType: "Angelica Life Plan 5",
    createdAt: "2024-12-01T08:00:00Z",
    updatedAt: "2024-12-05T10:00:00Z",
  },
  {
    id: "alp-002",
    planId: "ALP-002",
    status: "submitted",
    planholderName: "John Smith",
    planType: "Angelica Life Plan 10",
    createdAt: "2024-12-02T09:00:00Z",
    updatedAt: "2024-12-06T11:00:00Z",
  },
];

const MOCK_LIFE_PLAN_DETAIL: Record<string, IAngelicaLifePlanFormData> = {
  "alp-001": {
    plan: {
      salesCounselorName: "Alex Torres",
      salesCounselorCode: "SC-001",
      salesCounselorReferral: "https://sc.cclpi.com.ph/ref/SC-001",
      contactPrice: "30000",
      planType: "Angelica Life Plan 5",
      modeOfPayment: "Monthly",
      termOfPay: "Installment",
      installment: "540.00",
      docStamp: "60.00",
    },
    planholder: {
      firstName: "Jane",
      middleName: "M",
      lastName: "Doe",
      nameExtension: "",
      dateOfBirth: "1990-05-12",
      gender: "Female",
      civilStatus: "Single",
      email: "jane.doe@example.com",
      contactNumber: "9123456789",
      lotHouseNumber: "123",
      street: "Mango Ave",
      barangay: "Lahug",
      cityMunicipal: "Cebu City",
      province: "Cebu",
      zipCode: "6000",
    },
    beneficiaries: [
      {
        firstName: "Maria",
        middleName: "S",
        lastName: "Doe",
        nameExtension: "",
        age: "55",
        gender: "Female",
        address: "Same as planholder",
        relationship: "Mother",
      },
      {
        firstName: "Mark",
        middleName: "J",
        lastName: "Doe",
        nameExtension: "",
        age: "30",
        gender: "Male",
        address: "Same as planholder",
        relationship: "Brother",
      },
    ],
    planholder_signature: "",
    id_upload: null,
    agree_to_consent: true,
  },
};

export type MockHandledResult = { handled: true; data: unknown };
export type MockNotHandledResult = { handled: false };
export type MockResult = MockHandledResult | MockNotHandledResult;

const notHandled: MockNotHandledResult = { handled: false };

const normalizeRoute = (url: string): string =>
  url.replace(/^\//, "").split("?")[0];

const getMethod = (args: FetchArgs | string): string => {
  if (typeof args === "string") return "GET";
  return (args.method || "GET").toUpperCase();
};

const getBody = (args: FetchArgs | string): unknown =>
  typeof args === "string" ? undefined : args.body;

const getRoute = (args: FetchArgs | string): string => {
  if (typeof args === "string") return normalizeRoute(args);
  return normalizeRoute(args.url ?? "");
};

export const handleMockRequest = async (
  args: FetchArgs | string,
): Promise<MockResult> => {
  const method = getMethod(args);
  const route = getRoute(args);
  const body = getBody(args);

  // Dashboard endpoints
  if (route === "dashboard/plans" && method === "GET") {
    return { handled: true, data: MOCK_PLANS };
  }

  if (route.startsWith("dashboard/plans/") && method === "GET") {
    const id = route.split("/")[2];
    const found = MOCK_PLANS.find((p) => p.id === id);
    if (found) return { handled: true, data: found };
    return { handled: true, data: null };
  }

  if (route === "dashboard/plans" && method === "POST") {
    const newPlan: Plan = {
      ...(body as Partial<Plan>),
      id: `plan-${MOCK_PLANS.length + 1}`,
      lpafNumber:
        (body as any)?.lpafNumber || `LPAF-2024-${MOCK_PLANS.length + 1}`,
      status: "Pending",
      contractPrice: Number((body as any)?.contractPrice ?? 0),
      planType: (body as any)?.planType || "Angelica Life Plan 5",
      modeOfPayment: (body as any)?.modeOfPayment || "Monthly",
      termOfPayment: (body as any)?.termOfPayment || "Installment",
      installment: Number((body as any)?.installment ?? 0),
      docStamp: Number((body as any)?.docStamp ?? 0),
      dateOfBirth: (body as any)?.dateOfBirth || "1990-01-01",
      gender: (body as any)?.gender || "Male",
      civilStatus: (body as any)?.civilStatus || "Single",
      fullName: (body as any)?.fullName || "New Planholder",
      email: (body as any)?.email || "new.user@example.com",
      contactNumber: (body as any)?.contactNumber || "+63 900 000 0000",
      address: (body as any)?.address || "Sample Address",
    };
    MOCK_PLANS.push(newPlan);
    return { handled: true, data: newPlan };
  }

  if (
    route.startsWith("dashboard/plans/") &&
    ["PUT", "PATCH"].includes(method)
  ) {
    const id = route.split("/")[2];
    const idx = MOCK_PLANS.findIndex((p) => p.id === id);
    if (idx >= 0) {
      MOCK_PLANS[idx] = { ...MOCK_PLANS[idx], ...(body as Partial<Plan>) };
      return { handled: true, data: MOCK_PLANS[idx] };
    }
    return { handled: true, data: null };
  }

  if (route.startsWith("dashboard/plans/") && method === "DELETE") {
    return { handled: true, data: { success: true } };
  }

  if (route === "dashboard/clients" && method === "GET") {
    return { handled: true, data: MOCK_CLIENT_PLANS };
  }

  if (route.startsWith("dashboard/clients/") && method === "GET") {
    const id = route.split("/")[2];
    const found = MOCK_CLIENT_PLANS.find((c) => c.id === id);
    return { handled: true, data: found || null };
  }

  if (route === "dashboard/agents" && method === "GET") {
    return { handled: true, data: MOCK_AGENTS };
  }

  if (route.startsWith("dashboard/agents/") && method === "GET") {
    const id = route.split("/")[2];
    const found = MOCK_AGENTS.find((a) => a.id === id);
    return { handled: true, data: found || null };
  }

  if (route === "dashboard/users" && method === "GET") {
    return { handled: true, data: MOCK_USERS };
  }

  if (route.startsWith("dashboard/users/") && method === "GET") {
    const id = route.split("/")[2];
    const found = MOCK_USERS.find((u) => u.id === id);
    return { handled: true, data: found || null };
  }

  if (route === "dashboard/users" && method === "POST") {
    const newUser: User = {
      id: `user-${MOCK_USERS.length + 1}`,
      username: (body as any)?.username || "new.user",
      name: (body as any)?.name || "New User",
      agentCode: (body as any)?.agentCode || "SC-000",
      userType: (body as any)?.userType || "SC",
      contactNo: (body as any)?.contactNo || "+63 900 111 1111",
    };
    MOCK_USERS.push(newUser);
    return { handled: true, data: newUser };
  }

  if (
    route.startsWith("dashboard/users/") &&
    ["PUT", "PATCH"].includes(method)
  ) {
    const id = route.split("/")[2];
    const idx = MOCK_USERS.findIndex((u) => u.id === id);
    if (idx >= 0) {
      MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...(body as Partial<User>) };
      return { handled: true, data: MOCK_USERS[idx] };
    }
    return { handled: true, data: null };
  }

  if (route.startsWith("dashboard/users/") && method === "DELETE") {
    return { handled: true, data: { success: true } };
  }

  if (route === "dashboard/waiting-list" && method === "GET") {
    return { handled: true, data: MOCK_WAITING_LIST };
  }

  // Angelica life plan endpoints
  if (route === "angelica-life-plan" && method === "GET") {
    return { handled: true, data: MOCK_LIFE_PLAN_LIST };
  }

  if (route.startsWith("angelica-life-plan/") && method === "GET") {
    const id = route.split("/")[1];
    const detail = MOCK_LIFE_PLAN_DETAIL[id];
    if (detail) return { handled: true, data: detail };
    return { handled: true, data: null };
  }

  if (route === "angelica-life-plan/submit" && method === "POST") {
    return {
      handled: true,
      data: {
        success: true,
        message: "Plan submitted (mock)",
        data: {
          planId: "ALP-MOCK-SUBMIT",
          status: "submitted" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    };
  }

  if (route === "angelica-life-plan/draft" && method === "POST") {
    return {
      handled: true,
      data: {
        success: true,
        message: "Draft saved (mock)",
        data: {
          planId: "ALP-MOCK-DRAFT",
          status: "draft" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    };
  }

  if (
    route.startsWith("angelica-life-plan/") &&
    ["PUT", "PATCH"].includes(method)
  ) {
    const id = route.split("/")[1];
    return {
      handled: true,
      data: {
        success: true,
        message: `Plan ${id} updated (mock)`,
        data: {
          planId: id,
          status: "submitted" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    };
  }

  if (route.startsWith("angelica-life-plan/") && method === "DELETE") {
    return { handled: true, data: { success: true } };
  }

  if (route === "angelica-life-plan/upload-id" && method === "POST") {
    return {
      handled: true,
      data: { success: true, url: "https://mock.cdn/id-upload.png" },
    };
  }

  if (route === "angelica-life-plan/upload-signature" && method === "POST") {
    return {
      handled: true,
      data: { success: true, url: "https://mock.cdn/signature.png" },
    };
  }

  return notHandled;
};
