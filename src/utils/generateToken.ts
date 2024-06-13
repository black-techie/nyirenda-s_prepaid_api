import { PrismaClient } from "@prisma/client";
import generateReferenceId from "./generateReferenceId";

type Body = {
    serialNumber: number,
    amount: number,
    units?: number,
    reference?: string
}


const prisma = new PrismaClient();


const createToken = async (body: Body) => {
    const meter = await prisma.meter.findUnique({
        where: {
            serialNumber: body.serialNumber,
        }
    }); if (!meter?.id) return { error: "No meter found" }

    const provider = await prisma.provider.findUnique({
        where: {
            id: meter?.providerId || 0
        }
    }); if (!provider?.id) return { error: "No provider found" }


    body.amount = (body.amount / 1) // convert to float if int
    const units = (body.units) ? body.units : (body.amount / meter.unitPrice);
    if (units < 0.010) return { error: "Units should be greater or equal to 0.010 m3" }

    let transaction = await prisma.transaction.create({
        data: {
            amount: body.amount,
            meterId: meter.id,
            referenceID: generateReferenceId(),
            units: units,
            remoteReferenceID: body.reference
        }
    })

    const response: any = await fetch(provider.baseurl + "/VendingMeterDirectly",
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                "CompanyName": provider.companyName,
                "UserName": provider.username,
                "PassWord": provider.password,
                "MeterId": body.serialNumber,
                "Amount": units
            })
        }); if (!response.ok) return { error: "Failed querying from provider, provider_id = " + provider.id }

    const jsonResponse = await response.json();
    transaction = await prisma.transaction.update({
        where: {
            id: transaction.id,
        },
        data: {
            token: jsonResponse[0].Token,
            status: true
        }
    })
    return { unitPrice: meter.unitPrice, ...transaction }
};


export default createToken;