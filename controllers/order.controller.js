const Order = require('../models/orders.model');

exports.getOrder = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'An error occurred while fetching orders.' });
    }
};

exports.totalSale = async (req, res) => {
    try {
        const result = await Order.aggregate([
            { $unwind: "$items" },
            { $group: { _id: null, totalQuantity: { $sum: "$items.quantity" } } }
        ]);
        
        const totalQuantity = result.length > 0 ? result[0].totalQuantity : 0;
        res.status(200).json({ totalQuantity });
    } catch (error) {
        console.error('Error calculating total sales:', error);
        res.status(500).json({ message: 'An error occurred while calculating total sales.' });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        
        res.status(200).json({ message: 'Order deleted successfully.' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'An error occurred while deleting the order.' });
    }
};

exports.getRevenueMonthly = async (req, res) => {
    try {
        const revenue = await Order.aggregate([
            {
                $addFields: {
                    // Ensure createdAt is a Date object
                    createdAtDate: { $toDate: "$createdAt" }
                }
            },
            {
                $project: {
                    year: { $year: "$createdAtDate" },
                    month: { $month: "$createdAtDate" },
                    totalAmount: 1
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    totalRevenue: { $sum: "$totalAmount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: { $concat: [{ $toString: "$_id.year" }, "-", { $toString: "$_id.month" }] },
                    totalRevenue: 1
                }
            },
            { $sort: { month: 1 } }
        ]);
        
        res.status(200).json(revenue);
    } catch (error) {
        console.error('Error getting monthly revenue:', error);
        res.status(500).json({ message: 'An error occurred while getting monthly revenue.' });
    }
};

exports.getTopProducts = async (req, res) => {
    try {
        const topProducts = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    productName: { $first: "$items.productName" },
                    totalQuantity: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 3 }
        ]);
        
        res.status(200).json(topProducts);
    } catch (error) {
        console.error('Error getting top products:', error);
        res.status(500).json({ message: 'An error occurred while getting top products.' });
    }
};