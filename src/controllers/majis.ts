import { PrismaClient } from "@prisma/client"
import createToken from "../utils/generateToken";
import pkcs12 from "../utils/pkcs12";
import { error } from "elysia";


interface acknowledge {
    paymentReceipt: string
    amountPaid: number
    units: number
    meterNumber: string
    accountNumber: string
}

const prisma = new PrismaClient();

const _findAll = async () => {
    return await prisma.majisTransactions.findMany({})
}


const _deleteAll = async () => {
    return await prisma.majisTransactions.deleteMany({})
}

const acknowledgeToMajis = async (body: acknowledge, header: string) => {
    const matchResult = body.meterNumber.match(/\d+/);
    if (matchResult) {
        const meter = await prisma.meter.findUnique({
            where: {
                serialNumber: parseInt(matchResult[0])
            }
        })
        if (meter?.id) {
            const transaction = await prisma.majisTransactions.findUnique({
                where: {
                    paymentReceipt: body.paymentReceipt
                }
            })
            if (transaction?.id) {
                return {
                    error: "Duplicate transaction request",
                    transaction
                }
            }
            return await prisma.majisTransactions.create({
                data: body
            })
        }

        return { error: "Meter number not found in the prepaid meter system" }
    }
    return { error: "Failed extracting serial Number from meter number" }
}


const sendPendingTokensToMajis = async (id: number) => {
    const transaction = await prisma.majisTransactions.findUnique({
        where: {
            id
        }
    })
    if (transaction) {
        const matchResult = transaction?.meterNumber.match(/\d+/);
        createToken({
            serialNumber: matchResult ? parseInt(matchResult[0]) : 0,
            amount: transaction.amountPaid,
            units: transaction.units,
            reference: transaction.paymentReceipt
        }).then(async (token: any) => {
            const jsonBody = {
                paymentReceipt: transaction?.paymentReceipt,
                token: token.token,
                message: token.id ? "Successful!" : "Failed!",
                status: token.id ? "MS" : "MF",
            }
            sendDataToMajis(jsonBody, token.id ? transaction?.id : 0)
                .then()
                .catch(error => {
                    return { error: error.message }
                })
        })
    }
}


const sendDataToMajis = async (jsonBody: any, id: number) => {
    fetch("https://majiapi.gov.go.tz/external/gateway/api/pps/prepaid/third-party/token",
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'sysid': 'MAKU01',
                'req-signature': pkcs12.sign(jsonBody)
            },
            method: "POST",
            body: JSON.stringify({ ...jsonBody })
        })
        .then(res => res.json())
        .then((res: any) => {
            console.log("Response from Ruwasa =>", res)
            prisma.majisTransactions.update({
                where: {
                    id: id
                },
                data: {
                    status: 1,
                    token: jsonBody.token
                }
            }).then(() => { })
        })
        .catch(error => {
            console.log("Error sending data to Majis in the background: ", error.message)
        })
}


export {
    acknowledgeToMajis,
    sendPendingTokensToMajis,
    _findAll,
    _deleteAll,
    sendDataToMajis
}