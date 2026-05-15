import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiAgentService } from './ai-agent.service';
import { AiChatDto } from './dto/ai-chat.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';

import { Roles } from '../users/decorators/user-role.decorator';

import { AuthRolesGuard } from '../users/guards/auth-roles.guard';


import type { JWTPayloadType } from '../utils/types'

import { userType } from '../utils/enums';



@Controller('api/ai-agent')
export class AiAgentController {
  constructor(private readonly aiAgentService: AiAgentService) {}

  @Post('chat')
  @Roles(userType.NORMAL_USER, userType.ADMIN)
  @UseGuards(AuthRolesGuard)
  async chat(
    @Body() dto: AiChatDto,
    @CurrentUser() user: JWTPayloadType,
  ) {
    return await this.aiAgentService.chat(dto.message, user.id);
  }
}
