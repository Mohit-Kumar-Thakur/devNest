export const authorizeRole = (...roles) => {
    return (req, res, next) => {
        console.log('=== ROLE CHECK DEBUG ===');
        console.log('User ID:', req.user?._id);
        console.log('User Email:', req.user?.email);
        console.log('User Role:', req.user?.role);
        console.log('Required Roles:', roles);
        console.log('Has Required Role:', roles.includes(req.user?.role));
        console.log('=== END DEBUG ===');

        if (!req.user) {
            console.log('❌ No user found in request');
            return res.status(401).json({ message: "Not authorized" });
        }

        if (!roles.includes(req.user.role)) {
            console.log('❌ Access denied. User role:', req.user.role, 'Required:', roles);
            return res.status(403).json({ 
                message: "Access denied. Insufficient permissions.",
                userRole: req.user.role,
                requiredRoles: roles
            });
        }

        console.log('✅ Access granted for role:', req.user.role);
        next();
    };
};