import { io } from "socket.io-client";

// Connect to the Socket.IO server
const socket = io('http://localhost:4000');

// Listen for alerts from the server
socket.on('alert', (data) => {
    console.log(data.message); // Log the alert message in the console
    console.log('Unsafe contaminants:', data.contaminants); // Log unsafe contaminants in the console

    // Display the alert in the user interface
    const alertContainer = document.getElementById('alert-container');
    const alertMessage = document.createElement('div');
    alertMessage.className = 'alert'; // You can style this class in CSS
    alertMessage.innerHTML = `<strong>${data.message}</strong>: ${data.contaminants.join(', ')}`;
    alertContainer.appendChild(alertMessage);

    // Optionally, you could remove the alert after a few seconds
    setTimeout(() => {
        alertContainer.removeChild(alertMessage);
    }, 5000);
});
