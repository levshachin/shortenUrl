const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const app = express();
const PORT = process.env.PORT || 3000;
const validUrl = require('valid-url');

mongoose.connect('mongodb://localhost/urlshortener', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Определение схемы URL
const urlSchema = new mongoose.Schema({
    original_url: { type: String, required: true },
    short_id: { type: String, required: true, unique: true }
});
const Url = mongoose.model('Url', urlSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/short', async (req, res) => {
    const { original_url } = req.body;
    console.log('Received URL:', original_url);
    
    if (!original_url || !validUrl.isUri(original_url)) {
        console.log('Invalid URL');
        return res.status(400).json({ error: 'Invalid original URL' });
    }

    const short_id = shortid.generate();

    try {
        const newUrl = new Url({
            original_url: original_url,
            short_id: short_id
        });
        
        await newUrl.save();
        res.status(201).json({ shortUrl: `${req.protocol}://${req.get('host')}/${short_id}` });
    } catch (error) {
        console.error('Error saving URL:', error);
        res.status(500).json({ error: 'An error occurred while saving the URL', details: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));