import express from "express"
import upload from '../Middleware/Multer.js'
import authMiddleware from "../Middleware/authMiddleware.js"
import adminMiddleware from "../Middleware/adminMiddleware.js"

import  {addBlog , getallblog ,getblogbyid , deleteBlog , toggleblogpublish , GenerateReport ,BlogAdmin , toggleLikeBlog} from '../controller/BlogController.js'
import {getDashboardStats} from '../controller/Dashboard.js'
const blogRouter = express.Router();



blogRouter.post('/addblog',upload.single('image') , authMiddleware, adminMiddleware,addBlog)



blogRouter.get('/allblog',getallblog) 



blogRouter.get('/admin/blogs' ,(req,res,next)=>{
    console.log("The /admin/blogs of dashbaord for admin ✅")
    next();
}, authMiddleware ,BlogAdmin)



blogRouter.get('/blogbyid/:blogId',getblogbyid)





blogRouter.post("/toggle-blog",(req,res , next)=>{

console.log("blogrouter.pos(/toggle-blog)")

next()

}, toggleblogpublish)




blogRouter.post('/delete-blog',deleteBlog)


blogRouter.post('/Report', authMiddleware, GenerateReport)






blogRouter.get('/BlogDashBoard',authMiddleware,(req,res,next)=>{

    
    next()
    
},getDashboardStats)



blogRouter.post('/like/:id', authMiddleware, toggleLikeBlog);




export default blogRouter;