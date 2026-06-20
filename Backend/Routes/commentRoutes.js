import express from 'express'
import {addComment , getAllComments , getCommentsByBlogId , toggleComment , removecomment} from '../controller/CommentController.js'
import authMiddleware from '../Middleware/authMiddleware.js';
import adminMiddleware from '../Middleware/adminMiddleware.js';

const commentRouter = express.Router();


commentRouter.post('/addcomment' ,authMiddleware,addComment)


commentRouter.get('/allcomment/:blogId', getCommentsByBlogId)



commentRouter.get('/comments' , (req,res,next)=>{
    console.log("Request goes from /comments commentsrouter")
    next()
},authMiddleware,getAllComments)





commentRouter.post('/toggle-comment' , toggleComment )





commentRouter.post('/removecomment' , removecomment)


export default commentRouter;
