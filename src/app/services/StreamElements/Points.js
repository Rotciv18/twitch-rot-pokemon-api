import streamElementsApi from './streamElementsApi';
import channelConfig from '../../../config/channel';

export const addPoints = async (username, amount) => {
  const response = await streamElementsApi.put(
    `points/${channelConfig.channelId}/${username}/${amount.toString()}`
  );

  return response.data;
};

export const getUserPoints = async (username) => {
  try {
    const response = await streamElementsApi.get(
      `points/${channelConfig.channelId}/${username}`
    );

    return response.data.points;
  } catch (error) {
    return { error };
  }
};
