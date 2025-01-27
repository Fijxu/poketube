/*

    PokeTube is an Free/Libre youtube front-end. this is our main file.
  
    Copyright (C) 2021-2023 POKETUBE (https://github.com/iamashley0/poketube)
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see https://www.gnu.org/licenses/.
  */

(async function () {
  const {
    fetcher,
    core,
    wiki,
    musicInfo,
    modules,
    version,
    initlog,
    init,
  } = require("./src/libpoketube/libpoketube-initsys.js");
  const media_proxy = require("./src/libpoketube/libpoketube-video.js");
  const { sinit } = require("./src/libpoketube/init/superinit.js");
  const u = await media_proxy();
  initlog("Loading...");
  initlog("[Welcome] Welcome To PokeTube :3 " +"Running " +`Node ${process.version} - V8 v${process.versions.v8} -  ${process.platform.replace("linux", "GNU/Linux")} ${process.arch} Server - libpt ${version}`
  );

  const {
    IsJsonString,
    convert,
    getFirstLine,
    capitalizeFirstLetter,
    turntomins,
    getRandomInt,
    getRandomArbitrary,
  } = require("./src/libpoketube/ptutils/libpt-coreutils.js");

  initlog("Loaded libpt-coreutils");

  const templateDir = modules.path.resolve(
    `${process.cwd()}${modules.path.sep}html`
  );

  const sha384 = modules.hash;

  var app = modules.express();
  initlog("Loaded express.js");
  app.engine("html", require("ejs").renderFile);
  app.use(modules.express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(modules.useragent.express());
  app.use(modules.express.json()); // for parsing application/json
  app.enable("trust proxy");

  const renderTemplate = async (res, req, template, data = {}) => {
    res.render(modules.path.resolve(`${templateDir}${modules.path.sep}${template}`),Object.assign(data));
  };

  const random_words = [
    "banana pie",
    "how to buy an atom bomb",
    "is love just an illusion",
    "things to do if ur face becomes benjamin frenklin",
    "how do defeat an pasta",
    "can you go to space?",
    "how to become a god?",
    "is a panda a panda if pandas???",
    "Minecraft movie trailer",
    "monke",
  ];

  /*
this is our config file,you can change stuff here
*/
  const config = {
    tubeApi: "https://inner-api.poketube.fun/api/",
    invapi: "https://invid-api.poketube.fun/api/v1",
    dislikes: "https://returnyoutubedislikeapi.com/votes?videoId=",
    invchannel: "https://invid-api.poketube.fun/api/v1",
    cacher_max_age: "1800",
    enablealwayshttps: true, //enables always https on the server
    t_url: "https://t.poketube.fun/", //  def matomo url
  };

  try {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    if (req.secure) {
      res.header(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload"
      );
    }
    res.header("secure-poketube-instance", "1");

    next();
  });

  app.use(function (request, response, next) {
    if (config.enablealwayshttps && !request.secure) {
      if (!/^https:/i.test(request.headers["x-forwarded-proto"] || request.protocol)) {
        return response.redirect("https://" + request.headers.host + request.url);
      }
    }

    next();
  });

  app.use(function (req, res, next) {
    res.header("X-PokeTube-Youtube-Client-Name", "1");
    res.header("X-PokeTube-Youtube-Client-Version", "2.20210721.00.00");
    res.header("X-PokeTube-Speeder", "6 seconds no cache, 780ms w/cache");
    if (req.url.match(/^\/(css|js|img|font)\/.+/)) {
      res.setHeader("Cache-Control","public, max-age=" + config.cacher_max_age); // cache header
      res.setHeader("poketube-cacher", "STATIC_FILES");
    }

    const a = 890;
    if (!req.url.match(/^\/(css|js|img|font)\/.+/)) {
      res.setHeader("Cache-Control", "public, max-age=" + a); // cache header
      res.setHeader("poketube-cacher", "PAGE");
    }
    next();
  });

  initlog("[OK] Load headers");
  } catch {
  initlog("[FAILED] load headers")
  }
  
  try {
  app.get("/robots.txt", (req, res) => {
    res.sendFile(__dirname + "/robots.txt");
  });
   
  initlog("[OK] Load robots.txt");
  } catch {
    initlog("[FAILED] load robots.txt")
  }
  
  sinit(app, config, renderTemplate);

  init(app);
})();
