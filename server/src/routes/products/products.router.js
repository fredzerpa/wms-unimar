const express = require('express');
const { checkUserPrivilegesAccess } = require('../auth/auth.utils');
const {
  httpGetProduct,
  httpGetProducts,
  httpCreateProduct,
  httpUpdateProduct,
  httpDeleteProduct,
} = require('../../controllers/products/products.controller');

const productsRouter = express.Router();

// * Tomar en cuenta el orden de las rutas, ya que la respuesta dependera de cual coincida primero
productsRouter.get('/:id', httpGetProduct);
productsRouter.get('/', httpGetProducts);

productsRouter.post('/', checkUserPrivilegesAccess('inventory', 'upsert'), httpCreateProduct);

productsRouter.put('/:id', checkUserPrivilegesAccess('inventory', 'upsert'), httpUpdateProduct);

productsRouter.delete('/:id', checkUserPrivilegesAccess('inventory', 'delete'), httpDeleteProduct);

module.exports = productsRouter;
