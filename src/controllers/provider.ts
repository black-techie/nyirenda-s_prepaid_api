import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

type providerType = {
    companyName : string,
    baseurl     : string,
    username    : string,
    password    : string
}

type updateType = {
    id: number,
    data: any
}



async function findById(id: number): Promise<any> {
    return await prisma.provider.findUnique({
        where: {
            id: id,
        }
    })
}

async function findAll(): Promise<any> {
    return await prisma.provider.findMany()
}


async function create(provider: providerType): Promise<any> {
    return await prisma.provider.create({
        data: provider
    })
}


async function update(body: updateType): Promise<any> {
    return await prisma.provider.update({
        where: {
            id: body.id,
        },
        data: body.data
    })
}

async function deleteProvider(id: number): Promise<any> {
    return await prisma.provider.delete({
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
    deleteProvider
}