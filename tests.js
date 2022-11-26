
const {fetch} = require("node-fetch")
let test = {
    lol: 'test'
}

console.log(test);

exports.testFunction = async () => {
    const url = 'https://httpbin.org/post';
    const body = JSON.stringify({ test });
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length
        },
        body: body
    };
    let response = await fetch(url, options);
    console.log('Got response from receipt callback url:', response);
}

this.testFunction();