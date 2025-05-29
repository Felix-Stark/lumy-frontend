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
};

export type Account = {
	  id: string;
	  accountId: string;
	  role: string;
	  users: User[];
}