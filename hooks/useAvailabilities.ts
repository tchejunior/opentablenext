import axios from 'axios';
import { useState } from 'react';

export default function useAvailabilities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchAvailabilities = async ({
    slug,
    day,
    time,
    partySize,
  }: {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  }) => {
    setLoading(true);

    try {
      const response = await axios.get(`/api/restaurant/${slug}/availability`, {
        params: {
          day,
          time,
          partySize,
        },
      });
      setLoading(false);
      setData(response.data);
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.errorMessage);
    }
  };

  return { loading, error, data, fetchAvailabilities };
}
