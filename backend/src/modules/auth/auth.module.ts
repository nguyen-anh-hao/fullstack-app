import { Module, DynamicModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        UsersModule.forRoot(),
        PassportModule,
        JwtModule.register({
          secret: 'SECRET_KEY',
          signOptions: { expiresIn: '60s' },
        }),
      ],
    };
  }
}
