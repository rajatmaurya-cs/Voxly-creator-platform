
const superAdminMiddleware = (req,res,next)=>{

    const {user} = req.user;
    
    if(user.role === 'superadmin') next();

    return res.status(403).json({
        success:false,
        message:"Admin Access Required"
    })

}

export default superAdminMiddleware;
