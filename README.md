# express-mutiUploader
Simple express mutiple file middleware that warps around connect-busboy

## What
a simple usage to parse "multipart/form-data" that warps around connect-busboy

## Usage

```js
var mutiUploader = require('express-mutiUploader')
var express = require('express')
var app = express()

app.use(mutiUploader())
```
u can set the option for "busboy"
```js
app.use(mutiUploader({limits: { fileSize: 50 * 1024 * 1024 }}))
```
also u can set the file data encoding
```js
app.use(mutiUploader({EC: 'base64'}))
//default encoding >> 'buffer'
```

## Method

### body

```
req.body.FIELDNAME
```

### files

```
//params: (name, data, dataEC, encoding, mimetype)

req.files.FIELDNAME
//the files type is fileObj
```

### SaveFile

```js
var mutiUploader = require('express-mutiUploader')
fileObj.saveFile(path [, callback])

```

```js
var mutiUploader = require('express-mutiUploader')
var express = require('express')
var app = express()

app.use(mutiUploader())

app.post('/upload', (req, res, next) => {
  let {image} = req.files
  image[0].saveFile('/test.png', (err, res) => {
              if (err)
                console.log(err)
              console.log(res);
            })
})
```
