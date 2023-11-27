import { todayDT } from "layouts/dashboard/utils/dashboard.utils";
import lodash from "lodash"
import { DateTime, Info } from "luxon";

export const sumTotalBills = array => Number(array.reduce((total, bill) => total + bill.total.usd, 0).toFixed(2));

export const WEEK_LABELS_SHORT = Info.weekdays('short', { locale: "es-ES" });

export const formatInventoryRawData = rawData => {
  const PRODUCTS_PARAMS_LABELS_SCHEMA = {
    size: {
      "quarterGallon": <><sup>1</sup>&frasl;<sub>4</sub> &nbsp;Galon</>, // Stands for 1/4 Galon
      "oneGallon": "1 Galon",
      "fourGallons": "4 Galones",
      "fiveGallons": "5 Galones",
      "kit": "Kit",
    },
    type: {
      "enamel": "Esmalte",
      "architectural": "Arquitectonico",
      "industrialAndMarine": "Industriales & Marinas",
    }
  }



  const formattedData = rawData.reduce((formatted, data) => {
    const { onStock, ...rest } = data;
    const type = PRODUCTS_PARAMS_LABELS_SCHEMA.type[data.type];

    const itemizedStock = onStock.map(stockDetail => ({
      ...rest,
      type,
      ...stockDetail,
      size: PRODUCTS_PARAMS_LABELS_SCHEMA.size[stockDetail.size],
    }));

    formatted.push(...itemizedStock);

    return formatted;
  }, [])

  return formattedData
}

const formatRIFNumber = number => {
  const splittedNumber = `${number}`.split("");
  const lastNumber = splittedNumber.pop();

  return `J-${splittedNumber.join("")}-${lastNumber}`;
}

export const formatBillRawData = rawData => {
  const formattedData = rawData.map(bill => {
    const { provider, products, ...rest } = bill;

    const providerDocId = provider.documentId.type === "RIF" ?
      formatRIFNumber(provider.documentId.number) : provider.documentId.number

    const subtotal = products.reduce((subtotal, product) => {
      return {
        usd: Number((subtotal.usd + product.subtotal.usd).toFixed(2)),
        bs: Number((subtotal.bs + product.subtotal.bs).toFixed(2)),
      }
    }, { usd: 0, bs: 0 })

    return {
      provider: {
        ...provider,
        documentId: providerDocId
      },
      ...rest,
      subtotal,
    }
  })

  return formattedData
}


export const formatSelectionProducts = products => {
  if (lodash.isEmpty(products)) return products;

  const PRODUCTS_PARAMS_LABELS_SCHEMA = {
    size: {
      "quarterGallon": "1/4 Galon", // Stands for 1/4 Galon
      "oneGallon": "1 Galon",
      "fourGallons": "4 Galones",
      "fiveGallons": "5 Galones",
      "kit": "Kit",
    },
    type: {
      "enamel": "Esmalte",
      "architectural": "Arquitectonico",
      "industrialAndMarine": "Industriales & Marinas",
    }
  }

  const formatData = ({ onStock, ...data }) => {
    const typeLabel = PRODUCTS_PARAMS_LABELS_SCHEMA?.type[data.type] ?? "";
    const sizeLabel = PRODUCTS_PARAMS_LABELS_SCHEMA?.size[data.size] ?? "";

    return {
      ...data,
      type: {
        value: data?.type ?? "",
        label: typeLabel,
      },
      size: {
        value: data?.size ?? "",
        label: sizeLabel,
      },
    };
  }

  const formattedData = Array.isArray(products) ? products.map(formatData) : formatData(products);

  return formattedData
}

export const getBillsByWeekNumber = (bills, weekNumber) => {
  if (lodash.isEmpty(bills) || !weekNumber) return []

  const weekDT = todayDT.set({ weekNumber }).startOf("week");
  const nextWeekDT = todayDT.set({ weekNumber }).plus({ weeks: 1 }).startOf("week");

  const filteredBills = bills.filter(bill => {
    const billDT = DateTime.fromFormat(bill.date, "dd/MM/yyyy");
    const isFromTheWeekNumber = billDT.diff(weekDT).as("milliseconds") > 0 && billDT.diff(nextWeekDT).as("milliseconds") < 0;
    return isFromTheWeekNumber;
  })

  return filteredBills;
}

export const getBillsGroupedByWeekdays = bills => {
  if (lodash.isEmpty(bills)) return []

  const INITIAL_VALUE = WEEK_LABELS_SHORT.map(label => ({ label, bills: [] }))
  const weekdaysBills = getBillsByWeekNumber(bills, todayDT.weekNumber).reduce((weekdays, bill) => {
    const billDT = DateTime.fromFormat(bill.date, "dd/MM/yyyy").setLocale("es-ES");

    const index = weekdays.findIndex(weekday => weekday.label.toLowerCase() === billDT.weekdayShort.toLowerCase())
    weekdays[index].bills.push(bill);

    return weekdays;
  }, INITIAL_VALUE)

  return weekdaysBills;
}