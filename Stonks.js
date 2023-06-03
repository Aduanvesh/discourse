const CC = require("currency-converter-lt");
var request = require("request");
var cheerio = require("cheerio");

let fromCurrency = "AUD";
let toCurrency = "JPY";

exports.handler = (message) => {
  try {
    let content = message.content.split(" ");
    for (let i = 1; i < content.length; i++) {
      let attemptedCommand = content[i];
      if (attemptedCommand === "rate") getConversionRate(message);
      else if (attemptedCommand === "list") listCurrencies(message);
      else if (attemptedCommand === "help") listHelp(message);
      else if (attemptedCommand === "history") {
        if (content[i + 1]) {
          historyAdvancedConversion(message, content[i + 1]);
          i++;
        } else message.channel.send(`advanced function requires a value`);
      } else if (attemptedCommand === "advanced") {
        if (content[i + 1]) {
          advancedConversion(message, content[i + 1]);
          i++;
        } else message.channel.send(`advanced function requires a value`);
      } else if (attemptedCommand === "convert") {
        if (content[i + 1]) {
          convertValue(message, content[i + 1]);
          i++;
        } else message.channel.send(`convert function requires a value`);
      } else if (attemptedCommand === "from")
        if (content[i + 1]) {
          switchCurrency(message, true, content[i + 1]);
          i++;
        } else message.channel.send(`from function requires a value`);
      else if (attemptedCommand === "to")
        if (content[i + 1]) {
          switchCurrency(message, false, content[i + 1]);
          i++;
        } else message.channel.send(`to function requires a value`);
    }
  } catch (e) {
    console.error(e);
  }
};

const convertValue = (message, value) => {
  let num = Number(value);
  if (isNaN(num)) {
    message.channel.send(`convert function requires a number`);
    return;
  }

  let currencyConverter = new CC({ from: fromCurrency, to: toCurrency, amount: 1 });
  currencyConverter.convert().then((response) => {
    message.channel.send(`${value} ${currencyConverter.currencies[fromCurrency]} is ${multiply(response, num)} ${currencyConverter.currencies[toCurrency]}`);
  });
};

const getConversionRate = (message) => {
  let currencyConverter = new CC({ from: fromCurrency, to: toCurrency, amount: 1 });
  currencyConverter.convert().then((response) => {
    message.channel.send(`Current rate is 1 ${currencyConverter.currencies[fromCurrency]} to ${response} ${currencyConverter.currencies[toCurrency]}`);
    return response;
  });
};

const switchCurrency = (message, isFrom, attemptedCurrency) => {
  let currencyConverter = new CC({ from: fromCurrency, to: toCurrency, amount: 1 });
  if (currencyConverter.currencies[attemptedCurrency]) {
    if (isFrom) fromCurrency = attemptedCurrency;
    else toCurrency = attemptedCurrency;
  } else message.channel.send(`${attemptedCurrency} is not a currency. fuck off`);
};

const listCurrencies = (message) => {
  let currencyConverter = new CC({ from: fromCurrency, to: toCurrency, amount: 1 });
  let currencies = Object.keys(currencyConverter.currencies);
  let text = "";
  currencies.map((e) => {
    console.log(currencyConverter.currencies);
    text += e + ": " + currencyConverter.currencies[e] + "\n";
  });

  const splittedStrings = splitString(text, 1999);
  console.log(splittedStrings);

  splittedStrings.map((e) => {
    message.channel.send(e);
  });
};

const listHelp = (message) => {
  message.channel.send(
    `rate - check conversion rate
convert <Value> - responds with the converted amount 
from <CurrencyCode> - changes the from for the conversion 
to <CurrencyCode> - changes the to for the conversion
list - lists all country currency codes
help - infinite loop`
  );
};

function splitString(str, maxLength) {
  const result = [];
  let startIndex = 0;
  let endIndex = maxLength;

  while (startIndex < str.length) {
    if (endIndex >= str.length) {
      endIndex = str.length;
    } else {
      while (str[endIndex] !== " " && endIndex > startIndex) {
        endIndex--;
      }
    }

    const substring = str.substring(startIndex, endIndex);
    result.push(substring);

    startIndex = endIndex + 1;
    endIndex = startIndex + maxLength;
  }

  return result;
}

