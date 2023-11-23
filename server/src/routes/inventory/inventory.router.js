const express = require('express');
const {
  httpGetInventoryRecords,
  httpGetInventoryRecord,
  httpCreateInventoryRecord,
  httpUpdateInventoryRecord,
  httpDeleteInventoryRecord,
} = require('../../controllers/inventory/inventory.controller');

const { checkUserPrivilegesAccess } = require('../auth/auth.utils');

const inventoryRouter = express.Router();

// Take into account the order of the routes, since the answer will depend on which one matches first.
inventoryRouter.get('/:id', checkUserPrivilegesAccess('inventory', 'read'), httpGetInventoryRecord);
inventoryRouter.get('/', checkUserPrivilegesAccess('inventory', 'read'), httpGetInventoryRecords);

inventoryRouter.post('/', checkUserPrivilegesAccess('inventory', 'upsert'), httpCreateInventoryRecord);

inventoryRouter.put('/:id', checkUserPrivilegesAccess('inventory', 'upsert'), httpUpdateInventoryRecord);

inventoryRouter.delete('/:id', checkUserPrivilegesAccess('inventory', 'delete'), httpDeleteInventoryRecord);

module.exports = inventoryRouter;
