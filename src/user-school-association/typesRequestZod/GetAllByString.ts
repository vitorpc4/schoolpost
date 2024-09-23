import { z } from "zod";

const getAllByString = z.object({
    id: z.coerce.string()
});

type GetAllByString = z.infer<typeof getAllByString>;

export { GetAllByString, getAllByString };