import { Injectable } from '@angular/core';

declare let L;
declare let $: any;

@Injectable({
  providedIn: 'root'
})
export class CapaEscuelasService {
  capaEscuelas: any;

  constructor() { }

  getEscuelas(elJson: any, filtro: string): any {
    var sinElMouse = {
      radius: 4,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.6
    };
    var elMouseArriba = {
      radius: 8,
      fillColor: "#ff0800",
      color: "#ff0000",
      weight: 1,
      opacity: 0.3,
      fillOpacity: 0.6
    };
    this.capaEscuelas = L.geoJson(elJson, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, sinElMouse);
      },
      filter: elFiltradorDeEscuelas,
      onEachFeature: (feature, layer) => {
        let colorBordeOriginal: string = '';
        let espesorBordeOriginal: number = 0;
        let colorRellenoOriginal: string = '';
        var popupContent = `
        <table class="table table-striped table-borderless table-sm" style="font-family: 'Arial Narrow'">
          <thead class="thead-dark">
            <tr>
              <th scope="col" class="text-center">Nombre</th>
              <th scope="col" class="text-center">Direccion</th>
              <th scope="col" class="text-center">Partido</th>
              <th scope="col" class="text-center">Tipo Organiz.</th>
              <th scope="col" class="text-center">Gestión</th>
              <th scope="col" class="text-center">Modalidad</th>
              <th scope="col" class="text-center">Nivel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center">${feature.properties.nombre}</td>  
              <td class="text-center">${feature.properties.direccion_calle} nro ${feature.properties.direccion_nro}</td>
              <td class="text-center">${feature.properties.partido}</td>
              <td class="text-center">${feature.properties.tipo_organiz}</td>
              <td class="text-center">${feature.properties.sector_gestion}</td>
              <td class="text-center">${feature.properties.modalidad}</td>
              <td class="text-center">${feature.properties.nivel}</td>
            </tr>
          </tbody>
        </table>
      `;
        layer.bindPopup(popupContent, { maxWidth: 400 });
        layer.on({
          mouseover: (e: any) => {
            colorBordeOriginal = e.target.options.color;
            espesorBordeOriginal = e.target.options.weight;
            colorRellenoOriginal = e.target.options.fillColor
            layer.setStyle(elMouseArriba);
            let laCapa = e.target;
            let miTooltip = L.tooltip({
              position: 'bottom',
              noWrap: true,
              offset: [0, -30],
              sticky: true,
              opacity: 0.8
            })
              //.setContent('<b>Pdo:</b>' + feature.properties.departamen + ', ' + '<b>Munic.:</b>' + feature.properties.cabecera + ', ' + '<b>Circuito:</b>' + feature.properties.circuito)
              .setContent('<b>Nombre:</b>' + feature.properties.nombre)
              .setLatLng(e.latlng)
            //.addTo(miMapa);
            laCapa.bindTooltip(miTooltip);
          },
          mouseout: (e: any) => {
            layer.setStyle(sinElMouse);
          }
        });
      },

    });
    function elFiltradorDeEscuelas(feature) {
      if (filtro != '') {
        if (feature.properties.partido === filtro) {
          return true;
        }
      } else {
        return true;
      }
    }
    return this.capaEscuelas;
  }
}
