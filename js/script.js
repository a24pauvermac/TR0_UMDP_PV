//Variables globals i d'estat
// Definim quantes preguntes tindrà el joc
const NPREGUNTAS = 10

// Aquestes són les variables que necessitem per tot el joc
let preguntes = [] // Aquí guardarem totes les preguntes que ens doni el servidor
let idTemporitzador // Això ens serveix per controlar el cronòmetre
let estatDeLaPartida = {
  preguntaActual: 0, // Quina pregunta estem fent ara mateix
  comptadorPreguntes: 0, // Quantes preguntes hem contestat
  respostesUsuari: [], // Les respostes que ha donat l'usuari
  tempsRestant: 300 // Quant temps queda (300 segons = 5 minuts)
}

//Funció per guardar el nom de l'usuari
//Guarda el nom de l'usuari en el localStorage i mostra el contingut de la pàgina
//Si el nom de l'usuari és buit, no es guarda i es mostra un missatge d'error
function guardarNom() {
  // Agafem el text que ha escrit l'usuari en el camp de nom
  let nom = document.getElementById("nomUsuari").value
  // Comprovem si ha escrit alguna cosa (trim() treu els espais en blanc)
  if (nom.trim() !== "") {
    // Si ha escrit un nom, el guardem en la memòria del navegador
    localStorage.setItem("nomUsuari", nom)
    // Amaguem el formulari del nom
    document.getElementById("formulario-usuario").style.display = "none"
    // Mostrem la part principal del joc
    document.getElementById("main-content").style.display = "flex"
    document.getElementById("header-container").style.display = "flex"
    document.getElementById("joc-container").style.display = "block"
    // I comencem el joc
    iniciarJoc()
  }
}

// Aquesta funció esborra tot i torna al principi
function esborrarNom() {
  // Aturem el cronòmetre si està funcionant
  aturarTemporitzador()
  
  // Esborrem tot el que teníem guardat
  localStorage.removeItem("nomUsuari")
  localStorage.removeItem("partida")
  
  // Tornem a posar tot a zero
  estatDeLaPartida = {
    preguntaActual: 0,
    comptadorPreguntes: 0,
    respostesUsuari: [],
    tempsRestant: 300
  }
  
  // Amaguem el joc i mostrem el formulari del nom
  document.getElementById("main-content").style.display = "none"
  document.getElementById("joc-container").style.display = "none"
  document.getElementById("header-container").style.display = "none"
  document.getElementById("formulario-usuario").style.display = "block"
  // Esborrem el nom que havia escrit
  document.getElementById("nomUsuari").value = ""
  
  // Netegem tot el contingut del joc
  document.getElementById("questionari").innerHTML = ""
  document.getElementById("marcador").innerHTML = ""
  document.getElementById("temporizador-container").innerHTML = ""
}

// Aquesta funció comença el joc demanant les preguntes al servidor
function iniciarJoc() {
    // Demanem 10 preguntes al servidor (getPreguntas.php)
    fetch('php/getPreguntas.php?num=10')
        // Quan el servidor respon, convertim la resposta a JSON
        .then(response => response.json())
        // I quan tenim les dades, les processem
        .then(data => {
            console.log('Dades rebudes:', data)
            
            // Comprovem si hem rebut preguntes
            if (!data.preguntes || data.preguntes.length === 0) {
                alert('Error: No s\'han pogut carregar les preguntes')
                return
            }
            
            // Guardem les preguntes en la nostra variable
            preguntes = data.preguntes
            
            // Guardem el temps que queda al servidor
            fetch('php/guardaTemps.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `temps=${estatDeLaPartida.tempsRestant}`
            })
            console.log('Primera pregunta:', preguntes[0])
            
            // Preparem els botons perquè funcionin quan l'usuari hi cliqui
            configurarEventListeners()
            
            // Si ja teníem una partida guardada, la continuem
            if (localStorage.partida) {
                estatDeLaPartida = JSON.parse(localStorage.getItem("partida"))
                if (preguntes.length > 0 && estatDeLaPartida.preguntaActual < NPREGUNTAS) {
                    mostrarPregunta(preguntes[estatDeLaPartida.preguntaActual], estatDeLaPartida.preguntaActual)
                }
                actualitzaMarcador()
            } else {
                // Si no, comencem des del principi
                mostrarPregunta(preguntes[0], 0)
                actualitzaMarcador()
            }
            
            // Comencem el cronòmetre :D
            iniciarTemporitzador()
        })
        // Si hi ha algun error, el mostrem
        .catch(error => {
            console.error('Error al carregar preguntes:', error)
            alert('Error al carregar les preguntes. Torna a intentar-ho.')
        })
}

