import Swal from "sweetalert2";
import { nextTick } from "@vue/runtime-core";
import { useAuthStore } from "@/stores/auth";

export function show_alerta(msj, icon, focus) {
    if (focus && focus.value) {
        nextTick(() => focus.value.focus());
    }
    Swal.fire({
        title: msj,
        icon: icon,
        buttonsStyling: true
    });
}

export function confirmation(name, url, redirect) {
    const alert = Swal.mixin({ buttonsStyling: true });
    alert.fire({
        title: 'Are you sure you want to delete ' + name + '?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check"></i> Yes, delete',
        cancelButtonText: '<i class="fa-solid fa-ban"></i> Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            sendRequest('DELETE', {}, url, redirect);
        }
    });
}

export async function sendRequest(method, params, url, redirect = '') {
    const authStore = useAuthStore();
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;
    
    // Verificar si params es un FormData
    const headers = params instanceof FormData 
        ? { 'Content-Type': 'multipart/form-data' } 
        : { 'Content-Type': 'application/json' };

    let res;
    await axios({ method: method, url: url, data: params, headers: headers })
        .then((response) => {
            res = response.data.status;
            show_alerta(response.data.message, 'success', '');
            setTimeout(() => {
                if (redirect !== '') {
                    window.location.href = redirect;
                }
            }, 2000);
        })
        .catch((errors) => {
            let desc = '';
            if (errors.response && errors.response.data && errors.response.data.errors) {
                errors.response.data.errors.forEach((e) => {
                    desc += e + ' ';
                });
            } else {
                desc = 'An error occurred';
            }
            res = errors.response ? errors.response.status : 'Error';
            show_alerta(desc, 'error', '');
        });
    return res;
}

