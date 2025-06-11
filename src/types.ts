export type User = {
  id: number;
  name: string;
  email: string;
  avatar: string; // Slack URL to avatar image
  role: string;
  title?: string;
  slack_user_id: string; // Slack user ID
  slack_team_id: string; // Slack team ID
  account_id: string; // ID of the account this user belongs to
  isActive: boolean;
  skills?: Skill[]; // Array of skill IDs
};

export type Account = {
	  id: number;
	  accountId: string;
	  role: string;
	  users: User[];
}

export type Skill = {
  id: number;
  skill: string;
  definition: string;
  theme: string;
}

export type FeedbackRequest = {
  id: number;
  sender: {
    id: number;
    name: string;
    avatar: string;
    is_active: boolean;
  };
  recipient_id: number;
  skill: {
    skill: string;
    definition: string;
    theme: string;
  }
  message: string;
  account_id: number;
  status: string;
}

export type BotPersonality = {
  id: number;
  name: string;
  description: string;
  formatted_name: string;
}

export type FeedbackFramework = {
  id: number;
  name: string;
  formatted_name: string;
  definition: string;
  created_at: string;
  updated_at: string;
}