// Aquesta funció mostra una pregunta amb la seva imatge i les opcions de resposta
function mostrarPregunta(pregunta, indice) {
    // Agafem el lloc on hem de mostrar la pregunta
    let contenidor = document.getElementById("questionari");
    // Comencem amb un text buit que anirem omplint
    let htmlString = "";
    
    // La resposta correcta sempre està en l'última posició (posició 3) aixo en un futur m'agradaria millorar-ho perque no la manera correcte de solucionar-ho
    let respostaCorrecta = pregunta.respostes[3];
    if (respostaCorrecta) {
        // Si la imatge és un url d'internet, la mostrem directament
        if (respostaCorrecta.url.startsWith('http')) {
            htmlString += `<img src="${respostaCorrecta.url}" alt="Bandera">`;   
        } else {
            // Si no, la demanem al nostre servidor
            htmlString += `<img src="php/servir_imatge.php?fitxer=${respostaCorrecta.url}" alt="Bandera">`;   
        }
    }
    // Afegim la pregunta
    htmlString += `<h3>A quin país pertany aquesta bandera?</h3>`;
    
    // Creem un contenidor per les respostes
    htmlString += `<div class="respostes-grid">`;
    // Per cada resposta, creem un botó
    for (let j = 0; j < pregunta.respostes.length; j++) {
        htmlString += `<button id="${indice}_${j}" preg="${indice}" resp="${j}" class="btn-resposta">${pregunta.respostes[j].nombre}</button>`;
    }
    htmlString += `</div>`;

    // Posem tot el HTML que hem creat a la pàgina
    contenidor.innerHTML = htmlString;
}

// Aquesta funció s'executa quan l'usuari clica una resposta
function marcarRespuesta(numPregunta, numRespuesta) {
  console.log("Pregunta " + numPregunta + " Resposta " + numRespuesta);
  
  // Augmentem el comptador de preguntes contestades
  estatDeLaPartida.comptadorPreguntes++;
  
  // Enviem la resposta al servidor perquè la comprovi
  fetch('php/comprovaPregunta.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `pregunta_actual=${numPregunta}&resposta=${numRespuesta}`
  })
  // Quan el servidor respon, convertim la resposta a JSON
  .then(response => response.json())
  // I processem la resposta
  .then(data => {
    console.log('Resposta del servidor:', data);
    
    // Mostrem si ha encertat o no
    mostrarResultat(data);
    
    // Si és l'última pregunta, anar al final
    if (data.es_final) {
      // Esperem 2 segons i finalitzem el joc
      setTimeout(() => {
        finalitzarJoc();
      }, 2000);
    } else {
      // Si no, continuem amb la següent pregunta
      setTimeout(() => {
        estatDeLaPartida.preguntaActual = numPregunta + 1;
        mostrarPregunta(preguntes[estatDeLaPartida.preguntaActual], estatDeLaPartida.preguntaActual);
        actualitzaMarcador();
      }, 2000);
    }
  })
  // Si hi ha algun error, el mostrem
  .catch(error => {
    console.error('Error:', error);
    alert('Error al verificar la resposta');
  });
}
function actualitzaMarcador() {
  let marcador = document.getElementById("marcador");
  
  let htmlString = `
    <div class="marcador-content">
      <p class="marcador-text">Pregunta ${estatDeLaPartida.comptadorPreguntes + 1} de ${NPREGUNTAS}</p>
    </div>
  `;

  marcador.innerHTML = htmlString;
  
  actualitzarTemporitzador();

  localStorage.setItem("partida", JSON.stringify(estatDeLaPartida))
  console.log(estatDeLaPartida)
}

