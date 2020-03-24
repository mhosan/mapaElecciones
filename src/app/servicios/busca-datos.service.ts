import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscaDatosService {
/*=================================================================== 
  Esta clase busca datos desde la web, en alguna API, pero solo
  hace eso: buscar datos.
=====================================================================*/

  constructor(private http: HttpClient) { }

  getDatosCoronaTotales(): Observable<any> {
    let elJsonCorona: any;
    let laUrl = 'https://coronavirus-19-api.herokuapp.com/all';
    elJsonCorona = this.http.get<any>(laUrl);
    return elJsonCorona;
  }

  getDatosCoronaPaises(): Observable<any> {
    let elJsonCorona: any;
    let laUrl = 'https://coronavirus-19-api.herokuapp.com/countries';
    elJsonCorona = this.http.get<any>(laUrl);
    return elJsonCorona;
  }

  getDatosPrueba(): Observable<any> {
    let elJson: any;
    let laUrl = 'https://thevirustracker.com/free-api?countryTotal=AR';
    elJson = this.http.get<any>(laUrl);
    return elJson;
  }

}
