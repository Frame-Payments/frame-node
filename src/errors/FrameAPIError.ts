export class FrameAPIError extends Error {
  public code: string;
  public status: number;
  public raw: any;

  constructor(message: string, code: string, status: number, raw: any) {
    super(message);
    this.name = 'FrameAPIError';
    this.code = code;
    this.status = status;
    this.raw = raw;
  }
}