//require('dotenv').config(); //initialize dotenv
const { Client, Intents } = require('discord.js');
var auth = require('./auth.json');
var logger = require('winston');
const Lyrik = require('./Lyrik.js');
const Quism = require('./Quism.js');
const Trollin = require('./Trollin.js');
const Ascii = require('./Ascii.js');
const Reminda = require('./Reminda.js');
const Pacman = require('./Pacman.js');
const Volcano = require('./Volcano.js');
const Emojikon = require('./Emojikon.js');
//const Musik = require('./Musik.js');
const { not } = require('cheerio/lib/api/traversing');

let mode = 0;
let data = { id: 0 };
let check = undefined;



// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

// Initialize Discord Bot
var bot = new Client({
    //token: auth.token,
    autorun: true,
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS]
});

bot.on('ready', () => {
    console.log('BonoboT is up and running!');
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('messageCreate', function (msg) {
    if (mode === 0) {
        if (msg.content === 'Songtime') {
            mode = 1;
            Trollin.writeReact(msg, '🎵', 1);
        } else if (msg.content === 'Quiztime') {
            mode = 2;
            Trollin.writeReact(msg, '🤓', 1);
        } else if (msg.content === 'Pacman') {
            mode = 4;
            Trollin.writeReact(msg, '🎮', 1);
            Pacman.Start(msg);
        } else if (msg.content === 'Checkme') {
            Trollin.writeReact(msg, '🤓', 1);
        }
        else if (msg.content.toLowerCase() === 'so long gay bowser') {
            msg.channel.send('https://tenor.com/view/the-simpsons-crying-robot-robot-explosion-melting-head-gif-3722753').then((result) => {
                process.exit()
            });
        } else {
            Trollin.messageHandler(msg);
            Ascii.messageHandler(msg);
            Reminda.messageHandler(msg);
        }
    } else if (mode === 1) {
        Lyrik.question(msg.content).then((result) => {
            msg.channel.send(result);
            mode = 0;
        })
    } else if (mode === 2) {
        Quism.quizQuestions().then((result) => {
            console.log(result);
            Quism.nextQuestion((data.id)).then((result) => {
                msg.channel.send(result.question + '???');
                data.id = result.id;
                mode = 3;
            })
        })
    } else if (mode === 3) {
        if (msg.author.id !== bot.user.id) {
            Quism.checkAnswer(msg, data.id).then((result) => {
                if (result === 'correct') {
                    msg.reply('YOU ARE CORRECT');
                    data.id++;
                    mode = 2;
                } else if (result === 'close') {
                    msg.reply('Close...');
                } else if (result === 'skip') {
                    Quism.getAnswer(data.id).then((result) => {
                        data.id++;
                        msg.reply('The answer was ' + result);
                        mode = 2;
                    })
                } else if (result === 'exit') {
                    msg.reply('Quiz ya later');
                    mode = 0;
                } else {
                    msg.reply('Wrong');
                }
            })
        }
    } else if (mode === 4) {

    }
});

bot.on('message', async message => {
    if (message.author.bot) return;
    let prefix = '!';
    if (message.content.startsWith(prefix)) {
        Volcano.handler(message, prefix)
        Emojikon.handler(message, prefix);
    } else if (message.content.length === 2) {
        Emojikon.emojiHandler(message);
    } else {
        console.log(message.content.length);
    }
    //Musik.handler(message, prefix);
})



bot.on('interactionCreate', interaction => {
    if (!interaction.isButton()) return;
    /*const filter = interaction;

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
        if (i.customId === 'rock') {
            console.log('eureka');
            //await i.update({ content: 'A button was clicked!', components: [] });
        }
    });*/
    if (interaction.customId === 'rock' || interaction.customId === 'paper' || interaction.customId === 'scissors') Volcano.buttonHandler(interaction) 
    else Emojikon.buttonHandler(interaction);
    return interaction.deferUpdate();
});


bot.login(auth.client_token);