import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const app = express();

// --- ASTUCE POUR LE CHEMIN DES DOSSIERS ---
// En mode "module", on doit recréer __dirname manuellement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/src/assets', express.static(path.join(__dirname, 'src/assets')));

// Rendre le dossier des uploads accessible par le navigateur
app.use('/src/assets/uploads', express.static(path.join(__dirname, 'src/assets/uploads')));

// Configuration de Multer (Stockage des images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'src/assets/uploads/';
    // On vérifie si le dossier existe, sinon on le crée
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

const JSON_FILE = './src/responses/data.json';

// --- ROUTES ---

// 1. Sauvegarder (POST)
app.post('/api/save', upload.single('image'), (req, res) => {
  try {
    const { question, answer } = req.body;
    const imagePath = req.file ? `/src/assets/uploads/${req.file.filename}` : null;

    let allData = [];
    if (fs.existsSync(JSON_FILE)) {
      allData = JSON.parse(fs.readFileSync(JSON_FILE));
    } else {
      // Créer le dossier responses s'il n'existe pas
      if (!fs.existsSync('./src/responses')) {
        fs.mkdirSync('./src/responses', { recursive: true });
      }
    }

    allData.push({
      timestamp: new Date().toISOString(),
      question,
      answer,
      image: imagePath
    });

    fs.writeFileSync(JSON_FILE, JSON.stringify(allData, null, 2));
    res.status(200).json({ message: "Succès !", imagePath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Lire (GET)
app.get('/api/responses', (req, res) => {
  if (fs.existsSync(JSON_FILE)) {
    res.json(JSON.parse(fs.readFileSync(JSON_FILE)));
  } else {
    res.json([]);
  }
});

app.post('/api/save-contract', (req, res) => {
  try {
    const { image } = req.body; 
    
    // On nettoie les données Base64 (on enlève le préfixe data:image/png;base64,)
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    
    // On crée un nom de fichier unique (ex: contrat_1712345678.png)
    const fileName = `contrat_${Date.now()}.png`;
    
    // On définit le chemin vers src/assets
    const filePath = path.join(__dirname, 'src/assets', fileName);

    // On écrit le fichier sur le disque
    fs.writeFileSync(filePath, base64Data, 'base64');

    console.log(`🖋️  Contrat signé et sauvegardé : ${fileName}`);
    res.status(200).json({ message: "Contrat enregistré dans assets !" });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du contrat :", error);
    res.status(500).json({ error: "Échec de la sauvegarde" });
  }
});
app.get('/api/contracts', (req, res) => {
  const directoryPath = path.join(__dirname, 'src/assets');
  
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Impossible de lire le dossier assets" });
    }
    // On ne garde que les fichiers qui commencent par "contrat_" ou "signature_"
    const contracts = files.filter(file => file.startsWith('contrat_') || file.startsWith('signature_'));
    res.json(contracts);
  });
});


const AVIS_FILE = './src/responses/Avis.json';

app.post('/api/feedback', (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Le message est vide" });
    }

    let allAvis = [];
    
    // On vérifie si le dossier existe
    if (!fs.existsSync('./src/responses')) {
      fs.mkdirSync('./src/responses', { recursive: true });
    }

    // On lit l'ancien fichier s'il existe
    if (fs.existsSync(AVIS_FILE)) {
      const fileContent = fs.readFileSync(AVIS_FILE, 'utf-8');
      allAvis = fileContent ? JSON.parse(fileContent) : [];
    }

    // On ajoute le nouvel avis
    allAvis.push({
      id: Date.now(),
      timestamp: new Date().toLocaleString('fr-FR'),
      feedback: message
    });

    // On sauvegarde
    fs.writeFileSync(AVIS_FILE, JSON.stringify(allAvis, null, 2));
    
    console.log("💬 Nouvel avis reçu !");
    res.status(200).json({ message: "Avis enregistré avec succès !" });
  } catch (error) {
    console.error("Erreur avis :", error);
    res.status(500).json({ error: "Impossible de sauvegarder l'avis" });
  }
});

app.listen(3001, () => console.log('🚀 Serveur de sauvegarde actif sur http://localhost:3001'));