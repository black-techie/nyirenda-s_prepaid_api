import { Elysia, t } from "elysia";
import { create, deleteAdmin, findAll, findById, update, login } from "../controllers/admins"



const admins = new Elysia({ prefix: "/api/admin" })
    .get('/', (c) => Bun.file('./public/dataPanel.html'))
    .get('/id/:id', async ({ params: { id }, set }) => {
        const admin = await findById(id)
        if (admin) {
            set.status = 200
            return { admin }
        }
        else {
            set.status = 404
            return { error: "admin not found" }
        }
    },
        {
            params: t.Object({
                id: t.Numeric()
            }),
        }
    )

    .get('/all', async ({ set }) => {
        const admins = await findAll()
        if (admins.length) {
            set.status = 200
            return { admins }
        }
        else {
            set.status = 404
            return { error: "no admin found" }
        }
    })

    .post('/create', async ({ body, set }) => {
        body.key = await Bun.password.hash(body.key);
        return {
            error: "warning, not accessible!"
        }
        const admin = await create(body)
        if (admin) {
            set.status = 201
            return { admin }
        }
        else {
            set.status = 400
            return { error: "couldn't create admin" }
        }
    },
        {
            body: t.Object({
                name: t.String(),
                email: t.String(),
                key: t.String()
            }),
        }
    )

    .post('/login', async ({ body, set, cookie, setCookie, jwt }: any) => {
        const user = await login(body)
        if (user.id) {
            set.status = 201
            setCookie('jwt_token', await jwt.sign({ name: "wilbroad" }), {
                httpOnly: true,
            });
            return { user }
        }
        else {
            set.status = 400
            return { error: "couldn't create user" }
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
        const admin = await update(body)
        if (admin) {
            set.status = 200
            return { admin }
        }
        else {
            set.status = 400
            return { error: "couldn't update admin" }
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
        const admin = await deleteAdmin(body.id)
        if (admin) {
            set.status = 200
            return { admin }
        }
        else {
            set.status = 400
            return { error: "couldn't delete admin" }
        }
    },
        {
            body: t.Object({
                id: t.Number()
            })
        })

export default admins;