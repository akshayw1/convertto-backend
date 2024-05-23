// firebase.js
const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
    projectId: 'your-project-id',
    keyFilename: 'path-to-service-account-file.json',
});

const bucketName = 'your-bucket-name';

async function uploadFile(filePath, destination) {
    await storage.bucket(bucketName).upload(filePath, {
        destination,
        public: true,
    });

    return `https://storage.googleapis.com/${bucketName}/${destination}`;
}

module.exports = {
    uploadFile,
};
