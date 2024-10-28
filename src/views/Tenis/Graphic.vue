<script setup>
import { useAuthStore } from '../../stores/auth';
import { ref, onMounted } from 'vue';
import { Bar, Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

const marcas = ref([]);
const tenis = ref([]);
const chartData = ref([]);
const chartOptions = ref([]);
const colors = ref([]);
const loaded = ref(false);
const random = () => {
    return Math.floor(Math.random() * 256);
}
onMounted( async () =>{
const info = await axios.get('/api/tenisbymarca');
info.data.map((row) => {
    marcas.value.push(row.marca),
    tenis.value.push(row.count),
    colors.value.push("rgb(" + random() + "," + random() + "," + random() + ")");
});

chartOptions.value = { responsive: true };
chartData.value = {
    labels: marcas.value,
    datasets: [
        { label: 'Tenis', data: tenis.value, backgroundColor: colors.value }
    ]
};

loaded.value = true;

} )
</script>
<template>
    <div class="row" >
        <div class="col-md-8 offset-md-2">
            <Bar v-if="loaded" :data="chartData" :options="chartOptions"></Bar>
        </div>
    </div>
</template>