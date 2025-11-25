import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { MovementsService } from './movements.service';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  create(@Body() createMovementDto: CreateMovementDto, @Req() req) {
    const userId = (req.user as { id: number }).id;
    return this.movementsService.create(createMovementDto, userId);
  }

  @Get()
  findAll(@Req() req) {
    const userId = (req.user as { id: number }).id;
    return this.movementsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const userId = (req.user as { id: number }).id;
    return this.movementsService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovementDto: UpdateMovementDto,
    @Req() req,
  ) {
    const userId = (req.user as { id: number }).id;
    return this.movementsService.update(+id, updateMovementDto, userId);
  }

  @Delete()
  removeAll(@Req() req) {
    const userId = (req.user as { id: number }).id;
    return this.movementsService.removeAll(userId);
  }
}
