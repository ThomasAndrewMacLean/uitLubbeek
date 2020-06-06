const env = require("./.env.json");
const Twit = require("twit");

console.log(env.CONS_SECRET);
const T = new Twit({
  consumer_key: "FWq9a1ZWyNs6gSy0vuQoMimlY",
  consumer_secret: env.CONS_SECRET || process.env.CONS_SECRET,
  access_token: "848122671007137792-O0ZtzNlfnxtQRLve54xvzYbHUnxTCAx",
  access_token_secret:
    env.ACCESS_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
});

return T.get(
  "search/tweets",
  {
    q: "uit lubbeek",
    //  from: "implosionblue",
    //  count: 100,
    tweet_mode: "extended",
  },
  function (err, data, response) {
    const y = data.statuses
      .map((x) => {
        console.log(x.user.screen_name, x.id_str);
        let naam = x.full_text.split("uit Lubbeek")[0];
      })
      .filter(Boolean);

    const z = new Set(y);
    console.log([...z]);
    if (err) return err;
    return data;
  }
);
