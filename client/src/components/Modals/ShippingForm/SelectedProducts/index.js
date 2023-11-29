import { useEffect, useMemo, useState } from "react";
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
import { getProductsWithStockBySizes } from "../utils/functions.utils";

const Product = ({ productData, onDataChange, onProductRemove, readOnly, errors }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const productStocksBySizes = useMemo(() => getProductsWithStockBySizes(productData), [productData]);
  const [orderDetail, setOrderDetail] = useState({ quantity: 0, size: null, ...productStocksBySizes });

  useEffect(() => {
    const { stocked: stockedOrderDetail, ...restOrderDetail } = orderDetail;

    return onDataChange({
      ...restOrderDetail,
      type: restOrderDetail?.type?.value,
    })
  }, [onDataChange, orderDetail, productData, productStocksBySizes])

  return (
    <MDBox
      width="100%"
      bgColor={darkMode ? "dark" : "grey-100"}
      borderRadius="lg"
      px={2}
      py={1}
      mb={2}
      sx={{ position: "relative" }}
    >
      {
        !readOnly && (
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
        )
      }
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <MDTypography variant="button" fontWeight="bold">
          [{productData?.code}] {productData?.name} - {productData?.type?.label} "{productData.typeClass}"
        </MDTypography>
      </MDBox>
      <Grid container spacing={2}>
        <Grid xs={6}>
          <FormControl fullWidth sx={{ height: "100%" }} required>
            <InputLabel id={`product-${productData?.code}-size-label`}>Medida</InputLabel>
            <Select
              fullWidth
              labelId={`product-${productData?.code}-size-label`}
              label="Medida"
              value={orderDetail?.size ?? ""}
              onChange={e => {
                const selectedSize = e.target.value;
                return setOrderDetail({ ...orderDetail, size: selectedSize, quantity: 0 })
              }}
              onInvalid={e => e.target.setCustomValidity("Escoja una medida")}
              onSelect={e => e.target.setCustomValidity("")}
              readOnly={readOnly}
            >
              <MenuItem value="quarterGallon" disabled={!orderDetail?.stocked?.["quarterGallon"] > 0} sx={{ my: 0.5 }}>
                1&frasl;4 Galon {!orderDetail?.stocked?.["quarterGallon"] > 0 && "(Fuera de Stock)"}
              </MenuItem>
              <MenuItem value="oneGallon" disabled={!orderDetail?.stocked?.["oneGallon"] > 0} sx={{ my: 0.5 }}>
                1 Galon {!orderDetail?.stocked?.["oneGallon"] > 0 && "(Fuera de Stock)"}
              </MenuItem>
              <MenuItem value="fourGallons" disabled={!orderDetail?.stocked?.["fourGallons"] > 0} sx={{ my: 0.5 }}>
                4 Galones {!orderDetail?.stocked?.["fourGallons"] > 0 && "(Fuera de Stock)"}
              </MenuItem>
              <MenuItem value="fiveGallons" disabled={!orderDetail?.stocked?.["fiveGallons"] > 0} sx={{ my: 0.5 }}>
                5 Galones {!orderDetail?.stocked?.["fiveGallons"] > 0 && "(Fuera de Stock)"}
              </MenuItem>
              <MenuItem value="kit" disabled={!orderDetail?.stocked?.["kit"] > 0} sx={{ my: 0.5 }}>
                Kit (bicomponente) {!orderDetail?.stocked?.["kit"] > 0 && "(Fuera de Stock)"}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid xs={6}>
          <MDInput
            label="Cantidad"
            placeholder="Cantidad de producto"
            fullWidth
            required
            disabled={!orderDetail?.size}
            helperText={!readOnly && orderDetail?.size &&
              `Maximo ${orderDetail?.stocked?.[orderDetail?.size]}`
            }
            onChange={e => {
              const value = Number(e.target.value);
              const onStock = orderDetail?.stocked?.[orderDetail?.size];

              const newValue = value > onStock ? onStock : value;

              if (newValue >= 0) return setOrderDetail({
                ...orderDetail,
                quantity: newValue,
              })
            }}
            value={orderDetail?.quantity}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              onInvalid: e => e.target.setCustomValidity("Use numeros unicamente para expresar este valor"),
              onInput: e => e.target.setCustomValidity(""),
              readOnly,
            }}
          />
        </Grid>


      </Grid>
    </MDBox >
  )
}



const SelectedProducts = ({ products, onProductsDataChange, ...rest }) => {

  return (
    <SimpleBar style={{ minHeight: 100, maxHeight: 400 }}>
      <MDBox p={1.5}>
        {products.map((product) =>
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