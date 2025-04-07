export type ReportPeriod =
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "personal";

export interface DateRange {
  start: Date;
  end: Date;
}

export interface chart {
  label: string;
  value: number;
}

export interface ChartOptions {
  type: "pie" | "bar" | "line" | "doughnut";
  title: string;
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor: string[];
  }[];
  hideDataLabel?: boolean;
}
