import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly auditService: AuditService,
  ) {}

  private removePassword(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(userData: Partial<User>) {
    const user = this.usersRepository.create({
      ...userData,
      role: userData.role || 'OPERADOR',
    });

    return this.usersRepository.save(user);
  }

  async createUser(userData: Partial<User>) {
    const existingUser = await this.findByEmail(userData.email!);

    if (existingUser) {
      throw new BadRequestException(
        'El correo ya se encuentra registrado',
      );
    }

    const validRoles = ['ADMIN', 'OPERADOR', 'AUDITOR'];

    const role = validRoles.includes(
      String(userData.role).toUpperCase(),
    )
      ? String(userData.role).toUpperCase()
      : 'OPERADOR';

    const hashedPassword = await bcrypt.hash(userData.password!, 10);

    const user = this.usersRepository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role,
      isActive: true,
    });

    const savedUser = await this.usersRepository.save(user);

    await this.auditService.createLog(
      'USER_CREATE',
      'USER',
      `Usuario ${savedUser.email} creado con rol ${savedUser.role}`,
      savedUser.email,
      savedUser.role,
    );

    return this.removePassword(savedUser);
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

    return users.map((user) => this.removePassword(user));
  }

  async update(id: number, userData: Partial<User>) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (userData.role) {
      userData.role = String(userData.role).toUpperCase();
    }

    await this.usersRepository.update(id, userData);

    const updatedUser = await this.usersRepository.findOne({
      where: { id },
    });

    if (!updatedUser) {
      throw new BadRequestException('Usuario no encontrado');
    }

    await this.auditService.createLog(
      'USER_UPDATE',
      'USER',
      `Usuario ${updatedUser.email} actualizado. Rol actual: ${updatedUser.role}`,
      updatedUser.email,
      updatedUser.role,
    );

    return this.removePassword(updatedUser);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    user.isActive = false;

    const disabledUser = await this.usersRepository.save(user);

    await this.auditService.createLog(
      'USER_DISABLE',
      'USER',
      `Usuario ${disabledUser.email} desactivado`,
      disabledUser.email,
      disabledUser.role,
    );

    return {
      message: 'Usuario desactivado correctamente',
    };
  }
}