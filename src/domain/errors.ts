export type ErpErrorCode =
  | 'AUTH_REQUIRED'
  | 'ACCESS_PROFILE_MISSING'
  | 'ACCESS_INACTIVE'
  | 'ACCESS_ROLE_DENIED'
  | 'ACCESS_PROJECT_DENIED'
  | 'NETWORK_UNAVAILABLE'
  | 'PERMISSION_DENIED'
  | 'NOT_FOUND'
  | 'CONFLICT_STALE'
  | 'CONFIG_VERSION_MISMATCH'
  | 'CALCULATION_VERSION_UNSUPPORTED'
  | 'UNEXPECTED';

const messages: Record<ErpErrorCode, string> = {
  AUTH_REQUIRED: 'Sign in to continue.',
  ACCESS_PROFILE_MISSING: 'Your ERP access is not configured. Contact the ERP administrator.',
  ACCESS_INACTIVE: 'Your ERP access is inactive. Contact the ERP administrator.',
  ACCESS_ROLE_DENIED: 'Your account is not authorized for this commercial workspace.',
  ACCESS_PROJECT_DENIED: 'Your account is not authorized for this commercial workspace.',
  NETWORK_UNAVAILABLE: 'The connection is unavailable. Check the network and try again.',
  PERMISSION_DENIED: 'The requested action is not authorized.',
  NOT_FOUND: 'The requested record is not available.',
  CONFLICT_STALE: 'This record changed after you opened it. Reload the latest version.',
  CONFIG_VERSION_MISMATCH: 'The application configuration changed. Reload before continuing.',
  CALCULATION_VERSION_UNSUPPORTED: 'This calculation version is not supported by the current release.',
  UNEXPECTED: 'The action could not be completed. Try again or sign out.',
};

export class ErpError extends Error {
  constructor(
    public readonly code: ErpErrorCode,
    public readonly reference = crypto.randomUUID().slice(0, 8).toUpperCase(),
  ) {
    super(messages[code]);
    this.name = 'ErpError';
  }
}

export function toErpError(error: unknown): ErpError {
  if (error instanceof ErpError) return error;
  if (error instanceof Error) {
    if (/permission-denied/i.test(error.message)) return new ErpError('PERMISSION_DENIED');
    if (/network|offline|unavailable/i.test(error.message)) return new ErpError('NETWORK_UNAVAILABLE');
    if (/not-found/i.test(error.message)) return new ErpError('NOT_FOUND');
  }
  return new ErpError('UNEXPECTED');
}
