const path = require('path');
const multer = require('multer');

var storage = multer.memoryStorage();

var upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
        console.log(file.mimetype);
        if (file.mimetype == 'image/jpg') {
            callback(null, true);
        } else {
            console.log("Only JPG & PNG file supported!");
            callback(null, false);
        }
    },
    limits: {
        fileSize: 1024*1024*5
    }
});

module.exports = upload;