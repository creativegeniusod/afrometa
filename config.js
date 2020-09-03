const config = {};

config.serverPort = 3000;
config.host = '0.0.0.0';
config.templatesPath = `${__dirname}/templates`;
config.customModules = `${__dirname}/custom_modules`;

module.exports = config;