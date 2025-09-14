
  // Chat logic
  let isMinimized = false;
  let isMaximized = false;
  let step = 0;
  let userName = "";
  let selectedOption = ""; // guarda la opción elegida
// Constantes Regex que validan 
  const toBeRegex = {
    presentAffirmative: /^((I am|You are|He is|She is|It is|We are|They are)|((?!I|You|He|She|It|We|They)[A-Z][a-z]+) is|([A-Z][a-z]+ and [A-Z][a-z]+) are)\s.+\.$/,
    presentNegative: /^((I am not|You are not|He is not|She is not|It is not|We are not|They are not)|((?!I|You|He|She|It|We|They)[A-Z][a-z]+) is not|([A-Z][a-z]+ and [A-Z][a-z]+) are not)\s.+\.$/,
    presentQuestion: /^(Am I|Are you|Is he|Is she|Is it|Are we|Are they|Is [A-Z][a-z]+(?: [A-Z][a-z]+)*|Are [A-Z][a-z]+(?: [A-Z][a-z]+)* and [A-Z][a-z]+(?: [A-Z][a-z]+)*)\s.+\?$/,
    pastAffirmative: /^((I was|You were|He was|She was|It was|We were|They were)|([A-Z][a-z]+ was)|([A-Z][a-z]+ and [A-Z][a-z]+ were))\s.+\.$/,
    pastNegative: /^((I was not|You were not|He was not|She was not|It was not|We were not|They were not)|([A-Z][a-z]+ was not)|([A-Z][a-z]+ and [A-Z][a-z]+ were not))\s.+\.$/,
    pastQuestion: /^((Was I|Were you|Was he|Was she|Was it|Were we|Were they)|(Was [A-Z][a-z]+(?: [A-Z][a-z]+)*)|(Were [A-Z][a-z]+(?: [A-Z][a-z]+)* and [A-Z][a-z]+(?: [A-Z][a-z]+)*))\s.+\?$/
  }
// Al abrir el icono de chat
  function openChat() {
    document.getElementById("chat-icon").style.display = "none";
    document.getElementById("chat-box").style.display = "flex";
    addBotMessage("Hello, welcome! My name is Beatrix. What is Your name?");
  }
//Cuando se cierra el chat
  function closeChat() {
    document.getElementById("chat-box").style.display = "none";
    document.getElementById("chat-icon").style.display = "block";
    step = 0;
    userName = "";
    selectedOption = "";
    document.getElementById("messages").innerHTML = ""; // reinicio de mensajes
  }
//Cuando se minimiza el chat se ocultan los mensajes
  function toggleMinimize() {
    isMinimized = !isMinimized;
    document.querySelector("#chat-box .messages").style.display = isMinimized ? "none" : "block";
    document.getElementById("chat-form").style.display = isMinimized ? "none" : "flex";
  }
//Cuando se maximiza el chat 
  function toggleMaximize() {
    isMaximized = !isMaximized;
    document.getElementById("chat-box").classList.toggle("maximized", isMaximized);

  }
  function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
//La funcion addbot se encarga de que en cada mensaje salaga el avatar del chat bot
  function addBotMessage(text, delay = 30) {
    const container = document.createElement("div");
    container.className = "bot-msg-wrapper";
    container.innerHTML = `<img src="imagen/robot.gif" alt="bot" class="robot-icon"><p class="bot-msg"></p>  
    <span class="msg-time">${getCurrentTime()}</span>
  `;
    document.getElementById("messages").appendChild(container);

    const msgP = container.querySelector("p");
    let i = 0;
    function typeWriter() {
      if (i < text.length) {
        msgP.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, delay);
      }
    }
    typeWriter();
    document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
    speak(text);
  }

  function addMessage(from, text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = from === "bot" ? "bot-msg-wrapper" : "user-msg-wrapper";
    msgDiv.innerHTML = from === "bot"
      ? `<img src="imagen/robot.png" alt="bot" class="robot-icon">
          <p class="bot-msg">${text}</p>
      <span class="msg-time">${getCurrentTime()}</span>`
    : `<p class="user-msg">${text}</p>
      <span class="msg-time">${getCurrentTime()}</span>`;
    document.getElementById("messages").appendChild(msgDiv);
    document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
  }
