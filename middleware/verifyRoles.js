const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) res.sendStatus(401); //unauthorized
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(req.roles);
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result) res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
