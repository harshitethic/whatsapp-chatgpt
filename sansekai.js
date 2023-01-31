const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@adiwajshing/baileys')
const fs = require('fs')
const util = require('util')
const chalk = require('chalk')
const { Configuration, OpenAIApi } = require("openai")
let setting = require('./accesser.json')

module.exports = sansekai = async (client, m, chatUpdate, store) => {
    try {
        // Extract text from different message types
        var body = (m.mtype === 'conversation') ? m.message.conversation : 
          (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : 
          (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : 
          (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : 
          (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : 
          (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : 
          (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : 
          (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || 
            m.message.listResponseMessage?.singleSelectReply.selectedRowId || 
            m.text) : ''
        var budy = (typeof m.text == 'string' ? m.text : '')
        // Check if the message starts with a prefix and assign it to `prefix`
        var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
        const isCmd2 = body.startsWith(prefix)
        // Get the first word of the message, which is the command
        const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        // Get the rest of the message as arguments
        const args = body.trim().split(/ +/).slice(1)
        // Get the name of the sender
        const pushname = m.pushName || "No Name"
        // Get the bot's phone number
        const botNumber = await client.decodeJid(client.user.id)
        // Check if the sender is the bot
        const itsMe = m.sender == botNumber ? true : false
        let text = q = args.join(" ")
        // Get a substring of the text that starts from the first space
        const arg = budy.trim().substring(budy.indexOf(' ') + 1 )
        // Get another substring that starts from the second space
        const arg1 = arg.trim().substring(arg.indexOf(' ') + 1 )

        // Get the chat and reply variables
const from = m.chat
const reply = m.reply
const sender = m.sender
const mek = chatUpdate.messages[0]

const color = (text, color) => {
    // Returns text with specified color using the chalk library
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

// Get group metadata if the message is in a group
const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(e => {}) : ''
const groupName = m.isGroup ? groupMetadata.subject : ''

// Get first 30 characters of the message, or the entire message if it's shorter than 30 characters
let argsLog = (budy.length > 30) ? `${q.substring(0, 30)}...` : budy

// Check if the autoAI setting is true
if (setting.autoAI) {
    // Log message to the console and send a read receipt if the message is not from a group chat
    if (argsLog && !m.isGroup) {
        // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
        console.log(chalk.black(chalk.bgWhite('[ LOGS ]')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace('@s.whatsapp.net', '')} ]`))
    } else if (argsLog && m.isGroup) {
        // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
        console.log(chalk.black(chalk.bgWhite('[ LOGS ]')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace('@s.whatsapp.net', '')} ]`), chalk.blueBright('IN'), chalk.green(groupName))
    }
} else if (!setting.autoAI) {
    // Log message to the console if isCmd2 is true and the message is not from a group chat
    if (isCmd2 && !m.isGroup) {
        console.log(chalk.black(chalk.bgWhite('[ LOGS ]')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace('@s.whatsapp.net', '')} ]`))
    } else if (isCmd2 && m.isGroup) {
        console.log(chalk.black(chalk.bgWhite('[ LOGS ]')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace('@s.whatsapp.net', '')} ]`), chalk.blueBright('IN'), chalk.green(groupName))
    }
}

   // If the autoAI setting is set to true
if (setting.autoAI) {
    // If the buy value is truthy
    if (buy) {
        // Try to execute the following code block
        try {
            // If the apikey is not filled in, return a message to fill it in
            if (setting.keyopenai === 'ISI_APIKEY_OPENAI_DISINI') return reply('Apikey has not been filled\n\nPlease fill in the apikey first in the key.json file\n\nApikey can be made on the website: https://beta.openai.com /account/api-keys')
            
            // Create a new Configuration object with the apikey
            const configuration = new Configuration({
                apiKey: setting. keyopenai,
            });
            // Create a new OpenAIApi object with the Configuration object
            const openai = new OpenAIApi(configuration);
            
            // Send a request to the OpenAI API to generate a response to the prompt
            const response = await openai. createCompletion({
                model: "text-davinci-003",
                prompt: budy,
                temperature: 0.3,
                max_tokens: 3000,
                top_p: 1.0,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
            });
            // Reply with the generated response
            m.reply(`${response.data.choices[0].text}\n\n`)
        } catch(err) {
            // Log the error
            console. log(err)
            // Reply with an error message
            m.reply('Sorry, there seems to be an error')
        }
    }
}
    // Check if the autoAI setting is turned off
if (!setting.autoAI) {
    // Check if isCmd2 is true
    if (isCmd2) {
        // Switch statement to handle different cases of the command variable
        switch(command) { 
            // Case 'ai'
            case 'ai':
                try {
                    // Check if the API key is filled in
                    if (setting.keyopenai === 'ISI_APIKEY_OPENAI_DISINI') 
                        // If not, return a message instructing to fill in the API key
                        return reply('Api key has not been filled in\n\nPlease fill in the apikey first in the key.json file\n\nThe apikey can be created in website: https://beta.openai.com/account/api-keys')
                    // Check if text is missing
                    if (!text) 
                        // If so, return a message with usage instructions
                        return reply(`Chat dengan AI.\n\nContoh:\n${prefix}${command} Apa itu resesi`)
                    
                    // Create a Configuration object with the API key
                    const configuration = new Configuration({
                        apiKey: setting.keyopenai,
                    });
                    // Create an instance of OpenAIApi with the Configuration object
                    const openai = new OpenAIApi(configuration);
                    
                    // Make a request to the OpenAI API to generate a response to the text
                    const response = await openai.createCompletion({
                        model: "text-davinci-003",
                        prompt: text,
                        temperature: 0.3,
                        max_tokens: 3000,
                        top_p: 1.0,
                        frequency_penalty: 0.0,
                        presence_penalty: 0.0,
                    });
                    
                    // Reply with the generated response
                    m.reply(`${response.data.choices[0].text}\n\n`)
                } catch (err) {
                    // Log the error to the console
                    console.log(err)
                    // Reply with an error message
                    m.reply('Sorry, there seems to be an error')
                }
                break
           // default case for the switch statement
default:{
  // Check if the second argument exists and is not undefined
  if (isCmd2 && budy.toLowerCase() != undefined) {
    // Check if the message ends with 'broadcast' or is from a user named 'Baileys'
    // If either condition is met, return without executing further code
    if (m.chat.endsWith('broadcast')) return
    if (m.isBaileys) return
    // Check if the lowercase version of the second argument exists
    // If it doesn't, return without executing further code
    if (!(budy.toLowerCase())) return
    // Check if the first argument is not empty or if the message is not from a group
    // If either condition is met, log an error message indicating the command is unavailable
    if (argsLog || isCmd2 && !m.isGroup) {
      console.log(chalk.black(chalk.bgRed('[ ERROR ]')), color('command', 'turquoise'), color(argsLog, 'turquoise'), color('tidak tersedia', 'turquoise'))
    // If the message is from a group, log an error message indicating the command is unavailable
    } else if (argsLog || isCmd2 && m.isGroup) {
      console.log(chalk.black(chalk.bgRed('[ ERROR ]')), color('command', 'turquoise'), color(argsLog, 'turquoise'), color('tidak tersedia', 'turquoise'))
    }
  }
}

// Catch any errors and reply with the error message
} catch (err) {
  m.reply(util.format(err))
}

// Monitor the current file for changes and reload the code if it is updated
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright(`Update ${__filename}`))
  delete require.cache[file]
  require(file)
})
