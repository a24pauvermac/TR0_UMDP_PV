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
    document.getElementById("main-content").style.display = "flex";
    document.getElementById("header-container").style.display = "flex";
    document.getElementById("joc-container").style.display = "block";
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
  
  // Mostrar formulario de nuevo y ocultar main-content y juego
  document.getElementById("main-content").style.display = "none";
  document.getElementById("joc-container").style.display = "none";
  document.getElementById("header-container").style.display = "none";
  document.getElementById("formulario-usuario").style.display = "block";
  document.getElementById("nomUsuari").value = "";
  
  // Netejar contingut
  document.getElementById("questionari").innerHTML = "";
  document.getElementById("marcador").innerHTML = "";
  document.getElementById("temporizador-container").innerHTML = "";
}

function iniciarJoc() {
    fetch('../php/getPreguntas.php?num=10')
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
        // Si és una URL externa (comença amb http), usar-la directament
        // Si és només el nom del fitxer, usar servir_imatge.php
        if (respostaCorrecta.url.startsWith('http')) {
            htmlString += `<img src="${respostaCorrecta.url}" alt="Bandera">`;   
        } else {
            htmlString += `<img src="../php/servir_imatge.php?fitxer=${respostaCorrecta.url}" alt="Bandera">`;   
        }
    }
    htmlString += `<h3>A quin país pertany aquesta bandera?</h3>`;
    
    // Crear contenedor grid para las respuestas
    htmlString += `<div class="respostes-grid">`;
    for (let j = 0; j < pregunta.respostes.length; j++) {
        htmlString += `<button id="${indice}_${j}" preg="${indice}" resp="${j}" class="btn-resposta">${pregunta.respostes[j].nombre}</button>`;
    }
    htmlString += `</div>`;

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
  
  let htmlString = `
    <div class="marcador-content">
      <p class="marcador-text">Pregunta ${estatDeLaPartida.contadorPreguntes + 1} de ${NPREGUNTAS}</p>
    </div>
  `;

  if (estatDeLaPartida.contadorPreguntes == NPREGUNTAS) {
    htmlString += `<button id="btnEnviar">Enviar Resultats</button>`
  } else {
    htmlString += `<button id="btnEnviar" style="display:none">Enviar Resultats</button>`
  }
  marcador.innerHTML = htmlString;
  
  // Actualitzar el temporizador en el seu propi div
  actualitzarTemporizador();

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
    
    // Ocultar marcador
    document.getElementById("marcador").innerHTML = "";
    
    // Mostrar resultados simples
    let contenidor = document.getElementById("questionari");
    contenidor.innerHTML = `
        <h1>Joc Acabat!</h1>
        <p>Has completat ${NPREGUNTAS} preguntes</p>
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
  // Actualitzar només el temporizador
  actualitzarTemporizador();
}

function actualitzarTemporizador() {
  let temporizadorContainer = document.getElementById("temporizador-container");
  
  // Crear el temporizador blanco
  let minuts = Math.floor(estatDeLaPartida.tempsRestant / 60);
  let segons = estatDeLaPartida.tempsRestant % 60;
  let tempsFormat = `${minuts}:${segons.toString().padStart(2, '0')}`;
  let percentatgeTemps = (estatDeLaPartida.tempsRestant / 300) * 100;
  
  let htmlString = `
    <div class="temporizador-container">
      <div class="barra-temporizador">
        <div class="barra-temporizador-progreso" style="width: ${percentatgeTemps}%"></div>
      </div>
      <p class="temps-text">Temps restant: ${tempsFormat}</p>
    </div>
  `;
  
  temporizadorContainer.innerHTML = htmlString;
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
    
    if (localStorage.getItem("nomUsuari")) {
        // Usuario ya existe - iniciar juego
        document.getElementById("formulario-usuario").style.display = "none";
        document.getElementById("main-content").style.display = "flex";
        document.getElementById("header-container").style.display = "flex";
        document.getElementById("joc-container").style.display = "block";
        iniciarJoc();
    } else {
        // Usuario nuevo - mostrar formulario
        document.getElementById("formulario-usuario").style.display = "block";
        document.getElementById("main-content").style.display = "none";
    }
});