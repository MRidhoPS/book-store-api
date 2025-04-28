const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dfoktqhyq',
    api_key: '838818975519474',
    api_secret: 'KWMBmPNMAqyeHHfiu3d8_s4kd_U',
    secure: true,
});

module.exports = cloudinary;
