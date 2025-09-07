# MMA Coach Assistant - Powered by Google Gemini

This web application serves as a powerful tool for MMA coaches and analysts, leveraging the multimodal capabilities of the Google Gemini API to provide deep insights into fighter performance and generate strategic game plans. By analyzing video footage of two fighters, the app delivers a comprehensive breakdown of their styles, strengths, and weaknesses.

## ✨ Key Features

-   **Detailed Fighter Input**: Enter names and select the weight class for a tailored analysis.
-   **Dual Video Upload**: Upload separate fight videos for your fighter and their opponent, complete with drag-and-drop support, file validation, and video previews.
-   **AI-Powered Video Analysis**: Utilizes the Gemini 1.5 Flash model to process and understand the content of the uploaded fight videos.
-   **Structured JSON Output**: Employs Gemini's JSON mode to receive a clean, predictable, and strongly-typed analysis result.
-   **Comprehensive Reporting**: The analysis includes:
    -   **Fighter & Opponent Profiles**: Detailed breakdowns of fighting style, strengths, and weaknesses for both combatants.
    -   **Head-to-Head Prediction**: An AI-generated fight prediction with a confidence score.
    -   **Strategic Game Plan**: A complete, actionable game plan for your fighter, including overall strategy, key tactics, and recommended training drills.
-   **Responsive & Modern UI**: Built with React and Tailwind CSS for a clean, intuitive, and mobile-friendly user experience.
-   **Clear State Management**: Provides real-time feedback for loading, error, and success states.

## 🤖 How It Works

The application streamlines the complex task of fight analysis into a simple, three-step process:

1.  **Input Data**: The coach fills out the form with the names of their fighter and the opponent, and selects the correct weight class.
2.  **Upload Footage**: The coach uploads a video file for each fighter. The application validates the file type and size, showing a preview once successfully selected.
3.  **Analyze & Generate**: The coach clicks the "Analyze" button. The application securely sends the videos and prompt to the Gemini API. Gemini analyzes the footage and returns a structured JSON object containing the full analysis.
4.  **Review Results**: The results are displayed in a clean, easy-to-read format, breaking down the analysis into actionable insights and a complete game plan.

## 🛠️ Technology Stack

-   **Frontend**: [React](https://reactjs.org/) (with TypeScript)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI Model**: [Google Gemini API](https://ai.google.dev/) (`@google/genai` SDK)
-   **Build Tool**: Vite (as indicated by the default `index.html`)

## 📁 Project Structure

```
/
├── components/          # Reusable React components
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── InsightCard.tsx
│   ├── ResultsSection.tsx
│   ├── Spinner.tsx
│   ├── UploadSection.tsx
│   └── VideoUploader.tsx
├── services/            # Modules for external API calls
│   └── geminiService.ts   # Core logic for interacting with the Gemini API
├── App.tsx              # Main application component and state management
├── constants.ts         # Shared constants (weight classes, file size limits)
├── index.html           # HTML entry point
├── index.tsx            # React application bootstrap
├── metadata.json        # Application metadata
└── types.ts             # TypeScript type definitions for the data structures
```
