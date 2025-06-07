export type User = {
  id: string;
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
	  id: string;
	  accountId: string;
	  role: string;
	  users: User[];
}

export type Skill = {
  id: string;
  skill: string;
  definition: string;
  theme: string;
}

export type FeedbackRequest = {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    is_active: boolean;
  };
  recipient_id: string;
  skill: {
    skill: string;
    definition: string;
    theme: string;
  }
  message: string;
  account_id: string;
  status: string;
  
}