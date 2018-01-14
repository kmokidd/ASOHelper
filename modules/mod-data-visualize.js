// open index.html in default browser
// show data visualization

'use strict'

const open = require("open"), // open a result index
      fs = require('fs'); // write .html file

module.exports = exports = function writeAndOpen(filePath, tmplPath, resultData) {
  let cont = '';

  let innerHTMLScript = `<script>
        const result = new Vue({
          el: '.l--txt',
          data: {
            keywords: ${resultData}
          }
        })
      </script>
      </body>
      </html>`;

  fs.open(tmplPath, 'r', (err, fd) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error('myfile does not exist');
        return;
      }
      throw err;
    }
    
    fs.readFile(tmplPath, 'utf8', (err, data)=>{
      if(err) throw err;
      cont = data + innerHTMLScript;

      // 写入文件
      fs.open(filePath, 'wx', (err, fd) => {
        if(err) {
          if (err.code === 'EEXIST')
            console.error('文件已存在，将被覆盖');
          else
            throw err;
        }

        fs.writeFile(filePath, cont, (err) => {
          if (err) throw err;

          // 写完就关上
          fs.closeSync(fs.constants.O_RDWR);

          // 成功写入后打开结果页
          open(filePath);
        });
      });
    })
  })
}