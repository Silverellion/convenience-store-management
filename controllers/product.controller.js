const Product = require('../models/products.model');

//tao san pham
exports.createProducts = async (req, res) => {
    console.log("Request body:", req.body);
    const { productId, name, category, price, stock, supplier, expirationDate } = req.body;


    if (!productId || !name || !category || !price || !stock || !supplier || !expirationDate) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    
    try {
        const newProduct = new Product({
            productId,
            name,
            category,
            price,
            stock,
            supplier,
            expirationDate,
        });

        const saveProduct = await newProduct.save();
        return res.status(200).json({
            message: 'Product save successfully bravooo!',
            product: saveProduct,
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'An error occurred while creating the product.' });
    }
}

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the product." });
    }
};


//cap nhat san pham
exports.updateProducts = async (req, res) => {
    const { productId, name, category, price, stock, supplier, expirationDate } = req.body;

    if (!productId || !name || !category || !price || !stock || !supplier || !expirationDate) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, // lấy từ URL /api/products/:id
            {
                productId,
                name,
                category,
                price: parseFloat(price),
                stock: parseInt(stock),
                supplier,
                expirationDate
            },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Khong tim thay san pham.' });
        }

        res.status(200).json({
            message: 'Product updated successfully.',
            product: updatedProduct
        });
    } catch (error) {
        console.error('Loi khi cap nhat san pham:', error);
        res.status(500).json({ message: 'An error occurred while updating the product.' });
    }
};

//Xoa san pham
exports.deleteProducts = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);    
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found.'});
        }
        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'An error occurred while deleting the product.' });
    }
};


// lay danh sach san pham
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error occurred while fetching products.' });
    }
}