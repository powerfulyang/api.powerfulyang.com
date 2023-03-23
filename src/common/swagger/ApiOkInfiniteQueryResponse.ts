import type { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';

class InfiniteQueryResponse {
  @ApiPropertyOptional({
    type: 'number',
  })
  prevCursor: number;

  @ApiPropertyOptional({
    type: 'number',
  })
  nextCursor: number;
}

export const ApiOkInfiniteQueryResponse = <T extends Type>(options: {
  model: T;
  description?: string;
}) => {
  const { model, description } = options;
  const ref = { $ref: getSchemaPath(model) };
  return applyDecorators(
    ApiExtraModels(model),
    ApiExtraModels(InfiniteQueryResponse),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(InfiniteQueryResponse),
          },
          {
            properties: {
              resources: {
                type: 'array',
                items: ref,
              },
            },
            required: ['resources'],
          },
        ],
      },
    }),
  );
};
