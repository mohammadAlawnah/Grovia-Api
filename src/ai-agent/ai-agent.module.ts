import { Module } from '@nestjs/common';
import { AiAgentController } from './ai-agent.controller';
import { AiAgentService } from './ai-agent.service';
import { UsersModule } from '../users/users.module';

import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from '../products/products.module';

import { CartModule } from '../cart/cart.module';

@Module({
  imports: [UsersModule, JwtModule, ProductModule, CartModule],
  controllers: [AiAgentController],
  providers: [AiAgentService],
})
export class AiAgentModule {}
