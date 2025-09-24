
function mostrarVistaLista(data) {
  ocultarTodasLasVistas();
  let contenidor = document.getElementById('lista-preguntas');
  contenidor.classList.remove('hidden');

  let html = "";

  data.preguntes.forEach((pregunta, index) => {
    
    let respostaCorrecta = pregunta.respostes.find(r => r.id == pregunta.idCorrecte);

    html += `<div class="pregunta">`;
    html += `<h3>Pregunta ${index + 1}</h3>`;
 
    if (respostaCorrecta) {
      html += `<img src="${respostaCorrecta.url}" alt="Bandera resposta correcta" style="max-width: 150px;">`;
    }
    pregunta.respostes.forEach((resposta) => {
      html += `<p>${resposta.nombre}</p>`;
    });

    html += `</div>`;
  });

  contenidor.innerHTML = html;
}

function mostrarVistaCrear(data) {
    ocultarTodasLasVistas();
    document.getElementById('crear-pregunta').classList.remove('hidden');

}

function ocultarTodasLasVistas() {
    let contenedores = document.querySelectorAll('.container');
    
    contenedores.forEach(contenedor => {
        contenedor.classList.add('hidden');
    });
}

contenidor.addEventListener('click', function(e) {
    if(e.target.classList.contains('btn')){

    if(e.target.classList.contains('btn-crear')){
        mostrarVistaCrear();
    }
    
    if(e.target.classList.contains('btn-guardar')){
        guardarPregunta();
    }
    
    if(e.target.classList.contains('btn-cancelar')){
        mostrarVistaLista();
    fetch('getPreguntas.php?num=10') 
    .then(response => response.json())
    .then(data => mostrarVistaLista(data));
    }
    }
});
