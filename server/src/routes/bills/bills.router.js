const express = require('express');
const {
  httpGetBills,
  httpGetBill,
  httpCreateBill,
  httpUpdateBill,
  httpDeleteBill,
} = require('../../controllers/bills/bills.controller');

const { checkUserPrivilegesAccess } = require('../auth/auth.utils');

const billsRouter = express.Router();

// Take into account the order of the routes, since the answer will depend on which one matches first.
billsRouter.get('/:id', checkUserPrivilegesAccess('billing', 'read'), httpGetBill);
billsRouter.get('/', checkUserPrivilegesAccess('billing', 'read'), httpGetBills);

billsRouter.post('/', checkUserPrivilegesAccess('billing', 'upsert'), httpCreateBill);

billsRouter.put('/:id', checkUserPrivilegesAccess('billing', 'upsert'), httpUpdateBill);

billsRouter.delete('/:id', checkUserPrivilegesAccess('billing', 'delete'), httpDeleteBill);

module.exports = billsRouter;
