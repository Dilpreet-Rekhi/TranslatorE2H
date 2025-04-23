document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
  
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const officialId = document.getElementById("officialId").value.trim();
      const password = document.getElementById("password").value.trim();
      const submitBtn = document.querySelector("button[type='submit']");
  
      if (!officialId || !password) {
        alert("Please enter both Official ID and Password.");
        return;
      }
  
      submitBtn.disabled = true;
      submitBtn.textContent = "Logging in...";
  
      try {
        const response = await fetch("http://localhost:5004/api/login", {//its still giving me error in this line
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: officialId , // using official ID as email
            password: password
          })
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          // Save the token to localStorage
          localStorage.setItem("token", data.token);
          alert("Login successful! Redirecting to dashboard...");
          window.location.href = "index.html"; // redirect on success
        } else {
          alert("Login failed: " + (data.error || "Unknown error."));
        }
      } catch (error) {
        console.error("Login Error:", error);
        alert("An error occurred during login. Please try again.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Login";
      }
    });
  });
  