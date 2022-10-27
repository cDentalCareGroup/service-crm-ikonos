import { TypeOrmModule } from '@nestjs/typeorm'

const typeOrmConfig = TypeOrmModule.forRoot({
      type: 'mysql',
      username: 'root',
      password: 'password',
      port: 3306,
      database: 'crm_db',
      host: 'localhost',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true
})

export default typeOrmConfig