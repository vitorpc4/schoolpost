import { z } from "zod";

const getAllByNumberId = z.object({
    id: z.coerce.number()
});

type GetAllByNumberId = z.infer<typeof getAllByNumberId>;

export { GetAllByNumberId, getAllByNumberId };