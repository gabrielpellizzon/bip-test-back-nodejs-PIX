const express = require('express');
const connectDB = require('./database');
const seedDatabase = require('./seed');
const pixRoutes = require('./routes/pixRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/pix', pixRoutes);

const startServer = async () => {
  const PORT = process.env.PORT || 3000;
  await connectDB();
  await seedDatabase();
  const server = app.listen(PORT, () => {
    console.log(`API do PIX rodando na porta ${PORT}`);
  });
  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
