// script.js
const peer = new Peer(); // Initialisiere einen neuen Peer
let conn;

// Wenn der Peer verbunden ist
peer.on('open', function(id) {
    console.log('Meine Peer ID ist: ' + id);
});

// Wenn eine Verbindung von einem anderen Peer reinkommt
peer.on('connection', function(connection) {
    conn = connection;
    conn.on('data', function(data) {
        // Nachrichten empfangen und anzeigen
        document.getElementById('messages').innerHTML += '<p>Empfangen: ' + data + '</p>';
    });
});

// Funktion zum Senden von Nachrichten
document.getElementById('sendButton').onclick = function() {
    const message = document.getElementById('messageInput').value;
    if (conn) {
        conn.send(message);
        document.getElementById('messages').innerHTML += '<p>Ich: ' + message + '</p>';
    }
};

// Hier müsste der Code zum Herstellen der Verbindung zu einem anderen Peer noch rein.
