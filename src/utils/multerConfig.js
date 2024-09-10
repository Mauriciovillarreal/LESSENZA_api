const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = '';
    if (file.fieldname === 'profile') {
      folder = 'profiles';
    } 
    if (file.fieldname === 'products') {
      folder = 'products';
    } 
    if (file.fieldname === 'documents'){
      folder = `documents`; // Carpeta específica para el usuario
    }
    const uploadFolder = `uploads/${req.params.uid}/${folder}`; // Carpeta de destino

    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true }); // Crear la carpeta de destino si no existe
    }
    cb(null, uploadFolder)
  },
  filename: (req, file, cb) => {
  //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, Date.now() + '-' + file.originalname)
  },
});

const upload = multer({ storage });

module.exports = upload;
