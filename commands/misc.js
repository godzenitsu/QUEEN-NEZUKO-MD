const {tlang, getAdmin, prefix, Config, sck,sck1, fetchJson,getBuffer, runtime,cmd } = require('../lib')
 let { dBinary, eBinary } = require("../lib/binary");
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter");
 const fs = require('fs')
 const axios = require('axios')
 const fetch = require("node-fetch");
  //---------------------------------------------------------------------------
 cmd({
    pattern: "welcome",
    alias:["setwelcome"],
    desc: "sets welcome message in specific group.",
    category: "misc",
 filename: __filename
},
async(Void, citel, text,{ isCreator }) => {

        let grp =citel.chat;
        if (!citel.isGroup) return citel.reply(tlang().group);
        const groupAdmins = await getAdmin(Void, citel)	
        const isAdmins = groupAdmins.includes(citel.sender) 
        if (!isAdmins && !isCreator) return citel.reply(tlang().admin);
 
      let Group = await sck.findOne({ id: citel.chat });
      if (!text)  {  return await citel.reply ("*Wellcome Message :* "+Group.welcome)  }
      await await sck.updateOne({ id: citel.chat }, { welcome:text ,events:'true'})
      let metadata = await Void.groupMetadata(citel.chat);
      var ppuser;
      let num = citel.sender;
  
      var welcome_messages = text.replace(/@pp/g, '').replace(/@user/gi, `@${num.split("@")[0]}`).replace(/@gname/gi, metadata.subject).replace(/@desc/gi, metadata.desc);
      try {  ppuser = await Void.profilePictureUrl(num, 'image') }catch { ppuser = 'https://telegra.ph/file/93f1e7e8a1d7c4486df9e.jpg' ; }
      return await Void.sendMessage(citel.chat, { image: { url: ppuser }, caption: welcome_messages,} )


       /*if (!Group) {
                await new sck({ id: citel.chat, welcome: text,events:'true' }).save()
                return citel.reply('Welcome added for this group.\n *Wellcome Message :* '+text )
            } else {
                await await sck.updateOne({ id: citel.chat }, { welcome:text ,events:'true'})
                return citel.reply('Welcome updated successfully.\n *New Wellcome Message Is :* '+text)
                
            }      */
  
}
)
 //---------------------------------------------------------------------------
cmd({
    pattern: "goodbye",
    alias: ["setgoodbye","setbye"],
    desc: "sets goodbye message in specific group.",
    category: "misc",
 filename: __filename
},
async(Void, citel, text,{ isCreator }) => {

    if (!citel.isGroup) return citel.reply(tlang().group);
    const groupAdmins = await getAdmin(Void, citel)	
    const isAdmins = groupAdmins.includes(citel.sender) 
    if (!isAdmins && !isCreator) return citel.reply(tlang().admin);

    let Group = await sck.findOne({ id: citel.chat })
    if (!text)  {  return await citel.reply ("*_Goodbye Message Is:_* "+Group.goodbye)  }
    await sck.updateOne({ id: citel.chat }, { goodbye:text,events:'true' }) 
 
    let metadata = await Void.groupMetadata(citel.chat);
    var ppuser;
    let num = citel.sender;
    var goodbye_messages = text.replace(/@pp/g, '').replace(/@user/gi, `@${num.split("@")[0]}`).replace(/@gname/gi, metadata.subject).replace(/@desc/gi, metadata.desc);
    try {  ppuser = await Void.profilePictureUrl(num, 'image') }catch { ppuser = 'https://telegra.ph/file/93f1e7e8a1d7c4486df9e.jpg' ; }

        return await Void.sendMessage(citel.chat, { image: { url: ppuser }, caption: goodbye_messages, })

         /*   if (!Group) {
                await new sck({ id: citel.chat, goodbye: text,events:'true' }).save()
                return citel.reply('Goodbye added for this group.\n *New Googbye Message Is :* '+text)
            } else {
                await await sck.updateOne({ id: citel.chat }, { goodbye:text,events:'true' })
                return citel.reply('Goodbye updated successfully.\n *New GoodBye Message Is :* '+text)    
            }      
           */
})
 //---------------------------------------------------------------------------
 //---------------------------------------------------------------------------
