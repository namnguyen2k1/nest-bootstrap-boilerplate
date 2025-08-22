import { PublicAPI } from "@auth/decorators/public-api.decorator";
import { applyDecorators, HttpStatus, Type } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
  OmitType,
} from "@nestjs/swagger";

export class BaseResponse<T = unknown> {
  @ApiProperty({ enum: HttpStatus })
  status: HttpStatus;

  @ApiProperty()
  message: string | string[];

  @ApiProperty()
  data: T;
}

class ErrorResponse extends OmitType(BaseResponse, ["data"]) {
  @ApiProperty({ required: false, type: [String] })
  errors?: string[];
}

type ResponseOptions = {
  description?: string;
  created?: boolean;
  public?: boolean;
  pick?: HttpStatus[];
  omit?: HttpStatus[];
  model?: Type<unknown> | [Type<unknown>];
};

const RESPONSE_MAP: Partial<
  Record<
    HttpStatus,
    {
      decorator: (...args: any[]) => MethodDecorator;
      description: string;
      example: Record<string, any>;
    }
  >
> = {
  [HttpStatus.BAD_REQUEST]: {
    decorator: ApiBadRequestResponse,
    description: "Invalid request",
    example: {
      status: HttpStatus.BAD_REQUEST,
      message: "Invalid request",
    },
  },
  [HttpStatus.UNAUTHORIZED]: {
    decorator: ApiUnauthorizedResponse,
    description: "Unauthorized",
    example: {
      status: HttpStatus.UNAUTHORIZED,
      message: "Account is not logged in or does not exist",
    },
  },
  [HttpStatus.FORBIDDEN]: {
    decorator: ApiForbiddenResponse,
    description: "Access denied",
    example: {
      status: HttpStatus.FORBIDDEN,
      message: "You do not have permission to access this resource",
    },
  },
  [HttpStatus.INTERNAL_SERVER_ERROR]: {
    decorator: ApiInternalServerErrorResponse,
    description: "Internal server error",
    example: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred, please try again later",
      errors: [],
    },
  },
  [HttpStatus.TOO_MANY_REQUESTS]: {
    decorator: ApiTooManyRequestsResponse,
    description: "Too many requests in a short period of time",
    example: {
      status: 429,
      message: "ThrottlerException: Too Many Requests",
      errors: [],
    },
  },
};

export function SwaggerResponse(options: ResponseOptions = {}) {
  const { description, created = false, public: isPublic = false, pick, omit, model } = options;

  const statusCode = created ? HttpStatus.CREATED : HttpStatus.OK;

  const decorators: MethodDecorator[] = [];

  if (description) {
    decorators.push(ApiOperation({ summary: description }));
  }

  if (isPublic) {
    decorators.push(PublicAPI());
  }

  const includedStatuses = pick?.length
    ? pick
    : (Object.keys(RESPONSE_MAP).map(Number) as HttpStatus[]);

  const finalStatuses = includedStatuses.filter((code) => !omit?.includes(code));

  const AUTH_STATUSES = [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN];

  for (const code of finalStatuses) {
    const config = RESPONSE_MAP[code];
    if (!config) continue;

    if (isPublic && AUTH_STATUSES.includes(code)) {
      continue;
    }

    decorators.push(
      config.decorator({
        description: config.description,
        example: config.example,
        type: ErrorResponse,
      }),
    );
  }

  // Successful response
  const responseSchema = model
    ? {
        schema: {
          allOf: [
            { $ref: getSchemaPath(BaseResponse) },
            {
              properties: {
                data: Array.isArray(model)
                  ? {
                      type: "array",
                      items: { $ref: getSchemaPath(model[0]) },
                    }
                  : {
                      $ref: getSchemaPath(model),
                    },
              },
            },
          ],
        },
      }
    : {
        type: BaseResponse,
      };

  decorators.push(
    ApiResponse({
      status: statusCode,
      description: created ? "Create Successful" : "Successful",
      example: {
        status: statusCode,
        message: "Successful",
        data: Array.isArray(model) ? [{}] : {},
      },
      ...responseSchema,
    }),
  );

  return applyDecorators(...decorators);
}
