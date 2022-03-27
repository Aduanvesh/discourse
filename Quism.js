var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var stringSimilarity = require('string-similarity');

let url = 'https://www.triviawell.com/questions/general';
let questions = [];

exports.quizQuestions = () => {
    return new Promise((resolve, reject) => {
        request(url, function (error, response, body) {
            if (error) {
                console.log("Error: " + error);
            }
            console.log("Status code: " + response.statusCode);  // Check status code (200 is HTTP OK)
            if (response.statusCode === 200) {

                var $ = cheerio.load(body); // Parse the document body
                let bodyText = $('div.text-medium').text();
                let answerText = $('div.text');
                let questionText = bodyText.split('?');

                for (let i = 0; i < answerText.length; i++) {
                    questions.push({ question: questionText[i], answer: answerText[i].children[0].data });
                }
                console.log(questions);
                resolve('done');
            }
        })
    });
}

exports.checkAnswer = (msg, id) => {
    return new Promise((resolve, reject) => {
        console.log(msg, questions[id].answer);
        if (msg.content === 'skip' || msg.content === 'exit'){
            resolve(msg.content);
        } else if (stringSimilarity.compareTwoStrings(msg.content.toLowerCase(), questions[id].answer.toLowerCase()) > 0.75) {
            resolve('correct');
        } else if (msg.content.toLowerCase().includes(questions[id].answer.toLowerCase()) || questions[id].answer.toLowerCase().includes(msg.content.toLowerCase())) {
            resolve('close');
        } else {
            resolve('incorrect');
        }
    });
}

exports.nextQuestion = (id) => {
    return new Promise((resolve, reject) => {
        if (id === null || id === undefined) {
            resolve({ question: questions[0].question, id: 0 })
        } else {
            resolve({ question: questions[id].question, id: id })
        }
    });
}

exports.getAnswer = (id) => {
    return new Promise((resolve, reject) => {
        resolve(questions[id].answer)
    });
}