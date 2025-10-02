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
    html += `<button class="btn-editar" data-id="${pregunta.idPregunta}" data-nom="${respostaCorrecta.nombre}" data-url="${respostaCorrecta.url}">Editar</button>`;
    html += `</div>`;
  });

  contenidor.innerHTML = html;
}

function mostrarVistaCrear() {
    ocultarTodasLasVistas();
    document.getElementById('crear-pregunta').classList.remove('hidden');
    
    let html= ""; 
    html += `<input type="text" id="nombrePais" placeholder="Nom del país">`;
    html += `<input type="file" id="imagenBandera" accept="image/*">`;
    html += `<button id="btnEnviar">Guardar pregunta</button>`;
    
    document.getElementById('crear-pregunta').innerHTML = html;
    
    document.getElementById('btnEnviar').addEventListener('click', function() {
      let nom = document.getElementById('nombrePais').value;
      let arxiu = document.getElementById('imagenBandera').files[0];
      
      // Validar que hi ha nom i arxiu
      if (!nom || !arxiu) {
        alert('Per favor, omple tots els camps');
        return;
      }
      
      // Crear FormData per enviar l'arxiu
      let formData = new FormData();
      formData.append('nombre', nom);
      formData.append('imagen', arxiu);

      fetch('addPregunta.php', {
        method: 'POST',
        body: formData  // NO posem headers, fetch ho fa automàtic amb FormData
      })
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        alert('Pregunta guardada correctament!');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error al guardar la pregunta');
      });
    });
}

function mostrarVistaEditar(idPregunta, nom, url) {
    ocultarTodasLasVistas();
    document.getElementById('crear-pregunta').classList.remove('hidden');
    
    let html= ""; 
    html += `<input type="text" id="nombrePais" placeholder="Nom del país" value="${nom}">`;
    html += `<input type="text" id="urlBandera" placeholder="URL de la bandera" value="${url}">`;
    html += `<button id="btnActualizar" data-id="${idPregunta}">Actualitzar pregunta</button>`;
    html += `<button id="btnCancelar">Cancelar</button>`;
    
    document.getElementById('crear-pregunta').innerHTML = html;
    
    document.getElementById('btnActualizar').addEventListener('click', function() {
      let nom = document.getElementById('nombrePais').value;
      let url = document.getElementById('urlBandera').value;
      let dades = { idPregunta, nom, url };

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
        let nom = e.target.getAttribute('data-nom');
        let url = e.target.getAttribute('data-url');
        mostrarVistaEditar(idPregunta, nom, url);
    }
    }
  
);