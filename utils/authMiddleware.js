const { verifyToken } = require("../utils/auth")

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // extracting token
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }
    const payload = verifyToken(token);
    // check payload and credentials matching or not
    if (!payload || req.params?.email !== payload.user.email) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = payload;
    next();
}

module.exports = authMiddleware;