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

    html += `<button class="btn-eliminar" data-id="${pregunta.idPregunta}">Eliminar</button>`;
    html += `<button class="btn-editar" data-id="${pregunta.idPregunta}" data-nombre="${respostaCorrecta.nombre}" data-url="${respostaCorrecta.url}">Editar</button>`;
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

function mostrarVistaEditar(idPregunta, nombre, url) {
    ocultarTodasLasVistas();
    document.getElementById('crear-pregunta').classList.remove('hidden');
    
    let html= ""; 
    html += `<input type="text" id="nombrePais" placeholder="Nom del país" value="${nombre}">`;
    html += `<input type="text" id="urlBandera" placeholder="URL de la bandera" value="${url}">`;
    html += `<button id="btnActualizar" data-id="${idPregunta}">Actualitzar pregunta</button>`;
    html += `<button id="btnCancelar">Cancelar</button>`;
    
    document.getElementById('crear-pregunta').innerHTML = html;
    
    document.getElementById('btnActualizar').addEventListener('click', function() {
      let nombre = document.getElementById('nombrePais').value;
      let url = document.getElementById('urlBandera').value;
      let dades = { idPregunta, nombre, url };

      fetch('updatePregunta.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dades)
      })
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
      });
    });
    
    document.getElementById('btnCancelar').addEventListener('click', function() {
      mostrarVistaCrear();
    });
}

function eliminarPregunta(idPregunta) {
    if (confirm('Estàs segur que vols eliminar aquesta pregunta?')) {
        let dades = { idPregunta };

        fetch('deletePregunta.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dades)
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data);
            // Recarregar la llista de preguntes
            fetch('getPreguntas.php?num=20')
                .then(response => response.json())
                .then(data => {
                    mostrarVistaLista(data);
                });
        });
    }
}

function ocultarTodasLasVistas() {
    let listaPreguntas = document.getElementById('lista-preguntas');
    let crearPregunta = document.getElementById('crear-pregunta');
    
    if (listaPreguntas) listaPreguntas.classList.add('hidden');
    if (crearPregunta) crearPregunta.classList.add('hidden');
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
    
    if(e.target.classList.contains('btn-eliminar')){
        let idPregunta = e.target.getAttribute('data-id');
        eliminarPregunta(idPregunta);
    }
    
    if(e.target.classList.contains('btn-editar')){
        let idPregunta = e.target.getAttribute('data-id');
        let nombre = e.target.getAttribute('data-nombre');
        let url = e.target.getAttribute('data-url');
        mostrarVistaEditar(idPregunta, nombre, url);
    }
    }
  
);