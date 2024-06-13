import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

type logsType = {
    type: number,
    info: string,
    clientId: number,
    meterId: number
}


async function findByType(type: number, id: number = 0): Promise<any> {
    if(id){
        return await prisma.logs.findUnique({
            where: {
                type: type,
                id: id
            }
        })      
    }
    return await prisma.logs.findMany({
        where: {
            type: type
        }
    })
}


async function findById(id: number): Promise<any> {
    return await prisma.logs.findUnique({
        where: {
            id: id
        }
    })
}

async function findAll(): Promise<any> {
    return await prisma.logs.findMany()
}


async function create(logs: logsType): Promise<any> {
    return await prisma.logs.create({
        data: logs
    })
}




export {
    findByType,
    findById,
    findAll,
    create
}