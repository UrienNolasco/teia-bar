const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Configuração do armazenamento local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // Cria a pasta "uploads" se ela não existir
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName); // Define o nome do arquivo
  },
});

// Inicialização do multer
const upload = multer({ storage });

// Rota para fazer upload da imagem
app.post('/upload', upload.single('imagem'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhuma imagem foi enviada.' });
  }

  // URL acessível do arquivo
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ message: 'Upload realizado com sucesso!', fileUrl });
});

// Middleware para servir arquivos estáticos da pasta "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota padrão
app.get('/', (req, res) => {
  res.send('Servidor rodando. Use a rota POST /upload para enviar imagens.');
});

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
