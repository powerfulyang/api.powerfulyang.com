import type { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiOkPaginateQueryResponse = <T extends Type>(options: {
  model: T;
  description?: string;
}) => {
  const { model, description } = options;
  const ref = { $ref: getSchemaPath(model) };
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description,
      schema: {
        type: 'array',
        items: {
          oneOf: [
            {
              type: 'array',
              items: ref,
            },
            {
              type: 'number',
            },
          ],
        },
      },
    }),
  );
};
