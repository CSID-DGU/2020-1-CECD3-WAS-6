var _fs = require('fs');
var path = require('path');

function copyFileSync(source, target) {
	var targetFile = target;

	if (_fs.existsSync(target)) {
		if (_fs.lstatSync(target).isDirectory()) {
			targetFile = path.join(target, path.basename(source));
		}
	}

	_fs.writeFileSync(targetFile, _fs.readFileSync(source));
}
async function copyFolderRecursiveSync(source, target) {
	var files = [];
	var targetFolder = path.join(target, path.basename(source));

	if (!_fs.existsSync(targetFolder)) {
		_fs.mkdirSync(targetFolder);
	}

	if (_fs.lstatSync(source).isDirectory()) {
		files = _fs.readdirSync(source);
		files.forEach(function (file) {
			var curSource = path.join(source, file);
			if (_fs.lstatSync(curSource).isDirectory()) {
				copyFolderRecursiveSync(curSource, targetFolder);
			} else { //copy file
				copyFileSync(curSource, targetFolder);
			}
		});
	}
}
async function removeFolderNoRec(targetPath){
	try {
		if(!_fs.existsSync(targetPath)) {
			throw { code: -102, msg: "파일이 존재하지 않습니다"};
		}
		_fs.rmdirSync(targetPath, { recursive: true });
	} catch (error) {
		return;
	}
}

module.exports = {
    copyFolderRecursiveSync,
    removeFolderNoRec
}