<script setup>
import axios from 'axios';
import { ref, onMounted, nextTick } from 'vue';
import { confirmation, sendRequest } from '../../functions';
import { useAuthStore } from '../../stores/auth';
import Modal from '../../components/Modal.vue';
import SelectInput from '../../components/SelectInput.vue';
import Paginate from 'vuejs-paginate-next';

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

onMounted(() => { getMarcas(), getTenis(1) });
const marcas = ref([]);
const tenis = ref([]);
const load = ref(false);
const rows = ref(0);
const form = ref({
  color: '',
  talla: '',
  costo: 0.00,
  marca_id: '',
  categoria: '',
  imagen: ''
});

const title = ref('');
const marcaInput = ref('');
const operation = ref(1);
const id = ref('');
const close = ref([]);

const getMarcas = async () => {
  await axios.get('/api/marcas').then(
    response => (marcas.value = response.data)
  );
};

const getTenis = async (page) => {
  await axios.get('/api/tenis?page=' + page).then(
    response => (
      tenis.value = response.data,
      rows.value = response.data.last_page
    )
  );
  load.value = true;
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.imagen = file;
  }
};

const deleteTenis = (id, marca) => {
  confirmation(marca, ('/api/tenis/' + id), '/tenis');
};

const openModal = (op, color, talla, costo, marca, categoria, imagen, teni) => {
  clear();
  setTimeout(() => nextTick(() => marcaInput.value.focus()), 600);
  operation.value = op;
  id.value = teni;
  if (op == 1) {
    title.value = 'Create tenis';
  } else {
    title.value = 'Edit tenis';
    form.value.color = color;
    form.value.talla = talla;
    form.value.costo = costo;
    form.value.marca_id = marca;
    form.value.categoria = categoria;
    form.value.imagen = imagen;
  }
};

const clear = () => {
  form.value.color = '';
  form.value.talla = '';
  form.value.costo = '';
  form.value.marca_id = '';
  form.value.categoria = '';
  form.value.imagen = '';
};

const save = async () => {
  let formData = new FormData();
  formData.append('color', form.value.color);
  formData.append('talla', form.value.talla);
  formData.append('costo', form.value.costo);
  formData.append('marca_id', form.value.marca_id);
  formData.append('categoria', form.value.categoria);
  
  if (form.value.imagen instanceof File) {
    formData.append('imagen', form.value.imagen);
  }

  if (operation.value !== 1) {
    formData.append('_method', 'PUT');
  }

  let res;
  if (operation.value === 1) {
    res = await sendRequest('POST', formData, '/api/tenis', '', true);
  } else {
    res = await sendRequest('POST', formData, `/api/tenis/${id.value}`, '', true);
  }

  if (res) {
    clear();
    nextTick(() => marcaInput.value.focus());
    getTenis(1);
  }
};
</script>



<template>
    <div class="row">
        <div class="col-md-4 offset-md-4">
            <div class="d-grid col-10 mx-auto">
                <button class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#modal" @click="$event => openModal(1)">
                    <i class="fa-solid fa-circle-plus"></i>Add
                </button>
            </div>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-md-10 offset-md-1">
            <div class="card border border-white text-center" v-if="!load">
                <div class="card-body">
                    <img src="/loading.gif" alt="img-fluid">
                </div>
            </div>
            <div class="table-responsive" v-else>
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>COLOR</th>
                            <th>TALLA</th>
                            <th>COSTO</th>
                            <th>MARCA</th>
                            <th>CATEGORIA</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr v-for="ten, i in tenis.data" :key="ten.id">
                            <td>{{ (i+1) }}</td>
                            <td>{{ ten.color }}</td>
                            <td>{{ ten.talla }}</td>
                            <td>{{ ten.costo }}</td>
                            <td>{{ ten.marca }}</td>
                            <td>{{ ten.categoria }}</td>
                            <td>
                                
                              <img :src="`http://ten.jaredmz.istigen23.com/${ten.imagen}`" height="80px"> 

                            </td>

                            <td>
                                <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modal" @click="$event => openModal(2, ten.color, ten.talla, ten.costo, ten.marca_id, ten.categoria, ten.imagen, ten.id)"
                                    >
                                    <i class="fa-solid fa-edit"></i>                                
                                </button>
                            </td>
                            <td>
                                <button class="btn btn-danger" @click="$event => deleteTenis(ten.id, ten.marca)">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>

                </table>
                <Paginate :page-count="rows" :click-handler="getTenis" 
                :prev-next="'Prev'" :next-text="'Next'"
                :container-class="'pagination'">
                </Paginate>
<template>
  <!-- ... other form fields ... -->
  <div class="input-group mb-3">
    <span class="input-group-text">
      <i class="fa-solid fa-image"></i>
    </span>
    <input type="file" @change="handleFileUpload" class="form-control" accept="image/*">
  </div>
  <!-- ... rest of the form ... -->
</template> 
            </div>
        </div>
    </div>
    <Modal :id="'modal'" :title="title">
    <div class="modal-body">
        <form @submit.prevent="save">
            <div class="input-group mb-3">
                <span class="input-group-text">
                    <i class="fa-solid fa-palette"></i>
                </span>
                <input type="text" v-model="form.color" placeholder="Color" class="form-control" required ref="marcaInput">
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text">
                    <i class="fa-solid fa-ruler"></i>
                </span>
                <input type="text" v-model="form.talla" placeholder="Talla" class="form-control" required>
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text">
                    <i class="fa-solid fa-dollar-sign"></i>
                </span>
                <input type="number" v-model="form.costo" placeholder="Costo" class="form-control" required min="0" step="0.01">
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text">
                    <i class="fa-solid fa-building"></i>
                </span>
                <SelectInput v-model="form.marca_id" :options="marcas" placeholder="Marca" required />
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text">
                    <i class="fa-solid fa-list"></i>
                </span>
                <input type="text" v-model="form.categoria" placeholder="Categoría" class="form-control" required>
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text">
                    <i class="fa-solid fa-image"></i>
                </span>
                <input type="file" @change="onFileChange" class="form-control" accept="image/*" />
                </div>
            <button type="submit" class="btn btn-primary">Guardar</button>
        </form>
    </div>
</Modal>
</template>