const historyAdvancedConversion = async (message, attemptedNum) => {
  try {
    let currencyConverter = new CC({ from: fromCurrency, to: toCurrency, amount: 1 });
    attemptedNum = Number(attemptedNum);
    if (isNaN(attemptedNum)) attemptedNum = 7;

    let messageText = `From **${currencyConverter.currencies[fromCurrency]}** to **${currencyConverter.currencies[toCurrency]}**:\n`;
    let previous;
    for (let i = attemptedNum; i >= 0; i--) {
      // TODO: absolute value
      console.log("\u001b[36m%s\u001b[0m", `${i} remaining`);
      let obj = await advancedConversion(message, i, true);
      if (!previous) messageText += ":record_button: :white_large_square: ";
      else if (Number(obj.out) < previous) messageText += ":arrow_up: :red_square: ";
      else messageText += ":arrow_down: :green_square: ";

      let date = new Date(obj.date);
      const formattedDateString = date.toLocaleString("en-GB").split(",")[0];

      messageText += `${formattedDateString}: **${roundPricing(obj.out)}** \n`;

      previous = Number(obj.out);
    }
    console.log(messageText.length);
    message.channel.send(messageText);
  } catch (e) {
    console.error(e);
  }
};

const advancedConversion = async (message, attemptedDate, dontSend) => {
  try {
    let num = Number(attemptedDate);
    let date = new Date(attemptedDate);
    // num is a string or invalid
    if (isNaN(num)) {
      // num is invalid date, attempt better format of string.
      if (isNaN(date)) {
        date = parseDate(attemptedDate);
        // if the other format of date is still not available, then assume invalid string and default to current day -1
        if (isNaN(date)) {
          date = new Date();
          date.setDate(date.getDate() - 1);
        }
      }
    }
    // num is numeric
    else {
      date = new Date();
      date.setDate(date.getDate() - (num + 1)); // TODO: absolute value this shit
    }

    const formattedDate = date.toISOString().split("T")[0];
    const formattedDateString = date.toLocaleString("en-GB").split(",")[0];

    let url = `https://www.x-rates.com/historical/?from=${fromCurrency}&amount=1&date=${formattedDate}`;
    return new Promise((resolve) => {
      request(url, (error, response, body) => {
        //console.log("response:", response.statusCode);
        if (error) console.error("Found error of:", error);
        var $ = cheerio.load(body);
        var bodyText = $("table.ratesTable").text();
        let cleanedBodyText = bodyText.replace(/[\t]/g, "");
        let cleanedArray = cleanedBodyText.split("\n");
        let cleanerArray = [];
        cleanedArray.map((e) => {
          if (e && e !== " ") cleanerArray.push(e);
        });
        let cleanestArray = {}; // Actually an object but i wanted to commit to this.
        let current = "";
        cleanerArray.map((e, actualIndex) => {
          let index = actualIndex % 3;
          if (index === 0) {
            current = e;
            if (current === "US Dollar") current = "United States Dollar";
            cleanestArray[current] = { date: formattedDate };
          } else if (index === 1) {
            cleanestArray[current].out = e;
          } else if (index === 2) {
            cleanestArray[current].in = e;
          }
        });
        //console.log("\u001b[36m%s\u001b[0m", JSON.stringify(cleanestArray, null, 2));

        let currencyConverter = new CC({ from: fromCurrency, to: toCurrency, amount: 1 });
        let currentCurrency = currencyConverter.currencies[toCurrency];

        if (cleanestArray[currentCurrency]) {
          let amount = roundPricing(cleanestArray[currentCurrency].out);
          let messageText = `On the ${formattedDateString}, the rate was 1 ${currencyConverter.currencies[fromCurrency]} to ${amount} ${currencyConverter.currencies[toCurrency]}`;
          if (!dontSend) message.channel.send(messageText);
          resolve(cleanestArray[currentCurrency]);
        } else {
          message.channel.send(`Advanced conversion is not available for current "to" currency: ${toCurrency}`);
          resolve(null);
        }
      });
    });
  } catch (e) {
    console.error(e);
  }
};

function parseDate(dateString) {
  const parts = dateString.split("/");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  console.log(year, month, day);
  return new Date(year, month, day);
}

/**
 * Accurately multiplies to potential decimals.
 * @param {Number} a the first decimal number
 * @param {Number} b the second decimal number
 * @returns the product of both numbers, properly multiplied.
 */
const multiply = function (a, b) {
  var commonMultiplier = 1000000;

  a *= commonMultiplier;
  b *= commonMultiplier;

  return (a * b) / (commonMultiplier * commonMultiplier);
};

/**
 * Rounds pricing accurately to n decimal places.
 * @param {Number} value the money value being passed in.
 * @param {Number} precision the level of precision to round to.
 * @returns the value rounded to n decimal places.
 */
const roundPricing = (value, precision) => {
  if (!precision || typeof precision === "undefined") precision = 2;
  value = Number(value);
  let newValue = +(Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision)).toFixed(precision);
  return newValue;
};
