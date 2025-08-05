const express = require('express');
const router = express.Router();
module.exports = router;

const tasks_Mid = require("../middleware/tasks_Mid");
const categories_Mid = require("../middleware/categories_Mid");

router.get('/', [tasks_Mid.GetAllTasks, categories_Mid.GetAllCategories], (req, res) => {
    res.render('tasks', {
        tasks: req.tasks_data,
        categories: req.categories_data,
        currentPage: req.current_page,
        totalPages: req.total_pages,
        filter: req.filter,
        selectedCategory: req.selected_category,
        username: req.user.username,
        message: req.query.message || null
    });
});

router.post('/toggle/:id', [tasks_Mid.ToggleTask], (req, res) => {
    res.redirect('/tasks');
});

router.post('/delete/:id', [tasks_Mid.DeleteTask], (req, res) => {
    res.redirect('/tasks');
});

router.get('/edit/:id', [tasks_Mid.GetTaskById, categories_Mid.GetAllCategories], (req, res) => {
    if (req.error) {
        return res.redirect('/tasks?message=' + req.error);
    }
    res.render('edit-task', { 
        task: req.task_data, 
        categories: req.categories_data,
        username: req.user.username,
        error: null
    });
});

router.post('/edit/:id', [tasks_Mid.UpdateTask, categories_Mid.GetAllCategories], (req, res) => {
    if (req.error) {
        return res.render('edit-task', { 
            task: req.body, 
            categories: req.categories_data,
            username: req.user.username,
            error: req.error
        });
    }
    res.redirect('/tasks?message=המשימה עודכנה בהצלחה');
});

router.get('/new', [categories_Mid.GetAllCategories], (req, res) => {
    if (req.categories_data.length === 0) {
        return res.redirect('/categories?message=נא ליצור קטגוריה לפני הוספת משימה');
    }
    res.render('new-task', { categories: req.categories_data, error: null });
});

router.post('/new', [tasks_Mid.AddTask, categories_Mid.GetAllCategories], (req, res) => {
    if (req.error) {
        res.render('new-task', { 
            categories: req.categories_data, 
            error: req.error 
        });
    } else {
        res.redirect('/tasks');
    }
}); 