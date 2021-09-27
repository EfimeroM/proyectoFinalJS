export class DatosSesion{
  constructor(donante, donacion){
    this.donante = donante;
    this.donacion = donacion;
  }
  static consulta(key){
    //se convierte el string JSON guardado a objeto js y se almacena en datosDonante
    let datosDonante = JSON.parse(localStorage.getItem(key.donante));
    //si la key donación tiene como valor true significa que el usuario ya realizo la donación por lo que retorna los datos del donante para terminar con el proceso
    if(localStorage.getItem(key.donacion)){
        return datosDonante;
    }else{
        return false;
    }
  }
  guardar(){
    localStorage.setItem(this.donacion, true);
    //se transforma el objeto datosDonante a un string en formato JSON para que la información de este se guarde correctamente
    const datosDonanteJSON = JSON.stringify(this.donante);
    localStorage.setItem("datosDonante", datosDonanteJSON);
  }
}
export class Donacion{
    constructor(datosDonante, precioDonacion){
        this.datosDonante = datosDonante;
        this.precioDonacion = precioDonacion;
    }
    static almacenarDatos(){
        let datosDonante = [];
        const datosFormUrl = "../js/json/datosForm.json";
        $.getJSON(datosFormUrl, function (data, estado) {
          if(estado === "success"){
              for (const datoInput of data) {
                  /*se recupera los valores ingresados en los inputs, select del formulario y proceden a guardarse en el array datosDonante
                  ej de primer input: $('input#inputName').each(function(){}) así es la estructura base implementada
                  se tuvo que modificar para que recorriera todos los tipos de entrada de datos que hay en el formulario*/
                  $(datoInput.inputType+'#input'+datoInput.name).each(function () {
                      datosDonante.push(this.value);
                  });
                }
            }
        });
        return datosDonante;
    }
    confirmarDonacion(){
        //SweetAlert2
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })
        //Se muestra un alert con el precio total con la conversión y el usuario puede decidir si seguir o cancelar la donación
        swalWithBootstrapButtons.fire({
            title: `${this.datosDonante[0]} la donación de US$${this.datosDonante[1]} con conversión a peso argentino serian $${this.precioDonacion} final`,
            text: 'Desea continuar con la donación?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        })
    }
    static procesarDonacion(){
        //SweetAlert2
        //Esto es un timer que emula lo que tardaría en procesarse el pagos
        let timerInterval
        Swal.fire({
            title: 'Por favor espere mientras procesamos su pago',
            html: 'estamos checkeando su información',
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            //al finalizar el timer
            if (result.dismiss === Swal.DismissReason.timer) {
                return true;
            }
        })
    }
    static cancelarDonacion(){
        Swal.fire(
            'Donación cancelada :(',
            'Lamentamos que no hayas podido seguir con la donación, recuerda que también puedes apoyarnos siguiéndonos en nuestras redes sociales',
            'error'
        )
        
    }
    agradecerDonacion(){
        Swal.fire(
            'Donación realizada con éxito!',
            `Muchas Gracias por tu donación ${this.datosDonante[0]} nos da gusto saber que contamos con tu apoyo`,
            'success'
        )
    }
    terminarDonacion(){
        //Se elimina el formulario y botón de donación
        $("#formularioDonacion").remove();
        $('.botonDonacion').remove();
        //Se añade la etiqueta h4 en el HTML con un mensaje para el donante
        $("#botonDonacion").prepend(`
            <h4>Ya hemos recibido tu contribución del mes por US$${this.datosDonante[1]}
            muchas gracias ${this.datosDonante[0]} <img src="../img/iconos/donaciones/donacion.svg" alt="icono carta con corazón"><br><br>
            <p>(recuerda que en el siguiente mes este botón volverá a habilitarse para que puedas seguir ayudándonos)</p>
            </h4>`);
    }
}
export function consultarPrecioDolar(){
    const urlApiDolar = 'https://www.dolarsi.com/api/api.php?type=valoresprincipales';
    let precioDolar = [];
    $.getJSON(urlApiDolar, function(data, estado){
        if(estado === "success"){
            precioDolar.push(data[0]['casa'].venta);
        }
    });
    return precioDolar;
}
export function mostrarFormulario(){
    //oculta el botón de donación y despliega el formulario
    $(".botonDonacion").toggle("fast");
    $("#formularioDonacion").toggle("slow");
    //ofrece una ayuda adicional al usuario para completar el formulario
    ayudaForm();
}
export function conversionDolarPeso(datosDonante, precioDolar){
    let precioTotal;
    //Se multiplican los dolares que el usuario eligió para donar por el precio del dolar actual en Argentina
    precioTotal = parseInt(datosDonante[1]*parseFloat(precioDolar));
    return precioTotal;
}
export function errorEnviarForm(){
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Estamos teniendo Problemas para enviar el formulario',
        footer: '<a href="sobreNosotros.html">El problema persiste? Contactanos</a>'
    })
}
function ayudaForm(){
    const datosFormUrl = "../js/json/datosForm.json";
    $.getJSON(datosFormUrl, function (data, estado) {
        if(estado === "success"){
            for (const datoInput of data) {
                //al hacer focus sobre los inputs del form, muestra la imagen de ayuda
                $('#input'+datoInput.name).focus(function(){
                    $('#ayuda'+datoInput.name).toggle("slow");
                });
                //al sacar el foco sobre el input esta misma imagen se oculta
                $('#input'+datoInput.name).focusout(function(){
                    $('#ayuda'+datoInput.name).toggle("slow");
                });
            }
        }
    });  
}