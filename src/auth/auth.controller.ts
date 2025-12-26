import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Role } from './roles.enum';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GenerateResetTokenDto } from './dto/generate-reset-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user with email and password',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns access token and user data',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  logout() {
    return { message: 'Logged out' };
  }

  /**
   * Admin-only endpoint to generate magic link for password reset
   * Used when user forgets password and meets admin in person
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('generate-reset-link')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Generate magic link for password reset (Admin only)',
    description:
      'Admin generates a short-lived magic link for a user who forgot their password. Link expires in 10 minutes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns magic link and token details',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async generateResetLink(@Body() dto: GenerateResetTokenDto) {
    return this.authService.generateResetToken(dto.userId);
  }

  @Get('validate-reset-token')
  @ApiOperation({
    summary: 'Validate reset token',
    description: 'Check if password reset token/magic link is valid',
  })
  @ApiResponse({
    status: 200,
    description: 'Token is valid, returns user info',
  })
  @ApiResponse({ status: 400, description: 'Token is invalid or expired' })
  async validateResetToken(@Query('token') token: string) {
    return this.authService.validateResetToken(token);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description: 'Set new password using magic link token',
  })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change password',
    description: 'Change password for authenticated user',
  })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Current password is incorrect' })
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(
      (req as { user: { userId: string } }).user.userId,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}
