import express from 'express';
import searchController from '../controllers/searchController.controller.js'

const router = express.Router();

router.route('/:username').get(searchController.searchByUsername);



export default router;
