const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {

    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d"
        }
    );
};

//register user
const registerUser = async (req, res) => {

    try {

        const {
            username,
            email,
            password
        } = req.body;

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = await User.create({

            username,

            email,

            password: hashedPassword
        });

        const token =
            generateToken(user._id);

        res.status(201).json({

            token,

            user: {

                id: user._id,

                username: user.username,

                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

//login user
const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const user =
            await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {

            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token =
            generateToken(user._id);

        res.json({

            token,

            user: {

                id: user._id,

                username: user.username,

                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

//profile
const getProfile = async (req, res) => {

    try {

        const user =
            await User.findById(
                req.user.id
            ).select("-password");

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};



module.exports = {

    registerUser,
    loginUser,
    getProfile,
};