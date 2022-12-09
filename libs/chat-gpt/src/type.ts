export interface ChatGPTResponse {
  message: Message;
  conversation_id: string;
  error: null;
}

export interface Message {
  id: string;
  role: string;
  user: null;
  create_time: null;
  update_time: null;
  content: Content;
  end_turn: null;
  weight: number;
  metadata: Metadata;
  recipient: string;
}

export interface Content {
  content_type: string;
  parts: string[];
}

export interface Metadata {}
