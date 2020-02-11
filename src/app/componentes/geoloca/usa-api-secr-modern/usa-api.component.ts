/* 
Este componente utiliza la api de la secretaria de modernización de presidencia de la nacion:
https://datos.gob.ar/apis
*/

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LatitudLongitud } from 'src/app/modelos/latlon.interface';
import { GeolocaApiSecrModernService } from 'src/app/servicios/geoloca-api-secr-modern.service';
import { IBuscador } from 'src/app/modelos/buscador.interface';


@Component({
  selector: 'app-usa-api',
  templateUrl: './usa-api.component.html',
  styleUrls: ['./usa-api.component.css']
})
export class UsaApiComponent implements OnInit {
  public listado: any[] = [];
  public coordenadas: any[] = [];
  public latLon: LatitudLongitud;
  public valorTexto = '';
  vectorBusquedasGuardadas: IBuscador[] = [];
  vectorBusquedas: string[] = [];
  public contador: number = 0;
  public infoBuscar = 'Buscar con la API de la Secretaria de Modernización de la Nación https://datos.gob.ar/apis';
  @Output() eventoMarcador = new EventEmitter<LatitudLongitud>();

  constructor(private buscaDirecc: GeolocaApiSecrModernService) { }
  ngOnInit() {
  }

  //==================================================================
  buscaLugar(direccion: string) {  // click en el boton "Buscar"
    //==================================================================
    this.listado = [];
    this.coordenadas = [];
    const contenido: string = direccion;                  // el texto ingresado
    this.buscaDirecc.getData(contenido)
      .subscribe(salida => {
        console.log("Se buscó: ", contenido, ", y el servicio respondió: ", salida);
        //this.respuesta = salida;
        //this.procesarSalida(this.respuesta);
        console.log('cantidad de elementos:', salida.cantidad);
        for (let uno of salida.direcciones) {
          console.log('altura valor: ', uno['altura']['valor']);
          console.log('calle nombre: ', uno['calle']['nombre']);
          console.log('calle cruce 1: ', uno['calle_cruce_1']['nombre']);
          console.log('calle cruce 2: ', uno['calle_cruce_2']['nombre']);
          console.log('departamento: ', uno['departamento']['nombre']);
          console.log('nomenclatura: ', uno['nomenclatura']);
          console.log('piso: ', uno['piso']);
          console.log('provincia: ', uno['provincia']['nombre']);
          console.log('ubicacion lat: ', uno['ubicacion']['lat']);
          console.log('ubicacion lon: ', uno['ubicacion']['lon']);
          if (uno['ubicacion']['lat'] !== null) {
            this.listado.push(uno['nomenclatura']);
            this.coordenadas.push(uno['ubicacion']['lat'] + ', ' + uno['ubicacion']['lon']);
          }
        }
        console.log(this.listado);
        console.log(this.coordenadas);
      });
  }

  //=====================================================================
  recargar() {
    //=====================================================================
    location.reload();
  }

  //=====================================================================
  atajar(event: any) {   // se seleccionó un item de la lista de candidatos posibles
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
    this.vectorBusquedas.push(textoParaPopup);  //ojo, en este vector se guarda solo el string seleccionado de la lista 
    //desplegable

    this.eventoMarcador.emit(this.latLon);

    let unaRespuesta: IBuscador = {
      epsg: '',
      categoria: '',
      origin: '',
      geometry: latLonJuntos,
      nombre: textoParaPopup
    };
    this.vectorBusquedasGuardadas.push(unaRespuesta);                         //en este vector se guarda el json de la respuesta seleccionada y mostrada en el mapa 
    console.log('vector busquedas guardadas:', this.vectorBusquedasGuardadas);
    this.listado = [];
    this.coordenadas = [];
    this.valorTexto = '';
  }

  //=====================================================================
  keyDownFunction(event) {
    //=====================================================================
    //if (event.keyCode == 13) {
      this.buscaLugar(this.valorTexto);
    //}
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



