import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentReference
} from '@angular/fire/firestore';
import { Paso2019edit } from '../modelos/paso2019edit';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EleccionesService {
  
  municipiosCollection: AngularFirestoreCollection<Paso2019edit>;
  municipios: Observable<Paso2019edit[]>
  municipioDoc: AngularFirestoreDocument<Paso2019edit>;
  private laColeccionPaso = 'provinciaba';
  private laColeccionGenerales = 'provinciaGeneral';
  private coleccionProvincias = 'provincias';


  constructor(public afs: AngularFirestore) {
    //this.municipios = afs.collection('provinciaba').valueChanges();//array con los municipios que recuperamos de firebase
  }

  /*saveMunicipio guarda un documento, o sea los datos de un municipio. Estos datos vienen
     en un objeto "datosPaso2019" que es del tipo de la interface Paso2019. Es una promesa
     por lo tanto al return hay que esperarlo con un "then" en la clase.*/
  saveMunicipio(datosPaso2019: Paso2019edit): Promise<DocumentReference> {
    return this.afs.collection(this.laColeccionPaso).add(datosPaso2019);
  }
  saveMunicipioGenerales(datosPaso2019: Paso2019edit): Promise<DocumentReference> {
    return this.afs.collection(this.laColeccionGenerales).add(datosPaso2019);
  }

  /* saveGeoJson(jsonPcia: any):Promise<any>{
    return this.afs.collection(this.coleccionProvincias).add(jsonPcia);
  } */

  getMunicipios() {
    return this.municipios;
  }

  getMunicipiosPaso(): Observable<firebase.firestore.QuerySnapshot> {
    return this.afs.collection(this.laColeccionPaso, ref => ref.orderBy('idMuni', 'desc')).get();
  }

  getMunicipiosGenerales(): Observable<firebase.firestore.QuerySnapshot> {
    return this.afs.collection(this.laColeccionGenerales, ref => ref.orderBy('idMuni', 'desc')).get();
  }

  editMunicipios(idMuni: string, obj: Object): Promise<void> {
    return this.afs.collection(this.laColeccionPaso).doc(idMuni).update(obj);
  }

  editMunicipiosGenerales(idMuni: string, obj: Object): Promise<void> {
    return this.afs.collection(this.laColeccionGenerales).doc(idMuni).update(obj);
  }
}
