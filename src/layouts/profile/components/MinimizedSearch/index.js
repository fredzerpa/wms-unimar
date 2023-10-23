import { useState } from "react";
import { Search } from "@mui/icons-material";
import { InputAdornment, Menu } from "@mui/material";

import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

const MinimizedSearch = ({ button, menu, onChange, ...rest }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const openMenu = event => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null)

  const handleSearch = e => onChange(e.target.value)

  return (
    <>
      <MDButton
        aria-controls={open ? "search-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="text"
        color="info"
        iconOnly
        disableRipple
        onClick={openMenu}
        {...button}
      >
        <Search />
      </MDButton>
      <Menu
        anchorEl={anchorEl}
        id="search-menu"
        open={open}
        onClose={closeMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        {...menu}
      >
        <MDInput
          placeholder="Buscar usuario"
          type="search"
          focused
          autoFocus
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
          onChange={handleSearch}
          {...rest}
        />
      </Menu>
    </>
  )
}

export default MinimizedSearch;