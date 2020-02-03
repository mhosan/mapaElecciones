import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MapaComponent } from './mapa/mapa.component'
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { UsaApiComponent } from './geoloca/usa-api-secr-modern/usa-api.component';
import { WebappComponent } from './webapp/webapp.component';
import { GeolocaApiSecrModernService } from './servicios/geoloca-api-secr-modern.service';
import { UsaApiLocationIqComponent } from './geoloca/usa-api-location-iq/usa-api-location-iq.component';
import { EleccionesService } from './servicios/elecciones.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from './../environments/environment';
import { PartidosFormComponent } from './mapa/partidos-form/partidos-form.component';

@NgModule({
  declarations: [
    AppComponent,
    MapaComponent,
    UsaApiComponent,
    WebappComponent,
    UsaApiLocationIqComponent,
    PartidosFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AngularFontAwesomeModule,
    NgbModule,
    AngularFireModule,
    AngularFireModule.initializeApp(environment.firebase, 'argengis-mh'), //el nombre de la aplicacion que va como 
                                                                          //segundo parámetro, es el nombre en firebase
                                                                          //arriba a la izquierda de la pantalla celeste,
                                                                          //el que tiene un desplegable al lado.
    AngularFirestoreModule      
  ],
  providers: [
    GeolocaApiSecrModernService,
    EleccionesService
  ],
  bootstrap: [AppComponent],
  entryComponents: [PartidosFormComponent]
})

export class AppModule { }