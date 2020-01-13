export interface IAltura {
    unidad: string;
    valor: string;
}
export interface ICalle {
    categoria: string;
    id: string;
    nombre: string;
}
export interface ICalleCruce1 {
    categoria: string;
    id: string;
    nombre: string;
}
export interface ICalleCruce2 {
    categoria: string;
    id: string;
    nombre: string;
}
export interface IDepartamento {
    id: string;
    nombre: string;
}
export interface INomenclatura {
    nomenclatura: string;
}
export interface IPiso {
    piso: string;
}
export interface IProvincia {
    id: string;
    nombre: string;
}
export interface IUbicacion {
    lat: number;
    lon: number;
}

export interface IGeoloca {
    cantidad: number;
    direcciones: [
        {[key: string]: IAltura},
        {[key: string]: ICalle},
        {[key: string]: ICalleCruce1},
        {[key: string]: ICalleCruce2},
        {[key: string]: IDepartamento},
        {[key: string]: INomenclatura},
        {[key: string]: IPiso},
        {[key: string]: IProvincia},
        {[key: string]: IUbicacion}
    ];
    inicio: number;
    total: number;
}

