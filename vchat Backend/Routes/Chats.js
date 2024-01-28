const express=require('express');
const Chat=require('../Models/ChatModel');
const Authenticate=require('../Middleware/authorization');
const User = require('../Models/UserModel');
const router=express.Router();

router.post('/',Authenticate,async(req,res)=>{
    const {userId}=req.body;

    if(!userId){
        return res.status(422).json({error:"Please fill all the fields"})
    }

    let isChatExists= await Chat.findOne(
        {isgroupchat:false,
            $and:[
                { users: { $size: 2 } },
                { users: { $all: [userId, req.user._id] } }
            ]
        }
    ).populate("users","-password").populate("latestmessage");
    // console.log(isChatExists,"isChatExists");
    
    // console.log(isChatExists,"isChatExists2");
    if(isChatExists){
        isChatExists = await isChatExists.populate({
            path: "latestmessage.sender",
            select: "name email profilepic"
        });
        return res.status(200).json(isChatExists);
    }
    else{
        // console.log("else");
        let chatdata={
            chatname:"sender",
            isgroupchat:false,
            users:[userId,req.user._id],
        }
        try {
            const newChat=await Chat.create(chatdata);
            const fullchat=await Chat.findById(newChat._id).populate("users","-password")
            .populate("latestmessage").populate({path:"latestmessage.sender",select:"name email profilepic"});
            return res.status(200).json(fullchat);
        } catch (error) {
            return res.status(500).json({error:"Internal server error"});
        }
    }
    
})
router.get('/',Authenticate,async(req,res)=>{
    if(!req.user){
        return res.status(422).json({error:"Please fill all the fields"})
    }
    try {
        const chats=await Chat.find({users:{$in:req.user._id}}).populate("users","-password").populate("latestmessage").populate("groupadmin","-password").populate({path:"latestmessage.sender",select:"name email profilepic"}).sort({updatedAt:-1});
        return res.status(200).json(chats);
    } catch (error) {
        return res.status(500).json({error:"Internal server error"});
    }
})
router.post('/group',Authenticate,async(req,res)=>{
    const {groupname,groupusers}=req.body;
    if(!groupname || !groupusers ){
        return res.status(422).json({error:"Please fill all the fields"})
    }
    let users=JSON.parse(groupusers);

    if(users.length<2){
        return res.status(422).json({error:"Please add atleast 2 users"})
    }
    users.push(req.user._id);
    let chatdata={
        chatname:groupname,
        isgroupchat:true,
        groupadmin:req.user._id,
        users:users,
    }
    try {
        const grpchat=await Chat.create(chatdata);
        const fullgrpchat=await Chat.findById(grpchat._id).populate("users","-password")
        .populate("latestmessage").populate("groupadmin","-password").populate({path:"latestmessage.sender",select:"name email profilepic"});
        return res.status(200).json(fullgrpchat);
    } catch (error) {
        return res.status(500).json({error:"Internal server error"});
    }
})   
router.put('/rename',Authenticate,async(req,res)=>{
    const {chatId,chatname}=req.body;
    if(!chatId || !chatname){
        return res.status(422).json({error:"Please fill all the fields"})
    }

    const chat=await Chat.findOneAndUpdate({_id:chatId},{chatname},{new:true}).populate("users","-password").populate("latestmessage").populate("groupadmin","-password").populate({path:"latestmessage.sender",select:"name email profilepic"});

    if(!chat){
        return res.status(422).json({error:"You are not authorized to rename this chat"});
    }
    return res.status(200).json(chat);

})
router.put('/addtogroup',Authenticate,async(req,res)=>{
    const {chatId,userId}=req.body;
    if(!chatId || !userId){
        return res.status(422).json({error:"Please fill all the fields"})
    } 
    const chat =await Chat.findOneAndUpdate(
        { _id: chatId, groupadmin: req.user._id },
        { $push: { users: userId } },
        { new: true }
    ).populate("users","-password").populate("latestmessage").populate("groupadmin","-password").populate({path:"latestmessage.sender",select:"name email profilepic"});

    if(!chat){
        return res.status(422).json({error:"You are not authorized to add members to this chat"});
    }
    return res.status(200).json(chat);
})
router.put('/removefromgroup',Authenticate,async(req,res)=>{
    const {chatId,userId}=req.body;
    if(!chatId || !userId){
        return res.status(422).json({error:"Please fill all the fields"})
    } 
    const chat =await Chat.findOneAndUpdate(
        { _id: chatId, groupadmin: req.user._id },
        { $pull: { users: userId } },
        { new: true }
    ).populate("users","-password").populate("latestmessage").populate("groupadmin","-password").populate({path:"latestmessage.sender",select:"name email profilepic"});

    if(!chat){
        return res.status(422).json({error:"You are not authorized to add members to this chat"});
    }
    return res.status(200).json(chat);
})

router.put('/leavefromgroup',Authenticate,async(req,res)=>{
    const {chatId,userId}=req.body;
    if(!chatId || !userId){
        return res.status(422).json({error:"Please fill all the fields"})
    } 
    const chat =await Chat.findOneAndUpdate(
        { _id: chatId},
        { $pull: { users: userId } },
        { new: true }
    ).populate("users","-password").populate("latestmessage").populate("groupadmin","-password").populate({path:"latestmessage.sender",select:"name email profilepic"});

    if(!chat){
        return res.status(422).json({error:"You are not authorized to add members to this chat"});
    }
    return res.status(200).json(chat);
})


module.exports=router;