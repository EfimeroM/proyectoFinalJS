let validacion = [];
export function validarFormulario(){
    //validaciones para el input nombre y apellido
    $('#inputName').keyup(function(){
        if((isNaN($('#inputName').val()))===false){
            errorValidacion('no se puede colocar números', 'Name');
        }
        else if( ($('#inputName').val()).length <=3 ){
            errorValidacion('no se puede poner menos de 3 caracteres', 'Name');
        }
        else{
            validar('Name');
        }
    });
    //validaciones para el select monto
    $('#inputMonto').change(function(){
        if(!($('#inputMonto').val())){
            errorValidacion('Debe elegir uno de los montos a donar', 'Monto');
        }else{
            validar('Monto')
        }
    });
    //Validaciones para el input tarjeta
    $('#inputTarjeta').keyup(function(){
        if((isNaN($('#inputTarjeta').val()))===true){
            errorValidacion('no se pueden colocar letras', 'Tarjeta');
        }
        else if( ($('#inputTarjeta').val()).length <16 || ($('#inputTarjeta').val()).length >=17 ){
            errorValidacion('debe ingresar 16 dígitos', 'Tarjeta');
        }
        else{
            validar('Tarjeta');
        }
    });
    //validaciones para el input caducidad
    $('#inputCaducidad').keyup(function(){
        if((isNaN($('#inputCaducidad').val()))===true){
            errorValidacion('no se pueden colocar letras', 'Caducidad');
        }
        else if( ($('#inputCaducidad').val()).length <4 || ($('#inputCaducidad').val()).length >=5 ){
            errorValidacion('debe ingresar 4 dígitos en formato mmaa ej: 1021', 'Caducidad');
        }
        else{
            validar('Caducidad');
        }
    });
    //validaciones para el input codigo
    $('#inputCodigo').keyup(function(){
        if((isNaN($('#inputCodigo').val()))===true){
            errorValidacion('no se pueden colocar letras', 'Codigo');
        }
        else if( ($('#inputCodigo').val()).length <3 || ($('#inputCodigo').val()).length >=4 ){
            errorValidacion('debe ingresar los 3 dígitos del reverso de su tarjeta', 'Codigo');
        }
        else{
            validar('Codigo');
        }
    });
    //validacion del check terminos y condiciones
    $('#inputCheck').change(function(){
        if(!($('#inputCheck').prop('checked'))){
            errorValidacion('debe aceptar los términos y condiciones para continuar', 'Check');
        }else{
            validar('Check');
        }
    });
    //Si las validaciones dan true da el ok para que se pueda enviar el formulario
    if(validacion['Name'] && validacion['Monto'] && validacion['Tarjeta'] && validacion['Caducidad'] && validacion['Codigo'] && validacion['Check']){
        return true
    }
    //sino quita el check a los términos y condiciones y retorna false
    else{
        $('#inputCheck').prop('checked', false);
        errorValidacion('debe aceptar los términos y condiciones para continuar', 'Check');
        return false
    }
}
//si no se cumple con la validación enfoca al input causante y le pone estilos para que se de cuenta de ello
function errorValidacion(msg, inputType){
    $('#input'+inputType).css('border', '1px solid red');
    $('#'+inputType.toLowerCase()+'Help').text(msg);
    $('#'+inputType.toLowerCase()+'Help').css('color','red');
    validacion[inputType] = false;
}
//si se cumple con la validación pone estilos en el input validado para que el usuario se de cuenta de que esta bien
function validar(inputType){
    $('#'+inputType.toLowerCase()+'Help').text('');
    $('#input'+inputType).css('border', '1px solid green');
    validacion[inputType] = true;
}
function resetForm(){
    $('#reset').click(function(){
        for (const key in validacion) {
            errorValidacion('', key);
        } 
        validacion = [];
    });
}
//resetea el formulario, es mas que nada un fix para las validaciones en tiempo real ya que estas funcionan cuando el usuario tipea
resetForm();