const dgram = require('dgram');
const { sequelize, User } = require('./models');
//const { update } = require('./models/user');
const socket = dgram.createSocket('udp4');
const mList = [{ mID: 1, mcHP: 100, cLx: -2400, cLy: -9510, cLz: -111.6, cRz: 90, mAct: 101, mRT: 10000,mAtt:10,mExp: 3 },
    { mID: 2, mcHP: 100, cLx: -3580, cLy: -9660, cLz: -168, cRz: 50, mAct: 101, mRT: 10000,mAtt:10,mExp: 3  },
    { mID: 3, mcHP: 100, cLx: -3160, cLy: -8680, cLz: -168, cRz: 140, mAct: 101, mRT: 10000,mAtt:10,mExp: 3  },
    { mID: 4, mcHP: 100, cLx: -1960, cLy: -8390, cLz: -168, mAct: 101, mRT: 10000,mAtt:10,mExp: 3  },
    { mID: 5, mcHP: 100, cLx: -890, cLy: -7140, cLz: 72, cRz: 110, mAct: 101, mRT: 10000,mAtt:10,mExp: 3  },
    { mID: 6, mcHP: 100, cLx: 2340, cLy: -5660, cLz: -8, cRz: 40, mAct: 101, mRT: 10000,mAtt:10,mExp: 3  },
    { mID: 7, mcHP: 100, cLx: 310, cLy: -5610, cLz: 42, cRz: 0, mAct: 101, mRT: 10000,mAtt:10,mExp: 3  },
    { mID: 8, mcHP: 100, cLx: 240, cLy: -3480, cLz: 202, cRz: 190, mAct: 101, mRT: 10000,mAtt:10,mExp: 3  },
    { mID: 9, mcHP: 100, cLx: 2630, cLy: -4340, cLz: -28, cRz: 100, mAct: 101, mRT: 10000,mAtt:10,mExp: 3  },
    { mID: 10, mcHP: 100, cLx: 1640, cLy: -1690, cLz: -98, cRz: 230, mAct: 10, mRT: 10000,mAtt:10,mExp: 3  },
    { mID: 11, mcHP: 100, cLx: 1870, cLy: -250, cLz: 152, cRz: 150, Act: 101, mRT: 10000,mAtt:10,mExp: 3  },
    { mID: 21, mcHP: 500, cLx: -7210, cLy: -7360, cLz: -98, cRz: 100, mAct: 101, mRT: 30000,mAtt:25,mExp: 30 },
    { mID: 22, mcHP: 500, cLx: -8070, cLy: 680, cLz:  62, cRz: 30, mAct: 101, mRT: 30000,mAtt:25,mExp: 30 }];
    const pList = [{ nick: "jj", Lx: 100, Ly: 100, Lz: 100, Rz: 50, cla: 3, pmHP: 100, pcHP: 100, lv: 1, pExp:9, act: 62, CNt: 0 ,ip: null, port: null}];
    //const pList = [{ nick: "kk", Lx: 200, Ly: 200, Lz: 200, Rz: 200, cla: 1, pmHP: 100, pcHP: 30, lv: 1, pExp:9, act: 62, CNt: 0, ip: null, port: null}]
    //{ nick: "pd", Lx: 300.1232, Ly: 500.21, Lz: 700.193, Rz: 31.724, cla: 2, pmHP: 130, pcHP: 200, lv: 10, pExp:80, act: 62, CNt: 0, ip: null, port: null},
    //{ nick: "jj", Lx: 100, Ly: 100, Lz: 100, Rz: 50, cla: 3, pmHP: 100, pcHP: 100, lv: 1, pExp:9, act: 62, CNt: 0 ,ip: null, port: null}];
let cnt = 6;
    socket.bind(9000);

function Cs(cmd, id, Ipaddress, port) {
    this.cmd = cmd;
    this.id = id;
    this.Ipaddress = Ipaddress;
    this.port = port;
}

function CC(cmd, id, cla, Ipaddress, port) {
    this.cmd = cmd;
    this.id = id;
    this.cla = cla;
    this.Ipaddress = Ipaddress;
    this.port = port;
}

function Udb(cmd, nick, Lx, Ly, Lz, Rz, cla, lv, pExp, Ipaddress, port) {
    this.cmd = cmd;
    this.nick = nick;
    this.Lx = Lx;
    this.Ly = Ly;
    this.Lz = Lz;
    this.Rz = Rz;
    this.cla = cla;
    this.lv = lv;
    this.pExp = pExp;
    this.Ipaddress = Ipaddress;
    this.port = port;
}

