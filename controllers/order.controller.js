const Order = require('../models/orders.model');

exports.getOrder = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'An error occurred while fetching orders.' });
    }
};

exports.totalSale = async (req, res) => {
    try {
        const result = await Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: '$items.quantity' }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalQuantity: 1
                }
            }
        ]);

        res.status(200).json(result[0] || { totalQuantity: 0 });
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ message: 'server error' });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const deleteOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deleteOrder) {
            return res.status(404).json({ message: 'order not found.' });
        }
        res.status(200).json({ message: 'order deleted successfully.' });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: 'An error occurred while deleting the order.' })
    }
}

exports.getRevenueMonthly = async (req, res) => {
    try {
        const result = await Order.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    totalRevenue: { $sum: "$totalAmount" },
                    totalInvoices: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $concat: [
                            { $toString: "$_id.year" },
                            "-",
                            {
                                $cond: [
                                    { $lt: ["$_id.month", 10] },
                                    { $concat: ["0", { $toString: "$_id.month" }] },
                                    { $toString: "$_id.month" }
                                ]
                            }
                        ]
                    },
                    totalRevenue: 1,
                    totalInvoices: 1
                }
            },
            {
                $sort: { month: 1 }
            }
        ]); 
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
