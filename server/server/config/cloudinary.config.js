const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

function configureCloudinary(cloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_CLIENTID,
    api_secret: process.env.CLOUDINARY_CLIENTSECRET,
  });
}

module.exports = { configureCloudinary };