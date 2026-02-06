# ResumeSense

**ResumeSense** is an enterprise-grade, privacy-focused resume parsing and analytics platform designed to streamline the recruitment process through intelligent automation. By leveraging advanced Natural Language Processing (NLP) and Optical Character Recognition (OCR), ResumeSense transforms unstructured resume data into structured, actionable insights.

Designed for scalability and precision, this full-stack application enables users to process resumes in bulk, visualize candidate metrics through an interactive dashboard, and export standardized data for downstream integration.

---

## Key Capabilities

*   **Intelligent Extraction**: Automatically identifies and segments critical candidate information—including contact details, technical skills, and educational background—from diverse file formats (PDF, DOCX, Images).
*   **Privacy-First Architecture**: Built with data sovereignty in mind. All processing occurs locally on the host machine; no sensitive candidate data is transmitted to external servers.
*   **Visual Analytics**: A comprehensive dashboard provides immediate visual feedback on candidate pools, highlighting skill distributions and key metrics.
*   **Bulk Operations**: Optimized for high-volume environments, allowing simultaneous processing of multiple documents without performance degradation.
*   **Format Agnostic**: Seamlessly handles text-based and image-based documents using integrated OCR technologies.
*   **Data Export**: Effortlessly export parsed results in CSV or JSON format for integration with existing HR systems.

---

## Technology Stack

This project is built on a robust, modern stack ensuring performance and maintainability:

| Layer         | Technology                                                                 |
| :------------ | :------------------------------------------------------------------------- |
| **Backend**   | FastAPI (Python 3.9+) - High performance with native asynchronous support. |
| **Frontend**  | React.js - A responsive, component-based user interface.                   |
| **NLP & AI**  | Spacy, Presidio - Powers entity recognition and PII management.            |
| **Visualization** | Chart.js (Frontend), Matplotlib (Backend) - Drives analytical reporting. |
| **Styling**   | TailwindCSS - A clean, utility-first design system.                        |

---

## Getting Started

### Prerequisites

*   Python 3.9 or higher
*   Node.js 16 or higher

### Installation

**1. Clone the Repository**

```bash
git clone https://github.com/abhi-1408-shek/RESUME_PARSER.git
cd resume-sense
```

**2. Backend Setup**

Navigate to the backend directory and create a virtual environment to manage dependencies.

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**3. Frontend Setup**

Install the necessary Node.js packages for the user interface.

```bash
cd ../frontend
npm install
```

---

## Usage

**Start the Backend Server**

Initialize the FastAPI server. It will listen for API requests at `http://localhost:8000`.

```bash
cd backend
uvicorn main:app --reload
```

**Launch the User Interface**

Start the React development server to interact with the application.

```bash
cd frontend
npm start
```

Access the application at `http://localhost:3000`.

---

## Architecture and Security

ResumeSense adopts a decoupled architecture where the React frontend communicates with the FastAPI backend via RESTful endpoints.

Security is paramount. The system includes built-in PII redaction capabilities utilizing Microsoft's Presidio library, ensuring that shared reports can be anonymized automatically. All data processing is performed locally, guaranteeing that no candidate information ever leaves the host environment.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

**Engineered by Abhishek**
