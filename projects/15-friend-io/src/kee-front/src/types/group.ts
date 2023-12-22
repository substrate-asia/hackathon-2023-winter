export interface Group {
  gid: number;
  owner?: number;
  name: string;
  description?: string;
  members: number[];
  is_public: boolean;
  avatar_updated_at: Date;
  pinned_messages: string[];
}
