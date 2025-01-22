const Message = require('../models/message.model');
const axios = require('axios');
const express = require('express');
const router = express.Router();

// ข้อมูลสำหรับเชื่อมต่อ Line OA
const CHANNEL_ACCESS_TOKEN = 'dqMkivbXO9teQQIg4c6WflrukXDsOCKhzIytwvw59tT6By9J6sx8PVnQz0PM01zkXVFbZYEs4/ucvMF96VstqHwp+G5Da30dLBCSXQRmt3gs8eZEHTYBGazrSn/JjUKYweux/AV0snATd5zhBNlwBwdB04t89/1O/w1cDnyilFU=';

// Endpoint สำหรับส่งข้อความ Line OA
router.post('/send-message', async (req, res) => {
    const { userId, message } = req.body;

    try {
        await axios.post('https://api.line.me/v2/bot/message/push', {
            to: userId,
            messages: [{ type: 'text', text: message }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
            }
        });
        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Failed to send message:', error);
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
});

// Endpoint สำหรับบันทึกข้อความลงใน MongoDB
router.post('/save-message', async (req, res) => {
    const { userId, message } = req.body;

    try {
        const newMessage = new Message({ userId, message });
        await newMessage.save();
        res.status(201).json({ success: true, message: 'Message saved successfully' });
    } catch (error) {
        console.error('Failed to save message:', error);
        res.status(500).json({ success: false, message: 'Failed to save message' });
    }
});

module.exports = router;
