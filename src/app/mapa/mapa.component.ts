
import { Component, OnInit } from '@angular/core';
import { LatitudLongitud } from '../modelos/latlon.interface';
import { Paso2019edit } from '../modelos/paso2019edit';
import { DatosService } from '../servicios/datos.service';
import { EleccionesService } from '../servicios/elecciones.service';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CapaPartidosService } from '../servicios/capas/capa-partidos.service';
import { CapaEscuelasService } from '../servicios/capas/capa-escuelas.service';
import { CapaCircuitosService } from '../servicios/capas/capa-circuitos.service';
import { CapaWfsIgnService } from '../servicios/capas/capa-wfs-ign.service';
import { RenabapService } from '../servicios/capas/capa-renabap.service';
import { EspaciosPoliticos } from '../modelos/espacios-politicos.enum';
//import { NgForm } from '@angular/forms';
//import * as c3 from 'c3';

declare let L;
declare let $: any;
let miMapa:any;
let actualizando: boolean = false;
let controlLayers;
let estamosEnEdicion: boolean;
declare let require: any;
let omnivore = require('@mapbox/leaflet-omnivore');
let partidosBA;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})


/*=========================================================================================*/
export class MapaComponent implements OnInit {
  /*=======================================================================================*/
  public edicion: boolean = false;
  public fpv = 0;
  public pro = 0;
  public cf = 0;
  public otro = 0;
  public miCapa: any;
  public miPcia2015: any;
  public miPcia2019: any;
  public misCircuitos: any;
  public laCapaDeLosPartidos: any;
  public capaRenabap:any;
  public elPartidoFiltrado: any;
  public laEscuelaFiltrada: any;
  public elCircuitoFiltrado: any;
  public layerWFS: any;
  public resumenPaso2019: boolean;
  public espacios: any[] = [];  //propiedad para llenar el select de la vista
  public arrayMunicipiosLeidos: Paso2019edit[] = [];
  public arrayMunicipiosLeidosGenerales: Paso2019edit[] = [];
  public modeloPaso2019: Paso2019edit;
  public eleccionesGenerales: boolean;
  public capaCircuitos: boolean;
  public listadoPartidos: string[] = [];
  public partidoSeleccionado: string;
  public partidoSeleccionadoParaCircuito: string;
  public partidoSeleccionadoParaEscuela: string;
  public version:string;

  constructor(
    private servicioDatos: DatosService,
    private servicioMunicipios: EleccionesService,
    //private modalService: NgbModal,
    private servicioCapasPartido: CapaPartidosService,
    private servicioCircuitos: CapaCircuitosService,
    private servicioEscuelas: CapaEscuelasService,
    private servicioWfsIgn: CapaWfsIgnService,
    private servicioCapasRenabap: RenabapService) { }

  //====================================================================================
  ngOnInit() {
    //==================================================================================
    this.version=L.version;
    this.armarTodo();
  }
  //================================================fin "ngOnInit=======================
  // armarGrafico():void {
  //   let chart = c3.generate({
  //     bindto: '#chart',
  //     data: {
  //       columns: [
  //         ['data1', 30, 200, 100, 150, 400,],
  //         ['data2', 50, 20, 10, 40, 25]
  //       ]
  //     }
  //   });
  // }
  // mostrarGrafico(){
  //   if(!$('#cardGrafico').length){
  //     $('body').append('<div id="cardGrafico" style="z-index: 99999;"></div>');
  //     $('#cardGrafico').html('<div id="chart"></div>');
  //     let chart = c3.generate({
  //       bindto: '#chart',
  //       data: {
  //         columns: [
  //           ['data1', 30, 200, 100, 150, 400,],
  //           ['data2', 50, 20, 10, 40, 25]
  //         ]
  //       }
  //     });
  //   }
  //   if(this.verGrafico){
  //     this.verGrafico=false;
  //   } else {
  //     this.verGrafico = true;
  //   }
  // }

  //vaciar el select...
  //document.getElementById("selectID").options.length = 0;

  //=====================================================================================
  administrarNavBarMenu(seleccion:any){
    //===================================================================================
    switch(seleccion.seleccion){
      case 'renabap':
        this.renabap();
        break;
      case 'paso2019':
        this.elecciones2019Paso();
        break;
      case 'generales2019':
        this.elecciones2019Generales();
        break;
      case 'circuitos':
        this.leerCircuitos();
        break;
      case 'unPartido':
        //alert(seleccion.partido);
        this.circuito(seleccion.partido);
        break;
      case 'leerPartidos':
        this.leerPartidos();
        break;
      case 'unPartidoPartido':
        this.partidoElegido(seleccion.partido)
        break;
      case 'unaEscuela':
        this.escuelas(seleccion.partido);
        break;
      case 'partidosIgn':
        this.capaWFS();
        break;
    }
  }

