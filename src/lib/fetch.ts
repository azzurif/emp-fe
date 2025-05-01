type Props = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: BodyInit;
  auth?: boolean;
  headers?: HeadersInit;
};

const Fetch = async ({
  url,
  method,
  body,
  auth = false,
  headers = {},
}: Props) => {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
    ...(auth && {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    }),
  };

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
    method,
    headers: defaultHeaders,
    ...(body && { body }),
  });

  return await response.json();
};

export default Fetch;
