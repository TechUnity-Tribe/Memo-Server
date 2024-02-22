const { Vonage } = require("@vonage/server-sdk");

require('dotenv').config();

const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
    applicationId: process.env.VONAGE_APP_ID,
    privateKey: process.env.VONAGE_PRIVATE_KEY_PATH,
});



const sendWhatsappMessage = async (req, res) => {
    const { to, text } = req.body;
    if (!to || !text) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const response = await vonage.messages.send(
            { type: 'whatsapp', number: to },
            { type: 'whatsapp', number: process.env.VONAGE_WHATSAPP_NUMBER },
            {
                content: {
                    type: 'text',
                    text: text
                }
            }
        );

        console.log('Message sent successfully:', response.messages[0].message_uuid);
        res.json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = { sendWhatsappMessage }