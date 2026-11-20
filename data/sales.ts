export interface SalesMonth {
  month: string;
  shortLabel: string;
  sales: number;
  monthToDate?: true;
}

interface OfficeStaffMember {
  name: string;
  role: string;
}

const branchManager = { name: "Andrew Tate", role: "Branch Manager" };

export const salesMonths = [
  { month: "June", shortLabel: "Jun", sales: 42_000 },
  { month: "July", shortLabel: "Jul", sales: 36_500 },
  { month: "August", shortLabel: "Aug", sales: 27_000 },
  { month: "September", shortLabel: "Sep", sales: 21_200 },
  { month: "October", shortLabel: "Oct", sales: 16_800 },
  { month: "November", shortLabel: "Nov", sales: 12_450, monthToDate: true },
] satisfies SalesMonth[];

export const employeeSales = {
  name: "James Bond",
  role: "Sales Associate",
  branch: "Grand Meridian Office",
  manager: branchManager.name,
  status: "Active",
  target: 50_000,
  actual: salesMonths[salesMonths.length - 1].sales,
  closed: 3,
  assigned: 28,
  quarterRating: "Below Expectations",
};

export const officeStaff: readonly OfficeStaffMember[] = [
  { name: employeeSales.name, role: employeeSales.role },
  branchManager,
];

export const branchReport = {
  date: "November 18, 2026",
  target: employeeSales.target,
  actual: employeeSales.actual,
  previousTarget: employeeSales.target,
  previousActual: salesMonths[salesMonths.length - 2].sales,
  memo: {
    from: "Regional Sales Operations",
    to: branchManager.name,
    date: "November 16, 2026",
    subject: "November recovery plan",
    body: "Grand Meridian closed October below quota and is again behind its November target pace. Send me a recovery plan by Friday with the next step and follow-up date for each stalled account. We'll go through it together before Monday's regional call.",
  },
};
