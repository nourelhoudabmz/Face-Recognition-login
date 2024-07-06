import express from 'express';
import * as faceapi from 'face-api.js';
import AuthController from './controller/AuthController';
import { upload } from './common/multer';
import cors from 'cors';
import fs from 'fs';

const app = express();
const port = 8081;

app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/signup', function(req, res) {
  res.sendFile(__dirname + '/signup.html');
});

app.get('/home', function(req, res) {
  res.sendFile(__dirname + '/home.html');
});

app.post('/signup', upload.single('photos'), AuthController.register); // Ajout de la route POST pour /signup

app.post('/login', upload.single('photos'), AuthController.login);

app.listen(port, async () => {
  console.log(`Votre application s'exécute sur le port ${port}.`);
  
  const MODEL_URL = './models';
  
  try {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
    
    console.log('Modèles face-api.js chargés avec succès.');
  } catch (e) {
    console.error('Erreur lors du chargement des modèles face-api.js:', e);
  }
});

export default app;
