import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

type meterType = {
    serialNumber: number,
    meterType: string,
    parameters: string,
    clientId: number,
    providerId: number,
    unitPrice: number
}


type updateType = {
    data: any
}


async function findById(id: number): Promise<any> {
    return await prisma.meter.findUnique({
        where: {
            id: id,
        }
    })
}

async function findAll(): Promise<any> {
    return await prisma.meter.findMany()
}

async function create(meter: meterType): Promise<any> {
    return await prisma.meter.create({
        data: meter
    })
}

async function update(body: updateType, id: number): Promise<any> {
    return await prisma.meter.update({
        where: {
            id: id,
        },
        data: body.data
    })
}

async function deleteMeter(id: number): Promise<any> {
    return await prisma.meter.delete({
        where: {
            id: id,
        }
    })
}


async function deleteAll() {
    return await prisma.meter.deleteMany()
}

export {
    findById,
    findAll,
    create,
    update,
    deleteMeter,
    deleteAll
}