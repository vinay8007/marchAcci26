const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const joi = require('joi');

exports.registerUser = async (req, res, next) => {
    try {
        const {name, email, password} = req.body;

        const schema = joi.object({
            name: joi.string().min(3).max(30).required(),
            email: joi.string().email().required(),
            password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required()
        })

        const { error } = schema.validate({ name, email, password });
        if (error) {
            // return res.status(400).json({ message: error.details[0].message });
            const err = new Error();
            err.name = "VALIDATION_ERROR";
            err.message = error.details[0].message;
            throw err;
        }

        if(!name || !email || !password){
            // return res.status(400).json({ message: 'All fields are required' });
            // throw new Error('All fields are required');
            const err = new Error();
            err.name = "FIELDS_REQUIRED";
            throw err;
        }

        const userExists = await User.find({ email });
        if(userExists.length > 0){
            // return res.status(400).json({ message: 'User already exists' });
            // throw new Error({name: 'User already exists'});

            const err = new Error();
            err.name = "USER_ALREADY_EXISTS";
            throw err;
        }

        const newUser = new User({
            name, 
            email, 
            password
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    }catch(err){
        next(err)
    }
}

exports.loginUser = async (req, res, next) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            throw new Error({name: 'All fields are required'});
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email
        }, process.env.JWT_SECRET, 
        { expiresIn: '1d'});

        res.status(200).json({ message: 'Login successful', token });
    }catch(err){
        next(err)
    }
}

exports.getAllUsers = async (req, res, next) => {
    try{
        const page = parseInt(req.query.meraPage) || 1;
        const limit = 5;

        // (page - 1) * limit => skip
        const skip = (page - 1) * limit
        const users = await User.find().select('-password').sort({name: -1}).skip(skip).limit(limit);
        res.status(200).json(users);
    }catch(err){
       next(err)
    }
}

exports.getUserById = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id).select('-password');
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }catch(err){
        next(err)
    }
}

exports.updateUser = async (req, res, next) => {
    try{
        const { name, email } = req.body;
        const updatedData = {};
        
        if(name) updatedData.name = name;
        if(email) updatedData.email = email;

        const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true }).select('-password');           
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user });
    }catch(err){
        next(err)
    }
}

exports.deleteUser = async (req, res, next) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }catch(err){
        next(err)
    }
}