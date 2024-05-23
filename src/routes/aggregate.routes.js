
import express from 'express';
import aggregateController from '../controllers/aggregateController.controller.js'

const router = express.Router();

router.route('/').get(aggregateController.aggregatePolicies)

export default router;
