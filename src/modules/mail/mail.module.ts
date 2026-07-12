import { Module } from '@nestjs/common';
import { MailProvider } from './mail.provider';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MT_HOST'),
          port: configService.get<number>('MT_PORT'),
          secure: configService.get<number>('MT_PORT') === 465,
          auth: {
            user: configService.get<string>('MT_USER'),
            pass: configService.get<string>('MT_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
      }),
    }),
  ],
  providers: [MailProvider],
  exports: [MailProvider],
})
export class MailModule {}
