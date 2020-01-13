import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeolocaApiLocationIqService {
  constructor(private http: HttpClient) { }
  
  getData(clave: string){
    const url: string = 'https://us1.locationiq.org/v1/search.php?key=7c041d46548c08&q=' + clave + '&format=json';
    return this.http.get<any>(url);
  }
}
