export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string | null
          id: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string
          description: string | null
          end_time: string
          id: string
          is_virtual: boolean | null
          location: string | null
          payment_id: string | null
          price: number | null
          start_time: string
          status: Database["public"]["Enums"]["booking_status"] | null
          student_id: string
          title: string | null
          tutor_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          is_virtual?: boolean | null
          location?: string | null
          payment_id?: string | null
          price?: number | null
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          student_id: string
          title?: string | null
          tutor_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          is_virtual?: boolean | null
          location?: string | null
          payment_id?: string | null
          price?: number | null
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          student_id?: string
          title?: string | null
          tutor_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutors"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          badge_type: string | null
          created_at: string
          id: string
          issue_date: string
          level: number
          module_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          badge_type?: string | null
          created_at?: string
          id?: string
          issue_date?: string
          level: number
          module_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          badge_type?: string | null
          created_at?: string
          id?: string
          issue_date?: string
          level?: number
          module_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      email_breach_checks: {
        Row: {
          breach_count: number | null
          breaches: Json | null
          checked_at: string | null
          created_at: string | null
          email: string
          id: string
          is_compromised: boolean
          paste_count: number | null
          pastes: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          breach_count?: number | null
          breaches?: Json | null
          checked_at?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_compromised?: boolean
          paste_count?: number | null
          pastes?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          breach_count?: number | null
          breaches?: Json | null
          checked_at?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_compromised?: boolean
          paste_count?: number | null
          pastes?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      infographics: {
        Row: {
          access_level: Database["public"]["Enums"]["access_level"]
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string
          title: string
          updated_at: string
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["access_level"]
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url: string
          title: string
          updated_at?: string
        }
        Update: {
          access_level?: Database["public"]["Enums"]["access_level"]
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      learning_paths: {
        Row: {
          created_at: string
          current_level: number | null
          id: string
          modules: Json | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_level?: number | null
          id?: string
          modules?: Json | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_level?: number | null
          id?: string
          modules?: Json | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      news_feed: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          receipt_url: string | null
          reference: string | null
          status: string | null
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          id?: string
          method: Database["public"]["Enums"]["payment_method"]
          receipt_url?: string | null
          reference?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          receipt_url?: string | null
          reference?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_logs: {
        Row: {
          created_at: string
          date: string
          duration: number | null
          id: string
          media_url: string | null
          notes: string | null
          routine: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          duration?: number | null
          id?: string
          media_url?: string | null
          notes?: string | null
          routine?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          duration?: number | null
          id?: string
          media_url?: string | null
          notes?: string | null
          routine?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_active: string | null
          last_name: string | null
          onboarding_complete: boolean | null
          parent_id: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_active?: string | null
          last_name?: string | null
          onboarding_complete?: boolean | null
          parent_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_active?: string | null
          last_name?: string | null
          onboarding_complete?: boolean | null
          parent_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json | null
          completed: boolean | null
          created_at: string
          id: string
          quiz_id: string
          score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json | null
          completed?: boolean | null
          created_at?: string
          id?: string
          quiz_id: string
          score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json | null
          completed?: boolean | null
          created_at?: string
          id?: string
          quiz_id?: string
          score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          access_level: Database["public"]["Enums"]["access_level"] | null
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty: number
          id: string
          questions: Json
          title: string
          updated_at: string
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["access_level"] | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty: number
          id?: string
          questions: Json
          title: string
          updated_at?: string
        }
        Update: {
          access_level?: Database["public"]["Enums"]["access_level"] | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: number
          id?: string
          questions?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          bonus_applied: boolean | null
          created_at: string
          id: string
          referred_email: string
          referrer_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          bonus_applied?: boolean | null
          created_at?: string
          id?: string
          referred_email: string
          referrer_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          bonus_applied?: boolean | null
          created_at?: string
          id?: string
          referred_email?: string
          referrer_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      security_events: {
        Row: {
          breach_count: number | null
          created_at: string | null
          email: string | null
          event_type: string
          id: string
          metadata: Json | null
          paste_count: number | null
          user_id: string | null
        }
        Insert: {
          breach_count?: number | null
          created_at?: string | null
          email?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          paste_count?: number | null
          user_id?: string | null
        }
        Update: {
          breach_count?: number | null
          created_at?: string | null
          email?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          paste_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      song_requests: {
        Row: {
          artist: string | null
          created_at: string
          description: string | null
          id: string
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          artist?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          artist?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          id: string
          payment_id: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          type: Database["public"]["Enums"]["subscription_type"]
          updated_at: string
          user_id: string
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          payment_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string
          user_id: string
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          payment_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string
          user_id?: string
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      tutors: {
        Row: {
          available_days: Json | null
          average_rating: number | null
          bio: string | null
          created_at: string
          hourly_rate: number | null
          id: string
          is_freelance: boolean | null
          is_verified: boolean | null
          specialty: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          available_days?: Json | null
          average_rating?: number | null
          bio?: string | null
          created_at?: string
          hourly_rate?: number | null
          id?: string
          is_freelance?: boolean | null
          is_verified?: boolean | null
          specialty?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          available_days?: Json | null
          average_rating?: number | null
          bio?: string | null
          created_at?: string
          hourly_rate?: number | null
          id?: string
          is_freelance?: boolean | null
          is_verified?: boolean | null
          specialty?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      video_content: {
        Row: {
          access_level: Database["public"]["Enums"]["access_level"]
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration: number | null
          id: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          youtube_url: string
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["access_level"]
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          youtube_url: string
        }
        Update: {
          access_level?: Database["public"]["Enums"]["access_level"]
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          youtube_url?: string
        }
        Relationships: []
      }
      weak_passwords: {
        Row: {
          created_at: string | null
          id: string
          password_hash: string
          pattern_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          password_hash: string
          pattern_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          password_hash?: string
          pattern_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_breach_checks: {
        Args: Record<PropertyKey, never> | { days_old?: number }
        Returns: undefined
      }
      get_user_activity: {
        Args: { target_user_id?: string; limit_records?: number }
        Returns: {
          activity_id: string
          user_id: string
          activity_type: string
          activity_description: string
          created_at: string
          ip_address: unknown
          user_agent: string
        }[]
      }
      get_user_breach_summary: {
        Args: Record<PropertyKey, never> | { target_user_id?: string }
        Returns: undefined
      }
      validate_password_security: {
        Args: { password: string }
        Returns: Json
      }
    }
    Enums: {
      access_level: "free" | "basic" | "premium" | "private"
      booking_status: "pending" | "confirmed" | "canceled" | "completed"
      payment_method: "mpesa" | "paypal" | "card" | "bank_transfer"
      subscription_status: "active" | "expired" | "canceled" | "pending"
      subscription_type: "free" | "basic" | "premium" | "enterprise"
      user_role:
        | "student"
        | "adult_learner"
        | "parent"
        | "tutor"
        | "admin"
        | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      access_level: ["free", "basic", "premium", "private"],
      booking_status: ["pending", "confirmed", "canceled", "completed"],
      payment_method: ["mpesa", "paypal", "card", "bank_transfer"],
      subscription_status: ["active", "expired", "canceled", "pending"],
      subscription_type: ["free", "basic", "premium", "enterprise"],
      user_role: [
        "student",
        "adult_learner",
        "parent",
        "tutor",
        "admin",
        "user",
      ],
    },
  },
} as const
