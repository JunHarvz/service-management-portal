import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from './dto/login-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: LoginRequestDto): Promise<{ access_token: string }> {
    const userAccount = await this.checkEmailAndPassword(signInDto);

    const user = await this.usersService.findOne(signInDto.username);
    if (user?.password !== signInDto.password) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.userId, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async checkEmailAndPassword(signInDto: LoginRequestDto) {
    const { password } = signInDto;

    const hashedpw = password;

    return password;
  }
}
