// JavaScript for interactive features
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            alert('This feature is coming soon!');
        });
    });
});

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('v1').then(function(cache) {
        return cache.addAll([
          '/',
          'index.html',
          'manifest.json',
          'CSS Bus.css',
          'JS bus.js',
          'ic.png',
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  
  ///

  let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Store the event for later use
  deferredPrompt = e;
  
  // Display your custom install button or message here
  const installButton = document.getElementById('install-button');
  installButton.style.display = 'block';

  installButton.addEventListener('click', () => {
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for user response
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null; // Reset
    });
  });
});

//////

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
          .then((registration) => {
              console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
              console.error('Service Worker registration failed:', error);
          });
  });
}
///

self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
});
///////////////
navigator.serviceWorker.ready.then(function(swRegistration) {
  return swRegistration.sync.register('sync-data');
});
navigator.serviceWorker.ready.then((registration) => {
  if ('periodicSync' in registration) {
    registration.periodicSync.register({
      tag: 'periodic-sync-tag',  // Unique tag to identify this sync
      minInterval: 24 * 60 * 60 * 1000  // Minimum sync interval (1 day)
    });
  }
});
navigator.serviceWorker.ready.then(function(registration) {
  registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array('<Your-VAPID-Public-Key>')
  }).then(function(subscription) {
    console.log('Push Subscription:', JSON.stringify(subscription));
    // Send subscription to the server to send push notifications
  }).catch(function(error) {
    console.error('Error subscribing to push notifications:', error);
  });
});

// Helper function to convert VAPID public key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
////////////////
document.addEventListener('DOMContentLoaded', function() {
    // Handle the form submission
    const form = document.getElementById('purchase-form');
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get form data
        const tripQuantity = document.getElementById('tickets').value;
        const busTag = document.getElementById('bus-tag').value;
        const bankCard = document.getElementById('bank-card').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;

        // Validate and process the form data
        if (validateFormData(tripQuantity, busTag, bankCard, expiryDate, cvv)) {
            // Communicate with Firestore
            await sendDataToFirestore(tripQuantity, busTag, bankCard, expiryDate, cvv);
        }
    });
});

// Function to validate form data
function validateFormData(tripQuantity, busTag, bankCard, expiryDate, cvv) {
    // Basic validation logic (add more as needed)
    return tripQuantity && busTag && bankCard && expiryDate && cvv;
}

// Function to send data to Firestore
async function sendDataToFirestore(tripQuantity, busTag, bankCard, expiryDate, cvv) {
    try {
        // Example Firestore API request (replace with your actual Firestore logic)
        const response = await fetch('https://your-firestore-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tripQuantity,
                busTag,
                bankCard,
                expiryDate,
                cvv
            }),
        });
        const data = await response.json();
        console.log('Data sent to Firestore:', data);
    } catch (error) {
        console.error('Error sending data to Firestore:', error);
    }
}
/////
// Function to read NFC tags
async function readNFC() {
    try {
        const nfc = new NDEFReader();
        await nfc.scan();

        nfc.onreading = async (event) => {
            const message = event.message;
            for (const record of message.records) {
                const decoder = new TextDecoder(record.dataEncoding);
                const data = decoder.decode(record.data);
                console.log('NFC data:', data);
                // Process the NFC data (e.g., update the form)
                document.getElementById('bus-tag').value = data; // Example
            }
        };
    } catch (error) {
        console.error('Error reading NFC:', error);
    }
}

