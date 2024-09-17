import dataSource from "@/database/data-source"
import { School } from "@/entities/models/school.entity"
import { DataSource } from "typeorm"
import { Seeder, SeederFactoryManager } from "typeorm-extension"

export default class SchoolSeeder implements Seeder {
    track = false

    public async run(DataSource: DataSource,
        factoryManager: SeederFactoryManager): Promise<any> 
    {
        const repository = dataSource.getRepository(School)


        const schoolFactory = await factoryManager.get(School)

        schoolFactory.saveMany(10);
    }
    
}