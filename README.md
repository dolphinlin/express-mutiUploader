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
//default buffer
```

## Method

### body

```
req.body.FIELDNAME
```

### files

```
req.files.FIELDNAME
```

### SaveFile

```js
var mutiUploader = require('express-mutiUploader')
mutiUploader.saveFile(data, path [, callback])

```

```js
var mutiUploader = require('express-mutiUploader')
var express = require('express')
var app = express()

app.use(mutiUploader())

app.post('/upload', (req, res, next) => {
  let image = req.files.image
  mutiUploader.saveFile(image[0], '/test.png', (err) => {
              console.log(err);
            })
})
```
