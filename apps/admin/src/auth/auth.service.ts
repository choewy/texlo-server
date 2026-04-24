import { Inject, Injectable } from '@nestjs/common';

import { AdminStatus } from '../shared';

import { AdminNotApprovedException, EmailAlreadyExistsException, InvalidCredentialsException, InvalidTokenException } from './exceptions';
import { ADMIN_REPOSITORY, type AdminRepository } from './repositories';
import { ACCESS_TOKEN_ISSUER, type AccessTokenIssuer, PASSWORD_HASHER, type PasswordHasher, REFRESH_TOKEN_ISSUER, type RefreshTokenIssuer } from './security';
import { LoginInput, LoginResult, LogoutInput, RefreshTokenInput, RefreshTokenResult, RegisterInput, RegisterResult } from './usecases';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: AdminRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(ACCESS_TOKEN_ISSUER)
    private readonly accessTokenIssuer: AccessTokenIssuer,
    @Inject(REFRESH_TOKEN_ISSUER)
    private readonly refreshTokenIssuer: RefreshTokenIssuer,
  ) {}

  async login(input: LoginInput): Promise<LoginResult> {
    const admin = await this.adminRepository.findOneByEmail(input.email);

    if (!admin) {
      throw new InvalidCredentialsException();
    }

    const verified = await this.passwordHasher.compare(input.password, admin.password);

    if (!verified) {
      throw new InvalidCredentialsException();
    }

    if (admin.status !== AdminStatus.Approved) {
      throw new AdminNotApprovedException();
    }

    const accessToken = await this.accessTokenIssuer.issue({ id: admin.id });
    const refreshToken = await this.refreshTokenIssuer.issue({ id: admin.id }, accessToken);

    return { accessToken, refreshToken };
  }

  async register(input: RegisterInput): Promise<RegisterResult> {
    const has = await this.adminRepository.hasByEmail(input.email);

    if (has) {
      throw new EmailAlreadyExistsException();
    }

    const admin = await this.adminRepository.insert({
      email: input.email,
      name: input.name,
      password: await this.passwordHasher.hash(input.password),
    });

    const accessToken = await this.accessTokenIssuer.issue({ id: admin.id });
    const refreshToken = await this.refreshTokenIssuer.issue({ id: admin.id }, accessToken);

    return { accessToken, refreshToken };
  }

  async refresh(input: RefreshTokenInput): Promise<RefreshTokenResult> {
    const value = await this.refreshTokenIssuer.get(input.refreshToken);

    if (!value) {
      throw new InvalidTokenException();
    }

    if (value.accessToken !== input.accessToken) {
      throw new InvalidTokenException();
    }

    const accessToken = await this.accessTokenIssuer.issue(value);
    const refreshToken = await this.refreshTokenIssuer.issue(value, accessToken);

    await this.refreshTokenIssuer.revoke(input.refreshToken);

    return { accessToken, refreshToken };
  }

  async logout(input: LogoutInput): Promise<void> {
    const value = await this.refreshTokenIssuer.get(input.refreshToken);

    if (!value) {
      return;
    }

    if (value.accessToken !== input.accessToken) {
      return;
    }

    await this.refreshTokenIssuer.revoke(input.refreshToken);
  }
}
