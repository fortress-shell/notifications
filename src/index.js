const io = require('src/resources/io');
const redis = require('src/resources/redis');
const server = require('src/resources/server');
const ApplicationController = require('controllers/application-controller');
const logger = require('winston');
const notifications = new ApplicationController(io, redis, logger);

io.use(notifications.onAuthentication);
io.on('connection', app.onConnection);

function onShutdown() {

}

for (const event of ['SIGINT', 'SIGTERM']) {

  process.once(event, onShutdown);
}
