/*
Utilizar la primer definicion de la constante "firebase" para usar la 
base de datos del proyecto viejo (el que tenia como nombre de dominio
https://argengis-60763.web.app).

La segunda definicion de la constante "firebase" es la que corresponde
al proyecto nuevo (el que tiene como nombre de dominio 
https://argengis.web.app)

*/
// export const environment = {
//   production: true,
//   firebase : {
//     apiKey: "AIzaSyBBLjXy4C9SWDNm2XmczSppIh3xL6ZSt9I",
//     authDomain: "argengis-60763.firebaseapp.com",
//     databaseURL: "https://argengis-60763.firebaseio.com",
//     projectId: "argengis-60763",
//     storageBucket: "argengis-60763.appspot.com",
//     messagingSenderId: "944972773597",
//     appId: "1:944972773597:web:edc500e7cc508693"
//   }
// };

export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyCmZJPmgSH_bZ1D8GeM89RqkzgLmLUW-c4",
    authDomain: "argengis.firebaseapp.com",
    databaseURL: "https://argengis.firebaseio.com",         
    projectId: "argengis",                                  
    storageBucket: "argengis.appspot.com",                  
    messagingSenderId: "389370963295",                      
    appId: "1:389370963295:web:dc96461a3d22a7787e02ea",
    measurementId: "G-5G6F9WMZZD"
  }
};
