const letters = {
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
const messageQueries = [
  {
    msg: "joku",
    reply: "godamnit marcus",
  },
  {
    msg: "asol",
    reply: "a sol does not suck as much now lol",
  },
  {
    msg: "fk u",
    reply: "no Fuk u",
  },
  {
    msg: "i'm alive",
    reply: "Inferior bot",
  },
];

exports.messageHandler = (msg) => {
  for (let i = 0; i < messageQueries.length; i++) {
    if (msg.content.toLocaleLowerCase().includes(messageQueries[i].msg)) {
      msg.reply(messageQueries[i].reply);
      break;
    }
  }

  if (msg.content.toLowerCase() === "open sesame") {
    writeReact(msg, "openizg");
  } else if (msg.content.toLowerCase() === "dick" || msg.content.toLowerCase() === "cock") {
    msg.channel.send("n balls");
  } else if (msg.content.toLowerCase() === "ligma" || msg.content.toLowerCase() === "sugma") {
    msg.channel.send("balls");
  } else if (msg.content === "I'm back bitches!") {
    //msg.reply('piss off wanker');
    writeReact(msg, "penis");
  } else if (msg.content.toLocaleLowerCase().includes("liberal")) {
    msg.channel.send("getting political, are we?");
  } else if (msg.content.toLocaleLowerCase().includes("dog") && msg.content.toLocaleLowerCase().includes("doin")) {
    msg.reply("https://www.youtube.com/watch?v=D9E0GYOl38U");
  } else if (msg.content.toLowerCase() === "joe") {
    msg.channel.send("mama");
  } else if (msg.content.toLowerCase() === "deez") {
    msg.channel.send("nutz");
  } else if (msg.content.toLowerCase() === "scammed") {
    msg.reply("business is booming");
  } else if (msg.content.toLowerCase().includes("steve jobs") && msg.content.toLowerCase().includes("ligma")) {
    msg.reply("Who the hell is steve jobs?");
    previous = 1;
  } else if (msg.content.toLowerCase().includes("ligma balls") && previous === 1) {
    msg.channel.send("https://tenor.com/view/dr-manhattan-manhattan-disintegrated-rorschach-watchman-gif-18353996");
    previous = 0;
  } else if (msg.content.toLowerCase().includes("lua")) {
    msg.reply("hot garbage");
  } else if (msg.content.toLowerCase().includes("idiot")) {
    msg.reply("absolut monke");
  } else if (msg.content.toLowerCase().includes("69")) {
    msg.channel.send("nice");
  } else if (msg.content.toLowerCase().includes("bot") && msg.content.toLowerCase().includes("sucks")) {
    msg.reply("not as much as your mum");
  } else if (msg.content.toLowerCase().includes("dude")) {
    msg.channel.send("https://tenor.com/view/cat-typing-typing-on-computer-computer-work-laptop-gif-21481919");
  } else if (msg.content.toLowerCase().includes("monke see")) {
    msg.reply("MONKE DO .... SIKE");
  } else if (msg.content.toLowerCase().includes("i'm alive")) {
    msg.reply("Inferior bot");
  }
};

const writeReact = (msg, word, type) => {
  if (!type) {
    for (let i = 0; i < word.length; i++) {
      msg.react(letters[word[i]]);
    }
  } else if (type === 1) {
    msg.react(word);
  }
};
exports.writeReact = writeReact;
