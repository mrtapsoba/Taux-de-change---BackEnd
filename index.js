const express = require('express');
const fs = require('fs');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.get('/taux', (req, res) => {
    fs.readFile('taux.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Erreur de lecture du fichier JSON:', err);
        return res.status(500).json({ error: 'Erreur de serveur' });
      }
      const exchangeRates = JSON.parse(data);
      res.json(exchangeRates);
    });
  });

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
