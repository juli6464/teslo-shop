import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto,LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    
    try {

      const {password, ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);
      delete user.password;
          //retornar jwt acceso
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
      //todo: retornar JWT de acceso

    } catch (error) {
      this.handleDBError(error);
    }
  }

  async login( loginUserDto: LoginUserDto) {

    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({ 
      where: { email },
      select: { email: true, password: true, id: true }
     });

     if (!user) 
     throw new UnauthorizedException('Credentials are not valid (email)');
     
    if ( !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');
    
    
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
    //retornar jwt acceso
  }

  async checkAuthStatus( user: User) {
    
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  private getJwtToken( payload: JwtPayload) {

    const token = this.jwtService.sign( payload );
    return token;
  }

  private handleDBError(error: any): never {
    
    if (error.code === '23505') 
      throw new BadRequestException(error.detail);
      console.log(error);
      
      throw new InternalServerErrorException('Please check server logs');
  }

}
