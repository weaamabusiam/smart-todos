async function GetAllCategories(req, res, next) {
    let query = "SELECT * FROM categories WHERE user_id = " + req.user.userId + " ORDER BY name";
    global.db_pool.execute(query, (err, categories) => {
        if (err) {
            console.error(err);
            req.categories_data = [];
        } else {
            req.categories_data = categories;
        }
        next();
    });
}

async function AddCategory(req, res, next) {
    let name = req.body.name;
    let color = req.body.color;
    
    if (!name) {
        return next();
    }
    
    let cleanName = global.addSlashes(name);
    
    let query = "INSERT INTO categories (name, color, user_id) VALUES ('" + cleanName + "', '" + (color || '#007bff') + "', " + req.user.userId + ")";
    global.db_pool.execute(query, (err) => {
        if (err) {
            console.error(err);
        }
        next();
    });
}

async function DeleteCategory(req, res, next) {
    // Check if category has tasks
    let checkQuery = "SELECT COUNT(*) as count FROM tasks WHERE category_id = " + req.params.id + " AND user_id = " + req.user.userId;
    global.db_pool.execute(checkQuery, (err, result) => {
        if (result[0].count > 0) {
            req.message = 'לא ניתן למחוק קטגוריה עם משימות';
            return next();
        }
        
        let deleteQuery = "DELETE FROM categories WHERE id = " + req.params.id + " AND user_id = " + req.user.userId;
        global.db_pool.execute(deleteQuery, (err) => {
            next();
        });
    });
}

async function GetCategoryById(req, res, next) {
    let query = "SELECT * FROM categories WHERE id = " + req.params.id + " AND user_id = " + req.user.userId;
    global.db_pool.execute(query, (err, categories) => {
        if (err || categories.length === 0) {
            req.error = 'קטגוריה לא נמצאה';
            return next();
        }
        req.category_data = categories[0];
        next();
    });
}

async function UpdateCategory(req, res, next) {
    let name = req.body.name;
    let color = req.body.color;
    
    if (!name) {
        req.error = 'שם הקטגוריה הוא שדה חובה';
        return next();
    }
    
    let cleanName = global.addSlashes(name);
    
    let query = "UPDATE categories SET name = '" + cleanName + "', color = '" + (color || '#007bff') + "' WHERE id = " + req.params.id + " AND user_id = " + req.user.userId;
    global.db_pool.execute(query, (err) => {
        if (err) {
            console.error(err);
            req.error = 'שגיאה בעדכון הקטגוריה';
        }
        next();
    });
}

module.exports = {
    GetAllCategories,
    AddCategory,
    DeleteCategory,
    GetCategoryById,
    UpdateCategory
}; 