import { Elysia, t } from 'elysia'
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

type adminType = {
    name: string,
    email: string,
    key: string,
}


type updateType = {
    id: number,
    data: any
}

type adminLogin = {
    email: string,
    key: string
}



async function findById(id: number): Promise<any> {
    return await prisma.admin.findUnique({
        where: {
            id: id,
        }
    })
}

async function findAll(): Promise<any> {
    return await prisma.admin.findMany()
}


async function create(admin: adminType): Promise<any> {
    admin.key = await Bun.password.hash(admin.key);
    return await prisma.admin.create({
        data: admin
    })
}

async function login(admin: adminLogin): Promise<any> {
    const res = await prisma.admin.findUnique({
        where: {
            email: admin.email
        }
    })
    if (res?.id) {
        const isMatch = await Bun.password.verify(admin.key, res.key);
        if (isMatch) {
            return {
                ...res
            }
        }
    }
    return { error: "incorrect phone or password" }
}

async function update(body: updateType): Promise<any> {
    if (body.data.key) {
        return { error: "cant change password, Restricted" }
    }
    return await prisma.admin.update({
        where: {
            id: body.id,
        },
        data: body.data
    })
}

async function deleteAdmin(id: number): Promise<any> {
    return await prisma.admin.delete({
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
    deleteAdmin,
    login
}