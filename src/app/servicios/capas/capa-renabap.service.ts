import { Injectable } from '@angular/core';

declare let L;
declare let $: any;

@Injectable({
  providedIn: 'root'
})
export class RenabapService{
  capaRenabap: any;

  constructor() { }

  getCapaRenabap(elJson: any, filtro: string): any {
    this.capaRenabap = L.geoJson(elJson, {
      filter: elFiltradorDeRenabap,
      style: (feature) => {
        return { color: 'rgba(51, 102, 0, 1.0)', "weight": 2.5, "opacity": 1.40 };
      },
      onEachFeature: (feature, layer) => {
        let colorBordeOriginal: string = '';
        let espesorBordeOriginal: number = 0;
        let colorRellenoOriginal: string = '';
        var popupContent = `
        <table class="table table-striped table-borderless table-sm" style="font-family: 'Arial Narrow'">
          <thead class="thead-dark">
            <tr>
              <th scope="col" class="text-center">Nombre Barrio</th>
              <th scope="col" class="text-center">Cantidad de familias</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center">${feature.properties.nombre_bar}</td>  
              <td class="text-center">${feature.properties.cantidad_f}</td>
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
              .setContent('<b>Pdo:</b>' + feature.properties.departamen)
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
    function elFiltradorDeRenabap(feature) {
      if (filtro != '') {
        if (feature.properties.nam === filtro) {
          return true;
        }
      } else {
        return true;
      }
    }
    return this.capaRenabap;
  }
}
