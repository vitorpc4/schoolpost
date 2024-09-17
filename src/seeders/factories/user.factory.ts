import { TypeUser, User } from "@/entities/models/user.entity";
import { setSeederFactory } from "typeorm-extension";
import * as bcrypt from 'bcrypt';

export default setSeederFactory(User, async (fake) => {
    const user = new User();
    user.email = fake.internet.email();
    user.password = await bcrypt.hash(fake.internet.password(), 10) 
    user.status = true;
    user.TypeUser = TypeUser.Professor;
    user.username = fake.internet.userName();
    user.admin = true

    return user;
})