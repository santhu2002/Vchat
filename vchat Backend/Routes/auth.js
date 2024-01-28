const express = require('express');
const User = require('../Models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Authenticate = require('../Middleware/authorization');

const router = express.Router();

router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please fill all the fields" })
    }

    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(422).json({ error: "User Doesn't Exist" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const authtoken = await jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            return res.status(201).json({  authtoken, _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.profilePic,})
        } else {
            return res.status(422).json({ error: "Invalid Credentials" })
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" })
        console.log(error)
    }   

});

router.post('/signup', async(req, res) => {
    const { name, email, password, profilePic}=req.body;
    if(!name || !email || !password){
        return res.status(422).json({error:"Please fill all the fields"})
    }

    try{
        const response = await User.findOne({ $or: [{ email: email }, { name: name }] });
        if(response){
            return res.status(422).json({error:"Email/UserName already exists"})
        }
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password,salt)
        const user = new User({name, email, "password":hashedPassword, profilePic})
        await user.save()
        if(user){
            const authtoken = await jwt.sign({id:user._id},process.env.JWT_SECRET)
            return res.status(201).json({message:"User registered successfully",authtoken})
        }
    }catch(error){
        return res.status(500).json({error:"Internal Server Error"})
        console.log(error)
    }



});


router.get("/",Authenticate, async (req, res) => {
    const keyword = req.query.search;
    // console.log(keyword)
    if (keyword) {
      const users = await User.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
        ],
      }).find({ _id: { $ne: req.user._id } });
      res.json(users);
    } else {
      const users = await User.find({});
      res.json(users);
    }
  });
  

module.exports = router;