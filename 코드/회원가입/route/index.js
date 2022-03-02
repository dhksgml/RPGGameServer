const express = require('express');
const { User } = require('../model');

const router = express.Router();

//회원 가입
router.post('/join', async(req, res, next)=>{
    //1. 요청이 온 클라이언트로부터 id, nick, password를 받는다.
    let body = req.body;
    try{
        //2. 3. DB를 조회하여 같은 아이디, 닉네임 있는지 찾는다.
        const ids = await User.findOne({
            attributes:['id'],
            where: {id: req.body.id}
        });

        const nicks = await User.findOne({
            attributes:['nick'],
            where:{nick: req.body.nick}
        });

        const users = await User.findOne({
            attributes:['id','nick'],
            where: {id: req.body.id, nick: req.body.nick}
        });
        //5. DB에 같은 닉네임 있는 경우
        if(nicks != null){
            res.json(3);
        } else if(ids != null) {    //5. DB에 같은 아이디 있는 경우
            res.json(2);
        } else if(users == null) {
            //4. 없을 경우 DB에 값을 저장한다.
            const c = await User.create({
                id : body.id,
                nick : body.nick,
                password : body.password,
                class:0
            });
            res.json(1);
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
})

module.exports = router;