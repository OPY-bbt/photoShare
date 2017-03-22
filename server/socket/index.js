const user = require('../controllers/user');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

module.exports = (io) => {
 	io.on('connection', function (socket) {

	  socket.emit('news', { hello: 'world' });
	  socket.on('my other event', function (data) {
	    console.log(data);
	  });

	  socket.on('login', (data, cb) => {
	  	let userName = data.userName;
	  	let password = data.password;
	  	//console.log(data, data.userName, data.password);
	  	// if(userName == 'zy' && password == '123456') {
	  	// 	cb({isError: false})
	  	// }
	  	user.login(userName, password).then((res) => {
	  		console.log(res);
	  		if(!res.isError) {
	  			let all = [];
	  			const rl = readline.createInterface({
	  			  input: fs.createReadStream('./static/works.txt')
	  			});

	  			rl.on('line', (line) => {
	  			  //console.log(`文件的单行内容：${line}`);
	  			  all.push(line);
	  			});

	  			rl.on('close', (line) => {
	  			  //console.log(`文件的单行内容：${line}`);
	  			  //all.push(line);
	  			  //console.log(all)
	  			  res.works = all;
	  			  cb(res);
	  			});
	  		}else {
	  			cb(res);
	  		}
	  	})
	  })

	  socket.on('signup', (data, cb) => {
	  	let userName = data.userName,
	  			password = data.password,
	  			qq = data.qq,
	  			description = data.des,
	  			sex = data.sex;

	  	user.signup(userName, password, qq, description, sex).then((res) => {
	  		//console.log(res, 'dd');
	  		cb(res);
	  	})
	  })

	  socket.on('uploadPic', (data, cb) => {
	  	let rev = data.imgUrl,
	  			userName = data.userName;

	  	if(!userName) {
	  		cb({isError: true, isUserExist: false})
	  	}else {
	  		console.log('broadcast');
  		 	socket.broadcast.emit('someoneuploadPic', data);
	  		user.uploadPic(rev, userName).then((res) => {
	  			cb(res);
	  		})
	  	}
	  })
	});
}