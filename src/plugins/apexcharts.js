import VueApexCharts from 'vue3-apexcharts';
import ApexCharts from 'apexcharts';

export default ({ app }) => {
    app.use(VueApexCharts);
    app.use(ApexCharts);
  };