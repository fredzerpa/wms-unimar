// Libraries
import { Tooltip } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PropTypes from 'prop-types';

// Components
import MDButton from 'components/MDButton';
import { useMaterialUIController } from 'context';


const AddItemButton = ({ tooltipLabel, tooltipPlacement, onClick, ...rest }) => {
  const [controller] = useMaterialUIController();
  const {darkMode} = controller;
  
  return (
    <MDButton iconOnly variant="text" color={darkMode ? "white" : "dark"} circular onClick={onClick} {...rest}>
      <Tooltip title={tooltipLabel} placement={tooltipPlacement}>
        <NoteAddIcon sx={{ height: "1.5rem", width: "1.5rem" }} />
      </Tooltip>
    </MDButton>
  )
}

AddItemButton.defaultProps = {
  tooltipLabel: 'Agregar articulo',
  tooltipPlacement: 'top',
}

AddItemButton.propTypes = {
  tooltipLabel: PropTypes.string,
  tooltipPlacement: PropTypes.string,
}

export default AddItemButton;