const NPREGUNTAS = 10

let preguntes = []; 
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
    document.getElementById("joc").innerHTML = `
      <h1>Hola, ${nom}!</h1>
      <div id="questionari"></div>
      <div id="marcador"></div>
      <a href="admin.html">Panel d'Administració</a>
      <button onclick="esborrarNom()">Esborrar nom</button>
    `;
    iniciarJoc();
  }
}

function esborrarNom() {
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
            preguntes = data.preguntes; 
            console.log('Primera pregunta:', preguntes[0]);
            mostrarPregunta(preguntes[0], 0);
            actualitzaMarcador();
            
            let contenidor = document.getElementById("questionari");
            contenidor.addEventListener('click', function (e) {
                if (e.target.classList.contains('btn-resposta')) {
                    marcarRespuesta(parseInt(e.target.getAttribute("preg")), parseInt(e.target.getAttribute("resp")))
                }
            });
            
            // Carregar estat des de localStorage si existeix
            if (localStorage.partida) {
                estatDeLaPartida = JSON.parse(localStorage.getItem("partida"));
                actualitzaMarcador()
                if (estatDeLaPartida.preguntaActual < NPREGUNTAS) {
                    mostrarPregunta(preguntes[estatDeLaPartida.preguntaActual], estatDeLaPartida.preguntaActual);
                }
            }
        });
}

function mostrarPregunta(pregunta, indice) {
    let contenidor = document.getElementById("questionari");
    let htmlString = "";
    
    let respostaCorrecta = pregunta.respostes.find(r => r.id == pregunta.idCorrecte);
    if (respostaCorrecta) {
        htmlString += `<img src="${respostaCorrecta.url}" alt="Bandera">`;   
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
  
  // Event listener per al botó Enviar Resultats
  let btnEnviar = document.getElementById("btnEnviar");
  if (btnEnviar) {
    btnEnviar.addEventListener("click", function () {
      enviarResultats();
    });
  }
}

function enviarResultats() {
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
        <button onclick="tornarComençar()">Tornar a Començar</button>
    `;
}

function tornarComençar() {
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
    if (localStorage.getItem("nomUsuari")) {
        // Usuario ya existe - saludar
        let nom = localStorage.getItem("nomUsuari");
        document.getElementById("formulario-usuario").style.display = "none";
        document.getElementById("joc").style.display = "block";
        document.getElementById("joc").innerHTML = `
            <h1>Hola, ${nom}!</h1>
            <div id="questionari"></div>
            <div id="marcador"></div>
            <a href="admin.html">Panel d'Administració</a>
            <button onclick="esborrarNom()">Esborrar nom</button>
        `;
        iniciarJoc();
    } else {
        // Usuario nuevo - mostrar formulario
        document.getElementById("formulario-usuario").style.display = "block";
    }
});