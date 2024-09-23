import { z } from "zod"

const remove = z.object({
    id: z.coerce.number()
})

type Remove = z.infer<typeof remove>

export { Remove, remove }