import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly storage: PrismaService) {}

  async signup(authDto: AuthDto) {
    const hashPassword = await hash(authDto.password, +process.env.CRYPT_SALT);

    return this.storage.user.create({
      data: { login: authDto.login, password: hashPassword },
    });
  }
}
