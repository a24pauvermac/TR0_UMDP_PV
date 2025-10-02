const NPREGUNTAS = 10

let preguntes = []; 
let idTimer; // Variable per gestionar el timer
let estatDeLaPartida = {
  preguntaActual: 0,
  contadorPreguntes: 0,
  respostesUsuari: [], // Aquí anirem guardant les respostes 
  tempsRestant: 300
};

function guardarNom() {
  let nom = document.getElementById("nomUsuari").value;
  if (nom.trim() !== "") {
    localStorage.setItem("nomUsuari", nom);
    document.getElementById("formulario-usuario").style.display = "none";
    document.getElementById("joc").style.display = "block";
    document.getElementById("saludoUsuario").textContent = `Hola, ${nom}!`;
    iniciarJoc();
  }
}

function esborrarNom() {
  // Aturar el timer
  aturarTimer();
  
  localStorage.removeItem("nomUsuari");
  localStorage.removeItem("partida");
  
  // Reinicialitzar estat
  estatDeLaPartida = {
    preguntaActual: 0,
    contadorPreguntes: 0,
    respostesUsuari: [],
    tempsRestant: 300
  };
  
  // Mostrar formulario de nuevo
  document.getElementById("joc").style.display = "none";
  document.getElementById("formulario-usuario").style.display = "block";
  document.getElementById("nomUsuari").value = "";
}

function iniciarJoc() {
    fetch('getPreguntas.php?num=10')
        .then(response => response.json())
        .then(data => {
            console.log('Dades rebudes:', data);
            
            // Validar que les dades són correctes
            if (!data.preguntes || data.preguntes.length === 0) {
                alert('Error: No s\'han pogut carregar les preguntes');
                return;
            }
            
            preguntes = data.preguntes; 
            console.log('Primera pregunta:', preguntes[0]);
            
            // Configurar event listener UNA VEGADA
            configurarEventListeners();
            
            // Carregar estat des de localStorage si existeix
            if (localStorage.partida) {
                estatDeLaPartida = JSON.parse(localStorage.getItem("partida"));
                // Verificar que les preguntes estan carregades abans de mostrar
                if (preguntes.length > 0 && estatDeLaPartida.preguntaActual < NPREGUNTAS) {
                    mostrarPregunta(preguntes[estatDeLaPartida.preguntaActual], estatDeLaPartida.preguntaActual);
                }
                actualitzaMarcador();
            } else {
                // Primera vegada - mostrar primera pregunta
                mostrarPregunta(preguntes[0], 0);
                actualitzaMarcador();
            }
            
            // Iniciar el timer
            iniciarTimer();
        })
        .catch(error => {
            console.error('Error al carregar preguntes:', error);
            alert('Error al carregar les preguntes. Torna a intentar-ho.');
        });
}

function mostrarPregunta(pregunta, indice) {
    let contenidor = document.getElementById("questionari");
    let htmlString = "";
    
    let respostaCorrecta = pregunta.respostes.find(r => r.id == pregunta.idCorrecte);
    if (respostaCorrecta) {
        htmlString += `<img src="servir_imatge.php?fitxer=${respostaCorrecta.url}" alt="Bandera">`;   
    }
    htmlString += `<h3>A quin país pertany aquesta bandera?</h3>`;

    for (let j = 0; j < pregunta.respostes.length; j++) {
        htmlString += `<button id="${indice}_${j}" preg="${indice}" resp="${j}" class="btn-resposta">${pregunta.respostes[j].nombre}</button>`;
    }

    contenidor.innerHTML = htmlString;
}

