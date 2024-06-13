import { Elysia, t } from "elysia";
import { create, deleteAll, deleteTransaction, findAll, findById, update } from "../controllers/transactions"
import { acknowledgeToMajis, sendPendingTokensToMajis, _findAll, _deleteAll } from "../controllers/majis";
import { PrismaClient } from "@prisma/client"
import { sendDataToMajis } from "../controllers/majis"

const prisma = new PrismaClient();

const transaction = new Elysia({ prefix: "/api/transaction" })
    .get('/id/:id', async ({ params: { id }, set }) => {
        const transaction = await findById(id)
        if (transaction) {
            set.status = 200
            return { transaction }
        }
        else {
            set.status = 404
            return { error: "transaction not found" }
        }
    },
        {
            params: t.Object({
                id: t.Numeric()
            }),
        }
    )

    .get('/all', async ({ set }) => {
        const transaction = await findAll()
        if (transaction.length) {
            set.status = 200
            return { transaction }
        }
        else {
            set.status = 404
            return { error: "no transaction found" }
        }
    })

    .delete('/all', async ({ set }) => {
        return {}
        const transaction = await deleteAll()
        set.status = 200
        return { transaction }

    })

    .get('/majis/all', async ({ set }) => {
        const transaction = await _findAll()
        if (transaction.length) {
            set.status = 200
            return { transaction }
        }
        else {
            set.status = 404
            return { error: "no transaction found" }
        }
    })

    .post('/create', async ({ body, set }) => {
        set.status = 404
        return {
            error: "warning, not accessible!"
        }
        const transaction = await create(body)
        if (transaction) {
            set.status = 201
            return ({ transaction })
        }
        else {
            set.status = 400
            return { error: "couldn't create transaction" }
        }

    },
        {
            body: t.Object({
                serialNumber: t.Numeric(),
                amount: t.Numeric(),
                units: t.Optional(t.Number({ default: 0 }))
            }),
        }
    )

    .patch('/update', async ({ body, set }) => {
        const transaction = await update(body)
        if (transaction) {
            set.status = 200
            return { transaction }
        }
        else {
            set.status = 400
            return { error: "couldn't update transaction" }
        }
    },
        {
            body: t.Object({
                id: t.Number(),
                data: t.Any()
            })
        })

    .delete('/delete', async ({ body, set }) => {
        return {}
        const transaction = await deleteTransaction(body.id)
        if (transaction) {
            set.status = 200
            return { transaction }
        }
        else {
            set.status = 400
            return { error: "couldn't delete transaction" }
        }
    },
        {
            body: t.Object({
                id: t.Number()
            })
        })

    .post('majis/pending', async ({ body }) => {
        const transaction = await prisma.majisTransactions.findUnique({
            where: {
                paymentReceipt: body.paymentReceipt
            }
        })
        if (transaction) {
            if (transaction.token == null) {

            }
            const jsonBody = {
                paymentReceipt: transaction.paymentReceipt,
                token: transaction.token,
                message: "Successful!",
                status: "MS"
            }
            sendDataToMajis(jsonBody, transaction.id)
            return { "Res": "Successful" }
        }
    }, {
        body: t.Object({
            paymentReceipt: t.String()
        })
    })

    .post('/majis/create', async ({ body, set, headers }) => {
        let id = 0;
        try {
            set.status = 200
            set.headers['sysid'] = 'MAKU01'
            body.amountPaid = body.amountPaid / 1
            body.units = body.units / 1
            const response: any = await acknowledgeToMajis(body, headers["req-signature"])
            if (response.error) {
                if (response.transaction) {
                    return {
                        paymentReceipt: response.transaction.paymentReceipt,
                        token: response.transaction.token,
                        message: "Successful!",
                        status: "MS"
                    }
                }
                return {
                    paymentReceipt: body.paymentReceipt,
                    status: "MF",
                    message: response.error
                }
            }
            else {
                id = response.id;
                return {
                    paymentReceipt: body.paymentReceipt,
                    status: "MS",
                    message: "Success"
                }
            }
        }
        catch (error: any) {
            set.status = 400
            return {
                paymentReceipt: body.paymentReceipt,
                status: "MF",
                message: error.message
            }
        }
        finally {
            (
                () => sendPendingTokensToMajis(id).then(() => { })
            )()
        }
    },
        {
            body: t.Object({
                "paymentReceipt": t.String(),
                "amountPaid": t.Numeric(),
                "units": t.Numeric(),
                "meterNumber": t.String(),
                "accountNumber": t.String()
            }),
            headers: t.Object({
                "req-signature": t.String()
            })
        })

    .delete('/majis/all', async ({ set }) => {
        return {}
        const transaction = await _deleteAll()
        if (transaction) {
            set.status = 200
            return { transaction }
        }
        else {
            set.status = 404
            return { error: "no transaction found" }
        }
    })

export default transaction;