const express = require('express');
const categories_Mid = require('../middleware/categories_Mid');

const router = express.Router();

router.get('/categories', [categories_Mid.GetAllCategories], (req, res) => {
    res.render('categories', { 
        categories: req.categories_data || [], 
        error: null, 
        message: null 
    });
});

router.post('/categories', [categories_Mid.GetAllCategories, categories_Mid.AddCategory], (req, res) => {
    res.render('categories', { 
        categories: req.categories_data || [], 
        error: null, 
        message: req.message 
    });
});

router.get('/categories/delete/:id', [categories_Mid.GetAllCategories, categories_Mid.DeleteCategory], (req, res) => {
    res.render('categories', { 
        categories: req.categories_data || [], 
        error: null, 
        message: req.message 
    });
});

module.exports = router; 