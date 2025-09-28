# Phishing Detection Demo

A complete phishing detection application with Flask backend and HTML frontend.

## Files Structure

```
├── app.py                    # Flask backend application
├── templates/
│   └── index.html           # Frontend HTML page
├── requirements.txt         # Python dependencies
├── char_vectorizer.pkl     # Character-level vectorizer
├── word_vectorizer.pkl     # Word-level vectorizer
├── phishing_model.pkl      # Trained phishing detection model
└── README.md               # This file
```

## Setup and Installation

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Make sure all .pkl files are in the same directory as app.py:**
   - `char_vectorizer.pkl`
   - `word_vectorizer.pkl` 
   - `phishing_model.pkl`

## Running the Application

1. **Start the Flask server:**
   ```bash
   python app.py
   ```

2. **Open your web browser and go to:**
   ```
   http://localhost:5000
   ```

## Usage

1. Enter a suspicious URL, email, or message in the text area
2. Click "Check for Phishing" button
3. The application will return either "Phishing" or "Safe"

## API Endpoints

- `GET /` - Serves the main web interface
- `POST /predict` - Predicts if text is phishing
  - Input: `{"text": "your text here"}`
  - Output: `{"prediction": "Phishing"}` or `{"prediction": "Safe"}`
- `GET /health` - Health check endpoint

## Example Usage

Try these examples:
- **Suspicious URL:** `https://secure-bank-login.verify-account.com/urgent-action-required`
- **Phishing Email:** `URGENT: Your account will be suspended! Click here to verify your identity immediately.`
- **Safe URL:** `https://www.google.com`

## Troubleshooting

- Make sure all .pkl files are present in the same directory as app.py
- Check that Flask is running on port 5000
- If models fail to load, check the console output for error messages
