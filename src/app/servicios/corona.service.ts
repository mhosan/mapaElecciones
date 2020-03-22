import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentReference
} from '@angular/fire/firestore';
import { Corona } from '../modelos/corona';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})

export class CoronaService {
  private coleccionCorona = 'corona';
  constructor(public afs: AngularFirestore) { }

  /*saveMunicipio guarda un documento, o sea los datos de un municipio. Estos datos vienen
     en un objeto "datosPaso2019" que es del tipo de la interface Paso2019. Es una promesa
     por lo tanto al return hay que esperarlo con un "then" en la clase.*/
  saveDatosCorona(datosCorona: Corona): Promise<DocumentReference> {
    return this.afs.collection(this.coleccionCorona).add(datosCorona);
  }

}
