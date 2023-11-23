const {
  getProducts,
  createProduct,
  updateProductById,
  deleteProductById,
  getProductById,
  upsertProductsByBundle,
} = require('../../models/products/products.model');

async function httpGetProducts(req, res) {
  const { search } = req.query;

  try {
    // TODO: add search
    // const response = search ? await getProductBySearch(search) : await getProducts();
    const response = await getProducts();
    return res.status(200).json(response);

  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to fetch Products',
      message: error.message,
    });
  }
}

async function httpGetProduct(req, res) {
  const { id } = req.params;
  try {
    return res.status(200).json(await getProductById(id));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to fetch Products',
      message: error.message,
    });
  }
}

async function httpCreateProduct(req, res) {
  const ProductData = req.body;


  try {
    return res.status(201).json(await createProduct(ProductData));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to create new Product',
      message: error.message,
    });
  }
}

async function httpUpdateProduct(req, res) {
  const productId = req.params.id;
  const updateData = req.body;


  try {
    return res.status(200).json(await updateProductById(productId, updateData));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to update Product',
      message: error.message,
    });
  }
}

async function httpDeleteProduct(req, res) {
  const productId = req.params.id;


  try {
    return res.status(200).json(await deleteProductById(productId));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to delete Product',
      message: error.message,
    });
  }
}

async function httpCreateProductsByBundle(req, res) {
  const bundle = req.body;

  if (!Array.isArray(bundle))
    return res.status(400).json({
      code: 400,
      error: 'Data is not bundled',
      message: 'The passed data is not an Array of data',
    });


  try {
    return res.status(201).json(await upsertProductsByBundle(bundle));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to create bundle of Product',
      message: error.message,
    });
  }
}

module.exports = {
  httpGetProducts,
  httpGetProduct,
  httpCreateProduct,
  httpCreateProductsByBundle,
  httpUpdateProduct,
  httpDeleteProduct,
};
