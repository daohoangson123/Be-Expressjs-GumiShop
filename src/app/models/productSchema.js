import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number },
    sale: { type: Number },
    stocks: { type: Number },
    imgUrl: { type: String },
    description: { type: String },
    isDelete: { type: Boolean, default: false },
    deletedDate: { type: Date, default: null },
});

productSchema.pre('find', function (next) {
    this.where({
        isDelete: {
            $eq: false,
        },
    });
    next();
});

productSchema.pre('findOne', function (next) {
    this.where({
        isDelete: {
            $eq: false,
        },
    });
    next();
});

const ProductSchema = mongoose.model('products', productSchema);

export default ProductSchema;
