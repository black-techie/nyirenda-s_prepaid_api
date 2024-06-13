import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { processPhoneNumber } from "../utils/stringFormat";


const prisma = new PrismaClient();


type SMS = {
    id: String,
    to: String,
    content: String
}


const smsServer = new Elysia({ prefix: "/api/sms" })
    .get('/server', async ({ set }) => {
        set.status = 200;
        return { "medic-gateway": true }
    })



    .post('/server', async ({ body, set }) => {
        set.status = 200;
        const newSms = await prisma.sms.findMany({
            where: {
                status: "UNSENT"
            }
        })


        const messages: SMS[] = newSms.map(message => ({
            id: message.id.toString(),
            to: message.to,
            content: message.content
        }))


        if (body.messages.length) {
        }


        if (body.updates.length) {
            body.updates.map(async (update: any) => {
                return await prisma.sms.update({
                    where: {
                        id: parseInt(update.id)
                    },
                    data: { status: update.status }
                })
            })
        }

        return { messages }

    }, 
    {
        body: t.Object({
            messages: t.Any(),
            updates: t.Any()
        })
    })



    .post('/create', async ({ body, set }) => {
        body.to = processPhoneNumber(body.to)
        if (!body.to.length) {
            return { error: "invalid mobile number" }
        }
        const sms = await prisma.sms.create({
            data: { ...body }
        })
        if (sms) {
            return { sms }
        }
        return {
            error: "problem with creating sms"
        }
    },
    {
        body: t.Object({
            to: t.String(),
            content: t.String()
        }),
    })


    .get('/all', async ({ body, set }) => {
        return await prisma.sms.findMany()
    })




export default smsServer