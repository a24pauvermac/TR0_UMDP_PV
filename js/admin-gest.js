// Aquesta funció mostra la llista de preguntes a l'administrador
function mostrarVistaLista(data) {
  // Amaguem totes les altres pantalles
  ocultarTodasLasVistas()
  // Agafem el lloc on volem mostrar la llista
  let contenidor = document.getElementById('lista-preguntas')
  // Treiem la classe 'hidden' per mostrar-ho
  contenidor.classList.remove('hidden')

  // Comencem a crear el HTML que volem mostrar
  let html = `
    <div class="vista-header">
      <h2 style="color: #ffffff; font-family: 'Onest', sans-serif; margin-bottom: 20px;">
        Llista de Preguntes 
      </h2>
    </div>
    <div class="preguntas-grid">
  `;

  // Per cada pregunta que hem rebut del servidor
  data.preguntes.forEach((pregunta, index) => {
    // Busquem quina és la resposta correcta (l'admin pot veure-ho)
    let respostaCorrecta = pregunta.respostes.find(r => r.id === pregunta.idCorrecte);

    // Afegim el HTML per a cada pregunta
    html += `
      <div class="pregunta-card">
        <div class="pregunta-header">
          <h3>Pregunta ${index + 1}</h3>
          <div class="pregunta-actions">
            <!-- Botó per editar amb dades guardades en els atributs -->
            <button class="btn-admin success btn-editar" data-id="${pregunta.idPregunta}" data-nom="${respostaCorrecta ? respostaCorrecta.nombre : ''}" data-url="${respostaCorrecta ? respostaCorrecta.url : ''}">
              <i class="fa-solid fa-edit"></i> Editar
            </button>
            <!-- Botó per eliminar amb l'ID de la pregunta -->
            <button class="btn-admin danger btn-eliminar" data-id="${pregunta.idPregunta}">
              <i class="fa-solid fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
        
        <div class="pregunta-content">
          ${respostaCorrecta ? `
            <div class="bandera-container">
              <!-- Si la imatge és d'internet, la mostrem directament, si no, la demanem al servidor -->
              <img src="${respostaCorrecta.url.startsWith('http') ? respostaCorrecta.url : 'php/servir_imatge.php?fitxer=' + respostaCorrecta.url}" alt="Bandera resposta correcta" class="bandera-imagen">
            </div>
          ` : ''}
          
          <div class="respostes-list">
            <h4>Respostes disponibles:</h4>
            <ul>
              <!-- Per cada resposta, mostrem si és correcta o no -->
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

  // Tancam el div i posem tot el HTML a la pàgina
  html += `</div>`
  contenidor.innerHTML = html
}

// Aquesta funció mostra el formulari per crear una nova pregunta
function mostrarVistaCrear() {
    // Amaguem totes les altres pantalles
    ocultarTodasLasVistas()
    // Mostrem la pantalla de crear pregunta
    document.getElementById('crear-pregunta').classList.remove('hidden')
    
    // Creem el HTML del formulari
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
    
    // Posem el formulari a la pàgina
    document.getElementById('crear-pregunta').innerHTML = html
    
    // Quan l'usuari clica el botó de guardar
    document.getElementById('btnEnviar').addEventListener('click', function() {
      // Agafem el text que ha escrit i l'arxiu que ha seleccionat
      let nom = document.getElementById('nombrePais').value
      let arxiu = document.getElementById('imagenBandera').files[0]
      
      // Comprovem que ha omplert tots els camps
      if (!nom || !arxiu) {
        alert('Per favor, omple tots els camps')
        return
      }
      
      // Creem un FormData per enviar arxius al servidor
      let formData = new FormData()
      formData.append('nombre', nom)
      formData.append('imagen', arxiu)

      // Enviem les dades al servidor (ja explicat a script.js)
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

// Aquesta funció mostra el formulari per editar una pregunta existent
function mostrarVistaEditar(idPregunta, nom, url) {
    // Amaguem totes les altres pantalles
    ocultarTodasLasVistas();
    // Mostrem la pantalla d'edició
    document.getElementById('crear-pregunta').classList.remove('hidden');
    
    // Creem un formulari simple amb els valors actuals
    let html= ""; 
    html += `<input type="text" id="nombrePais" placeholder="Nom del país" value="${nom}">`;
    html += `<input type="text" id="urlBandera" placeholder="URL de la bandera" value="${url}">`;
    html += `<button id="btnActualizar" class="btn-glassify" data-id="${idPregunta}">Actualitzar pregunta</button>`;
    
    // Posem el formulari a la pàgina
    document.getElementById('crear-pregunta').innerHTML = html;
    
    // Quan l'usuari clica actualitzar
    document.getElementById('btnActualizar').addEventListener('click', function() {
      // Agafem els nous valors
      let nom = document.getElementById('nombrePais').value;
      let url = document.getElementById('urlBandera').value;
      // Creem un objecte amb les dades
      let dades = { idPregunta, nom, url };

      // Enviem les dades al servidor (ja explicat a script.js)
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
    
}

// Aquesta funció elimina una pregunta del servidor
function eliminarPregunta(idPregunta) {
    // Demanem confirmació a l'usuari
    if (confirm('Estàs segur que vols eliminar aquesta pregunta?')) {
        // Creem un objecte amb l'ID de la pregunta
        let dades = { idPregunta };

        // Enviem la petició d'eliminació al servidor (ja explicat a script.js)
        fetch('php/deletePregunta.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dades)
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data);
            // Després d'eliminar, tornem a carregar la llista
            fetch('php/getPreguntasAdmin.php?num=20')
                .then(response => response.json())
                .then(data => {
                    mostrarVistaLista(data);
                });
        });
    }
}

// Aquesta funció amaga totes les pantalles
function ocultarTodasLasVistas() {
    let listaPreguntas = document.getElementById('lista-preguntas');
    let crearPregunta = document.getElementById('crear-pregunta');
    
    // Si els elements existeixen, els amaguem
    if (listaPreguntas) listaPreguntas.classList.add('hidden');
    if (crearPregunta) crearPregunta.classList.add('hidden');
}

// Quan la pàgina s'ha carregat completament (ja explicat a script.js)
document.addEventListener('DOMContentLoaded', function() {
    const userGreeting = document.getElementById('user-greeting');
    const btnDeleteUser = document.getElementById('btnDeleteUser');
    
    // Comprovem si hi ha un nom d'usuari guardat (ja explicat a script.js)
    const nomUsuari = localStorage.getItem('nomUsuari');
    if (nomUsuari) {
        userGreeting.textContent = `Hola, ${nomUsuari}`;
    } else {
        userGreeting.textContent = 'Hola, Usuario';
    }
    
    // Si hi ha botó d'esborrar usuari, li afegim l'esdeveniment
    if (btnDeleteUser) {
        btnDeleteUser.addEventListener('click', function() {
            if (confirm('Estàs segur que vols esborrar el teu nom?')) {
                // Esborrem les dades de l'usuari (ja explicat a script.js)
                localStorage.removeItem('nomUsuari');
                localStorage.removeItem('partida');
                userGreeting.textContent = 'Hola, Usuario';
                alert('Nom esborrat correctament');
            }
        });
    }
});

// Agafem el contenidor principal i li afegim un event listener per detectar clics
let contenidor = document.getElementById('admin-container');
contenidor.addEventListener('click', function(e) {

   // Si l'usuari ha clicat el botó de llista
   if (e.target.classList.contains('btn-lista')) {
    // Demanem les preguntes al servidor (ja explicat a script.js)
    fetch('php/getPreguntasAdmin.php?num=20')
      .then(response => response.json())
      .then(data => {
        console.log("Dades rebudes del servidor:", data);
        mostrarVistaLista(data);
      })
      .catch(error => {
        console.error("Error al cargar preguntes:", error);
      });
}

    // Si l'usuari ha clicat el botó de crear
    if(e.target.classList.contains('btn-crear')){
        mostrarVistaCrear();
    }
    
    // Si l'usuari ha clicat el botó d'eliminar
    if(e.target.classList.contains('btn-eliminar')){
        // Agafem l'ID de la pregunta des de l'atribut data-id
        let idPregunta = e.target.getAttribute('data-id');
        eliminarPregunta(idPregunta);
    }
    
    // Si l'usuari ha clicat el botó d'editar
    if(e.target.classList.contains('btn-editar')){
        // Agafem les dades de la pregunta des dels atributs
        let idPregunta = e.target.getAttribute('data-id');
        let nom = e.target.getAttribute('data-nom');
        let url = e.target.getAttribute('data-url');
        mostrarVistaEditar(idPregunta, nom, url);
    }
    }
  
);