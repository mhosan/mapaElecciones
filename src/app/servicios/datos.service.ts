import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from "rxjs/Subject";

declare let L;
declare let $: any;

@Injectable({
  providedIn: 'root'
})

export class DatosService {
  private terminadoInterno = new Subject<void>();         //<--- los Subject son OBSERVABLES que pueden emitir eventos.
  //El evento lo quiero emitir a nivel interno, por eso el subject
  //es privado. Luego hay que exponer un observable publico con el 
  //flujo del primer subject para subscribirse desde el componente.

  public terminadoPublico = this.terminadoInterno.asObservable(); //<--- subject publico que muestra el flujo de datos del 
  //subject privado.

  elJsonDelIGN: any;
  constructor(private http: HttpClient) { }

  getRenabap(): Observable<any> {
    let renabap = this.http.get<any>("./assets/renabap.geojson"); //estoy trayendo el geoJson estático que se encuentra en assets
    return renabap;
  }

  getPartidos2015(): Observable<any> {
    let losPartidos = this.http.get<any>("./assets/partidos.geojson"); //estoy trayendo el geoJson estático que se encuentra en assets
    return losPartidos;
  }

  buscarGeoJsonPartidos(): Observable<any> {
    let partidosEnFormatoGeoJson = this.http.get<any>("./assets/partidos.geojson");
    return partidosEnFormatoGeoJson
  }

  getCircuitosElectorales(): Observable<any> {
    let losCircuitos = this.http.get<any>("./assets/circuitosElectoralesBuenosAires.geojson");
    return losCircuitos;
  }

  getEscuelas(): Observable<any> {
    let escuelas = this.http.get<any>("./assets/escuelas.geojson");
    return escuelas;
  }
  getWfsIgn(): Observable<any> {
    let laUrlCompleta = 'https://wms.ign.gob.ar/geoserver/ows?service=wfs&version=1.1.0&request=GetFeature&typeName=ign:departamento&outputFormat=application/json';
    let laUrlFiltrada = 'https://wms.ign.gob.ar/geoserver/ows?service=wfs&version=1.1.0&request=GetFeature&typeName=ign:departamento&outputFormat=application/json&CQL_FILTER=geometryType=%27MultiPolygon%27&PROPERTYNAME=gna&CQL_FILTER=gna=%27Partido%27';
    let laUrlArba = 'http://geo.arba.gov.ar/geoserver/idera/wfs?service=wfs&version=1.1.0&request=GetFeature&typeName=idera:Departamento&outputFormat=application/json&srsName=EPSG:4326'
    let laUrlSecGobAmbSust = 'http://geo2.ambiente.gob.ar/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&typeName=ordenamiento:apn_sifal2016&outputFormat=application/json'
    this.elJsonDelIGN = this.http.get<any>(laUrlCompleta);
    return this.elJsonDelIGN;
  }
  // getJsonWFS() {
  //   let urlIGN = "https://wms.ign.gob.ar/geoserver/ows";
  //   let defaultParameters = {
  //     service: 'WFS',
  //     version: '1.1.0',
  //     request: 'GetFeature',
  //     typeName: 'ign:departamento',
  //     outputFormat: 'application/json',
  //     maxFeatures: 150
  //   };
  //   let parameters = L.Util.extend(defaultParameters);
  //   let urlWFS = urlIGN + L.Util.getParamString(parameters);
  //   $.ajax({
  //     url: urlWFS,
  //     success: (data) => {
  //       this.elJsonDelIGN = data;
  //       this.layerWFS = new L.geoJson(data, {
  //         style: { color: 'rgb(255, 0, 0)', "weight": 1.0, "opacity": 0.60, "fillColor": "#000000", "fillOpacity": 0.1 },
  //         onEachFeature: (feature, layer) => {
  //           layer.bindPopup(feature.properties.fna)
  //         }
  //       });
  //       console.log(`Datos leidos en el servicio: ${this.layerWFS}`);
  //       this.terminadoInterno.next(); //<--- este es el subject interno...
  //     }
  //   });
  // }
}
