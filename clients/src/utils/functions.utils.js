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


const FORMAT_NUMBER_OPTIONS = {
	style: 'decimal',
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
}
export const formatNumber = (value, options = FORMAT_NUMBER_OPTIONS) => {
	const customOptions = lodash.merge(FORMAT_NUMBER_OPTIONS, options)
	const formatter = new Intl.NumberFormat(
		'es-VE',
		{
			...customOptions,
		}
	);

	return formatter.format(value);
}

const FORMAT_PERCENTAGE_OPTIONS = {
	style: 'percent',
	signDisplay: 'exceptZero',
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
}

export const formatPercentage = (value, options = FORMAT_PERCENTAGE_OPTIONS) => {
	const customOptions = lodash.merge(FORMAT_PERCENTAGE_OPTIONS, options)
	const formatter = new Intl.NumberFormat(
		'es-VE',
		customOptions
	);

	return formatter.format(value);
}