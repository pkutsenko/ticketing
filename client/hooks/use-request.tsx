import axios from 'axios';
import React, {ReactNode, useState} from 'react';

interface Params {
  url: string;
  method: 'get' | 'post';
  body: object;
  onSuccess: (data: any) => void;
}

export default ({ url, method, body, onSuccess }: Params) => {
  const [errors, setErrors] = useState<ReactNode | null>(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err: any) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err?.response?.data?.errors?.map((err: any) => (
              <li key={err?.message}>{err?.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
