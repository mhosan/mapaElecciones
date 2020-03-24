import { Component, OnInit } from '@angular/core';
import { Chart } from 'Chart.js';
import { BuscaDatosService } from '../../servicios/busca-datos.service';
import { getCurrencySymbol } from '@angular/common';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {
  public datosChart = [];
  public chart = [];
  constructor(private servicioDatos: BuscaDatosService) { }

  ngOnInit(): void {
    this.leerDatos();
    this.armarGrafico();
  }
  leerDatos() {
    this.servicioDatos.getDatosCoronaTotales()
      .subscribe(respuesta => {
        //console.log('Casos: ', respuesta.cases, ' Fallecimientos: ', respuesta.deaths, ' Recuperados: ', respuesta.recovered);
        this.datosChart.push(respuesta.cases);
        this.datosChart.push(respuesta.deaths);
        this.datosChart.push(respuesta.recovered);
        console.log(this.datosChart);
      });
  }
  armarGrafico() {
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: ['Casos', 'Fallecimientos', 'Recuperados'],
        datasets: [
          {
            label: '# de Personas',
            data: this.datosChart,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }
          //   ,
          //   {
          //     label: '# de Personas',
          //     data: [100000, 200000, 300000],
          //     backgroundColor: [
          //         'green',
          //         'green',
          //         'green'
          //     ],
          //     borderColor: [
          //         'rgba(255, 99, 132, 1)',
          //         'rgba(54, 162, 235, 1)',
          //         'rgba(255, 206, 86, 1)'
          //     ],
          //     borderWidth: 1
          // }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

}
