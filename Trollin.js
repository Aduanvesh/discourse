let letters = {
    a: "🇦",
    b: "🇧",
    c: "🇨",
    d: "🇩",
    e: "🇪",
    f: "🇫",
    g: "🇬",
    h: "🇭",
    i: "🇮",
    j: "🇯",
    k: "🇰",
    l: "🇱",
    m: "🇲",
    n: "🇳",
    o: "🇴",
    p: "🇵",
    q: "🇶",
    r: "🇷",
    s: "🇸",
    t: "🇹",
    u: "🇺",
    v: "🇻",
    w: "🇼",
    x: "🇽",
    y: "🇾",
    z: "🇿",
};
let previous = 0;


exports.messageHandler = (msg) => {
    if (msg.content.toLocaleLowerCase().includes('joku')) {
        msg.reply('godamnit marcus');
    } else if (msg.content.toLowerCase() === 'Open sesame') {
        writeReact(msg, 'openizg');
    } else if (msg.content.toLowerCase() === 'dick' || msg.content.toLowerCase() === 'cock') {
        msg.channel.send('n balls');
    } else if (msg.content.toLowerCase() === 'ligma' || msg.content.toLowerCase() === 'sugma') {
        msg.channel.send('balls');
    } else if (msg.content === "I'm back bitches!") {
        //msg.reply('piss off wanker');
        writeReact(msg, 'penis');
    } else if (msg.content.toLocaleLowerCase().includes('liberal')) {
        msg.channel.send('getting political, are we?');
    } else if (msg.content.toLocaleLowerCase().includes('dog') && msg.content.toLocaleLowerCase().includes('doin')) {
        msg.reply('https://www.youtube.com/watch?v=D9E0GYOl38U');
    } else if (msg.content.toLocaleLowerCase().includes('asol')) {
        msg.reply('a sol sucks');
    } else if (msg.content.toLocaleLowerCase().includes('yasuo')) {
        msg.reply('yo but the 1/10 powerspike tho');
    } else if (msg.content.toLocaleLowerCase().includes('fk u')) {
        msg.reply('no Fuk u');
    } else if (msg.content.toLowerCase() === 'joe') {
        msg.channel.send('mama');
    } else if (msg.content.toLowerCase() === 'deez') {
        msg.channel.send('nutz');
    } else if (msg.content.toLowerCase() === 'scammed') {
        msg.reply('business is booming');
    } else if (msg.content.toLowerCase().includes('steve jobs') && msg.content.toLowerCase().includes('ligma')) {
        msg.reply('Who the hell is steve jobs?');
        previous = 1;
    } else if (msg.content.toLowerCase().includes('ligma balls') && previous === 1) {
        msg.channel.send('https://tenor.com/view/dr-manhattan-manhattan-disintegrated-rorschach-watchman-gif-18353996');
        previous = 0;
    } else if (msg.content.toLowerCase().includes('lua')) {
        msg.reply('hot garbage');
    } else if (msg.content.toLowerCase().includes('idiot')) {
        msg.reply('absolut monke');
    } else if (msg.content.toLowerCase().includes('69')) {
        msg.channel.send('nice');
    } else if (msg.content.toLowerCase().includes('bot') && msg.content.toLowerCase().includes('sucks')) {
        msg.reply('not as much as your mum');
    } else if (msg.content.toLowerCase().includes('dude')) {
        msg.channel.send('https://tenor.com/view/cat-typing-typing-on-computer-computer-work-laptop-gif-21481919');
    } else if (msg.content.toLowerCase().includes('monke See')){
        msg.reply('MONKE DO .... SIKE');
    }
}

writeReact = (msg, word, type) => {
    if (!type) {
        for (let i = 0; i < word.length; i++) {
            msg.react(letters[word[i]]);
        }
    } else if (type === 1) {
        msg.react(word);
    }
}
exports.writeReact = writeReact;