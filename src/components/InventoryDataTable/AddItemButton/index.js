// Libraries
import { Tooltip } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PropTypes from 'prop-types';

// Components
import MDButton from 'components/MDButton';


const AddItemButton = ({ tooltipLabel, tooltipPlacement, onClick, ...rest }) => {
  return (
    <Tooltip title={tooltipLabel} placement={tooltipPlacement}>
      <MDButton size="small" variant="text" color="dark" circular onClick={onClick} {...rest}>
        <NoteAddIcon sx={{ height: "1.5rem", width: "1.5rem" }} />
      </MDButton>
    </Tooltip>
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