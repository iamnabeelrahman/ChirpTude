const zod = require("zod")

const registerSchema = zod.object({
    username: zod.string(),
    email: zod.string(),
    fullName: zod.string(),
    password: zod.string(),
})

module.exports = { registerSchema };