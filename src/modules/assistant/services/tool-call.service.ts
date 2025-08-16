export interface ExecuteToolData {
  toolName: string;
  payload: {
    [key: string]: any;
  };
}

export class ToolCallService {
  protected readonly notFound: string = 'Không tìm thấy thông tin';

  async excuseTool({ toolName, payload }: ExecuteToolData) {
    const func = (this as any)?.[toolName];
    if (!func) {
      return 'Không hỗ trợ chúc năng này';
    }
    return await func({ ...payload });
  }

  async getProjectFeature({ domain }: { domain: string }) {
    switch (domain) {
      case 'auth': {
        return {
          status: 200,
          message: 'get all features of domain successfully',
          data: ['jwt', 'role-based access control', '2fa'],
        };
      }
      case 'ai': {
        return {
          status: 200,
          message: 'get all features of domain successfully',
          data: ['create conversation', 'create chat message'],
        };
      }
      default: {
        return {
          status: 404,
          message: 'not found',
          data: null,
        };
      }
    }
  }
}
