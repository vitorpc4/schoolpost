import { z } from "zod";

const getPostByKeyWord = z.object({
    search: z.coerce.string()
  })

type GetPostByKeyWord = z.infer<typeof getPostByKeyWord>;

export { GetPostByKeyWord, getPostByKeyWord };