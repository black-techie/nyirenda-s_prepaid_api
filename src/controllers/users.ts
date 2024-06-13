import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

type userType = {
    firstName: string,
    lastName: string,
    phone: string,
    locationId: number,
    meterId: number,
    key: string
}


type updateType = {
    id: number,
    data: any,
}

type userLogin = {
    phone: string,
    key: string
}



async function findById(id: number): Promise<any> {
    return await prisma.user.findUnique({
        where: {
            id: id,
        },
        include: {
            meter: true,
            location: true
        }
    })
}

async function findAll(): Promise<any> {
    return await prisma.user.findMany()
}


async function create(user: userType): Promise<any> {
    user.key = await Bun.password.hash(user.key);
    return await prisma.user.create({
        data: user
    })
}

async function login(user: userLogin): Promise<any> {
    const res = await prisma.user.findUnique({
        where: {
            phone: user.phone
        }
    })
    if (res?.id) {
        const isMatch = await Bun.password.verify(user.key, res.key);
        if (isMatch) {
            return {
                ...res
            }
        }
    }
    return { error: "incorrect phone or password" }
}


async function update(body: updateType): Promise<any> {
    if(body.data.key){
        return { error: "cant change password, Restricted"}
    }
    return await prisma.user.update({
        where: {
            id: body.id,
        },
        data: body.data
    })
}

async function deleteUser(id: number): Promise<any> {
    return await prisma.user.delete({
        where: {
            id: id,
        }
    })
}


export {
    findById,
    findAll,
    create,
    login,
    update,
    deleteUser
}