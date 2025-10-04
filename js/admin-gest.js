function mostrarVistaLista(data) {
  ocultarTodasLasVistas()
  let contenidor = document.getElementById('lista-preguntas')
  contenidor.classList.remove('hidden')

  let html = `
    <div class="vista-header">
      <h2 style="color: #ffffff; font-family: 'Onest', sans-serif; margin-bottom: 20px;">
        Llista de Preguntes 
      </h2>
    </div>
    <div class="preguntas-grid">
  `;

  data.preguntes.forEach((pregunta, index) => {
    let respostaCorrecta = pregunta.respostes.find(r => r.id === pregunta.idCorrecte);

    html += `
      <div class="pregunta-card">
        <div class="pregunta-header">
          <h3>Pregunta ${index + 1}</h3>
          <div class="pregunta-actions">
            <button class="btn-admin success btn-editar" data-id="${pregunta.idPregunta}" data-nom="${respostaCorrecta ? respostaCorrecta.nombre : ''}" data-url="${respostaCorrecta ? respostaCorrecta.url : ''}">
              <i class="fa-solid fa-edit"></i> Editar
            </button>
            <button class="btn-admin danger btn-eliminar" data-id="${pregunta.idPregunta}">
              <i class="fa-solid fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
        
        <div class="pregunta-content">
          ${respostaCorrecta ? `
            <div class="bandera-container">
              <img src="${respostaCorrecta.url.startsWith('http') ? respostaCorrecta.url : 'php/servir_imatge.php?fitxer=' + respostaCorrecta.url}" alt="Bandera resposta correcta" class="bandera-imagen">
            </div>
          ` : ''}
          
          <div class="respostes-list">
            <h4>Respostes disponibles:</h4>
            <ul>
              ${pregunta.respostes.map((resposta) => `
                <li class="${resposta.id === pregunta.idCorrecte ? 'correcta' : ''}">
                  <i class="fa-solid fa-${resposta.id === pregunta.idCorrecte ? 'check-circle' : 'circle'}"></i>
                  ${resposta.nombre}
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`
  contenidor.innerHTML = html
}

function mostrarVistaCrear() {
    ocultarTodasLasVistas()
    document.getElementById('crear-pregunta').classList.remove('hidden')
    
    let html = `
      <div class="vista-header centered">
        <h2 style="color: #ffffff; font-family: 'Onest', sans-serif; margin-bottom: 20px;">
          <i class="fa-solid fa-plus" style="margin-right: 10px;"></i>
          Nova Pregunta
        </h2>
      </div>
      
      <div class="form-container">
        <div class="form-group">
          <label for="nombrePais">
            <i class="fa-solid fa-flag"></i>
            Nom del País
          </label>
          <input type="text" id="nombrePais" placeholder="Introdueix el nom del país">
        </div>
        
        <div class="form-group">
          <label for="imagenBandera">
            <i class="fa-solid fa-image"></i>
            Imatge de la Bandera
          </label>
          <input type="file" id="imagenBandera" accept="image/*">
          <small>Selecciona una imatge de la bandera del país</small>
        </div>
        
        <div class="form-actions">
          <button id="btnEnviar" class="btn-admin success">
            <i class="fa-solid fa-save"></i>
            Guardar Pregunta
          </button>
        </div>
      </div>
    `;
    
    document.getElementById('crear-pregunta').innerHTML = html
    
    document.getElementById('btnEnviar').addEventListener('click', function() {
      let nom = document.getElementById('nombrePais').value
      let arxiu = document.getElementById('imagenBandera').files[0]
      
      if (!nom || !arxiu) {
        alert('Per favor, omple tots els camps')
        return
      }
      
      let formData = new FormData()
      formData.append('nombre', nom)
      formData.append('imagen', arxiu)

      fetch('php/addPregunta.php', {
        method: 'POST',
        body: formData
      })
      .then(resp => resp.json())
      .then(data => {
        console.log(data)
        alert('Pregunta guardada correctament!')
      })
      .catch(error => {
        console.error('Error:', error)
        alert('Error al guardar la pregunta')
      })
    })
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

      fetch('php/updatePregunta.php', {
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

        fetch('php/deletePregunta.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dades)
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data);
            fetch('php/getPreguntas.php?num=20')
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

document.addEventListener('DOMContentLoaded', function() {
    const userGreeting = document.getElementById('user-greeting');
    const btnDeleteUser = document.getElementById('btnDeleteUser');
    
    const nomUsuari = localStorage.getItem('nomUsuari');
    if (nomUsuari) {
        userGreeting.textContent = `Hola, ${nomUsuari}`;
    } else {
        userGreeting.textContent = 'Hola, Usuario';
    }
    
    if (btnDeleteUser) {
        btnDeleteUser.addEventListener('click', function() {
            if (confirm('Estàs segur que vols esborrar el teu nom?')) {
                localStorage.removeItem('nomUsuari');
                localStorage.removeItem('partida');
                userGreeting.textContent = 'Hola, Usuario';
                alert('Nom esborrat correctament');
            }
        });
    }
});

let contenidor = document.getElementById('admin-container');
contenidor.addEventListener('click', function(e) {

   if (e.target.classList.contains('btn-lista')) {
    fetch('php/getPreguntas.php?num=20')
      .then(response => response.json())
      .then(data => {
        console.log("Dades rebudes del servidor:", data);
        mostrarVistaLista(data);
      })
      .catch(error => {
        console.error("Error al cargar preguntes:", error);
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