/* cmd({
             pattern: "vv",
             alias : ['viewonce','retrive'],
             desc: "Flips given text.",
             category: "misc",
             use: '<query>',
             filename: __filename
         },
         async(Void, citel, text) => {
if(!citel.quoted) return citel.reply("```Uh Please Reply A ViewOnce Message```")
  
if(citel.quoted.mtype === "viewOnceMessage")
{
 if(citel.quoted.message.imageMessage )
{ let cap =citel.quoted.message.imageMessage.caption;
 let anu = await Void.downloadAndSaveMediaMessage(citel.quoted.message.imageMessage)
 Void.sendMessage(citel.chat,{image:{url : anu},caption : cap })
}
else if(citel.quoted.message.videoMessage )
{
  let cap =citel.quoted.message.videoMessage.caption;
  let anu = await Void.downloadAndSaveMediaMessage(citel.quoted.message.videoMessage)
  Void.sendMessage(citel.chat,{video:{url : anu},caption : cap })
}
}
else return citel.reply("```This is Not A ViewOnce Message```")
 
         }
     )



     */
 //---------------------------------------------------------------------------
 cmd({
        pattern: "quoted",
        desc: "get reply Message from Replied Message",
        category: "user",
        filename: __filename
    },
    async(Void, citel, text) => {
        if(!citel.quoted) return await citel.send("*_Uhh Dear, Reply to a Message_*")
        var quote
        try {
             quote = await Void.serializeM(await citel.getQuotedObj())
        } catch (error) {return console.log("error while geting Quoted Message : " , error )}

        if (!quote.quoted) return await citel.replay('*Message you replied does not contain a reply Message*')
        else await Void.sendMessage(citel.chat, { react: { text: '✨', key: citel.key }}); 
        try {        
            let quote2 = await Void.serializeM(await quote.getQuotedObj())
            return await Void.copyNForward(citel.chat, quote2 , false ,)
        } catch (error) 
        {       
            const contextInfo = {}
            Void.forward(citel.chat ,quote.quoted, contextInfo , citel ); 
        }
        // attp | Void.sendMessage(citel.chat, { sticker: {url: `https://api.xteam.xyz/attp?file&text=${encodeURI(text)}`}}, {quoted: citel })
    })

     //---------------------------------------------------------------------------
     cmd({
        pattern: "blocklist",
        desc: "get list of all Blocked Numbers",
        category: "user",
        filename: __filename,
        use: '<text>',
    },
    async(Void, citel, text , {isCreator}) => {
        if(!isCreator) return await citel.reply(tlang().owner);
        try {
            const data = await Void.fetchBlocklist();
            if (data.length === 0) return await citel.reply(`Uhh Dear, You don't have any Blocked Numbers.`);
            let txt = `\n*≡ List*\n\n*_Total Users:* ${data.length}_\n\n┌─⊷ \t*BLOCKED USERS*\n`;
            for (let i = 0; i < data.length; i++) {      txt += `▢ ${i + 1}:- wa.me/${data[i].split("@")[0]}\n`;    }
            txt += "└───────────";
            return await Void.sendMessage(citel.chat, { text: txt });
          } catch (err) {
            console.error(err);
            return await citel.reply('*Error while getting Blocked Numbers.\nError: *' + err);
          }
    }
    )
     //---------------------------------------------------------------------------
 cmd({
             pattern: "location",
             desc: "Adds *readmore* in given text.",
             category: "user",
             filename: __filename
         },
         async(Void, citel, text) => {
          if (!text) return await citel.reply(`Give Coordinates To Send Location\n *Example:* ${prefix}location 24.121231,55.1121221`);
         let cord1 = parseFloat(text.split(',')[0]) || ''
         let cord2 = parseFloat(text.split(',')[1]) || ''
         if(!cord1 || isNaN(cord1) ||  !cord2 || isNaN(cord2)) return await  citel.reply("```Cordinates Not In Formate, Try Again```") 

let txt  = "*----------LOCATION------------*"
   txt +="``` \n Sending Location Of Given Data: ";
   txt +="\n Latitude     :  "+cord1;
   txt +="\n Longitude  :  "+cord2 +"```\n"+Config.caption;

await citel.reply (txt);


      return await Void.sendMessage(citel.chat, { location: { degreesLatitude : cord1, degreesLongitude : cord2 } } ,{quoted : citel} )
 }
     )
     //---------------------------------------------------------------------------
 

