var fs = require("fs");
var path = require("path");
var log = console.log;

var fileExt = ""; 		//file extension given by the user
var searchText = "";	//text to search in file content, given by user
var direcAllFileList = [];	//all file list in the main directory ans sub folders
var reqFileExtList = [];	//all requested file list by file extension given by the user
var reqFileList = [];		//all requested file list that contains the given text and
							//have the requested file extention(the output result)

function printArray(arr) {
	for(let i = 0; i < arr.length; i += 1) {
		log(arr[i]);
	}
}

//grabing the file extension and text to search in the file content
function grabFileExtAndText() {
	fileExt = process.argv[2];
	searchText = process.argv[3];
}

//check if the user gaved the the two argument, file extenstion and text to search
function checkFileExtAndText() {
	if(!fileExt || !searchText) {
		console.log(fileExt);
		console.log(searchText);
		log("USAGE: node search [EXT] [TEXT]");
		process.exit(1);
	}
}

//creating all the file list from the main directory and it's sub folders
function createDirecAllFileList(currentDirectory) {
    var direcContent = fs.readdirSync(currentDirectory);
    for(let i = 0; i < direcContent.length; i += 1) {
        var fullPath = path.join(currentDirectory, direcContent[i]);
        if (fs.statSync(fullPath).isDirectory()) {
            createDirecAllFileList(fullPath);
        } else {
            direcAllFileList.push(fullPath);
        }
    }
}

//creating the required file list by the given extension
function createRequiredFileList() {
	var dotFileExt = "." + fileExt;
	for(let i = 0; i < direcAllFileList.length; i += 1) {
		if(path.extname(direcAllFileList[i]) === dotFileExt) {
			reqFileExtList.push(direcAllFileList[i]);
		}
	}
}

//searching the given text in file content. searches on  the formed reqested file list extension
function searchTextInFileContent() {
	for(let i = 0; i < reqFileExtList.length; i += 1) {
		var content = fs.readFileSync(reqFileExtList[i], "UTF-8");
		if(content.includes(searchText)) {
			reqFileList.push(reqFileExtList[i]);
		}
	}
	
	if(reqFileList.length === 0) {
		log("No file was found");
	}
}


grabFileExtAndText();
checkFileExtAndText();
createDirecAllFileList(__dirname);
createRequiredFileList();
searchTextInFileContent();
printArray(reqFileList);