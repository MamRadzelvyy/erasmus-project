const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const PORT = 5000;
const FILE_PATH = path.join(__dirname, 'companies.json');
const VIDEO_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(VIDEO_DIR)) {
  fs.mkdirSync(VIDEO_DIR);
}

app.use(cors());
app.use(bodyParser.json());
app.use('/videos', express.static(VIDEO_DIR));

const loadCompanies = () => JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
const saveCompanies = (companies) => fs.writeFileSync(FILE_PATH, JSON.stringify(companies, null, 2));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, VIDEO_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

app.get('/api/companies', (req, res) => {
  const companies = loadCompanies();
  res.json(companies);
});

app.post('/api/companies', upload.single('video'), (req, res) => {
  const { name } = req.body;
  const videoUrl = `/videos/${req.file.filename}`;

  const companies = loadCompanies();
  const newCompany = {
    id: Date.now(),
    name,
    videoUrl,
  };

  companies.push(newCompany);
  saveCompanies(companies);
  res.status(201).json({ message: 'Empresa agregada', company: newCompany });
});

app.put('/api/companies/:id', upload.single('video'), (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const companies = loadCompanies();
  const index = companies.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ message: 'Firma nenalezena' });

  const updatedCompany = {
    ...companies[index],
    name,
    videoUrl: req.file ? `/videos/${req.file.filename}` : companies[index].videoUrl,
  };
  companies[index] = updatedCompany;
  saveCompanies(companies);
  res.json({ message: 'Empresa actualizada', company: updatedCompany });
});

app.delete('/api/companies/:id', (req, res) => {
  const id = Number(req.params.id);
  let companies = loadCompanies();
  const target = companies.find(c => c.id === id);
  if (!target) return res.status(404).json({ error: 'Empresa actualizada' });

  // Smazat video soubor
  const videoPath = path.join(VIDEO_DIR, path.basename(target.videoUrl));
  if (fs.existsSync(videoPath)) {
    fs.unlinkSync(videoPath);
  }

  companies = companies.filter(c => c.id !== id);
  saveCompanies(companies);
  res.json({ message: 'Empresa eliminada' });
});

app.listen(PORT, () => {
  console.log(`	Servidor ejecutándose en http://localhost:${PORT}`);
});