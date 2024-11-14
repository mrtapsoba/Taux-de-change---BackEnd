const express = require('express');
const fs = require('fs');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Route GET pour obtenir les taux de change depuis le fichier JSON
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


const EXCHANGE_RATE_API_URL = 'https://api.exchangeratesapi.io/latest'; // Remplacez par l'URL réelle de l'API

app.get('/taux/refresh', async (req, res) => {
  try {
    // Récupère les taux de change depuis l'API externe
    const response = await axios.get(EXCHANGE_RATE_API_URL);
    const rates = response.data.rates;

    // Mettre à jour les taux de change uniquement pour les devises souhaitées
    const updatedRates = {
      CAD: rates.CAD || null,
      EUR: rates.EUR || null,
      XOF: rates.XOF || null
    };

    // Écrit les taux de change mis à jour dans un fichier JSON
    fs.writeFile('taux.json', JSON.stringify(updatedRates, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Erreur de mise à jour du fichier JSON:', err);
        return res.status(500).json({ error: 'Erreur de mise à jour du fichier JSON' });
      }

      res.json({ message: 'Taux de change mis à jour', data: updatedRates });
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du taux de change:', error);
    res.status(500).json({ error: 'Erreur de récupération des taux de change' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
