module.exports = {
    decipherDir
}
const fs = require('fs');
const path = require('path');
const { exit } = require('process');
let taskQueue = [];
let goingQueue = [];
let successQueue = [];
let errorQueue = [];
let maxSimuTasks=10;
const expName=".mp4"
function decipherDir(dir){
    decipherDirI(dir)
    decipher(()=>{
        console.log('decipher finish');
        console.log(`success(${successQueue.length}):`,successQueue);
        console.log(`errorQueue(${errorQueue.length}):`,errorQueue);
        console.log('exit');
    });
}
function decipherDirI(dir){
    let dirStat = fs.lstatSync(dir);
    // 读取文件/目录信息
    if(dirStat.isFile(dir)){
        if(dir.endsWith(expName)){
            taskQueue.push(dir);
        }
    }else if(dirStat.isDirectory()){
        fs.readdirSync(dir).forEach(value => {
            let chiDir = path.join(dir, value);
            let stats=fs.lstatSync(dir);
            if(stats.isDirectory())
                {
                    //console.log(`${chiDir} is a directory`);
                    decipherDirI(chiDir);
                }else if(stats.isFile){
                    //console.log(`${chiDir} is file`);
                    if(chiDir.endsWith(expName)){
                        taskQueue.push(chiDir);
                    }
                }
        })
        
    }else{
        console.log(`${dir} is not a file or directory`);
    }
}
function decipher(finish){
    //任务全部处理完毕，退出
    if(taskQueue.length<=0&&goingQueue.length<=0){
        finish();
        return;
    }
        
    //工作队列满了，处理任务
    if(goingQueue.length>=maxSimuTasks){
        decipherTask()
        setTimeout(()=>{
            decipher(finish);
        },1)
        return;
    }
    //工作队列未满,可以添加新任务
    if(goingQueue.length<maxSimuTasks){
        //任务队列不为空，添加新任务
        if(taskQueue.length>0){
            let task=taskQueue.shift();
            goingQueue.push(task);
            setTimeout(()=>{
                decipher(finish);
            },1)
            return;
        }
        //任务队列为空，处理任务
        else{
            decipherTask()
            setTimeout(()=>{
                decipher(finish);
            },1)
            return;
        }
    }
}

function decipherTask(){
    //打开chiDir文件,读出全部内容
    let chiDir=goingQueue.shift();
    goingQueue.length++;
    if(chiDir==undefined){
        return;
    }
    fs.readFile(chiDir, (err, data) => {
        if(err){
            errorQueue.push({
                filename:chiDir,
                err:err
            });
        }
        //如果文件首部3字节数据是16进制ffffff,则认为是加密文件
        else if(data.slice(0,3).toString('hex') == 'ffffff'){
            //解密文件
            //删除文件首部3个字节数据
            data = data.slice(3);
            //写入文件
            fs.writeFile(chiDir, data, (err) => {
                if(err){
                    console.log(err);
                    console.log(`decipher file ${chiDir} failed`);
                }
            })
            successQueue.push({
                filename:chiDir,
            });
        }
        goingQueue.length--;
    })
}