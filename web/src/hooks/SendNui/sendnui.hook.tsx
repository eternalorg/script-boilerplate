import axios from "axios";

export const useSendNui = async <T = unknown,>(
  nuiEndpoint: string,
  eventName: string,
  data?: unknown,
  details?: { data: T; delay?: number }
): Promise<T> => {
  if (details) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(details.data), details.delay || 0);
    });
  }

  try {
    const url = `https://${nuiEndpoint}/${eventName}`;

    const response = await axios.post<T>(url, data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching NUI: ${error}`);
    throw error;
  }
};
