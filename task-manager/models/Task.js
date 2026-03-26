const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    attachment: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Task = mongoose.model('tasks', taskSchema);

module.exports = Task;