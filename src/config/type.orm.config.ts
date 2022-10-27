import { TypeOrmModule } from '@nestjs/typeorm'

const typeOrmConfig = TypeOrmModule.forRoot({
      type: 'mysql',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true
})

export default typeOrmConfig

