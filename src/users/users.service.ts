import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as bcrypt from 'bcrypt';

import * as schema from '../db/schema';
import { DRIZZLE } from '../db/db.module';
import { User, NewUser } from '../db/schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NeonHttpDatabase<typeof schema>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    return user;
  }

  async findById(userId: string): Promise<User> {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId));

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async createUser(email: string, password: string): Promise<User> {
    const newUser: NewUser = { email, password };

    const [user] = await this.db
      .insert(schema.users)
      .values(newUser)
      .returning();

    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(userId);

    if (user.email === dto.email) {
      return user;
    }

    const existingUser = await this.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const [updatedUser] = await this.db
      .update(schema.users)
      .set({ email: dto.email })
      .where(eq(schema.users.id, userId))
      .returning();

    return updatedUser;
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.findById(userId);

    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        'New password must be different from the current password',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.db
      .update(schema.users)
      .set({ password: hashedPassword })
      .where(eq(schema.users.id, userId));

    return { message: 'Password updated successfully' };
  }

  async deleteAccount(userId: string): Promise<{ message: string }> {
    await this.findById(userId);

    await this.db.delete(schema.users).where(eq(schema.users.id, userId));

    return { message: 'Account deleted successfully' };
  }
}
