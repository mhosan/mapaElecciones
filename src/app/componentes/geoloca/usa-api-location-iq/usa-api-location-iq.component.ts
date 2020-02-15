import { Component, Output, EventEmitter } from '@angular/core';
import { GeolocaApiLocationIqService } from 'src/app/servicios/geoloca-api-location-iq.service';
import { LatitudLongitud } from 'src/app/modelos/latlon.interface';
import { IBuscador } from 'src/app/modelos/buscador.interface';

@Component({
  selector: 'app-usa-api-location-iq',
  templateUrl: './usa-api-location-iq.component.html',
  styleUrls: ['./usa-api-location-iq.component.css']
})
export class UsaApiLocationIqComponent {

  constructor(private buscaDirecc: GeolocaApiLocationIqService) { }

  public valorTexto = '';
  public listado: any[] = [];
  public coordenadas: any[] = [];
  public latLon: LatitudLongitud;
  vectorBusquedasGuardadas: IBuscador[] = [];
  vectorBusquedas: string[] = [];
  public contador: number = 0;
  public infoBuscar = 'Buscar con Location Iq: https://locationiq.com/';
  @Output() eventoMarcador = new EventEmitter<LatitudLongitud>();

  //==================================================================
  keyDownFunction(event) {
    //==================================================================
    //  if (event.keyCode == 13) {
    this.buscaLugar(this.valorTexto);
    //  }
  }

  //==================================================================
  buscaLugar(direccion: string) {  // click en el boton "Buscar"
    //==================================================================
    this.listado = [];
    this.coordenadas = [];
    const contenido: string = direccion;                  // el texto ingresado
    this.buscaDirecc.getData(contenido)
      .subscribe(salida => {
        //console.log("Se buscó: ", contenido, ", y el servicio respondió: ", salida);
        let cantidad = salida.length;
        for (let uno of salida) {
          // console.log('Bounding box: ', uno.boundingbox);
          // console.log('class:', uno.class);
          // console.log('Display name: ', uno.display_name);
          // console.log('icon:', uno.icon);
          // console.log('Importancia: ', uno.importance);
          // console.log('lat: ', uno.lat);
          // console.log('lon: ', uno.lon);
          // console.log('licence: ', uno.licence);
          // console.log('osm_id: ', uno.osm_id);
          // console.log('osm_type: ', uno.osm_type);
          // console.log('type: ', uno.type);
          this.listado.push(uno.display_name);
          this.coordenadas.push(uno.lat + ', ' + uno.lon);
          //console.log(this.listado);
          //console.log(this.coordenadas);
        }

      });
  }

  //=====================================================================
  atajar(event: any) {   // se seleccionó un item de la lista de posibles
    //=====================================================================
    const textoSeleccionado = event.currentTarget.childNodes[0].data;
    const spliteado = textoSeleccionado.split("-");
    const indice = spliteado[0].trim();
    const textoParaPopup = spliteado[1].trim();
    const latLonJuntos: string = this.coordenadas[indice];
    const coordsSpliteadas = latLonJuntos.split(",");
    const latiString = coordsSpliteadas[0].trim();
    const longString = coordsSpliteadas[1].trim();
    const lati: number = parseFloat(latiString);
    const long: number = parseFloat(longString);
    this.latLon = { lat: lati, lon: long, texto: textoParaPopup };
    this.contador = this.contador + 1;
    this.vectorBusquedas.push(textoParaPopup);   //ojo, en este vector se guarda solo el string seleccionado de la lista desplegable

    this.eventoMarcador.emit(this.latLon);

    let unaRespuesta: IBuscador = {
      epsg: '',
      categoria: '',
      origin: '',
      geometry: latLonJuntos,
      nombre: textoParaPopup
    };
    this.vectorBusquedasGuardadas.push(unaRespuesta);   //en este vector se guarda el json de la respuesta seleccionada y mostrada en el mapa 
    console.log('vector busquedas guardadas:', this.vectorBusquedasGuardadas);
    this.listado = [];
    this.coordenadas = [];
    this.valorTexto = '';
  }

  /*============================================================================*/
  busquedasGuardadas(event: any) {
    /*============================================================================*/
    const textoSeleccionado = event.currentTarget.childNodes[0].data;
    const spliteado = textoSeleccionado.split("-");
    const direccion = spliteado[1].trim();
    for (let ocurrencia of this.vectorBusquedasGuardadas) {
      if (ocurrencia.nombre == direccion) {
        const coordsSpliteadas = ocurrencia.geometry.split(",");
        const latiString = coordsSpliteadas[0].trim();
        const longString = coordsSpliteadas[1].trim();
        const lati: number = parseFloat(latiString);
        const long: number = parseFloat(longString);
        this.latLon = { lat: lati, lon: long, texto: direccion };
        this.eventoMarcador.emit(this.latLon);
      }
    }
  }


}
