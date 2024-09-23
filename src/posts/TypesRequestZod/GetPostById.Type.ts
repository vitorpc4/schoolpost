import { z } from "zod";

const getPostByIdScheme = z.object({
    id: z.coerce.number(),
});


type GetPostById = z.infer<typeof getPostByIdScheme>;


export { GetPostById, getPostByIdScheme };