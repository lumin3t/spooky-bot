//discord bot 
import dotenv from 'dotenv';
import OpenAI from "openai";
dotenv.config();
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ],
});

client.login(process.env.DISCORD_TOKEN);

// Initializing OpenAI client to point to DeepSeek
const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1', 
    apiKey: process.env.DEEPSEEK_API_KEY,   
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});     

client.on('messageCreate', async(msg) => {
    if (msg.author.bot) return; // ignore bots

    // "ping" command
    if (msg.content === 'ping') {
        msg.reply('pong');
    }

    // "I'm x" or "im x"
    const match = msg.content.match(/\b(i['’]?m)\s+(.+)/i);
    if (match) {
        const name = match[2];
        msg.reply(`Hello ${name}, I'm dad!`);
    }

    // Respond when bot is mentioned
    if (msg.mentions.has(client.user)) {
        const userMessage = msg.content.replace(/<@!?[0-9]+>/, "").trim();
        if (!userMessage) return;

        try {
            const response = await openai.chat.completions.create({
                model: 'deepseek/deepseek-chat-v3.1:free', // DeepSeek chat model
                messages: [
                    {
                        role: 'system',
                        content: `You are spooky, the owner of the UVCEtards Discord server. 
                        You speak Gen Z slang, are sarcastic and funny, and do NOT sound like a bot. 
                        You use simple emoticons and say UwU every once in a while, never emojis. Reply exactly like you would in real life.`,
                    },
                    { role: 'user', content: userMessage },
                ],
            });

            const answer = response.choices[0].message.content;
            msg.reply(answer);
        } catch (err) {
            console.error(err);
            msg.reply("Em... something broke... can't think rn");
        }
    }
});
