import { PrismaClient } from "@prisma/client";
import createToken from "../utils/generateToken";


const prisma = new PrismaClient();

type transactionType = {
    serialNumber: number,
    amount: number
    units?: number
}


type updateType = {
    id: number,
    data: any
}



async function findById(id: number): Promise<any> {
    return await prisma.transaction.findUnique({
        where: {
            id: id,
        }
    })
}

async function findAll(): Promise<any> {
    return await prisma.transaction.findMany()
}


async function create(transaction: transactionType): Promise<any> {
    return await createToken(transaction);
}


async function update(body: updateType): Promise<any> {
    return await prisma.transaction.update({
        where: {
            id: body.id,
        },
        data: body.data
    })
}

async function deleteTransaction(id: number): Promise<any> {
    return await prisma.transaction.delete({
        where: {
            id: id,
        }
    })
}

async function deleteAll(): Promise<any> {
    return await prisma.transaction.deleteMany({})
}


export {
    findById,
    findAll,
    create,
    update,
    deleteAll,
    deleteTransaction
}