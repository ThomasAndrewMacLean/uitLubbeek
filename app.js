const ApiBuilder = require("claudia-api-builder");
const api = new ApiBuilder();
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const Twit = require("twit");

const T = new Twit({
  consumer_key: "FWq9a1ZWyNs6gSy0vuQoMimlY",
  consumer_secret: process.env.CONS_SECRET,
  access_token: "848122671007137792-O0ZtzNlfnxtQRLve54xvzYbHUnxTCAx",
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
});

api.get("/uitLubbeek", (req, res) => {
  return T.get("search/tweets", {
    q: "uit lubbeek",
    //  from: "implosionblue",
    //  count: 100,
    tweet_mode: "extended",
  }).then((x) => {
    const y = x.data.statuses
      .map((x) => {
        let naam = x.full_text.split("uit Lubbeek")[0];
        if (naam.includes("de "))
          naam = naam.split("de ")[naam.split("de ").length - 1];
        if (naam.includes("die "))
          naam = naam.split("die ")[naam.split("die ").length - 1];
        if (naam.includes("het "))
          naam = naam.split("het ")[naam.split("het ").length - 1];
        if (naam.includes("een "))
          naam = naam.split("een ")[naam.split("een ").length - 1];

        naam = naam.trim();

        if (naam.split(" ").length < 3) {
          return {
            naam,
            user: x.user.screen_name,
            tweetId: x.id_str,
          };
        }
      })
      .filter(Boolean);

    const z = y.filter(
      (v, i, a) =>
        a.findIndex((t) => JSON.stringify(t) === JSON.stringify(v)) === i
    );
    console.log(z);

    z.forEach((element) => {
      const params = {
        TableName: "uitLubbeek",
        Item: {
          id: element.naam + "/" + element.user,
          naam: element.naam,
          user: element.user,
          tweetId: element.tweetId,
          link:
            "https://twitter.com/" +
            element.user +
            "/status/" +
            element.tweetId,
        },
      };
      dynamoDb.put(params).promise();
    });

    return z;
  });
});

api.get("/all", () => {
  // GET all users
  return dynamoDb
    .scan({ TableName: "uitLubbeek" })
    .promise()
    .then((response) => response.Items.map((x) => x.naam));
});

api.get("/allRaw", () => {
  // GET all users
  return dynamoDb
    .scan({ TableName: "uitLubbeek" })
    .promise()
    .then((response) => response.Items);
});

api.get("/ping", function (request) {
  return "pong";
});

module.exports = api;
