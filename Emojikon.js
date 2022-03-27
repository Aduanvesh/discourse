const fs = require('fs');
const { MessageActionRow, MessageButton } = require('discord.js');
let path = 'C:/Users/Adarsh/Documents/Test/ScraperBot/Save.json'
let read = fs.readFileSync(path);
let save = JSON.parse(read);

const pokemonInfo = require('./EmojikonList');

const space = '▪️▪️▪️▪️';

exports.handler = (message, prefix) => {
    if (message.content.startsWith(`${prefix}poke`)) {
        evolve(message, 1, 2);
    }
    if (message.content.startsWith(`${prefix}listpoke`)) {
        list(message);
    }
    if (message.content.startsWith(`${prefix}starter`)) {
        starter(message);
    }
}

evolve = (message, id1, id2) => {
    console.log(id1, id2);
    const og = pokemonInfo[id1].sprite;
    const newg = pokemonInfo[id2].sprite;
    let currentog = true;
    message.channel.send(`${space}${og} \n what? your **${pokemonInfo[id1].name}** is evolving`).then((msg) => {
        currentog = false;
        msg.edit(`${space}${og} \n what? your **${pokemonInfo[id1].name}** is evolving`);
        setTimeout(function () {
            for (let i = 1; i < 5; i++) {
                msg.edit(`${space}${currentog ? newg : og} \n what? your **${pokemonInfo[id1].name}** is evolving`);
                currentog = !currentog;
                console.log(i);
            }
            msg.edit(`${space}${newg} \n Holy shit, your **${pokemonInfo[id1].name}** evolved into a **${pokemonInfo[id2].name}**`);
        }, 3000)
    })
}

list = (msg) => {
    let playerid = msg.author.id;
    let player = getPlayerInfo(playerid).pokemon
    for (let i = 0; i < player.length; i++) {
        msg.channel.send(`Name: ${pokemonInfo[player[i].id].name} \nLevel: ${player[i].level} \nXP to next level: ${100 - player[i].xp}`);
    }
}

getPlayerInfo = (id) => {
    console.log(save, save[id]);
    return save[id];
}

starter = (msg) => {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('0')
                .setEmoji('🙂')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('3')
                .setEmoji('😅')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('6')
                .setEmoji('🥵')
                .setStyle('PRIMARY'),
        );
    msg.channel.send({ content: 'Choose your starter emoji', components: [row] });
}

saveFile = () => {
    fs.writeFileSync(path, JSON.stringify(save, null, 2))
}

exports.buttonHandler = (i) => {
    let playerid = i.member.user.id;
    if (!save[playerid]) {
        save[playerid] = {
            pokemon: [{
                id: parseInt(i.customId),
                selfId: 1, //TODO
                level: 1,
                xp: 0
            }],
            spriteCheck: [pokemonInfo[parseInt(i.customId)].sprite]
        }
        i.channel.send(`${i.member.user.username}, you have selected **${pokemonInfo[parseInt(i.customId)].name}** ${pokemonInfo[parseInt(i.customId)].sprite} as your starter.`);
        console.log('saved:', save);
        saveFile()
    } else {
        i.channel.send(`${i.member.user.username}, you have already chosen a starter.`);
    }
}

exports.emojiHandler = (msg) => {
    let playerid = msg.author.id;
    if (save[playerid]) {
        if (save[playerid].spriteCheck.includes(msg.content)) {
            console.log('pog');
            levelUp(playerid, save[playerid].spriteCheck.indexOf(msg.content), msg);
            msg.react('⬆️');
        }
    }
}

levelUp = (playerid, index, msg) => {
    save[playerid].pokemon[index].xp += 50;
    if (save[playerid].pokemon[index].xp >= 100) {
        save[playerid].pokemon[index].xp = 0;
        save[playerid].pokemon[index].level += 1;
        saveFile();
        msg.channel.send(`${pokemonInfo[save[playerid].pokemon[index].id].name} has levelled up to ${save[playerid].pokemon[index].level}`);
        if (save[playerid].pokemon[index].level >= pokemonInfo[save[playerid].pokemon[index].id].evolveLvl) {
            evolve(msg, pokemonInfo[save[playerid].pokemon[index].id].id, pokemonInfo[save[playerid].pokemon[index].id].evolve);
            save[playerid].pokemon[index].id = pokemonInfo[save[playerid].pokemon[index].id].evolve;
            save[playerid].spriteCheck[index] = pokemonInfo[save[playerid].pokemon[index].id].sprite;
            saveFile();
        }
    }
}