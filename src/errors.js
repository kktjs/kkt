// 与用户输入或配置相关的错误，
// 或用户的其他内容负责并可以解决。

export class UserError {
  message: string;
  constructor(...messages: string[]) {
    this.message = messages.join('\n')
  }
}

export class KarmaExitCodeError {
  exitCode: number;
  constructor(exitCode: number) {
    this.exitCode = exitCode
  }
}

export class ConfigValidationError {
  report: Object;
  constructor(report: Object) {
    this.report = report
  }
}
