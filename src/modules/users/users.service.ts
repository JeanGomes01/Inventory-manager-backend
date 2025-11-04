import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return { ...user, password: undefined };
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
  }

  async findById(id: number): Promise<{ id: number; email: string } | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true },
    });
  }

  async findByEmail(
    email: string,
  ): Promise<{ id: number; email: string; password: string } | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;

    const data: Partial<CreateUserDto> = { ...rest };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true },
    });
    return updatedUser;
  }
  async remove(id: number) {
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User removed successfully' };
  }
}
