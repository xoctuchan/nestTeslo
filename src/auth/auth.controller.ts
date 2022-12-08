import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeader, RoleProtected } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces/valid-roles';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user:User,
    @RawHeader() rawHeaders: String[]
  ){
    return { 
      ok: true,
      message: 'Hola mundo private',
      user,
      rawHeaders
    }
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user:User
  )
  {
    return this.authService.checkAuthStatus(user);
  }


  //@SetMetadata('roles',['admin','super-user'])
  @Get('private2')
  @RoleProtected(ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user:User,
  ){
    return { 
      ok: true,
      message: 'Hola mundo private',
      user
    }
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute3(
    @GetUser() user:User,
  ){
    return { 
      ok: true,
      message: 'Hola mundo private',
      user
    }
  }
}
