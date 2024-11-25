import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { compare } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { decode, JwtPayload } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

interface Payload extends JwtPayload {
  userId: string;
  login: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly storage: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(authDto: AuthDto) {
    return this.usersService.create(authDto);
  }

  async login(authDto: AuthDto) {
    const user = await this.storage.user.findFirst({
      where: { login: authDto.login },
    });
    if (!user) {
      throw new ForbiddenException(
        `User with login ${authDto.login} not found`,
      );
    }
    const isPasswordMatched = await compare(authDto.password, user.password);

    if (!isPasswordMatched) {
      throw new ForbiddenException(
        `Password for user ${authDto.login} incorrect`,
      );
    }

    const authPayload = { userId: user.id, login: user.login };
    return this.generateTokens(authPayload);
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    try {
      await this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
    } catch {
      throw new ForbiddenException('Refresh token invalid');
    }

    const { userId, login } = decode(refreshTokenDto.refreshToken) as Payload;
    return this.generateTokens({ userId, login });
  }

  private async generateTokens(payload: Payload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    });

    return { accessToken, refreshToken };
  }
}
