import { MemberService } from './memberService'
import { SpaceService } from './spaceService'
import { MessageService } from './messageService'
import { ChannelService } from './channelService'

export const SpaceServices = {
  members: MemberService,
  spaces: SpaceService,
  messages: MessageService,
  channels: ChannelService,
}

export { MemberService, SpaceService, MessageService, ChannelService }
