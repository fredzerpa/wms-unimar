import { useState } from "react";
import { Inventory2 } from "@mui/icons-material";

import { useMaterialUIController } from "context";

import MDButton from "components/MDButton";
import ProductsList from "../ProductsList";


const ProductsListButton = () => {
  const [openList, setOpenList] = useState();

  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const handleClick = e => setOpenList(true);
  const handleClose = e => setOpenList(false);

  return (
    <>
      <MDButton
        color={darkMode ? "dark" : "white"}
        sx={{ display: "flex", alignItems: "flex-end" }}
        onClick={handleClick}
      >
        <Inventory2 style={{ marginRight: "0.5rem", alignSelf: "center" }} />
        Lista de Productos
      </MDButton>
      {
        !!openList && (<ProductsList open={openList} close={handleClose} />)
      }
    </>
  )
}

export default ProductsListButton;