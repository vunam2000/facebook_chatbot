const jsonwebtoken = require("jsonwebtoken");

function authFunc() {
    return (req, res, next) => {
        try {
            let token = req.header('token');

            jwt.verify(token, global.SECRET_TOKEN, function(err, decoded) {
                if (err) {
                    return res.status(404).send({ 
                        auth: false, 
                        message: 'Failed to authenticate token.' 
                    });
                }
            })

            next(); 
        } catch (error) {
            
        }
        
    }
}
exports.auth = authFunc();
