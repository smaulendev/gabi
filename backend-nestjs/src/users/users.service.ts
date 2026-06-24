import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>) {
    const user = this.usersRepository.create({
      ...userData,
      role: userData.role || 'OPERADOR',
    });

    return this.usersRepository.save(user);
  }

  async createUser(userData: Partial<User>) {
    const existingUser = await this.findByEmail(
      userData.email!,
    );

    if (existingUser) {
      throw new BadRequestException(
        'El correo ya se encuentra registrado',
      );
    }

    const validRoles = [
      'ADMIN',
      'OPERADOR',
      'AUDITOR',
    ];

    const role = validRoles.includes(
      String(userData.role).toUpperCase(),
    )
      ? String(userData.role).toUpperCase()
      : 'OPERADOR';

    const hashedPassword = await bcrypt.hash(
      userData.password!,
      10,
    );

    const user = this.usersRepository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role,
    });

    const savedUser =
      await this.usersRepository.save(user);

    const { password, ...userWithoutPassword } =
      savedUser;

    return userWithoutPassword;
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async findAll() {
    const users = await this.usersRepository.find({
      order: {
        id: 'ASC',
      },
    });

    return users.map((user) => {
      const { password, ...userWithoutPassword } =
        user;

      return userWithoutPassword;
    });
  }
}