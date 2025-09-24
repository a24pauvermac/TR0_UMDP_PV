let preguntes = []; 
let preguntaActual = 0;
let contador = 0;

function rendJoc(data) {
    console.log('Datos recibidos:', data);
    preguntes = data.preguntes; 
    console.log('Primera pregunta:', preguntes[0]);
    mostrarPregunta(preguntes[0], 0);  
}

function mostrarPregunta(pregunta, indice) {
    let contenidor = document.getElementById("questionari");
    let htmlString = "";
    
    
    let respuestaCorrecta = pregunta.respostes.find(r => r.id == pregunta.idCorrecte);
    if (respuestaCorrecta) {
        htmlString += `<img src="${respuestaCorrecta.url}" alt="Bandera">`;   
    }
    htmlString += `<h3>A quin país pertany aquesta bandera?</h3>`;

    for (let j = 0; j < pregunta.respostes.length; j++) {
        htmlString += `<p>${pregunta.respostes[j].nombre}</p>`;
        htmlString += `<button onclick="marcarRespuesta(${j}, ${indice})">Selecciona</button>`;
    }

    contenidor.innerHTML = htmlString;
}

function marcarRespuesta(respostaUsuari, preguntaIndex) {
    fetch('comprovaPregunta.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `pregunta_actual=${preguntaIndex}&resposta=${respostaUsuari}`
    })
    .then(response => response.json())
    .then(data => {
        let contenidor = document.getElementById("questionari");
        contenidor.innerHTML = `<h2>${data.resultat}</h2>
            <p>Puntuació actual: ${data.puntuacio} de ${data.total_preguntes}</p>`;
        if (!data.final) {
            contenidor.innerHTML += `<button onclick="cargarSigPregunta()">Següent Pregunta</button>`;
        } else {
            mostrarFinal();
        }
    });
}
function cargarSigPregunta() {
    preguntaActual++; 
    contador++; 
    mostrarPregunta(preguntes[preguntaActual], preguntaActual);
}

function mostrarFinal() {
    fetch('final.php')
        .then(response => response.json())
        .then(data => {
            let contenidor = document.getElementById("questionari");
            contenidor.innerHTML = `<h1>Joc Acabat!</h1>
                <h2>Has encertat ${data.puntuacio} de ${data.total_preguntes} preguntes</h2>
                <a href="index.html">Tornar a Començar</a>`;
        });
}

window.addEventListener('DOMContentLoaded', event => {
    fetch('getPreguntas.php?num=10') 
        .then(response => response.json())
        .then(data => rendJoc(data));

    console.log("DOM carregat i analitzat");
});