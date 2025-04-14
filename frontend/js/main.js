document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const translateBtn = document.getElementById('translateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const speakBtn = document.getElementById('speakBtn');
    const saveBtn = document.getElementById('saveBtn');
    const domainSelect = document.getElementById('domainSelect');
    const charCount = document.getElementById('charCount');
    const loaderIcon = document.getElementById('loaderIcon');
    const apiStatus = document.getElementById('apiStatus');

    // API Configuration
    const API_ENDPOINT = 'api/translate.php';
    const API_KEY = 'EDU_2024';

    // Character Counter
    inputText.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = `${count}/5000`;
        charCount.className = count >= 5000 ? 
            'text-sm text-red-500' : 'text-sm text-gray-500';
    });

    // Translation Function
    async function translateText() {
        const text = inputText.value.trim();
        const domain = domainSelect.value;
        
        if (!text) {
            alert('Please enter text to translate');
            return;
        }

        translateBtn.disabled = true;
        loaderIcon.classList.remove('hidden');
        outputText.innerHTML = '<p class="text-gray-500">Translating...</p>';

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': API_KEY
                },
                body: JSON.stringify({
                    text: text,
                    domain: domain
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Translation failed');
            }

            outputText.innerHTML = `<p class="leading-relaxed">${data.translatedText}</p>`;
            apiStatus.textContent = 'API Connected';
            apiStatus.previousElementSibling.className = 'inline-block w-3 h-3 rounded-full bg-green-500 mr-2';
        } catch (error) {
            console.error('Translation error:', error);
            outputText.innerHTML = `<p class="text-red-600">Error: ${error.message}</p>`;
            apiStatus.textContent = 'API Connection Failed';
            apiStatus.previousElementSibling.className = 'inline-block w-3 h-3 rounded-full bg-red-500 mr-2';
        } finally {
            translateBtn.disabled = false;
            loaderIcon.classList.add('hidden');
        }
    }

    // Event Listeners
    translateBtn.addEventListener('click', translateText);
    
    clearBtn.addEventListener('click', function() {
        inputText.value = '';
        outputText.innerHTML = '<p class="text-gray-400">Translated Hindi text will appear here...</p>';
        charCount.textContent = '0/5000';
        charCount.className = 'text-sm text-gray-500';
    });
    
    copyBtn.addEventListener('click', function() {
        const textToCopy = outputText.innerText;
        if (textToCopy && !textToCopy.includes('Translated Hindi text')) {
            navigator.clipboard.writeText(textToCopy);
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = 'Copy', 2000);
        }
    });
    
    speakBtn.addEventListener('click', function() {
        const textToSpeak = outputText.innerText;
        if (textToSpeak && !textToSpeak.includes('Translated Hindi text')) {
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'hi-IN';
            speechSynthesis.speak(utterance);
        }
    });
    
    saveBtn.addEventListener('click', function() {
        alert('PDF export would be implemented in production\nusing libraries like jsPDF or window.print()');
    });

    inputText.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            translateText();
        }
    });
});