/*

cmd({
             pattern: "exec",
             desc: "Evaluates quoted code with given language.",
             category: "misc",
             filename: __filename
         },
         async(Void, citel, text) => {
  if (!citel.quoted) return citel.reply("*Reply to A Code Of Statements to Execute*")
             try {
                 const code = {
                     script: citel.quoted.text,
                     language: text[1],
                     versionIndex: "0",
                     stdin: text.slice(2).join(" "),
                     clientId: '694805244d4f825fc02a9d6260a54a99',
                     clientSecret: '741b8b6a57446508285bb5893f106df3e20f1226fa3858a1f2aba813799d4734'
                 };
                 request({
                     url: "https://api.jdoodle.com/v1/execute",
                     method: "POST",
                     json: code
                 }, function(_error, _response, body) {  citel.reply("> " + text[1] + "\n\n" + "```" + body.output + "```");  });
             } catch (error) {return await citel.reply("*Error In Your Code :* "+error);  }
         }
     )
     */

     //---------------------------------------------------------------------------

 cmd({
        pattern: "getpp",
        desc: "Get Profile Pic For Given User",
        category: "user",
        filename: __filename
    },
    async(Void, citel, text) => {

        if (!citel.quoted) return citel.reply (`*Please Reply To A User*`)
        let pfp;
        try  { pfp = await Void.profilePictureUrl(citel.quoted.sender, "image"); } 
        catch (e) {  return citel.reply("```Profile Pic Not Fetched```") } 
        return await Void.sendMessage(citel.chat, {image: { url: pfp },caption: '  *---Profile Pic Is Here---*\n'+Config.caption, },{quoted:citel}); 


         }
     )
     //---------------------------------------------------------------------------
 cmd({
             pattern: "readmore",
             alias:["rmore",'readmor'],
             desc: "Adds *readmore* in given text.",
             category: "misc",
             filename: __filename
         },
         async(Void, citel, text) => {
            if(!text) {text = `*Uhh baby, Give Text, Eg:- _.readmor text1 readmore text2_*`; }
            else { text += " " }
            text.includes("readmore")?await citel.reply(text.replace(/readmore/, (String.fromCharCode(8206)).repeat(4001))) : await citel.reply(text.replace(" ", (String.fromCharCode(8206)).repeat(4001)))
         }
     )
  //---------------------------------------------------------------------------
