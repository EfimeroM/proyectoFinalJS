$("#formularioSuscribirse").submit(function (e){
    e.preventDefault();
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Gracias por suscribirte a Vaetics, próximamente estarás recibiendo noticias importantes en tu email',
        showConfirmButton: false,
        timer: 3000
      })
});
$("#formularioContacto").submit(function (e){
    e.preventDefault();
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Gracias por ponerte en contacto con nosotros, en breve estaremos atendiendo tu consulta y poniéndonos en contacto contigo',
        showConfirmButton: false,
        timer: 3000
      })
});
$(".registrate").click(function (e){
    e.preventDefault();
    $("#login").toggle();
    $("#registro").toggle();
});

