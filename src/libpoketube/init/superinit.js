function initlog(args) {
  console.log("[LIBPT INTSYS] " + args);
}

function init(app, config, rendertemplate) {
  initlog("Starting superinit");
  initlog("[START] Load pages");

  try {
    initlog("Loading video pages ");
    require("../init/pages-video.js")(app, config, rendertemplate);

    initlog("Loaded video pages ");
    initlog("Loading redirects/old pages ");
    require("../init/pages-redir.js")(app, config, rendertemplate);
    initlog("loaded redirects/old pages ");

    initlog("Loading Download and channel pages");
    require("../init/pages-channel-and-download.js")(
      app,
      config,
      rendertemplate
    );

    initlog("Loaded Download and channel pages");
    initlog("Loading static pages");
    require("../init/pages-static.js")(app, config, rendertemplate);
    initlog("loaded static pages");
    initlog("Loading main pages");
    require("../init/pages-404-and-main.js")(app, config, rendertemplate);
    initlog("loaded main pages");

    initlog("[OK] Load pages");

    initlog("Loaded pages - initing poketube finnished :3");
  } catch {
    initlog("[FAILED] Load pages");
  }
}

module.exports = {
  sinit: init,
};