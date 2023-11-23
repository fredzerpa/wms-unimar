import { DateTime, Info } from "luxon";
import lodash from "lodash";
import { formatPercentage } from "utils/functions.utils";

export const todayDT = DateTime.now().setLocale("es-ES");

export const LAST_SIX_MONTHS_LABELS = Info.months("short", { locale: "es-ES" }).filter((month, idx) => idx >= todayDT.month - 6 && idx < todayDT.month).map(lodash.capitalize);

export const sumTotalBills = array => Number(array.reduce((total, bill) => total + bill.total.usd, 0).toFixed(2));

export const getShippingsByWeekNumber = (shippings, weekNumber) => {
  if (lodash.isEmpty(shippings) || !weekNumber) return []

  const weekDT = todayDT.set({ weekNumber }).startOf("week");
  const nextWeekDT = todayDT.set({ weekNumber }).plus({ weeks: 1 }).startOf("week");

  const filteredShippings = shippings.filter(shipping => {
    const shippingDT = DateTime.fromFormat(shipping.date, "dd/MM/yyyy");
    const isFromTheWeekNumber = shippingDT.diff(weekDT).as("milliseconds") > 0 && shippingDT.diff(nextWeekDT).as("milliseconds") < 0;
    return isFromTheWeekNumber;
  })

  return filteredShippings;
}

export const getTotalCostByMonth = (bills, monthNumber) => {
  if (lodash.isEmpty(bills)) return []

  const filteredBillsByMonth = bills.filter(bill => {
    const billDT = DateTime.fromFormat(bill.date, "dd/MM/yyyy");
    const monthBills = billDT.month === monthNumber;
    return billDT.year === todayDT.year && monthBills;
  });

  return sumTotalBills(filteredBillsByMonth);
}

// El @target es el nuevo valor que buscamos calcular su diferencia con
// el @source el cual es el valor anterior y sera la base para calcular la diferencia 
export const getDiff = (target, source) => {
  // Si el source es 0 el valor da Infinity
  const diff = source > 0 ? (target / source) - 1 : 0; // El 1 representa el 100% base, por lo que al quitarselo obtenemos cuando fue el cambio

  return {
    value: diff,
    label: diff !== 0 ? formatPercentage(diff) : null, // Puede obtenerse valores antiguos no agregados a la BDD
    color: diff > 0 ? "success" : "error",
  }
}

export const getShippingsByMonth = (shippings, monthNumber) => {
  if (lodash.isEmpty(shippings)) return []

  const filteredShippingsByMonth = shippings.filter(shipping => {
    const shippingDT = DateTime.fromFormat(shipping.date, "dd/MM/yyyy");
    const shippingMonthValid = shippingDT.month === monthNumber;
    return shippingDT.year === todayDT.year && shippingMonthValid;
  });

  return filteredShippingsByMonth;
}

export const getLastSixMonthsShippings = shippings => {
  if (lodash.isEmpty(shippings)) return [];
  const INITIAL_VALUE = LAST_SIX_MONTHS_LABELS.map(label => ({ label, shippings: [] }))
  const lastSixMonthsShippings = shippings.reduce((months, shipping) => {
    // Calculamos cuantos meses han pasado y para evitar cualquier mal calculo ponemos el mismo dia a ambos DateTimes
    const shippingDT = DateTime.fromFormat(shipping.date, "dd/MM/yyyy").setLocale("es-ES").startOf("month");
    const monthsPassedSinceShippingStarted = todayDT.startOf("month").diff(shippingDT.startOf("month")).as("months");
    const isSixMonthsAgoFromNow = monthsPassedSinceShippingStarted >= 0 && monthsPassedSinceShippingStarted < 6;

    if (!isSixMonthsAgoFromNow) return months; // Solo interesa los ultimos 6 meses de shippings - Valores entre 0-5

    const index = months.findIndex(month => month.label.toLowerCase() === shippingDT.monthShort.toLowerCase())
    months[index].shippings.push(shipping);

    return months;
  }, INITIAL_VALUE)

  return lastSixMonthsShippings;
}

export const getInventoryGroupedByClass = inventory => {
  return inventory.reduce((groups, { product }) => {
    groups[product.typeClass].push(product);
    return groups;
  }, {
    A: [],
    B: [],
    C: [],
  })
}

export const getLastSixMonthsBills = bills => {
  if (lodash.isEmpty(bills)) return [];
  const INITIAL_VALUE = LAST_SIX_MONTHS_LABELS.map(label => ({ label, bills: [] }))
  const lastSixMonthsBills = bills.reduce((months, bill) => {
    // Calculamos cuantos meses han pasado y para evitar cualquier mal calculo ponemos el mismo dia a ambos DateTimes
    const billDT = DateTime.fromFormat(bill.date, "dd/MM/yyyy").setLocale("es-ES").startOf("month");
    const monthsPassedSinceBillStarted = todayDT.startOf("month").diff(billDT.startOf("month")).as("months");
    const isSixMonthsAgoFromNow = monthsPassedSinceBillStarted >= 0 && monthsPassedSinceBillStarted < 6;

    if (!isSixMonthsAgoFromNow) return months; // Solo interesa los ultimos 6 meses de billos - Valores entre 0-5

    const index = months.findIndex(month => month.label.toLowerCase() === billDT.monthShort.toLowerCase())
    months[index].bills.push(bill);

    return months;
  }, INITIAL_VALUE)

  return lastSixMonthsBills;
}

export const getInventoryStock = inventoryRecords => {
  if (lodash.isEmpty(inventoryRecords)) return [];

  const stocks = inventoryRecords.reduce((stocks, record) => {
    if (!record.onStock) return stocks; // If it has 0 on stock

    const key = record.product.name;
    if (stocks.has(key)) stocks.set(key, [...stocks.get(key), record])
    else stocks.set(key, record);

    return stocks;

  }, new Map())

  return stocks
}

export const sortOrdersOverview = orders => {
  return orders.sort((a, b) => {
    const diff = DateTime.fromFormat(b.date, "dd/MM/yyyy").diff(DateTime.fromFormat(a.date, "dd/MM/yyyy")).as("milliseconds");
    if (diff < 0) return -1
    else if (diff > 0) return 1
    else return 0
  });
}