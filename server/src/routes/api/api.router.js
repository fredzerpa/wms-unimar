const express = require('express');
const apiRouter = express.Router();

// Routes
const productsRouter = require('../products/products.router');
const inventoryRouter = require('../inventory/inventory.router');
const usersRouter = require('../users/users.router');
const shippingsRouter = require('../shippings/shippings.router');
const storesRouter = require('../stores/stores.router');
const providersRouter = require('../providers/providers.router');
const billsRouter = require('../bills/bills.router');


apiRouter.use('/products', productsRouter);
apiRouter.use('/inventory', inventoryRouter);
apiRouter.use('/bills', billsRouter);
apiRouter.use('/shippings', shippingsRouter);
apiRouter.use('/stores', storesRouter);
apiRouter.use('/providers', providersRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
