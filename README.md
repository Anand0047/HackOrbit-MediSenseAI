# 🧠 MediSense AI - Symptoms to action   


**MediSense AI** is an AI-powered health assistant that helps users understand symptoms, find nearby specialists or pharmacies, and extract medicine names from prescriptions using OCR. Built with React, Express, and Spring Boot, it combines AI, OCR, geolocation, and scraping for a smart, lightweight healthcare solution.

## 🩺 Features

- 🔍 **AI Symptom Checker**  
  Input your symptoms and get AI-powered medical suggestions, severity analysis, and recommendations.

- 🗺️ **Smart Specialist Finder**  
  If the severity is emergency or severe, the app recommends a specialist and enables a **Find [Specialist] Nearby** button using Leaflet.js and geolocation.

- 💊 **Moderate/Mild Case Suggestions**  
  For moderate or mild severity, the app displays recommended medicines and a **Find Pharmacy Nearby** button to buy them locally.

- 📸 **OCR-Based Prescription Analysis**  
  Upload images of prescriptions. Tesseract.js extracts medicine names, which are then auto-matched and links are fetched from trusted medical platforms.

- 🌐 **Multi-Module Architecture**  
  Frontend (React) – Main interface with chat, OCR, geolocation UI.
  - Backend #1 (Express) – Web scraping for medicine/product availability.
  - Backend #2 (Spring Boot) – Authentication, user data, health record storage.

## 📦 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion, Leaflet.js
- **Backend**:
  - Express.js (Scraping)
  - Spring Boot (Auth, DB)
- **OCR**: Tesseract.js
- **AI/LLM**: Gemini API , groq API
- **Maps & Geo**: Leaflet.js + Geolocation API
- **Web Scraping**: Axios + Cheerio for 1mg.com / PharmEasy
- **Database**: MySQL

## 🚀 Getting Started

### 1. Clone the repo

git clone https://github.com/Anand0047/MediSenseAI.git
cd HackOrbit-MediSenseAI
2. Install dependencies



# Frontend
cd client
npm install

# Backend - Express
cd ../scraper
npm install

# Backend - Spring Boot
# Open in Spring Tool Suite (STS) or use Maven/Gradle CLI
3. Run the app



# Start React frontend
cd client
npm run dev

# Start Express scraper backend
cd ../scraper
node index.js

# Start Spring Boot backend
# Run using IDE or: ./mvnw spring-boot:run
📌 Ensure you set your OpenAI API key and scraping URLs properly in .env files.

🧪 Sample Use Cases
Upload a prescription image → Extracts "Dolo", "Azithromycin" → Scrapes 1mg link

Enter "headache and nausea" → AI suggests severity: Moderate, shows medicine and Find Pharmacy

Enter "chest pain" → AI detects Emergency, shows Consult Cardiologist and Find Cardiologist


🤝 Contributing
Pull requests are welcome. Please open an issue first to discuss what you’d like to change.


🔗 Links

1.Barath C T

barathctb@gmail.com 

2. Portfolio: https://anand0047.github.io/anand-portfolio/
 Email: anandram221003@gmail.com

