import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { lastValueFrom } from "rxjs";
import { Repository } from "typeorm";
import { SendWhatsappConfirmationDTO, SendWhatsappSimpleTextDTO } from "../appointment/models/appointment.dto";
import { branchOfficesToMessage } from "../branch_office/extensions/branch.office.extensions";
import { BranchOfficeEntity } from "../branch_office/models/branch.office.entity";


@Injectable()
export class MessageService {

    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(BranchOfficeEntity) private branchOfficeRepository: Repository<BranchOfficeEntity>,
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

    // checkTextMessages = async (message: any) => {
    //     try {
    //         let firstMessage = ['Hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'holi', 'holaa']
    //         let menu = ['menu', 'menú', 'MENU', 'MENÚ']
    //         const isFirstMessage = firstMessage.some(substring => message.text.body.toLowerCase().includes(substring.toLowerCase()));
    //         const isMenu = menu.some(substring => message.text.body.toLowerCase().includes(substring.toLowerCase()));

    //         if (isFirstMessage) {
    //             await this.sendWhatsappButtonActions(
    //                 new SendWhatsappSimpleTextDTO(
    //                     message.from,
    //                     ""
    //                 )
    //             )
    //         } else if (isMenu) {
    //             await this.sendWhatsappButtonActions(
    //                 new SendWhatsappSimpleTextDTO(
    //                     message.from,
    //                     "",
    //                     true,
    //                 )
    //             )
    //         } else {
    //             await this.sendWhatsappSimpleText(
    //                 new SendWhatsappSimpleTextDTO(
    //                     message.from,
    //                     "Escribenos tu mensaje, en breve alguien de nuestro personal se comunicara contigo"
    //                 )
    //             )
    //         }
    //     } catch (error) {
    //         console.log(`checkInteractiveMessages ${error}`);
    //     }
    // }



    sendWhatsAppConfirmation = async (body: SendWhatsappConfirmationDTO) => {
        try {
            const payload = {
                "instance_id": process.env.WTS_INSTANCE_ID,
                "type": "text",
                "number": body.number,
                "country_code": 52,
                "message": `🏥 Bienvenido(a) CDental Care Group \n 📎 Tu cita ha sido confirmada. \n 🗓 Fecha y Hora: ${body.time} \n 📍 Sucursal: ${body.branchOffice} \n \n Por favor llega 10 minutos antes de la hora indicada.`
            }
            const request = this.httpService.post(process.env.WTS_API_URL, payload, {
                method: 'POST',
                headers: {
                    'apikey': process.env.MSJ_TOKEN,
                },
            });
            return await lastValueFrom(request);
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
                "message": `🏥 CDental Care Group \n 📎 Tu próxima ha sido agendada. \n 🗓 Fecha y Hora: ${body.time} \n 📍 Sucursal: ${body.branchOffice} \n \n Por favor llega 10 minutos antes de la hora indicada.`
            }
            const request = this.httpService.post(process.env.WTS_API_URL, payload, {
                method: 'POST',
                headers: {
                    'apikey': process.env.MSJ_TOKEN,
                },
            });
            return await lastValueFrom(request);
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
                "message": `🏥 CDental Care Group \n 📎 Tu cita ha sido re agendada. \n 🗓 Fecha y Hora: ${body.time} \n 📍 Sucursal: ${body.branchOffice} \n \n Por favor llega 10 minutos antes de la hora indicada.`
            }
            const request = this.httpService.post(process.env.WTS_API_URL, payload, {
                method: 'POST',
                headers: {
                    'apikey': process.env.MSJ_TOKEN,
                },
            });
            return await lastValueFrom(request);
        } catch (error) {
            console.log(`sendWhatsAppConfirmation ${error}`)
            this.sendMsjConfirmation(body);
            return 200;
        }
    }
}