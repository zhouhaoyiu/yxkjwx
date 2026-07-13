/// <reference types="miniprogram-api-typings" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}

interface MiniEvent<
  Detail = Record<string, unknown>,
  Dataset = Record<string, unknown>,
> {
  detail: Detail;
  target: { dataset: Dataset };
  currentTarget: { dataset: Dataset };
}

interface WorkItem {
  id: number;
  workContent: string;
  workPosition: string;
  [key: string]: string | number;
}

interface RecordJob {
  jobDate: string;
  positionList: string;
  interruptList: string;
  [key: string]: unknown;
}

interface GroupedRecordJobs {
  jobDate: string;
  jobInfo: RecordJob[];
}

interface WorkJobPayload {
  protectiveMeasureGroups: string;
  status: number;
  workDate: string;
  workList: string;
  zyfzr: string;
  jhry: string;
  zyry: string;
  spfzr: string;
  spfzrBase64: string;
  spfzrInfo: string;
  verifyDate: string;
}
