import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

type locationType = {
    gpsCoordinates: string,
    country: string,
    region: string,
    district: string,
    ward: string,
    street: string,
    clientId: number
}


type updateType = {
    id: number,
    data: any
}



async function findById(id: number): Promise<any> {
    return await prisma.location.findUnique({
        where: {
            id: id,
        }
    })
}

async function findAll(): Promise<any> {
    return await prisma.location.findMany()
}


async function create(location: locationType): Promise<any> {
    return await prisma.location.create({
        data: location
    })
}


async function update(body: updateType): Promise<any> {
    return await prisma.location.update({
        where: {
            id: body.id,
        },
        data: body.data
    })
}

async function deleteLocation(id: number): Promise<any> {
    return await prisma.location.delete({
        where: {
            id: id,
        }
    })
}


export {
    findById,
    findAll,
    create,
    update,
    deleteLocation
}