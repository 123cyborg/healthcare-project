# Patient Management System with MCP Integration

A backend system for managing patient information, symptom history, and medicine history, integrated with an MCP server for AI-driven medicine suggestions.

## Features
- Store and manage patient details (name, age, gender).
- Record patient symptom history with disease diagnosis and severity.
- Generate medicine history based on AI suggestions via MCP server.
- RESTful APIs for CRUD operations.
- MCP server for AI model learning and improvement.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **MCP Server**: Node.js with JSON-RPC 2.0
- **Dependencies**: mongoose, axios, body-parser

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/patient-management-system.git
   ```
2. Navigate to the project directory:
   ```bash
   cd patient-management-system
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up MongoDB locally or use a cloud instance (update connection string in `app.js`).
5. Start the application:
   ```bash
   node app.js
   ```

## API Endpoints
- **POST /patients**: Create a new patient.
  - Body: `{ "name": "John Doe", "age": 30, "gender": "Male" }`
- **GET /patients/:id**: Retrieve patient details.
- **POST /patients/:id/symptoms**: Add symptom history.
  - Body: `{ "symptomDescription": "Fever, 102°F", "diseaseDiagnosed": "Influenza", "severity": "Moderate" }`
- **POST /patients/:id/medicines**: Add medicine history.
  - Body: `{ "medicineName": "Paracetamol", "dosage": "500mg twice daily", "prescribedFor": "Influenza", "duration": "7 days" }`
- **POST /mcp/suggest**: Request medicine suggestion.
  - Body: `{ "patientId": "patient_id" }`

## MCP Server
The MCP server runs on port 4000 (within `app.js`) and exposes:
- **POST /mcp/suggest**: Suggests medicines based on symptoms.
- **POST /mcp/update**: Updates AI knowledge with new prescriptions.

## Usage
1. Create a patient using the `/patients` endpoint.
2. Add symptoms using the `/patients/:id/symptoms` endpoint.
3. Request medicine suggestions via `/mcp/suggest`.
4. Save the suggested medicine to the patient's medicine history using `/patients/:id/medicines`.

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License
MIT License