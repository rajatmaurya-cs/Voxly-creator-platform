import express from "express"
import superAdminMiddleware from "../Middleware/superAdminMiddleware";

const planrouter = express.Router()

planrouter.get('/plan-info')