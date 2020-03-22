import { Component, OnInit } from '@angular/core';
import { BuscaDatosService } from './../../servicios/busca-datos.service';

@Component({
  selector: 'app-corona',
  templateUrl: './corona.component.html',
  styleUrls: ['./corona.component.css']
})
export class CoronaComponent implements OnInit {
  public totalGeneral: string;
  public fallecidosGeneral: string;
  public recuperadosGeneral: string;
  public total: string;
  public totalHoy: string;
  public fallecidos: string;
  public fallecidosHoy: string;
  public recuperados: string;
  public activos: string;
  public criticos: string;
  public casosPorMillon: string;
  constructor(private servicioDatos: BuscaDatosService) { }

  ngOnInit(): void {
    this.mostrarDatos(false);
    this.mostrarDatosArgentina(false);
  }
  mostrarDatos(alerta: boolean) {
    this.servicioDatos.getDatosCoronaTotales()
      .subscribe(respuesta => {
        //console.log('Casos: ', respuesta.cases, ' Fallecimientos: ', respuesta.deaths, ' Recuperados: ', respuesta.recovered);
        this.totalGeneral = respuesta.cases;
        this.fallecidosGeneral = respuesta.deaths;
        this.recuperadosGeneral = respuesta.recovered;
      });
    if (alerta) {
      alert('Actualizando');
    }

    return false;
  }
  mostrarDatosArgentina(alerta: boolean) {
    this.servicioDatos.getDatosCoronaPaises()
      .subscribe(respuesta => {
        //console.log(respuesta);
        respuesta.forEach(element => {
          if (element.country == "Argentina") {
            //console.log(element);
            this.total = element.cases;
            this.fallecidos = element.deaths;
            this.recuperados = element.recovered;
            this.totalHoy = element.todayCases;
            this.fallecidosHoy = element.todayDeaths;
            this.activos = element.active;
            this.criticos = element.critical;
            this.casosPorMillon = element.casesPerOneMillion;
          }
        })
      });
    if (alerta) {
      alert('Actualizando');
    }
    return false;
  }
}
