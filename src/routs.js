import express from 'express';
import * as productsCtrl from './controllers/productsController.js';
import * as usersCtrl from './controllers/usersController.js';
import * as ordersCtrl from './controllers/ordersController.js';
import { requireAuth } from './middleware/auth.js';
const router = express.Router();
// Products
router.get('/products', productsCtrl.index);
router.get('/products/top', productsCtrl.topFive);
router.get('/products/:id', productsCtrl.show);
router.get('/products', productsCtrl.index);
router.post('/products', requireAuth, productsCtrl.create);
router.get('/products-by-category', productsCtrl.byCategory); // use query ? category=

// Users
router.post('/users', usersCtrl.create); // signup
router.post('/users/login', usersCtrl.login);
router.get('/users', requireAuth, usersCtrl.index);
router.get('/users/:id', requireAuth, usersCtrl.show);

// Orders
router.post('/orders', requireAuth, ordersCtrl.createOrder);
router.post('/orders/:orderId/products', requireAuth, ordersCtrl.addProduct);
router.get('/orders/:id', requireAuth, ordersCtrl.getOrder);
router.get('/orders/current', requireAuth, ordersCtrl.getCurrentOrder); // ? userId=
router.put('/orders/:orderId/complete', requireAuth, ordersCtrl.completeOrder);
export default router;