import { Request } from 'express';
import Contact from '../models/Contact';

const contactValidator = {
  storeSchema: {
    email: {
      isEmail: {
        errorMessage: 'Le champ "Email" doit-être un email invalide',
      },
      custom: {
        options: async (value: string) => {
          const contact = await Contact.findOne({ where: { email: value }, paranoid: false });
          if (contact && !contact.deletedAt) {
            throw new Error('Un utilisateur ayant cet email existe déjà');
          }
          if (contact) {
            throw new Error('Cet email a déjà été utilisé par un utilisateur supprimé');
          }
        },
      },
    },
    phoneNumber: {
      notEmpty: {
        errorMessage: 'Le champ "phoneNumber" est obligatoire',
      },
      custom: {
        options: async (value: string) => {
          const contact = await Contact.findOne({ where: { phoneNumber: value }, paranoid: false });
          if (contact && !contact.deletedAt) {
            throw new Error('Un utilisateur ayant ce numéros de téléphone existe déjà');
          }
          if (contact) {
            throw new Error('Ce numéros de téléphone a déjà été utilisé par un utilisateur supprimé');
          }
        },
      },
    },
  },
  updateSchema: {
    email: {
      optional: true,
      isEmail: {
        errorMessage: 'Le champ "Email" doit-être un email valide',
      },
      custom: {
        options: async (value: string, { req }: { req: unknown }) => {
          const { id } = (req as Request).params;
          const contact = await Contact.findByPk(id);
          if (contact && contact.email !== value) {
            // eslint-disable-next-line max-len
            const existContact = await Contact.findOne({ where: { email: value }, paranoid: false });
            if (existContact && !existContact.deletedAt) {
              throw new Error('Un utilisateur ayant cet email existe déjà');
            }
            if (existContact) {
              throw new Error('Cet email a déjà été utilisé par un utilisateur supprimé');
            }
          }
        },
      },
    },
    phoneNumber: {
      optional: true,
      custom: {
        options: async (value: string, { req }: { req: unknown }) => {
          const { id } = (req as Request).params;
          const contact = await Contact.findByPk(id);
          if (contact && contact.phoneNumber !== value) {
            // eslint-disable-next-line max-len
            const existContact = await Contact.findOne({ where: { phoneNumber: value }, paranoid: false });
            if (existContact && !existContact.deletedAt) {
              throw new Error('Un utilisateur ayant ce numéros de téléphone existe déjà');
            }
            if (existContact) {
              throw new Error('Ce numéros de téléphone a déjà été utilisé par un utilisateur supprimé');
            }
          }
        },
      },
    },
  },
};

export default contactValidator;
