const fs = require('fs');
const { MessageActionRow, MessageButton } = require('discord.js');
let path = 'C:/Users/Adarsh/Documents/Test/ScraperBot/Save.json'
let read = fs.readFileSync(path);
let save = JSON.parse(read);

const pokemonInfo = require('./EmojikonList');

const space = '▪️▪️▪️▪️';
/**
 *  !poke - Currently evolves 2 pokemon as a test.
 *  !list
 */
exports.handler = (message, prefix) => {
    if (message.content.startsWith(`${prefix}poke`)) {
        evolve(message, 1, 2);
    }
    else if (message.content.startsWith(`${prefix}listpoke`)) {
        list(message);
    }
    else if (message.content.startsWith(`${prefix}starter`)) {
        starter(message);
    }
    else if (message.content.startsWith(`${prefix}catch`)) {
        catchPokemon();
    }
}

const catchPokemon = () => {
    console.log('tryna catch poke');
}

const evolve = (message, id1, id2) => {
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


/**
 * Lists the players pokemon using their player ID and the save file.
 * @param {Object} msg discord message object
 */
const list = (msg) => {
    let playerId = msg.author.id;
    let player = getPlayerInfo(playerId)
    if (player) {
        let playerPokemon = player.pokemon
        for (let i = 0; i < playerPokemon.length; i++)
            msg.channel.send(`Name: ${pokemonInfo[playerPokemon[i].id].name} \nLevel: ${playerPokemon[i].level} \nXP to next level: ${100 - playerPokemon[i].xp}`);
    } else msg.channel.send(`Player save not found`);

}

const getPlayerInfo = (id) => {
    console.log(save, save[id]);
    return save[id];
}

const starter = (msg) => {
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

const saveFile = () => {
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

const levelUp = (playerid, index, msg) => {
    let { xp, level, id } = save[playerid].pokemon[index];
    xp += 50;
    if (xp >= 100) {
        let { name, id: pokemonId, evolve: pokemonEvolve, evolveLvl } = pokemonInfo[id];
        xp = 0;
        level += 1;
        msg.channel.send(`${name} has levelled up to ${level}`);
        if (level >= evolveLvl) {
            evolve(msg, pokemonId, pokemonEvolve);
            id = pokemonEvolve;
            save[playerid].spriteCheck[index] = pokemonInfo[id].sprite;
        }
    }
    save[playerid].pokemon[index] = { ...save[playerid].pokemon[index], xp, level, id }
    saveFile();
}