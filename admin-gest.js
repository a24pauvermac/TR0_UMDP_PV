
function mostrarVistaLista() {
    ocultarTodasLasVistas(); 
    document.getElementById('lista-preguntas').classList.remove('hidden');
    fetch('getPreguntas.php?num=10') 
    .then(response => response.json())
    .then(data => rendJoc(data));
//se puede mover el fetch a la funcion mostrarVistaLista y donde quieras, ahora
// tienes que crear el codigo que pintara la lista de preguntas

}

function mostrarVistaCrear() {
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
    }
    }
});

window.addEventListener('DOMContentLoaded', event => {
    fetch('getPreguntas.php?num=10') 
        .then(response => response.json())
        .then(data => rendJoc(data));

    console.log("DOM carregat i analitzat");
});