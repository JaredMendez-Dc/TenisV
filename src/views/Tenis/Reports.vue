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
import 'datatables.net-responsive-dt/css/responsive.dataTables.min.css';
import 'datatables.net-responsive/js/dataTables.responsive.min.mjs'
import JSZip from 'jszip';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import 'datatables.net-responsive-dt';
import dataTables from 'datatables.net-responsive-dt';

pdfmake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfmake.vfs;
window.JSZip = JSZip;
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
    { data: null, render: function(data, type, row, meta) {
        return (meta.row + 1);
    }},
    { data: 'color' },
    { data: 'talla' },
    { data: 'costo' },
    { data: 'marca_id' },
    { data: 'categoria' },
    { data: 'imagen' }
];

columns2.value = [
    { data: null, render: function(data, type, row, meta) {
        return (meta.row + 1);
    }},
    { data: 'marca' }
];

buttons1.value = [
    {
        title: 'Tenis', extend: 'excelHtml5',
        text: '<i class="fa-solid fa-file-excel"></i> Excel',
        className: 'btn btn-success'
    },
    {
        title: 'Tenis', extend: 'pdfHtml5',
        text: '<i class="fa-solid fa-file-pdf"></i> PDF',
        className: 'btn btn-danger'
    },
    {
        title: 'Tenis', extend: 'print',
        text: '<i class="fa-solid fa-print"></i> PRINT',
        className: 'btn btn-dark'
    },
    {
        title: 'Tenis', extend: 'copy',
        text: '<i class="fa-solid fa-copy"></i> COPY',
        className: 'btn btn-secondary'
    }
];

buttons2.value = [
    {
        title: 'Marcas', extend: 'excelHtml5',
        text: '<i class="fa-solid fa-file-excel"></i> Excel',
        className: 'btn btn-success'
    },
    {
        title: 'Marcas', extend: 'pdfHtml5',
        text: '<i class="fa-solid fa-file-pdf"></i> PDF',
        className: 'btn btn-danger'
    },
    {
        title: 'Marcas', extend: 'print',
        text: '<i class="fa-solid fa-print"></i> PRINT',
        className: 'btn btn-dark'
    },
    {
        title: 'Marcas', extend: 'copy',
        text: '<i class="fa-solid fa-copy"></i> COPY',
        className: 'btn btn-secondary'
    }
];
</script>

<template>
    <div class="row mb-5">
        <div class="col-md-8 offset-md-2">
        Report:
        <SelectInput id="rep" class="mt-1" v-model="report" :options="types">
        </SelectInput>
        </div>
    </div>
    <div class="row" v-if="report == '1'">
        <div class="col-md-8 offset-md-2">
            <div class=" table-responsive">
                <DataTable :data="tenis" :columns="columns1" class="table table-striped" :options="{ responsive: true, autoWidth: false, dom: 'Bfrtip', buttons: buttons1 }">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>COLOR</th>
                            <th>TALLA</th>
                            <th>COSTO</th>
                            <th>MARCA</th>
                            <th>CATEGORIA</th>
                        </tr>
                    </thead>
                </DataTable>
            </div>
        </div>
    </div>
    <div class="row" v-else>
        <div class="col-md-8 offset-md-2">
            <DataTable :data="marcas" :columns="columns2" class="table table-striped" :options="{ responsive: true, autoWidth: false, dom: 'Bfrtip', buttons: buttons2 }">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>MARCA</th>
                        </tr>
                    </thead>
                </DataTable>
        </div>
    </div>
</template>
