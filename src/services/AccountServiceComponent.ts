/**
 * AccountServiceComponent
 */
// import * as logger from "winston";

import {
  Inject,
  Service
} from "typedi";

import {
  DatasetEntity,
  UserEntity
} from "../entities";

import {
  DatasetObject
} from "jsmoney-server-api";

import {
  AbstractServiceComponent,
  IObjectLiteral,
  ServiceError,
  UserServiceComponent
} from ".";

@Service()
export class AccountServiceComponent extends AbstractServiceComponent {

  @Inject((_typ) => UserServiceComponent)
  private userService: UserServiceComponent;

  constructor() {
    super();
  }

  public getOneDatasetEntityById(did: string): Promise<DatasetEntity> {
    return this.getOneDatasetEntityByConditions({ id: did });
  }

  public getOneDatasetById(did: string): Promise<DatasetObject> {
    return this.getOneDatasetByConditions({ id: did });
  }

    public getOneDatasetEntityByIdAndUserId(did: string, uid: string): Promise<DatasetEntity> {
    return this.getOneDatasetEntityByUserIdAndConditions(uid, { id: did });
  }

  public getOneDatasetByIdAndUserId(did: string, uid: string): Promise<DatasetObject> {
    return this.getOneDatasetByUserIdAndConditions(uid, {id: did});
  }

  public getAllDatasetsByUserId(uid: string): Promise<DatasetObject[]> {
    return this.connection
      .getRepository<DatasetEntity>(DatasetEntity)
      .find({
        alias: "dataset",
        innerJoin: {
          user: "dataset.user"
        },
        where: "user._id = '" + uid + "'"
      })
      .then((dsa: DatasetEntity[]) => {
        return dsa.map((ds: DatasetEntity) => {
          return DatasetObject.make(ds);
        });
      })
      .catch((error) => {
        throw new ServiceError("Error in getDatasetEntitiesForUser", error);
      });
  }

  public createOneDataset(obj: DatasetObject): Promise<DatasetObject> {
    if (obj.isValid()) {
      this.userService.getOneUserEntityByConditions({id: obj.userRef.id})
        .then((ue: UserEntity) => {
          const entity = new DatasetEntity(obj, ue);
          return this.connection
            .getRepository<DatasetEntity>(DatasetEntity)
            .persist(entity)
            .then((newe: DatasetEntity) => {
              return DatasetObject.make(newe);
            })
            .catch((error) => {
              throw new ServiceError("Error in createDatasetForUser", error);
            });
        });
    } else {
      return Promise.reject(new ServiceError("Validation of DatasetObject failed", obj));
    }
  }

  // Private methods
  private getOneDatasetEntityByUserIdAndConditions(userId: string, conditions: IObjectLiteral): Promise<DatasetEntity> {
    const dsalias = "dataset";
    const ualias = "user";
    return this.connection
      .getRepository<DatasetEntity>(DatasetEntity)
      .createQueryBuilder("dataset")
      .innerJoin("dataset.user", "user")
      .where(this.createSelectionParam(dsalias, conditions))
      .andWhere(this.createSelectionParam(ualias, {id: ":uid"}))
      .setParameter("uid", userId)
      .getManyAndCount()
      .then((t: [DatasetEntity[], number]) => {
        if (t[1] === 0) {
          return [] as DatasetEntity[];
        } else if (t[1] === 1) {
          return t[0][0];
        } else {
          throw new ServiceError("Multiple datasets returned by query");
        }
      })
      .catch((error) => {
        throw new ServiceError("Error in getDatasetEntityByConditions", error);
      });
  }

  private getOneDatasetByUserIdAndConditions(userId: string, conditions: IObjectLiteral): Promise<DatasetObject> {

    return this.getOneDatasetEntityByUserIdAndConditions(userId, conditions).then((de: DatasetEntity) => {
      return DatasetObject.make(de);
    });
  }

  private getOneDatasetEntityByConditions(conditions: IObjectLiteral): Promise<DatasetEntity> {

    return this.connection
      .getRepository<DatasetEntity>(DatasetEntity)
      .findOne(conditions)
      .catch((error) => {
        throw new ServiceError("Error in getDatasetEntityByConditions", error);
      });
  }

  private getOneDatasetByConditions(conditions: IObjectLiteral): Promise<DatasetObject> {

    return this.getOneDatasetEntityByConditions(conditions).then((de: DatasetEntity) => {
      return DatasetObject.make(de);
    });
  }
}
