var busboy = require('connect-busboy')

module.exports = (options) => {
  const option = options || {}
  const ec = options.ec || ''
  if (option.hasOwnProperty('ec')) {
    console.log('has ec');
    delete option.ec
  }
  return (req, res, next) => {
    return busboy(option)(req, res, () => {
      if (req.busboy) {
        req.body = req.body || {}
        req.files = {}
        // prase file
        req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
          let buf = new Buffer(0);
          let fileData
          file.on('data', function(data) {
              buf = Buffer.concat([buf, data]);
              fileData = buf
              if (ec !== undefined){
                fileData = buf.toString(ec)
              }
            })

          file.on('end', function() {
              if (!req.files || !req.files[fieldname]){
                req.files[fieldname] = []
              }
              return req.files[fieldname].push({
                name: filename,
                data: fileData,
                encoding: encoding,
                mimetype: mimetype
              })
            })
        })
        // prase field
        req.busboy.on('field', (key, value, keyTruncated, valueTruncated) => {
          req.body[key] = value
        })
      }else{
        return next()
      }
      req.busboy.on('finish', next)
      req.pipe(req.busboy)
    })
  }

};
