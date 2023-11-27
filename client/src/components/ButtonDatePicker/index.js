import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import MDButton from 'components/MDButton';

const ButtonField = (props) => {

  const {
    setOpen,
    label,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { 'aria-label': ariaLabel } = {},
  } = props;

  return (
    <MDButton
      size="small"
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      onClick={() => setOpen?.((prev) => !prev)}
    >
      {label}
    </MDButton>
  );
}

const ButtonDatePicker = (props) => {
  const [open, setOpen] = React.useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="es-es">
      <DatePicker
        slots={{ field: ButtonField, ...props.slots }}
        slotProps={{ field: { setOpen } }}
        {...props}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      />
    </LocalizationProvider>

  );
}

export default ButtonDatePicker;