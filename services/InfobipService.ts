import axios from 'axios';
import Contact from '../models/Contact';

const InfobipService = {
  sendWhatsappMessages: async (contacts: Contact[], message: string) => {
    const dateTime = new Date().getTime();

    const promises = contacts
      .map((contact, i) => InfobipService
        .sendWhatsappMessage(contact.phoneNumber, message, `${dateTime}-${i}`));

    return Promise.all(promises);
  },

  sendWhatsappMessage: async (
    phoneNumber: string,
    message: string,
    messageId?: string,
  ) => new Promise((resolve, reject) => {
    const dateTime = new Date().getTime();

    axios.post(`${process.env.INFOBIP_API_URL}/whatsapp/1/message/text`, {
      from: process.env.INFOBIP_FROM_NUMBER,
      to: phoneNumber,
      messageId: messageId || dateTime,
      content: {
        text: message,
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `App ${process.env.INFOBIP_API_KEY}`,
      },
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  }),

  sendWhatsappTemplateMessages: async (contacts: Contact[], templateName: string) => {
    const dateTime = new Date().getTime();

    const messages = contacts.map((contact, i) => {
      const messageId = `${dateTime}-${i}`;
      return {
        from: process.env.INFOBIP_FROM_NUMBER,
        to: contact.phoneNumber,
        messageId,
        content: {
          templateName,
          templateData: {
            body: {
              placeholders: [contact.firstName, 'John Doe'],
            },
            buttons: [
              { type: 'QUICK_REPLY', parameter: 'Oui, ça m\'interesse' },
            ],
          },
          language: 'fr',
        },
      };
    });

    return axios.post(`${process.env.INFOBIP_API_URL}/whatsapp/1/message/template`, {
      messages,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `App ${process.env.INFOBIP_API_KEY}`,
      },
    })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        return error;
      });
  },
};

export default InfobipService;
