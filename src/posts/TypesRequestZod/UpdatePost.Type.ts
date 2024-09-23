import { z } from "zod";

const updatePostScheme = z.object({
    title: z.string(),
    content: z.string(),
    isDraft: z.boolean(),
    status: z.boolean(),
  });

  
type UpdatePost = z.infer<typeof updatePostScheme>;


export { UpdatePost, updatePostScheme };