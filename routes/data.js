var express = require('express');
var router = express.Router();


router.get('/data', function(req, res, next){
  // res.redirect('/data');
  console.log(res);

  const modParseData = require("../mod/mod-parse-data.js");
  const data = {
    keywords: "123",
    xlsFilePath: "/Users/kmokidd/Documents/project/ASOHelper/4.0/20180109.xlsx"
  };
  const obj = data;
  // const obj = modParseData(data);

  res.render('data', {data: JSON.stringify(obj)});
})


module.exports = router;