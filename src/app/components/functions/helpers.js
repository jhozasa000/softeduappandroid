import Swal from 'sweetalert2';

const FirstletterUpper = (value) => {
    return value[0].toUpperCase() + value.slice(1).toLowerCase();
}

const Alertas = (title,msg,time) => {
    Swal.fire({
          title: `<strong>${title}</strong>`,
          html:msg,
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText:'Cerrar',
          confirmButtonColor: '#3085d6',
          timer: time??2000,
          timerProgressBar: true,
        })
  }
export {FirstletterUpper,Alertas};