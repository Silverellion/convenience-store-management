const Account = require('../models/account.model');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log('Username:', username);
    console.log('Password:', password);

    try {
        const user = await Account.findOne({ username, password });
        console.log('Kết quả truy vấn:', user);

        if (user) {
            return res.redirect('/html/home.html');
        } else {
            return res.status(401).send('Invalid username or password');
        }
    } catch (err) {
        console.error('Lỗi truy vấn:', err);
        return res.status(500).send('Server error');
    }
};


