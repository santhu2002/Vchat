const jsonwebtoken=require('jsonwebtoken')
const User=require('../Models/UserModel')

const Authenticate=async(req,res,next)=>{  
    
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){

    try{
        const token=req.headers.authorization.split(" ")[1]
        const decodeData=jsonwebtoken.verify(token,process.env.JWT_SECRET)
        const user=await User.findOne({_id:decodeData.id})
        req.user=user
        next()
    }catch(error){
        return res.status(500).json({error:"Internal Server Error"})
        console.log(error)
    }
}else{
    return res.status(401).json({error:"Unauthorized"})
}
}

module.exports=Authenticate