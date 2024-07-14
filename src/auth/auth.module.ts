import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { userModule } from 'src/api/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { MainDBModel } from 'src/libs/connections/main-db';
import { DatabaseModule } from 'src/libs/connections/database.module';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [
    DatabaseModule.mainDbModels([MainDBModel.User]),
    PassportModule,
    userModule,

    JwtModule.register({
      secret: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', // nos chuoi random
      signOptions: {
        expiresIn: '3600s', // thoiwf gian heets han cua token
      },
    }),
  ],
  controllers: [AuthController], /// cais nay khi khoi taoj ko co vi vay nho them vao
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService], /// cais nay khi khoi taoj ko co vi vay nho them vao
})
export class AuthModule {}
