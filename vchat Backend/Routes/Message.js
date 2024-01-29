const express=require('express');
const Message=require('../Models/MessageModel');
const Authenticate=require('../Middleware/authorization');
const Chat = require('../Models/ChatModel');
const User = require('../Models/UserModel');
const router=express.Router();


router.post('/',Authenticate,async(req,res)=>{
    const {chatId,message}=req.body;
    if(!chatId || !message){
        return res.status(422).json({error:"Please add all the fields"})
    }

    let messagedata=new Message({
        chat:chatId,
        content:message,
        sender:req.user._id
    })

    try{
        let newmessage= await Message.create(messagedata);
        //In this snippet, message is a Mongoose document, and the code is populating the "sender" field with the specified fields ("name" and "pic") and then populating the "chat" field without specifying particular fields. The execPopulate method is then used to execute the population.

        newmessage = await newmessage.populate("sender", "name email profilepic");
        newmessage = await newmessage.populate("chat");
        newmessage = await User.populate(newmessage, {
            path: "chat.users",
            select: "name email profilepic",
          });


        let chat=await Chat.findById(chatId);
        chat.latestmessage=newmessage;
        await chat.save();
        res.status(201).json({newmessage})
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal Server Error"})
    }

})

router.get('/:chatId',Authenticate,async(req,res)=>{
    const {chatId}=req.params;
    if(!chatId){
        return res.status(422).json({error:"Please add all the fields"})
    }

    try{
        let messages=await Message.find({chat:chatId})
        .populate("sender", "name email profilepic")
        .populate("chat")
        .sort({ createdAt: 1 });

        res.status(200).json({messages})
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal Server Error"})
    }
})


module.exports=router;