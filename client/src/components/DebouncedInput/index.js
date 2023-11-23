import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import MDInput from "components/MDInput";


const DebounceInput = (props) => {
  const { handleDebounce, debounceTimeout, ...rest } = props;

  const timerRef = useRef();

  const handleChange = (event) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      handleDebounce(event.target.value);
    }, debounceTimeout);
  };

  return <MDInput {...rest} onChange={handleChange} />;
}

DebounceInput.propTypes = {
  debounceTimeout: PropTypes.number.isRequired,
  handleDebounce: PropTypes.func.isRequired,
};

const DebouncedInput = ({ label, onChange, timeout, ...rest }) => {
  const [debouncedValue, setDebouncedValue] = useState("");
  const handleDebounce = (value) => {
    setDebouncedValue(value);
  };

  useEffect(() => onChange(debouncedValue), [debouncedValue, onChange])

  return (
    <DebounceInput
      placeholder={label ?? "Search here.."}
      debounceTimeout={timeout ?? 800}
      handleDebounce={handleDebounce}
      {...rest}
    />
  );
}

export default DebouncedInput;