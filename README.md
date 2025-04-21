<!-- Futuristic Resume Parser & Analytics Platform -->

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&size=40&duration=3500&pause=1000&color=00FFE7&center=true&vCenter=true&width=900&lines=ResumeSense;AI+Resume+Parser+%26+Analytics+Platform;Futuristic.+Accurate.+Beautiful." alt="ResumeSense Animated Logo"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge&logo=github"/>
  <img src="https://img.shields.io/badge/license-MIT-blueviolet?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-0099ff?style=for-the-badge"/>
  <img src="https://img.shields.io/github/stars/abhi-1408-shek/RESUME_PARSER?style=for-the-badge"/>
</p>

<p align="center">
  <a href="#demo-animation" style="margin:0 10px;"><img src="https://img.shields.io/badge/Live+Demo-00ffe7?style=for-the-badge&logo=vercel"/></a>
  <a href="https://github.com/abhi-1408-shek/RESUME_PARSER" style="margin:0 10px;"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github"/></a>
  <a href="#getting-started" style="margin:0 10px;"><img src="https://img.shields.io/badge/Get+Started-fuchsia?style=for-the-badge&logo=rocket"/></a>
</p>

---

<div align="center">
  <img src="https://raw.githubusercontent.com/aleen42/badges/master/src/github.svg" width="40"/>
  <img src="https://raw.githubusercontent.com/aleen42/badges/master/src/react.svg" width="40"/>
  <img src="https://raw.githubusercontent.com/aleen42/badges/master/src/python.svg" width="40"/>
  <img src="https://raw.githubusercontent.com/aleen42/badges/master/src/fastapi.svg" width="40"/>
  <img src="https://raw.githubusercontent.com/aleen42/badges/master/src/tailwindcss.svg" width="40"/>
  <img src="https://raw.githubusercontent.com/aleen42/badges/master/src/chartjs.svg" width="40"/>
</div>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=0:00ffe7,100:f0f&height=20&section=header"/>
</p>

<h2 align="center" style="color:#00ffe7;">✨ <span style="color:#ff00cc;">Futuristic</span> Features</h2>

- <span style="color:#00ffe7;">🌈 <b>Modern UI</b></span> — Sleek, responsive, and animated with dark/light mode
- <span style="color:#ff00cc;">🤖 <b>AI Extraction</b></span> — Extracts emails, phones, skills, and more from PDFs, DOCX, images, etc.
- <span style="color:#00ffe7;">📊 <b>Analytics Dashboard</b></span> — Instant charts and insights after parsing
- <span style="color:#ff00cc;">🧑‍💻 <b>Bulk Upload</b></span> — Analyze multiple resumes in one go
- <span style="color:#00ffe7;">🔒 <b>Privacy-first</b></span> — Option to anonymize personal info
- <span style="color:#ff00cc;">🎨 <b>Futuristic Visuals</b></span> — Neon glows, gradients, smooth transitions
- <span style="color:#00ffe7;">🪄 <b>Export</b></span> — Download results as CSV or JSON
- <span style="color:#ff00cc;">🌐 <b>Cross-platform</b></span> — Works on macOS, Windows, and Linux

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=0:f0f,100:00ffe7&height=20&section=header"/>
</p>

> **Best viewed in dark mode for full effect!**

---

## 💡 Demo Animation

<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2JzZ3J6a3NwNnVnZ2h6M3U5a2d5b3ZyN3ZqN2VpY3JkZHJ3dGJzZiZjd2NwZ2x2d3RjZzV6a2JpNnB2bGJ3dSZjdD1z/3o7TKtnuHOHHUjR38Y/giphy.gif" width="700" alt="Demo Animation"/>
  <br><i>(Animated demo: parsing, analytics, and export in action!)</i>
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
