const { MessageActionRow, MessageButton } = require('discord.js');

let result = [];

exports.handler = (message, prefix) => {
    if (message.content.startsWith(`${prefix}rps`)) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('rock')
                    .setEmoji('🪨')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('paper')
                    .setEmoji('🧻')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('scissors')
                    .setEmoji('✂️')
                    .setStyle('PRIMARY'),
            );
        message.channel.send({ content: 'Choose wisely...', components: [row] });
    }
}

exports.buttonHandler = (i) => {
    if (result.length < 2 && checkArray(i.member.user.id)) {
        result.push({
            id: i.member.user.id,
            username: i.member.user.username,
            selection: i.customId
        });
        i.channel.send(`${i.member.user.username} locked in`);
    }
    if (result.length === 2) {
        let final = compareResults();
        console.log('final:', final);
        if (final) i.channel.send(`<@${final.id}> is the winner!`);
        else i.channel.send('It is a draw');
        console.log(result);
        result = [];
    }
}

checkArray = (id) => {
    for (let i = 0; i < result.length; i++) {
        if (result[i].id === id) return false;
    }
    return true;
}

compareResults = () => {
    console.log(result[0].selection, result[1].selection);
    switch (result[0].selection) {
        case 'scissors':
            switch (result[1].selection) {
                case 'scissors':
                    return undefined;
                case 'paper':
                    return result[0]
                case 'rock':
                    return result[1]
            }
        case 'paper':
            switch (result[1].selection) {
                case 'scissors':
                    return result[1]
                case 'paper':
                    return undefined;
                case 'rock':
                    return result[0]
            }
        case 'rock':
            switch (result[1].selection) {
                case 'scissors':
                    return result[0]
                case 'paper':
                    return result[1]
                case 'rock':
                    return undefined;
            }
    }
}