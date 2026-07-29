import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class IsNotEmptyObjectPipe implements PipeTransform {
    transform(value: any) {
        if (!value || Object.keys(value).length === 0){
            throw new BadRequestException('No fields to update');
        }
        return value;
    }
}