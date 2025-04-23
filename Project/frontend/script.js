const translateButton = document.getElementById('translateBtn'); // Button to trigger translation
const textInput = document.getElementById('inputText'); // English input textarea
const translatedTextDiv = document.getElementById('outputText'); // Hindi output container
const loaderIcon = document.getElementById('loaderIcon');
const domainSelect = document.getElementById('domainSelect');

// Translate Button Handler
translateButton.addEventListener('click', async () => {
  const text = textInput.value.trim();
  const selectedDomain = domainSelect.value;

  if (!text) {
    alert('Please enter text to translate.');
    return;
  }

  // Disable the translate button while the request is in progress
  translateButton.disabled = true;

  try {
    // Show loading icon
    loaderIcon.classList.remove('hidden');

    // Send POST request to backend
    const response = await fetch('http://localhost:5004/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        sourceLang: 'en',
        targetLang: 'hi',
        domain: selectedDomain
      })
    });

    // Check if response is valid and contains JSON
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid or empty JSON response from server");
    }

    // Parse response JSON
    let data;
    try {
        data = await response.json();
    } catch (parseError) {
        throw new Error('Invalid JSON response from server');
    }


    // Hide loader
    loaderIcon.classList.add('hidden');

    // Display translated text
    if (data.success) {
      translatedTextDiv.innerHTML = `<p class="text-gray-800">${data.translatedText}</p>`;
    } else {
      translatedTextDiv.innerHTML = `<p class="text-red-500">Error: ${data.error}</p>`;
    }
  } catch (error) {
    loaderIcon.classList.add('hidden');
    console.error('Error during translation:', error);

    // Make sure error is related to API connection failure
  } finally {
    // Re-enable translate button after the request finishes
    translateButton.disabled = false;
  }
});

// Clear Button Handler
document.getElementById("clearBtn").addEventListener("click", () => {
  textInput.value = '';
  translatedTextDiv.innerHTML = '<p class="text-gray-400">Translated Hindi text will appear here...</p>';
});

// Save as PDF Handler
document.getElementById("saveBtn").addEventListener("click", () => {
  const translatedTextContent = translatedTextDiv.innerText.trim();

  if (!translatedTextContent || translatedTextContent === "Translated Hindi text will appear here...") {
    alert("No translated text to save as PDF!");
    return;
  }

  // Initialize jsPDF correctly
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Add content to the PDF
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text("Translated Hindi Text", 10, 10);
  doc.text(translatedTextContent, 10, 20);
  
  // Save the PDF file
  doc.save("translated_text.pdf");
});


document.getElementById("speakBtn").addEventListener("click", () => {
  const hindiText = translatedTextDiv.innerText.trim();
  if (!hindiText || hindiText === "Translated Hindi text will appear here...") {
    alert("No Hindi text to speak!");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(hindiText);
  utterance.lang = 'hi-IN';
  speechSynthesis.speak(utterance);
});

document.getElementById("copyBtn").addEventListener("click", () => {
  const hindiText = translatedTextDiv.innerText.trim();
  if (!hindiText || hindiText === "Translated Hindi text will appear here...") {
    alert("No Hindi text to copy!");
    return;
  }

  navigator.clipboard.writeText(hindiText)
    .then(() => alert("Copied to clipboard!"))
    .catch(err => alert("Failed to copy: " + err));
});

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  const token = localStorage.getItem("token"); // Check for the token in localStorage

  // If token exists, change the Login link to Logout
  if (token && nav) {
    const loginLink = nav.querySelector('a[href="login.html"]');
    if (loginLink) {
      loginLink.textContent = "Logout";  // Change to "Logout"
      loginLink.href = "#"; // Prevent navigating to login page
      loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token"); // Logout and remove token
        location.reload(); // Refresh the page to reflect changes
      });
    }
  } else {
    const loginLink = nav.querySelector('a[href="#"]');
    if (loginLink) {
      loginLink.textContent = "Login"; // Ensure it's set back to "Login" if no token
      loginLink.href = "login.html"; // Link back to the login page
    }
  }
});
// Login Button Handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent form from submitting the default way
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5004/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    // Check if the response is valid and contains JSON
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid or empty JSON response from server");
    }

    // Parse response JSON
    const data = await response.json();

    if (data.success) {
      // Store JWT token in localStorage
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      // Redirect to another page after successful login (e.g., main page or dashboard)
      window.location.href = 'index.html';  // Change to your desired page
    } else {
      alert(`Login failed: ${data.error}`);
    }

  } catch (error) {
    console.error('Login Error:', error);
    alert('An error occurred while logging in.');
  }
});

