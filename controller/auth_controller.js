const { generateToken } = require("../lib/utils");
const { checkingUser, registerModels, loginModels } = require("../models/auth_models");
const bcrypt = require('bcryptjs');

async function registerController(req, res) {
    const { username, password } = req.body;

    try {
        if (!password || !username) {
            return res.status(400).json({ message: "All field are required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        const checkingUserResult = await checkingUser(username);

        if (checkingUserResult) {
            return res.status(409).json({ message: 'Username sudah digunakan' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await registerModels({
            username: username, password: hashedPassword
        })


        return res.status(201).json({
            message: "Berhasil Registrasi Account",
        })


    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
}

async function loginContoller(req, res) {

    const {username, password} = req.body;

    try {
        if (!password || !username) {
            return res.status(400).json({ message: "All field are required" })
        }

        const result = await loginModels({username: username})

        if (!result){
            return res.status(404).json({
                message: "Invalid username or password"
            })
        }

        console.log(result);


        const matchingPassword = await bcrypt.compare(password, result.password_hash);

        if (!matchingPassword){
            return res.status(401).json({
                message: "Invalid username or password"
            })
        }

        const token = generateToken(result.id, result.username, res);

       return res.status(200).json({
            status: 200,
            message: 'Login berhasil',
            token: token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
    
}

module.exports = { registerController, loginContoller }