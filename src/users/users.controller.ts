import { Controller, Get, Put, Param, Body, Query, Patch } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userService : UsersService) {}

    @Patch(':id/status')
    async updateStatus(
        @Param('id') userId : string,
        @Body('isActive') isActive : boolean
    ) {
        return this.userService.markUserActiveStatus(userId, isActive);
    }

    @Get()
    async getAllUsers(
        @Query('keyword') keyword: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('page') page: string,
        @Query('limit') limit: string,
    ) {
        const parsedStartDate = startDate ? new Date(startDate) : null;
        const parsedEndDate = endDate ? new Date(endDate) : null;
        const pageNumber = parseInt(page, 10) || 1;
        const pageSize = parseInt(limit, 10) || 10;
        return this.userService.findAllUsers(keyword, parsedStartDate, parsedEndDate, pageNumber, pageSize);
    }
}
