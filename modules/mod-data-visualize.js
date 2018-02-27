// open index.html in default browser
// show data visualization

"use strict";

const open = require("open"), // open .html in browser
  fs = require("fs"); // write .html file

const promise = require('promise');

module.exports = exports = function writeAndOpen(filePath, tmplPath, resultData) {
  let cont = "";

  let innerHTMLScript = `<script>
        const result = new Vue({
          el: ".l--txt",
          data: {
            keywords: ${resultData}
          }
        })
      </script>
      </body>
      </html>`;

  // 用 promise
  fs.open(tmplPath, "r", (err, fd) => {
    if (err) {
      if (err.code === "ENOENT") {
        console.error(tmplPath + "不存在");
        return;
      }
      throw err;
    }

    readFile(tmplPath)
      .then(function(data){
        let cont = data + innerHTMLScript;
        writeFile(filePath, cont);
      })
      .then(function(){
        fs.closeSync(fs.constants.O_RDWR);
        // 成功写入后打开结果页
        open(filePath);
      }, function(err){
        throw err;
      });
  });
};

// function openFile(filePath) {
//   return
// }

function readFile(filePath) {
  return new Promise(function(resolve, reject){
    fs.readFile(filePath, "utf8", (err, data)=>{
      if(err) reject(err);
      else resolve(data);
    });
  });
}

function writeFile(filePath, cont) {
  return new Promise(function(resolve, reject){
    fs.writeFile(filePath, cont, (err) => {
      if (err) reject(err);
      else resolve(filePath);
    });
  });
}