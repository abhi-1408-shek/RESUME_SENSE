<!-- Futuristic Resume Parser & Analytics Platform -->

<p align="center">
  <img src="https://user-images.githubusercontent.com/placeholder/futuristic-logo.png" width="180" alt="ResumeSense Logo"/>
</p>

<h1 align="center" style="color:#00ffe7; text-shadow:0 0 10px #f0f, 0 0 20px #0ff;">ResumeSense</h1>

<p align="center">
  <b>The AI-powered, multi-format Resume Parser & Analytics Platform</b><br>
  <span style="color:#ff00cc;">Fast. Accurate. Beautiful. Built for the future of hiring.</span>
</p>

---

## 🚀 Features

- 🌈 <b>Modern UI</b> — Sleek, responsive, and animated with dark/light mode
- 🤖 <b>AI Extraction</b> — Extracts emails, phones, skills, and more from PDFs, DOCX, images, etc.
- 📊 <b>Analytics Dashboard</b> — Instant charts and insights after parsing
- 🧑‍💻 <b>Bulk Upload</b> — Analyze multiple resumes in one go
- 🔒 <b>Privacy-first</b> — Option to anonymize personal info
- 🎨 <b>Futuristic Visuals</b> — Neon glows, gradients, smooth transitions
- 🪄 <b>Export</b> — Download results as CSV or JSON
- 🌐 <b>Cross-platform</b> — Works on macOS, Windows, and Linux

---

## 💡 Demo Animation

<p align="center">
  <img src="https://user-images.githubusercontent.com/placeholder/demo-animation.gif" width="700" alt="Demo Animation"/>
</p>

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/resume-sense.git
cd resume-sense
```

### 2. Install Backend (FastAPI) dependencies
#### (Recommended: Use a virtual environment)
```bash
# For macOS/Linux/Windows (with Python 3.9+)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install --upgrade pip
pip install -r backend/requirements.txt
```

### 3. Install Frontend (React) dependencies
```bash
cd frontend
npm install
```

### 4. Run the Application
#### Start the backend server (in a new terminal):
```bash
cd backend
uvicorn main:app --reload
```
#### Start the frontend (in another terminal):
```bash
cd frontend
npm start
```

- Open your browser and go to [http://localhost:3000](http://localhost:3000)

---

## ⚡ Project Structure

```
resume-sense/
├── backend/        # FastAPI backend
│   ├── main.py     # FastAPI entry point
│   ├── ...         # Resume parsing, analytics, and more
├── frontend/       # React frontend
│   ├── src/
│   └── ...
├── README.md
└── ...
```

---

## 🌟 Screenshots

<p align="center">
  <img src="https://user-images.githubusercontent.com/placeholder/bulk-upload.png" width="350"/>
  <img src="https://user-images.githubusercontent.com/placeholder/analytics-dashboard.png" width="350"/>
</p>

---

## 🧬 Tech Stack
- FastAPI (Python)
- React (JavaScript)
- TailwindCSS
- Matplotlib, SpaCy, Presidio, Cohere (optional)
- Chart.js

---

## 🎨 Design & Animations
- Futuristic gradients, neon glows, and smooth transitions
- Fully responsive and beautiful in both dark and light mode
- Custom footer: <b>Engineered by Abhishek</b>

---

## ❓ FAQ
- <b>Q:</b> Can I run this on Windows or macOS?
  <br><b>A:</b> Yes! All commands above work on both platforms. Use the correct activate command for your OS.
- <b>Q:</b> What file formats are supported?
  <br><b>A:</b> PDF, DOCX, TXT, PNG, JPG, JPEG.
- <b>Q:</b> How do I switch to dark mode?
  <br><b>A:</b> Use the theme toggle in the top-right corner.
- <b>Q:</b> Where is my data stored?
  <br><b>A:</b> All parsing is done locally. No resumes are uploaded to a third-party server.

---

## 🛡️ Requirements
- Python 3.9+
- Node.js 16+
- npm 8+

---

## 🧑‍🚀 Credits
- Engineered by <b>Abhishek</b>

---

## 🦾 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
This project is licensed under the MIT License.
