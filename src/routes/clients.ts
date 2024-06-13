import { Elysia, t } from "elysia";
import { create, deleteClient, findAll, findById, update, login } from "../controllers/clients"



const clients = new Elysia({ prefix: "/api/client" })

    .get('/id/:id', async ({ params: { id }, set }) => {
        const client = await findById(id)
        if (client) {
            set.status = 200
            return { client }
        }
        else {
            set.status = 404
            return { error: "client not found" }
        }
    },
        {
            params: t.Object({
                id: t.Numeric()
            }),
        }
    )

    .get('/all', async ({ set }) => {
        const clients = await findAll()
        if (clients.length) {
            set.status = 200
            return { clients }
        }
        else {
            set.status = 404
            return { error: "no client found" }
        }
    })

    .post('/create', async ({ body, set }) => {
        return {
            error: "warning, not accessible!"
        }
        const client = await create(body)
        if (client) {
            set.status = 201
            return { client }
        }
        else {
            set.status = 400
            return { error: "couldn't create client" }
        }
    },
        {
            body: t.Object({
                name: t.String(),
                email: t.String(),
                key: t.String(),
                registrationNumber: t.Numeric(),
                adminId: t.Numeric()
            }),
        }
    )

    .post('/login', async ({ body, set, cookie, setCookie, jwt }: any) => {
        const client = await login(body)
        if (client.id) {
            set.status = 201
            setCookie('jwt_token', await jwt.sign({ name: "wilbroad" }), {
                httpOnly: true,
            });
            return { client }
        }
        else {
            set.status = 400
            return { error: "couldn't create client" }
        }
    },
        {
            body: t.Object({
                email: t.String(),
                key: t.String()
            }),
        }
    )

    .patch('/update', async ({ body, set }) => {
        return {}
        const client = await update(body)
        if (client) {
            set.status = 200
            return { client }
        }
        else {
            set.status = 400
            return { error: "couldn't update client" }
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
        const client = await deleteClient(body.id)
        if (client) {
            set.status = 200
            return { client }
        }
        else {
            set.status = 400
            return { error: "couldn't delete client" }
        }
    },
        {
            body: t.Object({
                id: t.Number()
            })
        })

export default clients;