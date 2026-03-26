const User = require('../models/User')

exports.createUser = async (req, res) => {
    const {name, email, age} = req.body;

    const newUser = new User({
        name,
        email,
        age
    })

    await newUser.save();
    res.status(201).json({message: 'User created successfully', user: newUser});
};

exports.getUserById = async (req, res) => {
    const userId = req.param.id;

    const user = await User.findById(userId);

    if(!user){
        return res.status(404).json({message: 'User not found'});
    }
    return res.status(200).json({user});
}

exports.updateUser = async (req, res) =>{
    const userId = req.param.id;

    const {name, email, age} = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, {name, email, age}, {new: true});

    if(!updatedUser){
        return res.status(404).json({message: 'User not found'});
    }
    return res.status(200).json({message: 'User updated successfully', user: updatedUser})
}

exports.deleteUser = async (req, res) => {
    const userId = req.param.id;

    const deletedUser = await User.json({message: 'User not found'})

    if(!deletedUser){
        return res.status(404).json ({message: 'User not found'});
    }
    return res.status(200).json({message: 'User deleted successfully'})
}