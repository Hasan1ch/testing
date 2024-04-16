// script.js
const loginForm = document.querySelector('.login-form');
const logoutButton = document.querySelector('#logout-button');

// Login functionality
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  // Add your login logic here, e.g., send the credentials to a server for validation
  if (username === 'admin' && password === 'password') {
    // If login is successful, redirect the user to the main page
    window.location.href = 'index.html';
  } else {
    alert('Invalid username or password');
  }
});

// Logout functionality
logoutButton.addEventListener('click', () => {
  // Add your logout logic here, e.g., clear user session or cookies
  window.location.href = 'login.html';
});

// script.js (client-side)
const loginForm = document.querySelector('.login-form');
const logoutButton = document.querySelector('#logout-button');

// Check user's login status on page load
checkLoginStatus();

// Login functionality
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (response.ok) {
    // Store the session token or cookie
    const { token } = await response.json();
    localStorage.setItem('authToken', token);
    // Redirect the user to the home page
    window.location.href = 'index.html';
  } else {
    alert('Invalid username or password');
  }
});

// Logout functionality
logoutButton.addEventListener('click', async () => {
  // Remove the session token or cookie
  localStorage.removeItem('authToken');
  // Send a request to the server to invalidate the user's session
  await fetch('/logout', { method: 'POST' });
  // Redirect the user to the login page
  window.location.href = 'login.html';
});

// Helper function to check user's login status
async function checkLoginStatus() {
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    // Send a request to the server to verify the user's session
    const response = await fetch('/me', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    if (response.ok) {
      // User is logged in, display the appropriate content on the home page
      document.getElementById('logout-button').style.display = 'block';
      document.getElementById('login-button').style.display = 'none';
    } else {
      // User is not logged in, display the appropriate content on the home page
      document.getElementById('logout-button').style.display = 'none';
      document.getElementById('login-button').style.display = 'block';
    }
  } else {
    // User is not logged in, display the appropriate content on the home page
    document.getElementById('logout-button').style.display = 'none';
    document.getElementById('login-button').style.display = 'block';
  }
}