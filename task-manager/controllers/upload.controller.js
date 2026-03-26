const Task = require('../models/Task');
const joi = require('joi');

exports.uploadFile = async (req, res) => {
    try{
        if(!req.file){
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const {title, description} = req.body;

        const schema = joi.object({
            title: joi.string().min(3).max(100).required(),
            description: joi.string().max(500).required()
        })

        const { error } = schema.validate({ title, description });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const newTask = new Task({
            title,
            description,
            attachment: req.file ? req.file.path : null
        });

        await newTask.save();

        res.status(200).json({ message: 'Task Added successfully', task: newTask });
    }catch(err){
        res.status(500).json({ error: 'Failed to upload file' });
    }
}

exports.multiUploadFiles = (req, res) => {
    try{
        if(!req.files || req.files.length === 0){
            return res.status(400).json({ error: 'No files uploaded' });
        }

        res.status(200).json({ message: 'Files uploaded successfully', files: req.files });
    }catch(err){
        res.status(500).json({ error: 'Failed to upload files' });
    }
}