import { Elysia, t } from "elysia";
import { create, deleteProvider, findAll, findById, update } from "../controllers/provider"



const providers = new Elysia({ prefix: "/api/provider" })

    .get('/id/:id', async ({ params: { id }, set }) => {
        const provider = await findById(id)
        if (provider) {
            set.status = 200
            return { provider }
        }
        else {
            set.status = 404
            return { error: "provider not found" }
        }
    },
        {
            params: t.Object({
                id: t.Numeric()
            }),
        }
    )

    .get('/all', async ({ set }) => {
        const providers = await findAll()
        if (providers.length) {
            set.status = 200
            return { providers }
        }
        else {
            set.status = 404
            return { error: "no provider found" }
        }
    })

    .post('/create', async ({ body, set }) => {
        return {
            error: "warning, not accessible!"
        }
        const provider = await create(body)
        if (provider) {
            set.status = 201
            return { provider }
        }
        else {
            set.status = 400
            return { error: "couldn't create provider" }
        }
    },
        {
            body: t.Object({
                companyName: t.String(),
                baseurl: t.String(),
                username: t.String(),
                password: t.String(),
            }),
        }
    )

    .patch('/update', async ({ body, set }) => {
        return {}
        const provider = await update(body)
        if (provider) {
            set.status = 200
            return { provider }
        }
        else {
            set.status = 400
            return { error: "couldn't update provider" }
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
        const provider = await deleteProvider(body.id)
        if (provider) {
            set.status = 200
            return { provider }
        }
        else {
            set.status = 400
            return { error: "couldn't delete provider" }
        }
    },
        {
            body: t.Object({
                id: t.Number()
            })
        })

export default providers;