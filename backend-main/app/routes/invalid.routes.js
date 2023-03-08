module.exports = function(app) {
  app.use(function(req, res, next) {
  
    if (!req.route) {
      return res.status(404).send({ message: ["Not Found: URL path does not exist"]});
    }
    
    next();
  });

};