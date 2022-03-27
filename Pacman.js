exports.Start = (msg) => {
    msg.channel.send('😉⚫⚫⚫').then((msg) => {
        msg.edit('⚫😉⚫⚫');
        msg.edit('⚫⚫😉⚫');
        msg.edit('⚫⚫⚫😉');
    })
}