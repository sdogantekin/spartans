var config = {};

config.env = "DEV";

if (config.env == "DEV") {
    config.mongo     = {};
    config.mongo.url = "mongodb://spartans:serkan123@ds151279.mlab.com:51279/spartans";

    config.log       = {};
    config.log.level = "debug";

    config.mongoose       = {};
    config.mongoose.debug = true;

    config.sessionSecret = "Serkan123";
}

module.exports = config;