
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart GST Calculator</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        :root {
            --primary: #4361ee;
            --secondary: #3a0ca3;
            --accent: #4895ef;
            --light: #f8f9fa;
            --dark: #212529;
            --success: #4cc9f0;
            --warning: #f72585;
            --card-bg: #ffffff;
            --shadow: rgba(0, 0, 0, 0.1);
            --gradient-start: #4361ee;
            --gradient-end: #3a0ca3;
            --gst-color: #4caf50;
        }

        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
            color: var(--dark);
            line-height: 1.6;
            min-height: 100vh;
            padding: 20px;
            position: relative;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
        }

        header {
            text-align: center;
            padding: 20px 0;
            margin-bottom: 20px;
            position: relative;
        }

        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 15px;
        }

        .logo i {
            background: var(--gst-color);
            color: white;
            width: 70px;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 32px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .logo h1 {
            font-size: 2.4rem;
            color: var(--gst-color);
            font-weight: 700;
            letter-spacing: -0.5px;
        }

        .subtitle {
            color: #6c757d;
            font-size: 1.2rem;
            max-width: 700px;
            margin: 10px auto 0;
            font-weight: 300;
        }

        .card {
            background: var(--card-bg);
            border-radius: 20px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            padding: 30px;
            margin-bottom: 30px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .card-title {
            font-size: 1.6rem;
            color: var(--gst-color);
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 12px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f4f8;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 25px;
        }

        .input-row {
            display: flex;
            gap: 20px;
        }

        .input-column {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        label {
            font-weight: 600;
            color: #555;
            font-size: 1.05rem;
        }

        input, select {
            padding: 14px 18px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 1.05rem;
            background: #f8fafc;
            transition: all 0.3s;
        }

        input:focus, select:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 4px rgba(72, 149, 239, 0.2);
        }

        .tabs {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
        }

        .tab {
            flex: 1;
            text-align: center;
            padding: 14px;
            background: #edf2f7;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            font-size: 1.05rem;
        }

        .tab.active {
            background: var(--gst-color);
            color: white;
            box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
        }

        .image-upload-container {
            border: 3px dashed #cbd5e0;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
            min-height: 200px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #f8fafc;
            margin-bottom: 20px;
        }

        .image-upload-container:hover {
            border-color: var(--gst-color);
            background: rgba(76, 175, 80, 0.05);
        }

        .image-upload-container i {
            font-size: 3.5rem;
            color: var(--gst-color);
            margin-bottom: 20px;
            transition: all 0.3s;
        }

        .image-upload-container:hover i {
            transform: translateY(-5px);
        }

        .image-upload-container p {
            margin-bottom: 12px;
            color: #4a5568;
            font-size: 1.1rem;
        }

        .image-upload-container .btn {
            background: var(--gst-color);
            color: white;
            padding: 10px 25px;
            border-radius: 10px;
            font-weight: 600;
            display: inline-block;
            transition: all 0.3s;
            font-size: 1.05rem;
        }

        .image-upload-container .btn:hover {
            background: #3d8b40;
            transform: translateY(-2px);
        }

        #imagePreview {
            max-width: 100%;
            max-height: 220px;
            margin-top: 20px;
            border-radius: 10px;
            display: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .btn-container {
            display: flex;
            gap: 18px;
            margin-top: 15px;
        }

        .btn {
            flex: 1;
            padding: 16px;
            border: none;
            border-radius: 15px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .btn-primary {
            background: var(--gst-color);
            color: white;
        }

        .btn-primary:hover {
            background: #3d8b40;
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(61, 139, 64, 0.3);
        }

        .btn-secondary {
            background: #e2e8f0;
            color: #4a5568;
        }

        .btn-secondary:hover {
            background: #cbd5e0;
            transform: translateY(-3px);
        }

        #response {
            min-height: 250px;
            padding: 25px;
            background: #f8fafc;
            border-radius: 15px;
            border: 2px solid #e2e8f0;
        }

        .response-content {
            line-height: 1.8;
            font-size: 1.1rem;
        }

        .response-content img {
            max-width: 100%;
            border-radius: 10px;
            margin: 15px 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .loading {
            display: none;
            text-align: center;
            padding: 40px;
        }

        .loading i {
            font-size: 3rem;
            color: var(--gst-color);
            margin-bottom: 20px;
            animation: spin 1.5s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .ad-container {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
        }

        .ad-label {
            font-size: 0.85rem;
            color: #718096;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 600;
        }

        footer {
            text-align: center;
            padding: 25px;
            color: #718096;
            font-size: 0.95rem;
            margin-top: 30px;
        }

        .error {
            background: #ffebee;
            color: #c62828;
            padding: 18px;
            border-radius: 12px;
            margin: 15px 0;
            border-left: 4px solid #c62828;
        }

        .result-container {
            background: #e8f5e9;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid var(--gst-color);
        }

        .result-title {
            font-weight: 700;
            color: var(--gst-color);
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .result-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 20px;
        }

        .result-item {
            background: white;
            border-radius: 10px;
            padding: 15px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }

        .result-label {
            font-size: 0.9rem;
            color: #718096;
            margin-bottom: 5px;
        }

        .result-value {
            font-size: 1.4rem;
            font-weight: 700;
            color: var(--gst-color);
        }

        .gst-rate-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-top: 10px;
        }

        .gst-rate {
            background: #e8f5e9;
            border: 2px solid #c8e6c9;
            border-radius: 10px;
            padding: 10px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 600;
            color: #2e7d32;
        }

        .gst-rate.selected {
            background: var(--gst-color);
            color: white;
            border-color: var(--gst-color);
        }

        .gst-rate:hover {
            background: #c8e6c9;
        }

        @media (max-width: 768px) {
            .logo h1 {
                font-size: 1.9rem;
            }
            
            .card {
                padding: 25px;
            }
            
            .btn-container {
                flex-direction: column;
            }
            
            .tabs {
                flex-direction: column;
            }
            
            .image-upload-container {
                padding: 20px;
            }
            
            .input-row {
                flex-direction: column;
                gap: 15px;
            }
            
            .result-grid {
                grid-template-columns: 1fr;
            }
            
            .gst-rate-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">
                <i class="fas fa-calculator"></i>
                <h1>Smart GST Calculator</h1>
            </div>
            <p class="subtitle">Calculate GST instantly or extract from receipts with AI</p>
            
            <div class="ad-container">
                <div class="ad-label">Advertisement</div>
                <div id="ad-banner">
                    <script type="text/javascript">
                        atOptions = { 
                            'key' : '286ac1ac73458ecfba3c2f9f53473f3e',
                            'format' : 'iframe',
                            'height' : 50,
                            'width' : 320,
                            'params' : {}
                        };
                    </script>
                    <script type="text/javascript" src="//www.highperformanceformat.com/286ac1ac73458ecfba3c2f9f53473f3e/invoke.js"></script>
                </div>
            </div>
        </header>
        
        <main>
            <div class="card">
                <h2 class="card-title"><i class="fas fa-calculator"></i> GST Calculator</h2>
                
                <div class="tabs">
                    <div class="tab active" data-tab="manual">Manual Calculation</div>
                    <div class="tab" data-tab="image">Scan Receipt</div>
                </div>
                
                <div class="input-group" id="manualTab">
                    <div class="input-row">
                        <div class="input-column">
                            <label for="amount">Amount (₹)</label>
                            <input type="number" id="amount" placeholder="Enter amount" value="1000">
                        </div>
                        <div class="input-column">
                            <label for="gstType">GST Type</label>
                            <select id="gstType">
                                <option value="inclusive">Inclusive of GST</option>
                                <option value="exclusive">Exclusive of GST</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="input-column">
                        <label>Select GST Rate</label>
                        <div class="gst-rate-grid">
                            <div class="gst-rate" data-rate="5">5%</div>
                            <div class="gst-rate" data-rate="12">12%</div>
                            <div class="gst-rate selected" data-rate="18">18%</div>
                            <div class="gst-rate" data-rate="28">28%</div>
                        </div>
                    </div>
                </div>
                
                <div class="input-group" id="imageTab" style="display: none;">
                    <div class="image-upload-container" id="dropArea">
                        <i class="fas fa-receipt"></i>
                        <p>Drag & drop your receipt here</p>
                        <p>OR</p>
                        <div class="btn">Select Receipt</div>
                        <input type="file" id="imageUpload" accept="image/*" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
                        <img id="imagePreview" alt="Preview">
                    </div>
                    
                    <div class="api-info">
                        <i class="fas fa-info-circle"></i> Using AI to extract GST details from your receipt
                    </div>
                </div>
                
                <div class="btn-container">
                    <button class="btn btn-primary" id="calculateBtn">
                        <i class="fas fa-calculator"></i> Calculate GST
                    </button>
                    <button class="btn btn-secondary" id="clearBtn">
                        <i class="fas fa-eraser"></i> Clear
                    </button>
                </div>
            </div>
            
            <div class="card">
                <h2 class="card-title"><i class="fas fa-file-invoice-dollar"></i> Calculation Results</h2>
                
                <div class="loading" id="loading">
                    <i class="fas fa-spinner"></i>
                    <p>Analyzing receipt. Please wait...</p>
                </div>
                
                <div id="response">
                    <div class="response-content" id="responseContent">
                        <div class="result-container">
                            <div class="result-title">
                                <i class="fas fa-calculator"></i> GST Calculation
                            </div>
                            <p>Enter amount and GST rate, then click "Calculate GST"</p>
                            <div class="result-grid">
                                <div class="result-item">
                                    <div class="result-label">Original Amount</div>
                                    <div class="result-value">₹0.00</div>
                                </div>
                                <div class="result-item">
                                    <div class="result-label">GST Amount</div>
                                    <div class="result-value">₹0.00</div>
                                </div>
                                <div class="result-item">
                                    <div class="result-label">Total Amount</div>
                                    <div class="result-value">₹0.00</div>
                                </div>
                                <div class="result-item">
                                    <div class="result-label">GST Rate</div>
                                    <div class="result-value">0%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="ad-container">
                <div class="ad-label">Advertisement</div>
                <div id="ad-banner-bottom">
                    <!-- Ad will be inserted by script -->
                </div>
            </div>
        </main>
        
        <footer>
            <p>© 2023 Smart GST Calculator | Powered by Google Gemini AI</p>
            <p>Disclaimer: This tool provides estimates only. Verify with a tax professional.</p>
        </footer>
    </div>
    
    <script>
        // Initialize the app when the page loads
        document.addEventListener('DOMContentLoaded', function() {
            // API Configuration - Using the latest Gemini model
            const API_KEY = "AIzaSyBTw0VtRGbNsvjRfTO1yuxV8VthX9qJ7Wg";
            const MODEL_NAME = "gemini-1.5-flash";
            
            // DOM Elements
            const manualTab = document.querySelector('[data-tab="manual"]');
            const imageTab = document.querySelector('[data-tab="image"]');
            const manualInputTab = document.getElementById('manualTab');
            const imageInputTab = document.getElementById('imageTab');
            const amountInput = document.getElementById('amount');
            const gstTypeSelect = document.getElementById('gstType');
            const gstRates = document.querySelectorAll('.gst-rate');
            const imageUpload = document.getElementById('imageUpload');
            const imagePreview = document.getElementById('imagePreview');
            const calculateBtn = document.getElementById('calculateBtn');
            const clearBtn = document.getElementById('clearBtn');
            const responseContent = document.getElementById('responseContent');
            const loading = document.getElementById('loading');
            const dropArea = document.getElementById('dropArea');
            
            // Current GST rate (default 18%)
            let currentGstRate = 18;
            
            // Set up tab switching
            manualTab.addEventListener('click', () => {
                manualTab.classList.add('active');
                imageTab.classList.remove('active');
                manualInputTab.style.display = 'flex';
                imageInputTab.style.display = 'none';
            });
            
            imageTab.addEventListener('click', () => {
                imageTab.classList.add('active');
                manualTab.classList.remove('active');
                imageInputTab.style.display = 'flex';
                manualInputTab.style.display = 'none';
            });
            
            // GST rate selection
            gstRates.forEach(rate => {
                rate.addEventListener('click', () => {
                    // Remove selected class from all
                    gstRates.forEach(r => r.classList.remove('selected'));
                    // Add selected class to clicked
                    rate.classList.add('selected');
                    currentGstRate = parseFloat(rate.dataset.rate);
                });
            });
            
            // Handle image preview
            imageUpload.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    // Check file size (max 4MB)
                    if (file.size > 4 * 1024 * 1024) {
                        alert("Image is too large. Please select an image smaller than 4MB.");
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        imagePreview.src = e.target.result;
                        imagePreview.style.display = 'block';
                        dropArea.querySelector('p').textContent = "Receipt selected!";
                    }
                    reader.readAsDataURL(file);
                }
            });
            
            // Drag and drop functionality
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, preventDefaults, false);
            });
            
            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            ['dragenter', 'dragover'].forEach(eventName => {
                dropArea.addEventListener(eventName, highlight, false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, unhighlight, false);
            });
            
            function highlight() {
                dropArea.style.borderColor = '#4361ee';
                dropArea.style.backgroundColor = 'rgba(67, 97, 238, 0.1)';
            }
            
            function unhighlight() {
                dropArea.style.borderColor = '#cbd5e0';
                dropArea.style.backgroundColor = '';
            }
            
            dropArea.addEventListener('drop', handleDrop, false);
            
            function handleDrop(e) {
                const dt = e.dataTransfer;
                const files = dt.files;
                imageUpload.files = files;
                
                // Trigger change event to show preview
                const event = new Event('change');
                imageUpload.dispatchEvent(event);
            }
            
            // Clear button functionality
            clearBtn.addEventListener('click', () => {
                amountInput.value = '';
                imageUpload.value = '';
                imagePreview.style.display = 'none';
                updateResults(0, 0, 0, 0);
                dropArea.querySelector('p').textContent = "Drag & drop your receipt here";
            });
            
            // Calculate button functionality
            calculateBtn.addEventListener('click', async () => {
                const isManualTabActive = manualTab.classList.contains('active');
                
                if (isManualTabActive) {
                    const amount = parseFloat(amountInput.value);
                    if (!amount || amount <= 0) {
                        alert('Please enter a valid amount');
                        return;
                    }
                    calculateGST(amount);
                } else {
                    if (!imageUpload.files.length) {
                        alert('Please upload a receipt image');
                        return;
                    }
                    await processReceipt(imageUpload.files[0]);
                }
            });
            
            // Calculate GST manually
            function calculateGST(amount) {
                const gstType = gstTypeSelect.value;
                let originalAmount, gstAmount, totalAmount;
                
                if (gstType === 'inclusive') {
                    // GST is included in the amount
                    originalAmount = (amount * 100) / (100 + currentGstRate);
                    gstAmount = amount - originalAmount;
                    totalAmount = amount;
                } else {
                    // GST is added to the amount
                    originalAmount = amount;
                    gstAmount = (amount * currentGstRate) / 100;
                    totalAmount = amount + gstAmount;
                }
                
                updateResults(originalAmount, gstAmount, totalAmount, currentGstRate);
            }
            
            // Process receipt with AI
            async function processReceipt(imageFile) {
                showLoading(true);
                
                try {
                    // Convert image to base64
                    const imageData = await fileToBase64(imageFile);
                    
                    // Construct the prompt
                    const prompt = `You are an expert GST analyst. Analyze this receipt image and extract the following details in JSON format: 
                    {
                        "original_amount": "The base amount before GST",
                        "gst_rate": "The GST rate applied (as percentage)",
                        "gst_amount": "The GST amount paid",
                        "total_amount": "The total amount including GST"
                    }
                    Only respond with the JSON object. Do not include any additional text or explanations.`;
                    
                    // Call the Gemini API with image
                    const response = await callGeminiVisionAPI(prompt, imageData);
                    
                    // Try to parse the JSON response
                    try {
                        const gstData = JSON.parse(response);
                        const originalAmount = parseFloat(gstData.original_amount);
                        const gstRate = parseFloat(gstData.gst_rate);
                        const gstAmount = parseFloat(gstData.gst_amount);
                        const totalAmount = parseFloat(gstData.total_amount);
                        
                        updateResults(originalAmount, gstAmount, totalAmount, gstRate);
                    } catch (e) {
                        throw new Error("Could not parse GST data from receipt. Please try a clearer image.");
                    }
                } catch (error) {
                    console.error('Error processing receipt:', error);
                    displayError(error.message || 'Sorry, we encountered an error processing your receipt.');
                } finally {
                    showLoading(false);
                }
            }
            
            // Update results display
            function updateResults(originalAmount, gstAmount, totalAmount, gstRate) {
                responseContent.innerHTML = `
                    <div class="result-container">
                        <div class="result-title">
                            <i class="fas fa-file-invoice-dollar"></i> GST Calculation
                        </div>
                        <div class="result-grid">
                            <div class="result-item">
                                <div class="result-label">Original Amount</div>
                                <div class="result-value">₹${originalAmount.toFixed(2)}</div>
                            </div>
                            <div class="result-item">
                                <div class="result-label">GST Amount</div>
                                <div class="result-value">₹${gstAmount.toFixed(2)}</div>
                            </div>
                            <div class="result-item">
                                <div class="result-label">Total Amount</div>
                                <div class="result-value">₹${totalAmount.toFixed(2)}</div>
                            </div>
                            <div class="result-item">
                                <div class="result-label">GST Rate</div>
                                <div class="result-value">${gstRate.toFixed(2)}%</div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            // Display error
            function displayError(message) {
                responseContent.innerHTML = `
                    <div class="error">
                        <i class="fas fa-exclamation-triangle"></i> ${message}
                    </div>
                `;
            }
            
            // Convert file to base64
            function fileToBase64(file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            }
            
            // Show/hide loading indicator
            function showLoading(show) {
                loading.style.display = show ? 'block' : 'none';
                calculateBtn.disabled = show;
            }
            
            // Call Gemini API for vision (image)
            async function callGeminiVisionAPI(prompt, imageData) {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
                
                // Extract the base64 string without the data URL prefix
                const base64Image = imageData.split(',')[1];
                
                const payload = {
                    contents: [{
                        role: "user",
                        parts: [
                            { text: prompt },
                            {
                                inline_data: {
                                    mime_type: "image/jpeg",
                                    data: base64Image
                                }
                            }
                        ]
                    }],
                    generationConfig: {
                        temperature: 0.3,
                        topK: 32,
                        topP: 0.95,
                        maxOutputTokens: 2048
                    }
                };
                
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error?.message || 'API request failed');
                    }
                    
                    const data = await response.json();
                    
                    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                        throw new Error('Invalid response from API');
                    }
                    
                    return data.candidates[0].content.parts[0].text;
                } catch (error) {
                    // Handle network errors specifically
                    if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
                        throw new Error('Network error. Please check your internet connection.');
                    }
                    throw error;
                }
            }
            
            // Initialize the bottom ad
            function initBottomAd() {
                const adScript = document.createElement('script');
                adScript.type = 'text/javascript';
                adScript.innerHTML = `
                    atOptions = { 
                        'key' : '286ac1ac73458ecfba3c2f9f53473f3e',
                        'format' : 'iframe',
                        'height' : 50,
                        'width' : 320,
                        'params' : {}
                    };
                `;
                document.getElementById('ad-banner-bottom').appendChild(adScript);
                
                const invokeScript = document.createElement('script');
                invokeScript.type = 'text/javascript';
                invokeScript.src = '//www.highperformanceformat.com/286ac1ac73458ecfba3c2f9f53473f3e/invoke.js';
                document.getElementById('ad-banner-bottom').appendChild(invokeScript);
            }
            
            // Initialize the app
            initBottomAd();
            
            // Auto-calculate on page load
            setTimeout(() => {
                calculateBtn.click();
            }, 500);
        });
    </script>
</body>
</html>
