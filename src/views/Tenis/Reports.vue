<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth';
import SelectInput from '../../components/SelectInput.vue';
import DataTable from 'datatables.net-vue3';
import ButtonsHtml5 from 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-responsive-dt';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import JSZip from 'jszip';

window.JSZip = JSZip;
pdfmake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfmake.vfs;
DataTable.use(ButtonsHtml5);

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

const marcas = ref([]);
const tenis = ref([]);
const columns1 = ref([]);
const columns2 = ref([]);
const buttons1 = ref([]);
const buttons2 = ref([]);
const report = ref('1');
const types = ref([{ 'id': '1', 'marca': 'Tenis' }, { 'id': '2', 'marca': 'Marcas' }]);

onMounted(async () => {
    try {
        const m = await axios.get('api/marcas');
        marcas.value = m.data;
        const t = await axios.get('api/tenisall');
        tenis.value = t.data;
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
});

columns1.value = [
    { data: null, render: (data, type, row, meta) => (meta.row + 1) },
    { data: 'color', title: 'Color' },
    { data: 'talla', title: 'Talla' },
    { data: 'costo', title: 'Costo' },
    { data: 'marca_id', title: 'Marca' },
    { data: 'categoria', title: 'Categoría' },
    { 
        data: 'imagen', 
        title: 'Imagen', 
        render: (data) => `<img src="http://ten.jaredmz.istigen23.com/${data}" height="80px" style="object-fit:cover;border-radius:5px;" />`
    }
];

columns2.value = [
    { data: null, render: (data, type, row, meta) => (meta.row + 1) },
    { data: 'marca', title: 'Marca' }
];

buttons1.value = [
    { title: 'Tenis', extend: 'excelHtml5', text: '<i class="fa-solid fa-file-excel"></i> Excel', className: 'btn btn-success mb-3' },
    { title: 'Tenis', extend: 'pdfHtml5', text: '<i class="fa-solid fa-file-pdf"></i> PDF', className: 'btn btn-danger mb-3' },
    { title: 'Tenis', extend: 'print', text: '<i class="fa-solid fa-print"></i> PRINT', className: 'btn btn-dark mb-3' },
    { title: 'Tenis', extend: 'copy', text: '<i class="fa-solid fa-copy"></i> COPY', className: 'btn btn-secondary mb-3' }
];

buttons2.value = [
    { title: 'Marcas', extend: 'excelHtml5', text: '<i class="fa-solid fa-file-excel"></i> Excel', className: 'btn btn-success mb-3' },
    { title: 'Marcas', extend: 'pdfHtml5', text: '<i class="fa-solid fa-file-pdf"></i> PDF', className: 'btn btn-danger mb-3' },
    { title: 'Marcas', extend: 'print', text: '<i class="fa-solid fa-print"></i> PRINT', className: 'btn btn-dark mb-3' },
    { title: 'Marcas', extend: 'copy', text: '<i class="fa-solid fa-copy"></i> COPY', className: 'btn btn-secondary mb-3' }
];
</script>
<style scoped>
.table-responsive {
    margin-top: 20px;
}

.dataTables_wrapper .dataTables_filter {
    margin-top: 10px; /* Espacio entre el cuadro de búsqueda y los botones */
    margin-bottom: 20px; /* Espacio entre el cuadro de búsqueda y la tabla */
}

.dataTables_wrapper .dt-buttons {
    margin-bottom: 10px; /* Espacio entre los botones y el cuadro de búsqueda */
    margin-right: 15px; /* Espacio entre cada botón */
}
</style>

<template>
    <div class="container mt-5">
        <div class="row mb-4">
            <div class="col-md-8 offset-md-2">
                <label for="rep" class="form-label">Seleccionar Reporte:</label>
                <SelectInput id="rep" class="mt-1" v-model="report" :options="types" />
            </div>
        </div>

        <div v-if="report === '1'" class="row mb-5">
            <div class="col-md-10 offset-md-1">
                <div class="table-responsive">
                    <DataTable 
                        :data="tenis" 
                        :columns="columns1" 
                        class="table table-striped table-bordered" 
                        :options="{ responsive: true, autoWidth: false, dom: 'Bfrtip', buttons: buttons1 }">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Color</th>
                                <th>Talla</th>
                                <th>Costo</th>
                                <th>Marca</th>
                                <th>Categoría</th>
                                <th>Imagen</th>
                            </tr>
                        </thead>
                    </DataTable>
                </div>
            </div>
        </div>

        <div v-else class="row mb-5">
            <div class="col-md-10 offset-md-1">
                <div class="table-responsive">
                    <DataTable 
                        :data="marcas" 
                        :columns="columns2" 
                        class="table table-striped table-bordered" 
                        :options="{ responsive: true, autoWidth: false, dom: 'Bfrtip', buttons: buttons2 }">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Marca</th>
                            </tr>
                        </thead>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.table-responsive {
    margin-top: 20px;
}
</style>
