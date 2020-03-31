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
  public datosGlobalesChart = [];       //guardar los datos leidos de la api rest
  public datosPaisArgentinaChart = [];           //guardar los datos leidos de la api rest
  public datosPaisBrasilChart = [];
  public chartGlobal: any = [];       //el grafico global
  public chartArgentina: any = [];    //el grafico de Argentina
  public chartBrasil: any = [];       //el grafico de Brasil

  constructor(private servicioDatos: BuscaDatosService) { }

  ngOnInit(): void {
    //this.apagarTodosLosCanvas();
    this.leerDatosGlobales();
    this.leerDatosLocales('Argentina');
    this.leerDatosLocales('Brazil');
  }

  // apagarTodosLosCanvas(){
  //   var global = document.getElementById('canvasGlobal');
  //   global.style.display == "none"
  //   var argentina = document.getElementById('canvasArgentina');
  //   argentina.style.display == "none"
  //   var brasil = document.getElementById('canvasBrasil');
  //   brasil.style.display == "none"
  // }


  /*===================================================================
  leerDatosLocales trae datos del dia de la fecha de un pais, leyendo
  una api rest (https://github.com/javieraviles/covidAPI)
  =====================================================================*/
  leerDatosLocales(paisBuscar: string) {
    this.servicioDatos.getDatosCoronaPaises(paisBuscar)
      .subscribe(respuesta => {
        if (paisBuscar == 'Argentina') {
          this.datosPaisArgentinaChart = [];
          this.datosPaisArgentinaChart.push(respuesta.cases);
          this.datosPaisArgentinaChart.push(respuesta.deaths);
          this.datosPaisArgentinaChart.push(respuesta.recovered);
          this.graficoArgentina();
          return;
        }
        if (paisBuscar == 'Brazil') {
          this.datosPaisBrasilChart = [];
          this.datosPaisBrasilChart.push(respuesta.cases);
          this.datosPaisBrasilChart.push(respuesta.deaths);
          this.datosPaisBrasilChart.push(respuesta.recovered);
          this.graficoBrasil();
          return;
        }
      });
  }


  /*===================================================================
  leerDatosGlobales trae datos totales a nivel mundial, del dia de la 
  fecha, leyendo una api rest (https://github.com/javieraviles/covidAPI)
  =====================================================================*/
  leerDatosGlobales() {
    this.servicioDatos.getDatosCoronaTotales()
      .subscribe(respuesta => {
        //console.log('Casos: ', respuesta.cases, ' Fallecimientos: ', respuesta.deaths, ' Recuperados: ', respuesta.recovered);
        this.datosGlobalesChart.push(respuesta.cases);
        this.datosGlobalesChart.push(respuesta.deaths);
        this.datosGlobalesChart.push(respuesta.recovered);
        this.graficoGlobal();
      });
  }

  graficoBrasil() {
    this.chartBrasil = new Chart('canvasBrasil', {
      type: 'bar',
      data: {
        labels: ['Casos', 'Fallecimientos', 'Recuperados'],
        datasets: [
          {
            label: 'Casos de Brasil',
            data: this.datosPaisBrasilChart,
            backgroundColor: [
              'rgba(54, 10, 210, 0.2)',
              'rgba(54, 10, 210, 0.2)',
              'rgba(54, 10, 210, 0.2)'

            ],
            borderColor: [
              'rgba(54, 10, 210, 1)',
              'rgba(54, 10, 210, 1)',
              'rgba(54, 10, 210, 1)'
            ],
            borderWidth: 1
          }
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

  graficoArgentina() {
    this.chartArgentina = new Chart('canvasArgentina', {
      type: 'bar',
      data: {
        labels: ['Casos', 'Fallecimientos', 'Recuperados'],
        datasets: [
          {
            label: 'Casos de Argentina',
            data: this.datosPaisArgentinaChart,
            backgroundColor: [
              'rgba(54, 200, 10, 0.2)',
              'rgba(54, 200, 10, 0.2)',
              'rgba(54, 200, 10, 0.2)'
            ],
            borderColor: [
              'rgba(54, 200, 10, 1)',
              'rgba(54, 200, 10, 1)',
              'rgba(54, 200, 10, 1)'
            ],
            borderWidth: 1
          }
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

  graficoGlobal() {
    this.chartGlobal = new Chart('canvasGlobal', {
      type: 'bar',
      data: {
        labels: ['Casos', 'Fallecimientos', 'Recuperados'],
        datasets: [
          {
            label: 'Casos totales a nivel mundial',
            data: this.datosGlobalesChart,
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
    }, {
      responsive: true
    });
  }

  //   hideshow (elCanvas:string){
  //     var showhide = document.getElementById(elCanvas);
  //     if (showhide.style.display == "none")
  //     {
  //         showhide.style.display = "block";
  //     }
  //     else{
  //         showhide.style.display = "none";
  //     }
  // }

}
