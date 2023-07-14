<template>
  <div>
    <v-row no-gutters>
      <v-col
        class="pa-2"
        v-for="dashboard in dashboards"
        :key="dashboard.id"
        cols="12"
        lg="3"
        sm="6"
      >
        <v-sheet 
          class="bg-blue-grey-lighten-5 elevation-3" >
          <v-card
            color="grey-lighten-4"
            theme="dark"
          >
          <div v-for="(spark,index) in sparks" :key="index" class="mt-4">
            <apexchart type="area" :height="spark.cardMaxHeight" :options="spark.chartOptionsSpark" :series="spark.seriesSpark"/>
          </div>
          </v-card>
        </v-sheet>
      </v-col>
    <!-- Chart -->
    </v-row>
    <div id="chart" class="mt-5">
      <v-row>
        <v-col 
          cols="7"
          xs="12"
          md="7"
        >
          <v-sheet class="pa-3"
            elevation="1"
            rounded
          >
            <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>
          </v-sheet>
          <v-sheet class="pa-3 mt-4"
            elevation="1"
            rounded
          >
            <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
          </v-sheet>
        </v-col>
        <v-col 
          cols="5"
          sm="12"
          md="5"
          align="center"
        >
          <v-sheet class="pt-4"
            elevation="1"
            rounded
          >
            <apexchart type="donut" width="380" :options="chartOptions1" :series="series1"></apexchart>
          </v-sheet>
          <v-sheet class="mt-5"
            elevation="1"
            rounded
          >
            <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>
          </v-sheet>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import { ref } from "vue"
export default{
  name: 'deashboard',
  data(){
    return{
      series: [
        { name: 'series1', data: [31, 40, 28, 51, 42, 109, 100]}, 
        { name: 'series2', data: [11, 32, 45, 32, 34, 52, 41]},
        { name: 'series3', data: [33, 43, 50, 11, 44, 43, 34]}
      ],
      chartOptions: {
        chart: { height: 350, type: 'area'},
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        xaxis: {
          type: 'datetime',
          categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
        },
        tooltip: { x: {
            format: 'dd/MM/yy HH:mm'
          },
        },
      },
      // Donut
      series1: [44, 55, 41, 17, 15],
      chartOptions1: {
        chart: { width: 380, type: 'donut',},
        plotOptions: {
          pie: { startAngle: -90, endAngle: 270 }
        },
        dataLabels: { enabled: false },
        fill: { type: 'gradient', },
        legend: {
          formatter: function(val, opts) {
            return val + " - " + opts.w.globals.series[opts.seriesIndex]
          }
        },
        title: { text: 'Gradient Donut with custom Start-angle' },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
    }
  },
  computed(){

  },
  setup(){
    const dashboards =ref([
      { "id": 1 ,"title": "Title item4", "desc": "Description details" , "color": "cyan-darken-2"},
      { "id": 2 ,"title": "Title item1", "desc": "Description details" , "color": "green-darken-2"},
      { "id": 3 ,"title": "Title item2", "desc": "Description details" , "color": "amber-accent-3"},
      { "id": 4 ,"title": "Title item3", "desc": "Description details" , "color": "red-darken-3"},
    ])
    const sparks = [{
        cardMaxHeight: 180,
        seriesSpark: [
          { name: 'Salse', 
            data: [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46],
          }, 
        ],
        chartOptionsSpark: {
          chart: { // id: 'sparkline1', 
            group: 'sparklines', type: 'area', height: 160, 
            sparkline: { enabled: true },
          },
          fill: { opacity: 1, },
          colors: ['#008FFB'],
          title: { text: '$424,652', offsetX: 30,
            style: { fontSize: '24px', cssClass: 'apexcharts-yaxis-title' }
          },
          subtitle: { text: "Sales", offsetX: 30, 
            style: { fontSize: '14px', cssClass: 'apexcharts-yaxis-title'}
          },
          labels: [...Array(24).keys()].map(n => `2018-09-0${n+1}`),
          dataLabels: { enabled: false },
          stroke: { curve: 'smooth' },
          xaxis: {
            type: 'datetime',
            categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
          },
          tooltip: { x: {
              format: 'dd/MM/yy HH:mm'
            },
          },
        },
      }]
    const sparklineData = [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46];

    return{ dashboards ,sparklineData,sparks}
  }
}

</script>