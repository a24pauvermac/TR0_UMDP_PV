
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

function mostrarVistaCrear() {
    ocultarTodasLasVistas();
    document.getElementById('crear-pregunta').classList.remove('hidden');
    
    let html= ""; 
    html += `<input type="text" id="nombrePais" placeholder="Nom del país">`;
    html += `<input type="text" id="urlBandera" placeholder="URL de la bandera">`;
    html += `<button id="btnEnviar">Guardar pregunta</button>`;
    
    document.getElementById('crear-pregunta').innerHTML = html;
    
    document.getElementById('btnEnviar').addEventListener('click', function() {
      let nombre = document.getElementById('nombrePais').value;
      let url = document.getElementById('urlBandera').value;
      let dades = { nombre, url };

      fetch('addPregunta.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dades)
      })
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
      });
    });
}


function ocultarTodasLasVistas() {
    let contenedores = document.querySelectorAll('.container');
    
    contenedores.forEach(contenedor => {
        contenedor.classList.add('hidden');
    });
}

let contenidor = document.getElementById('admin-container');
contenidor.addEventListener('click', function(e) {

   if (e.target.classList.contains('btn-lista')) {
    fetch('getPreguntas.php?num=20')
      .then(response => response.json())
      .then(data => {
        console.log("Dades rebudes del servidor:", data);
        mostrarVistaLista(data);
      });
}

    
    if(e.target.classList.contains('btn-crear')){
        mostrarVistaCrear();
    }
    
    if(e.target.classList.contains('btn-cancelar')){
      
  
    }
    }
  
);
