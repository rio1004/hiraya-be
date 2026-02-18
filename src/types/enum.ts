export type AvailabilityStatus = "IN_STOCK" | "OUT_OF_STOCK" | "PREORDER";
export const AvailabilityStatusValues = {
  IN_STOCK: "IN_STOCK" as AvailabilityStatus,
  OUT_OF_STOCK: "OUT_OF_STOCK" as AvailabilityStatus,
  PREORDER: "PREORDER" as AvailabilityStatus,
};

export type WalletType = "BIFOLD" | "TRIFOLD" | "LONG" | "CARDHOLDER";
export type Role = "ADMIN" | "CUSTOMER";
export const WalletTypeValues = {
  BIFOLD: "BIFOLD" as WalletType,
  TRIFOLD: "TRIFOLD" as WalletType,
  LONG: "LONG" as WalletType,
  CARDHOLDER: "CARDHOLDER" as WalletType,
};
