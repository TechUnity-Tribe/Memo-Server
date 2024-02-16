const User = require("../models/auth.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required!" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(400).json({ message: "User exist, Proceed to the Login Page!" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

        await newUser.save()

        const user = { ...newUser._doc }
        delete user.password

        return res.status(200).json({ message: "User Successfully Created an Account!", status: 200, success: true, data: { user, token } })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}


const userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required!" })
    }

    try {
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(400).json({ message: "User does not exist, Proceed to the Signup Page!" })
        }

        const comparePassword = await bcrypt.compare(password, existingUser.password)
        if (!comparePassword) {
            return res.status(400).json({ message: "Invalid Email/Password" })
        }


        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

        const user = { ...existingUser._doc }
        delete user.password

        return res.status(200).json({ message: "User Successfully Logged In...", status: 200, success: true, data: { user, token } })

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}


const userProfile = async (req, res) => {
    const { id } = req.params

    try {
        const existingUser = await User.findById(id)
        if (!existingUser) {
            return res.status(400).json({ message: "User Profile does not exist!" })
        }

        const user = { ...existingUser._doc }
        delete user.password

        return res.status(200).json({ message: "User Profile Information", user })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }

}


exports.registerUser = registerUser;
exports.userLogin = userLogin;
exports.userProfile = userProfile;