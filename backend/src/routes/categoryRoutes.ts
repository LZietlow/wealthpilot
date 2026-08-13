import express from "express";
import { pool } from "../config/db";


const router = express.Router();


router.get('/', async(req, res) => {
    try {
        const response = await pool.query('SELECT * FROM categories');
        res.status(200).json({categories: response.rows});
    } catch (error) {
        res.status(500).json({error: error});
    }
    

})

export default router;
