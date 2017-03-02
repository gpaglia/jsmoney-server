/**
 * Passport startup file
 */
import * as logger from "winston";

import * as passport from "passport";
import {
  IVerifyOptions as ILocalVerifyOptions,
  Strategy as LocalStrategy
} from "passport-local";

import {
  ExtractJwt,
  StrategyOptions as JwtStrategyOptions
} from "passport-jwt";

import * as jwtp from "passport-jwt";

import * as jwt from "jsonwebtoken";

import { Container } from "typedi";

import {
  UserServiceComponent,
  ValidationInfo,
  ValidationStatus
} from "../services";

import { Config } from "../_singletons/Config";

import {
  BEARER,
  CredentialsObject,
  UserObject
} from "jsmoney-server-api";

const config = Container.get<Config>(Config);

const expiration: string = config.data().passport.expiration;

const jwtParams: JwtStrategyOptions = {
  secretOrKey: config.data().passport.secret, // config.passport.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  algorithms: ["HS256"]
};

export function makeToken(user: UserObject): string {
  const x = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    jwtParams.secretOrKey,
    {
      expiresIn: expiration,
      algorithm: "HS256"
    }
  );

  const y = jwt.verify(x, jwtParams.secretOrKey);

  logger.info("[SERVER] u = " + JSON.stringify(user));
  logger.info("[SERVER] x = " + x);
  logger.info("[SERVER] y = " + JSON.stringify(y, null, 4));

  return BEARER + " " + x;
}

export function passportConfig(): void {
  logger.info("[SERVER] Starting passport configuration");

  const userServiceComponent: UserServiceComponent = Container.get<UserServiceComponent>(UserServiceComponent);

  // tslint:disable-next-line:no-any
  const validateUsernamePassword = (uname: string, pwd: string, done: (error: any, user?: any, options?: ILocalVerifyOptions) => void): void => {
    userServiceComponent.validateUserByCredentials(new CredentialsObject(uname, pwd))
      .then((info: ValidationInfo) => {
        if (info.status === ValidationStatus.Validated) {
          const token: string = makeToken(info.user);
          done(null, { user: info.user, token });
        } else if (info.status === ValidationStatus.NoUser) {
          done(null, false, { message: "Unknown user" });
        } else if (info.status === ValidationStatus.WrongPassword) {
          done(null, false, { message: "Incorrect password" });
        }
      })
      .catch((err) => {
        done(err);
      });
  };

  // tslint:disable-next-line:no-any
  const validateToken = (payload: any, done: (error: any, user?: any, info?: any) => void): void => {
    logger.info("[SERVER] In token Strategy: Got payload " + JSON.stringify(payload));
    if (payload && payload.id && payload.username && payload.role) {
      const id: string = payload.id;
      userServiceComponent.getOneUserById(id)
        .then((user: UserObject) => {
          logger.info("[SERVER] In Strategy: Got user by id" + JSON.stringify(user));
          done(null, user);
        })
        .catch((err) => {
          logger.info("[SERVER] Error in findoneuser, " + JSON.stringify(err));
          done(err);
        });
    } else {
      logger.info("[SERVER] other error");
      done("Something got wrong in validateToken");
    }

  };

  passport.use("local", new LocalStrategy(validateUsernamePassword));
  passport.use("token", new jwtp.Strategy(jwtParams, validateToken));

}
