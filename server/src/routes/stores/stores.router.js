const express = require('express');
const { checkUserPrivilegesAccess } = require('../auth/auth.utils');
const {
  httpGetStore,
  httpGetStores,
  httpCreateStore,
  httpUpdateStore,
  httpDeleteStore,
} = require('../../controllers/stores/stores.controller');

const storesRouter = express.Router();

// * Tomar en cuenta el orden de las rutas, ya que la respuesta dependera de cual coincida primero
storesRouter.get('/:id', httpGetStore);
storesRouter.get('/', httpGetStores);

storesRouter.post('/', checkUserPrivilegesAccess('shippings', 'upsert'), httpCreateStore);

storesRouter.put('/:id', checkUserPrivilegesAccess('shippings', 'upsert'), httpUpdateStore);

storesRouter.delete('/:id', checkUserPrivilegesAccess('shippings', 'delete'), httpDeleteStore);

module.exports = storesRouter;
