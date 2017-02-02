import { Service, Inject } from 'typedi';
import { Validator, ValidationError } from 'class-validator';

@Service()
export abstract class RootDTO {
  @Inject()
  protected validator: Validator;

  constructor() {}

  validate(): Promise<ValidationError[]> {
    return this.validator.validate(this);
  }

  toString() {
    return JSON.stringify(this, null, 4);
  }
}
