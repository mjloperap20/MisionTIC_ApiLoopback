import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {AuthService} from '../services';

export class AdministradorStrategy implements AuthenticationStrategy {
  //Este name permite definir los diferentes roles que requiera la app: admin, reader, writer
  name: string = 'admin';

  constructor(
    @service(AuthService)
    public serviceAuth: AuthService,) {

  }

  //Error 401: Significa no autorizado
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = parseBearerToken(request);
    if (!token) {
      throw new HttpErrors[401]("No existe un token en la solicitud.")
    }

    let info = this.serviceAuth.validarTokenJWT(token);
    if (info) {
      let perfil: UserProfile = Object.assign({
        nombre: info.data.nombre
      });
      return perfil;
    } else {
      throw new HttpErrors[401]("El token es válido, pero no tiene los permisos suficientes para ejecutar esta acción.")
    }
  }
}