function CLS(cmd, nick, Lx, Ly, Lz, Rz, cla, lv, pExp, Ipaddress, port) {
    this.cmd = cmd;
    this.nick = nick;
    this.Lx = Lx;
    this.Ly = Ly;
    this.Lz = Lz;
    this.Rz = Rz;
    this.cla = cla;
    this.lv = lv;
    this.pExp = pExp;
    this.Ipaddress = Ipaddress;
    this.port = port;
}

function MAS(cmd, mID, mcHP, cLx, cLy, cLz, cRz, mAct, mRT, Ipaddress, port) {
    this.cmd = cmd;
    this.mID = mID;
    this.mcHP = mcHP;
    this.cLx = cLx;
    this.cLy = cLy;
    this.cLz = cLz;
    this.cRz = cRz;
    this.mRT = mRT;
    this.mAct = mAct;
    this.Ipaddress = Ipaddress;
    this.port = port;
}
sequelize.sync()
    .then(() => {
        console.log("DB 연결 성공");
    })
    .catch((err) => {
        console.error(err);
    });

socket.on('listening', function() {
    console.log('listening event');
});

let logout_users = [];
//비정상적 로그아웃 시간 측정
let checkLogout = setInterval(() => {
    // console.log(pList);
    pList.forEach(element => {
        element.CNt++;
        //console.log(element.CNt);
        if(element.CNt >= 30) //&& pList.includes(element))
        {
            User.findOne({
                where: {nick: element.nick}
            }).then(
                result => {
                    if(result != null){
                        if(element.nick == result.nick)
                        {
                            result.update({
                                pcHP: element.pcHP,
                                Rz: element.Rz,
                                Lx: element.Lx,
                                Ly: element.Ly,
                                Lz: element.Lz,
                                lv: element.lv,
                                pAtt: element.pAtt,
                                pExp: element.pExp
                            })
                            logout_users.push(element);
                            delete pList[pList.indexOf(element)];
                            
                            // .then(
                            //     ()=>{
                            //         logout_users.push(element);
                            //         pList.splice(element, 1);
                            //     }
                            // )
                        }
                    }
                }                
            )
        }
    });
}, 1000);

let str;

