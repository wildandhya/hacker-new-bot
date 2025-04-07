export interface Expense {
  id: string;
  userId: string;
  username: string;
  category: string;
  amount: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}
