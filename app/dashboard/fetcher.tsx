import IResponse from "@/types/response";

export default async function fetcher<T extends IResponse>(url: string) {
  const res = await fetch(url)
  const data =  await res.json() as T;

  if (data.type === "success" && data.message === "refreshed") {
    const retryRes = await fetch(url);
    const retryData = await retryRes.json() as T;
    return retryData;
  }

  return data;
}
