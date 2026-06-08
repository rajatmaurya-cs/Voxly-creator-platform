import express from "express"
import upload from '../Middleware/Multer.js'
import authMiddleware from "../Middleware/authMiddleware.js"
import adminMiddleware from "../Middleware/adminMiddleware.js"

import  {addBlog , getallblog ,getblogbyid , deleteBlog , toggleblogpublish , GenerateReport ,BlogAdmin} from '../controller/BlogController.js'
import {getDashboardStats} from '../controller/Dashboard.js'
const blogRouter = express.Router();


/* ================= Add Blog ================= */
blogRouter.post('/addblog',upload.single('image') , authMiddleware, adminMiddleware,addBlog)


/* ================= GetAllBlogs for Public================= */
blogRouter.get('/allblog',getallblog) 


/* ================= GetAllBlogs for Admin ================= */
blogRouter.get('/admin/blogs' , authMiddleware ,BlogAdmin)


/* ================= getBlogById=================  */
blogRouter.get('/blogbyid/:blogId',getblogbyid)


/* ================= toggleBlog================= */
// blogRouter.post("/toggle-blog",authMiddleware ,adminMiddleware, toggleblogpublish)

blogRouter.post("/toggle-blog",(req,res , next)=>{

console.log("blogrouter.pos(/toggle-blog)")

next()

}, toggleblogpublish)


/* ================= Delete Blog ================= */
// blogRouter.post('/delete-blog' , authMiddleware ,adminMiddleware ,deleteBlog)
blogRouter.post('/delete-blog',deleteBlog)

/* ================= Blog Report ================= */
blogRouter.post('/Report', authMiddleware, GenerateReport)


/* ================= Blog Dashboard =================  */

// blogRouter.get('/BlogDashBoard', authMiddleware ,getDashboardStats)

blogRouter.get('/BlogDashBoard',authMiddleware,(req,res,next)=>{

    // console.log("Request Goes for Blogrouter dashboard ✅:")
    next()
    
},getDashboardStats)




export default blogRouter;