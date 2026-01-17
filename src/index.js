const express = require('express');
const connectDB = require('./database');
const seedDatabase = require('./seed');
const pixRoutes = require('./routes/pixRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/pix', pixRoutes);

const startServer = async () => {
  await connectDB();
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(`API do PIX rodando na porta ${PORT}`);
  });
};

startServer();
