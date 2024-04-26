/**

 Copyright (C) 2022.

 Licensed under the  GPL-3.0 License;

 You may not use this file except in compliance with the License.

 It is supplied in the hope that it may be useful.

 * @project_name :!!!!!

 * @author :!!!! <https://github.com/godzenitsu>

 * @description : nezuko,A Multi-functional whatsapp bot.

 * @version 0.0.6

 **/



const { tlang, botpic, cmd, prefix, runtime, Config , sleep } = require('../lib')

const axios = require('axios')

const speed = require('performance-now')

const fetch = require('node-fetch');





const PastebinAPI = require("pastebin-js");

pastebin = new PastebinAPI("EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL");

cmd({

        pattern: "pastebin",

        desc: "To check ping",

        category: "extra",

        filename: __filename,

    },

    async(Void, citel) => {

        if(!citel.quoted) return citel.reply('Please quote any text to get link.')

        let data = await pastebin.createPaste(citel.quoted.text, "Secktor-Pastebin")

        citel.reply('_Here is your link._\n'+data)

    }

);





//---------------------------------------------------------------------------

cmd({

    pattern: "chat",

    alias :['gpt'],

    desc: "chat with an AI(GPT)",

    category: "AI",

    use: '<Hii,nezuko>',

    filename: __filename,

},

async(Void, citel,text) => {

    let zx = text.length;

    if (zx < 8) {

        let {data} = await axios.get(`http://api.brainshop.ai/get?bid=167991&key=aozpOoNOy3dfLgmB&uid=[${citel.sender.split("@")[0]}]&msg=[${text}]`);

        return citel.reply(data.cnt);  

    }

    if (!text) return citel.reply(`Hey there! ${citel.pushName}. How are you doing these days?`);

    // const { Configuration, OpenAIApi } = require("openai");

    // const configuration = new Configuration({

    //     apiKey: Config.OPENAI_API_KEY || "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",

    // });

    // const openai = new OpenAIApi(configuration);

    // const completion = await openai.createCompletion({

    //     model: "text-davinci-002",

    //     prompt: text,

    //     temperature: 0.5,

    //     max_tokens: 80,

    //     top_p: 1.0,

    //     frequency_penalty: 0.5,

    //     presence_penalty: 0.0,

    //     stop: ['"""'],

    // });

    // citel.reply(completion.data.choices[0].text);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {

    method: "POST",

    headers: {

      "Content-Type": "application/json",

      Authorization: `Bearer ${Config.OPENAI_API_KEY}`,

    },

    body: JSON.stringify({

      model: "gpt-3.5-turbo", 

      messages: [{ role: "system", content: "You" }, { role: "user", content: text }],

    }),

  });



  const data = await response.json();

  console.log("GPT REPONCE : ",data); 

  if (!data.choices || data.choices.length === 0) {citel.reply("*Invalid ChatGPT API Key, Please Put New Key*"); }

  return await  citel.reply(data.choices[0].message.content)

	

}

)



cmd({

    pattern: "dalle",

    alias : ['dall','dall-e'],

    desc: "Create Image by AI",

    category: "AI",

    use: '<an astronaut in mud.>',

    filename: __filename,

},

async(Void, citel,text,{isCreator}) => 

{

//if (!isCreator) return citel.reply(tlang().owner)

if (Config.OPENAI_API_KEY=='') return citel.reply('You Dont Have OPENAI_API_KEY \nPlease Create OPEN API KEY from Given Link \nhttps://platform.openai.com/account/api-keys');

if (!text) return citel.reply(`*Give Me A Query To Get Dall-E Reponce ?*`); 

const imageSize = '256x256'

const apiUrl = 'https://api.openai.com/v1/images/generations';

const response = await fetch(apiUrl, {

method: 'POST',

headers: {

  'Content-Type': 'application/json',

  'Authorization': `Bearer ${Config.OPENAI_API_KEY}`

},

body: JSON.stringify({

  model: 'image-alpha-001',

  prompt: text,

  size: imageSize ,

  response_format: 'url'

})

});



const data = await response.json();

let buttonMessage = {

    image:{url:data.data[0].url},

    caption : '*---Your DALL-E Result---*'



}



Void.sendMessage(citel.chat,{image:{url:data.data[0].url}})

}

)



//---------------------------------------------------------------------------

cmd({

        pattern: "repo",

        alias: ["git", "sc", "script"],

        desc: "Sends info about repo.",

        category: "general",

        filename: __filename,

    },

    async(Void, citel) => {

        let { data } = await axios.get('https://api.github.com/repos/Bladeh4x/BLADE-MD')

        let cap = `Hey ${citel.pushName}\n

*⭐ Total Stars:* ${data.stargazers_count} stars

*🍽️ Forks:* ${data.forks_count} forks

*🍁 Repo:* https://github.com/godzenitsu/QUEEN-NEZUKO-MD

*Group:* https://chat.whatsapp.com/D8fCfh8kSC0EDRHeMCrIDy

*public grp:* https://chat.whatsapp.com/D8fCfh8kSC0EDRHeMCrIDy

*scan Qr:* visit bot repo

*for help:* https://wa.me/917907387121

*Deploy Your Own:*-visit bot repo`

        let buttonMessaged = {

            image: { url: await botpic() },

            caption: cap,

            footer: tlang().footer,

            headerType: 4,

            contextInfo: {

                externalAdReply: {

                    title: "Nezuko-Repo",

                    body: "Easy to Use",

                    thumbnail: log0,

                    mediaType: 4,

                    mediaUrl: '',

                    sourceUrl: ``,

                },

            },

        };

        return await Void.sendMessage(citel.chat, buttonMessaged, {

            quoted: citel,

        });



    }

)

//---------------------------------------------------------------------------

cmd({

        pattern: "status",

        alias: ["about"],

        desc: "To check bot status",

        category: "general",

        filename: __filename,

    },

    async(Void, citel) => {

        const uptime = process.uptime();

        timestampe = speed();

        latensie = speed() - timestampe;

        let ter = `

🔰 *${tlang().title}* 🔰

*🌟Description:* A WhatsApp bot with rich features, build in NodeJs to make your WhatsApp enjoyable.

*⚡Speed:* ${latensie.toFixed(4)} ms

*🚦Uptime:* ${runtime(process.uptime())}

*🕸Version:* 0.0.7

*👤Owner:*  ${Config.ownername}

*𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐍𝐞𝐳𝐮𝐤𝐨*

`;

        let buttonMessaged = {

            image: {

                url: await botpic(),

            },

            caption: ter,

            footer: tlang().footer,

            headerType: 4,

            contextInfo: {

                externalAdReply: {

                    title: tlang().title,

                    body: `Bot-Status`,

                    thumbnail: log0,

                    mediaType: 2,

                    mediaUrl: ``,

                    sourceUrl: ``,

                },

            },

        };

        return await Void.sendMessage(citel.chat, buttonMessaged, {

            quoted: citel,

        });



    }

)



//---------------------------------------------------------------------------

cmd({

    pattern: "theme",

    desc: "To find all themes",

    category: "general",

    filename: __filename,

},

async(Void, citel,text,{isCreator}) => {



if(!isCreator) return citel.reply(tlang().owner);

let str="*All available themes in ɴᴇᴢᴜᴋᴏ-ᴍᴅ*"

str+=`  \n1. GOJO\n2. RENGOKU\n3. NEZUKO\n4.n\n these are the themes of ʙʟᴀᴅᴇ-ᴍᴅ Userbot.\_Reply ${prefix}setvar THEME:NEZUKO`

return citel.reply(str)

    

}

)
