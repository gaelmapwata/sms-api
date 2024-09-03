import axios from 'axios';
import { AuthenticateI, ResponseSendSmsI } from '../types/OrangeSms';

const OrangeService = {
  authentication: (): Promise<AuthenticateI> => new Promise((resolve, reject) => {
    const grantType = process.env.GRANT_TYPE;
    if (!grantType) {
      // eslint-disable-next-line no-promise-executor-return
      return reject(new Error('Missing grant_type environment variable'));
    }

    const data = new URLSearchParams();
    data.append('grant_type', grantType);

    const headers = {
      Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`, 'utf8').toString('base64')}`,
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    // eslint-disable-next-line max-len
    axios.post(process.env.AUTH_ORANGE_URL as string, data, { headers })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  }),

  // eslint-disable-next-line max-len
  sendSMS: (phoneNumber: string, message: string): Promise<ResponseSendSmsI> => new Promise((resolve, reject) => {
    OrangeService.authentication().then((user) => {
      const headers = {
        Authorization: `Bearer ${user.access_token}`,
        'Content-Type': 'application/json',
      };
      const formData = {
        outboundSMSMessageRequest: {
          address: `tel:+243${phoneNumber}`,
          senderAddress: `tel:+${process.env.SENDER_ADDRESS}`,
          outboundSMSTextMessage: {
            message,
          },
        },
      };

      const formDataJson = JSON.stringify(formData);

      axios.post(`${process.env.SEND_SMS_URL}/tel%3A%2B${process.env.SENDER_ADDRESS}/requests`, formDataJson, { headers })
        .then(({ data }: { data: ResponseSendSmsI }) => {
          console.log('fff', data);
          resolve(data);
        })
        .catch((err) => {
          reject(err.response.data.requestError.policyException);
        });
    })
      .catch((err) => {
        reject(err);
      });
  }),
};

export default OrangeService;
