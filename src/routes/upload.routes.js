import express from "express";
import uploadController from '../controllers/uploadController.controller.js';
import { upload } from '../middlerware/upload.js'
const router = express.Router();
router.route('/').post(upload.single('file'),uploadController.uploadFile);
export default router;