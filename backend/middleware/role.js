/**
 * Role-Based Access Control Middleware
 *
 * Restricts route access to users with specific roles.
 * Must be used after the auth middleware so that req.user is available.
 *
 * @example
 *   router.get('/admin-only', auth, role('admin'), handler);
 *   router.get('/multi-role', auth, role('hospital', 'admin'), handler);
 *
 * @module middleware/role
 * @param {...string} allowedRoles - One or more roles permitted to access the route.
 * @returns {Function} Express middleware function.
 */
module.exports = function role(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}.`
      });
    }

    next();
  };
};
