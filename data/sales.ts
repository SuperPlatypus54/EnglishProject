export interface SalesMonth {
  month: string;
  shortLabel: string;
  sales: number;
  monthToDate?: true;
}

export interface TeamSalesRecord {
  rank: number;
  name: string;
  sales: number;
}

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
  manager: "Andrew Tate",
  status: "Active",
  target: 50_000,
  actual: salesMonths[salesMonths.length - 1].sales,
  closed: 3,
  assigned: 28,
  rank: 14,
  quarterRating: "Below Expectations",
};

export const branchTeam: readonly TeamSalesRecord[] = [
  { rank: 3, name: "Marcus Hill", sales: 32_600 },
  { rank: employeeSales.rank, name: employeeSales.name, sales: employeeSales.actual },
];

const otherTeamSales = { headcount: 12, sales: 308_050 };
const branchHeadcount = branchTeam.length + otherTeamSales.headcount;

export const branchReport = {
  date: "November 18, 2026",
  headcount: branchHeadcount,
  target: employeeSales.target * branchHeadcount,
  actual: branchTeam.reduce((total, employee) => total + employee.sales, otherTeamSales.sales),
  previousTarget: employeeSales.target * branchHeadcount,
  previousActual: 518_400,
  memo: {
    from: "Regional Sales Operations",
    to: "Andrew Tate",
    date: "November 16, 2026",
    subject: "November recovery plan",
    body: "Grand Meridian closed October below quota and is again behind its November target pace. Send me a recovery plan by Friday with an owner and next step for each stalled account. We'll go through it together before Monday's regional call.",
  },
};
