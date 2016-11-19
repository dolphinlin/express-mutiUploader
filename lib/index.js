var busboy = require('connect-busboy')

module.exports = (options) => {
  let option = options || {},
      encoding = options.encoding || 'base64'
  delete option.encoding
  return (req, res, next) => {
    return busboy(option)((req, res, next) => {
      if (req.busboy) {
        req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
          console.log('qq345');
          var buf = new Buffer(0);
          var fileData
          // let imageArr = [];
          file.on('data', function(data) {
              buf = Buffer.concat([buf, data]);
              fileData = data.toString('base64')
            })

          file.on('end', function() {
              if (!req.files || !req.files[fieldname]){
                req.files = {}
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
      }else{
        return next()
      }
      req.busboy.on('finish', next)
      req.pipe(req.busboy)
    })
  }

};
