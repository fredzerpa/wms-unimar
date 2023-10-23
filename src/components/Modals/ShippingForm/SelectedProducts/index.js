import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import SimpleBar from "simplebar-react";
import PropTypes from "prop-types";

import { useMaterialUIController } from "context";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";

const Product = ({ productData, onDataChange, onProductRemove, errors }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const { sizes, ...rest } = productData;
  const [orderDetail, setOrderDetail] = useState({ ...rest, quantity: 0, size: undefined });

  useEffect(() => {
    const PRODUCT_TYPES_LABELS_INVERSED = {
      "Esmalte": "enamel",
      "Arquitectonico": "architectural",
      "Industriales & Marinas": "industrialAndMarine",
    }
    return onDataChange({
      ...orderDetail,
      type: PRODUCT_TYPES_LABELS_INVERSED[orderDetail.type]
    })
  }, [onDataChange, orderDetail])

  return (
    <MDBox width="100%" bgColor={darkMode ? "dark" : "grey-100"} borderRadius="lg" px={2} py={1} mb={2} sx={{ position: "relative" }}>
      <MDButton
        iconOnly
        size="small"
        circular
        color="primary"
        sx={{ position: "absolute", top: -12, right: -10 }}
        onClick={e => onProductRemove(productData)}
      >
        <Close />
      </MDButton>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <MDTypography variant="button" fontWeight="bold">
          {productData.name} - {productData.type} {productData?.typeClass ? `"${productData.typeClass}"` : null}
        </MDTypography>
      </MDBox>
      <Grid container spacing={2}>
        <Grid xs={6}>
          <MDInput
            label="Cantidad"
            placeholder="Cantidad de producto"
            fullWidth
            required
            onChange={e => Number(e.target.value) && setOrderDetail({ ...orderDetail, quantity: Number(e.target.value) })}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              onInvalid: e => e.target.setCustomValidity("Use numeros unicamente para expresar este valor"),
              onInput: e => e.target.setCustomValidity(""),
            }}
          />
        </Grid>

        <Grid xs={6}>
          <FormControl fullWidth sx={{ height: "100%" }} required>
            <InputLabel id={`product-${productData._id}-size-label`}>Medida</InputLabel>
            <Select
              fullWidth
              labelId={`product-${productData._id}-size-label`}
              label="Medida"
              value={orderDetail?.size ?? ""}
              onChange={e => {
                const selectedSize = e.target.value;
                return setOrderDetail({ ...orderDetail, size: selectedSize })
              }}
              componentsProps={{
                root: { style: { height: "100%" } }
              }}
              SelectDisplayProps={{ style: { height: "100%" } }}
              onInvalid={e => e.target.setCustomValidity("Escoja una medida")}
              onSelect={e => e.target.setCustomValidity("")}
            >
              <MenuItem value="quarterGallon" disabled={!sizes["quarterGallon"]} sx={{ my: 0.5 }}>
                1&frasl;4 Galon {!sizes["quarterGallon"] && "(Fuera de Stock)"}
              </MenuItem>
              <MenuItem value="oneGallon" disabled={!sizes["oneGallon"]} sx={{ my: 0.5 }}>
                1 Galon {!sizes["oneGallon"] && "(Fuera de Stock)"}
              </MenuItem>
              <MenuItem value="fourGallons" disabled={!sizes["fourGallons"]} sx={{ my: 0.5 }}>
                4 Galones {!sizes["fourGallons"] && "(Fuera de Stock)"}
              </MenuItem>
              <MenuItem value="fiveGallons" disabled={!sizes["fiveGallons"]} sx={{ my: 0.5 }}>
                5 Galones {!sizes["fiveGallons"] && "(Fuera de Stock)"}
              </MenuItem>
              <MenuItem value="kit" disabled={!sizes["kit"]} sx={{ my: 0.5 }}>
                Kit (bicomponente) {!sizes["kit"] && "(Fuera de Stock)"}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </MDBox >
  )
}







const SelectedProducts = ({ products, onProductsDataChange, ...rest }) => {

  return (
    <SimpleBar style={{ minHeight: 100, maxHeight: 400 }}>
      <MDBox p={1.5}>
        {products.map(product =>
          <Product
            key={product._id}
            productData={product}
            onDataChange={onProductsDataChange}
            {...rest}
          />
        )}
      </MDBox>
    </SimpleBar>
  )
}


SelectedProducts.defaultProps = {
  products: []
}

SelectedProducts.propTypes = {
  products: PropTypes.array,
}

export default SelectedProducts;