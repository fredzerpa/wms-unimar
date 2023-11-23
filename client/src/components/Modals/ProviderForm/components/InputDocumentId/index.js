// Libraries
import { forwardRef } from "react";
import { MenuItem, Paper, Select } from "@mui/material";

// Components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

const SelectID = (props) => (<Select
  sx={{
    borderStartEndRadius: 0,
    borderEndEndRadius: 0,
  }}
  SelectDisplayProps={{
    style: { paddingRight: "0.75rem" }
  }}
  renderValue={(value) => `${value === "RIF" ? "J" : "C.I."} -`}
  {...props}
>
  <MenuItem value="RIF" sx={{ my: 0.5 }}>J</MenuItem>
  <MenuItem value="cedula" sx={{ my: 0.5 }}>C.I.</MenuItem>
</Select>)

const InputDocumentId = forwardRef(({ selectValue, onSelectChange, selectProps, ...rest }, ref) => {
  return (
    <MDBox>
      <Paper
        sx={{
          color: "inherit",
          backgroundColor: "inherit",
          display: "flex",
          alignItems: "center",
          width: "100%",
          boxShadow: "none",
        }}
      >
        <SelectID value={selectValue} onChange={e => onSelectChange(e.target.value)} {...selectProps} />
        <MDInput
          {...rest}
          ref={ref}
          fullWidth
          placeholder="Cedula/RIF"
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderLeft: 0,
              borderStartStartRadius: 0,
              borderEndStartRadius: 0,
            },
          }}
        />
      </Paper>
    </MDBox>
  )
})

export default InputDocumentId;