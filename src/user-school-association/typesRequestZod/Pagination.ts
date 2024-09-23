import { z } from "zod";

const pagination = z.object({
    limit: z.coerce.number().default(10),
    page: z.coerce.number().default(1),
});

type Pagination = z.infer<typeof pagination>;

export { Pagination, pagination };