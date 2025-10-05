export type TimeSeries = Record<string, number>;

// ONBOARDING
export type SetupAccount = {
	  id: number;
	  account_id: number;
	  role: string;
	  users: SetupUser[]; // Array of users in the account
}

export type SetupUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  avatar: string;
  title?: string;
};

// ACCOUNT
export type Account = {
  id: number;
  name: string;
  framework_id: number;
  bot_personality_id: number;
  nudge_interval_weeks: number;
  nudge_weekday: number; // 1 (Monday) to 5 (Friday)
  nudge_hour: number; // 0 to 23
  nudge_grace_period: number;
  intelligence_coach: boolean;
  intelligence_assistant: boolean;
  timezone: string;
  created_at: string;
  updated_at: string;
};

export type BotPersonality = {
  id: number;
  name: string;
  description: string;
  formatted_name: string;
}

// USER TYPES

export type User = {
  id: number;
  name: string;
  email: string;
  avatar: string; // Slack URL to avatar image
  role: string;
  title?: string;
  slack_user_id?: string; // Slack user ID
  slack_team_id?: string; // Slack team ID
  account_id: string; // ID of the account this user belongs to
  is_active: boolean;
  manager_id: number | null;
};

export type UserSummary = {
  feedback_received_count: number;
  feedback_given_count: number;
  feedback_requested_count: number;
  positive_sentiment_percentage: number;
  top_positive_skill: string;
  skills_summary: SkillSummary[];
  chatgpt_summary: {
    positive: string;
    improvement: string;
  };
  feedback_received: TimeSeries;
  feedback_given: TimeSeries;
  feedback_requested: TimeSeries;
  avg_sentiment: TimeSeries;
};

// SKILL TYPES

export type Skill = {
  id: number;
  skill: string;
  definition: string;
  theme: string;
}

export type SkillSummary = {
  skill_id: number;
  name: string;
  average_sentiment: number;
  feedback_count: number;
  last_feedback_received: string; // ISO date string
}

export type SkillOverview = {
  skill_name: string;
  skill_stale: boolean;
  skill_definition: string;
  avg_sentiment: TimeSeries;
  feedback_received:  FeedbackOnSkill[];
  submission_counts: {
    by_sentiment: {
      positive?: number;
      neutral?: number;
      negative?: number;
    };
    total: number;
  }
}

export type FeedbackOnSkill = {
    id: number;
    content: string;
    sentiment: string; // e.g. 'positive' | 'neutral' | 'negative'
    sentiment_score: number; // e.g. 85
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    feedback_request_id: string;
    constructiveness_score: number; // e.g. 70
    recipient_id: number; // sender user id
    recipient_name: string; // sender user name
    skill_id: number;
    skill_name: string;
  }

// FEEDBACK TYPES

export type FeedbackRequest = {
  id: number;
  sender: {
    id: number;
    name: string;
    avatar: string;
    is_active: boolean;
  };
  recipient: {
    id: number;
    name: string;
    avatar: string;
    is_active: boolean;
  }
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
  intelligence_coach: boolean;
  intelligence_assistant: boolean;
  type?: string;
  created_at?: string; //ISO timestamp
  updated_at?: string; // ISO timestamp
}

export type FeedbackRequestEmbedded = {
  id: string;
  recipient: {
    id: number;
    name: string;
    avatar: string;
    is_active: boolean;
  };
  recipient_id: number;
  sender: {
    id: number;
    name: string;
    avatar: string;
    is_active: boolean;
  };
  sender_id: number;
  skill: {
    skill: string;
    definition: string;
    theme: string;
  };
  type?: string;
  message: string;
  account_id: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type FeedbackRequestShort = {
  id: string;
  recipient: {
    id: number;
    name: string;
    avatar: string;
    is_active: boolean;
  };
  recipient_id: number;
  skill: {
    skill: string;
    definition: string;
    theme: string | null;
  };
  message: string;
  account_id: number;
  status: string;
};

export type FeedbackSubmission = {
  id: number;
  feedback_request_id: string;
  content: string;
  sentiment: string; // e.g. 'positive' | 'neutral' | 'negative'
  sentiment_score: number; // e.g. 85
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  actions: FeedbackAction[];
  feedback_request?: FeedbackRequestEmbedded;
  constructiveness_score?: number; // e.g. 70
};

export type FeedbackFramework = {
  id: number;
  name: string;
  formatted_name: string;
  definition: string;
  created_at: string;
  updated_at: string;
}

export type FeedbackAction = {
  id: string;
  action_type: string; //coffee / meeting
  status: string; // pending, planned
  note: string;
}

export type FeedbackSubmissionFull = {
  id: number;
  feedback_request_id: string;
  content: string;
  sentiment: string;
  sentiment_score: number;
  created_at: string;
  updated_at: string;
  actions: FeedbackAction[];
  feedback_request: {
    id: string;
    recipient: {
      id: number;
      name: string;
      avatar: string;
      is_active: boolean;
    };
    recipient_id: number;
    sender: {
      id: number;
      name: string;
      avatar: string;
      is_active: boolean;
    };
    sender_id: number;
    skill: {
      skill: string;
      definition: string;
      theme: string | null;
    };
    message: string;
    account_id: number;
    status: string;
  };
};

// TEAM ADMIN/MANAGER

export type TeamOverview = {
  feedback_submitted_total: number;
  feedback_requested_total: number;
  positive_feedback_percentage: number;
  constructive_feedback_average: number;
  submitted_per_month: {
    month: string;
    count: number;
  } [];
  average_sentiment_score: number;
};

//GET /team.users
export type TeamUser = {
  user_id: number;
  name: string;
  avatar: string;
  average_sentiment_word: string;
  manager_summary: string | null;
}
