// app.post('/webhooks/inbound-message', (req, res) => {
//     console.log(req.body);
//     res.status(200).end();
// });

// app.post('/webhooks/message-status', (req, res) => {
//     console.log(req.body);
//     res.status(200).end();
// });

// 'use strict';
const express = require("express");
const { authenticateUser } = require("../middlewares/auth.middleware");
const { sendWhatsappMessage } = require("../controllers/message.controller");


const router = express.Router()

router.post("/send-message", authenticateUser, sendWhatsappMessage);

module.exports = router