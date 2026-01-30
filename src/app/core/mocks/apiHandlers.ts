import type { FetchArgs } from "@reduxjs/toolkit/query";
import type {
  Plan,
  ClientPlan,
  Agent,
  User,
  WaitingList,
} from "../interfaces/dashboard.interface";
import type {
  IAngelicaLifePlanFormData,
  AngelicaLifePlanListItem,
} from "../interfaces/angelicaLifePlan.interface";

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
  {
    id: "plan-004",
    lpafNumber: "LPAF-2024-004",
    fullName: "Carlos Reyes",
    status: "Active",
    contractPrice: 35000,
    planType: "Angelica Life Plan 5",
    modeOfPayment: "Monthly",
    termOfPayment: "Installment",
    installment: 630,
    docStamp: 70,
    dateOfBirth: "1985-03-08",
    gender: "Male",
    civilStatus: "Married",
    email: "carlos.reyes@example.com",
    contactNumber: "+63 918 777 8888",
    address: "156 Acacia St, Davao City",
  },
  {
    id: "plan-005",
    lpafNumber: "LPAF-2024-005",
    fullName: "Elena Cruz",
    status: "Pending",
    contractPrice: 42000,
    planType: "Angelica Life Plan 10",
    modeOfPayment: "Quarterly",
    termOfPayment: "Installment",
    installment: 3500,
    docStamp: 105,
    dateOfBirth: "1992-11-30",
    gender: "Female",
    civilStatus: "Single",
    email: "elena.cruz@example.com",
    contactNumber: "+63 929 444 5555",
    address: "234 Pine St, Baguio City",
  },
  {
    id: "plan-006",
    lpafNumber: "LPAF-2024-006",
    fullName: "Roberto Garcia",
    status: "Active",
    contractPrice: 55000,
    planType: "Angelica Life Plan 15",
    modeOfPayment: "Semi-Annual",
    termOfPayment: "Installment",
    installment: 9200,
    docStamp: 165,
    dateOfBirth: "1975-07-14",
    gender: "Male",
    civilStatus: "Married",
    email: "roberto.garcia@example.com",
    contactNumber: "+63 917 333 2222",
    address: "78 Oak Ave, Quezon City",
  },
  {
    id: "plan-007",
    lpafNumber: "LPAF-2024-007",
    fullName: "Sofia Mendoza",
    status: "Lapsed",
    contractPrice: 28000,
    planType: "Angelica Life Plan 5",
    modeOfPayment: "Monthly",
    termOfPayment: "Installment",
    installment: 504,
    docStamp: 56,
    dateOfBirth: "1987-12-05",
    gender: "Female",
    civilStatus: "Single",
    email: "sofia.mendoza@example.com",
    contactNumber: "+63 926 666 7777",
    address: "345 Palm Dr, Iloilo City",
  },
  {
    id: "plan-008",
    lpafNumber: "LPAF-2024-008",
    fullName: "Miguel Torres",
    status: "Active",
    contractPrice: 38000,
    planType: "Angelica Life Plan 10",
    modeOfPayment: "Quarterly",
    termOfPayment: "Installment",
    installment: 3167,
    docStamp: 95,
    dateOfBirth: "1980-04-18",
    gender: "Male",
    civilStatus: "Married",
    email: "miguel.torres@example.com",
    contactNumber: "+63 915 888 9999",
    address: "567 Mango Ln, Bacolod City",
  },
  {
    id: "plan-009",
    lpafNumber: "LPAF-2024-009",
    fullName: "Isabella Flores",
    status: "Pending",
    contractPrice: 32000,
    planType: "Angelica Life Plan 5",
    modeOfPayment: "Monthly",
    termOfPayment: "Installment",
    installment: 576,
    docStamp: 64,
    dateOfBirth: "1995-08-22",
    gender: "Female",
    civilStatus: "Single",
    email: "isabella.flores@example.com",
    contactNumber: "+63 928 111 0000",
    address: "89 Rose St, Cagayan de Oro",
  },
  {
    id: "plan-010",
    lpafNumber: "LPAF-2024-010",
    fullName: "Antonio Valdez",
    status: "Active",
    contractPrice: 45000,
    planType: "Angelica Life Plan 15",
    modeOfPayment: "Annual",
    termOfPayment: "Single Premium",
    installment: 0,
    docStamp: 135,
    dateOfBirth: "1972-06-09",
    gender: "Male",
    civilStatus: "Married",
    email: "antonio.valdez@example.com",
    contactNumber: "+63 916 555 4444",
    address: "123 Sunflower Rd, Zamboanga City",
  },
  {
    id: "plan-011",
    lpafNumber: "LPAF-2024-011",
    fullName: "Gabriela Castro",
    status: "Lapsed",
    contractPrice: 29000,
    planType: "Angelica Life Plan 10",
    modeOfPayment: "Semi-Annual",
    termOfPayment: "Installment",
    installment: 4833,
    docStamp: 73,
    dateOfBirth: "1989-10-17",
    gender: "Female",
    civilStatus: "Married",
    email: "gabriela.castro@example.com",
    contactNumber: "+63 927 999 8888",
    address: "456 Lotus Ave, General Santos",
  },
  {
    id: "plan-012",
    lpafNumber: "LPAF-2024-012",
    fullName: "Fernando Lopez",
    status: "Active",
    contractPrice: 41000,
    planType: "Angelica Life Plan 5",
    modeOfPayment: "Monthly",
    termOfPayment: "Installment",
    installment: 738,
    docStamp: 82,
    dateOfBirth: "1983-02-28",
    gender: "Male",
    civilStatus: "Single",
    email: "fernando.lopez@example.com",
    contactNumber: "+63 919 222 3333",
    address: "789 Dahlia St, Dumaguete City",
  },
  {
    id: "plan-013",
    lpafNumber: "LPAF-2024-013",
    fullName: "Camila Rivera",
    status: "Pending",
    contractPrice: 36000,
    planType: "Angelica Life Plan 10",
    modeOfPayment: "Quarterly",
    termOfPayment: "Installment",
    installment: 3000,
    docStamp: 90,
    dateOfBirth: "1991-09-11",
    gender: "Female",
    civilStatus: "Single",
    email: "camila.rivera@example.com",
    contactNumber: "+63 925 777 6666",
    address: "321 Orchid Blvd, Tagbilaran City",
  },
  {
    id: "plan-014",
    lpafNumber: "LPAF-2024-014",
    fullName: "Diego Morales",
    status: "Active",
    contractPrice: 52000,
    planType: "Angelica Life Plan 15",
    modeOfPayment: "Annual",
    termOfPayment: "Single Premium",
    installment: 0,
    docStamp: 156,
    dateOfBirth: "1977-05-03",
    gender: "Male",
    civilStatus: "Married",
    email: "diego.morales@example.com",
    contactNumber: "+63 918 444 5555",
    address: "654 Jasmine Rd, Roxas City",
  },
  {
    id: "plan-015",
    lpafNumber: "LPAF-2024-015",
    fullName: "Valentina Ruiz",
    status: "Lapsed",
    contractPrice: 27000,
    planType: "Angelica Life Plan 5",
    modeOfPayment: "Monthly",
    termOfPayment: "Installment",
    installment: 486,
    docStamp: 54,
    dateOfBirth: "1993-12-25",
    gender: "Female",
    civilStatus: "Single",
    email: "valentina.ruiz@example.com",
    contactNumber: "+63 929 000 1111",
    address: "987 Tulip Ln, Tacloban City",
  },
  {
    id: "plan-016",
    lpafNumber: "LPAF-2024-016",
    fullName: "Sebastian Gomez",
    status: "Active",
    contractPrice: 39000,
    planType: "Angelica Life Plan 10",
    modeOfPayment: "Semi-Annual",
    termOfPayment: "Installment",
    installment: 6500,
    docStamp: 98,
    dateOfBirth: "1981-08-07",
    gender: "Male",
    civilStatus: "Married",
    email: "sebastian.gomez@example.com",
    contactNumber: "+63 917 666 7777",
    address: "147 Violet St, Baybay City",
  },
  {
    id: "plan-017",
    lpafNumber: "LPAF-2024-017",
    fullName: "Luna Herrera",
    status: "Pending",
    contractPrice: 33000,
    planType: "Angelica Life Plan 5",
    modeOfPayment: "Monthly",
    termOfPayment: "Installment",
    installment: 594,
    docStamp: 66,
    dateOfBirth: "1994-04-16",
    gender: "Female",
    civilStatus: "Single",
    email: "luna.herrera@example.com",
    contactNumber: "+63 926 333 4444",
    address: "258 Daisy Ave, Ormoc City",
  },
  {
    id: "plan-018",
    lpafNumber: "LPAF-2024-018",
    fullName: "Mateo Vargas",
    status: "Active",
    contractPrice: 47000,
    planType: "Angelica Life Plan 15",
    modeOfPayment: "Quarterly",
    termOfPayment: "Installment",
    installment: 7833,
    docStamp: 118,
    dateOfBirth: "1974-11-29",
    gender: "Male",
    civilStatus: "Married",
    email: "mateo.vargas@example.com",
    contactNumber: "+63 915 888 7777",
    address: "369 Sunflower Blvd, Calbayog City",
  },
  {
    id: "plan-019",
    lpafNumber: "LPAF-2024-019",
    fullName: "Victoria Medina",
    status: "Lapsed",
    contractPrice: 31000,
    planType: "Angelica Life Plan 10",
    modeOfPayment: "Annual",
    termOfPayment: "Single Premium",
    installment: 0,
    docStamp: 93,
    dateOfBirth: "1986-07-21",
    gender: "Female",
    civilStatus: "Married",
    email: "victoria.medina@example.com",
    contactNumber: "+63 928 555 6666",
    address: "741 Lily Rd, Catbalogan City",
  },
  {
    id: "plan-020",
    lpafNumber: "LPAF-2024-020",
    fullName: "Leonardo Castillo",
    status: "Active",
    contractPrice: 43000,
    planType: "Angelica Life Plan 5",
    modeOfPayment: "Monthly",
    termOfPayment: "Installment",
    installment: 774,
    docStamp: 86,
    dateOfBirth: "1978-03-12",
    gender: "Male",
    civilStatus: "Single",
    email: "leonardo.castillo@example.com",
    contactNumber: "+63 919 111 2222",
    address: "852 Rose Blvd, Maasin City",
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
  {
    id: "agent-003",
    salesCounselorCode: "SC-003",
    name: "Carlos Mendoza",
    scStatus: "Active",
  },
  {
    id: "agent-004",
    salesCounselorCode: "SC-004",
    name: "Diana Santos",
    scStatus: "Active",
  },
  {
    id: "agent-005",
    salesCounselorCode: "SC-005",
    name: "Eduardo Reyes",
    scStatus: "Expired",
  },
  {
    id: "agent-006",
    salesCounselorCode: "SC-006",
    name: "Felicia Gomez",
    scStatus: "Active",
  },
  {
    id: "agent-007",
    salesCounselorCode: "SC-007",
    name: "Gabriel Lopez",
    scStatus: "Active",
  },
  {
    id: "agent-008",
    salesCounselorCode: "SC-008",
    name: "Helena Castro",
    scStatus: "Expired",
  },
  {
    id: "agent-009",
    salesCounselorCode: "SC-009",
    name: "Ivan Morales",
    scStatus: "Active",
  },
  {
    id: "agent-010",
    salesCounselorCode: "SC-010",
    name: "Julia Rivera",
    scStatus: "Active",
  },
  {
    id: "agent-011",
    salesCounselorCode: "SC-011",
    name: "Kevin Valdez",
    scStatus: "Expired",
  },
  {
    id: "agent-012",
    salesCounselorCode: "SC-012",
    name: "Luna Flores",
    scStatus: "Active",
  },
  {
    id: "agent-013",
    salesCounselorCode: "SC-013",
    name: "Miguel Herrera",
    scStatus: "Active",
  },
  {
    id: "agent-014",
    salesCounselorCode: "SC-014",
    name: "Nina Vargas",
    scStatus: "Expired",
  },
  {
    id: "agent-015",
    salesCounselorCode: "SC-015",
    name: "Oscar Medina",
    scStatus: "Active",
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
  {
    id: "user-003",
    username: "sc.maria",
    name: "Maria Santos",
    agentCode: "SC-003",
    userType: "SC",
    contactNo: "+63 917 555 6666",
  },
  {
    id: "user-004",
    username: "sc.carlos",
    name: "Carlos Mendoza",
    agentCode: "SC-004",
    userType: "SC",
    contactNo: "+63 918 777 8888",
  },
  {
    id: "user-005",
    username: "sc.diana",
    name: "Diana Santos",
    agentCode: "SC-005",
    userType: "SC",
    contactNo: "+63 919 999 0000",
  },
  {
    id: "user-006",
    username: "manager.pedro",
    name: "Pedro Garcia",
    agentCode: "SC-000",
    userType: "ADMIN",
    contactNo: "+63 920 111 2222",
  },
  {
    id: "user-007",
    username: "sc.eduardo",
    name: "Eduardo Reyes",
    agentCode: "SC-006",
    userType: "SC",
    contactNo: "+63 921 333 4444",
  },
  {
    id: "user-008",
    username: "sc.felicia",
    name: "Felicia Gomez",
    agentCode: "SC-007",
    userType: "SC",
    contactNo: "+63 922 555 6666",
  },
  {
    id: "user-009",
    username: "sc.gabriel",
    name: "Gabriel Lopez",
    agentCode: "SC-008",
    userType: "SC",
    contactNo: "+63 923 777 8888",
  },
  {
    id: "user-010",
    username: "sc.helena",
    name: "Helena Castro",
    agentCode: "SC-009",
    userType: "SC",
    contactNo: "+63 924 999 0000",
  },
  {
    id: "user-011",
    username: "manager.ana",
    name: "Ana Rodriguez",
    agentCode: "SC-000",
    userType: "ADMIN",
    contactNo: "+63 925 111 2222",
  },
  {
    id: "user-012",
    username: "sc.ivan",
    name: "Ivan Morales",
    agentCode: "SC-010",
    userType: "SC",
    contactNo: "+63 926 333 4444",
  },
  {
    id: "user-013",
    username: "sc.julia",
    name: "Julia Rivera",
    agentCode: "SC-011",
    userType: "SC",
    contactNo: "+63 927 555 6666",
  },
  {
    id: "user-014",
    username: "sc.kevin",
    name: "Kevin Valdez",
    agentCode: "SC-012",
    userType: "SC",
    contactNo: "+63 928 777 8888",
  },
  {
    id: "user-015",
    username: "sc.luna",
    name: "Luna Flores",
    agentCode: "SC-013",
    userType: "SC",
    contactNo: "+63 929 999 0000",
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
  {
    id: "wait-003",
    policyNo: "POL-203",
    lpafNo: "LPAF-2024-012",
    name: "Bruce Banner",
    status: "Review",
  },
  {
    id: "wait-004",
    policyNo: "POL-204",
    lpafNo: "LPAF-2024-013",
    name: "Natasha Romanoff",
    status: "For Payment",
  },
  {
    id: "wait-005",
    policyNo: "POL-205",
    lpafNo: "LPAF-2024-014",
    name: "Tony Stark",
    status: "Review",
  },
  {
    id: "wait-006",
    policyNo: "POL-206",
    lpafNo: "LPAF-2024-015",
    name: "Steve Rogers",
    status: "For Payment",
  },
  {
    id: "wait-007",
    policyNo: "POL-207",
    lpafNo: "LPAF-2024-016",
    name: "Thor Odinson",
    status: "Review",
  },
  {
    id: "wait-008",
    policyNo: "POL-208",
    lpafNo: "LPAF-2024-017",
    name: "Wanda Maximoff",
    status: "For Payment",
  },
  {
    id: "wait-009",
    policyNo: "POL-209",
    lpafNo: "LPAF-2024-018",
    name: "Vision",
    status: "Review",
  },
  {
    id: "wait-010",
    policyNo: "POL-210",
    lpafNo: "LPAF-2024-019",
    name: "Sam Wilson",
    status: "For Payment",
  },
  {
    id: "wait-011",
    policyNo: "POL-211",
    lpafNo: "LPAF-2024-020",
    name: "Bucky Barnes",
    status: "Review",
  },
  {
    id: "wait-012",
    policyNo: "POL-212",
    lpafNo: "LPAF-2024-021",
    name: "Scott Lang",
    status: "For Payment",
  },
  {
    id: "wait-013",
    policyNo: "POL-213",
    lpafNo: "LPAF-2024-022",
    name: "Hope van Dyne",
    status: "Review",
  },
  {
    id: "wait-014",
    policyNo: "POL-214",
    lpafNo: "LPAF-2024-023",
    name: "T'Challa",
    status: "For Payment",
  },
  {
    id: "wait-015",
    policyNo: "POL-215",
    lpafNo: "LPAF-2024-024",
    name: "Shuri",
    status: "Review",
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
      contactNumberCountryCode: "+63",
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
