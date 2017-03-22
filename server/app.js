const Koa = require('koa')
	,app = new Koa()
	,Router = require('koa-better-router')
	,router = Router().loadMethods()
	,Io = require('socket.io')
	,http = require('http')
	,serve = require('koa-static')
	,logger = require('koa-logger')
	,path = require('path')
	,mongoose = require('mongoose')
	,cors = require('koa2-cors');

//app.use(cors());
const server = http.Server(app.callback());
const io = Io(server)
require('./socket/index')(io);

var dbUrl = 'mongodb://localhost/photoShare';
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);

//const users = require('./routes/users');

//router.get('/users', users);

//app.use(router.middleware())

app.use(serve(path.join(__dirname, '../dist')));

server.listen(3500, () => {
	console.log('open in 3500')
});

module.exports = app;

