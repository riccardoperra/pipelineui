import {Transport} from '@open-rpc/client-js/build/transports/Transport';
import {
  getNotifications,
  type IJSONRPCData,
  type JSONRPCRequestData,
} from '@open-rpc/client-js/build/Request';

export class PostMessageWorkerTransport extends Transport {
  public worker: undefined | null | Worker;
  public postMessageID: string;

  constructor(worker: Worker) {
    super();
    this.worker = worker;
    this.postMessageID = `post-message-transport-${Math.random()}`;
  }

  private messageHandler = (ev: MessageEvent) => {
    this.transportRequestManager.resolveResponse(JSON.stringify(ev.data));
  };

  public connect(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.worker?.addEventListener('message', this.messageHandler);
      resolve();
    });
  }

  public async sendData(
    data: JSONRPCRequestData,
    timeout: number | null = 5000,
  ): Promise<any> {
    const prom = this.transportRequestManager.addRequest(data, null);
    const notifications = getNotifications(data);
    if (this.worker) {
      this.worker.postMessage((data as IJSONRPCData).request);
      this.transportRequestManager.settlePendingRequest(notifications);
    }
    return prom;
  }

  public close(): void {
    this.worker?.terminate();
  }
}

export async function createWorkerProtocol(
  workerLoader: () => Promise<Worker>,
) {
  const worker = await workerLoader();
  return new PostMessageWorkerTransport(worker);
}
