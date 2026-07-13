declare module "tdesign-miniprogram/toast" {
  export interface ToastOptionsType {
    message: string;
    theme?: string;
    direction?: string;
    [key: string]: unknown;
  }

  export default function Toast(
    options: ToastOptionsType & { context: unknown; selector: string },
  ): void;
}

declare module "tdesign-miniprogram/toast/index" {
  export interface ToastOptionsType {
    message: string;
    theme?: string;
    direction?: string;
    [key: string]: unknown;
  }

  export default function Toast(
    options: ToastOptionsType & { context: unknown; selector: string },
  ): void;
}
