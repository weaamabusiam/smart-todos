async function GetAllTasks(req, res, next) {
    let page = parseInt(req.query.page) || 1;
    let filter = req.query.filter || 'all';
    let category = req.query.category || 'all';
    let limit = parseInt(10);
    let offset = parseInt((page - 1) * limit);
    
    let whereClause = 'WHERE t.user_id = ' + parseInt(req.user.userId);
    
    if (filter === 'completed') {
        whereClause += ' AND t.completed = 1';
    } else if (filter === 'incomplete') {
        whereClause += ' AND t.completed = 0';
    }
    
    if (category !== 'all') {
        whereClause += ' AND t.category_id = ' + parseInt(category);
    }
    
    let query = "SELECT t.*, c.name as category_name, c.color as category_color ";
    query += "FROM tasks t ";
    query += "JOIN categories c ON t.category_id = c.id ";
    query += whereClause + " ";
    query += "ORDER BY t.target_date ASC, t.created_at DESC ";
    query += "LIMIT " + limit + " OFFSET " + offset;
    
    global.db_pool.query(query, (err, tasks) => {
        if (err) {
            console.error(err);
            req.tasks_data = [];
        } else {
            req.tasks_data = tasks;
        }
        
        // Get total count for pagination
        let countQuery = "SELECT COUNT(*) as count ";
        countQuery += "FROM tasks t ";
        countQuery += "JOIN categories c ON t.category_id = c.id ";
        countQuery += whereClause;
        
        global.db_pool.query(countQuery, (err, countResult) => {
            let totalTasks = countResult.length > 0 ? countResult[0].count : 0;
            req.total_pages = Math.ceil(totalTasks / limit);
            req.current_page = page;
            req.filter = filter;
            req.selected_category = category;
            next();
        });
    });
}

async function AddTask(req, res, next) {
    let description = req.body.description;
    let target_date = req.body.target_date;
    let category_id = req.body.category_id;
    
    if (!description || !target_date || !category_id) {
        req.error = 'נא למלא את כל השדות';
        return next();
    }
    
    if (description.length > 200) {
        req.error = 'תיאור המשימה לא יכול להכיל יותר מ-200 תווים';
        return next();
    }
    
    let cleanDescription = global.addSlashes(description);
    
    let query = "INSERT INTO tasks (description, target_date, category_id, user_id) VALUES ('" + cleanDescription + "', '" + target_date + "', " + category_id + ", " + req.user.userId + ")";
    global.db_pool.execute(query, (err) => {
        if (err) {
            console.error(err);
            req.error = 'שגיאה ביצירת המשימה';
        }
        next();
    });
}

async function ToggleTask(req, res, next) {
    let query = "UPDATE tasks SET completed = NOT completed WHERE id = " + req.params.id + " AND user_id = " + req.user.userId;
    global.db_pool.execute(query, (err) => {
        if (err) {
            console.error(err);
        }
        next();
    });
}

module.exports = {
    GetAllTasks,
    AddTask,
    ToggleTask
}; 