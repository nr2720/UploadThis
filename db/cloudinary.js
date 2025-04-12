const cloudinary = require('cloudinary').v2;

    // Configuration
    cloudinary.config({ 
        cloud_name: 'dnfb6gke7', 
        api_key: process.env.CLOUDINARY_API, 
        api_secret: process.env.CLOUDINARY_SECRET 
  });


  const uploadImg = async(file) => {
    try{
        const result = await cloudinary.uploader.upload(file);
        const url = cloudinary.url(result.public_id);
        return result;
        
    } catch(err) {
        console.error(err);
        return;
    }
  }

  const getUrl = async(file) => {
    try {
        const url = await cloudinary.url(file.public_id);
        return url
    } catch (error) {
        console.error(error);
        return error;
    }
  }

  const deleteByFileId = async(file_id) => {
    try {
      const response = await cloudinary.uploader.destroy(file_id, (err, res) => {
        console.log(res, err);
      })
      return;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  module.exports = {
    uploadImg,
    getUrl,
    deleteByFileId
  }