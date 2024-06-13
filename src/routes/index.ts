import { Elysia } from "elysia";

const index = new Elysia({ prefix: "/"})

.get("/", async({ set }) =>{
    return {mssg: "Hello, World!"}
})


export default index;
