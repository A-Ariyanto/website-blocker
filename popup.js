// popup.js
document.addEventListener('DOMContentLoaded', function() {
  const websiteInput = document.getElementById('websiteInput');
  const addButton = document.getElementById('addButton');
  const siteList = document.getElementById('siteList');
  const status = document.getElementById('status');
  const toggleButton = document.getElementById('toggleButton');

  let blockedSites = [];
  let isEnabled = true;

  // Load data on popup open
  loadData();

  // Event listeners
  addButton.addEventListener('click', addWebsite);
  websiteInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addWebsite();
    }
  });
  toggleButton.addEventListener('click', toggleBlocking);

  function loadData() {
    chrome.storage.sync.get(['blockedSites', 'isEnabled'], function(result) {
      blockedSites = result.blockedSites || [];
      isEnabled = result.isEnabled !== false; // Default to true
      updateUI();
      updateToggleButton();
    });
  }

  function saveData() {
    chrome.storage.sync.set({
      blockedSites: blockedSites,
      isEnabled: isEnabled
    }, function() {
      // Update blocking rules
      chrome.runtime.sendMessage({
        action: 'updateRules',
        sites: blockedSites,
        enabled: isEnabled
      });
    });
  }

  function addWebsite() {
    const website = websiteInput.value.trim().toLowerCase();
    
    console.log('Website Blocker - Adding website:', website);
    
    if (!website) {
      showStatus('Please enter a website URL', 'error');
      return;
    }

    // Clean up the URL
    let cleanedWebsite = website.replace(/^https?:\/\//, '').replace(/^www\./, '');
    
    console.log('Website Blocker - Cleaned website:', cleanedWebsite);
    
    // Validate URL format
    if (!isValidDomain(cleanedWebsite)) {
      showStatus('Please enter a valid domain (e.g., facebook.com)', 'error');
      return;
    }

    // Check if already exists
    if (blockedSites.includes(cleanedWebsite)) {
      showStatus('Website is already blocked', 'error');
      return;
    }

    // Add to list
    blockedSites.push(cleanedWebsite);
    console.log('Website Blocker - Updated blocked sites:', blockedSites);
    saveData();
    websiteInput.value = '';
    updateUI();
    showStatus(`${cleanedWebsite} has been blocked`, 'success');
  }

  function removeWebsite(website) {
    const index = blockedSites.indexOf(website);
    if (index > -1) {
      blockedSites.splice(index, 1);
      saveData();
      updateUI();
      showStatus(`${website} has been unblocked`, 'success');
    }
  }

  function toggleBlocking() {
    isEnabled = !isEnabled;
    saveData();
    updateToggleButton();
    showStatus(isEnabled ? 'Website blocking enabled' : 'Website blocking disabled', 'success');
  }

  function updateToggleButton() {
    if (isEnabled) {
      toggleButton.textContent = 'Disable Blocking';
      toggleButton.className = 'toggle-button enabled';
    } else {
      toggleButton.textContent = 'Enable Blocking';
      toggleButton.className = 'toggle-button disabled';
    }
  }

  function updateUI() {
    if (blockedSites.length === 0) {
      siteList.innerHTML = '<div class="empty-state">No websites blocked yet</div>';
      return;
    }

    const siteItems = blockedSites.map(site => 
      `<div class="site-item">
        <span class="site-url">${site}</span>
        <button class="remove-button" data-site="${site}">Remove</button>
      </div>`
    ).join('');

    siteList.innerHTML = siteItems;

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-button').forEach(button => {
      button.addEventListener('click', function() {
        removeWebsite(this.dataset.site);
      });
    });
  }

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    status.classList.remove('hidden');
    
    setTimeout(() => {
      status.classList.add('hidden');
    }, 3000);
  }

  function isValidDomain(domain) {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain) || domain.includes('.');
  }
});
