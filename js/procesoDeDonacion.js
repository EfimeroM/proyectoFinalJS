//importando clases y funciones
import{DatosSesion, Donacion, consultarPrecioDolar, mostrarFormulario, conversionDolarPeso, errorEnviarForm}from './modules/funcionesDonacion.js';
import{validarFormulario} from './modules/validarForm.js';
//Se guardan las key de la posible donación ya realizada
let keySesion = new DatosSesion('datosDonante', 'donacion');
//se consulta los datos de la sesión enviando las key como parámetro
//Si los datos de sesión del usuario existen significa que el usuario ya realizo una donación
if(DatosSesion.consulta(keySesion)){
    let datosDonante = DatosSesion.consulta(keySesion);
    //recuperamos los datos de la donación para terminar el proceso
    let donante =  new Donacion(datosDonante);
    donante.terminarDonacion();
}
//Si no existen los datos de sesión se inicia el proceso de donación 
else{
    let datosDonante = [];
    let precioDolar = consultarPrecioDolar();
    //si hace click en botón Donación
    $(".botonDonacion").click( function(e){
        e.preventDefault();
        mostrarFormulario();
        //luego de mostrar el formulario este mismo se comienza a validar en tiempo real
        validarFormulario();
        $("#formularioDonacion").bind("submit", function (e){
            e.preventDefault();
            //al hacer submit sobre el formulario se corrobora por ultima vez la validación del formulario
            if(validarFormulario()){
                $.ajax({
                    type: $(this).attr("method"),
                    url: $(this).attr("action"),
                    data:$(this).serialize(),
                    //Esta función se ejecuta durante el envió de la petición al servidor
                    beforeSend: function(){
                        //la función almacenarDatos retorna los datos que el usuario ingreso en el formulario
                        datosDonante = Donacion.almacenarDatos();
                    },
                    //Se ejecuta cuando termina la petición y esta ha sido correcta
                    success: function(){
                        //si el ultimo valor del array datosDonante(Que seria el check de aceptar los términos y condiciones)
                        //no esta vació continua el proceso
                        if(datosDonante[datosDonante.length-1]){
                            //con el precio del dolar actual y los dolares que quiere donar el usuario se hace la conversión retornando el precio real de la donación a peso Argentino
                            let precioDonacion = conversionDolarPeso(datosDonante, precioDolar);
                            let donante = new Donacion(datosDonante, precioDonacion);
                            //se inicia una nueva sesión en la que se guardaran los datos del donante y la key donación con valor true
                            let sesion = new DatosSesion(datosDonante, 'donacion')
                            //confirmarDonacion muestra un alert con el precio en pesos argentino y el usuario puede decidir si seguir o no
                            donante.confirmarDonacion();
                            //si el usuario confirma seguir
                            $(".swal2-confirm").click(function(){
                                Donacion.procesarDonacion()
                                //simula lo que podría tardar el proceso y subida de datos
                                setTimeout(()=>{
                                    //se guardan los datos en la sesión local, se agradece al donante y termina el proceso
                                    sesion.guardar();
                                    donante.agradecerDonacion();
                                    donante.terminarDonacion();
                                },3010);
                            });
                            //si el usuario cancela la donación
                            $(".swal2-cancel").click(function(){
                                Donacion.cancelarDonacion();
                            });
                        }
                    },
                    //Se ejecuta si la petición ha sido errónea
                    error: function(){
                        errorEnviarForm();
                    }
                });
                //retornamos false para que cancele el envió del formulario
                return false;
            }       
        })    
    });
}
