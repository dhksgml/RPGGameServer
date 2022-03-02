const express = require('express');
const { User } = require('../model');

const router = express.Router();

// router.get('/',async(req, res, next)=>{
//     try{
//         const users = await User.findAll();
//         console.log(users)
//         res.json("asdf");
//     }catch(err){
//         console.error(err);
//         next(err);
//     }
// })

// router.post('/',async(req, res, next)=>{
//     try{
//         //console.log(req.body.nick_name);
//         const users = await User.findOne({e_mail: req.body.e_mail},{password: req.body.password});
//         // console.log(users)
//         // console.log(req.body.e_mail)
//         // console.log(users.e_mail);
//         res.json(users.nick_name);
        
//     }catch(err){
//         console.error(err);
//         next(err);
//     }
// })

router.post('/join', async(req, res, next)=>{
    let body = req.body;
    try{
        // const user = await User.findOrCreate({
        //     where:{id: req.body.id, nick: req.body.nick}
        // })
        // console.log(user);
        const users = await User.findOne({
            attributes:['id','nick'],
            where: {id: req.body.id, nick: req.body.nick}
        });

        if(users == null){
            const c = await User.create({
                id : body.id,
                nick : body.nick,
                password : body.password,
                class : 0
            });
            console.log(c);
        }
        
        res.json(users);
    } catch(err) {
        console.error(err);
        next(err);
    }
})

module.exports = router;