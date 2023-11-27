// Libraries
import { useCallback, useEffect, useState } from "react";
import { Card, Divider, InputAdornment, Modal, useMediaQuery, useTheme } from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import SimpleBar from "simplebar-react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

// Context
import { useProducts } from "context/products.context";
import { useMaterialUIController } from "context";

// assets
import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";

// Components
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import DebouncedInput from "components/DebouncedInput";
import MDButton from "components/MDButton";
import ProductModalForm from "components/Modals/ProductForm";


const AddProductButton = ({ createProduct }) => {
  const [open, setOpen] = useState(false);

  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const handleClick = e => setOpen(true);
  const close = e => setOpen(false);

  const onModalSubmit = async productData => {
    return await createProduct(productData);
  }

  return (
    <>
      <MDButton
        color={darkMode ? "dark" : "info"}
        onClick={handleClick}
        size="small"
      >
        Agregar Producto
      </MDButton>
      {
        open && (
          <ProductModalForm
            open={open}
            close={close}
            onSubmit={onModalSubmit}
          />
        )
      }
    </>
  )
}

const Product = ({ productData, ...props }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;


  return (
    <Grid
      container
      width="100%"
      borderRadius={borders.borderRadius["lg"]}
      p={2}
      mb={2}
      sx={{
        backgroundColor: darkMode ? colors.dark.main : colors.grey[100],
        "&:hover": {
          cursor: "pointer",
          backgroundColor: darkMode ? colors.dark.focus : colors.light.focus,
        }
      }}
      {...props}
    >
      <Grid xs={6} sm={4}>
        <MDTypography variant="button" align="center" fontWeight="bold" component="p">
          {productData.name}
        </MDTypography>
      </Grid>
      <Grid xs={6} sm={4} display="flex" justifyContent="center">
        <MDTypography variant="button" align="center" fontWeight="bold" component="p">
          {productData.code}
        </MDTypography>
      </Grid>
      <Grid xs={6} sm={4} display="flex" justifyContent="center">
        <MDTypography variant="button" align="center" fontWeight="bold" component="p">
          {productData.slot}
        </MDTypography>
      </Grid>
    </Grid >
  )
}

const ProductsList = ({ open, close }) => {
  const { products, createProduct, updateProductById, deleteProductById } = useProducts();
  const [list, setList] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  const theme = useTheme();

  useEffect(() => {
    setList(products);
  }, [products])

  const handleSearch = useCallback(search => {
    const filteredData = products.filter(product => {
      const { name, code } = product

      const detailedData = [name, code];

      const regex = new RegExp(search, "gi");
      return detailedData.filter(data => regex.test(data)).length
    })

    setList(filteredData);
  }, [products])

  const handleProductClick = product => e => setEditProduct(product);
  const closeProductForm = e => setEditProduct(null);

  const onModalSubmit = async updatedProduct => {
    const { _id, ...updatedData } = updatedProduct;
    return await updateProductById(_id, updatedData);
  }

  const onProductDelete = async product => {
    return await deleteProductById(product._id)
  }

  return (
    <>
      <Modal
        open={open}
        onClose={close}
      >
        <Card
          sx={theme => ({
            px: 2,
            py: 1,
            width: "500px",
            maxWidth: "100%",
            position: "absolute",
            overflow: "hidden",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            [theme.breakpoints.down("md")]: {
              height: "100%",
              width: "100%",
              borderRadius: 0,
            },
          })}
        >
          <MDBox mt={2} mb={1} display="flex" justifyContent="space-between">
            <MDTypography variant="h4" fontWeight="medium" gutterBottom ml={1}>
              Lista de Productos
            </MDTypography>
            <MDButton iconOnly variant="text" sx={{ top: "-10px" }} onClick={close}>
              <Close color="dark" />
            </MDButton>
          </MDBox>
          <MDBox display="flex" justifyContent="flex-end">
            <AddProductButton createProduct={createProduct} />
          </MDBox>
          <Divider />
          <SimpleBar
            style={{
              maxHeight: useMediaQuery(theme.breakpoints.only("xs")) ? "80vh" : "60vh",
            }}
          >
            <MDBox mb={2}>
              <DebouncedInput
                label="Busca aqui.."
                fullWidth
                timeout={500}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                onChange={handleSearch}
              />
            </MDBox>
            {
              list.length ?
                (
                  <Grid container width="100%" mb={0.5} px={2}>
                    <Grid xs={6} sm={4}>
                      <MDTypography align="center" variant="caption" component="p">Nombre</MDTypography>
                    </Grid>
                    <Grid xs={6} sm={4} display="flex" justifyContent="center">
                      <MDTypography align="center" variant="caption" component="p">Codigo</MDTypography>
                    </Grid>
                    <Grid xs={6} sm={4} display="flex" justifyContent="center">
                      <MDTypography align="center" variant="caption" component="p">Lote</MDTypography>
                    </Grid>
                  </Grid>
                )
                :
                (
                  <MDBox mt={2} mb={1}>
                    <MDTypography variant="subtitle1" align="center">
                      No se encontraron resultados
                    </MDTypography>
                  </MDBox>
                )
            }
            {
              list.map(product => (
                <Product key={product.code} productData={product} onClick={handleProductClick(product)} />
              ))
            }
          </SimpleBar>
        </Card>
      </Modal>
      {
        !!editProduct && (
          <ProductModalForm
            productData={editProduct}
            open={!!editProduct}
            close={closeProductForm}
            onSubmit={onModalSubmit}
            onDelete={onProductDelete}
          />
        )
      }
    </>
  )
}

export default ProductsList;