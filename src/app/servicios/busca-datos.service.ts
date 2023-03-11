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
  Api que trae datos totales a nivel mundial sobre covid.
  https://disease.sh/docs/#/COVID-19%3A%20Worldometers/get_v3_covid_19_all este es el swagger de la api
  https://disease.sh/v3/covid-19/all este es un json resumen:
  object		{21}
		updated	:	16785513175122023-03-11T16:15:17.512Z
		cases	:	681459984                                 <---casos totales
		todayCases	:	50684
		deaths	:	6811623                                 <---fallecidos totales
		todayDeaths	:	264
		recovered	:	654344941                             <---recuperados totales
		todayRecovered	:	64038
		active	:	20303420
		critical	:	40315
		casesPerOneMillion	:	87425
		deathsPerOneMillion	:	873.9
		tests	:	6949522234
		testsPerOneMillion	:	874711.01
		population	:	7944935131
		oneCasePerPeople	:	0
		oneDeathPerPeople	:	0
		oneTestPerPeople	:	0
		activePerOneMillion	:	2555.52
		recoveredPerOneMillion	:	82360.01
		criticalPerOneMillion	:	5.07
		affectedCountries	:	231
-----------------------------------------------------------------------*/
getCoronaTotales(): Observable<any> {
  let elJsonCorona: any;
  let laUrl = 'https://disease.sh/v3/covid-19/all';
  elJsonCorona = this.http.get<any>(laUrl);
  return elJsonCorona;
}


/*--------------------------------------------------------------------- 
  Metodo que trae datos totales del dia de la fecha, por pais
-----------------------------------------------------------------------*/
getDatosCoronaPaises(paisBuscar:string): Observable<any> {
    let elJsonCorona: any;
    let laUrl = `https://disease.sh/v3/covid-19/countries/${paisBuscar}`;
    //console.log(`la url quedó: ${laUrl}`);
    elJsonCorona = this.http.get<any>(laUrl);
    return elJsonCorona;
  }

/*--------------------------------------------------------------------- 
  Metodo que trae datos totales del dia de la fecha, de todos los paises
-----------------------------------------------------------------------*/
getDatosCoronaPaisesTodos(): Observable<any> {
    let elJsonCorona: any;
    let laUrl = `https://disease.sh/v3/covid-19/countries`;
    //console.log(`la url quedó: ${laUrl}`);
    elJsonCorona = this.http.get<any>(laUrl);
    return elJsonCorona;
  }

/*--------------------------------------------------------------------- 
  Metodo que trae series de tiempo del coronavirus de todos los paises
  OK funciona bien pero lento
-----------------------------------------------------------------------*/
getDatosSeriesTiempo(): Observable<any> {
  let elJsonCorona: any;
  let laUrl = 'https://pomber.github.io/covid19/timeseries.json';
  elJsonCorona = this.http.get<any>(laUrl);
  return elJsonCorona;
}

/*--------------------------------------------------------------------- 
  Metodo que trae ... de Argentina
  No funca
-----------------------------------------------------------------------*/
/* getDatosPrueba(): Observable<any> {
    let elJson: any;
    let laUrl = 'https://thevirustracker.com/free-api?countryTotal=AR';
    elJson = this.http.get<any>(laUrl);
    return elJson;
  }
 */
}
