
import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {pool} from '../config/db'

const router = express.Router();



router.get('/', authenticateToken, async(req, res) => {
    var user_id = (req as any).userId;
    console.log("test" + user_id);
    
    try {
        const response = await pool.query('SELECT transactions.*, categories.name AS category_name FROM transactions JOIN accounts ON transactions.account_id = accounts.id LEFT JOIN categories ON transactions.category_id = categories.id WHERE accounts.user_id = $1', [user_id]);
        res.json({transactions: response.rows})

    } catch (error) {
        res.status(401).json({message: "UserId undefined"})
    }
    
})

router.post('/', authenticateToken, async(req, res) => {
    const account_id = req.body.account_id;
    const amount = req.body.amount;
    const description = req.body.description;
    var category_id = req.body.category_id;
    const user_id = (req as any).userId;

    try {
        const accountCheck = await pool.query('SELECT * FROM accounts WHERE id = $1 AND user_id = $2', [account_id, user_id]);
        if(accountCheck.rows.length === 0 ) {
        res.status(403).json({message: "account doestn match userId"});
        return;
    }
    } catch (error) {
        res.status(500).json({error: error})
        return;
    }

    if(category_id === "" || category_id === undefined) {
        category_id = null;
    }

    try {
        const response = await pool.query('INSERT INTO transactions (account_id, amount, description, category_id) VALUES ($1, $2, $3, $4) RETURNING *', [account_id, amount, description, category_id])
        res.status(201).json({transaction: response.rows[0]});
    } catch (error) {
        res.status(500).json({error: error})
    }

})

export default router;