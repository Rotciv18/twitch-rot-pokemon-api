import streamLabsApi from './streamLabsApi';

// eslint-disable-next-line import/prefer-default-export
export const triggerAlert = async (params) => {
  const response = await streamLabsApi.post('alerts', params);

  return response.data;
};
