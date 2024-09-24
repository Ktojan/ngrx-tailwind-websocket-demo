export interface Comment {
    author: string,
    date: string,
    message: string,
    rating: number,
    replies?: Comment[],
    showReply?: boolean;
  }
