export const mail = {
    host: "mail.cdentalcaregroup.com",
    port: 465,
      secure: true,
      auth: {
          // should be replaced with real sender's account
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD
      }, 
}