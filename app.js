const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

// Initialize Express apps
const mainApp = express();
const mcpApp = express();
const mainPort = 3000;
const mcpPort = 4000;

// Middleware
mainApp.use(bodyParser.json());
mcpApp.use(bodyParser.json());
mainApp.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/patientDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Schemas
const symptomSchema = new mongoose.Schema({
  symptomId: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId },
  symptomDescription: { type: String, required: true },
  diseaseDiagnosed: { type: String, required: true },
  dateReported: { type: Date, default: Date.now },
  severity: { type: String, enum: ['Mild', 'Moderate', 'Severe'], required: true },
});
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  symptomHistory: [symptomSchema],
  medicineHistory: [],
});
const Patient = mongoose.model('Patient', patientSchema);

// Mock AI Knowledge Base
let medicineKnowledge = [
  { disease: 'Influenza', medicines: [{ name: 'Paracetamol', dosage: '500mg twice daily', duration: '7 days' }] },
];

// Main Server API Endpoints
mainApp.post('/patients', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

mainApp.post('/mcp/suggest', async (req, res) => {
  try {
    const { patientId } = req.body;
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    const response = await axios.post(`http://localhost:${mcpPort}/mcp/suggest`, {
      symptoms: patient.symptomHistory,
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MCP Server Endpoints
mcpApp.post('/mcp/suggest', (req, res) => {
  const { symptoms } = req.body;
  const latestSymptom = symptoms[symptoms.length - 1];
  const disease = latestSymptom.diseaseDiagnosed;
  const knowledge = medicineKnowledge.find(k => k.disease === disease);
  if (!knowledge) return res.status(404).json({ error: 'No medicine suggestions available' });
  res.json({ medicine: knowledge.medicines[0], prescribedFor: disease });
});

// Start Servers
mainApp.listen(mainPort, () => console.log(`Main Server running on port ${mainPort}`));
mcpApp.listen(mcpPort, () => console.log(`MCP Server running on port ${mcpPort}`));
