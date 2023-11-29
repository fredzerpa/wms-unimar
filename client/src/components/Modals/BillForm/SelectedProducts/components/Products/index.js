import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import lodash from "lodash";
import { DateTime } from "luxon";

import { useMaterialUIController } from "context";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import ButtonDatePicker from "components/ButtonDatePicker";



const INITIAL_ORDER_DETAILS = {
  _id: null,
  slot: "",
  type: "",
  typeClass: "",
  expirationDate: DateTime.now(),
  quantity: 0,
  size: null,
  unitCost: {
    usd: 0,
    bs: 0,
  },
  discount: 0,
}

const Product = ({ productData, onDataChange, onProductRemove, errors, readOnly }) => {

  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const { sizes, ...rest } = productData;
  const [orderDetail, setOrderDetail] = useState(lodash.defaultsDeep(rest, INITIAL_ORDER_DETAILS));

  useEffect(() => {
    const { size, type } = orderDetail;
    const subtotalUsd = (orderDetail.unitCost.usd * orderDetail.quantity) - (orderDetail.unitCost.usd * orderDetail.quantity * orderDetail.discount * 0.01)

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
        <MDBox>
          <MDTypography variant="button" fontWeight="bold" >
            [{productData?.code}] {productData?.name} - {productData?.type?.label} "{productData.typeClass}"
          </MDTypography>
        </MDBox>
        <MDBox display="flex" alignItems="center">
          <ButtonDatePicker
            label={"Vence el: " + orderDetail?.expirationDate.toFormat("dd/MM/yyyy")}
            value={orderDetail?.expirationDate}
            onChange={(newValue) => setOrderDetail({ ...orderDetail, expirationDate: newValue })}
            disabled={readOnly}
          />
        </MDBox>
      </MDBox>
      <Grid container spacing={1}>
        {/* Slot */}
        <Grid xsOffset={6} xs={6}>
          <MDInput
            label="Lote"
            placeholder="Lote de producto"
            fullWidth
            required
            value={orderDetail?.slot ?? 0}
            onChange={e => {
              const newValue = e.target.value;
              return setOrderDetail({ ...orderDetail, slot: newValue })
            }}
            inputProps={{
              readOnly,
            }}
          />
        </Grid>

        {/* Quantity */}
        <Grid xs={6}>
          <MDInput
            label="Cantidad"
            placeholder="Cantidad de producto"
            fullWidth
            required
            value={orderDetail?.quantity ?? 0}
            onChange={e => {
              const inputValue = e.target.value;
              const newValue = inputValue === "" ? 0 : (Number(inputValue) || orderDetail?.quantity);
              return setOrderDetail({ ...orderDetail, quantity: newValue })
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[1-9][0-9]*",
              onInvalid: e => {
                if (Number(e.target.value) === 0) return e.target.setCustomValidity("La cantidad no puede ser 0");
                return e.target.setCustomValidity("Use numeros unicamente para expresar este valor");
              },
              onInput: e => e.target.setCustomValidity(""),
              readOnly,
            }}
          />
        </Grid>

        {/* Size */}
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
              readOnly={readOnly}
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

        {/* Discount */}
        <Grid xs={6}>
          <MDInput
            label="Descuento"
            fullWidth
            value={orderDetail?.discount ?? 0}
            required
            onChange={e => {
              const inputValue = e.target.value;
              const newValue = inputValue === "" ? 0 : (Number(inputValue) || orderDetail?.discount);
              return setOrderDetail({ ...orderDetail, discount: newValue });
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              onInvalid: e => e.target.setCustomValidity("Use numeros unicamente para expresar este valor"),
              onInput: e => e.target.setCustomValidity(""),
              readOnly,
            }}
            InputProps={{
              startAdornment: <MDTypography variant="caption">%</MDTypography>,
            }}
          />
        </Grid>

        {/* Unit Cost */}
        <Grid xs={6}>
          <MDInput
            label="Coste Unitario"
            fullWidth
            value={orderDetail?.unitCost?.usd ?? 0}
            required
            onChange={e => {
              const inputValue = e.target.value;
              const newValue = inputValue === "" ? 0 : (Number(inputValue) || orderDetail?.unitCost?.usd);
              return setOrderDetail({ ...orderDetail, unitCost: { usd: newValue } });
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              onInvalid: e => e.target.setCustomValidity("Use numeros unicamente para expresar este valor"),
              onInput: e => e.target.setCustomValidity(""),
              readOnly,
            }}
            InputProps={{
              startAdornment: <MDTypography variant="caption">$</MDTypography>,
            }}
          />
        </Grid>
      </Grid>
    </MDBox >
  )
}

export default Product;