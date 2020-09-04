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
  public datosGlobalesChart = [];       //guardar los datos globales leidos de la api rest
  public datosPaisArgentinaChart = [];  //guardar los datos de Argentina leidos de la api rest
  public datosPaisBrasilChart = [];     //guardar los datos de Brasil leidos de la api rest
  public datosPaisChileChart = [];      //guardar los datos de Chile leidos de la api rest
  public datosPaisBoliviaChart = [];    //guardar los datos de Bolivia leidos de la api rest
  public datosPaisUruguayChart = [];    //guardar los datos de Uruguay leidos de la api rest
  public datosPaisEcuadorChart = [];    //guardar los datos de Ecuador leidos de la api rest
  public datosPaisColombiaChart = [];   //guardar los datos de Colombia leidos de la api rest
  public datosSeriesTiempoFechas = [];
  public datosSeriesTiempoCasosArgentina = [];
  public datosSeriesTiempoCasosBrasil = [];
  public datosSeriesTiempoCasosChile = [];
  public datosSeriesTiempoCasosEcuador = [];
  public datosSeriesTiempoCasosUruguay = [];
  public datosSeriesTiempoCasosParaguay = [];
  public datosSeriesTiempoCasosBolivia = [];
  public chartGlobal: any = [];         //el grafico global
  public chartPorPaises: any = [];      //el grafico por paises

  constructor(private servicioDatos: BuscaDatosService) { }

  ngOnInit(): void {
    this.leerDatosGlobales();
    this.leerDatosLocales();
    this.leerSeriesDeTiempo();
  }

  /*===================================================================
  leerDatosLocales trae datos del dia de la fecha de un pais, leyendo
  una api rest (https://github.com/javieraviles/covidAPI). 
  Luego carga los datos de un pais determinado en un array para ese 
  pais, que contiene la cantidad de casos, los fallecimientos y los 
  recuperados.
  Finalizada la lectura de datos (asincronica) se dispara el armado del
  grafico 'this.graficoPorPaises()'
  =====================================================================*/
  leerDatosLocales() {
    this.servicioDatos.getDatosCoronaPaisesTodos()
      .subscribe(respuesta => {
        respuesta.forEach(element => {
          if (element.country == 'Argentina') {
            this.datosPaisArgentinaChart = [];
            this.datosPaisArgentinaChart.push(element.cases);
            this.datosPaisArgentinaChart.push(element.deaths);
            this.datosPaisArgentinaChart.push(element.recovered);
            //console.log(this.datosPaisArgentinaChart);
          } else if (element.country == 'Brazil') {
            this.datosPaisBrasilChart = [];
            this.datosPaisBrasilChart.push(element.cases);
            this.datosPaisBrasilChart.push(element.deaths);
            this.datosPaisBrasilChart.push(element.recovered);
          } else if (element.country == 'Chile') {
            this.datosPaisChileChart = [];
            this.datosPaisChileChart.push(element.cases);
            this.datosPaisChileChart.push(element.deaths);
            this.datosPaisChileChart.push(element.recovered);
          } else if (element.country == 'Bolivia') {
            this.datosPaisBoliviaChart = [];
            this.datosPaisBoliviaChart.push(element.cases);
            this.datosPaisBoliviaChart.push(element.deaths);
            this.datosPaisBoliviaChart.push(element.recovered);
          } else if (element.country == 'Uruguay') {
            this.datosPaisUruguayChart = [];
            this.datosPaisUruguayChart.push(element.cases);
            this.datosPaisUruguayChart.push(element.deaths);
            this.datosPaisUruguayChart.push(element.recovered);
          } else if (element.country == 'Ecuador') {
            this.datosPaisEcuadorChart = [];
            this.datosPaisEcuadorChart.push(element.cases);
            this.datosPaisEcuadorChart.push(element.deaths);
            this.datosPaisEcuadorChart.push(element.recovered);
          } else if (element.country == 'Colombia') {
            this.datosPaisColombiaChart = [];
            this.datosPaisColombiaChart.push(element.cases);
            this.datosPaisColombiaChart.push(element.deaths);
            this.datosPaisColombiaChart.push(element.recovered);
          }
          this.graficoPorPaises();
        }
        )
      });
  }

  /*===================================================================
  leerDatosGlobales trae datos del dia de la fecha globales, leyendo
  una api rest (https://github.com/javieraviles/covidAPI, la url 
  utilizada es https://coronavirus-19-api.herokuapp.com/all). 
  Luego carga los datos en un array que contiene la cantidad de casos, 
  los fallecimientos y los recuperados.
  Finalizada la lectura de datos (asincronica) se dispara el armado del
  grafico 'this.graficoGlobal()'
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

  /*===================================================================
  leerSeriesDeTiempo trae series de tiempo de todos los paises, leyendo
  la api rest: https://pomber.github.io/covid19/timeseries.json 
  =====================================================================*/
  leerSeriesDeTiempo() {
    let diaInicio = "2020-3-11";
    let fechaCero = new Date(diaInicio);
    this.servicioDatos.getDatosSeriesTiempo()
      .subscribe(respuesta => {
        respuesta["Argentina"].forEach(element => {
          let laFecha = new Date(element.date);
          let laFechaFormateada = laFecha.toLocaleDateString();
          if (laFecha > fechaCero) {
            this.datosSeriesTiempoFechas.push(laFechaFormateada);
            this.datosSeriesTiempoCasosArgentina.push(element.confirmed)
          }
        });
        respuesta["Brazil"].forEach(element => {
          let laFecha = new Date(element.date);
          if (laFecha > fechaCero) {
            this.datosSeriesTiempoCasosBrasil.push(element.confirmed)
          }
        });
        respuesta["Chile"].forEach(element => {
          let laFecha = new Date(element.date);
          if (laFecha > fechaCero) {
            this.datosSeriesTiempoCasosChile.push(element.confirmed)
          }
        });
        respuesta["Ecuador"].forEach(element => {
          let laFecha = new Date(element.date);
          if (laFecha > fechaCero) {
            this.datosSeriesTiempoCasosEcuador.push(element.confirmed)
          }
        });
        respuesta["Uruguay"].forEach(element => {
          let laFecha = new Date(element.date);
          if (laFecha > fechaCero) {
            this.datosSeriesTiempoCasosUruguay.push(element.confirmed)
          }
        });
        respuesta["Paraguay"].forEach(element => {
          let laFecha = new Date(element.date);
          if (laFecha > fechaCero) {
            this.datosSeriesTiempoCasosParaguay.push(element.confirmed)
          }
        });
        respuesta["Bolivia"].forEach(element => {
          let laFecha = new Date(element.date);
          if (laFecha > fechaCero) {
            this.datosSeriesTiempoCasosBolivia.push(element.confirmed)
          }
        });
        this.graficoSeriesTiempo();
      });
  }

  graficoSeriesTiempo() {
    this.chartGlobal = new Chart('canvasSerieTiempo', {
      type: 'line',
      data: {
        labels: this.datosSeriesTiempoFechas,
        datasets: [
          {
            label: 'Argentina',
            data: this.datosSeriesTiempoCasosArgentina,
            backgroundColor: 'rgba(54, 200, 10, 0.8)',
            borderColor: 'rgba(54, 200, 10, 1.0)',
            borderWidth: 1.2,
            fill: false,
            pointRadius: 4,
						pointHoverRadius: 8
            //borderDash: [5, 5],
          },
          {
            label: 'Brasil',
            data: this.datosSeriesTiempoCasosBrasil,
            backgroundColor: 'transparent',
            borderColor: 'red',
            borderWidth: 0.9,
            fill: false
          },
          {
            label: 'Chile',
            data: this.datosSeriesTiempoCasosChile,
            backgroundColor: 'transparent',
            borderColor: 'green',
            borderWidth: 0.9,
            fill: false
          },
          {
            label: 'Ecuador',
            data: this.datosSeriesTiempoCasosEcuador,
            backgroundColor: 'transparent',
            borderColor: 'blue',
            borderWidth: 0.9,
            fill: false
          },
          {
            label: 'Uruguay',
            data: this.datosSeriesTiempoCasosUruguay,
            backgroundColor: 'transparent',
            borderColor: 'cyan',
            borderWidth: 0.9,
            fill: false
          },
          {
            label: 'Paraguay',
            data: this.datosSeriesTiempoCasosParaguay,
            backgroundColor: 'transparent',
            borderColor: 'magenta',
            borderWidth: 0.9,
            fill: false
          },
          {
            label: 'Bolivia',
            data: this.datosSeriesTiempoCasosBolivia,
            backgroundColor: 'transparent',
            borderColor: 'Brown',
            borderWidth: 0.9,
            fill: false
          }
        ]
      },
      options: {
				responsive: true,
				title: {
					display: true,
					text: 'Valores desde 12 de marzo de 2020'
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Fechas'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Cantidad de casos confirmados'
						}
					}]
				}
			}
    });
  }

  graficoPorPaises() {
    this.chartPorPaises = new Chart('canvasArgentina', {
      type: 'bar',
      data: {
        labels: ['Casos', 'Fallecimientos', 'Recuperados'],
        datasets: [
          {
            label: 'Argentina',
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
          },
          {
            label: 'Brasil',
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
          },
          {
            label: 'Chile',
            data: this.datosPaisChileChart,
            backgroundColor: [
              'rgba(200, 10, 110, 0.2)',
              'rgba(200, 10, 110, 0.2)',
              'rgba(200, 10, 110, 0.2)'
            ],
            borderColor: [
              'rgba(200, 10, 110, 1)',
              'rgba(200, 10, 110, 1)',
              'rgba(200, 10, 110, 1)'
            ],
            borderWidth: 1
          },
          {
            label: 'Bolivia',
            data: this.datosPaisBoliviaChart,
            backgroundColor: [
              'rgba(100, 15, 110, 0.2)',
              'rgba(100, 15, 110, 0.2)',
              'rgba(100, 15, 110, 0.2)'
            ],
            borderColor: [
              'rgba(100, 15, 110, 1)',
              'rgba(100, 15, 110, 1)',
              'rgba(100, 15, 110, 1)'
            ],
            borderWidth: 1
          },
          {
            label: 'Uruguay',
            data: this.datosPaisUruguayChart,
            backgroundColor: [
              'rgba(100, 100, 100, 0.2)',
              'rgba(100, 100, 100, 0.2)',
              'rgba(100, 100, 100, 0.2)'
            ],
            borderColor: [
              'rgba(100, 100, 100, 1)',
              'rgba(100, 100, 100, 1)',
              'rgba(100, 100, 100, 1)'
            ],
            borderWidth: 1
          },
          {
            label: 'Ecuador',
            data: this.datosPaisEcuadorChart,
            backgroundColor: [
              'rgba(100, 1, 50, 0.2)',
              'rgba(100, 1, 50, 0.2)',
              'rgba(100, 1, 50, 0.2)'
            ],
            borderColor: [
              'rgba(100, 1, 50, 1)',
              'rgba(100, 1, 50, 1)',
              'rgba(100, 1, 50, 1)'
            ],
            borderWidth: 1
          },
          {
            label: 'Colombia',
            data: this.datosPaisColombiaChart,
            backgroundColor: [
              'rgba(1, 100, 50, 0.2)',
              'rgba(1, 100, 50, 0.2)',
              'rgba(1, 100, 50, 0.2)'
            ],
            borderColor: [
              'rgba(1, 100, 50, 1)',
              'rgba(1, 100, 50, 1)',
              'rgba(1, 100, 50, 1)'
            ],
            borderWidth: 1
          }
        ],
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
            label: 'Total general',
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
