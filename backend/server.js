const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/students');
const emailRoutes = require('./routes/emails');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../frontend'));

app.use('/api/students', studentRoutes);
app.use('/api/emails', emailRoutes);

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});