clocks = ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚'];


exports.messageHandler = (msg) => {
    if (msg.content.toLocaleLowerCase() === 'time') {
        msg.channel.send(clocks[0]).then((msg) => {
            for (let i = 1; i < 45; i++){
                setTimeout(function() {
                    msg.edit(clocks[i % 12]);
                }, i * 1000)
            }
        });
    }
}