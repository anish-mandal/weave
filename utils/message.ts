import type IResponse from "@/types/response"

export function success(message: string, body: object): IResponse {
  return { type: "success", message: message, body: body };
}

export function error(message: string): IResponse {
  return { type: "error", message: message }
}
