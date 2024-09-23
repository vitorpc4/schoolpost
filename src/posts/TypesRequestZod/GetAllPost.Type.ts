import { z } from "zod";

const getAllPosts = z.object({
    limit: z.coerce.number().default(10),
    page: z.coerce.number().default(1),
});

type GetAllPosts = z.infer<typeof getAllPosts>;

export { GetAllPosts, getAllPosts };