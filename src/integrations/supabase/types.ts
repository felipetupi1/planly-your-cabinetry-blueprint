export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      costs: {
        Row: {
          amount: number
          created_at: string | null
          description: string
          id: string
          project_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description: string
          id?: string
          project_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string
          id?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "costs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          converted: boolean
          created_at: string
          email: string
          id: string
          name: string | null
          spaces_selected: Json | null
          updated_at: string
        }
        Insert: {
          converted?: boolean
          created_at?: string
          email: string
          id?: string
          name?: string | null
          spaces_selected?: Json | null
          updated_at?: string
        }
        Update: {
          converted?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          spaces_selected?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          from_role: string
          id: string
          project_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          from_role: string
          id?: string
          project_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          from_role?: string
          id?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          project_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          project_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          project_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          access_token: string
          client_email: string
          client_name: string
          created_at: string | null
          deadline: string | null
          id: string
          notes: string | null
          stage: string
          stripe_session_id: string | null
        }
        Insert: {
          access_token?: string
          client_email: string
          client_name: string
          created_at?: string | null
          deadline?: string | null
          id?: string
          notes?: string | null
          stage?: string
          stripe_session_id?: string | null
        }
        Update: {
          access_token?: string
          client_email?: string
          client_name?: string
          created_at?: string | null
          deadline?: string | null
          id?: string
          notes?: string | null
          stage?: string
          stripe_session_id?: string | null
        }
        Relationships: []
      }
      spaces: {
        Row: {
          description: string | null
          floor_plan_url: string | null
          id: string
          price: number | null
          project_id: string | null
          render_3d: boolean | null
          room_data: Json | null
          scan_link: string | null
          scan_status: string | null
          size: string | null
          space_key: string
          space_label: string
          submitted_at: string | null
        }
        Insert: {
          description?: string | null
          floor_plan_url?: string | null
          id?: string
          price?: number | null
          project_id?: string | null
          render_3d?: boolean | null
          room_data?: Json | null
          scan_link?: string | null
          scan_status?: string | null
          size?: string | null
          space_key: string
          space_label: string
          submitted_at?: string | null
        }
        Update: {
          description?: string | null
          floor_plan_url?: string | null
          id?: string
          price?: number | null
          project_id?: string | null
          render_3d?: boolean | null
          room_data?: Json | null
          scan_link?: string | null
          scan_status?: string | null
          size?: string | null
          space_key?: string
          space_label?: string
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spaces_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_messages_by_token: {
        Args: { _token: string }
        Returns: {
          content: string
          created_at: string | null
          from_role: string
          id: string
          project_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "messages"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_project_by_token: {
        Args: { _token: string }
        Returns: {
          access_token: string
          client_email: string
          client_name: string
          created_at: string | null
          deadline: string | null
          id: string
          notes: string | null
          stage: string
          stripe_session_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "projects"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_spaces_by_token: {
        Args: { _token: string }
        Returns: {
          description: string | null
          floor_plan_url: string | null
          id: string
          price: number | null
          project_id: string | null
          render_3d: boolean | null
          room_data: Json | null
          scan_link: string | null
          scan_status: string | null
          size: string | null
          space_key: string
          space_label: string
          submitted_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "spaces"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      insert_message_by_token: {
        Args: { _content: string; _token: string }
        Returns: {
          content: string
          created_at: string | null
          from_role: string
          id: string
          project_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "messages"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      is_team_member: { Args: never; Returns: boolean }
      update_space_brief_by_token: {
        Args: {
          _description: string
          _room_data: Json
          _scan_link: string
          _scan_status: string
          _space_id: string
          _token: string
        }
        Returns: undefined
      }
      user_owns_project: { Args: { _project_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
