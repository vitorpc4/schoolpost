import { TypeUser } from "@/entities/models/userSchoolAssociation.entity";
import { z } from "zod";

const create = z.object({
    userId: z.number(),
    schoolId: z.coerce.string().uuid("Invalid UUID"),
    status: z.boolean(),
    typeUser: z.nativeEnum(TypeUser),
    admin: z.boolean()
});

type Create = z.infer<typeof create>;

export { Create, create };