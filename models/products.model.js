const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId : {type : String, required : true, unique : true},
    name : {type : String, required : true},
    category : {type : String, required : true},
    price : {type : Number, required : true},
    stock : {type : Number, required : true},
    supplier : {type : String, required : true},
    expirationDate : {type : Date, required : true}
})

module.exports = mongoose.model('Products', productSchema, 'SanPham');