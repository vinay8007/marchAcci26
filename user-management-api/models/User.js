const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique'],
        match: [/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/gm, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(value){
                const result = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
                console.log('Password validation result:', result);
                return result;
            },
            message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
        }
    }
 }, { timestamps: true });

 userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next;
    }

    const salts = 16;
    this.password = await bcrypt.hash(this.password, salts);
    next;
 })

 module.exports = mongoose.model('users', userSchema);