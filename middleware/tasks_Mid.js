async function GetAllTasks(req, res, next) {
    let whereClause = 'WHERE t.user_id = ' + parseInt(req.user.userId);
    
    // Add category filter if provided
    if (req.query.category && req.query.category !== 'all') {
        whereClause += " AND t.category_id = " + parseInt(req.query.category);
    }
    
    // Add status filter if provided
    if (req.query.status && req.query.status !== 'all') {
        if (req.query.status === 'completed') {
            whereClause += " AND t.completed = 1";
        } else if (req.query.status === 'pending') {
            whereClause += " AND t.completed = 0";
        }
    }
    
    let query = "SELECT t.*, c.name as category_name, c.color as category_color FROM tasks t LEFT JOIN categories c ON t.category_id = c.id " + whereClause + " ORDER BY t.target_date ASC, t.created_at DESC";
    
    global.db_pool.execute(query, (err, results) => {
        if (err) {
            console.log("Error fetching tasks:", err);
            req.tasks_data = [];
        } else {
            req.tasks_data = results;
        }
        next();
    });
}

async function AddTask(req, res, next) {
    let description = req.body.description;
    let targetDate = req.body.target_date;
    let categoryId = req.body.category_id;
    
    if (!description || !targetDate || !categoryId) {
        return res.render('new-task', { 
            categories: req.categories_data || [], 
            error: 'כל השדות הם חובה',
            message: null 
        });
    }
    
    if (description.length > 200) {
        return res.render('new-task', { 
            categories: req.categories_data || [], 
            error: 'תיאור המשימה לא יכול לעלות על 200 תווים',
            message: null 
        });
    }
    
    let cleanDescription = global.addSlashes(description.trim());
    let query = "INSERT INTO tasks (description, target_date, category_id, user_id) VALUES ('" + cleanDescription + "', '" + targetDate + "', " + parseInt(categoryId) + ", " + parseInt(req.user.userId) + ")";
    
    global.db_pool.execute(query, (err, results) => {
        if (err) {
            return res.render('new-task', { 
                categories: req.categories_data || [], 
                error: 'שגיאה בהוספת המשימה',
                message: null 
            });
        }
        
        req.message = 'המשימה נוספה בהצלחה';
        next();
    });
}

async function ToggleTask(req, res, next) {
    let taskId = req.params.id;
    let completed = req.body.completed === 'true' ? 1 : 0;
    
    let query = "UPDATE tasks SET completed = " + completed + " WHERE id = " + parseInt(taskId) + " AND user_id = " + parseInt(req.user.userId);
    
    global.db_pool.execute(query, (err, results) => {
        if (err || results.affectedRows === 0) {
            return res.status(400).json({ error: 'שגיאה בעדכון המשימה' });
        }
        
        res.json({ success: true, completed: completed === 1 });
    });
}

module.exports = {
    GetAllTasks,
    AddTask,
    ToggleTask
}; 