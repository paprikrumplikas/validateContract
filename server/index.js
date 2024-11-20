// @note simple Express server

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/contract', async (req, res) => {
    try {
        const contractPath = path.resolve(__dirname, 'build', 'Counter.json');
        const contractData = await fs.readJson(contractPath);
        res.json(contractData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contract data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});