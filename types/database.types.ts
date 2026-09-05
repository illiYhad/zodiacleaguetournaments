export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRoleType =
  | 'ATHLETE'
  | 'TEAM_MANAGER'
  | 'ORG_OWNER'
  | 'CASTER'
  | 'REFEREE'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export type AccountStatusType =
  | 'PENDING'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'BANNED'
  | 'DEACTIVATED';

export type GameCodeType = 'VAL' | 'LOL' | 'CS2' | 'TFT';

export type VerificationStatusType =
  | 'UNVERIFIED'
  | 'PENDING'
  | 'VERIFIED'
  | 'MANUAL_REVIEW'
  | 'REJECTED'
  | 'REVOKED';

export type TeamRoleType =
  | 'OWNER'
  | 'CAPTAIN'
  | 'PLAYER'
  | 'SUBSTITUTE'
  | 'COACH'
  | 'MANAGER';

export type MembershipStatusType =
  | 'INVITED'
  | 'REQUESTED'
  | 'ACTIVE'
  | 'LEFT'
  | 'KICKED'
  | 'LOCKED';

export type AuditActionType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'GRANT'
  | 'REVOKE'
  | 'APPROVE'
  | 'REJECT'
  | 'CREDIT'
  | 'DEBIT'
  | 'TRANSFER'
  | 'BAN'
  | 'UNBAN'
  | 'SUSPEND'
  | 'RESTORE';

export type NotificationChannelType = 'IN_APP' | 'EMAIL' | 'PUSH' | 'DISCORD' | 'LINE';

export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          id: string;
          code: GameCodeType;
          name: string;
          publisher: string | null;
          icon_url: string | null;
          team_size: number;
          max_substitutes: number;
          config: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      players: {
        Row: {
          id: string;
          user_id: string;
          athlete_id: string;
          display_name: string;
          slug: string | null;
          bio: string | null;
          avatar_url: string | null;
          banner_url: string | null;
          country_code: string | null;
          email: string | null;
          phone: string | null;
          date_of_birth: string | null;
          real_name: string | null;
          kyc_verified_at: string | null;
          ap_balance: number;
          status: AccountStatusType;
          suspended_until: string | null;
          ban_reason: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      game_accounts: {
        Row: {
          id: string;
          player_id: string;
          game_id: string;
          external_id: string;
          game_name: string | null;
          tag_line: string | null;
          region: string | null;
          verification_status: VerificationStatusType;
          verified_at: string | null;
          rank_snapshot: Json;
          is_primary: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          tag: string;
          description: string | null;
          logo_url: string | null;
          owner_id: string;
          is_verified: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      teams: {
        Row: {
          id: string;
          game_id: string;
          organization_id: string | null;
          name: string;
          slug: string;
          tag: string;
          captain_id: string | null;
          is_locked: boolean;
          total_zp: number;
          wins: number;
          losses: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      team_members: {
        Row: {
          id: string;
          team_id: string;
          player_id: string;
          role: TeamRoleType;
          jersey_number: number | null;
          status: MembershipStatusType;
          joined_at: string | null;
          left_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          player_id: string;
          role: UserRoleType;
          scope_type: string | null;
          scope_id: string | null;
          granted_at: string;
        };
      };
      audit_logs: {
        Row: {
          id: number;
          actor_id: string | null;
          actor_role: UserRoleType | null;
          action: AuditActionType;
          entity_type: string;
          entity_id: string | null;
          before_data: Json | null;
          after_data: Json | null;
          created_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          player_id: string;
          type: string;
          title: string;
          body: string | null;
          action_url: string | null;
          is_read: boolean;
          created_at: string;
        };
      };
    };
  };
}
