import { useState } from "react";
// Libraries
import { Tooltip } from "@mui/material";
import { PostAdd } from "@mui/icons-material";
import PropTypes from "prop-types";

// Components
import MDButton from "components/MDButton";
import ShippingModalForm from "components/Modals/ShippingForm";

// Context
import { useMaterialUIController } from "context";
import { useShippings } from "context/shippings.context";


const AddShippingButton = ({ tooltipLabel, tooltipPlacement, ...rest }) => {
  const { createShipping } = useShippings();

  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [openItemModalForm, setOpenItemModalForm] = useState(false);

  const handleAddItemClick = e => setOpenItemModalForm(true);
  const closeItemModalForm = e => setOpenItemModalForm(false);

  return (
    <>
      <MDButton iconOnly variant="text" color={darkMode ? "white" : "dark"} circular onClick={handleAddItemClick} {...rest}>
        <Tooltip title={tooltipLabel} placement={tooltipPlacement}>
          <PostAdd sx={{ width: "1.5rem", height: "1.5rem" }} />
        </Tooltip>
      </MDButton>
      {
        openItemModalForm && <ShippingModalForm open={openItemModalForm} close={closeItemModalForm} onSubmit={createShipping} />
      }
    </>
  )
}

AddShippingButton.defaultProps = {
  tooltipLabel: "Agregar envio",
  tooltipPlacement: "top",
}

AddShippingButton.propTypes = {
  tooltipLabel: PropTypes.string,
  tooltipPlacement: PropTypes.string,
}

export default AddShippingButton;