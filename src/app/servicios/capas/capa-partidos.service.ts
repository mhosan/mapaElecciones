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
        return { color: 'rgba(51, 102, 0, 0.5)', "weight": 8.5, "opacity": 0.40 };
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
