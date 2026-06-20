
const superAdminMiddleware = (req, res, next) => {

    console.log("The user role in SuperadminMiddleware is:",req?.user?.role)
    
    if (req.user?.role !== "SUPERADMIN") {
        return res.status(403).json({
            success: false,
            message: "Superadmin access required"
        });
    }
    next();
};

export default superAdminMiddleware;
