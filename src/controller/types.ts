export type Transaction = {
  id: string;
  created_at: string;
  updated_at: string;
  description: string;
  type: string;
  type_method: string;
  state: string;
  user_id: string;
  user_name: string;
  amount: string;
  currency: string;
  debit_credit: string;
};

export type PaymentPayload = {
  transactions: Transaction[];
};
