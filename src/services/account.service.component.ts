  import * as logger from 'winston';

import { Service } from 'typedi';
import { Connection, EntityManager } from 'typeorm';

import { UserEntity } from '../entities/user.entity.model';
import { DatasetEntity } from '../entities/dataset.entity.model';
import { DatasetDTO } from '../dto/dataset.dto';

import { AbstractServiceComponent, ObjectLiteral } from './abstract.service.component';

import { ServiceError } from './service.error';

export class AccountServiceComponent extends AbstractServiceComponent {

  constructor() {
    super();
  }

  private getDatasetEntityByConditions(conditions: ObjectLiteral): Promise<DatasetEntity> {
    logger.info('[SERVER] getDatasetEntityByConditions ' + JSON.stringify(conditions));

    return this.connection
      .getRepository<DatasetEntity>(DatasetEntity)
      .findOne(conditions)
      .catch(error => {
        logger.error('[SERVER] ' + JSON.stringify(error));
        console.log('Error1');
        throw new ServiceError('Error in getDatasetEntityByConditions', error);
      });
  }

  private getDatasetDTOByConditions(conditions: ObjectLiteral): Promise<DatasetDTO> {
    logger.info('[SERVER] getDatasetDTOByConditions ' + JSON.stringify(conditions));

    return this.getDatasetEntityByConditions(conditions)
            .then(entity => {
              console.log('=== 2');
              return this.datasetEntityToDTO(entity)
            });
  }

  getDatasetDTOById(did: string) {
    logger.info('[SERVER] getDatasetDTOById ' + did);
    return this.getDatasetDTOByConditions({'_id': did});
  }

  getDatasetEntityById(did: string) {
    return this.getDatasetEntityByConditions({'_id': did});
  }

  getDatasetDTOsForUser(uid: string): Promise<DatasetDTO[]> {
    return this.getDatasetEntitiesForUser(uid)
      .then(entities => {
        return this.datasetEntityArrayToDTOArray(entities);
      })
  }

  getDatasetEntitiesForUser(uid: string): Promise<DatasetEntity[]> {
    return this.connection
      .getRepository<DatasetEntity>(DatasetEntity)
      .find({
        alias: 'dataset',
        innerJoin: {
          'user': 'dataset.user'
        },
        where: 'user._id = "' + uid + '"'
      })
      .catch(error => {
        throw new ServiceError('Error in getDatasetEntitiesForUser');
      });
  }

  createDatasetForUser(ddto: DatasetDTO, user: UserEntity): Promise<DatasetDTO> {
    return this.validator.validate(ddto)
    .then(errors => {
      if (errors.length > 0) {
        logger.error('[SERVER] Got validation errors on DatasetDTO... ' + JSON.stringify(errors, null, 4));
        throw new ServiceError('Validation of DatasetDTO failed', errors);
      } else {
        let entity = new DatasetEntity(ddto, user);
        logger.debug('[SERVER] Dataset entity new is ' + JSON.stringify(entity, null, 4));
        return this.connection
          .getRepository<DatasetEntity>(DatasetEntity)
          .persist(entity)
          .catch(error => {
            throw new ServiceError('Error in createDatasetForUser', error);
          })
          .then(newentity => {
            return this.datasetEntityToDTO(newentity);
          })
      }
    });
  }

  private datasetEntityToDTO(de: DatasetEntity): Promise<DatasetDTO> {
    if (de == null) {
      return undefined;
    }
    console.log('^^^^ ' + JSON.stringify(de));
    let ddto: DatasetDTO = new DatasetDTO(de);
    logger.debug('[SERVER] DatasetEntity is ' + JSON.stringify(de, null, 4));
    logger.debug('[SERVER] DatasetDTO is ' + JSON.stringify(ddto, null, 4));
    return this.validator.validate(ddto)
    .then(errors => {
      if (errors.length > 0) {
        logger.error('[SERVER] Got validation errors on DatasetDTO... ' + JSON.stringify(errors, null, 4));
        throw new ServiceError('Validation of DatasetDTO failed', errors);
      } else {
        return ddto;
      }
    });
  }

  private datasetEntityArrayToDTOArray(dearray: DatasetEntity[]): Promise<DatasetDTO[]> {
    let tmp: Promise<DatasetDTO>[] = [];
    for (let de of dearray) {
      tmp.push(this.datasetEntityToDTO(de));
    }
    return Promise.all(tmp);
  }

}