function mostrarResultat(data) {
    let contenidor = document.getElementById("questionari");
    
    contenidor.innerHTML = `
        <div class="resultado-pregunta" style="text-align: center; padding: 20px;">
            <h3>${data.resultat}</h3>
            <p>Puntuació: ${data.puntuacio} de ${data.total_preguntes}</p>
        </div>
    `;
}

function finalitzarJoc() {
    aturarTemporitzador();
    
    // Obtenir resultats finals del servidor
    fetch('php/final.php')
    .then(response => response.json())
    .then(data => {
        document.getElementById("marcador").innerHTML = "";
        document.getElementById("temporizador-container").innerHTML = "";
        
        let contenidor = document.getElementById("questionari");
        contenidor.innerHTML = `
            <h1 class="resultat-puntuacio">Joc Acabat!</h1>
            <p class="resultat-titol">Has encertat ${data.puntuacio} de ${data.total_preguntes} respostes</p>
            <p class="resultat-temps">Temps restant: ${Math.floor(data.temps_restant / 60)}:${(data.temps_restant % 60).toString().padStart(2, '0')}</p>
            <button id="btnTornarComençar" class="btn-glassify">Tornar a Començar</button>
        `;
        
        document.getElementById("btnTornarComençar").addEventListener("click", tornarComençar);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al obtenir resultats finals');
    });
}

// Aquesta funció comença el cronòmetre que compta enrere
function iniciarTemporitzador() {
  // Primer aturem qualsevol cronòmetre que estigui funcionant
  aturarTemporitzador();
  
  // Creem un cronòmetre que s'executa cada segon (1000 mil·lisegons)
  idTemporitzador = setInterval(function() {
    // Si encara queda temps
    if (estatDeLaPartida.tempsRestant > 0) {
      // Restem un segon
      estatDeLaPartida.tempsRestant--;
      // Actualitzem la pantalla
      actualitzarTemps();
    } else {
      // Si s'ha acabat el temps, aturem el cronòmetre i finalitzem el joc
      aturarTemporitzador();
      finalitzarJoc();
    }
  }, 1000);
}

// Aquesta funció atura el cronòmetre
function aturarTemporitzador() {
  if (idTemporitzador) {
    // Aturem el cronòmetre
    clearInterval(idTemporitzador);
    // I el posem a null per netejar
    idTemporitzador = null;
  }
}

// Aquesta funció prepara els botons perquè funcionin quan l'usuari hi cliqui
function configurarEventListeners() {
  let contenidor = document.getElementById("questionari");
  
  // Primer treiem qualsevol event listener que hi hagi
  contenidor.removeEventListener('click', gestionarClicResposta);
  
  // I afegim el nou
  contenidor.addEventListener('click', gestionarClicResposta);
}

// Aquesta funció s'executa quan l'usuari clica qualsevol cosa
function gestionarClicResposta(e) {
  // Si ha clicat un botó de resposta
  if (e.target.classList.contains('btn-resposta')) {
    // Agafem quin número de pregunta i resposta ha clicat
    marcarRespuesta(parseInt(e.target.getAttribute("preg")), parseInt(e.target.getAttribute("resp")));
  }
}


function actualitzarTemps() {
  actualitzarTemporitzador();
}

function actualitzarTemporitzador() {
  let temporitzadorContainer = document.getElementById("temporizador-container");
  
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
  
  temporitzadorContainer.innerHTML = htmlString;
  
  // Actualitzar temps en sessió cada vegada que canviï
  fetch('php/guardaTemps.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `temps=${estatDeLaPartida.tempsRestant}`
  }).catch(error => console.log('Error actualitzant temps:', error));
}

function tornarComençar() {
  aturarTemporitzador();
  
  estatDeLaPartida = {
    preguntaActual: 0,
    comptadorPreguntes: 0,
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