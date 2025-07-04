<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Question Solver</title>
    <style>
        /* Basic Styling */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f2f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .container {
            width: 90%;
            max-width: 800px;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        header {
            background-color: #4285F4;
            color: white;
            padding: 20px;
            text-align: center;
        }

        header h1 {
            margin: 0;
            font-size: 1.8em;
        }

        main {
            padding: 20px;
            flex-grow: 1;
        }

        #question-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        textarea {
            width: 100%;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1em;
            resize: vertical;
            min-height: 100px;
        }

        button {
            background-color: #34a853;
            color: white;
            border: none;
            padding: 15px;
            border-radius: 8px;
            font-size: 1em;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #2c8c4a;
        }

        #response-container {
            margin-top: 20px;
            padding: 20px;
            background-color: #e8f0fe;
            border-radius: 8px;
            display: none;
        }

        #response-container h2 {
            margin-top: 0;
            color: #1a73e8;
        }
        
        #response-text {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
            display: none; /* Hidden by default */
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 600px) {
            .container {
                width: 100%;
                height: 100vh;
                border-radius: 0;
            }

            header h1 {
                font-size: 1.5em;
            }

            button {
                padding: 12px;
            }
        }
    </style>
</head>
<body>

    <div class="container">
        <header>
            <h1>AI Question Solver</h1>
        </header>
        <main>
            <form id="question-form">
                <textarea id="question-input" placeholder="Ask anything about Hindi, English, Math, Physics, Chemistry, Bio, etc..."></textarea>
                <button type="submit">Ask AI</button>
            </form>
            <div class="loader" id="loader"></div>
            <div id="response-container">
                <h2>Answer:</h2>
                <p id="response-text"></p>
            </div>
        </main>
    </div>

    <script type="module">
        import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

        // Replace with your actual API key
        const API_KEY = "YOUR_API_KEY";

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const questionForm = document.getElementById('question-form');
        const questionInput = document.getElementById('question-input');
        const responseContainer = document.getElementById('response-container');
        const responseText = document.getElementById('response-text');
        const loader = document.getElementById('loader');

        questionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const question = questionInput.value.trim();

            if (question) {
                responseText.textContent = '';
                responseContainer.style.display = 'none';
                loader.style.display = 'block';

                try {
                    const prompt = `Solve the following problem: ${question}`;
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    const text = response.text();
                    
                    responseText.textContent = text;
                    responseContainer.style.display = 'block';
                } catch (error) {
                    console.error("Error generating content:", error);
                    responseText.textContent = "Sorry, I couldn't process your request. Please try again.";
                    responseContainer.style.display = 'block';
                } finally {
                    loader.style.display = 'none';
                }
            }
        });
    </script>
</body>
</html>
