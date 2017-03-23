const User = require('../models/user')
const path = require('path');
const fs = require('fs');

exports.signup = (userName, pass, qq, des, sex) => {
	return new Promise((resolve, reject) => {
		User.findOne({name: userName}, (err, user) => {
			if(err) {
				console.log(err);
				reject(err);
			}

			if(user) {
				resolve({isError: true,userNameUsed: true});
			}else {
				let user = new User({
					name: userName, 
					password: pass,
					qq: qq,
					description: des,
					sex: sex
				})

				user.save((err, user)=>{
					if(err) {
						console.log(err)
					}
					resolve({isError: false})
				})
			}
		})
	})
}

exports.login = (userName, pass) => {
	return new Promise((resolve, reject) => {
		User.findOne({name: userName}, (err, user) => {
			if(err) {
				console.log(err);
				reject(err);
			}
			
			let res = {};
			if(user) {
				if(user.password !== pass) {
					res = {isError: true, isPWErr: true}
				}else {
					res = {isError: false}
				}
			}else{
				res = {isError: true, isUNErr: true}
			}

			resolve(res);
		})
	})
}

exports.uploadPic = (revData, userName) => {
	return new Promise((resolve, reject) => {
		User.findOne({name: userName}, (err, user) => {
			if(err) {
				console.log(err);
				reject(err);
			}

			let res = {};

			if(user) {
				let base64Data = revData.replace(/^data:image\/\w+;base64,/,"");
				let dataBuffer = new Buffer(base64Data, 'base64');
				let pathHeader = path.join(__dirname, '../static/');
				let userFile = path.join(__dirname, `../static/${userName}/`);
				
				
				fs.access(userFile, (err)=>{
					if(!err) {
						var filesNum = fs.readdirSync(userFile).length;
						var fileName = userFile + filesNum + '.png';
						fs.writeFile(fileName, dataBuffer, (err)=>{
							if(err) {
								console.log('save image error1')
								res = {isError: true, info: 'save image error'}
								reject(res);
							}
							res = {isError: false, info: "save image success"}
							user.works.push(fileName);
							user.save((err, _user)=> {
								if(err){
									console.log(err);
								}
							})
							resolve(res);
						})
						fs.writeFile(pathHeader + 'works.txt', fileName.replace(/.*static/, '') + '\r', {flag: 'a'}, (err)=>{
							if(err) {
								console.log(err)
							}
						})
					}else {
						fs.mkdir(userFile, (err) =>{
							if(err) {
								console.log(err)
								res = {isError: true, info: 'mkdir error'}
								reject(res);
							}
							console.log('mkdir ' + userName)
							fs.writeFile(userFile + '0.png', dataBuffer, (err) => {
							  if(err) {
							    console.log('save image error2');
							    res = {isError: true, info: 'save image error'}
							    reject(res)
							  }
							  res = {isError: false, info: "save image success"}
							  user.works.push(userFile + '0.png');
							  user.save((err, _user)=> {
									if(err){
										console.log(err);
									}
								})
								resolve(res);
							})
							fs.writeFile(pathHeader + 'works.txt', userFile.replace(/.*static/, '') + '0.png' + '\r', {flag: 'a'}, (err)=>{
								if(err) {
									console.log(err)
								}
							})
						})
					}
				})
			}else {
				res = {isError: true, info: 'user is not exist', isUserExist: false}
				resolve(res);
			}
		})
	})
}