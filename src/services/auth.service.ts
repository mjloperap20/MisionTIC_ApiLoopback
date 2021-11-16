import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {config} from '../config/config';
import {Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
const jwt = require('jsonwebtoken');

// Nuevas librerias
const generator = require("password-generator");
const cryptoJS = require("crypto-js");

@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {
  constructor(@repository(UsuarioRepository)
  public usuarioRepository: UsuarioRepository) { }

  //Generacion de claves
  GenerarClave() {
    let clave = generator(8, false);
    return clave;
  }

  //Cifrado de la clave anteriormente generada
  CifrarClave(clave: String) {
    let claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;
  }

  //Generación del token JWT
  GenerarTokenJWT(usuario: Usuario) {
    let token = jwt.sign({
      data: {
        id: usuario.id,
        correo: usuario.correo,
        nombre: usuario.nombre + " " + usuario.apellidos
      }
    }, config.claveJWT)

    return token
  }

  //Validación del token
  validarTokenJWT(token: string) {
    try {
      let datos = jwt.verify(token, config.claveJWT);
      return datos;
    } catch (error) {
      return false;
    }
  }

  //Autenticacion, validamos que la constraseña y usuario ingresado si esten registrados
  IdentificarPersona(correo: string, password: string) {
    try {
      let p = this.usuarioRepository.findOne({where: {correo: correo, password: password}})
      if (p) {
        return p;
      }
      return false;
    } catch {
      return false;
    }
  }


}
