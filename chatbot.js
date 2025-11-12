
// Chatbot functionality - WhatsApp Interface
const whatsappInput = document.getElementById('whatsappInput');
const whatsappSend = document.getElementById('whatsappSend');
const whatsappMessages = document.getElementById('whatsappMessages');

// Función para obtener la hora actual formateada
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Función para agregar mensaje en WhatsApp
function addMessage(text, isUser = false) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = `whatsapp-message ${isUser ? 'user' : 'bot'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'whatsapp-message-content';
    // Convertir saltos de línea a <br> para HTML
    messageContent.innerHTML = text.replace(/\n/g, '<br>');
    
    const messageTime = document.createElement('div');
    messageTime.className = 'whatsapp-message-time';
    messageTime.textContent = getCurrentTime();
    
    messageWrapper.appendChild(messageContent);
    messageWrapper.appendChild(messageTime);
    whatsappMessages.appendChild(messageWrapper);
    whatsappMessages.scrollTop = whatsappMessages.scrollHeight;
    return messageWrapper;
}

// Función para mostrar animación "Pensando"
function showThinking() {
    const thinkingWrapper = document.createElement('div');
    thinkingWrapper.className = 'whatsapp-message thinking';
    
    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'whatsapp-thinking';
    thinkingDiv.innerHTML = '<div class="whatsapp-thinking-dot"></div><div class="whatsapp-thinking-dot"></div><div class="whatsapp-thinking-dot"></div>';
    
    thinkingWrapper.appendChild(thinkingDiv);
    whatsappMessages.appendChild(thinkingWrapper);
    whatsappMessages.scrollTop = whatsappMessages.scrollHeight;
    return thinkingWrapper;
}

// Función para remover animación "Pensando"
function removeThinking(thinkingDiv) {
    if (thinkingDiv && thinkingDiv.parentNode) {
        thinkingDiv.parentNode.removeChild(thinkingDiv);
    }
}

// Función para mostrar confirmación
function showConfirmation(message, onConfirm, onCancel) {
    const messageWrapper = addMessage(message, false);
    const messageContent = messageWrapper.querySelector('.whatsapp-message-content');
    
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'confirmation-buttons';
    
    const yesBtn = document.createElement('button');
    yesBtn.className = 'confirm-btn yes';
    yesBtn.textContent = 'Sí';
    yesBtn.onclick = function() {
        messageWrapper.remove();
        onConfirm();
    };
    
    const noBtn = document.createElement('button');
    noBtn.className = 'confirm-btn no';
    noBtn.textContent = 'No';
    noBtn.onclick = function() {
        messageWrapper.remove();
        if (onCancel) onCancel();
    };
    
    buttonsDiv.appendChild(yesBtn);
    buttonsDiv.appendChild(noBtn);
    messageContent.appendChild(buttonsDiv);
}

// Función principal para enviar mensaje
function sendMessage() {
    const message = whatsappInput.value.trim();
    if (message) {
        addMessage(message, true);
        whatsappInput.value = '';
        
        // Mostrar animación "Pensando"
        const thinkingDiv = showThinking();
        
        // Procesar después de 1 segundo
        setTimeout(() => {
            removeThinking(thinkingDiv);
            
            const commandProcessed = processCommand(message);
            
            if (!commandProcessed) {
                addMessage(`No pude entender tu solicitud. Puedo ayudarte a:\n
                    • Cargar horas diarias: "Cargá 8h de Desarrollo Web al proyecto Alfa hoy"
                    • Cargar horas en bloque: "Cargá 4h de Reunión con el Cliente en proyecto Alfa de lunes a viernes"
                    • Editar horas: "Cambiá las horas de la tarea Planificación de ayer en proyecto Beta a 3h"
                    • Eliminar horas: "Eliminá las horas de la tarea Planificación del martes en proyecto Gamma" o "Eliminá todas las horas de todas las tareas de esta semana"
                    • Duplicar horas de la semana pasada a esta semana: "Copiá mis horas de la semana pasada en proyecto Delta"
                    • Completar el mes restante con las horas del proyecto Delta de esta semana: "Completá el mes restante con las horas del proyecto Delta de esta semana"
                                    
                    ¿Puedes reformular tu pedido?`);
            }
        }, 1000);
    }
}

whatsappSend.addEventListener('click', sendMessage);
whatsappInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});