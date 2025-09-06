# Website Blocker Chrome Extension

A simple Chrome extension to block distracting websites and improve productivity.

## Features

- 🚫 Block any website by domain name
- 📌 Pin the extension for easy access
- ✅ Enable/disable blocking with one click
- 📝 Add and remove websites from the blocked list
- 💾 Persistent storage of your blocked sites
- 🎨 Clean, user-friendly interface

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The Website Blocker extension will appear in your extensions list
6. Pin the extension to your toolbar for easy access
7. **Reload the extension** after any changes

## How to Use

1. Click on the Website Blocker extension icon in your toolbar
2. Enter a website domain (e.g., `facebook.com`, `twitter.com`, `youtube.com`)
3. Click "Add" to block the website
4. The website will immediately be blocked
5. To unblock a website, click the "Remove" button next to it
6. Use the "Enable/Disable Blocking" button to temporarily turn off all blocking

## Troubleshooting

If the extension is not working:

1. **Reload the extension**: Go to `chrome://extensions/`, find Website Blocker, and click the refresh icon
2. **Check console logs**: Open Developer Tools (F12) and look for "Website Blocker" messages in the console
3. **Verify storage**: In the popup, add a test site and check if it appears in the blocked list
4. **Test on a simple site**: Try blocking `example.com` first
5. **Check permissions**: Make sure the extension has all required permissions

## Testing Steps

1. Add `example.com` to your blocked sites
2. Visit `http://example.com` - should show the blocked page
3. Remove `example.com` from blocked sites
4. Visit `http://example.com` - should load normally

## Technical Details

- Uses Chrome Extension Manifest V3
- Utilizes `declarativeNetRequest` API for efficient blocking
- Stores data using Chrome's `storage.sync` API
- Blocks both www and non-www versions of domains

## Files Structure

- `manifest.json` - Extension configuration
- `popup.html` - User interface for the extension popup
- `popup.js` - JavaScript logic for the popup
- `background.js` - Service worker for background operations
- `rules.json` - Static rules file (currently empty, uses dynamic rules)
- Icon files for different sizes

## Permissions

- `storage` - To save your blocked websites list
- `declarativeNetRequest` - To block websites
- `activeTab` - To interact with the current tab
- `<all_urls>` - To block any website you specify

## Privacy

This extension only stores data locally on your device and in your Chrome sync storage. No data is sent to external servers.