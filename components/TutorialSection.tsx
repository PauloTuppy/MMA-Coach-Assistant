import React from 'react';

export const TutorialSection: React.FC = () => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-md h-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-blue-500">
                How to Use the Assistant
            </h2>
            <div className="prose prose-sm max-w-none max-h-[1200px] overflow-y-auto pr-2">
                <h3 className="text-lg font-bold">Welcome to the Future of Fight Analysis</h3>
                <p>
                    The MMA Coach Assistant is a revolutionary tool designed to empower coaches, analysts, and fighters with deep, data-driven insights. By harnessing the power of Google's advanced Gemini AI, this application transforms raw fight footage into a structured, actionable game plan. It moves beyond simple observation, identifying subtle patterns and tendencies that the human eye might miss. This guide will walk you through every feature to ensure you get the most out of your analysis.
                </p>

                <h3 className="text-lg font-bold mt-4">Section 1: The Anatomy of the App</h3>
                <p>
                    The interface is designed for simplicity and efficiency. It's broken down into two main interactive panels: the <strong>Upload Section</strong> on the left and the <strong>Results Section</strong> on the right.
                </p>
                <ul>
                    <li><strong>Fight Details:</strong> This is where you provide the essential context for the analysis. Accurate names and the correct weight class help the AI tailor its analysis more precisely.</li>
                    <li><strong>Video Uploaders:</strong> You have two distinct areas to upload footage—one for your fighter and one for the opponent. This separation is crucial for the AI to understand who is who.</li>
                    <li><strong>Action Buttons:</strong> The "Analyze" button kicks off the AI process, while "Reset" clears the form to start a new analysis.</li>
                    <li><strong>Results Panel:</strong> This initially empty panel is where the AI's comprehensive report will be displayed after the analysis is complete.</li>
                </ul>

                <h3 className="text-lg font-bold mt-4">Section 2: Your Step-by-Step Guide to Analysis</h3>
                <p>
                    Follow these three simple steps to generate a complete fight strategy.
                </p>
                
                <h4 className="font-semibold">Step 1: Provide Fight Context</h4>
                <p>
                    Begin by filling in the "Fight Details" form.
                </p>
                <ul>
                    <li><strong>Fighter Name:</strong> Enter the full name of your athlete. The AI will use this name to personalize the game plan and analysis (e.g., "Recommended Game Plan for [Fighter Name]").</li>
                    <li><strong>Opponent Name:</strong> Enter the opponent's name. This helps the AI differentiate between the two fighters in its report.</li>
                    <li><strong>Weight Class:</strong> Select the appropriate weight class from the dropdown. This adds a critical layer of context. The strategy for a Heavyweight bout can differ significantly from a Flyweight contest due to differences in speed, power, and cardio.</li>
                </ul>

                <h4 className="font-semibold mt-2">Step 2: Upload the Visual Evidence</h4>
                <p>
                    The quality of your input directly impacts the quality of the output. For best results, choose video clips that are clear and representative of each fighter's style.
                </p>
                <ul>
                    <li><strong>Uploading:</strong> You can either click on the upload area to open a file browser or simply drag and drop a video file directly onto it.</li>
                    <li><strong>File Selection:</strong> Choose recent fights if possible. A clip showing a full round, a significant exchange, or a finishing sequence provides more analytical value than a brief, isolated moment.</li>
                    <li><strong>File Validation:</strong> The system automatically checks for file type and size. It accepts standard video formats (MP4, MOV, etc.) up to 50MB. If a file is too large or not a video, you'll receive an error message.</li>
                    <li><strong>Preview and Replace:</strong> Once a video is successfully uploaded, a preview player will appear. This allows you to confirm you've selected the correct file. You can remove it using the '×' button or replace it by simply uploading another file in the same slot.</li>
                </ul>

                <h4 className="font-semibold mt-2">Step 3: Unleash the AI</h4>
                <p>
                    With all the information provided, click the <strong>"Analyze Fights & Generate Plan"</strong> button.
                </p>
                <ul>
                    <li><strong>The Loading State:</strong> The button will become disabled, and a spinner will appear. During this time, your application is securely transferring the video data and your text prompts to the Gemini API. The AI is processing multiple frames per second, identifying stances, strikes, defensive maneuvers, and movement patterns.</li>
                    <li><strong>Patience is Key:</strong> This process can take a minute or more, depending on the size of your video files and current server load. The system is performing a complex, resource-intensive task.</li>
                    <li><strong>Receiving the Results:</strong> Once Gemini completes its analysis, it sends back a structured report. The loading indicator will disappear, and the Results Section will populate with the complete breakdown.</li>
                </ul>

                <h3 className="text-lg font-bold mt-4">Section 3: Deciphering the AI's Report</h3>
                <p>
                    The analysis is broken down into several key sections for easy digestion.
                </p>
                
                <h4 className="font-semibold">Head-to-Head Analysis</h4>
                <p>This is the top-line summary. The <strong>Prediction</strong> gives you the AI's assessment of the likely outcome based on the footage provided. The <strong>Confidence</strong> score indicates how strongly the AI leans towards that prediction based on the available data. Treat this as a data-driven hypothesis, not a certainty.</p>

                <h4 className="font-semibold mt-2">Fighter & Opponent Profiles</h4>
                <p>Here, you get a side-by-side comparison of the two athletes.</p>
                <ul>
                    <li><strong>Fighting Style:</strong> A concise description of each fighter's overall approach (e.g., "aggressive brawler," "technical out-fighter," "submission specialist").</li>
                    <li><strong>Strengths:</strong> What the AI identified as the fighter's key assets. For your fighter, these are weapons to sharpen. For the opponent, these are threats to neutralize.</li>
                    <li><strong>Weaknesses:</strong> The most critical part. These are the observed vulnerabilities and bad habits. For your fighter, these are the holes to patch in training. For the opponent, these are the targets for your game plan.</li>
                </ul>

                <h4 className="font-semibold mt-2">Recommended Game Plan</h4>
                <p>This is the actionable core of the report, designed specifically for your fighter.</p>
                <ul>
                    <li><strong>Strategy:</strong> The overarching philosophy for the fight. It answers the question, "What is our path to victory?" (e.g., "Maintain distance and win a decision on points," "Pressure the opponent against the cage and seek a takedown").</li>
                    <li><strong>Key Tactics:</strong> Specific, in-fight instructions that support the main strategy (e.g., "Circle away from their power hand," "Use teep kicks to manage distance," "Attack the body early to drain their cardio").</li>
                    <li><strong>Recommended Drills:</strong> Concrete training exercises that build the skills needed to execute the tactics. This bridges the gap between analysis and preparation (e.g., "3-minute rounds of shadowboxing focusing on lateral movement," "Sparring sessions starting from the clinch against the wall").</li>
                </ul>
                
                <h3 className="text-lg font-bold mt-4">Section 4: The Technology Behind the Scenes</h3>
                <p>
                    This assistant is powered by <strong>Google Gemini</strong>, a state-of-the-art multimodal AI model. "Multimodal" means it can understand and process information from different sources—text, audio, images, and video—simultaneously.
                </p>
                <p>
                    When you upload a video, you aren't just sending a file. The Gemini API analyzes the video frame by frame, recognizing actions like jabs, kicks, takedown attempts, and defensive postures. It connects these visual cues with the text prompt you provided (the fighters' names and weight class) to build a holistic understanding of the matchup. By leveraging a structured JSON output format, we ensure the AI's complex analysis is returned in a clean, organized way that the application can reliably display every time.
                </p>

                <h3 className="text-lg font-bold mt-4">Section 5: Pro-Tips for Best Results</h3>
                <ul>
                    <li><strong>Quality In, Quality Out:</strong> Use the clearest, most stable footage you have. Shaky, pixelated, or obstructed videos will limit the AI's ability to perform an accurate analysis.</li>
                    <li><strong>Contextual Clips:</strong> A clip showing a fighter under pressure reveals more about their defense than a clip of them on the heavy bag. A clip showing how they react after getting hit is invaluable. Choose footage that tells a story.</li>
                    <li><strong>The AI is an Assistant, Not a Replacement:</strong> This tool is designed to augment your coaching expertise, not replace it. Use the AI's analysis as a second opinion or a starting point. Your experience and intuition are what will ultimately translate these insights into a winning performance.</li>
                </ul>
            </div>
        </div>
    );
};