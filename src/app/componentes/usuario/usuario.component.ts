import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuario = "Anónimo";
  //verFormu : boolean=false;

  constructor() { }

  ngOnInit() {
  }

  // conectarse(){
  //   this.verFormu = true;
  // }
  // ocultarFormulario(){
  //   this.verFormu= false;
  // }
  onSubmitLogin(){
    console.log("Nada por ahora...");
  }
}
