export enum ActionStatus {
  SUCCESS = 'Success',
  ERROR = 'Error'
}

/**
 * Response from the server action
 */
export interface ActionResponse {
  status: ActionStatus;
  errors?: any;
  message: string;
}
