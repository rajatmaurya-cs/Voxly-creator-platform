
const superAdminMiddleware = (req, res, next) => {
    if (req.user?.role !== "SUPERADMIN") {
        return res.status(403).json({
            success: false,
            message: "Superadmin access required"
        });
    }
    next();
};

export default superAdminMiddleware;
