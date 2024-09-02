export interface AuthenticateI {

    token_type: string,
    access_token: string,
    expires_in: number,

}

export interface ResponseSendSmsI {
  data:{
    outboundSMSMessageRequest: {
      address: string,
      outboundSMSTextMessage: {
        message: string
      },
      senderAddress: string,
      senderName: string
    }
  }
}
