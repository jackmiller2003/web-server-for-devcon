const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3500;

// Middleware to parse JSON bodies
app.use(express.json());

// POST endpoint
app.post('/api/request', async (req, res) => {
    try {
        const { requestText } = req.body;

        if (!requestText) {
            return res.status(400).json({ error: 'requestText is required' });
        }

        const token = process.env.TOKEN;

        if (!token) {
            return res.status(500).json({ error: 'TOKEN not found in environment variables' });
        }

        const response = await axios.post(
            'https://events.palantirfoundry.com/api/v2/ontologies/ontology-5fe816d4-68f6-4492-87cc-9278a126531c/queries/serviceRequest/execute',
            {
                parameters: {
                    requestInText: requestText
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({
            error: 'An error occurred',
            details: error.response ? error.response.data : error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server is running'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 