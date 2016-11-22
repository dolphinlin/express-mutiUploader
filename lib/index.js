var busboy = require('connect-busboy');
var fs = require('fs-extra');
var streamifier = require('streamifier');

module.exports = (options) => {
  const option = options || {}
  const ec = options.ec || ''
  if (option.hasOwnProperty('ec')) {
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
              if(fileData){
                return req.files[fieldname].push({
                  name: filename,
                  data: fileData,
                  dataEC: ec || 'buffer',
                  encoding: encoding,
                  mimetype: mimetype
                })
              }else{
                return req.files[fieldname]
              }
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

function saveFileFunc(path, callback) {
  callback = callback || function(err) { console.log(err) }
  //console.log(this);
  // console.log(__dirname + path);
  const fStream = fs.createWriteStream(path);
  if (Buffer.isBuffer(this.data)) {
    var buf = this.data
  }else{
    console.log(this.dataEC);
    var buf = Buffer.from(this.data, this.dataEC)
  }
  streamifier.createReadStream(buf).pipe(fStream);
  fStream.on('error', function(error) {
      callback(error);
  });
  fStream.on('close', function() {
      callback(null);
  });
};

module.exports.saveFile = (data, path, callback) => {
  // console.log(data);
  saveFileFunc.apply(data, [path, callback])
}
