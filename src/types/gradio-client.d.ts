declare module "@gradio/client" {
  export class Client {
    static connect(spaceIdOrUrl: string, options?: Record<string, unknown>): Promise<Client>;
    predict(endpoint: string, payload: Record<string, unknown>): Promise<{ data: unknown }>;
  }
}


