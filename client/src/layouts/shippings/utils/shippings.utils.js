import { DateTime } from "luxon"

export const getShippingsByYear = (shippings, year = DateTime.now().year) => {
  const yearDT = DateTime.fromObject({ year });

  const filtered = shippings.filter(shipping => DateTime.fromFormat(shipping.date, "dd/MM/yyyy").diff(yearDT).as("years") < 1);

  return filtered;
}