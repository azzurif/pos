export const RupiahFormat = (nominal: number): string => {
  return "Rp" + new Intl.NumberFormat("id-ID").format(nominal);
};