// Esto hace hablar al chat bot y pronuciar las palabras al ingles
  function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; 
    utterance.rate = 1;       
    utterance.pitch = 7;     
    window.speechSynthesis.speak(utterance);
  }
}

  document.getElementById("chat-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;
    addMessage("user", text);
    input.value = "";

    // Paso 0: capturar nombre
  if (step === 0 && /^My name is [A-Z][a-z]+[.]$/.test(text)) {
  let rawName = text.slice(11, -1); 
  if (rawName === rawName.toUpperCase()) {
    addBotMessage("Sorry, I don't accept names in ALL CAPS. Please try again with only the first letter capitalized.");
    return;
  }

  userName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

  addBotMessage(`Nice to meet you, 😁 ${userName}!`);
  setTimeout(() => {
    addBotMessage("What do you want to do today with the verb 'to be'?");
    addBotMessage("Options: 1. Present affirmative. 2. Present negative. 3. Present question 4. Past affirmative 5. Past negative 6. Past question.");
  }, 1000);
  step = 1;

} else if (step === 0) {
  addBotMessage("Please introduce yourself like this: 'My name is Marco.'");


    // Este Paso 1 es seleccionar tipo de oración
    } else if (step === 1) {
  const mapOption = {
  "Present affirmative.": "presentAffirmative",
  "Present negative.": "presentNegative",
  "Present question.": "presentQuestion",
  "Past affirmative.": "pastAffirmative",
  "Past negative.": "pastNegative",
  "Past question.": "pastQuestion"
};

const choice = text.trim();

// Normalizar: primera letra mayúscula, resto minúscula, mantener punto
const normalize = (str) => {
  if (!str.endsWith(".")) return str; // si no tiene punto, no lo acepta
  const body = str.slice(0, -1).toLowerCase(); // todo minúscula menos la 1ra
  return body.charAt(0).toUpperCase() + body.slice(1) + ".";
};

const normalizedChoice = normalize(choice);
const optionKey = mapOption[normalizedChoice];

if (optionKey) {
  selectedOption = optionKey; // ← sin punto
  addBotMessage(`Great choice, ${userName}! Send me a ${normalizedChoice} sentence with the verb 'to be' and I'll check it.`);
  step = 2;
} else {
  addBotMessage("Please choose a valid option.");
}
    // Paso 2: validar oración según opción
    } else if (step === 2) {
  if (selectedOption && toBeRegex[selectedOption].test(text)) {
    addBotMessage(`✔ Correct: ${selectedOption}${userName ? `, ${userName}` : ""}.`);

    // Después de validar bien → preguntar si quiere seguir
    setTimeout(() => {
      addBotMessage("Do you want to try another option or finish for today?");
      addBotMessage("Please type 'Yes.' to continue, or 'No.' to exit.");
      step = 3;
    }, 1000);

  } else {
    addBotMessage(`❌ Incorrect sentence${userName ? `, ${userName}` : ""}. Try again!`);
    // Se mantiene en step = 2 → el usuario tiene chance de reintentar
  }

// Paso 3: decidir si continuar o despedirse
} else if (step === 3) {
  if (text === "Yes.") {
    addBotMessage("Perfect! What do you want to do now? (Options: 1. Present affirmative. 2. Present negative. 3. Present question 4. Past affirmative 5. Past negative 6. Past question.");
    step = 1; // vuelve a elegir opción
  } else if (text === "No.") {
    addBotMessage(`Goodbye, ${userName}! See you next time 👋`);
    step = 0; // reinicia todo
    userName = "";
    selectedOption = "";
  } else {
    addBotMessage("Please type 'Yes.' or 'No.'.");
  }
}
  });