const express = require('express');
const tasks_Mid = require('../middleware/tasks_Mid');
const categories_Mid = require('../middleware/categories_Mid');

const router = express.Router();

router.get('/tasks', [tasks_Mid.GetAllTasks, categories_Mid.GetAllCategories], (req, res) => {
    res.render('tasks', { 
        tasks: req.tasks_data || [], 
        categories: req.categories_data || [], 
        error: null, 
        message: null 
    });
});

router.post('/tasks', [categories_Mid.GetAllCategories, tasks_Mid.AddTask], (req, res) => {
    res.render('new-task', { 
        categories: req.categories_data || [], 
        error: null, 
        message: req.message 
    });
});

router.get('/tasks/new', [categories_Mid.GetAllCategories], (req, res) => {
    res.render('new-task', { 
        categories: req.categories_data || [], 
        error: null, 
        message: null 
    });
});

router.post('/tasks/toggle/:id', [tasks_Mid.ToggleTask], (req, res) => {
    // This route is handled by the middleware
});

module.exports = router; 