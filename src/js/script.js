const NPREGUNTAS = 10

let preguntes = []
let idTimer
let estatDeLaPartida = {
  preguntaActual: 0,
  contadorPreguntes: 0,
  respostesUsuari: [],
  tempsRestant: 300
}

function guardarNom() {
  let nom = document.getElementById("nomUsuari").value
  if (nom.trim() !== "") {
    localStorage.setItem("nomUsuari", nom)
    document.getElementById("formulario-usuario").style.display = "none"
    document.getElementById("main-content").style.display = "flex"
    document.getElementById("header-container").style.display = "flex"
    document.getElementById("joc-container").style.display = "block"
    iniciarJoc()
  }
}

function esborrarNom() {
  aturarTimer()
  
  localStorage.removeItem("nomUsuari")
  localStorage.removeItem("partida")
  
  estatDeLaPartida = {
    preguntaActual: 0,
    contadorPreguntes: 0,
    respostesUsuari: [],
    tempsRestant: 300
  }
  
  document.getElementById("main-content").style.display = "none"
  document.getElementById("joc-container").style.display = "none"
  document.getElementById("header-container").style.display = "none"
  document.getElementById("formulario-usuario").style.display = "block"
  document.getElementById("nomUsuari").value = ""
  
  document.getElementById("questionari").innerHTML = ""
  document.getElementById("marcador").innerHTML = ""
  document.getElementById("temporizador-container").innerHTML = ""
}

function iniciarJoc() {
    fetch('../php/getPreguntas.php?num=10')
        .then(response => response.json())
        .then(data => {
            console.log('Dades rebudes:', data)
            
            if (!data.preguntes || data.preguntes.length === 0) {
                alert('Error: No s\'han pogut carregar les preguntes')
                return
            }
            
            preguntes = data.preguntes
            console.log('Primera pregunta:', preguntes[0])
            
            configurarEventListeners()
            
            if (localStorage.partida) {
                estatDeLaPartida = JSON.parse(localStorage.getItem("partida"))
                if (preguntes.length > 0 && estatDeLaPartida.preguntaActual < NPREGUNTAS) {
                    mostrarPregunta(preguntes[estatDeLaPartida.preguntaActual], estatDeLaPartida.preguntaActual)
                }
                actualitzaMarcador()
            } else {
                mostrarPregunta(preguntes[0], 0)
                actualitzaMarcador()
            }
            
            iniciarTimer()
        })
        .catch(error => {
            console.error('Error al carregar preguntes:', error)
            alert('Error al carregar les preguntes. Torna a intentar-ho.')
        })
}

function mostrarPregunta(pregunta, indice) {
    let contenidor = document.getElementById("questionari");
    let htmlString = "";
    
    let respostaCorrecta = pregunta.respostes.find(r => r.id === pregunta.idCorrecte);
    if (respostaCorrecta) {
        if (respostaCorrecta.url.startsWith('http')) {
            htmlString += `<img src="${respostaCorrecta.url}" alt="Bandera">`;   
        } else {
            htmlString += `<img src="../php/servir_imatge.php?fitxer=${respostaCorrecta.url}" alt="Bandera">`;   
        }
    }
    htmlString += `<h3>A quin país pertany aquesta bandera?</h3>`;
    
    htmlString += `<div class="respostes-grid">`;
    for (let j = 0; j < pregunta.respostes.length; j++) {
        htmlString += `<button id="${indice}_${j}" preg="${indice}" resp="${j}" class="btn-resposta">${pregunta.respostes[j].nombre}</button>`;
    }
    htmlString += `</div>`;

    contenidor.innerHTML = htmlString;
}

function marcarRespuesta(numPregunta, numRespuesta) {
  console.log("Pregunta " + numPregunta + " Resposta " + numRespuesta);
  if (estatDeLaPartida.respostesUsuari[numPregunta] === undefined) {
    estatDeLaPartida.contadorPreguntes++;
  }
  estatDeLaPartida.respostesUsuari[numPregunta] = numRespuesta;
  actualitzaMarcador();
  
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

  marcador.innerHTML = htmlString;
  
  actualitzarTemporizador();

  localStorage.setItem("partida", JSON.stringify(estatDeLaPartida))
  console.log(estatDeLaPartida)
  
  if (estatDeLaPartida.contadorPreguntes === NPREGUNTAS) {
    setTimeout(() => {
      enviarResultats();
    }, 500);
  }
}

