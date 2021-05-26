import { Controller, Get, Logger, Param, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from '../../core/entities/user/user.entity';
import {PaginationModel} from "../../core/model/pagination-model";

@Controller('api/user')
export class UserController {
  logger: Logger = new Logger(this.constructor.name);

  constructor(private userService: UserService) {}

  @Get('')
  async userStatus() {
    return 'User Ok!';
  }

  @Get('init')
  async initMockData(): Promise<UserEntity[]> {
    return this.userService.initializeDatabase();
  }
  
  @Get('query=:query?&:pageSize&:pageIndex')
  async filterUsersWithPagination(@Req() req, @Param() { query, pageSize, pageIndex }): Promise<UserEntity[] | PaginationModel<UserEntity>> {
    try {
      pageSize = Number(pageSize.replace('PageSize=', ''));
      pageIndex = Number(pageIndex.replace('PageIndex=', ''));
    } catch (e) {
      pageSize = undefined;
      pageIndex = undefined;
    }
    
    return await this.userService.query(query, pageSize, pageIndex);
  }

  @Get('query=:query?')
  async filterUsers(@Req() req, @Param() { query }): Promise<UserEntity[] | any> {
    return await this.userService.query(query);
  }
}
