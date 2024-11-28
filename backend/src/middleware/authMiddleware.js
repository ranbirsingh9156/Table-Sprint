const jwt = require('jsonwebtoken');


const auth = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');  // Using x-auth-token as a custom header name


    // Check if no token
    if (!token) {
    return res.status(417).json({ msg: 'No token, authorization denied' }); // return Expectation failed error message
    }


    // Verify token
    try {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
        return res.status(401).json({ msg: 'Token is not valid' }); //Return unauthorized error
        } else {
        req.user = decoded.user;
        next();
        }
    });
    } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
    }
};




module.exports = auth;