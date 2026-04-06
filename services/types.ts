export type CountryCode = "US" | "ES";

export type QuotationItem = {
  id: string;
  product_name: string;
  product_url: string | null;
  quantity: number;
  note: string | null;
  unit_price_vnd: number | null;
  line_total_vnd: number | null;
};

export type Quotation = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  country: CountryCode;
  status: string;
  total_vnd: number | null;
  notes: string | null;
  created_at: string;
  items: QuotationItem[];
  payment_transaction_id?: string | null;
  payment_status?: string | null;
};

export type StripeCreateIntentResponse = {
  transaction_id: string;
  payment_intent_id: string;
  client_secret: string;
  publishable_key: string | null;
};

export type BankTransferRead = {
  quotation_id: string;
  applicable: boolean;
  configured: boolean;
  beneficiary_name: string | null;
  account_no: string | null;
  bank_display_name: string | null;
  amount_vnd: number | null;
  transfer_content: string | null;
  emv_qr_payload: string | null;
};
