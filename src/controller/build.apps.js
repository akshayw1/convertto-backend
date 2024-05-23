
// controller.js
const express = require('express');
const { buildApp } = require('./util');
const { uploadFile } = require('./firebase');
const router = express.Router();

export const buildApp = async (req, res) => {
    try {
        const { appId, folder } = req.query;

        if (!appId || !folder) {
            return res.status(400).json({ error: 'appId and folder are required' });
        }

        // Build the app
        const buildPath = await buildApp(appId);

        // Define the destination path in Firebase
        const destination = `${folder}/${path.basename(buildPath)}`;

        // Upload the build to Firebase
        const fileUrl = await uploadFile(buildPath, destination);

        // Send the URL as response
        res.json({ fileUrl });
    } catch (error) {
        console.error('Error building or uploading app:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


