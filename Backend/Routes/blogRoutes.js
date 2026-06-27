import express from "express"
import upload from '../Middleware/Multer.js'
import authMiddleware from "../Middleware/authMiddleware.js"
import  {addBlog , getallblog ,getblogbyid , deleteBlog , toggleblogpublish , GenerateReport ,BlogUserDashboard , toggleLikeBlog} from '../controller/BlogController.js'
import {getDashboardStats} from '../controller/Dashboard.js'
const blogRouter = express.Router();



blogRouter.post('/addblog',upload.single('image') , authMiddleware,addBlog)



blogRouter.get('/allblog',getallblog) 



blogRouter.get('/dashboard/blogs' ,(req,res,next)=>{
    
    next();
}, authMiddleware ,BlogUserDashboard)



blogRouter.get('/blogbyid/:blogId',getblogbyid)





blogRouter.post("/toggle-blog",(req,res , next)=>{

console.log("blogrouter.post(/toggle-blog)")

next()

}, toggleblogpublish)




blogRouter.post('/delete-blog',deleteBlog)


blogRouter.post('/Report', authMiddleware, GenerateReport)






blogRouter.get('/BlogDashBoard',authMiddleware,(req,res,next)=>{

    
    next()
    
},getDashboardStats)



blogRouter.post('/like/:id', authMiddleware,(req,res,next)=>{

console.log("The request proceed from blog.routes after passing from authmiddleware")

next();

} ,toggleLikeBlog);




export default blogRouter;