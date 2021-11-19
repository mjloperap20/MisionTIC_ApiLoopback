import {authenticate} from '@loopback/authentication';
import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  Ruta, Servicio
} from '../models';
import {ServicioRepository} from '../repositories';

@authenticate("admin")
export class ServicioRutaController {
  constructor(
    @repository(ServicioRepository)
    public servicioRepository: ServicioRepository,
  ) { }

  @get('/servicios/{id}/ruta', {
    responses: {
      '200': {
        description: 'Ruta belonging to Servicio',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Ruta)},
          },
        },
      },
    },
  })
  async getRuta(
    @param.path.string('id') id: typeof Servicio.prototype.id,
  ): Promise<Ruta> {
    return this.servicioRepository.rutaFk(id);
  }
}
