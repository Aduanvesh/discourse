exports.messageHandler = (msg) => {
    if (msg.content.toLocaleLowerCase() === 'lenny') {
        msg.delete();
        msg.channel.send('( ͡° ͜ʖ ͡°)     *- ' + msg.author.username + '*');
    } else if (msg.content.toLocaleLowerCase() === 'screwu'){
        msg.delete();
        msg.channel.send('凸( •̀_•́ )凸     *- ' + msg.author.username + '*');
    }
}