import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

type clientType = {
    name: string,
    email: string,
    key: string,
    registrationNumber: number,
    adminId: number
}


type updateType = {
    id: number,
    data: any
}

type clientLogin = {
    email: string,
    key: string
}



async function findById(id: number): Promise<any> {
    return await prisma.client.findUnique({
        where: {
            id: id,
        }
    })
}

async function findAll(): Promise<any> {
    return await prisma.client.findMany()
}


async function create(client: clientType): Promise<any> {
    return await prisma.client.create({
        data: client
    })
}

async function login(client: clientLogin): Promise<any> {
    const res = await prisma.client.findUnique({
        where: {
            email: client.email
        }
    })
    if (res?.id) {
        const isMatch = await Bun.password.verify(client.key, res.key);
        if (isMatch) {
            return {
                ...res
            }
        }
    }
    return { error: "incorrect phone or password" }
}


async function update(body: updateType): Promise<any> {
    return await prisma.client.update({
        where: {
            id: body.id,
        },
        data: body.data
    })
}

async function deleteClient(id: number): Promise<any> {
    return await prisma.client.delete({
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
    deleteClient,
    login
}