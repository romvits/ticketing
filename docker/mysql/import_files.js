import mysql from 'mysql';
import _ from 'lodash';
import fs from 'fs';
import yaml from 'js-yaml';
import readDir from 'readdir';

const {lstatSync, readdirSync} = require('fs')
const {join} = require('path')

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory);

let syscodes = [];
let dirs = getDirectories('E:/_appcomplete/');
_.each(dirs, (dir, index) => {
	if (index < 3) {
		let pathArray = dir.split('\\');
		syscodes.push(pathArray[2]);
	}
});

const config = yaml.safeLoad(fs.readFileSync('./.config.yaml', 'utf8'));
const local_settings = config.local;

const local = mysql.createConnection(local_settings);

connect('local', local).then((res) => {
	console.log('==>', 'connected');
	console.log('==>', 'rechnungen');
	return rechnungen_read();
}).then((res) => {
	console.log("da");
	process.exit(1);
}).catch((err) => {
	console.log(err);
	process.exit(1);
});

function rechnungen_read() {
	return new Promise((resolve, reject) => {
		let promises = [];
		_.each(syscodes, (syscode) => {
			promises.push(rechnungen(syscode));
		});
		Promise.all(promises).then((res) => {
			//process.exit(1);
			resolve();
		}).catch((err) => {
			console.log(err);
			process.exit(17);
		});
	});
}


function rechnungen(syscode) {
	return new Promise((resolve, reject) => {
		let promisesFiles = [];
		readDir.read('E:/_appcomplete/' + syscode + '/', ['**_rechnung.pdf'], function(err, filesArray) {
			_.each(filesArray, (path) => {
				let pathArray = path.split('/');
				let fileArray = pathArray[1].split('_');
				let fileTypeArray = fileArray[2].split('.');
				let fileType = fileTypeArray[0];
				let fileObject = {
					'EventID': _convertID(syscode),
					'OrderID': _convertID(fileArray[1]),
					'File': pathArray[1],
					'FileType': fileType,
					'FullPath': 'E:/_appcomplete/' + syscode + '/' + path
				}
				promisesFiles.push(_storeFile(fileObject));
			});
			Promise.all(promisesFiles).then((res) => {
				resolve();
			}).catch((err) => {
				console.log(err);
				process.exit(1);
			});
		});
	});
}

function readFile(file) {
	const stats = fs.statSync(file);
	const fileSizeInBytes = stats["size"];
	const bitmap = fs.readFileSync(file);
	const buf = new Buffer.from(bitmap);
	return {'data': buf, 'size': fileSizeInBytes};
}

function _storeFile(fileObject) {
	return new Promise((resolve, reject) => {
		let temp_path = fileObject.FullPath;
		let file = readFile(temp_path);
		let sql = "REPLACE INTO `innoFile` (`FileID`, `FileFileSize`, `FileFile`) VALUES (?,?,BINARY(?))";
		let values = [fileObject.OrderID, file.size, file.data];
		local.query(sql, values, function(err, res) {
			if (err) {
				console.log(err.sqlMessage);
				console.log(values);
				process.exit(1);
			} else {
				resolve(res);
			}
		});
	});
}

function _convertID(id) {
	let uuid = id;
	if (id.length > 32) {
		uuid = id.substring(2, 32);
	}
	return uuid;
}


function connect(name, conn) {
	return new Promise((resolve, reject) => {
		conn.connect(function(err) {
			if (err) {
				reject(err);
			}
			resolve();
		});

	});
}


function _query(sql, data = null) {
	return new Promise((resolve, reject) => {
		local.query(sql, function(err, res) {
			if (err) {
				console.log(err);
				process.exit(1);
			} else {
				//console.log('done query: ', sql);
				if (data) {
					resolve({res: res[0], data: data});
				} else {
					resolve(res);
				}
			}
		});
	});
}


