import axios from 'axios';
import { DreamSmsFeedbackI } from '../types/DreamSms';

const DreamSmsService = {
  // eslint-disable-next-line max-len
  sendSmsOnePhoneNumber: (phoneNumber:string, message:string) : Promise<DreamSmsFeedbackI> => new Promise((resolve, reject) => {
    axios.post(`${process.env.SEND_ONE_SMS_URL}?api_id=${process.env.API_ID}&api_password=${process.env.API_PASSWORD}&sms_type=T&encoding=T&sender_id=${process.env.SENDER_ID}&phonenumber=${phoneNumber}&textmessage=${message}` as string)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  }),

  // eslint-disable-next-line max-len
  sendSmsMultiPhoneNumber: (phoneNumber:string, message:string) : Promise<DreamSmsFeedbackI> => new Promise((resolve, reject) => {
    axios.post(`${process.env.SEND_MULTI_SMS_URL}?api_id=${process.env.API_ID}&api_password=${process.env.API_PASSWORD}&sms_type=T&encoding=T&sender_id=${process.env.SENDER_ID}&phonenumber=${phoneNumber}&textmessage=${message}` as string)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  }),
};

export default DreamSmsService;
