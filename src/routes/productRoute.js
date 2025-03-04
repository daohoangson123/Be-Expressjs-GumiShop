import { Router } from 'express';
import ProductController from '../app/controllers/productController.js';
import authentication from '../app/middlewares/authentication.js';
import authorization from '../app/middlewares/authorization.js';
const productRoute = Router();

// Rest api

productRoute.get('/products', ProductController.getProducts);

productRoute.get('/products/:id', ProductController.getProductById);

productRoute.post(
    '/products',
    authentication,
    authorization('admin'),
    ProductController.createProduct,
);

productRoute.put(
    '/products/:id',
    authentication,
    authorization('admin'),
    ProductController.updateProduct,
);

productRoute.delete(
    '/products/:id',
    authentication,
    authorization('admin'),
    ProductController.deleteProduct,
);

export default productRoute;
