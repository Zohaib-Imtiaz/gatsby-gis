export function currency(value: number, country: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: country,
  }).format(value);
}
