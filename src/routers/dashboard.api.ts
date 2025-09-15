import express from 'express';
import { getDashboardData } from '../controllers/dashboard.controller';

export const dashboardRouter = express.Router()

dashboardRouter.get('/', getDashboardData)
