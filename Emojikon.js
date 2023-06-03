const fs = require('fs');
const { MessageActionRow, MessageButton } = require('discord.js');
let path = 'C:/Users/Adarsh/Documents/Test/ScraperBot/Save.json'
let read = fs.readFileSync(path);
let save = JSON.parse(read);

const pokemonInfo = require('./EmojikonList');

const space = '▪️▪️▪️▪️';
const xpGain = 50;

/**
 *  !poke - Currently evolves 2 pokemon as a test.
 *  !listpoke
 */
exports.handler = (message, prefix) => {
    try {
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
            catchPokemon(message);
        }
    } catch (e) {
        console.error(e);
    }
}

const chanceEncounter = (msg) => {
    let diceRoll = getRandomInt(1, 5);
    console.log('diceRoll', diceRoll);
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const catchPokemon = (msg, id) => {
    let playerId = msg.author.id;
    if (!id) id = 0; // For testing
    console.log('tryna catch poke');
    let count = save[playerId].pokemon.length + 1;
    save[playerId].pokemon.push({
        id: id,
        selfId: count,
        level: 1,
        xp: 0
    });
    for (let i = 0; i < save[playerId].spriteCheck.length; i++) {
        // Adds a self Id to the sprite check entry if one found for the pokemon ID.
        if (save[playerId].spriteCheck[i].id === id) {
            save[playerId].spriteCheck[i].selfIds.push(count);
            break;
        }
        // Adds a new sprite check entry if none exists for that pokemon ID.
        else if (i === save[playerId].spriteCheck.length - 1) {
            save[playerId].spriteCheck.push({
                sprite: pokemonInfo[id].sprite,
                selfIds: [count],
                id: id
            });
            break;
        }
    }


    saveFile();
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
    let playerId = i.member.user.id;
    let chosenId = parseInt(i.customId);
    let { sprite, name } = pokemonInfo[chosenId];
    if (!save[playerId]) {
        save[playerId] = {
            pokemon: [{
                id: chosenId,
                selfId: 1,
                level: 1,
                xp: 0
            }],
            spriteCheck: [{ sprite: sprite, selfIds: [1], id: chosenId }]
        }
        i.channel.send(`${i.member.user.username}, you have selected **${name}** ${sprite} as your starter.`);
        console.log('saved:', save);
        saveFile()
    } else {
        i.channel.send(`${i.member.user.username}, you have already chosen a starter.`);
    }
}

/**
 * Handles gathering XP upon an emoji being typed out
 * @param {Object} msg discord message object 
 */
exports.emojiHandler = (msg) => {
    let playerid = msg.author.id;
    if (save[playerid]) {
        for (let i = 0; i < save[playerid].spriteCheck.length; i++) {
            if (msg.content.includes(save[playerid].spriteCheck[i].sprite)) {
                console.log('pog');
                levelUp(playerid, save[playerid].spriteCheck[i].id, msg, i);
                msg.react('⬆️');
            }
        }

    }
    chanceEncounter(msg);
}

/**
 * Handles the xp gain and the levelling up of a pokemon
 * @param {string} playerid 
 * @param {number} index 
 * @param {object} msg 
 */
const levelUp = (playerid, index, msg, indexPos) => {
    let playerPokemon = save[playerid].pokemon;
    for (let i = 0; i < playerPokemon.length; i++) {
        if (playerPokemon[i].id === index) {
            let { xp, level, id } = playerPokemon[i];
            xp += xpGain; // 50
            if (xp >= 100) {
                let { name, id: pokemonId, evolve: pokemonEvolve, evolveLvl } = pokemonInfo[id];
                xp = 0;
                level += 1;
                msg.channel.send(`${name} has levelled up to ${level}`);
                if (level >= evolveLvl) {
                    evolve(msg, pokemonId, pokemonEvolve);
                    id = pokemonEvolve;
                    save[playerid].spriteCheck[indexPos] = pokemonInfo[id].sprite;// Needs fixing. currently sets the whole thing to one.
                }
            }
            save[playerid].pokemon[i] = { ...save[playerid].pokemon[i], xp, level, id }
            saveFile();
        }
    }
}