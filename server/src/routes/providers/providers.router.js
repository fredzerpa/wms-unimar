const express = require('express');
const { checkUserPrivilegesAccess } = require('../auth/auth.utils');
const {
  httpGetProvider,
  httpGetProviders,
  httpCreateProvider,
  httpUpdateProvider,
  httpDeleteProvider,
} = require('../../controllers/providers/providers.controller');

const providersRouter = express.Router();

// * Tomar en cuenta el orden de las rutas, ya que la respuesta dependera de cual coincida primero
providersRouter.get('/:id', httpGetProvider);
providersRouter.get('/', httpGetProviders);

providersRouter.post('/', checkUserPrivilegesAccess('billing', 'upsert'), httpCreateProvider);

providersRouter.put('/:id', checkUserPrivilegesAccess('billing', 'upsert'), httpUpdateProvider);

providersRouter.delete('/:id', checkUserPrivilegesAccess('billing', 'delete'), httpDeleteProvider);

module.exports = providersRouter;
