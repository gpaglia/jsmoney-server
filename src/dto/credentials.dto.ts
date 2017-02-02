import { IsNotEmpty, Matches, MaxLength } from 'class-validator';
import { RootDTO } from './root.dto';

import { ICredentialsObject } from 'jsmoney-server-api';


export class CredentialsDTO extends RootDTO implements ICredentialsObject {
  @IsNotEmpty()
  @Matches(/[a-zA-Z][a-zA-Z0-9_]+/)
  @MaxLength(32)
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;

  constructor(username: string, password: string) {
    super();
    this.username = username;
    this.password = password;
  }

}
