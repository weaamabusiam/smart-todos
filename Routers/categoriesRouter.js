const express = require('express');
const router = express.Router();
module.exports = router;

const categories_Mid = require("../middleware/categories_Mid");

router.get('/', [categories_Mid.GetAllCategories], (req, res) => {
    res.render('categories', { 
        categories: req.categories_data, 
        username: req.user.username,
        message: req.query.message || null
    });
});

router.post('/new', [categories_Mid.AddCategory], (req, res) => {
    res.redirect('/categories');
});

router.post('/delete/:id', [categories_Mid.DeleteCategory], (req, res) => {
    if (req.message) {
        res.redirect('/categories?message=' + req.message);
    } else {
        res.redirect('/categories');
    }
});

router.get('/edit/:id', [categories_Mid.GetCategoryById], (req, res) => {
    if (req.error) {
        return res.redirect('/categories?message=' + req.error);
    }
    res.render('edit-category', { 
        category: req.category_data, 
        username: req.user.username,
        error: null
    });
});

router.post('/edit/:id', [categories_Mid.UpdateCategory], (req, res) => {
    if (req.error) {
        return res.render('edit-category', { 
            category: req.body, 
            username: req.user.username,
            error: req.error
        });
    }
    res.redirect('/categories?message=הקטגוריה עודכנה בהצלחה');
}); 