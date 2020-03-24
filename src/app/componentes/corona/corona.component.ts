import { Component, OnInit } from '@angular/core';
import { BuscaDatosService } from './../../servicios/busca-datos.service';
import { CoronaService } from './../../servicios/corona.service';
import { Corona } from '../../modelos/corona';

@Component({
  selector: 'app-corona',
  templateUrl: './corona.component.html',
  styleUrls: ['./corona.component.css']
})
export class CoronaComponent implements OnInit {
  public objetoCorona: Corona = {};
  public objetoCoronaArgentina: Corona = {};
  public arrayDatosCorona: Corona[] = [];

  constructor(private servicioDatos: BuscaDatosService, private servicioCorona: CoronaService) { }

  ngOnInit(): void {
    this.mostrarDatos(false);
    this.mostrarDatosArgentina(false);
  }
  mostrarDatos(alerta: boolean) {
    this.servicioDatos.getDatosCoronaTotales()
      .subscribe(respuesta => {
        //console.log('Casos: ', respuesta.cases, ' Fallecimientos: ', respuesta.deaths, ' Recuperados: ', respuesta.recovered);
        this.objetoCorona.casosTot = respuesta.cases;
        this.objetoCorona.fallecidosTot = respuesta.deaths;
        this.objetoCorona.recuperados = respuesta.recovered;
        this.objetoCorona.fecha = new Date();
        if (alerta) {
          console.log('Actualización finalizada');
        }
      });
    if (alerta) {
      //console.log('Actualizando');
    }

    return false;
  }

  /*===================================================================
  Trae los datos de todos los paises. Aqui se filtra para dejar solo
  los datos de Argentina.
  =====================================================================*/
  mostrarDatosArgentina(alerta: boolean) {
    this.servicioDatos.getDatosCoronaPaises()
      .subscribe(respuesta => {
        //console.log(respuesta);
        respuesta.forEach(element => {
          if (element.country == "Argentina") {
            //console.log(element);
            this.objetoCoronaArgentina.fallecidosTot = element.deaths;
            this.objetoCoronaArgentina.fallecidosHoy = element.todayDeaths;
            this.objetoCoronaArgentina.recuperados = element.recovered;
            this.objetoCoronaArgentina.casosTot = element.cases;
            this.objetoCoronaArgentina.casosHoy = element.todayCases;
            this.objetoCoronaArgentina.activos = element.active;
            this.objetoCoronaArgentina.criticos = element.critical;
            this.objetoCoronaArgentina.casosPorMillon = element.casesPerOneMillion;
            this.objetoCoronaArgentina.fecha = new Date();
          }
        })
      });
    if (alerta) {
      //alert('Actualizando');
    }
    return false;
  }
  

  guardarDatos() {
    this.objetoCorona.pais = "global";
    this.objetoCoronaArgentina.pais = "Argentina";
    this.servicioCorona.saveDatosCorona(this.objetoCorona)
      .then(response => {
        console.log("Los datos se guardaron ok!.");
        console.log("Ahora guardando los datos locales...")
        this.servicioCorona.saveDatosCorona(this.objetoCoronaArgentina)
          .then(response => {
            console.log("Los datos locales se guardaron ok.");
          })
          .catch(err => console.error('Hubo un error en el save de los datos locales:', err));
      })
      .catch(err => console.error('Hubo un error en el save de los datos globales:', err));
    return false
  }
  
  buscarDatos() {
    let datosCoronaLeido: Corona;
    this.servicioCorona.getCoronaTodos('Argentina')
      .subscribe(response => {
        response.docs.forEach(value =>{
          const data = value.data();
          datosCoronaLeido ={
            pais : data.pais,
            casosTot : data.casosTot,
            casosHoy : data.casosHoy,
            fallecidosTot : data.fallecidosTot,
            fallecidosHoy : data.fallecidosHoy,
            activos : data.activos,
            recuperados : data.recuperados,
            fecha : data.fecha,
            criticos : data.criticos,
            casosPorMillon : data.casosPorMillon,
          };
          this.arrayDatosCorona.push(datosCoronaLeido);
        });
      });
    console.log(this.arrayDatosCorona);
    return false
  }
  prueba(){
    this.servicioDatos.getDatosPrueba()
    .subscribe(respuesta => {
      console.log(respuesta);
    });
  return false;
  }
}