socket.on('message', function(msg, rinfo) {
    str = JSON.parse(msg.toString());
    console.log(str);
    if (str.cmd == "CS") {
        try {
            const csid = User.findOne({
                attributes: ['id', 'nick', 'Lx', 'Ly', 'Lz', 'Rz', 'cla', 'lv', 'pExp'],
                where: { id: str.id }
            })
            .then(result => {
                //console.log(result);
                //접속 시 유저 객체에 ip주소와 port번호 저장
                pList.forEach(e=>{
                    if(e.id == str.id)
                    {
                        e.ip = rinfo.address;
                        e.port = rinfo.port;
                    }
                })
                if (result.cla == 0) {
                    try {
                        // 배열 전체 보내야함
                        let message = JSON.stringify({cmd: "CC", id: str.id, cla: result.cla })
                        let sendMsg = JSON.stringify({Buffer: message.length,cmd: "CC", id: str.id, cla: result.cla})
                        socket.send(sendMsg, 0, sendMsg.length, rinfo.port, rinfo.Ipaddress, 
                            function(err) {
                                if (err) {
                                    console.log('메세지 전송 실패');    
                                }
                            }
                        );
                        console.log('메세지 전송 성공');
                    } catch (err) {
                        console.error(err);
                    }
                }
                else if(result.cla != 0)
                {
                    try {
                        let message = JSON.stringify({cmd: "uDB", nick: result.nick, Lx: result.Lx, Ly: result.Ly, Lz: result.Lz, Rz: result.Rz, cla: result.cla, lv: result.lv, pExp: result.pExp })
                        let sendMsg = JSON.stringify({Buffer: message.length, cmd: "uDB", nick: result.nick, Lx: result.Lx, Ly: result.Ly, Lz: result.Lz, Rz: result.Rz, cla: result.cla, lv: result.lv, pExp: result.pExp })
                            //console.log(sendMsg);
                        let udb = new Udb("uDB", result.nick, result.Lx, result.Ly, result.Lz, result.Rz, result.cla, result.lv, result.pExp, rinfo.Ipaddress, rinfo.port);
                        socket.send(sendMsg, 0, sendMsg.length, udb.port, 
                            function(err) {
                                if (err) {
                                    //console.log('메세지 전송 실패');
                                    return;
                                }
                            }
                        );
                    } catch (err) {
                        console.error(err);
                    }
                }
            })
        } catch (err) {
            console.error(err);
        }
    } 
    if(str.cmd == "CN")
    {
        pList.forEach(element => {
            if(element.nick == str.nick && element.CNt <= 30){
                element.CNt = 0;
            }
        })
    }

    if (str.cmd == "GG") {
        User.findOne({
            where: {nick: str.nick}
        }).then(
            result => {
                if(result != null){
                pList.forEach(element => {
                    if(element.nick == result.nick)
                    {
                        result.update({
                            pcHP: element.pcHP,
                            Rz: element.Rz,
                            Lx: element.Lx,
                            Ly: element.Ly,
                            Lz: element.Lz,
                            lv: element.lv,
                            pAtt: element.pAtt,
                            pExp: element.pExp
                        })
                        .then(
                            ()=>{
                                pList.splice(element,1);
                                
                                const message = JSON.stringify({cmd:"GG"});
                                socket.send(message, 0, message.length, rinfo.port, 
                                function(err){
                                    if(err){
                                        return;
                                    }
                                })
                            }
                        )
                    }
                })
            }}                
        )
    }

    

    if (str.cmd == 'CC') {
        try {
            const csid = User.findOne({
                attributes: ['id', 'nick', 'Lx', 'Ly', 'Lz', 'Rz', 'cla', 'lv', 'pExp'],
                where: { id: str.id }
            })
            .then(result => {
                //console.log(result.id);
                result.update({
                    pcHP: str.pmHP,
                    pmHP: str.pmHP,
                    cla: str.cla,
                    pAtt: str.pAtt
                })
                
                try {
                    let message = JSON.stringify({cmd: "uDB", nick: result.nick, Lx: result.Lx, Ly: result.Ly, Lz: result.Lz, Rz: result.Rz, cla: result.cla, lv: result.lv, pExp: result.pExp })
                    let sendMsg = JSON.stringify({Buffer: message.length, cmd: "uDB", nick: result.nick, Lx: result.Lx, Ly: result.Ly, Lz: result.Lz, Rz: result.Rz, cla: result.cla, lv: result.lv, pExp: result.pExp })
                        //console.log(sendMsg);
                    let udb = new Udb("uDB", result.nick, result.Lx, result.Ly, result.Lz, result.Rz, result.cla, result.lv, result.pExp, rinfo.Ipaddress, rinfo.port);
                    socket.send(sendMsg, 0, sendMsg.length, udb.port, 
                        function(err) {
                            if (err) {
                                //console.log('메세지 전송 실패');
                                return;
                            }
                        }
                    );
                } catch (err) {
                    console.error(err);
                }
            })
            // .then(result1 => {
            //     console.log(result1)
                
            // });
        } catch (err) {
            console.error(err);
        }
    }

    if(str.cmd == "move")
    {
        pList.forEach(element => {
            if(element.nick == str.nick){
                element.Lx = str.Lx;
                element.Ly = str.Ly;
                element.Lz = str.Lz;
                element.Rz = str.Rz;
                element.act = str.act;
                try{
                    let message = JSON.stringify({cmd: "move", nick: element.nick, Lx: element.Lx, Ly: element.Ly, Lz: element.Lz, Rz: element.Rz, act: element.act})
                    let sendMsg = JSON.stringify({Buffer: message.length, cmd: "move", nick: element.nick, Lx: element.Lx, Ly: element.Ly, Lz: element.Lz, Rz: element.Rz, act: element.act})
                    //console.log(rinfo.port, ' ', rinfo.address);
                    pList.forEach(e=>{
                        if(e.nick == str.nick)
                        {
                            socket.send(sendMsg, 0, sendMsg.length, e.port, e.ip, 
                                function(err) {
                                    if (err) {
                                        //console.log('메세지 전송 실패');
                                        return;
                                    }
                                }
                            )
                        }
                    })
                } catch(err) {
                    console.error(err);
                }
            }
        })
    }

    if(str.cmd == "heal")
    {
        pList.forEach(element => {
            if(element.nick == str.nick){
                let Heal = element.pmHP / 2;
                if(element.pcHP + Heal > element.pmHP)
                {
                    element.pcHP = element.pmHP;
                    try{
                        let message = JSON.stringify({cmd: "heal", nick: element.nick, act: element.act})
                        let sendMsg = JSON.stringify({Buffer: message.length, cmd: "heal", nick: element.nick, act: element.act})
                        //console.log(rinfo.port, ' ', rinfo.address);
                        pList.forEach(e=>{
                            if(e.nick == str.nick)
                            {
                                socket.send(sendMsg, 0, sendMsg.length, e.port, e.ip, 
                                    function(err) {
                                        if (err) {
                                            //console.log('메세지 전송 실패');
                                            return;
                                        }
                                    }
                                )
                            }
                        })
                    } catch(err) {
                        console.error(err);
                    }
                } else {
                    element.pcHP += Heal;
                    try{
                        let message = JSON.stringify({cmd: "heal", nick: element.nick, act: element.act})
                        let sendMsg = JSON.stringify({Buffer: message.length, cmd: "heal", nick: element.nick, act: element.act})
                        //console.log(rinfo.port, ' ', rinfo.address);
                        pList.forEach(e=>{
                            if(e.nick == str.nick)
                            {
                                socket.send(sendMsg, 0, sendMsg.length, e.port, e.ip, 
                                    function(err) {
                                        if (err) {
                                            //console.log('메세지 전송 실패');
                                            return;
                                        }
                                    }
                                )
                            }
                        })
                    } catch(err) {
                        console.error(err);
                    }
                }

                // console.log(element.pcHP)
                // console.log(pList);
                //console.log(element.pcHP)
                element.pcHP += (element.pmHP / 2);
                if(element.pcHP >= element.pmHP) element.pcHP = element.pmHP;
                try{
                    let message = JSON.stringify({cmd: "heal", nick: element.nick, pcHP: element.pcHP})
                    let sendMsg = JSON.stringify({Buffer: message.length, cmd: "heal", nick: element.nick, pcHP: element.pcHP})
                    //console.log(rinfo.port, ' ', rinfo.address);
                    pList.forEach(e=>{
                        if(e.nick == str.nick)
                        {
                            socket.send(sendMsg, 0, sendMsg.length, e.port, e.ip, 
                                function(err) {
                                    if (err) {
                                        //console.log('메세지 전송 실패');
                                        return;
                                    }
                                }
                            )
                        }
                    })
                } catch(err) {
                    console.error(err);
                }
            }
        })
    }

    let cscnt = setInterval(() => {
        //1초마다 카운트를 하겠다.
        cnt--;
        if(cnt <= 1)
            clearInterval(cscnt);
    }, 1000);

    if (str.cmd == "DBs" && cnt > 0) {
        clearInterval(cscnt);
        cnt = 6;
        try {
            // 배열 전체 보내야함
            //const ms = JSON.stringify({cmd: "cLs", pList: pList })
            let message = JSON.stringify({cmd: "cLs", pList: pList })
            let sendMsg = JSON.stringify({Buffer: message.length,cmd: "cLs", pList: pList})
            //let cls = new CLS("cLs", pList, rinfo.Ipaddress, rinfo.port);
            socket.send(sendMsg, 0, sendMsg.length, rinfo.port, rinfo.Ipaddress, 
                function(err) {
                    if (err) {
                        console.log('메세지 전송 실패');    
                    }
                }
            );
        } catch (err) {
            console.error(err);
        }
    } 
    let clcnt = setInterval(() => {
        if(cnt <= 1)
            clearInterval(clcnt);
    }, 1000);
    if (str.cmd == "cLo" && cnt > 0) {
        clearTimeout(clcnt);
        cnt = 6;
        try {
            let message = JSON.stringify({cmd: "mAs", mList: mList })
            let sendMsg = JSON.stringify({Buffer: message.length,cmd: "mAs", mList: mList})
            //let mas = new MAS("mAs", mList, rinfo.Ipaddress, rinfo.port);
            socket.send(sendMsg, 0, sendMsg.length, rinfo.port, rinfo.Ipaddress,
                function(err) {
                    if (err) {
                        console.log('메세지 전송 실패');
                        return;
                    }
                }
            );
            console.log('메세지 전송 성공');
        } catch (err) {
            console.error(err);
        }
     } 
    if (str.cmd == "mAo" && cnt > 0) {
        try {
            clearTimeout(clcnt);
            cnt = 6;
        } catch (err) {
            console.error(err);
        }
    } 
    if(str.cmd == "mAtt"){
        try{
            
            let message = JSON.stringify({cmd: "mAtt", mID: str.mID, act: str.act })
            let sendMsg = JSON.stringify({Buffer: message.length,cmd: "mAtt", mID: str.mID, act:str.act})
            pList.forEach(e=>{
                if(e.nick == str.nick){
                    socket.send(sendMsg, 0, sendMsg.length, e.port, e.ip, 
                        function(err) {
                            if (err) {
                                console.log('메세지 전송 실패');
                                return;
                            }
                        }
                    )
                }
            })
        } catch(err) {
            console.error(err);
        }
    }
    if(str.cmd == "PD"){
        mList.forEach(e1=>{
            if(str.mID == e1.mID){
                pList.forEach(e2=>{
                    if(str.nick == e2.nick){
                        let AttHp = e2.pcHP - e1.mAtt
                        if(AttHp > 0)
                        {  
                            e2.pcHP = AttHp
                            let message = JSON.stringify({cmd: "PD", nick: e2.nick, pcHP: e2.pcHP, mID: e1.mID })
                            let sendMsg = JSON.stringify({Buffer: message.length, cmd: "PD", nick: e2.nick, pcHP: e2.pcHP, mID: e1.mID})
                            socket.send(sendMsg, 0, sendMsg.length, e2.port, e2.ip, 
                                function(err) {
                                    if (err) {
                                        console.log('메세지 전송 실패');
                                        return;
                                    }
                                }
                            )
                        }
                        if(AttHp < 0){
                            //사망
                            let message = JSON.stringify({cmd: "GO", nick: e2.nick, act: e2.act, mID: e2.miD, pcHP: e2.pcHP })
                            let sendMsg = JSON.stringify({Buffer: message.length, cmd: "GO", nick: e2.nick, act: e2.act, mID: e2.miD, pcHP: e2.pcHP})
                            socket.send(sendMsg, 0, sendMsg.length, e2.port, e2.ip, 
                                function(err) {
                                    if (err) {
                                        console.log('메세지 전송 실패');
                                        return;
                                    }
                                }
                            )
                            // console.log(e2.nick)
                            User.destroy({where: {nick : e2.nick}})
                            .then(()=>{
                                delete pList[pList.indexOf(e2)];
                                // console.log(pList)
                            })
                        }
                    }
                })
            }
        })
    }
    // if (str.cmd = "att") {
    //     try{
    //         let message = JSON.stringify({cmd: "att", nick: str.nick })
    //         let sendMsg = JSON.stringify({Buffer: message.length, cmd: "att", nick: str.nick })
    //         pList.forEach(e=>{
    //             if(e.nick == str.nick){
    //                 socket.send(sendMsg, 0, sendMsg.length, e.port, e.ip, 
    //                     function(err) {
    //                         if (err) {
    //                             console.log('메세지 전송 실패');
    //                             return;
    //                         }
    //                     }
    //                 )
    //             }
    //         })
    //         //console.log('att 전송 성공');
    //     } catch(err) {
    //         console.error(err);
    //     }
    // }
    if(str.cmd == "MD"){
        
        mList.forEach(e1=>{
            if(str.mId == e1.mID){
                pList.forEach(e2=>{
                    if(str.nick == e2.nick){
                        let MPxp =  e1.mExp + e2.pExp
                        let mHP = e1.mcHP - e2.pAtt;
                        if (mHP > 0) {
                            //mList에 mcHP를 업데이트
                            e1.mcHP = mHP;
                            let message = JSON.stringify({ cmd: "MD", mcHP: e1.mcHP, mID: e1.mID })
                                let sendMsg = JSON.stringify({ Buffer: message.length, cmd: "MD", mcHP: e1.mcHP, mID: e1.mID })
                                socket.send(sendMsg, 0, sendMsg.length, e2.port, e2.ip, 
                                    function(err) {
                                        if (err) {
                                            console.log('메세지 전송 실패');
                                            return;
                                        }
                                    }
                                )
                        } else if (mHP < 0) {
                            if(MPxp > 100) // 최대 체력보다 작을 경우 몬스터를 리스폰 처리와 레벨 업 처리를 한다.
                            {  
                                e2.lv++
                                e2.pExp = 0
                                //레벨업 시켜준다.
                                let message = JSON.stringify({ cmd: "Lv", nick: e2.nick, pExp: e2.pExp, lv: e2.lv })
                                let sendMsg = JSON.stringify({ Buffer: message.length, cmd: "Lv", nick: e2.nick,pExp: e2.pExp, lv: e2.lv })
                                socket.send(sendMsg, 0, sendMsg.length, e2.port, e2.ip, 
                                    function(err) {
                                        if (err) {
                                            console.log('메세지 전송 실패');
                                            return;
                                        }
                                    }
                                )
                            }
                            else{
                                //참여자 배열에 업데이트 해준다. 
                                e2.pExp = MPxp
                                let message = JSON.stringify({cmd: "Lv", nick: e2.nick, pExp: e2.pExp, lv: e2.lv })
                                let sendMsg = JSON.stringify({Buffer: message.length, cmd: "Lv", nick: e2.nick,pExp: e2.pExp, lv: e2.lv})
                                socket.send(sendMsg, 0, sendMsg.length, e2.port, e2.ip, 
                                    function(err) {
                                        if (err) {
                                            console.log('메세지 전송 실패');
                                            return;
                                        }
                                    }
                                )
                            }
                        }
                    }
                })
            }
        })
    }
});
