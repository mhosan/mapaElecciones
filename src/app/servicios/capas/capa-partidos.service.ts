import { Injectable } from '@angular/core';

declare let L;
declare let $: any;

@Injectable({
  providedIn: 'root'
})
export class CapaPartidosService {
  capaPartidos: any;

  constructor() { }

  getPartidos(elJson: any, filtro: string): any {
    this.capaPartidos = L.geoJson(elJson, {
      filter: elFiltradorDePartidos,
      style: (feature) => {
        return { color: 'rgba(255, 255, 100, 1.0)', "weight": 1.5, "opacity": 1.40 };
      },
      onEachFeature: (feature, layer) => {
        let colorBordeOriginal: string = '';
        let espesorBordeOriginal: number = 0;
        let colorRellenoOriginal: string = '';
        var popupContent = `
        <table class="table table-striped table-borderless table-sm" style="font-family: 'Arial Narrow'">
          <thead class="thead-dark">
            <tr>
              <th scope="col" class="text-center">Partido</th>
              <th scope="col" class="text-center">Superficie km2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center">${feature.properties.fna}</td>  
              <td class="text-center">${feature.properties.arl}</td>
            </tr>
          </tbody>
        </table>
      `;
        layer.bindPopup(popupContent);

        layer.on({
          mouseover: (e: any) => {
            colorBordeOriginal = e.target.options.color;
            espesorBordeOriginal = e.target.options.weight;
            colorRellenoOriginal = e.target.options.fillColor
            layer.setStyle({
              "color": "rgba(0,255,0,0.5)",
              "weight": 4,
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
              .setContent('<b>Pdo:</b>' + feature.properties.fna)
              .setLatLng(e.latlng);
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
      },
      pane: 'partidos'
    });
    function elFiltradorDePartidos(feature) {
      if (filtro != '') {
        if (feature.properties.nam === filtro) {
          return true;
        }
      } else {
        return true;
      }
    }
    return this.capaPartidos;
  }
}
