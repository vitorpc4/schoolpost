import { TypeUser } from "@/entities/models/userSchoolAssociation.entity";
import { z } from "zod";

const update = z.object({
    userId: z.number(),
    schoolId: z.coerce.string().uuid("Invalid UUID"),
    status: z.boolean(),
    typeUser: z.nativeEnum(TypeUser),
    admin: z.boolean()
});

type Update = z.infer<typeof update>;

export { Update, update };