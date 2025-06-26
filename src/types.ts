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
  is_active: boolean;
};

export type UserSummary = {
  feedback_received_count: number;
  feedback_given_count: number;
  positive_sentiment_percentage: number;
  top_positive_skill: string;
  skills_summary: SkillSummary[];
  chatgpt_summary: {
    positive: string;
    improvement: string;
  };
};

export type SkillSummary = {
  skill_id: number;
  name: string;
  average_sentiment: number;
  feedback_count: number;
  last_feedback_received: string; // ISO date string
}

export type Account = {
  id: number;
  name: string;
  framework_id: number;
  bot_personality_id: number;
  created_at: string;
  updated_at: string;
};

export type SetupAccount = {
	  id: string;
	  account_id: string;
	  role: string;
	  users: SetUpUser[]; // Array of users in the account
}

export type SetUpUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  avatar: string;
  title?: string;
  suggested_skills: Skill[] | null; // Array of suggested skills for the user
};

export type Skill = {
  id: number;
  skill: string;
  definition: string;
  theme: string;
}

export type FeedbackRequest = {
  id: string;
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
  framework: FeedbackFramework;
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