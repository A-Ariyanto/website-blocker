// content.js
(function() {
  'use strict';
  
  // Don't run on chrome extension pages
  if (window.location.protocol === 'chrome-extension:') {
    return;
  }
  
  // Get current domain
  const currentDomain = window.location.hostname.replace(/^www\./, '');
  
  // Don't block empty domains
  if (!currentDomain) {
    return;
  }
  
  // Function to block the site
  function blockSite() {
    // Check if this site should be blocked
    chrome.storage.sync.get(['blockedSites', 'isEnabled'], function(result) {
      try {
        const blockedSites = result.blockedSites || [];
        const isEnabled = result.isEnabled !== false;
        
        console.log('Website Blocker - Current domain:', currentDomain);
        console.log('Website Blocker - Blocked sites:', blockedSites);
        console.log('Website Blocker - Is enabled:', isEnabled);
        
        if (!isEnabled) {
          console.log('Website Blocker - Blocking is disabled');
          return;
        }
        
        // Check if current domain is in blocked list
        const isBlocked = blockedSites.some(site => {
          const matches = currentDomain === site || 
                         currentDomain.endsWith('.' + site) || 
                         site === currentDomain ||
                         currentDomain.includes(site);
          if (matches) {
            console.log('Website Blocker - Match found for site:', site);
          }
          return matches;
        });
        
        console.log('Website Blocker - Is blocked:', isBlocked);
        
        if (isBlocked) {
          console.log('Website Blocker - Blocking site:', currentDomain);
          
          // Stop page loading immediately
          try {
            window.stop();
          } catch (e) {
            console.log('Website Blocker - Could not stop page loading:', e);
          }
          
          // Replace page content with blocked message
          document.documentElement.innerHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Website Blocked - Stay Focused</title>
            <style>
                /* Inline CSS for content script */
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    margin: 0;
                }

                .blocked-container {
                    text-align: center;
                    max-width: 600px;
                    padding: 40px 20px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    animation: fadeIn 0.8s ease-out;
                }

                @keyframes fadeIn {
                    from { 
                        opacity: 0; 
                        transform: translateY(20px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }

                .blocked-icon {
                    font-size: 80px;
                    margin-bottom: 20px;
                    color: #ffd700;
                }

                .blocked-title {
                    font-size: 2.5rem;
                    margin-bottom: 15px;
                    font-weight: 600;
                }

                .blocked-site {
                    font-size: 1.4rem;
                    color: #ffeb3b;
                    margin-bottom: 20px;
                    font-weight: 500;
                }

                .blocked-message {
                    font-size: 1.2rem;
                    margin-bottom: 30px;
                    line-height: 1.6;
                    color: rgba(255, 255, 255, 0.9);
                }

                .time-display {
                    font-size: 3rem;
                    font-weight: bold;
                    margin: 20px 0;
                    color: #ffd700;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                }

                .date-display {
                    font-size: 1.2rem;
                    margin-bottom: 20px;
                    color: rgba(255, 255, 255, 0.8);
                }

                .focus-tips {
                    text-align: left;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 25px;
                    border-radius: 15px;
                    margin: 25px 0;
                }

                .focus-tips h3 {
                    margin-bottom: 15px;
                    color: #ffd700;
                    font-size: 1.3rem;
                    text-align: center;
                }

                .focus-tips ul {
                    list-style: none;
                }

                .focus-tips li {
                    margin-bottom: 10px;
                    padding-left: 25px;
                    position: relative;
                    color: rgba(255, 255, 255, 0.9);
                }

                .focus-tips li::before {
                    content: "✓";
                    position: absolute;
                    left: 0;
                    color: #4CAF50;
                    font-weight: bold;
                }

                .quote {
                    font-style: italic;
                    font-size: 1.1rem;
                    margin: 25px 0;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.05);
                    border-left: 4px solid #ffd700;
                    border-radius: 8px;
                    color: rgba(255, 255, 255, 0.8);
                }

                .button-group {
                    margin-top: 30px;
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .btn {
                    display: inline-block;
                    padding: 12px 25px;
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    text-decoration: none;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 25px;
                    transition: all 0.3s ease;
                    font-weight: 500;
                    cursor: pointer;
                    font-size: 14px;
                    font-family: inherit;
                }

                .btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    border-color: rgba(255, 255, 255, 0.5);
                    transform: translateY(-2px);
                }

                @media (max-width: 480px) {
                    .blocked-container {
                        margin: 20px;
                        padding: 30px 15px;
                    }
                    
                    .blocked-title {
                        font-size: 2rem;
                    }
                    
                    .time-display {
                        font-size: 2.5rem;
                    }
                    
                    .button-group {
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .btn {
                        width: 200px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="blocked-container">
                <div class="blocked-icon">🚫</div>
                <h1 class="blocked-title">Website Blocked</h1>
                <div class="blocked-site">${currentDomain} has been blocked</div>
                
                <div class="time-display" id="currentTime">12:00:00</div>
                <div class="date-display" id="currentDate">Monday, January 1, 2024</div>
                
                <div class="blocked-message">
                    This website has been blocked to help you stay focused and productive.
                </div>

                <div class="focus-tips">
                    <h3>🎯 Stay on Track</h3>
                    <ul>
                        <li>Take a deep breath and refocus on your goals</li>
                        <li>Use this time for something productive</li>
                        <li>Remember why you blocked this site</li>
                        <li>Consider taking a short break and coming back to work</li>
                        <li>Try the 25-minute focus technique</li>
                    </ul>
                </div>

                <div class="quote" id="quote">
                    "The successful warrior is the average person with laser-like focus." - Bruce Lee
                </div>

                <div class="button-group">
                    <button class="btn" onclick="window.close()">Close Tab</button>
                    <button class="btn" onclick="window.history.back()">Go Back</button>
                </div>
            </div>

            <script>
                // Update time every second
                function updateTime() {
                    const now = new Date();
                    const timeString = now.toLocaleTimeString();
                    const dateString = now.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    });
                    
                    document.getElementById('currentTime').textContent = timeString;
                    document.getElementById('currentDate').textContent = dateString;
                }

                // Random motivational quotes
                const quotes = [
                    '"The successful warrior is the average person with laser-like focus." - Bruce Lee',
                    '"Concentrate all your thoughts upon the work at hand." - Alexander Graham Bell',
                    '"Focus is about saying no to 1,000 good ideas." - Steve Jobs',
                    '"The art of being wise is knowing what to overlook." - William James',
                    '"You can do two things at once, but you can\\'t focus effectively on two things at once." - Gary Keller'
                ];

                // Initialize
                updateTime();
                setInterval(updateTime, 1000);

                // Change quote every 10 seconds
                setInterval(() => {
                    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                    document.getElementById('quote').textContent = randomQuote;
                }, 10000);
            </script>
        </body>
        </html>
      `;
        }
      } catch (error) {
        console.error('Website Blocker - Error:', error);
      }
    });
  }
  
  // Run the blocking check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', blockSite);
  } else {
    blockSite();
  }
})();
