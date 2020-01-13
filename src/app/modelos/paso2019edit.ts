import { EspaciosPoliticos } from "./espacios-politicos.enum";

export interface Paso2019edit {
    id? : string;
    idMuni? : string;
    nombrePartido? : string;
    _2015intendente? : string;
    _2015espacio? : string;
    paso2019porcSegundo? : number;
    paso2019porcPrimero? : number;
    paso2019candidatoPrimero?: string;
    paso2019candidatoSegundo?: string;
    paso2019porcVotosPositivos?: number;
    paso2019porcVotosEnBlanco?: number;
    paso2019votosEnBlanco?: number;
    paso2019votosPositivos?: number;
    paso2019espacioPrimero?: EspaciosPoliticos;
    paso2019espacioSegundo?: EspaciosPoliticos;
    paso2019recuperado?: boolean;
    paso2019obs?: string;
}
