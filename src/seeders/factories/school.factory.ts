import { School } from "@/entities/models/school.entity";
import { setSeederFactory } from "typeorm-extension";

export default setSeederFactory(School, (fake) => {
    const school = new School();
    school.name = fake.company.name();
    school.status = true;

    return school;
})