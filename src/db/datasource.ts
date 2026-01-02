import 'dotenv/config';
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ['dist/**/*.entity.js'],
    //autoLoadEntities: true,
    synchronize: false,
    migrations: ['dist/**/migrations/*.js'],
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;


/*

docker exec backend_app npm run migration:generate --name=add-isArchived-to-projects


docker exec backend_app npm run migration:run

*/ 