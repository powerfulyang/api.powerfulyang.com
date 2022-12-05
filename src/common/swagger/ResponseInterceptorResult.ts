import type { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiResponseProperty, getSchemaPath } from '@nestjs/swagger';

class ResponseInterceptorResult {
  @ApiResponseProperty()
  timestamp: string;

  @ApiResponseProperty()
  path: string;

  @ApiResponseProperty()
  pathViewCount: number;
}

export const ApiOkInterceptorResultResponse = <T extends Type>(options: {
  model: T;
  description?: string;
  isArray?: boolean;
}) => {
  const { model, description, isArray } = options;
  const ref = { $ref: getSchemaPath(model) };
  return applyDecorators(
    ApiExtraModels(ResponseInterceptorResult),
    ApiExtraModels(model),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(ResponseInterceptorResult),
          },
          {
            properties: {
              data: isArray ? { type: 'array', items: ref } : ref,
            },
          },
        ],
      },
    }),
  );
};
