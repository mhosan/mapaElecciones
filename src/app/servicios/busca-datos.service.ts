import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscaDatosService {
/*=================================================================== 
  Esta clase busca datos desde la web, en alguna API
=====================================================================*/

  constructor(private http: HttpClient) { }

/*--------------------------------------------------------------------- 
  Metodo que trae datos totales a nivel mundial, del dia de la fecha
-----------------------------------------------------------------------*/
getDatosCoronaTotales(): Observable<any> {
    let elJsonCorona: any;
    let laUrl = 'https://coronavirus-19-api.herokuapp.com/all';
    elJsonCorona = this.http.get<any>(laUrl);
    return elJsonCorona;
  }

/*--------------------------------------------------------------------- 
  Metodo que trae datos totales del dia de la fecha, por pais
-----------------------------------------------------------------------*/
getDatosCoronaPaises(paisBuscar:string): Observable<any> {
    let elJsonCorona: any;
    let laUrl = `https://coronavirus-19-api.herokuapp.com/countries/${paisBuscar}`;
    //console.log(`la url quedó: ${laUrl}`);
    elJsonCorona = this.http.get<any>(laUrl);
    return elJsonCorona;
  }

/*--------------------------------------------------------------------- 
  Metodo que trae datos totales del dia de la fecha, de todos los paises
-----------------------------------------------------------------------*/
getDatosCoronaPaisesTodos(): Observable<any> {
    let elJsonCorona: any;
    let laUrl = `https://coronavirus-19-api.herokuapp.com/countries`;
    //console.log(`la url quedó: ${laUrl}`);
    elJsonCorona = this.http.get<any>(laUrl);
    return elJsonCorona;
  }

/*--------------------------------------------------------------------- 
  Metodo que trae series de tiempo del coronavirus de todos los paises
-----------------------------------------------------------------------*/
getDatosSeriesTiempo(): Observable<any> {
  let elJsonCorona: any;
  let laUrl = 'https://pomber.github.io/covid19/timeseries.json';
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
