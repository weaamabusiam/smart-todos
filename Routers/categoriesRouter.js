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