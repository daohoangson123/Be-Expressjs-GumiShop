import HttpStatusCode from '../constants/httpStatusCode.js';
import {
    BadRequest,
    PaginationResponse,
    SuccessResponse,
} from '../apiResponses/apiResponse.js';
import ProductSchema from '../models/productSchema.js';
import mongoose from 'mongoose';

class ProductController {
    async createProduct(req, res, next) {
        try {
            const { name, price, sale, stocks, imgUrl, description } = req.body;
            // Create model to insert database
            const product = new ProductSchema({
                name,
                price,
                sale,
                stocks,
                imgUrl,
                description,
            });

            // Save to database and return result
            await product.save();
            return res
                .status(HttpStatusCode.Success)
                .send(new SuccessResponse(product));
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req, res, next) {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(HttpStatusCode.BadRequest)
                .send(new BadRequest(`Can not find product with id: ${id}`));
        } // validating id

        const product = await ProductSchema.findOne({
            _id: id,
        });

        if (product) {
            return res
                .status(HttpStatusCode.Success)
                .send(new SuccessResponse(product));
        } else {
            return res
                .status(HttpStatusCode.BadRequest)
                .send(new BadRequest(`Can not find product with id: ${id}`));
        }
    }

    async getProducts(req, res, next) {
        const { pageIndex, pageSize, sort } = req.body;

        const page = Number.parseInt(pageIndex || 1);
        const limit = Number.parseInt(pageSize || 8);

        const query = ProductSchema.find()
            .skip((page - 1) * limit)
            .limit(limit);

        if (sort) {
            query.sort({
                [sort.field]: sort.value === 'asc' ? 1 : -1,
            });
        }

        const products = await query; // at this time it will call to db and get data to client
        const total = await ProductSchema.countDocuments();

        const convertData = products.map((product) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            sale: product.sale,
            stocks: product.stocks,
            imgUrl: product.imgUrl,
            description: product.description,
            isDelete: product.isDelete,
            deletedDate: product.deletedDate,
        }));
        return res
            .status(HttpStatusCode.Success)
            .send(new PaginationResponse(convertData, page, limit, total));
    }

    async updateProduct(req, res, next) {
        try {
            const { id } = req.params;

            const { name, price, sale, stocks, imgUrl, description } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(
                        new BadRequest(`Can not find product with id: ${id}`),
                    );
            } // validating id

            const product = await ProductSchema.findOne({
                _id: id,
            });

            if (!product) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(new BadRequest('Product does not exist in Database'));
            }

            const updateResult = await ProductSchema.updateOne(
                {
                    _id: id,
                },
                {
                    $set: {
                        name: name,
                        price: price || 100,
                        sale: sale || 50,
                        stocks: stocks || 10,
                        imgUrl: imgUrl || '',
                        description: description || '',
                    },
                },
            );

            if (updateResult.modifiedCount === 0) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(
                        new BadRequest(`Can not update product with id: ${id}`),
                    );
            }

            return res
                .status(HttpStatusCode.Success)
                .send(
                    new SuccessResponse(
                        'Product has been updated successfully',
                    ),
                );
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(
                        new BadRequest(`Can not find product with id: ${id}`),
                    );
            } // validating id

            const product = await ProductSchema.findOne({
                _id: id,
            });

            if (!product) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(new BadRequest('Product does not exist in Database'));
            }

            const updateResult = await ProductSchema.updateOne(
                {
                    _id: id,
                },
                {
                    $set: {
                        isDelete: true,
                        deletedDate: new Date(),
                    },
                },
            );

            if (updateResult.modifiedCount === 0) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(
                        new BadRequest(`Can not delete product with id: ${id}`),
                    );
            }

            return res
                .status(HttpStatusCode.Success)
                .send(
                    new SuccessResponse(
                        'Product has been deleted successfully',
                    ),
                );
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductController();
