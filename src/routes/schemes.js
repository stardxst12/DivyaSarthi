const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/schemes', (req, res) => {
  const filePath = path.join(__dirname, '..', 'data', 'myscheme_schemes.json');

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read scheme data' });
    res.json(JSON.parse(data));
  });
});

module.exports = router;
