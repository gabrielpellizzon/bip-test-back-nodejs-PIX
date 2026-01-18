# Relatório Técnico – Serviço de Consulta de Participantes do PIX

---

## Como executar o projeto

### Pré-requisitos

Antes de iniciar, certifique-se de ter os seguintes requisitos instalados no ambiente:

- **Node.js**: 
  Plataforma para execução da aplicação JavaScript no servidor.

- **npm**: 
  Gerenciador de pacotes utilizado para instalar as dependências do projeto.

- **Docker**: 
  Utilizado para subir a infraestrutura de suporte (MongoDB) via containers.

```bash
npm install
```

Execute o projeto:
```bash
docker-compose up --build
```

A aplicação ficará disponível em:
```
http://localhost:3000
```
### Endpoint para consulta de participantes do PIX
```
GET /pix/participants/:ispb
```

### Documentação da API

A documentação da API pode ser acessada em:
```
http://localhost:3000/api-docs
```

### Testes

```bash
npm run test
```

---

## 1. Diagnóstico do Problema

Durante a análise inicial do serviço, foi identificado que o endpoint configurado para consulta dos participantes do PIX não existia na API de dados abertos do Banco Central do Brasil (Bacen).

```env
# .env.example
PORT=3000
BCB_PIX_URL=https://www.bcb.gov.br/api/pix/participants
CACHE_TTL_SECONDS=60
```

```js
// index.js
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

let cache = null; // cache sem TTL (bug adicional)

app.get('/pix/participants/:ispb', async (req, res) => {
  const { ispb } = req.params;

  if (!cache) {
    const response = await axios.get(process.env.BCB_PIX_URL);
    cache = response.data;
  }

  const participant = cache.find(p => p.ispb === ispb); // BUG proposital

  if (!participant) {
    return res.status(404).json({ error: 'Participant not found' });
  }

  res.json(participant);
});

app.listen(PORT, () => {
  console.log(`PIX Service running on port ${PORT}`);
});
```

Os principais problemas identificados foram:

* **Endpoint inexistente**: A URL configurada (`https://www.bcb.gov.br/api/pix/participants`) não corresponde a um endpoint válido disponibilizado pelo Bacen para consulta dos participantes do PIX.
* **Cache sem política de expiração (TTL)**: O cache em memória não possuía controle de tempo de vida, o que fazia com que os dados permanecessem indefinidamente armazenados.
* **Risco de dados desatualizados**: Caso houvesse qualquer alteração na base de participantes do PIX, o serviço continuaria retornando informações antigas, pois não realizava uma nova consulta após o primeiro carregamento.

## 2. Explicação Técnica das Decisões

### 2.1 Fonte de Dados Oficial

Para garantir confiabilidade e atualização das informações, foi utilizada a fonte oficial disponibilizada pelo Bacen:

* Página: [https://www.bcb.gov.br/en/financialstability/pixparticipants](https://www.bcb.gov.br/en/financialstability/pixparticipants)
* Arquivo: CSV contendo a lista de participantes do PIX (atualizado em 15/01/2026)

O arquivo CSV foi convertido para um formato **JSON válido**, facilitando a manipulação dos dados pela aplicação e a persistência no banco de dados.

### 2.2 Persistência dos Dados

Os dados dos participantes foram importados para um banco de dados **MongoDB**, executado via **Docker Compose**, permitindo:

* Padronização do ambiente de execução
* Facilidade de inicialização do projeto
* Persistência dos dados localmente para consultas rápidas

Foi criado um script responsável por:

1. Ler o arquivo CSV
2. Converter os registros para JSON
3. Popular a coleção de participantes do PIX no MongoDB

Após a carga inicial, o servidor é inicializado utilizando **Express**, expondo o endpoint de consulta.

### 2.3 Implementação de Cache com TTL

Para resolver o problema de dados desatualizados, foi implementado um serviço de cache em memória com suporte a **TTL (Time To Live)**, garantindo que:

* Os dados sejam armazenados temporariamente em memória para melhorar a performance
* Após o tempo configurado, o cache seja invalidado automaticamente
* Uma nova consulta ao banco seja realizada quando o cache expirar

Essa abordagem equilibra **performance** e **consistência dos dados**.

### 2.4 Documentação com Swagger

Foi integrado o **Swagger** à aplicação para documentar a API, permitindo:

* Visualização interativa dos endpoints
* Facilidade de teste manual
* Padronização da documentação técnica

### 2.5 Testes Automatizados

Foram implementados testes automatizados utilizando **Jest** e **Supertest**, cobrindo os principais fluxos da aplicação:

#### Testes de Integração

* Validação do endpoint `GET /participants/:ispb`
* Cenários de sucesso (200) e não encontrado (404)
* Verificação do comportamento do cache com TTL

#### Testes Unitários

* Controller do PIX
* Serviço de cache em memória

Os testes garantem maior confiabilidade, facilitam a manutenção do código e reduzem o risco de regressões.

## 3. Conclusão

Com as alterações implementadas, o serviço passou a:

* Utilizar uma fonte oficial e confiável de dados
* Persistir os participantes do PIX em banco de dados
* Controlar corretamente o ciclo de vida do cache com TTL
* Disponibilizar documentação técnica via Swagger
* Possuir cobertura de testes unitários e de integração

Essas melhorias tornaram a aplicação mais robusta, previsível e preparada para evoluções futuras.