  //=====================================================================================
  renabap() { //...
    //===================================================================================
    if (miMapa.hasLayer(this.capaRenabap)) {
      miMapa.removeLayer(this.capaRenabap);
    }
    this.servicioDatos.getRenabap()
      .subscribe(respuestaJson => {
        this.capaRenabap = this.servicioCapasRenabap.getCapaRenabap(respuestaJson, '');
        miMapa.addLayer(this.capaRenabap);
        miMapa.fitBounds(this.capaRenabap.getBounds());
      });
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
  //=====================================================================================
  leerPartidos() { //traer todos los partidos
    //===================================================================================
    if (miMapa.hasLayer(this.laCapaDeLosPartidos)) {
      miMapa.removeLayer(this.laCapaDeLosPartidos);
    }
    if (miMapa.hasLayer(this.elPartidoFiltrado)) {
      miMapa.removeLayer(this.elPartidoFiltrado);
    }
    this.servicioDatos.buscarGeoJsonPartidos()
      .subscribe(respuestaJson => {
        this.laCapaDeLosPartidos = this.servicioCapasPartido.getPartidos(respuestaJson, '');
        miMapa.addLayer(this.laCapaDeLosPartidos);
        miMapa.fitBounds(this.laCapaDeLosPartidos.getBounds());
      });
  }
  //=====================================================================================
  partidoElegido(partidoSeleccionado:string) {  //traer UN partido
    //===================================================================================
    if (miMapa.hasLayer(this.elPartidoFiltrado)) {
      miMapa.removeLayer(this.elPartidoFiltrado);
    }
    if (miMapa.hasLayer(this.laCapaDeLosPartidos)) {
      miMapa.removeLayer(this.laCapaDeLosPartidos);
    }
    this.servicioDatos.buscarGeoJsonPartidos()
      .subscribe(respuestaJson => {
        this.elPartidoFiltrado = this.servicioCapasPartido.getPartidos(respuestaJson, partidoSeleccionado);
        miMapa.addLayer(this.elPartidoFiltrado);
        miMapa.fitBounds(this.elPartidoFiltrado.getBounds());
      });
  }

  //========================================================
  capaWFS() {
    //======================================================
    if (miMapa.hasLayer(this.layerWFS)) {
      miMapa.removeLayer(this.layerWFS);
    }
    this.servicioDatos.getWfsIgn()
      .subscribe(respuestaJson => {
        this.layerWFS = this.servicioWfsIgn.getWfs(respuestaJson, 'Partido');
        miMapa.addLayer(this.layerWFS);
        miMapa.fitBounds(this.layerWFS.getBounds());
      });
  }

  //=====================================================================================
  leerCircuitos() { //todos
    //===================================================================================
    if (miMapa.hasLayer(this.elCircuitoFiltrado)) {
      miMapa.removeLayer(this.elCircuitoFiltrado);
    }
    if (miMapa.hasLayer(this.misCircuitos)) {
      miMapa.removeLayer(this.misCircuitos);
    }
    this.servicioDatos.getCircuitosElectorales()//<--- primero obtengo el json con los datos
      .subscribe(respuestaJson => {
        this.misCircuitos = this.servicioCircuitos.getCircuitosDepurado(respuestaJson, ''); //<--obtengo la capa armada
        miMapa.addLayer(this.misCircuitos);
        miMapa.fitBounds(this.misCircuitos.getBounds());
      });
  }

  //=====================================================================================
  circuito(elPartido:string) {  //circuito electoral filtrado
    //===================================================================================
    if (miMapa.hasLayer(this.misCircuitos)) {
      miMapa.removeLayer(this.misCircuitos);
    }
    if (miMapa.hasLayer(this.elCircuitoFiltrado)) {
      miMapa.removeLayer(this.elCircuitoFiltrado);
    }
    this.servicioDatos.getCircuitosElectorales()//<--- primero obtengo el json con los datos
      .subscribe(respuestaJson => {
        this.elCircuitoFiltrado = this.servicioCircuitos.getCircuitosDepurado(respuestaJson, elPartido); //<--obtengo la capa armada
        miMapa.addLayer(this.elCircuitoFiltrado);
        miMapa.fitBounds(this.elCircuitoFiltrado.getBounds());
      });
  }

  //=====================================================================================
  escuelas(elPartidoDeLaEscuela:string) {  //leer un geoJson de escuelas que se encuentra en la carpeta assets
    //===================================================================================
    if (miMapa.hasLayer(this.laEscuelaFiltrada)) {
      miMapa.removeLayer(this.laEscuelaFiltrada);
    }
    if (miMapa.hasLayer(this.laEscuelaFiltrada)) {
      miMapa.removeLayer(this.laEscuelaFiltrada);
    }
    this.servicioDatos.getEscuelas()//<--- primero obtengo el json con los datos
      .subscribe(respuestaJson => {
        this.laEscuelaFiltrada = this.servicioEscuelas.getEscuelas(respuestaJson, elPartidoDeLaEscuela); //<--obtengo la capa armada
        miMapa.addLayer(this.laEscuelaFiltrada);
        miMapa.fitBounds(this.laEscuelaFiltrada.getBounds());
      });
  }

  //=====================================================================================
  leerPartidos2019() {
    //===================================================================================
    this.servicioDatos.getPartidos2015()
      .subscribe(
        partidosJson => {
          partidosBA = partidosJson;

          this.eleccionesGenerales = true;
          /*municipioLosDatos es un array local de esta funcion del tipo de datos de la 
                    interface Paso2019edit */
          let municipiosLosDatosGenerales: Paso2019edit[] = JSON.parse(sessionStorage.getItem('municipiosGenerales'));

          var cargarCapaEnControlLayer: boolean;
          if (miMapa.hasLayer(this.miPcia2019)) {
            miMapa.removeLayer(this.miPcia2019);
            this.miPcia2019 = '';
            cargarCapaEnControlLayer = true;
          } else {
            cargarCapaEnControlLayer = false;
          }

          this.miPcia2019 = L.geoJson(partidosBA, {
            style: function (feature) {
              for (let i = 0; i < municipiosLosDatosGenerales.length; i++) {
                if (municipiosLosDatosGenerales[i].idMuni === feature.properties.cca) {
                  const elPdo: string = String(municipiosLosDatosGenerales[i].paso2019espacioPrimero);
                  switch (elPdo) {
                    case "1": return { color: '#000000', "weight": 0.3, "opacity": 1.00, "fillColor": "#0066ff", "fillOpacity": 0.4 };
                    case "2": return { color: '#000000', "weight": 0.3, "opacity": 1.00, "fillColor": "#ffff66", "fillOpacity": 0.4 };
                    case "3": return { color: '#000000', "weight": 0.3, "opacity": 1.00, "fillColor": "#33cc33", "fillOpacity": 0.4 };
                    case "4": return { color: '#ffbf80', "weight": 0.3, "opacity": 1.00, "fillColor": "#ffbf80", "fillOpacity": 0.4 };
                  }
                  break;
                }
              }
              return { color: '#ccccb3', "weight": 3.0, "opacity": 1.50, "fillColor": "#ccccb3", "fillOpacity": 0.2 };
              //return { color: '#000000', "weight": 0.5, "opacity": 1.00 };
            },
            onEachFeature: (feature, layer) => {
              let colorBordeOriginal: string = '';
              let espesorBordeOriginal: number = 0;
              let colorRellenoOriginal: string = '';
              var popupContent = `
              <table class="table table-striped table-borderless table-sm" style="font-family: 'Arial Narrow'">
                <thead class="thead-dark">
                  <tr>
                    <th scope="col" class="text-center">Municipio</th>
                    <th scope="col" class="text-center">Intendente</th>
                    <th scope="col" class="text-center">Esp. pol.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">${feature.properties.nam}</td>  
                    <td class="text-center">${feature.properties.actual_Int}</td>
                    <td class="text-center">${feature.properties.actual_Pdo}</td>
                  </tr>
                  <tr>
                    <td></td> 
                    <td></td>  
                    <td><button class="mi-boton btn btn-secondary btn-sm ml-5"><i class="fa fa-edit"></i></button></td>
                  </tr>
                </tbody>
              </table>
            `;

              layer.bindPopup(popupContent);

              layer.on("popupopen", () => {
                $(".mi-boton").on("click", (e) => {
                  e.preventDefault();
                  /*El elemento de enlace dentro de la ventana emergente se genera dinámicamente cada vez que se
                  abre la ventana emergente. Eso significa que el enlace no existe cuando se intenta vincularlo
                  con el controlador.
                  El enfoque ideal aquí sería usar 'on' para delegar el manejo de eventos al elemento emergente o
                  un antecesor del mismo. Desafortunadamente, la ventana emergente evita la propagación de 
                  eventos, por lo que no funcionará delegar el manejo de eventos a elementos estáticos fuera de
                  la ventana emergente.
                  Lo que se puede hacer es preconstruir el enlace, adjuntar el controlador y luego pasarlo al 
                  método bindPopup. 
                  */

                  /*enviar el id del feature (en este caso un partido o municipio) y el nombre del municipio al
                  formulario en campos hidden */
                  $('#elmuniid').val(feature.properties.cca);
                  $('#elmuni').text(feature.properties.cca);
                  $('#nombreOculto').val(feature.properties.nam);  //<-- ojo que aca va con val (?)
                  $('#elmuniNombre').text(feature.properties.nam);

                  /*recuperar del sessionStorage el array con los datos que se guardó en sessionStorage cuando
                  se leyeron los datos con la funcion "leerDatos" */
                  municipiosLosDatosGenerales = JSON.parse(sessionStorage.getItem('municipiosGenerales'));

                  sessionStorage.removeItem('edicion');
                  if (municipiosLosDatosGenerales.length == 0) {
                    /*si no hay datos de este municipio estamos en un alta */
                    sessionStorage.setItem('edicion', JSON.stringify(false));
                    estamosEnEdicion = false;
                  }

                  /*cargar los datos en el formulario antes de mostrarlo en pantalla. */
                  for (let i = 0; i < municipiosLosDatosGenerales.length; i++) {
                    if (municipiosLosDatosGenerales[i].idMuni === feature.properties.cca) {
                      $('#idOculto').val(municipiosLosDatosGenerales[i].id);
                      $('#candidatoPrimero').val(municipiosLosDatosGenerales[i].paso2019candidatoPrimero);
                      $('#candidatoSegundo').val(municipiosLosDatosGenerales[i].paso2019candidatoSegundo);
                      $('#espacioPrimero').val(municipiosLosDatosGenerales[i].paso2019espacioPrimero);
                      $('#espacioSegundo').val(municipiosLosDatosGenerales[i].paso2019espacioSegundo);
                      $('#porcentajePrimero').val(municipiosLosDatosGenerales[i].paso2019porcPrimero);
                      $('#porcentajeSegundo').val(municipiosLosDatosGenerales[i].paso2019porcSegundo);
                      $('#votosEnBlanco').val(municipiosLosDatosGenerales[i].paso2019votosEnBlanco);
                      $('#votosPositivos').val(municipiosLosDatosGenerales[i].paso2019votosPositivos);
                      $('#obs').val(municipiosLosDatosGenerales[i].paso2019obs);
                      $('#votosEnBlancoPorcentaje').val(municipiosLosDatosGenerales[i].paso2019porcVotosEnBlanco);
                      $('#votosPositivosPorcentaje').val(municipiosLosDatosGenerales[i].paso2019porcVotosPositivos);
                      if (municipiosLosDatosGenerales[i].paso2019recuperado) {
                        $('#recuperado').prop("checked", true);
                      } else {
                        $('#recuperado').prop("checked", false);
                      }
                      sessionStorage.setItem('edicion', JSON.stringify(true));
                      estamosEnEdicion = true;
                      break;
                    }
                    else {
                      $('#idOculto').val('');
                      $('#candidatoPrimero').val('');
                      $('#candidatoSegundo').val('');
                      $('#espacioPrimero').val('');
                      $('#recuperado').prop("checked", false);
                      $('#espacioSegundo').val('');
                      $('#porcentajePrimero').val(0);
                      $('#porcentajeSegundo').val(0);
                      $('#votosEnBlanco').val(0);
                      $('#votosPositivos').val(0);
                      $('#obs').val('');
                      $('#votosEnBlancoPorcentaje').val(0);
                      $('#votosPositivosPorcentaje').val(0);
                      sessionStorage.setItem('edicion', JSON.stringify(false));
                      estamosEnEdicion = false;
                    }
                  }
                  $("#formularioPaso").modal('show');
                });
              });



              layer.on({
                mouseover: (e: any) => {
                  colorBordeOriginal = e.target.options.color;
                  espesorBordeOriginal = e.target.options.weight;
                  colorRellenoOriginal = e.target.options.fillColor
                  layer.setStyle({
                    "color": "#cc9900",
                    "weight": 2,
                    "fillColor": "#cc9900"
                  });
                  let laCapa = e.target;
                  let miTooltip = L.tooltip({
                    position: 'bottom',
                    noWrap: true,
                    offset: [0, -30],
                    sticky: true,
                    opacity: 0.8
                  })
                    .setContent(feature.properties.cca + ', ' + feature.properties.nam)
                    .setLatLng(e.latlng)
                    .addTo(miMapa);
                  laCapa.bindTooltip(miTooltip);
                },
                mouseout: (e: any) => {
                  layer.setStyle({
                    "color": colorBordeOriginal,
                    "weight": espesorBordeOriginal,
                    "fillColor": colorRellenoOriginal
                  });
                }
              });
            }
          });
          miMapa.addLayer(this.miPcia2019);
          this.encenderReferenciasGenerales2019();
          this.encendidoInicialGenerales();
        }
      );
  }

  //=====================================================================================
  leerPartidos2015() {
    //subscripcion al observable del servicio 'datos.service.ts' para leer el geojson  
    //estático de los partidos, que se encuentra en la carpeta assets.
    //===================================================================================
    this.servicioDatos.getPartidos2015()
      .subscribe(
        partidosJson => {

          partidosBA = partidosJson;
          this.eleccionesGenerales = false;

          /*municipioLosDatos es un array local de esta funcion del tipo de datos de la 
          interface Paso2019edit */
          let municipiosLosDatos: Paso2019edit[] = JSON.parse(sessionStorage.getItem('municipios'));

          var cargarCapaEnControlLayer: boolean;
          if (miMapa.hasLayer(this.miPcia2015)) {
            miMapa.removeLayer(this.miPcia2015);
            this.miPcia2015 = '';
            cargarCapaEnControlLayer = true;
          } else {
            cargarCapaEnControlLayer = false;
          }

          this.miPcia2015 = L.geoJson(partidosJson, {  //<------------------------------------------------------------------------

            style: function (feature) {
              for (let i = 0; i < municipiosLosDatos.length; i++) {
                if (municipiosLosDatos[i].idMuni === feature.properties.cca) {
                  const elPdo: string = String(municipiosLosDatos[i].paso2019espacioPrimero);
                  switch (elPdo) {
                    case "1": return { color: '#000000', "weight": 0.3, "opacity": 1.00, "fillColor": "#0066ff", "fillOpacity": 0.4 };
                    case "2": return { color: '#000000', "weight": 0.3, "opacity": 1.00, "fillColor": "#ffff66", "fillOpacity": 0.4 };
                    case "3": return { color: '#000000', "weight": 0.3, "opacity": 1.00, "fillColor": "#33cc33", "fillOpacity": 0.4 };
                    case "4": return { color: '#ffbf80', "weight": 0.3, "opacity": 1.00, "fillColor": "#ffbf80", "fillOpacity": 0.4 };
                  }
                  break;
                }
              }
              return { color: '#ccccb3', "weight": 3.0, "opacity": 1.50, "fillColor": "#ccccb3", "fillOpacity": 0.2 };
              //return { color: '#000000', "weight": 0.5, "opacity": 1.00 };
            },
            onEachFeature: function (feature, layer) {
              /*--------lo que va en el popup--------*/
              let colorBordeOriginal: string = '';
              let espesorBordeOriginal: number = 0;
              let colorRellenoOriginal: string = '';
              var popupContent = `
              <table class="table table-striped table-borderless table-sm" style="font-family: 'Arial Narrow'">
                <thead class="thead-dark">
                  <tr>
                    <th scope="col" class="text-center">Municipio</th>
                    <th scope="col" class="text-center">Intendente</th>
                    <th scope="col" class="text-center">Esp. pol.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">${feature.properties.nam}</td>  
                    <td class="text-center">${feature.properties.actual_Int}</td>
                    <td class="text-center">${feature.properties.actual_Pdo}</td>
                  </tr>
                  <tr>
                    <td></td> 
                    <td></td>  
                    <td><button class="mi-boton btn btn-secondary btn-sm ml-5"><i class="fa fa-edit"></i></button></td>
                  </tr>
                </tbody>
              </table>
            `;

              layer.bindPopup(popupContent);

              layer.on("popupopen", () => {
                $(".mi-boton").on("click", (e) => {
                  e.preventDefault();
                  /*El elemento de enlace dentro de la ventana emergente se genera dinámicamente cada vez que se
                  abre la ventana emergente. Eso significa que el enlace no existe cuando se intenta vincularlo
                  con el controlador.
                  El enfoque ideal aquí sería usar 'on' para delegar el manejo de eventos al elemento emergente o
                  un antecesor del mismo. Desafortunadamente, la ventana emergente evita la propagación de 
                  eventos, por lo que no funcionará delegar el manejo de eventos a elementos estáticos fuera de
                  la ventana emergente.
                  Lo que se puede hacer es preconstruir el enlace, adjuntar el controlador y luego pasarlo al 
                  método bindPopup. 
                  */

                  /*enviar el id del feature (en este caso un partido o municipio) y el nombre del municipio al
                  formulario en campos hidden */
                  $('#elmuniid').val(feature.properties.cca);
                  $('#elmuni').text(feature.properties.cca);
                  $('#nombreOculto').val(feature.properties.nam);  //<-- ojo que aca va con val (?)
                  $('#elmuniNombre').text(feature.properties.nam);

                  /*recuperar del sessionStorage el array con los datos que se guardó en sessionStorage cuando
                  se leyeron los datos con la funcion "leerDatos" */
                  this.municipiosLosDatos = JSON.parse(sessionStorage.getItem('municipios'));

                  sessionStorage.removeItem('edicion');
                  if (this.municipiosLosDatos.length == 0) {
                    /*si no hay datos de este municipio estamos en un alta */
                    sessionStorage.setItem('edicion', JSON.stringify(false));
                    estamosEnEdicion = false;
                  }

                  /*cargar los datos en el formulario antes de mostrarlo en pantalla. */
                  for (let i = 0; i < this.municipiosLosDatos.length; i++) {
                    if (this.municipiosLosDatos[i].idMuni === feature.properties.cca) {
                      $('#idOculto').val(this.municipiosLosDatos[i].id);
                      $('#candidatoPrimero').val(this.municipiosLosDatos[i].paso2019candidatoPrimero);
                      $('#candidatoSegundo').val(this.municipiosLosDatos[i].paso2019candidatoSegundo);
                      $('#espacioPrimero').val(this.municipiosLosDatos[i].paso2019espacioPrimero);
                      $('#espacioSegundo').val(this.municipiosLosDatos[i].paso2019espacioSegundo);
                      $('#porcentajePrimero').val(this.municipiosLosDatos[i].paso2019porcPrimero);
                      $('#porcentajeSegundo').val(this.municipiosLosDatos[i].paso2019porcSegundo);
                      $('#votosEnBlanco').val(this.municipiosLosDatos[i].paso2019votosEnBlanco);
                      $('#votosPositivos').val(this.municipiosLosDatos[i].paso2019votosPositivos);
                      $('#obs').val(this.municipiosLosDatos[i].paso2019obs);
                      $('#votosEnBlancoPorcentaje').val(this.municipiosLosDatos[i].paso2019porcVotosEnBlanco);
                      $('#votosPositivosPorcentaje').val(this.municipiosLosDatos[i].paso2019porcVotosPositivos);
                      if (this.municipiosLosDatos[i].paso2019recuperado) {
                        $('#recuperado').prop("checked", true);
                      } else {
                        $('#recuperado').prop("checked", false);
                      }
                      sessionStorage.setItem('edicion', JSON.stringify(true));
                      estamosEnEdicion = true;
                      break;
                    }
                    else {
                      $('#idOculto').val('');
                      $('#candidatoPrimero').val('');
                      $('#candidatoSegundo').val('');
                      $('#espacioPrimero').val('');
                      $('#recuperado').prop("checked", false);
                      $('#espacioSegundo').val('');
                      $('#porcentajePrimero').val(0);
                      $('#porcentajeSegundo').val(0);
                      $('#votosEnBlanco').val(0);
                      $('#votosPositivos').val(0);
                      $('#obs').val('');
                      $('#votosEnBlancoPorcentaje').val(0);
                      $('#votosPositivosPorcentaje').val(0);
                      sessionStorage.setItem('edicion', JSON.stringify(false));
                      estamosEnEdicion = false;
                    }
                  }
                  $("#formularioPaso").modal('show');
                });
              });
              layer.on({
                //click: (e: any)=>{
                //   this.idMunicipio = feature.properties.cca;
                //   alert('Id Municipio: ' + this.idMunicipio);
                //console.log('Estos son los datos leidos:', this.arrayMunicipios);
                //},
                mouseover: (e: any) => {
                  colorBordeOriginal = e.target.options.color;
                  espesorBordeOriginal = e.target.options.weight;
                  colorRellenoOriginal = e.target.options.fillColor
                  layer.setStyle({
                    "color": "#cc9900",
                    "weight": 2,
                    "fillColor": "#cc9900"
                  });
                  let laCapa = e.target;
                  let miTooltip = L.tooltip({
                    position: 'bottom',
                    noWrap: true,
                    offset: [0, -30],
                    sticky: true,
                    opacity: 0.8
                  })
                    .setContent(feature.properties.cca + ', ' + feature.properties.nam)
                    .setLatLng(e.latlng)
                    .addTo(miMapa);
                  laCapa.bindTooltip(miTooltip);
                  /*miPopup = L.popup()
                    .setLatLng(e.latlng) 
                    .setContent(feature.properties.cca + ', ' + feature.properties.nam);
                  miPopup.closeButton('false');  
                  miPopup.openOn(miMapa);
                  */
                },
                mouseout: (e: any) => {
                  layer.setStyle({
                    "color": colorBordeOriginal,
                    "weight": espesorBordeOriginal,
                    "fillColor": colorRellenoOriginal
                  });
                  //miMapa.closePopup(miPopup);
                }
              });
            }
          });
          if (cargarCapaEnControlLayer) {
            miMapa.addLayer(this.miPcia2015);
          }
          this.encendidoInicialPaso();
        }
      );
  };

  //=====================================================================================
  verCoordenadas(e) {
    //===================================================================================
    const popupCoordenadas = L.popup();
    popupCoordenadas
      .setLatLng(e.latlng)
      .setContent('Coordenadas: ' + e.latlng)
      .openOn(miMapa);
  }

  //=====================================================================================
  centrarMapa(e) {
    //===================================================================================
    miMapa.panTo(e.latlng);
  }

  //=====================================================================================
  acercar(e) {
    //===================================================================================
    miMapa.zoomIn();
  }

  //=====================================================================================
  alejar(e) {
    //===================================================================================
    miMapa.zoomOut();
  }

  // //=====================================================================================
  // agregarCapa(elWktParaAgregar: string): void {
  //   //===================================================================================    
  //   if (miMapa.hasLayer(this.miCapa)) {
  //     miMapa.removeLayer(this.miCapa);
  //   }
  //   this.miCapa = L.geoJson(null, {
  //     style: function (feature) {
  //       switch (feature.type) {
  //        case 'MultiPolygon': return { color: '#ff0000', "weight": 8, "opacity": 0.45 };
  //        case 'MultiLineString': return { color: '#00ff00', "weight": 10, "opacity": 0.45 };
  //        case 'MultiPolygon': return { color: '#ff0000'};
  //        case 'MultiLineString': return { color: '#00ff00'};
  //       }
  //       return { color: '#ff0000', "weight": 8, "opacity": 0.45 };
  //     },
  //     onEachFeature: function (feature, layer) {
  //       var popupContent = "<p>La geometría utilizada es del tipo: " +
  //         feature.type + "</p>";
  //       layer.bindPopup(popupContent);
  //     }
  //   });
  //   omnivore.wkt.parse(elWktParaAgregar, null, this.miCapa).addTo(miMapa);
  //   miMapa.fitBounds(this.miCapa.getBounds());
  // }

  //=====================================================================================
  ponerMarcador(objetoLatLong: LatitudLongitud) {
    //===================================================================================  
    let lasCoords = [];
    lasCoords[0] = objetoLatLong.lat;
    lasCoords[1] = objetoLatLong.lon;
    miMapa.setView(lasCoords, 17);

    let marca = L.marker(lasCoords, {
      icon: L.icon({
        iconSize: [35, 40],
        iconAnchor: [20, 40],
        iconUrl: 'assets/images/location.png'
        //shadowUrl: 'assets/images/marcador01.png'
      })
    }).addTo(miMapa);

    const miPopup = L.popup({ offset: L.point(-3, -33) });
    miPopup.setContent("<h5><b>Ubicaci&oacute;n:</b></h5>"
      + "<hr>"
      + "<h6><p>" + objetoLatLong.texto + "</p></h6>"
    );
    miPopup.setLatLng(lasCoords);
    miPopup.openOn(miMapa);
    marca.bindPopup(miPopup);
  }

  //=====================================================================================
  hacerRecuentoPaso2019(arrayPartidos: Paso2019edit[]) {
    //===================================================================================
    arrayPartidos.forEach(partido => {
      const elPdo: string = String(partido.paso2019espacioPrimero);
      switch (elPdo) {
        case '1': return this.fpv = this.fpv + 1;
        case '2': return this.pro = this.pro + 1;
        case '3': return this.cf = this.cf + 1;
        case '4': return this.otro = this.otro + 1;
      }
    });
    //console.log(`fpv: ${this.fpv}, pro: ${this.pro}, cf: ${this.cf}, otro: ${this.otro}`);
  }

  //=====================================================================================
  encendidoInicialPaso() {
    //===================================================================================
    miMapa.addLayer(this.miPcia2015);
    miMapa.fitBounds(this.miPcia2015.getBounds());
    //miMapa.zoomIn(1);
    this.encenderReferenciasPaso2019();
    this.apagarReferenciasGenerales2019();
  }
  //=====================================================================================
  encendidoInicialGenerales() {
    //===================================================================================
    miMapa.addLayer(this.miPcia2019);
    if (!actualizando) {
      miMapa.fitBounds(this.miPcia2019.getBounds());
      //miMapa.zoomIn(1);
    }
    this.apagarReferenciasPaso2019();
    this.encenderReferenciasGenerales2019();
  }

  //=====================================================================================
  elecciones2019Paso() {
    //===================================================================================
    /* esta funcion es llamada desde la vista, cuando se hace click en el boton "elecciones
    Paso 2019" */
    if (miMapa.hasLayer(this.miPcia2015)) {
      miMapa.removeLayer(this.miPcia2015);
      this.apagarReferenciasPaso2019();
    } else {
      if (miMapa.hasLayer(this.miPcia2019)) {
        miMapa.removeLayer(this.miPcia2019);
        this.apagarReferenciasGenerales2019();
      }

      if (this.miPcia2015) {
        miMapa.addLayer(this.miPcia2015);
        this.encenderReferenciasPaso2019();
      } else {
        this.leerPartidos2015();
      }
    }
  }
  //=====================================================================================
  elecciones2019Generales() {
    //===================================================================================
    if (miMapa.hasLayer(this.miPcia2019)) {
      miMapa.removeLayer(this.miPcia2019);
      this.apagarReferenciasGenerales2019();
    } else {
      if (miMapa.hasLayer(this.miPcia2015)) {
        miMapa.removeLayer(this.miPcia2015);
        this.apagarReferenciasPaso2019();
      }

      if (this.miPcia2019) {
        miMapa.addLayer(this.miPcia2019);
        this.encenderReferenciasGenerales2019();
      } else {
        this.leerPartidos2019();
      }
    }
  }

  //=====================================================================================
  apagarReferenciasPaso2019() {
    //===================================================================================
    let referenciasPaso;
    referenciasPaso = document.getElementsByClassName("footer");
    for (let i = 0; i < referenciasPaso.length; i++) {
      referenciasPaso[i].style.display = "none";
    }
  }
  //=====================================================================================
  apagarReferenciasGenerales2019() {
    //===================================================================================
    let referenciasGenerales;
    referenciasGenerales = document.getElementsByClassName("footerGenerales");
    for (let i = 0; i < referenciasGenerales.length; i++) {
      referenciasGenerales[i].style.display = "none";
    }
  }
  //=====================================================================================
  encenderReferenciasPaso2019() {
    //===================================================================================
    let referenciasPaso;
    referenciasPaso = document.getElementsByClassName("footer");
    for (let i = 0; i < referenciasPaso.length; i++) {
      referenciasPaso[i].style.display = "block";
    }
  }
  //=====================================================================================
  encenderReferenciasGenerales2019() {
    //===================================================================================
    let referenciasGenerales;
    referenciasGenerales = document.getElementsByClassName("footerGenerales");
    for (let i = 0; i < referenciasGenerales.length; i++) {
      referenciasGenerales[i].style.display = "block";
    }
  }
  //=====================================================================================
  elecciones2019PasoResumenPcia() {
    //===================================================================================
    /* esta funcion es llamada desde la vista, cuando se hace click en el boton*/
    if (this.resumenPaso2019) {
      this.resumenPaso2019 = false;
    } else {
      this.resumenPaso2019 = true;
    }
  }

  //=====================================================================================
  actualizar() {
    //===================================================================================
    /*esta funcion se llama luego de hacer el submit del formulario */
    sessionStorage.clear();
    actualizando = true;
    this.leerDatos();
  }

  //=====================================================================================
  submit() {
    //===================================================================================
    /*cargar los datos del formulario: esto hay que hacerlo porque cuando se hace click
    en en botón Guardar del formulario y se dispara la funcion submit, vienen solo los 
    datos modificados, el resto de los campos vienen vacios (?)*/
    this.modeloPaso2019 = {
      id: $('#idOculto').val(),
      idMuni: $('#elmuniid').val(),
      nombrePartido: $('#nombreOculto').val(),
      paso2019candidatoPrimero: $('#candidatoPrimero').val(),
      paso2019candidatoSegundo: $('#candidatoSegundo').val(),
      paso2019recuperado: $('#recuperado').prop("checked"),
      paso2019espacioPrimero: $('#espacioPrimero').val(),
      paso2019espacioSegundo: $('#espacioSegundo').val(),
      paso2019porcPrimero: $('#porcentajePrimero').val(),
      paso2019porcSegundo: $('#porcentajeSegundo').val(),
      paso2019votosEnBlanco: $('#votosEnBlanco').val(),
      paso2019votosPositivos: $('#votosPositivos').val(),
      paso2019obs: $('#obs').val(),
      paso2019porcVotosEnBlanco: $('#votosEnBlancoPorcentaje').val(),
      paso2019porcVotosPositivos: $('#votosPositivosPorcentaje').val()
    };
    //buscar en sessionStorage la variable edicion para ver si estamos en alta o edicion
    this.edicion = JSON.parse(sessionStorage.getItem('edicion'));

    if (this.edicion) {
      //tamo editando...
      if (this.eleccionesGenerales) {
        this.servicioMunicipios.editMunicipiosGenerales(this.modeloPaso2019.id, this.modeloPaso2019)
          .then(() => {
            console.log('edición ok!');
            $("#formularioPaso").modal('hide');
            this.inicializarModelo();
          });
      } else {
        this.servicioMunicipios.editMunicipios(this.modeloPaso2019.id, this.modeloPaso2019)
          .then(() => {
            console.log('edición ok!');
            $("#formularioPaso").modal('hide');
            this.inicializarModelo();
          });
      }
    } else {
      //tamo en un alta...
      if (this.eleccionesGenerales) {
        this.servicioMunicipios.saveMunicipioGenerales(this.modeloPaso2019)
          .then(response => {
            console.log('la respuesta:', response);
            $("#formularioPaso").modal('hide');
            this.inicializarModelo();
          })
          .catch(err => {
            console.log('error: ', err)
          });
      } else {
        this.servicioMunicipios.saveMunicipio(this.modeloPaso2019)
          .then(response => {
            console.log('la respuesta:', response);
            $("#formularioPaso").modal('hide');
            this.inicializarModelo();
          })
          .catch(err => {
            console.log('error: ', err)
          });
      }
    }
    this.actualizar();
  }

  //=====================================================================================
  leerDatos() {
    /* Se obtienen los datos de una base de datos Firebase y se cargan en un array que 
    se llama "arrayMunicipiosLeidos" el cual implementa el tipo de datos de la 
    interface Paso2019Edit.
    Despues se guardan los datos en sessionStorage para que puedan ser levantados desde
    alli cuando se hace click en el mapa.
    Por último se llama a la función "leerPartidos2015" para generar una nueva capa en 
    memoria desde un geoJson estático guardado en la carpeta assets*/
    //===================================================================================
    this.servicioMunicipios.getMunicipiosPaso().subscribe(respuesta => {
      this.arrayMunicipiosLeidos = [];
      respuesta.docs.forEach(documento => {
        const data = documento.data();
        const id = documento.id;
        const muni: Paso2019edit = {
          id: id,
          idMuni: data.idMuni,
          nombrePartido: data.nombrePartido,
          paso2019candidatoPrimero: data.paso2019candidatoPrimero,
          paso2019candidatoSegundo: data.paso2019candidatoSegundo,
          paso2019recuperado: data.paso2019recuperado,
          paso2019espacioPrimero: data.paso2019espacioPrimero,
          paso2019espacioSegundo: data.paso2019espacioSegundo,
          paso2019porcPrimero: data.paso2019porcPrimero,
          paso2019porcSegundo: data.paso2019porcSegundo,
          paso2019votosEnBlanco: data.paso2019votosEnBlanco,
          paso2019votosPositivos: data.paso2019votosPositivos,
          paso2019obs: data.paso2019obs,
          paso2019porcVotosEnBlanco: data.paso2019porcVotosEnBlanco,
          paso2019porcVotosPositivos: data.paso2019porcVotosPositivos
        };
        this.arrayMunicipiosLeidos.push(muni);
      });
      sessionStorage.setItem('municipios', JSON.stringify(this.arrayMunicipiosLeidos));
      this.hacerRecuentoPaso2019(this.arrayMunicipiosLeidos);
    });
    this.servicioMunicipios.getMunicipiosGenerales().subscribe(respuesta => {
      this.arrayMunicipiosLeidosGenerales = [];
      respuesta.docs.forEach(documento => {
        const data = documento.data();
        const id = documento.id;
        const muni: Paso2019edit = {
          id: id,
          idMuni: data.idMuni,
          nombrePartido: data.nombrePartido,
          paso2019candidatoPrimero: data.paso2019candidatoPrimero,
          paso2019candidatoSegundo: data.paso2019candidatoSegundo,
          paso2019recuperado: data.paso2019recuperado,
          paso2019espacioPrimero: data.paso2019espacioPrimero,
          paso2019espacioSegundo: data.paso2019espacioSegundo,
          paso2019porcPrimero: data.paso2019porcPrimero,
          paso2019porcSegundo: data.paso2019porcSegundo,
          paso2019votosEnBlanco: data.paso2019votosEnBlanco,
          paso2019votosPositivos: data.paso2019votosPositivos,
          paso2019obs: data.paso2019obs,
          paso2019porcVotosEnBlanco: data.paso2019porcVotosEnBlanco,
          paso2019porcVotosPositivos: data.paso2019porcVotosPositivos
        };
        this.arrayMunicipiosLeidosGenerales.push(muni);
      });
      sessionStorage.setItem('municipiosGenerales', JSON.stringify(this.arrayMunicipiosLeidosGenerales));

      if (actualizando) {
        actualizando = false;
        if (miMapa.hasLayer(this.miPcia2019)) {
          miMapa.removeLayer(this.miPcia2019);
          //miMapa.addLayer(this.miPcia2019);
          this.leerPartidos2019();
        }
        if (miMapa.hasLayer(this.miPcia2015)) {
          miMapa.removeLayer(this.miPcia2015);
          //miMapa.addLayer(this.miPcia2015);
          this.leerPartidos2015();
        }
      }

    });
  }

  //=====================================================================================
  inicializarModelo(): void {
    //===================================================================================
    this.modeloPaso2019 = {
      id: '',
      idMuni: '',
      paso2019candidatoPrimero: '',
      paso2019candidatoSegundo: '',
      paso2019espacioPrimero: EspaciosPoliticos["Sin datos"],
      paso2019espacioSegundo: EspaciosPoliticos["Sin datos"],
      paso2019recuperado: false,
      nombrePartido: '',
      paso2019porcPrimero: 0.00,
      paso2019porcSegundo: 0.00,
      paso2019votosEnBlanco: 0,
      paso2019votosPositivos: 0,
      paso2019obs: '',
      paso2019porcVotosEnBlanco: 0.00,
      paso2019porcVotosPositivos: 0.00
    };
  }

  /* escucharCambios() {
    this.servicioMunicipios.getMunicipios().subscribe(muni => {
      console.log('Cambiaron los datos:', muni);
    });
  } */

  //=====================================================================================
  armarTodo() {
    //===================================================================================
    /* escucharCambios() es una subscripcion a un observable que se dispara en el servicio elecciones
    cuando cambia algún valor en la base de datos */
    //this.escucharCambios();

    this.inicializarModelo();
    /* espacios es una propiedad de tipo array para usar en la vista para llenar el select que muestra
    los distintos espacios politicos. EspaciosPoliticos es un enum*/
    for (let item in EspaciosPoliticos) {
      if (isNaN(Number(item))) {
        this.espacios.push({ text: item, value: EspaciosPoliticos[item] });
      }
    }

    const osm1 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.streets'
    });

