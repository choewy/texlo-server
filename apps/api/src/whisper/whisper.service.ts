import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WhisperService {
  constructor(private readonly httpService: HttpService) {}
}
