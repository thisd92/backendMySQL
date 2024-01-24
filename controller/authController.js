const bcrypt = require('bcrypt');
const User = require('../model/User');
const { generateToken } = require('../middleware/jwtMiddleware')

exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: true, message: 'Username and password are required.' });
        }

        const user = await User.findOne({ where: { username: email } });
        if (!user) {
            return res.status(401).json({ message: "Credentials doesn't match" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Credentials doesn't match" });
        }

        const token = generateToken(user)

        res.status(200).json({ message: 'Login realizado com sucesso!', token });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao processar a solicitação' });
    }
};
