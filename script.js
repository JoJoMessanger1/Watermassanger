const myIdElement = document.getElementById('my-id');
const recipientIdInput = document.getElementById('recipientId');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messagesDiv = document.getElementById('messages');

let peer;
let conn;
const storedId = localStorage.getItem('myPeerId');

// Prüft, ob bereits eine ID im Browser-Speicher ist
if (storedId) {
    peer = new Peer(storedId);
    console.log("Benutze gespeicherte ID:", storedId);
    myIdElement.textContent = storedId;
} else {
    // Erstellt eine neue ID, wenn keine vorhanden ist
    peer = new Peer();
    peer.on('open', (id) => {
        myIdElement.textContent = id;
        localStorage.setItem('myPeerId', id);
        console.log("Neue ID erstellt und gespeichert:", id);
    });
}

// Wenn ein anderer Nutzer eine Verbindung zu uns aufbaut
peer.on('connection', (connection) => {
    conn = connection;
    conn.on('data', (data) => {
        // Nachricht empfangen und anzeigen
        displayMessage(data, 'received');
    });

    conn.on('open', () => {
        // Die Verbindung wurde hergestellt
        alert("Verbindung hergestellt!");
        recipientIdInput.value = conn.peer;
    });

    conn.on('close', () => {
        alert("Verbindung getrennt.");
    });
});

// Funktion zum Senden einer Nachricht
sendButton.addEventListener('click', () => {
    const recipientId = recipientIdInput.value;
    const message = messageInput.value;

    if (!conn || conn.peer !== recipientId) {
        // Neue Verbindung aufbauen, wenn noch keine besteht oder der Empfänger gewechselt hat
        conn = peer.connect(recipientId);
        conn.on('open', () => {
            conn.send(message);
            displayMessage(message, 'sent');
            messageInput.value = '';
        });
        conn.on('data', (data) => {
            displayMessage(data, 'received');
        });
    } else {
        // Nachricht über bestehende Verbindung senden
        conn.send(message);
        displayMessage(message, 'sent');
        messageInput.value = '';
    }
});

// Funktion zum Anzeigen von Nachrichten im Chatfenster
function displayMessage(text, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(type === 'sent' ? 'message-sent' : 'message-received');
    messageElement.textContent = text;
    messagesDiv.appendChild(messageElement);
    // Scrolle automatisch zum Ende des Chats
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
