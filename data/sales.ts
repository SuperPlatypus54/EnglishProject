export interface SalesMonth {
  month: string;
  shortLabel: string;
  sales: number;
  monthToDate?: true;
}

export interface TeamSalesRecord {
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
  quarterRating: "Below Expectations",
};

export const branchTeam: TeamSalesRecord[] = [
  { name: "Lena Park", sales: 37_200 },
  { name: "Priya Shah", sales: 35_450 },
  { name: "Marcus Hill", sales: 32_600 },
  { name: "Maya Chen", sales: 31_400 },
  { name: "Sofia Reyes", sales: 30_650 },
  { name: "Ben Wallace", sales: 28_300 },
  { name: "Jordan Ellis", sales: 26_700 },
  { name: "Nina Rao", sales: 24_900 },
  { name: "Alex Castillo", sales: 23_400 },
  { name: "Zoe Brennan", sales: 20_850 },
  { name: "Quinn Cole", sales: 18_100 },
  { name: "Avery Brooks", sales: 16_350 },
  { name: "Sam Reed", sales: 14_750 },
  { name: employeeSales.name, sales: employeeSales.actual },
];

export const branchReport = {
  date: "November 18, 2026",
  target: employeeSales.target * branchTeam.length,
  actual: branchTeam.reduce((total, employee) => total + employee.sales, 0),
  previousTarget: employeeSales.target * branchTeam.length,
  previousActual: 518_400,
  memo: {
    from: "Regional Sales Operations",
    to: "Andrew Tate",
    date: "November 16, 2026",
    subject: "November recovery plan",
    body: "Grand Meridian closed October below quota and is again behind its November target pace. Send me a recovery plan by Friday with an owner and next step for each stalled account. We'll go through it together before Monday's regional call.",
  },
};
