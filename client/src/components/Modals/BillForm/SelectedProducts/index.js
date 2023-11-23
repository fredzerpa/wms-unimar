import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import SimpleBar from "simplebar-react";
import PropTypes from "prop-types";
import lodash from "lodash";

import { useMaterialUIController } from "context";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";

const INITIAL_ORDER_DETAILS = {
  quantity: 0,
  size: null,
  unitCost: {
    usd: 0,
    bs: 0,
  },
  discount: {
    usd: 0,
    bs: 0,
  }
}

const Product = ({ productData, onDataChange, onProductRemove, errors }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const { sizes, ...rest } = productData;
  const [orderDetail, setOrderDetail] = useState(lodash.defaultsDeep(rest, INITIAL_ORDER_DETAILS));

  useEffect(() => {
    const { size, type } = orderDetail;
    const subtotalUsd = (orderDetail.unitCost.usd * orderDetail.quantity) - (orderDetail.unitCost.usd * orderDetail.quantity * orderDetail.discount.usd * 0.01)

    return onDataChange({
      ...orderDetail,
      size: size?.value,
      type: type?.value,
      subtotal: {
        usd: subtotalUsd,
        bs: 0,
      },
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
          {productData?.name} - {productData?.type?.label} {productData?.typeClass ? `"${productData.typeClass}"` : null}
        </MDTypography>
      </MDBox>
      <Grid container spacing={2}>
        <Grid xs={6}>
          <MDInput
            label="Cantidad"
            placeholder="Cantidad de producto"
            fullWidth
            required
            value={orderDetail?.quantity ?? 0}
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
              value={orderDetail?.size?.value ?? ""}
              onChange={e => {
                const selectedSize = e.target.value;
                return setOrderDetail({ ...orderDetail, size: { ...orderDetail.size, value: selectedSize } })
              }}
              componentsProps={{
                root: { style: { height: "100%" } }
              }}
              SelectDisplayProps={{ style: { height: "100%" } }}
              onInvalid={e => e.target.setCustomValidity("Escoja una medida")}
              onSelect={e => e.target.setCustomValidity("")}
            >
              <MenuItem value="quarterGallon" sx={{ my: 0.5 }}>
                1&frasl;4 Galon
              </MenuItem>
              <MenuItem value="oneGallon" sx={{ my: 0.5 }}>
                1 Galon
              </MenuItem>
              <MenuItem value="fourGallons" sx={{ my: 0.5 }}>
                4 Galones
              </MenuItem>
              <MenuItem value="fiveGallons" sx={{ my: 0.5 }}>
                5 Galones
              </MenuItem>
              <MenuItem value="kit" sx={{ my: 0.5 }}>
                Kit (bicomponente)
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={6}>
          <MDInput
            label="Descuento"
            fullWidth
            value={orderDetail?.discount?.usd ?? 0}
            required
            onChange={e => Number(e.target.value) && setOrderDetail({ ...orderDetail, discount: { usd: Number(e.target.value) } })}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              onInvalid: e => e.target.setCustomValidity("Use numeros unicamente para expresar este valor"),
              onInput: e => e.target.setCustomValidity(""),
            }}
            InputProps={{
              startAdornment: "%",
            }}
          />
        </Grid>

        <Grid xs={6}>
          <MDInput
            label="Precio Unitario"
            fullWidth
            value={orderDetail?.unitCost?.usd ?? 0}
            required
            onChange={e => Number(e.target.value) && setOrderDetail({ ...orderDetail, unitCost: { usd: Number(e.target.value) } })}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              onInvalid: e => e.target.setCustomValidity("Use numeros unicamente para expresar este valor"),
              onInput: e => e.target.setCustomValidity(""),
            }}
            InputProps={{
              startAdornment: "$",
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