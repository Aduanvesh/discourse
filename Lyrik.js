var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var stringSimilarity = require('string-similarity');

const readline = require('readline').createInterface({ // useful only for nodejs inputs
    input: process.stdin,
    output: process.stdout
});

searchForUrl = ($, word) => {
    return new Promise((resolve, reject) => {
        var bodyText = $('html > body').text();
        var links = $("a[href^='/']");
        for (let i = 0; i < links.length; i++) {
            console.log(links[i]);
            if (i === 10) {
                let link = links[i].attribs.href;
                let attempt = 10;
                while (link.includes('artist') || !link.includes('lyrics')) {
                    attempt += 1;
                    link = links[attempt].attribs.href
                }
                resolve(link);
            }
        }
    })
}

searchForWord = ($, word) => {
    return new Promise((resolve, reject) => {
        var bodyText = $('p.mxm-lyrics__content ').text();
        //console.log(bodyText);
        let splitBody = bodyText.split('\n');
        let matches = stringSimilarity.findBestMatch(word, splitBody);
        console.log(word)
        let highest = { rating: 0, index: 0 };
        for (let i = 0; i < matches.ratings.length; i++) {
            //console.log(matches.ratings[i].target, matches.ratings[i].rating );
            //console.log(highest.rating, matches.ratings[i].rating);
            if (matches.ratings[i].rating > highest.rating) {
                highest.rating = matches.ratings[i].rating;
                if (matches.ratings[i].target && matches.ratings[i].target !== null) highest.target = matches.ratings[i].target;
                else highest.target = ' ';
                
                if (i + 1 < matches.ratings.length){
                    console.log('troll,', matches.ratings[1].target);
                    if (matches.ratings[i + 1].target !== '') highest.index = i;
                }
            }
        }
        console.log(matches.ratings[highest.index + 1].target);
        let result = matches.ratings[highest.index + 1].target;
        let similarity = stringSimilarity.compareTwoStrings(word, matches.ratings[highest.index + 1].target)
        //console.log(similarity);
        if (similarity > 0.75 && highest.index + 2 < matches.ratings.length) console.log(matches.ratings[highest.index + 2].target);
        resolve(result);
    })
}

newUrlSearch = (newUrl, query) => {
    return new Promise((resolve, reject) => {
        request(newUrl, function (error, response, body) {
            if (error) console.log("Error: " + error);
            if (response.statusCode === 200) { // Check status code (200 is HTTP OK)
                var $ = cheerio.load(body); // Parse the document body
                console.log("Page title:  " + $('title').text());
                searchForWord($, query).then((result) => {
                    resolve(result);
                });
            } else console.log("Status code: " + response.statusCode);
        });
    });
}

exports.question = (query) => {
    return new Promise((resolve, reject) => {
        let queryTwo = ''
        let domain = 'https://www.musixmatch.com';
        let lyricdomain = 'https://songsear.ch/song/Lukas-Graham/7-Years/1940571';
        for (let i = 0; i < query.length; i++) {
            if (query[i] === ' ') queryTwo += '%20'
            else queryTwo += query[i]
        };
        console.log(queryTwo);
        let url = 'https://www.musixmatch.com/search/' + queryTwo

        request(url, function (error, response, body) {
            if (error) {
                console.log("Error: " + error);
            }
            console.log("Status code: " + response.statusCode);  // Check status code (200 is HTTP OK)
            if (response.statusCode === 200) {
                
                var $ = cheerio.load(body); // Parse the document body
                searchForUrl($, queryTwo).then((result) => {
                    console.log(result);
                    console.log("Page title:  " + $('title').text());
                    newUrlSearch(domain + result, query).then((result) => {
                        resolve(result)
                    })
                });
            }
        })
    });
}

exports.betterSong = (query) => {
    return new Promise((resolve, reject) => {
        console.log(query);

        //let query = 'do you ever feel like a plastic bag'
        let queryTwo = ''
        let check = false;
        let domain = 'https://www.musixmatch.com'
        let domainSearch = 'https://songsear.ch/'

        for (let i = 0; i < query.length; i++) {
            if (query[i] === ' ') queryTwo += '%20'
            else queryTwo += query[i]
        };
        console.log(queryTwo);
        let url = 'https://songsear.ch/q/' + queryTwo

        request(url, function (error, response, body) {
            if (error) {
                console.log("Error: " + error);
            }
            // Check status code (200 is HTTP OK)
            console.log("Status code: " + response.statusCode);
            if (response.statusCode === 200) {
                // Parse the document body
                var $ = cheerio.load(body);
                searchForUrl($, queryTwo).then((result) => {
                    console.log(result);
                    console.log("Page title:  " + $('title').text());
                    resolve(result);
                    /*newUrlSearch(domain + result, query).then((result) => {
                        resolve(result)
                    })*/
                });
            }
        })
    });
}
