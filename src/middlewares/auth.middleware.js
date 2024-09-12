const authUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    const user = req.user
    productionLogger.info(`User authenticated: ${user.email}, Role: ${user.role}`);
    return next()
  } else {
    productionLogger.info('User not authenticated')
    return res.status(401).send('error de autorización')
  }
};

const authAdmin = (req, res, next) => {
  productionLogger.info(`authAdmin middleware: User role is ${req.user?.role}`)
  if (req.user?.role === 'admin') {
    return next()
  }
  productionLogger.info('Authorization error: User is not an admin')
  return res.status(401).send('error de autorización')
};

const authPremium = (req, res, next) => {
  productionLogger.info(`authPremium middleware: User role is ${req.user?.role}`)
  if (req.user?.role === 'premium') {
    return next()
  }
  productionLogger.info('Authorization error: User is not premium')
  return res.status(401).send('error de autorización')
}

const authPremiumOrAdmin = (req, res, next) => {
  productionLogger.info(`authPremiumOrAdmin middleware: User role is ${req.user?.role}`);
  if (req.user?.role === 'admin' || req.user?.role === 'premium') {
    return next();
  }
  productionLogger.info('Authorization error: User is not admin or premium');
  return res.status(401).send('error de autorización');
};

module.exports = { authAdmin, authUser, authPremium , authPremiumOrAdmin }