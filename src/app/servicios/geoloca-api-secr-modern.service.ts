import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IGeoloca } from '../modelos/isecr-modern';

@Injectable({
  providedIn: 'root'
})
export class GeolocaApiSecrModernService {

  constructor(private http: HttpClient) { }

  getData(clave: string) {
    // const url: string = 'https://apis.datos.gob.ar/georef/api/direcciones?direccion=' + clave + '&provincia=Buenos Aires';
    const url: string = 'https://apis.datos.gob.ar/georef/api/direcciones?direccion=' + clave;
    console.log('La url quedó: ', url);
    return this.http.get<IGeoloca>(url);
  }

}
