async function GetAllCategories(req, res, next) {
    let query = "SELECT * FROM categories WHERE user_id = " + parseInt(req.user.userId) + " ORDER BY name ASC";
    global.db_pool.execute(query, (err, results) => {
        if (err) {
            console.log("Error fetching categories:", err);
            req.categories_data = [];
        } else {
            req.categories_data = results;
        }
        next();
    });
}

async function AddCategory(req, res, next) {
    let name = req.body.name;
    let color = req.body.color || '#007bff';
    
    if (!name || name.trim() === '') {
        return res.render('categories', { 
            categories: req.categories_data || [], 
            error: 'שם הקטגוריה הוא שדה חובה',
            message: null 
        });
    }
    
    let cleanName = global.addSlashes(name.trim());
    let query = "INSERT INTO categories (name, color, user_id) VALUES ('" + cleanName + "', '" + color + "', " + parseInt(req.user.userId) + ")";
    
    global.db_pool.execute(query, (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.render('categories', { 
                    categories: req.categories_data || [], 
                    error: 'קטגוריה עם שם זה כבר קיימת',
                    message: null 
                });
            }
            return res.render('categories', { 
                categories: req.categories_data || [], 
                error: 'שגיאה בהוספת הקטגוריה',
                message: null 
            });
        }
        
        req.message = 'הקטגוריה נוספה בהצלחה';
        next();
    });
}

async function DeleteCategory(req, res, next) {
    let categoryId = req.params.id;
    
    // Check if category has tasks
    let checkQuery = "SELECT COUNT(*) as taskCount FROM tasks WHERE category_id = " + parseInt(categoryId) + " AND user_id = " + parseInt(req.user.userId);
    global.db_pool.execute(checkQuery, (err, results) => {
        if (err || results[0].taskCount > 0) {
            return res.render('categories', { 
                categories: req.categories_data || [], 
                error: 'לא ניתן למחוק קטגוריה שיש בה משימות',
                message: null 
            });
        }
        
        let deleteQuery = "DELETE FROM categories WHERE id = " + parseInt(categoryId) + " AND user_id = " + parseInt(req.user.userId);
        global.db_pool.execute(deleteQuery, (err, results) => {
            if (err || results.affectedRows === 0) {
                return res.render('categories', { 
                    categories: req.categories_data || [], 
                    error: 'שגיאה במחיקת הקטגוריה',
                    message: null 
                });
            }
            
            req.message = 'הקטגוריה נמחקה בהצלחה';
            next();
        });
    });
}

module.exports = {
    GetAllCategories,
    AddCategory,
    DeleteCategory
}; 