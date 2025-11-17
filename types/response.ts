export default interface IResponse {
  type: "success" | "error",
  message: string,
  body?: object
}