//AQUESTA FUNCIO REACCCIONA A QUAN UN USUARI MARCA UN BOTO (PREGUNTA I RESPOSTA)
function marcarRespuesta(numPregunta, numRespuesta) {
  console.log("Pregunta " + numPregunta + " Resposta " + numRespuesta);
  if (estatDeLaPartida.respostesUsuari[numPregunta] == undefined) {
    estatDeLaPartida.contadorPreguntes++;
  }
  estatDeLaPartida.respostesUsuari[numPregunta] = numRespuesta;
  actualitzaMarcador();
  
  // Passar a la següent pregunta si no és l'última
  if (numPregunta < NPREGUNTAS - 1) {
    estatDeLaPartida.preguntaActual = numPregunta + 1;
    mostrarPregunta(preguntes[estatDeLaPartida.preguntaActual], estatDeLaPartida.preguntaActual);
  }
}
function actualitzaMarcador() {
  let marcador = document.getElementById("marcador");
  let htmlString = `Preguntes respostes ${estatDeLaPartida.contadorPreguntes}/${NPREGUNTAS} <br>`
  
  // Mostrar temps restant
  let minuts = Math.floor(estatDeLaPartida.tempsRestant / 60);
  let segons = estatDeLaPartida.tempsRestant % 60;
  let tempsFormat = `${minuts}:${segons.toString().padStart(2, '0')}`;
  htmlString += `Temps restant: ${tempsFormat} <br>`
  
  // Barra de progrés del temps
  let percentatgeTemps = (estatDeLaPartida.tempsRestant / 300) * 100;
  htmlString += `
    <div style="width: 100%; background-color: #f0f0f0; border-radius: 5px; margin: 5px 0;">
      <div style="width: ${percentatgeTemps}%; height: 20px; background-color: ${percentatgeTemps > 20 ? '#4CAF50' : '#f44336'}; border-radius: 5px; transition: width 0.3s ease;"></div>
    </div>`

  if (estatDeLaPartida.contadorPreguntes == NPREGUNTAS) {
    htmlString += `<button id="btnEnviar">Enviar Resultats</button>`
  } else {
    htmlString += `<button id="btnEnviar" style="display:none">Enviar Resultats</button>`
  }
  marcador.innerHTML = htmlString;

  //ELIMINO TOTS ELS "SELECCIONADA QUE TINGUI" DE DARRERE ENDAVANT PER EVITAR ERRORS
  let seleccio = document.getElementsByClassName("seleccionada")
  for (let k = seleccio.length - 1; k >= 0; k--) {
    seleccio[k].classList.remove("seleccionada")
  }

  //ANEM A MARCAR LES PREGUNTES QUE JA ESTAN SELECCIONADES
  for (let i = 0; i < estatDeLaPartida.respostesUsuari.length; i++) {
    let resposta = estatDeLaPartida.respostesUsuari[i]
    if (resposta != undefined) {
      let element = document.getElementById(`${i}_${resposta}`);
      if (element) element.classList.add("seleccionada")
    }
  }

  //EMMAGATZEMO L'ESTAT DE LA PARTIDA A LOCALSTORAGE
  localStorage.setItem("partida", JSON.stringify(estatDeLaPartida))
  console.log(estatDeLaPartida)
  
  // Configurar event listener per al botó Enviar Resultats UNA VEGADA
  configurarBotoEnviar();
}

function enviarResultats() {
    // Aturar el timer
    aturarTimer();
    
    let acertades = 0;
    let fallades = 0;
    
    for (let i = 0; i < NPREGUNTAS; i++) {
        let respostaUsuari = estatDeLaPartida.respostesUsuari[i];
        let pregunta = preguntes[i];
        let respostaCorrecta = pregunta.respostes.find(r => r.id == pregunta.idCorrecte);
        
        if (respostaUsuari !== undefined) {
            let respostaSeleccionada = pregunta.respostes[respostaUsuari];
            if (respostaSeleccionada.id == respostaCorrecta.id) {
                acertades++;
            } else {
                fallades++;
            }
        }
    }
    
    // Ocultar marcador
    document.getElementById("marcador").innerHTML = "";
    
    // Mostrar resultados
    let contenidor = document.getElementById("questionari");
    contenidor.innerHTML = `
        <h1>Joc Acabat!</h1>
        <p>Preguntes acertades: ${acertades}</p>
        <p>Preguntes fallades: ${fallades}</p>
        <p>Total preguntes: ${NPREGUNTAS}</p>
        <p>Temps restant: ${Math.floor(estatDeLaPartida.tempsRestant / 60)}:${(estatDeLaPartida.tempsRestant % 60).toString().padStart(2, '0')}</p>
        <button id="btnTornarComençar">Tornar a Començar</button>
    `;
    
    // Añadir event listener al botón
    document.getElementById("btnTornarComençar").addEventListener("click", tornarComençar);
}

