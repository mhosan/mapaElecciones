import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DatosService } from '../../servicios/datos.service';

@Component({
  selector: 'app-bnavega',
  templateUrl: './bnavega.component.html',
  styleUrls: ['./bnavega.component.css']
})
export class BnavegaComponent implements OnInit {
  @Output()
  seleccionMenuNavBar: EventEmitter< {seleccion:string, partido:string} >;

  public listadoPartidos: string[] = [];
  public partidoSeleccionadoParaCircuito:any;
  public partidoSeleccionado:any;
  public partidoSeleccionadoParaEscuela: any;

  constructor(private servicioDatos: DatosService) { 
    this.seleccionMenuNavBar = new EventEmitter();
  }

  ngOnInit() {
  }

  menuSeleccionado(seleccion:string, partido?:string){
    this.seleccionMenuNavBar.emit({seleccion, partido});
  }

  //=====================================================================================
  buscarPartido() {  //ARRAY con los partidos, para cargar el combo de la vista
    //===================================================================================
    if (this.listadoPartidos.length > 0) {
      return;
    }
    this.servicioDatos.buscarGeoJsonPartidos()
      .subscribe(respuesta => {
        let i = 0;
        respuesta.features.forEach(element => {
          this.listadoPartidos[i] = element.properties.nam;
          i = i + 1;
          this.listadoPartidos.sort();
        })
      });
  }

}
