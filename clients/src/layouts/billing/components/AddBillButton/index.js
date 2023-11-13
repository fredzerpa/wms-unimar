import { useState } from "react";
// Libraries
import { Tooltip } from "@mui/material";
import { PostAdd } from "@mui/icons-material";
import PropTypes from "prop-types";

// Components
import MDButton from "components/MDButton";
import BillModalForm from "components/Modals/BillForm";
import { useMaterialUIController } from "context";


const AddBillButton = ({ tooltipLabel, tooltipPlacement, ...rest }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [openBillModalForm, setOpenBillModalForm] = useState(false);

  const handleAddBillClick = e => setOpenBillModalForm(true);
  const closeBillModalForm = e => setOpenBillModalForm(false);

  return (
    <>
      <MDButton iconOnly variant="text" color={darkMode ? "white" : "dark"} circular onClick={handleAddBillClick} {...rest}>
        <Tooltip title={tooltipLabel} placement={tooltipPlacement}>
          <PostAdd sx={{ width: "1.5rem", height: "1.5rem" }} />
        </Tooltip>
      </MDButton>
      {
        openBillModalForm && <BillModalForm open={openBillModalForm} close={closeBillModalForm} onSubmit={console.log} />
      }
    </>
  )
}

AddBillButton.defaultProps = {
  tooltipLabel: "Agregar factura",
  tooltipPlacement: "top",
}

AddBillButton.propTypes = {
  tooltipLabel: PropTypes.string,
  tooltipPlacement: PropTypes.string,
}

export default AddBillButton;