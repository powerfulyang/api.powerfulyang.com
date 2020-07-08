export interface InstallationWebhookPayload {
    installation?: {
        id: number;
        node_id: string;
    };
}
