import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { checkSchema } from 'express-validator';
import authValidators from '../validators/auth.validator';
import { Request } from '../types/expressOverride';
import { handleExpressValidators } from '../utils/express.util';
import OtpService from '../services/OtpService';
import DreamSmsService from '../services/DreamSmsService';
import User from '../models/User';
import Role from '../models/Role';
import Permission from '../models/Permission';
import Otp from '../models/Otp';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

const TOKEN_EXPIRATION_TIME_IN_MS = 2592000; // 30 days

export default {
  signin: [
    checkSchema(authValidators.signinSchema),
    async (req: Request, res: Response) => {
      try {
        if (handleExpressValidators(req, res)) {
          return null;
        }

        const userToLogin = await User.findOne(
          { where: { email: req.body.email } },
        );

        if (!userToLogin) {
          return res.status(401).send({ message: "Ce compte n'a pas été retrouvé" });
        }

        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          userToLogin.password,
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            token: null,
            message: 'Mot de passe invalide',
          });
        }

        // Destroy expired OTP
        Otp.destroy({
          where: {
            email: req.body.email,
            expirationDate: {
              [Op.lt]: new Date(),
            },
          },
        });
        const { otp: userOTP } = await OtpService.createOtpForUser(req.body.email);

        const messageOtp = `Votre Otp est :  ${userOTP}`;

        await DreamSmsService.sendSmsMultiPhoneNumber(userToLogin.phoneNumber, messageOtp);
        return res.status(200).json({ msg: 'authentification réussie' });
      } catch (error) {
        console.log('error', error);
        return res.status(500).json({ message: 'Une erreur est survenue lors de l\'authentification' });
      }
    },
  ],

  checkOtp: async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (!user) {
        return res.status(401).send({ msg: "Ce compte n'a pas été retrouvé" });
      }

      const otp = await OtpService.checkOtpFromUser(req.body.email, req.body.otp);

      if (!otp) {
        return res.status(401).send({ msg: 'Otp not recognized or expired' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: TOKEN_EXPIRATION_TIME_IN_MS,
      });

      otp.destroy();

      return res.status(200).json({
        user,
        token,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getCurrentUser: async (req: Request, res: Response) => {
    try {
      const loggedUser = await User.findByPk(req.userId as number, {
        include: [{ model: Role, include: [Permission] }],
      });
      if (!loggedUser) {
        return res.status(401).send({ msg: "Ce compte n'a pas été retrouvé" });
      }

      return res.status(200).json(loggedUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  logout: (_: unknown, res: Response) => res.status(200).json({}),
};
