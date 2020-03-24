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
/*=====================================================================
  Esta clase maneja el acceso a la bd Firebase
=======================================================================*/
  private coleccionCorona = 'corona';
  constructor(public afs: AngularFirestore) { }

  /*saveDatosCorona guarda un documento con los datos sobre el coronavirus
    Estos datos vienen en un objeto "datosCorona" que es del tipo de la
    interface Corona. Es una promesa por lo tanto al return hay que 
    esperarlo con un "then" en el controlador.*/
  saveDatosCorona(datosCorona: Corona): Promise<DocumentReference> {
    return this.afs.collection(this.coleccionCorona).add(datosCorona);
  }

  getCoronaTodos(pais:string): Observable<firebase.firestore.QuerySnapshot> {
    //return this.db.collection<Todo>(this.todoCollectionName, ref => ref.orderBy('lastModifiedDate', 'desc')).get();
    //return this.afs.collection<Corona>(this.coleccionCorona, ref => ref.where('usuario','==', usuario).orderBy('fecha', 'desc')).get()
    return this.afs.collection<Corona>(this.coleccionCorona, ref => ref
      .where('pais','==', pais)
      .orderBy('fecha', 'desc'))
      .get();
  }
  

}
