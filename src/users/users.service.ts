import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserStatus } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import { AcceptInvite } from './dto/accept-invite-dto';
import bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const role = await this.prisma.role.findUnique({
      where: {
        id: createUserDto.roleId,
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (existingUser) {
      throw new ConflictException('User is already exists with this email');
    }

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        status: UserStatus.DRAFT,
      },
      include: {
        role: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        role: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        role: true,
      },
    });
    return user;
  }

  async inviteUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = randomUUID();

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        status: UserStatus.INVITED,
        invitationToken: token,
        invitationExpires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    return {
      message: 'User Invited Successfully',
      data: updatedUser,
    };
  }

  async acceptInvitation(dto: AcceptInvite) {
    const { token, password, confirmPassword } = dto;

    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }

    const user = await this.prisma.user.findFirst({
      where: {
        invitationToken: token,
      },
      include: {
        role: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Invalid invite link');
    }

    if (user.status !== UserStatus.INVITED) {
      throw new BadRequestException('Invitation is not valid');
    }

    if (!user.invitationExpires || user.invitationExpires < new Date()) {
      throw new BadRequestException('Invitation link expires');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updateUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        status: UserStatus.ACTIVE,
        invitationToken: null,
        invitationExpires: null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        status: true,
        role: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
    return {
      message: 'Account activated successfully',
      data: updateUser,
    };
  }
}
