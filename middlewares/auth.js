const {VerifyUser}= require('../services/authentication')

function checkAuthentication(){
    return (req,res,next)=>{
        const tokenValue= req.cookies["token"]
        if(!tokenValue)
            return next()
        try{
            const payload = VerifyUser(tokenValue)
            req.user = payload
            console.log(payload)
            return next()
        } catch(err){
            return  next()
        }
    }
}

function  restrictTo(req,res,next){
        if(!req.user) return res.redirect('/login')
        next();
    }


module.exports={
    checkAuthentication,restrictTo
}