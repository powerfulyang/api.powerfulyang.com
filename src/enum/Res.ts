export enum RetCode {
  RET_OK,
  NONE_OK,
  COMMON_ERROR,
}
export const RetMsg = ['SUCCESS', 'WITH_NO_RESPONSE', 'COMMON_ERROR'];
export const formatError = (retCode: RetCode) => {
  return RetMsg[retCode];
};
