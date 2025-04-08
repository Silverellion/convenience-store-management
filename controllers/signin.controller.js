const Account = require('../models/account.model');

exports.login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    console.log('Username:', username);
    console.log('Password:', password);

    try {
        const user = await Account.findOne({ username, password });
        console.log('Kết quả truy vấn:', user);

        if (user) {
            // Add the role to the localstorage
            const html = `
                <html>
                <head>
                    <script>
                        localStorage.setItem('userRole', '${user.role}');
                        localStorage.setItem('username', '${username}');
                        window.location.href = '/html/home.html';
                    </script>
                </head>
                </html>
            `;
            return res.send(html);
        } else {
            return res.status(401).send('Invalid username or password');
        }
    } catch (err) {
        console.error('Lỗi truy vấn:', err);
        return res.status(500).send('Server error');
    }
};