// TODO: Should fix this "any" issue
/* eslint-disable @typescript-eslint/no-explicit-any */

import express, { Request, Response } from 'express';
import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';
import authJwt from '../middleware/authJwt';
import upload from '../middleware/upload';
import Permission from '../models/Permission';
import RessourceController from '../controllers/RessourceController';
import RoleController from '../controllers/RoleController';
import ContactController from '../controllers/ContactController';

const router = express.Router();

router.get('/', (_: Request, res: Response) => {
  res.send('HELLO WORD !!');
});

/**
 * auth routes
 */

router.post('/auth/signin', AuthController.signin as any);
router.post('/auth/check-otp', AuthController.checkOtp);
router.get('/auth/user', [authJwt.shouldBeLogged], AuthController.getCurrentUser);
router.post('/auth/logout', AuthController.logout);

// ----------

/**
 * users routes
 */

router.get(
  '/users',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.USER.READ)],
  UserController.index,
);
router.post(
  '/users',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.USER.CREATE)],
  UserController.store as any,
);
router.get(
  '/users/:id',
  [
    authJwt.shouldBeLogged,
    authJwt.shouldHavePermissionOrParamIdBeLoggedUserId(Permission.USER.READ),
  ],
  UserController.show,
);
router.put(
  '/users/:id',
  [
    authJwt.shouldBeLogged,
    authJwt.shouldHavePermissionOrParamIdBeLoggedUserId(Permission.USER.UPDATE),
  ],
  UserController.update as any,
);
router.delete(
  '/users/:id',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.USER.DELETE)],
  UserController.delete,
);

// ----------

/**
 * roles routes
 */

router.get(
  '/roles',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.READ)],
  RoleController.index,
);
router.post(
  '/roles',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.CREATE)],
  RoleController.store as any,
);
router.post(
  '/roles/:id/add-permissions',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.UPDATE)],
  RoleController.addPermissions as any,
);
router.post(
  '/roles/:id/update-permissions',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.UPDATE)],
  RoleController.updatePermissions as any,
);
router.get(
  '/roles/:id',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.READ)],
  RoleController.show,
);
router.put(
  '/roles/:id',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.UPDATE)],
  RoleController.update as any,
);
router.delete(
  '/roles/:id',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.DELETE)],
  RoleController.delete,
);

// ----------

/**
 * ressources routes
 */

router.get(
  '/ressources',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.RESSOURCE.READ)],
  RessourceController.index as any,
);

/**
 * contacts routes
 */

router.get(
  '/contacts',
  [authJwt.shouldBeLogged],
  ContactController.index as any,
);

router.get(
  '/contacts/:id',
  [authJwt.shouldBeLogged],
  ContactController.show,
);

router.post(
  '/contacts',
  [authJwt.shouldBeLogged],
  ContactController.store as any,
);

router.put(
  '/contacts/:id',
  [authJwt.shouldBeLogged],
  ContactController.update as any,
);

router.delete(
  '/contacts/:id',
  [authJwt.shouldBeLogged],
  ContactController.delete,
);
router.post(
  '/contacts/upload',
  [authJwt.shouldBeLogged, upload.single('file')],
  ContactController.saveFileInDB,
);
router.post(
  '/contacts/send-sms',
  [authJwt.shouldBeLogged],
  ContactController.sendSMS,
);

// ----------

router.get('/protected', [authJwt.shouldBeLogged], (_: Request, res: Response) => {
  res.send('You have access to protected content !! ');
});

export default router;
