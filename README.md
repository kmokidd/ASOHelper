# README

This is an ASO helper which helps ASOer judge the value of each keywords.

## How to input Data
Create a js file called `data.js` in root directory.

 The template of inner content of `data.js` is `data_sample_file.js`. The value of `myKeywordsy` is your app's keywords and the value of `xlsFileName` is a xlsx file of your app's ASO data in a period, which can be downloaded from aso100. Actually this is a xlsFilePath, I will modify it later.

## How to Run it
After successfully setting both things above, switch to the project dir and run below line in your terminal:
```bash
node main.js
```

## How to Judge the Value
If all the things go well, you will see the result in browser. Each keywords will be listed in different color. Right now, words in color **GREEN** means be better to stay. Words in color **RED** means that you'd better kick it off. And words in color **black** means 'just so so', you can remove it or keep it as you want.