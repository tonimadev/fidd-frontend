import { apiClient } from './api-client';

export interface IssueNfcVoucherRequest {
  campaignId: number;
  amount: number;
}

export interface IssueNfcVoucherResponse {
  token: string;
  amount: number;
  expiresAt: string;
}

export const nfcApiService = {
  async issueVoucher(data: IssueNfcVoucherRequest): Promise<IssueNfcVoucherResponse> {
    const response = await apiClient.post<IssueNfcVoucherResponse>('/api/web/v1/nfc/issue', data);
    return response.data;
  }
};
