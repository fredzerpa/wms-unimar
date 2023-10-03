import lodash from 'lodash';

const FORMAT_CURRENCY_OPTIONS = {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}
export const formatCurrency = (value, options = FORMAT_CURRENCY_OPTIONS) => {
  const customOptions = lodash.merge(FORMAT_CURRENCY_OPTIONS, options)
  const formatter = new Intl.NumberFormat(
    'es-VE',
    {
      ...customOptions,
      currencyDisplay: 'narrowSymbol',
    }
  );

  return formatter.format(value);
}