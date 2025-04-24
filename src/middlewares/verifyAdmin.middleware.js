const verifyAdmin = (req, res, next) => {
  
  try {
    // Check if the user object exists and has a roleS
    if (!req.user || req.user.roll !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // If the user is an admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export default verifyAdmin;