import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { GuruService } from '../guru/guru.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordReset } from './password-reset.entity';
import { Guru } from '../guru/guru.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private guruService: GuruService,
    private jwtService: JwtService,
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
    @InjectRepository(Guru)
    private guruRepository: Repository<Guru>,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<Guru, 'password'> | null> {
    const user = await this.guruService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Omit<Guru, 'password'>) {
    const payload = { username: user.email, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: user,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.guruService.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      const newPayload = {
        username: user.email,
        sub: user.id,
        role: user.role,
      };

      return {
        accessToken: this.jwtService.sign(newPayload, { expiresIn: '1h' }),
        user: userWithoutPassword,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Admin generates a reset token for a user (in-person flow)
   * Token expires in 10 minutes (short-lived for security)
   */
  async generateResetToken(
    userId: string,
  ): Promise<{ token: string; resetLink: string; expiresAt: Date; user: any }> {
    const user = await this.guruRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan.');
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString('hex');

    // Token expires in 10 minutes (short-lived for in-person reset)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Invalidate any existing reset tokens for this user
    await this.passwordResetRepository.update(
      { guru_id: user.id, used: false },
      { used: true },
    );

    // Create new reset token
    const resetToken = this.passwordResetRepository.create({
      token,
      email: user.email,
      guru_id: user.id,
      expires_at: expiresAt,
      used: false,
    });

    await this.passwordResetRepository.save(resetToken);

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    return {
      token,
      resetLink,
      expiresAt,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
      },
    };
  }

  async validateResetToken(
    token: string,
  ): Promise<{ valid: boolean; user: any }> {
    const resetToken = await this.passwordResetRepository.findOne({
      where: {
        token,
        used: false,
        expires_at: MoreThan(new Date()),
      },
      relations: ['guru'],
    });

    if (!resetToken) {
      throw new BadRequestException('Token tidak valid atau sudah kadaluarsa.');
    }

    return {
      valid: true,
      user: {
        nama: resetToken.guru?.nama,
        email: resetToken.guru?.email,
      },
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const resetToken = await this.passwordResetRepository.findOne({
      where: {
        token,
        used: false,
        expires_at: MoreThan(new Date()),
      },
      relations: ['guru'],
    });

    if (!resetToken) {
      throw new BadRequestException('Token tidak valid atau sudah kadaluarsa.');
    }

    // Hash the new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    await this.guruRepository.update(resetToken.guru_id, {
      password: hashedPassword,
    });

    // Mark token as used
    await this.passwordResetRepository.update(resetToken.id, { used: true });

    return { message: 'Password berhasil diubah.' };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.guruRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan.');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password saat ini salah.');
    }

    // Hash the new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await this.guruRepository.update(userId, { password: hashedPassword });

    return { message: 'Password berhasil diubah.' };
  }
}
