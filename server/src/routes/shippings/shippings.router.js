const express = require('express');
const {
  httpGetShippings,
  httpGetShipping,
  httpCreateShipping,
  httpUpdateShipping,
  httpDeleteShipping,
} = require('../../controllers/shippings/shippings.controller');

const { checkUserPrivilegesAccess } = require('../auth/auth.utils');

const shippingsRouter = express.Router();

// Take into account the order of the routes, since the answer will depend on which one matches first.
shippingsRouter.get('/:id', checkUserPrivilegesAccess('shippings', 'read'), httpGetShipping);
shippingsRouter.get('/', checkUserPrivilegesAccess('shippings', 'read'), httpGetShippings);

shippingsRouter.post('/', checkUserPrivilegesAccess('shippings', 'upsert'), httpCreateShipping);

shippingsRouter.put('/:id', checkUserPrivilegesAccess('shippings', 'upsert'), httpUpdateShipping);

shippingsRouter.delete('/:id', checkUserPrivilegesAccess('shippings', 'delete'), httpDeleteShipping);

module.exports = shippingsRouter;
