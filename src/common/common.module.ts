import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './services/email.service';
import { CommonLogger } from './logger/logger.service';
import { DuplicateKeyFilter } from './filters/duplicate-key.filter';
import { PaginationTransformer } from './transformers/pagination.transformer';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    EmailService,
    CommonLogger,
    DuplicateKeyFilter,
    PaginationTransformer,
  ],
  exports: [
    EmailService,
    CommonLogger,
    DuplicateKeyFilter,
    PaginationTransformer,
  ],
})
export class CommonModule {}
