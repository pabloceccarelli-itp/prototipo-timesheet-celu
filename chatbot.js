
// Chatbot functionality - Dual Interface (Widget + WhatsApp)

// ========== ELEMENTOS DEL DOM ==========
// Widget del chatbot
const chatbotButton = document.getElementById('chatbotButton');
const chatbotWidget = document.getElementById('chatbotWidget');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const chatbotMessages = document.getElementById('chatbotMessages');

// WhatsApp
const whatsappInput = document.getElementById('whatsappInput');
const whatsappSend = document.getElementById('whatsappSend');
const whatsappMessages = document.getElementById('whatsappMessages');

// ========== FUNCIONES AUXILIARES ==========
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// ========== FUNCIONES PARA WIDGET DEL CHATBOT ==========
function addMessageWidget(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.innerHTML = text.replace(/\n/g, '<br>');
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return messageDiv;
}

function showThinkingWidget() {
    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'thinking';
    thinkingDiv.innerHTML = '<div class="thinking-dot"></div><div class="thinking-dot"></div><div class="thinking-dot"></div>';
    chatbotMessages.appendChild(thinkingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return thinkingDiv;
}

function removeThinkingWidget(thinkingDiv) {
    if (thinkingDiv && thinkingDiv.parentNode) {
        thinkingDiv.parentNode.removeChild(thinkingDiv);
    }
}

function showConfirmationWidget(message, onConfirm, onCancel) {
    const messageDiv = addMessageWidget(message, false);
    
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'confirmation-buttons';
    
    const yesBtn = document.createElement('button');
    yesBtn.className = 'confirm-btn yes';
    yesBtn.textContent = 'Sí';
    yesBtn.onclick = function() {
        messageDiv.remove();
        // Asegurar que se use la interfaz correcta en el callback
        setActiveInterface('widget');
        onConfirm();
    };
    
    const noBtn = document.createElement('button');
    noBtn.className = 'confirm-btn no';
    noBtn.textContent = 'No';
    noBtn.onclick = function() {
        messageDiv.remove();
        // Asegurar que se use la interfaz correcta en el callback
        setActiveInterface('widget');
        if (onCancel) onCancel();
    };
    
    buttonsDiv.appendChild(yesBtn);
    buttonsDiv.appendChild(noBtn);
    messageDiv.appendChild(buttonsDiv);
}

// ========== FUNCIONES PARA WHATSAPP ==========
function addMessageWhatsApp(text, isUser = false) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = `whatsapp-message ${isUser ? 'user' : 'bot'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'whatsapp-message-content';
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

function showThinkingWhatsApp() {
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

function removeThinkingWhatsApp(thinkingDiv) {
    if (thinkingDiv && thinkingDiv.parentNode) {
        thinkingDiv.parentNode.removeChild(thinkingDiv);
    }
}

function showConfirmationWhatsApp(message, onConfirm, onCancel) {
    const messageWrapper = addMessageWhatsApp(message, false);
    const messageContent = messageWrapper.querySelector('.whatsapp-message-content');
    
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'confirmation-buttons';
    
    const yesBtn = document.createElement('button');
    yesBtn.className = 'confirm-btn yes';
    yesBtn.textContent = 'Sí';
    yesBtn.onclick = function() {
        messageWrapper.remove();
        // Asegurar que se use la interfaz correcta en el callback
        setActiveInterface('whatsapp');
        onConfirm();
    };
    
    const noBtn = document.createElement('button');
    noBtn.className = 'confirm-btn no';
    noBtn.textContent = 'No';
    noBtn.onclick = function() {
        messageWrapper.remove();
        // Asegurar que se use la interfaz correcta en el callback
        setActiveInterface('whatsapp');
        if (onCancel) onCancel();
    };
    
    buttonsDiv.appendChild(yesBtn);
    buttonsDiv.appendChild(noBtn);
    messageContent.appendChild(buttonsDiv);
}

// ========== FUNCIONES GLOBALES (COMPARTIDAS) ==========
// Variable para rastrear la interfaz activa
let activeInterface = 'widget';

// Función para configurar las funciones globales según la interfaz
// Debe estar definida antes de las funciones que la usan
function setActiveInterface(interfaceType) {
    activeInterface = interfaceType;
    if (interfaceType === 'whatsapp') {
        addMessage = addMessageWhatsApp;
        showThinking = showThinkingWhatsApp;
        removeThinking = removeThinkingWhatsApp;
        showConfirmation = showConfirmationWhatsApp;
    } else {
        addMessage = addMessageWidget;
        showThinking = showThinkingWidget;
        removeThinking = removeThinkingWidget;
        showConfirmation = showConfirmationWidget;
    }
}

// Estas funciones serán sobrescritas dinámicamente según la interfaz activa
// Se inicializan con las funciones del widget por defecto
let addMessage = addMessageWidget;
let showThinking = showThinkingWidget;
let removeThinking = removeThinkingWidget;
let showConfirmation = showConfirmationWidget;

// Función para procesar mensaje (compartida)
function processMessage(message, interfaceType) {
    // Configurar funciones según la interfaz ANTES de procesar
    setActiveInterface(interfaceType);
    
    // Mostrar animación "Pensando"
    const thinkingDiv = showThinking();
    
    // Procesar después de 1 segundo
    setTimeout(() => {
        removeThinking(thinkingDiv);
        
        // Asegurar que las funciones estén configuradas antes de processCommand
        setActiveInterface(interfaceType);
        
        const commandProcessed = processCommand(message);
        
        // Asegurar nuevamente después de processCommand (por si se cambió)
        setActiveInterface(interfaceType);
        
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

// ========== EVENT LISTENERS PARA WIDGET ==========
chatbotButton.addEventListener('click', function () {
    chatbotWidget.classList.toggle('open');
});

chatbotClose.addEventListener('click', function () {
    chatbotWidget.classList.remove('open');
});

function sendMessageWidget() {
    const message = chatbotInput.value.trim();
    if (message) {
        addMessageWidget(message, true);
        chatbotInput.value = '';
        processMessage(message, 'widget');
    }
}

chatbotSend.addEventListener('click', sendMessageWidget);
chatbotInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessageWidget();
    }
});

// ========== EVENT LISTENERS PARA WHATSAPP ==========
function sendMessageWhatsApp() {
    const message = whatsappInput.value.trim();
    if (message) {
        addMessageWhatsApp(message, true);
        whatsappInput.value = '';
        processMessage(message, 'whatsapp');
    }
}

whatsappSend.addEventListener('click', sendMessageWhatsApp);
whatsappInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessageWhatsApp();
    }
});