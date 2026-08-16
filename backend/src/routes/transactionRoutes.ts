
import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {pool} from '../config/db'
import suggestCategory from '../utils/categorize';

const router = express.Router();



router.get('/', authenticateToken, async(req, res) => {
    var user_id = (req as any).userId;
    //console.log("test" + user_id);
    
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


router.delete('/:id', authenticateToken, async(req,res) => {
    const transaction_id = req.params.id;
    const userId = (req as any).userId;
    try {
        const result = await pool.query('SELECT * FROM transactions JOIN accounts ON transactions.account_id = accounts.id WHERE transactions.id = $1 AND user_id = $2', [transaction_id, userId]);
        if(result.rows.length === 0) {
            res.status(404).json({message: 'No matching transaction found'});
            return;
        }
        await pool.query('DELETE FROM transactions WHERE id = $1', [transaction_id]);
        res.status(200).json({message: 'Transaction succesfully deleted'});
    } catch (error) {
        res.status(500).json({message: 'Could not delete transaction'});
    }
})

router.patch('/:id', authenticateToken, async(req,res) => {
    const transaction_id = req.params.id;
    const userId = (req as any).userId;

    var transaction;
    try {
        transaction = await pool.query('SELECT * FROM transactions JOIN accounts ON transactions.account_id = accounts.id WHERE transactions.id = $1 AND user_id = $2', [transaction_id, userId]);
        if(transaction.rows.length === 0) {
            res.status(404).json({message: 'No matching transaction found'});
            return;
        }
    } catch (error) {
        res.status(400).json({message: 'Could not find transaction'});
        return;
    }

    const newAmount = req.body.amount !== undefined ? req.body.amount : transaction.rows[0].amount;
    const newDescription = req.body.description !== undefined ? req.body.description : transaction.rows[0].description;
    const newCategory = req.body.category_id !== undefined ? req.body.category_id : transaction.rows[0].category_id;
    const account_id = transaction.rows[0].account_id
    try {
        const updatedTransaction = await pool.query('UPDATE transactions SET amount = $1, description = $2, category_id = $3 WHERE account_id = $4 AND id = $5 RETURNING *', [newAmount, newDescription, newCategory, account_id, transaction_id]);
        res.status(200).json({message: 'transaction succesfully updated', transaction: updatedTransaction.rows[0]});
    } catch (error) {
        res.status(500).json({message: 'could not update transaction'});
    }

})

router.post('/suggest-category', authenticateToken, async(req, res) => {
    const description = req.body.description;
    const category = suggestCategory(description);

    if(category === null) {
        res.status(200).json({category_id: null});
        return;
    }

    try {
        const category_id = await pool.query('SELECT id FROM categories WHERE name = $1', [category]);
        res.status(200).json({category_id: category_id.rows[0].id});
    } catch (error) {
        res.status(500).json({category_id: null});
    }

})

router.get('/monthly-summary', authenticateToken, async(req, res) => {
    const user_id = (req as any).userId;

    try {
        const response = await pool.query(`SELECT DATE_TRUNC('month', transaction_date) AS month,SUM(amount) AS total FROM transactions JOIN accounts ON transactions.account_id = accounts.id WHERE accounts.user_id = $1 GROUP BY DATE_TRUNC('month', transaction_date) ORDER BY month ASC`, [user_id]);    
        res.status(200).json({monthlySummary: response.rows});
    } catch (error) {
        res.status(500).json({monthlySummary: null});
    }
})

export default router;