cmd({
            pattern: "whois",
            desc: "Get replied person info",
            category: "user",
            use: '<reply to any person>',
            filename: __filename
        },
async(Void, citel, text) => {
            if (!citel.quoted) return citel.reply(`baby,Please Reply To A Person`);
            var bio = await Void.fetchStatus(citel.quoted.sender);
            var bioo = bio.status;
            var setAt = bio.setAt.toString();
            
            var words = setAt.split(" ");
            if(words.length > 3){ setAt= words.slice(0, 5).join(' ') ; }
             
            var num = citel.quoted.sender.split('@')[0];
            let pfp;
            try  {  pfp = await Void.profilePictureUrl(citel.quoted.sender, "image"); } 
            catch (e) { pfp = await Void.profilePictureUrl(citel.sender, "image") ||  'https://graph.org/file/8e9ce5f751dafdadf3ba0.jpg' ; }    //|| 'https://graph.org/file/8e9ce5f751dafdadf3ba0.jpg' ;  }
            
            let username = await sck1.findOne({ id: citel.quoted.sender });
            var tname = username.name;

            
         return await Void.sendMessage(citel.chat, {
                image: {   url: pfp  },
                caption: `
╔════◇
║ *『Person's  Information』*
║ 
║ *🍫Name :* ${tname}
║ *👤Num :* ${num}
║ *🎐Bio    :*  ${bioo}
║ *🌟SetAt :* ${setAt}
║    *Keep Calm Dude🥳*    ◇
╚════════════════╝
`,
            },{quoted:citel});

        }
    )
     //---------------------------------------------------------------------------
 cmd({
             pattern: "vcard",
             desc: "Create Contact by given name.",
             category: "user",
             filename: __filename
         },
         async(Void, citel, text) => {

if (!citel.quoted) return citel.reply (`*Please Reply to User With Name*`);
if ( !text ) return citel.reply( `Please Give Me User Name, \n *Example : ${prefix}vcard alex tv* `)
var words = text.split(" ");
if (words.length >3) {   text= words.slice(0, 3).join(' ')  }
// citel.reply(text);

const vcard = 'BEGIN:VCARD\n' +
            'VERSION:3.0\n' +
            'FN:' + text + '\n' +
            'ORG:;\n' +
            'TEL;type=CELL;type=VOICE;waid=' + citel.quoted.sender.split('@')[0] + ':+' + owner[0] + '\n' +
            'END:VCARD'
        let buttonMessaged = {
            contacts: { displayName: text, contacts: [{ vcard }] },
            
        };
        return await Void.sendMessage(citel.chat, buttonMessaged, { quoted: citel });
 
})
     //---------------------------------------------------------------------------


 cmd({
             pattern: "calc",
             desc: "Calculate two value.",
             category: "misc",
             filename: __filename
         },
         async(Void, citel, text) => {
            
            if (!text) return await citel.reply("Please enter a mathematical operation.");
            text = text.replace(/\s+/g, '');
            if (!/^(\d+([-+%*/]\d+)+)$/.test(text)) return await  citel.reply("Please enter a valid mathematical operation.");
            const evaluate = (exp) => {  return new Function('return ' + exp)(); };
            try {
                const result = evaluate(text);
                if (text.includes('/') && text.split('/').some((num) => num === '0')) return await citel.send("*Cannot divide by zero.*");
                if (text.split(/[-+%*/]/).length <= 2) {
                    const [num1, operator, num2] = text.match(/\d+|[-+%*/]/g);
                    return citel.send(`${num1} ${operator} ${num2} = ${result}`);
                } else {  return await citel.send(`Result: ${result}`); }
            } catch (error) {  }










/*

let func  =  text.split(";")[0];
let num1  =  +text.split(";")[1];
let num2  =  +text.split(";")[2];

var c1 = num1.toString();
var c2 = num2.toString();
if(c1=="NaN" || c2 ==  "NaN") return citel.reply("*Numbers Are Not In Formate, Try Again*") 
if (!text)
{
let txt="*--------------- CALCULATOR ----------------*\n";
 txt +=" \nChoose An Operator From List  ";
 txt +="\nFor Addittion    :  add ";
 txt +="\nFor Subtraction :  sub";
 txt +="\nFor  Multiply     :  mul";
 txt +="\nFor division       :  div";
 txt += `\n\n  Likewise :  ${prefix}calc add;10;50`;   
  return citel.reply(txt)
}
else if (func == "add" )  {  let result = num1+num2;
return citel.reply (`${num1} + ${ num2}  = ${result}` );
}
else if (func == "sub" ) { let result = num1-num2;
return citel.reply (`${num1} - ${ num2}  = ${result}` );
}
else if (func == "mul" ) { let result = num1*num2;
return citel.reply (`${num1} * ${ num2}  = ${result}` );
}
else if (func == "div" ) { let result = num1/num2;
return citel.reply (`${num1} / ${ num2}  = ${result}` );
}
else
 {
return citel.reply(`Give me Query Like :  ${prefix}calc add;10;50 `);
}
 */
         }
     )


     //---------------------------------------------------------------------------
 cmd({
             pattern: "take",
             desc: "Makes sticker of replied image/video.",
             category: "sticker",
             filename: __filename
         },
         async(Void, citel, text) => {
             if (!citel.quoted) return citel.reply(`*Reply to a Sticker Sir.*`);
             let mime = citel.quoted.mtype
             if ( mime !="stickerMessage") return await citel.reply("```Uhh Please, Reply To A Sticker```") 
             var pack;
             var author;
             if (text) {
                let anu = text.split("|");
                 pack = anu[0] !== "" ? anu[0] : citel.pushName + '♥️';
                 author = anu[1] !== "" ? anu[1] : Config.packname;
             } else {
                 pack = citel.pushName;
                 author =Config.packname;
             }
                 let media = await citel.quoted.download();
                let sticker = new Sticker(media, {
                    pack: pack,
                    author: author,
                    type:  StickerTypes.FULL,
                    categories: ["🤩", "🎉"], 
                    id: "12345", 
                    quality: 100,
                    background: "transparent", 
                });
                const buffer = await sticker.toBuffer();
                return Void.sendMessage(citel.chat, {sticker: buffer }, {quoted: citel });
         }
     )
     //---------------------------------------------------------------------------
 cmd({
