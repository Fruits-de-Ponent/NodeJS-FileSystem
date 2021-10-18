window.onDOMContentLoaded = function(){
    if (document.title == 'Home') {
        // $(document.getElementById('container-water')).slideDown();
    } else {
        
    }
    let elementos = document.getElementsByClassName('cerrar');
    for (var i = 0; i < elementos.length; i++) {
        elementos[i].addEventListener('click', eliminar, false);
        elementos[i].id = 'cerrar' + i;
        elementos[i].name = 'formEliminar' + i;
    };
    setTimeout(function() {
        if (document.title == 'Home') {
            // $(document.getElementById('container-water')).slideUp();
        }
    }, 1000)

    var nombre = $('input[type=file]').val().split('\\').pop();
    let elementos = document.getElementsByClassName('archivo');
    for (elemento of elementos) {
        console.log(elemento.innerHTML)
    }
};

$("#subir").submit(function(e) {
    e.preventDefault();
    var self = $(this);
    var nombre = $('input[type=file]').val().split('\\').pop();
    if (nombre) {
        let elementos = document.getElementsByClassName('archivo');
        for (elemento of elementos) {
            if(elemento.innerHTML == nombre) {
                console.log(nombre, elemento.innerHTML);
                Swal.fire({
                    title: '¿Estás seguro de querer eliminar el archivo?',
                    text: "No se podrá recuperar.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: 'var(--col)',
                    cancelButtonColor: 'var(--col)',
                    confirmButtonText: 'Si, eliminar.',
                    cancelButtonText: 'Cancelar.',
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutDown'
                    }
                })
            }
        }
    }
    return false;
})


function eliminar(){
    event.preventDefault();
    var queryString = $('#' + this.id).serialize();
    let archivoNom = queryString.split('=')[1]
    archivoNom = decodeURI(archivoNom)
    Swal.fire({
        title: '¿Estás seguro de querer eliminar el archivo ' + archivoNom + '?',
        text: "No se podrá recuperar.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'var(--col)',
        cancelButtonColor: 'var(--col)',
        confirmButtonText: 'Si, eliminar.',
        cancelButtonText: 'Cancelar.',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutDown'
        }
      }).then((result) => {
        if (result.isConfirmed) {
            eliminarArchivo(this.id)
        }
      })
};

if(document.getElementById('volver')){
    document.getElementById('volver').onclick = function(){
        volver();
    }
}

if(document.getElementById('regresar')){
    document.getElementById('regresar').onclick = function(){
        volver();
    }
}

//FUNCTION
function volver(){
    window.history.back();
};

function eliminarArchivo(id){
    $('#' + id).submit();
};