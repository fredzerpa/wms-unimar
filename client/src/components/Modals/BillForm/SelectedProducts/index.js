import SimpleBar from "simplebar-react";
import PropTypes from "prop-types";

import MDBox from "components/MDBox"
import Product from "./components/Products";



const SelectedProducts = ({ products, onProductsDataChange, ...rest }) => {

  return (
    <SimpleBar style={{ minHeight: 100, maxHeight: 400 }}>
      <MDBox p={1.5}>
        {products.map(product =>
          <Product
            key={product?.name + product?.type?.value + product?.typeClass}
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