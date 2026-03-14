import express from 'express';
import { generateVisualization } from '../controllers/visualizeController.js';

const router = express.Router();

// POST /api/visualize - Generate visualization from text prompt
router.post('/', generateVisualization);

export default router;
