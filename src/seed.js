const fs = require('fs');
const path = require('path');
const Participante = require('./models/participante');

const seedDatabase = async () => {
  try {
    const count = await Participante.countDocuments();
    if (count > 0) {
      console.log('Banco de dados ja foi populado!');
      return;
    }

    const dataPath = path.join(__dirname, '../lista-participantes-instituicoes-em-adesao-pix-20260115.json');
    if (!fs.existsSync(dataPath)) {
      console.warn('Arquivo de seed nao encontrado:', dataPath);
      return;
    }

    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    const participantes = JSON.parse(jsonData);

    await Participante.insertMany(participantes);

    console.log('Banco de dados populado com sucesso!');
  } catch (error) {
    console.error('Erro ao popular banco de dados:', error);
  }
};

module.exports = seedDatabase;
