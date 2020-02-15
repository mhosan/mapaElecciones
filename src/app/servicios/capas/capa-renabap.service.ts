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
        <div style="margin-top: 5px;">
          <h5>Info</h5>
          <ul class="list-group" style="height: 8rem; overflow:auto;">
            <li class="list-group-item"><b>Provincia</b>: ${feature.properties.provincia}</li>
            <li class="list-group-item"><b>Departamento</b>: ${feature.properties.departamen}</li>
            <li class="list-group-item"><b>Localidad</b>: ${feature.properties.localidad}</li>
            <li class="list-group-item"><b>Municipio</b>: ${feature.properties.municipio2018}</li>
            <li class="list-group-item"><b>Nombre barrio</b>: ${feature.properties.nombre_bar}</li>
            <li class="list-group-item"><b>Familias</b>: ${feature.properties.cantidad_f}</li>
            <li class="list-group-item"><b>Creación</b>: ${feature.properties.creacionBarrio2018}</li>
            <li class="list-group-item"><b>Superficie</b>: ${feature.properties.superficie_m2_2018} m2</li>
            <li class="list-group-item"><b>Clasificación</b>: ${feature.properties.clasificacionBarrio2018} </li>
            <li class="list-group-item text-justify"><b>Situación dominial</b>: ${feature.properties.situacionDominial2018} </li>
            <li class="list-group-item text-justify"><b>Tipo tierra</b>: ${feature.properties.tipoTierra2018} </li>
            <li class="list-group-item text-justify"><b>Electricidad</b>: ${feature.properties.electricidad2018} </li>
            <li class="list-group-item text-justify"><b>Cloacas</b>: ${feature.properties.cloacas2018} </li>
            <li class="list-group-item text-justify"><b>Agua</b>: ${feature.properties.agua2018} </li>
            <li class="list-group-item text-justify"><b>Cocina</b>: ${feature.properties.cocina2018} </li>
            <li class="list-group-item text-justify"><b>Calefacción</b>: ${feature.properties.calefaccion2018} </li>
            <li class="list-group-item text-justify"><b>Precariedad</b>: ${feature.properties.precariedad2019} </li>
          </ul>
          <br>
          <span class="text-justify" style="margin-top:5px; font-size:12px; font-style: italic;">
          <b>Fuente:</b><br>
            <ul> 
              <li>ReNaBap (https://www.argentina.gob.ar/barriospopulares). Ultima actualización: 9 de nov. de 2018</li>
              <li>TECHO (http://datos.techo.org/dataset)</li>
            </ul>
          </span>
        </div>
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
