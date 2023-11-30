const jwt = require("jsonwebtoken");

function isUserLoggedIn(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  if(!authorizationHeader) {
    res.status(401).send("no-authorizationHeader");
    return;
  }
  
    const val = authorizationHeader.split(" ");
  
    const tokenType = val[0];
  
    const tokenValue = val[1];
  
    if (tokenType.toLowerCase() === "bearer"){
      const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
      req.decoded = decoded;
      next();
      
    }

    else{
      res.status(401).send("not-authorised");

    }
  
    
  
  }

  function adminsOnly(req, res, next) {
    if(req.decoded.role === "admin") {
      next();
    }
    else{
      res.status(401).send("You're not an admin!");
    }
  
  }

  module.exports = { isUserLoggedIn, adminsOnly }