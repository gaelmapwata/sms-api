import { Request, Response } from 'express';
import fs from 'fs';
import { Op } from 'sequelize';
import { checkSchema } from 'express-validator';
import { format, parse } from 'date-fns';
import Contact from '../models/Contact';
import contactValidators from '../validators/contact.validator';
import { handleExpressValidators } from '../utils/express.util';
import { formatExcelDate } from '../utils/date.util';
import ImportFileService from '../services/ImportFileService';
import OrangeService from '../services/OrangeService';
import { ContactRecordI } from '../types/contactRecord';

export default {
  index: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const offset = (page - 1) * limit;

      const limitQuery = limit === -1 ? {} : { limit };

      const contactsAndCount = await Contact.findAndCountAll({
        ...limitQuery,
        offset,
      });

      const contactsSize = contactsAndCount.count;
      const totalPages = Math.ceil(contactsSize / limit);

      return res.status(200).json({
        data: contactsAndCount.rows,
        lastPage: totalPages,
        currentPage: page,
        limit,
        total: contactsSize,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  store: [
    checkSchema(contactValidators.storeSchema),
    async (req: Request, res: Response) => {
      try {
        if (handleExpressValidators(req, res)) {
          return null;
        }

        const contact = await Contact.create(req.body);
        return res.status(201).json(contact);
      } catch (error) {
        return res.status(500).json(error);
      }
    },
  ],

  update: [
    checkSchema(contactValidators.updateSchema),
    async (req: Request, res: Response) => {
      try {
        if (handleExpressValidators(req, res)) {
          return null;
        }

        const { id } = req.params;
        await Contact.update(
          req.body,
          {
            where: {
              id,
            },
            fields: Contact.fillable,
          },
        );

        const newContact = await Contact.findByPk(id);
        return res.status(200).json(newContact);
      } catch (error) {
        return res.status(500).json(error);
      }
    },
  ],
  show: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const contact = await Contact.findByPk(id);
      return res.status(200).json(contact);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const contact = await Contact.destroy({
        where: { id },
      });
      return res.status(204).json(contact);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  saveFileInDB: async (req:Request, res:Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Lire le fichier depuis l'emplacement temporaire
      const filePath = req.file.path;
      const data = ImportFileService.importExcelToDb(filePath);

      // eslint-disable-next-line max-len
      const contactPromises: Promise<Contact>[] = (data as ContactRecordI[]).map((record) => {
        // Convertir la date au format yyyy-MM-dd
        const formattedDateOfBorn = formatExcelDate(record.dateOfBorn);

        return Contact.create({
          firstName: record.firstName,
          dateOfBorn: formattedDateOfBorn,
          phoneNumber: record.phoneNumber,
          email: record.email,
          destinationOf: record.destinationOf,
          destinationTo: record.destinationTo,
        });
      });
      await Promise.all(contactPromises);

      // Supprimer le fichier temporaire après le traitement
      fs.unlinkSync(filePath);

      res.status(200).json({ message: 'File processed and data saved successfully' });
    } catch (error) {
      console.log(error);
    }
  },

  sendSMS: async (req:Request, res:Response) => {
    try {
      const { contactIds, message } = req.body;
      const contacts = await Contact.findAll({
        where: {
          id: {
            [Op.in]: contactIds,
          },
        },
      });

      const updatedContacts = contacts.map((contact) => {
        let { phoneNumber } = contact;
        if (phoneNumber.startsWith('+243')) {
          phoneNumber = phoneNumber.slice(-9);
        } else if (phoneNumber.startsWith('0')) {
          phoneNumber = phoneNumber.slice(-9);
        }
        return phoneNumber;
      });

      const feedbackSms = await OrangeService.sendSMS(updatedContacts.join(''), message);

      res.status(200).json(feedbackSms);
    } catch (error) {
      console.log(error);
    }
  },
};
