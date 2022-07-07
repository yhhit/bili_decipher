const {
    decipherDir
}=require('./decipher_module');
const process = require('process');
var readlineSync = require('readline-sync');
function run(){
    console.log("welcome to decipher!\n");
    // Wait for user's response.
    var dir = readlineSync.question(
        "Please input the directory you want to decipher(enter \"exit\" to exit): ");
    if(dir == 'exit'){
        return;
    }
    //删除路径两侧的双引号
    dir = dir.replace(/^"(.*)"$/, '$1');
    //删除路径两侧的单引号
    dir = dir.replace(/^'(.*)'$/, '$1');
    //删除路径两侧的空格
    dir = dir.replace(/^\s*(.*)\s*$/, '$1');
    decipherDir(dir);
}
module.exports=run;
run();


    