function enviarResultats() {
    aturarTimer();
    
    document.getElementById("marcador").innerHTML = "";
    document.getElementById("temporizador-container").innerHTML = "";
    
    let correctes = 0;
    for (let i = 0; i < NPREGUNTAS; i++) {
        let respostaUsuari = estatDeLaPartida.respostesUsuari[i];
        let respostaCorrectaIndex = preguntes[i].respostes.findIndex(r => r.id === preguntes[i].idCorrecte);
        if (respostaUsuari === respostaCorrectaIndex) {
            correctes++;
        }
    }
    
    let contenidor = document.getElementById("questionari");
    contenidor.innerHTML = `
        <h1 class="resultat-puntuacio">Joc Acabat!</h1>
        <p class="resultat-titol">Has encertat ${correctes} de ${NPREGUNTAS} respostes!</p>
        <p class="resultat-temps">Temps restant: ${Math.floor(estatDeLaPartida.tempsRestant / 60)}:${(estatDeLaPartida.tempsRestant % 60).toString().padStart(2, '0')}</p>
        <button id="btnTornarComençar" class="btn-glassify">Tornar a Començar</button>
    `;
    
    document.getElementById("btnTornarComençar").addEventListener("click", tornarComençar);
}

function iniciarTimer() {
  aturarTimer();
  
  idTimer = setInterval(function() {
    if (estatDeLaPartida.tempsRestant > 0) {
      estatDeLaPartida.tempsRestant--;
      actualitzarTemps();
    } else {
      aturarTimer();
      enviarResultats();
    }
  }, 1000);
}

function aturarTimer() {
  if (idTimer) {
    clearInterval(idTimer);
    idTimer = null;
  }
}

function configurarEventListeners() {
  let contenidor = document.getElementById("questionari");
  
  contenidor.removeEventListener('click', gestionarClicResposta);
  
  contenidor.addEventListener('click', gestionarClicResposta);
}

function gestionarClicResposta(e) {
  if (e.target.classList.contains('btn-resposta')) {
    marcarRespuesta(parseInt(e.target.getAttribute("preg")), parseInt(e.target.getAttribute("resp")));
  }
}


function actualitzarTemps() {
  actualitzarTemporizador();
}

function actualitzarTemporizador() {
  let temporizadorContainer = document.getElementById("temporizador-container");
  
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
  aturarTimer();
  
  estatDeLaPartida = {
    preguntaActual: 0,
    contadorPreguntes: 0,
    respostesUsuari: [],
    tempsRestant: 300
  };
  
  localStorage.removeItem("partida");
  
  iniciarJoc();
}

window.addEventListener('DOMContentLoaded', (event) => {
    const btnComençar = document.getElementById('btnComençar');
    if (btnComençar) {
        btnComençar.addEventListener('click', guardarNom);
    }
    
    const formularioUsuario = document.getElementById("formulario-usuario");
    const mainContent = document.getElementById("main-content");
    const headerContainer = document.getElementById("header-container");
    const jocContainer = document.getElementById("joc-container");
    
    if (formularioUsuario && mainContent) {
        if (localStorage.getItem("nomUsuari")) {
            formularioUsuario.style.display = "none";
            mainContent.style.display = "flex";
            if (headerContainer) headerContainer.style.display = "flex";
            if (jocContainer) jocContainer.style.display = "block";
            iniciarJoc();
        } else {
            formularioUsuario.style.display = "block";
            mainContent.style.display = "none";
        }
    }

    const btnComençarLanding = document.getElementById("btnComençarLanding");
    const btnAdminLanding = document.getElementById("btnAdminLanding");

    if (btnComençarLanding) {
        btnComençarLanding.addEventListener("click", function() {
            window.location.href = "index.html";
        });
    }

    if (btnAdminLanding) {
        btnAdminLanding.addEventListener("click", function() {
            window.location.href = "admin.html";
        });
    }
});