function iniciarTimer() {
  // Aturar timer anterior si existeix
  aturarTimer();
  
  // Iniciar nou timer
  idTimer = setInterval(function() {
    if (estatDeLaPartida.tempsRestant > 0) {
      estatDeLaPartida.tempsRestant--;
      // Actualitzar només el temps, no tot el marcador per evitar problemes
      actualitzarTemps();
    } else {
      // Temps esgotat - finalitzar joc automàticament
      aturarTimer();
      enviarResultats();
    }
  }, 1000); // Cada 1000ms = 1 segon
}

function aturarTimer() {
  if (idTimer) {
    clearInterval(idTimer);
    idTimer = null;
  }
}

// Funció per configurar event listeners UNA VEGADA
function configurarEventListeners() {
  let contenidor = document.getElementById("questionari");
  
  // Eliminar event listeners anteriors si existeixen
  contenidor.removeEventListener('click', gestionarClicResposta);
  
  // Afegir nou event listener
  contenidor.addEventListener('click', gestionarClicResposta);
}

// Funció per gestionar clics en respostes
function gestionarClicResposta(e) {
  if (e.target.classList.contains('btn-resposta')) {
    marcarRespuesta(parseInt(e.target.getAttribute("preg")), parseInt(e.target.getAttribute("resp")));
  }
}

// Funció per configurar el botó Enviar UNA VEGADA
function configurarBotoEnviar() {
  let btnEnviar = document.getElementById("btnEnviar");
  if (btnEnviar) {
    // Eliminar event listeners anteriors
    btnEnviar.removeEventListener("click", enviarResultats);
    // Afegir nou event listener
    btnEnviar.addEventListener("click", enviarResultats);
  }
}

// Funció per actualitzar només el temps (més ràpida)
function actualitzarTemps() {
  let marcador = document.getElementById("marcador");
  let htmlActual = marcador.innerHTML;
  
  // Actualitzar només la part del temps
  let minuts = Math.floor(estatDeLaPartida.tempsRestant / 60);
  let segons = estatDeLaPartida.tempsRestant % 60;
  let tempsFormat = `${minuts}:${segons.toString().padStart(2, '0')}`;
  
  // Reemplaçar el temps en l'HTML existent
  let nouHtml = htmlActual.replace(/Temps restant: \d+:\d+/, `Temps restant: ${tempsFormat}`);
  
  // Actualitzar la barra de progrés
  let percentatgeTemps = (estatDeLaPartida.tempsRestant / 300) * 100;
  nouHtml = nouHtml.replace(/width: \d+\.?\d*%/, `width: ${percentatgeTemps}%`);
  nouHtml = nouHtml.replace(/background-color: #[0-9A-Fa-f]{6}/, 
    `background-color: ${percentatgeTemps > 20 ? '#4CAF50' : '#f44336'}`);
  
  marcador.innerHTML = nouHtml;
  // Reconfigurar el botó Enviar després d'assignar innerHTML perquè
  // l'element s'ha recreat i hem perdut els listeners anteriors.
  configurarBotoEnviar();
}

function tornarComençar() {
  // Aturar el timer actual
  aturarTimer();
  
  // Reinicialitzar estat
  estatDeLaPartida = {
    preguntaActual: 0,
    contadorPreguntes: 0,
    respostesUsuari: [],
    tempsRestant: 300
  };
  
  // Netejar localStorage de la partida
  localStorage.removeItem("partida");
  
  // Reiniciar el joc
  iniciarJoc();
}

window.addEventListener('DOMContentLoaded', (event) => {
    // Configurar event listeners per als botons principals
    document.getElementById('btnComençar').addEventListener('click', guardarNom);
    document.getElementById('btnEsborrar').addEventListener('click', esborrarNom);
    
    if (localStorage.getItem("nomUsuari")) {
        // Usuario ya existe - saludar
        let nom = localStorage.getItem("nomUsuari");
        document.getElementById("formulario-usuario").style.display = "none";
        document.getElementById("joc").style.display = "block";
        document.getElementById("saludoUsuario").textContent = `Hola, ${nom}!`;
        iniciarJoc();
    } else {
        // Usuario nuevo - mostrar formulario
        document.getElementById("formulario-usuario").style.display = "block";
    }
});