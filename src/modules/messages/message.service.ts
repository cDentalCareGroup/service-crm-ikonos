import { HttpService } from "@nestjs/axios";
import { Body, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FirebaseAdmin, InjectFirebaseAdmin } from "nestjs-firebase";
import { lastValueFrom } from "rxjs";
import { HandleException } from "src/common/exceptions/general.exception";
import { Repository } from "typeorm";
import { SendWhatsappConfirmationDTO, SendWhatsappSimpleTextDTO } from "../appointment/models/appointment.dto";
import { branchOfficesToMessage } from "../branch_office/extensions/branch.office.extensions";
import { BranchOfficeEntity } from "../branch_office/models/branch.office.entity";
import { EmployeeEntity } from "../employee/models/employee.entity";


@Injectable()
export class MessageService {

    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(BranchOfficeEntity) private branchOfficeRepository: Repository<BranchOfficeEntity>,
        @InjectRepository(EmployeeEntity) private employeeRepository: Repository<EmployeeEntity>,
        @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    ) {

    }
    // sendWhatsAppConfirmation = async (body: SendWhatsappConfirmationDTO) => {
    //     try {

    //         let whatsappNumber: string = '';
    //         if (body.number.startsWith('777')) {
    //             whatsappNumber = `52${body.number}`;
    //         } else {
    //             whatsappNumber = body.number;
    //         }

    //         const payload = {
    //             "messaging_product": "whatsapp",
    //             "to": whatsappNumber,
    //             "type": "template",
    //             "template": {
    //                 "name": "confirmation_appointment",
    //                 "language": {
    //                     "code": "es_MX"
    //                 },
    //                 "components": [
    //                     {
    //                         "type": "body",
    //                         "parameters": [
    //                             {
    //                                 "type": "text",
    //                                 "text": "CDental Care Group"
    //                             },
    //                             {
    //                                 "type": "text",
    //                                 "text": body.time
    //                             },
    //                             {
    //                                 "type": "text",
    //                                 "text": body.branchOffice
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         }

    //         const request = this.httpService.post('https://graph.facebook.com/v15.0/114901764850906/messages', payload, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${process.env.WTS_TOKEN}`
    //             }
    //         });
    //         await lastValueFrom(request);
    //         return 200;
    //     } catch (error) {
    //         console.log(`Error sending whatsapp message : ${error}`);
    //         return {};
    //     }
    // }


    // sendWhatsappSimpleText = async (body: SendWhatsappSimpleTextDTO) => {
    //     try {

    //         const payload = {
    //             "messaging_product": "whatsapp",
    //             "to": body.number,
    //             "type": "text",
    //             "text": {
    //                 "body": body.text
    //             }
    //         }
    //         const request = this.httpService.post('https://graph.facebook.com/v15.0/114901764850906/messages', payload, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${process.env.WTS_TOKEN}`
    //             }
    //         });
    //         await lastValueFrom(request);
    //         return 200;
    //     } catch (error) {
    //         console.log(`Error sending whatsapp message : ${error}`);
    //         return {};
    //     }
    // }


    sendMsjConfirmation = async (body: SendWhatsappConfirmationDTO) => {
        try {

            let message = `CDental Care Group. Tu cita ha sido confirmada. Fecha y Hora: ${body.time}`
            var payload = {
                "message": message,
                "numbers": body.number,
                "country_code": 52
            }
            const request = this.httpService.post('https://api.smsmasivos.com.mx/sms/send', payload, {
                method: 'POST',
                headers: {
                    'apikey': ` ${process.env.MSJ_TOKEN}`,
                },
            });
            const res = await lastValueFrom(request);
            console.log(res);
            return 200;
        } catch (error) {
            console.log(`Error sending msj message : ${error}`);
            return {};
        }
    }


    // sendWhatsappButtonActions = async (body: SendWhatsappSimpleTextDTO) => {
    //     try {

    //         let header = '🏥 Bienvenido(a) CDental Care Group';
    //         if (body.hideTitle == true) {
    //             header = 'Menu de opciones'
    //         }
    //         const payload = {
    //             "messaging_product": "whatsapp",
    //             "to": body.number,
    //             "type": "interactive",
    //             "interactive": {
    //                 "type": "button",
    //                 "header": {
    //                     "type": "text",
    //                     "text": header
    //                 },
    //                 "body": {
    //                     "text": "📎 ¿Cómo podemos ayudarte el día de hoy?"
    //                 },
    //                 "action": {
    //                     "buttons": [
    //                         {
    //                             "type": "reply",
    //                             "reply": {
    //                                 "id": "btn_appointment",
    //                                 "title": "🗓 Agendar una cita"
    //                             }
    //                         },
    //                         {
    //                             "type": "reply",
    //                             "reply": {
    //                                 "id": "btn_talk",
    //                                 "title": "💬 Hablar con alguien"
    //                             }
    //                         },
    //                         {
    //                             "type": "reply",
    //                             "reply": {
    //                                 "id": "btn_branchOffices",
    //                                 "title": "📍 Ver sucursales"
    //                             }
    //                         }
    //                     ]
    //                 }
    //             }

    //         }
    //         const request = this.httpService.post('https://graph.facebook.com/v15.0/114901764850906/messages', payload, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${process.env.WTS_TOKEN}`
    //             }
    //         });
    //         await lastValueFrom(request);
    //         return 200;
    //     } catch (error) {
    //         console.log(`Error sending whatsapp message : ${error}`);
    //         return {};
    //     }
    // }

    // checkInteractiveMessages = async (message: any) => {
    //     try {
    //         if (message.type == 'interactive' && message.interactive.type == 'button_reply') {
    //             switch (message.interactive.button_reply.id) {
    //                 case 'btn_appointment':
    //                     console.log('mandamos liga')
    //                     await this.sendWhatsappSimpleText(
    //                         new SendWhatsappSimpleTextDTO(
    //                             message.from,
    //                             "🗓 Puedes agendar una cita en el siguiente enlace: \n https://cdentalcaregroup-fcdc9.web.app/appointment \n Para regresar al menu de opciones escribe 'menu'"
    //                         )
    //                     )
    //                     break;
    //                 case 'btn_talk':
    //                     await this.sendWhatsappSimpleText(
    //                         new SendWhatsappSimpleTextDTO(
    //                             message.from,
    //                             "🩺 En unos minutos alguien de nuestro personal te atendera \n \n Para regresar al menu de opciones escribe 'Menu'"
    //                         )
    //                     )
    //                     break;
    //                 case 'btn_branchOffices':
    //                     const result = await this.branchOfficeRepository.findBy({ status: 1 })

    //                     await this.sendWhatsappSimpleText(
    //                         new SendWhatsappSimpleTextDTO(
    //                             message.from,
    //                             `🏥 Nuestras sucursales: \n${branchOfficesToMessage(result)} \n Para regresar al menu de opciones escribe 'Menu'`
    //                         )
    //                     )
    //                     break;
    //                 default:
    //                     await this.sendWhatsappSimpleText(
    //                         new SendWhatsappSimpleTextDTO(
    //                             message.from,
    //                             "❎ No pudimos procesar tu respuesta, intenta nuevamente \n Para regresar al menu de opciones escribe 'Menu'"
    //                         )
    //                     )
    //             }
    //         }
    //     } catch (error) {
    //         console.log(`checkInteractiveMessages ${error}`);
    //     }
    // }

    checkTextMessages = async (data: any) => {
        try {
            console.log(`checking message`)
            let firstMessage = ['Hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'holi', 'holaa', 'hey', 'buen dia', 'buena tarde']
            let menu = ['menu', 'menú', 'MENU', 'MENÚ']
            const isFirstMessage = firstMessage.some(substring => data.message.toLowerCase().includes(substring.toLowerCase()));
            const isMenu = menu.some(substring => data.message.toLowerCase().includes(substring.toLowerCase()));

            let lastMessage = ['gracias', 'hasta luego', 'muchas gracias', 'ok']
            const isLastMessage = lastMessage.some(substring => data.message.toLowerCase().includes(substring.toLowerCase()));

            if (isFirstMessage) {
                await this.sendGenericMessage(
                    new SendGenericMessageDTO(
                        data.from,
                        `🏥 Bienvenido(a) CDental Care Group \n 📎 ¿Cómo podemos ayudarte el día de hoy? \n 1. 🗓 Agendar una cita \n 2. 📍 Ver sucursales \n 3. 💬 Hablar con alguien \n Escribe el nùmero que deseas consultar`
                    )
                );
            } else if (isMenu) {
                await this.sendGenericMessage(
                    new SendGenericMessageDTO(
                        data.from,
                        `📎 ¿Cómo podemos ayudarte el día de hoy? \n 1. 🗓 Agendar una cita \n 2. 📍 Ver sucursales \n 3. 💬 Hablar con alguien \n Escribe el nùmero que deseas consultar`
                    )
                );
            } else if (isLastMessage) {
                console.log('Last message')
            } else {
                this.sendWhatsappButtonActions(data);
            }

        } catch (error) {
            console.log(`checkInteractiveMessages ${error}`);
        }
    }

    sendWhatsappButtonActions = async (data: any) => {
        try {
            let optionOne = ['1', 'agendar una cita', 'agendar cita', 'Agendar una cita'];
            const isOptionOne = optionOne.some(substring => data.message.toLowerCase().includes(substring.toLowerCase()));

            let optionTwo = ['2', 'Ver sucursales', 'ver sucursal',];
            const isOptionTwo = optionTwo.some(substring => data.message.toLowerCase().includes(substring.toLowerCase()));

            let optionThree = ['3', 'Hablar con alguien '];
            const isOptionThree = optionThree.some(substring => data.message.toLowerCase().includes(substring.toLowerCase()));

            if (isOptionOne) {
                await this.sendGenericMessage(
                    new SendGenericMessageDTO(
                        data.from,
                        "🗓 Puedes agendar una cita en el siguiente enlace: \n https://cdentalcaregroup-fcdc9.web.app/appointment \n \n Para regresar al menu de opciones escribe 'menu'"
                    )
                );
            } else if (isOptionTwo) {
                const result = await this.branchOfficeRepository.findBy({ status: 1 })
                await this.sendGenericMessage(
                    new SendGenericMessageDTO(
                        data.from,
                        `🏥 Nuestras sucursales: \n${branchOfficesToMessage(result)} \n \n Para regresar al menu de opciones escribe 'menu'`
                    )
                );
            } else if (isOptionThree) {
                await this.sendGenericMessage(
                    new SendGenericMessageDTO(
                        data.from,
                        "🩺 En unos minutos alguien de nuestro personal te atendera \n \n Para regresar al menu de opciones escribe 'menu'"
                    )
                );
                await this.sendAppointmentNotification();
            } else {
                await this.sendGenericMessage(
                    new SendGenericMessageDTO(
                        data.from,
                        "❎ No pudimos procesar tu respuesta, dejanos tu mensaje y te atenderemos a la brevedad \n \n Para regresar al menu de opciones escribe 'menu'"
                    )
                );
                await this.sendAppointmentNotification();
            }
        } catch (error) {
            console.log(`sendWhatsappButtonActions `, error);
        }
    }


    sendGenericMessage = async (data: SendGenericMessageDTO) => {
        try {
            let whatsappNumber = '';
            if (data.phone.startsWith('52')) {
                whatsappNumber = data.phone.substring(3);
            } else {
                whatsappNumber = data.phone;
            }
            const payload = {
                "instance_id": process.env.WTS_INSTANCE_ID,
                "type": "text",
                "number": whatsappNumber,
                "message": data.message,
                "country_code": 52,
            }
            // const request = this.httpService.post(process.env.WTS_API_URL, payload, {
            //     method: 'POST',
            //     headers: {
            //         'apikey': process.env.MSJ_TOKEN,
            //     },
            // });
            // const res = await lastValueFrom(request);
            // console.log(res);
        } catch (error) {
            console.log(`Error sending generic message`, error);
        }
    }


    sendWhatsAppConfirmation = async (body: SendWhatsappConfirmationDTO) => {
        try {
            //console.log(body);
            const payload = {
                "instance_id": process.env.WTS_INSTANCE_ID,
                "type": "text",
                "number": body.number,
                "country_code": 52,
                "message": `¡Tu cita ha sido confirmada! \n🦷 C Dental Care Group agradece tu preferencia y te da la bienvenida. \n🗓️Te esperamos en nuestra Sucursal ${body.branchOffice} el ${body.time} \nMantenemos sonrisas 😁`
            }
            // const request = this.httpService.post(process.env.WTS_API_URL, payload, {
            //     method: 'POST',
            //     headers: {
            //         'apikey': process.env.MSJ_TOKEN,
            //     },
            // });
            // return await lastValueFrom(request);
        } catch (error) {
            console.log(`sendWhatsAppConfirmation ${error}`)
            this.sendMsjConfirmation(body);
            return 200;
        }
    }

    sendWhatsAppNextAppointment = async (body: SendWhatsappConfirmationDTO) => {
        try {
            const payload = {
                "instance_id": process.env.WTS_INSTANCE_ID,
                "type": "text",
                "number": body.number,
                "country_code": 52,
                "message": `¡Tu siguiente cita ha sido confirmada! \n🦷 C Dental Care Group agradece tu preferencia. \n🗓️Te esperamos en nuestra Sucursal ${body.branchOffice} el ${body.time} \nMantenemos sonrisas 😁`
            }
            // const request = this.httpService.post(process.env.WTS_API_URL, payload, {
            //     method: 'POST',
            //     headers: {
            //         'apikey': process.env.MSJ_TOKEN,
            //     },
            // });
            // return await lastValueFrom(request);
        } catch (error) {
            console.log(`sendWhatsAppConfirmation ${error}`)
            this.sendMsjConfirmation(body);
            return 200;
        }
    }

    sendWhatsAppRescheduleAppointment = async (body: SendWhatsappConfirmationDTO) => {
        try {
            const payload = {
                "instance_id": process.env.WTS_INSTANCE_ID,
                "type": "text",
                "number": body.number,
                "country_code": 52,
                "message": `Tu cita ha sido reagendada ✅ Gracias por confiar en C Dental Care Group. \n🦷 Te esperamos en nuestra sucursal ${body.branchOffice} el día ${body.time}. 🕣`
            }
            // const request = this.httpService.post(process.env.WTS_API_URL, payload, {
            //     method: 'POST',
            //     headers: {
            //         'apikey': process.env.MSJ_TOKEN,
            //     },
            // });
            // return await lastValueFrom(request);
        } catch (error) {
            console.log(`sendWhatsAppConfirmation ${error}`)
            this.sendMsjConfirmation(body);
            return 200;
        }
    }


    sendWhatsAppCancelAppointment = async (body: SendWhatsappConfirmationDTO) => {
        try {
            const payload = {
                "instance_id": process.env.WTS_INSTANCE_ID,
                "type": "text",
                "number": body.number,
                "country_code": 52,
                "message": `Tú visita a C Dental Care Group ha sido cancelada. ❌ \n📞 En breve nuestro Call Center se pondrá en contacto contigo para reagendar tu cita y brindarte nuestro apoyo. \n🦷¡Te esperamos próximamente!`
            }
            // const request = this.httpService.post(process.env.WTS_API_URL, payload, {
            //     method: 'POST',
            //     headers: {
            //         'apikey': process.env.MSJ_TOKEN,
            //     },
            // });
            // return await lastValueFrom(request);
        } catch (error) {
            console.log(`sendWhatsAppConfirmation ${error}`)
            this.sendMsjConfirmation(body);
            return 200;
        }
    }

    sendAppointmentNotification = async () => {
        try {
            const employee = await this.employeeRepository.findOneBy({ typeId: 16 });
            //   const employee = await this.employeeRepository.findOneBy({ id: 21 });
            const message = {
                notification: {
                    title: `Nueva solicitud de mensaje entrante`,
                    body: 'Un paciente solicita hablar con alguien, revisa WhatsApp Web.'
                },
                data: {
                    type: 'WHATSAPP',
                },
                token: employee.token
            };
            await this.firebase.messaging.send(message);
            console.log(`Notification sent`);
            return 200;
        } catch (exception) {
            console.log(`Error sending notification ${exception}`);
            HandleException.exception(exception);
        }
    }
}

class SendGenericMessageDTO {
    phone: string;
    message: string;
    constructor(phone: string,
        message: string) {
        this.phone = phone;
        this.message = message;
    }
}