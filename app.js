// app.js

const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;
  if (!urls) {
    return res.status(400).json({ error: 'No URLs provided' });
  }

  try {
    const requests = urls.map(async (url) => {
      try {
        const response = await axios.get(url);
        return response.data.numbers;
      } catch (error) {
        return [];
      }
    });

    const results = await Promise.all(requests);
    const mergedNumbers = _.uniq(_.flatten(results)).sort((a, b) => a - b);

    res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

