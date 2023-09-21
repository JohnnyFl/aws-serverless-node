const serverless = require("serverless-http");
const express = require("express");
const cors = require('cors')
const app = express();

const db = require("./db.json");
const typeMap = new Map();

Object.keys(db).forEach((type) => {
  typeMap.set(type, new Set(db[type]));
});

app.use(express.json());
app.use(cors())

app.get("/calculateTypes", (req, res) => {
  const text = req.query.text;

  if (!text) {
    return res.status(400).json({
      error: "Missing 'text' query parameter",
    });
  }

  const types = {
    noun: 0,
    verb: 0,
    adjective: 0,
    adverb: 0,
    preposition: 0,
    conjunction: 0,
    pronoun: 0,
    interjection: 0,
    determiner: 0,
    numeral: 0,
  };

  const textArr = text.split(" ");

  textArr.forEach((word) => {
    typeMap.forEach((wordSet, type) => {
      if (wordSet.has(word)) {
        types[type]++;
      }
    });
  });

  return res.status(200).json({
    result: types,
  });
});

app.use((req, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
