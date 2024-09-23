import { z } from "zod";

const createPostScheme = z.object({
    title: z.string(),
    content: z.string(),
    isDraft: z.boolean(),
    status: z.boolean(),
    associationSchool: z.number(),
  });

type CreatePost = z.infer<typeof createPostScheme>;

export { CreatePost, createPostScheme };