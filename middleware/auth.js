const jwt = require('jsonwebtoken')
const User = require('../modals/userModal')

exports.authenticate = async(req,res,next) =>{
    try{
        const token = req.header('Authorization')
        const user = jwt.verify(token,process.env.TOKEN_SECRET)
        const userId = user.id.id
        User.findByPk(userId)
        .then((user) =>{
            req.user = user
            next()
        })
        .catch( (error) =>{
            res.status(400).json({error:error})
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
      }
    
}