    const openmap = L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
      attribution: 'terms and feedback'
    });

    const osm2 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20 });

    const googleMaps = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      detectRetina: true
    });

    const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      detectRetina: true
    });

    //let urlBing2 ="http://ecn.t3.tiles.virtualearth.net/tiles/a{q}.jpeg?g=0&amp;dir=dir_n&username=''";         
    //let urlBing ="http://ecn.t3.tiles.virtualearth.net/tiles/a{q}.jpeg?g=1";
    //const bing = L.tileLayer(urlBing2);

    const esriSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 22 });

    const esriTransportes = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}');

    miMapa = L.map('map', {
      contextmenu: true,
      contextmenuWidth: 180,
      contextmenuItems: [
        {
          text: 'Ver las coordenadas',
          callback: this.verCoordenadas,
          icon: 'assets/images/coordenadas.png'
        }, {
          text: 'Centrar aqui',
          callback: this.centrarMapa,
          icon: 'assets/images/banderita.png'
        }, '-',
        {
          text: 'Acercar',
          callback: this.acercar,
          icon: 'assets/images/zoom-in.png'
        }, {
          text: 'Alejar',
          callback: this.alejar,
          icon: 'assets/images/zoom-out.png'
        }],
      center: [-34.921136, -57.954712],
      zoom: 8,
      zoomControl: false,
      maxZoom: 20
    }).addLayer(osm2);
    miMapa.createPane('circuitos');
    miMapa.getPane('circuitos').style.zIndex = 370;
    miMapa.createPane('colegios');
    miMapa.getPane('colegios').style.zIndex = 650;
    miMapa.createPane('partidos');
    miMapa.getPane('partidos').style.zIndex = 360;

    L.control.scale().addTo(miMapa);
    L.control.zoom({
      position: 'bottomright'
    }).addTo(miMapa);
    const baseMaps = {
      /*"Google Hibrido": googleHibrido,
      "Google Callejero": googleCallejero,
      "Google Fisico": googleTerrain,
      "Google Satelital": googleSatelite, */
      "Open Street Map": osm2,
      "Mapbox": osm1,
      "Google callejero ": googleMaps,
      "Google hibrido": googleHybrid,
      //"Bing": bing,
      "ArcGis OnLine": openmap,
      "Esri sat": esriSat,
      "Esri transportes": esriTransportes
    };
    let overlayMaps = {
      //"Capa Cursos": capaCursos
      //"Industrias cuenca Riachuelo": layerJson,
      //"Centros y Organizaciones Sociales": layerJsonCtos,
      //"Centros educativos Pcia.Bs.As.":  layerEducacionJson,
      //"Escuelas": layerEscuelasJson,
      //"FFCC (Ign, cortesia @FerroviarioK)": layerFFCC
      //"FFCC versi�n @FerroviarioK": layerFFCCFerroviariok,
      //"FFCC marcadores": layerFFCCFerroviariokMarcadores
      //"Centros educativos Pcia. Bs.As.": layerJsonEdu
    };

    controlLayers = L.control.layers(baseMaps, overlayMaps, {position: 'topleft'}).addTo(miMapa);
    
    sessionStorage.clear();
    this.leerDatos();
    //console.log(`SessionStorage despues de leer los datos: ${sessionStorage.getItem('municipios')}`);

    /*let marcador = L.marker([ -34.921136, -57.954712 ], {
      icon: L.icon({
        iconSize: [ 40, 31 ],
        iconAnchor: [ 19, 31 ],
        iconUrl: 'assets/images/marker-green.png'
        // shadowUrl: 'assets/images/marcador01.png'
      })
    }).addTo(miMapa);*/
    // miMapa.on('click', this.onMapClick)

  }

}//<-------------------------ojo, fin de la clase principal --------------------
