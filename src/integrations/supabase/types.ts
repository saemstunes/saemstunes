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
      artist_followers: {
        Row: {
          artist_id: string | null
          followed_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          artist_id?: string | null
          followed_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          artist_id?: string | null
          followed_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artist_followers_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      artists: {
        Row: {
          bio: string | null
          created_at: string | null
          follower_count: number | null
          genre: string[] | null
          id: string
          location: string | null
          name: string
          profile_image_url: string | null
          social_links: Json | null
          updated_at: string | null
          verified_status: boolean | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          follower_count?: number | null
          genre?: string[] | null
          id?: string
          location?: string | null
          name: string
          profile_image_url?: string | null
          social_links?: Json | null
          updated_at?: string | null
          verified_status?: boolean | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          follower_count?: number | null
          genre?: string[] | null
          id?: string
          location?: string | null
          name?: string
          profile_image_url?: string | null
          social_links?: Json | null
          updated_at?: string | null
          verified_status?: boolean | null
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
      course_enrollments: {
        Row: {
          completed_at: string | null
          enrolled_at: string | null
          id: string
          last_accessed: string | null
          learning_path_id: string | null
          progress_percentage: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          enrolled_at?: string | null
          id?: string
          last_accessed?: string | null
          learning_path_id?: string | null
          progress_percentage?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          enrolled_at?: string | null
          id?: string
          last_accessed?: string | null
          learning_path_id?: string | null
          progress_percentage?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
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
      lesson_progress: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          last_position: number | null
          updated_at: string | null
          user_id: string | null
          video_content_id: string | null
          watched_duration: number | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          last_position?: number | null
          updated_at?: string | null
          user_id?: string | null
          video_content_id?: string | null
          watched_duration?: number | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          last_position?: number | null
          updated_at?: string | null
          user_id?: string | null
          video_content_id?: string | null
          watched_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_video_content_id_fkey"
            columns: ["video_content_id"]
            isOneToOne: false
            referencedRelation: "video_content"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          track_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          track_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          type: string | null
          user_id: string | null
          visible_to: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          type?: string | null
          user_id?: string | null
          visible_to?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          type?: string | null
          user_id?: string | null
          visible_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          item_id: string
          item_name: string
          order_type: string
          payment_metadata: Json | null
          payment_method: string | null
          payment_provider_id: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          id?: string
          item_id: string
          item_name: string
          order_type: string
          payment_metadata?: Json | null
          payment_method?: string | null
          payment_provider_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          item_id?: string
          item_name?: string
          order_type?: string
          payment_metadata?: Json | null
          payment_method?: string | null
          payment_provider_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_sessions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          metadata: Json | null
          order_id: string | null
          provider: string
          session_id: string
          session_url: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string | null
          provider: string
          session_id: string
          session_url?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string | null
          provider?: string
          session_id?: string
          session_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_sessions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          order_id: string | null
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
          order_id?: string | null
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
          order_id?: string | null
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
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_tracks: {
        Row: {
          added_at: string | null
          id: string
          playlist_id: string | null
          position: number
          track_id: string | null
        }
        Insert: {
          added_at?: string | null
          id?: string
          playlist_id?: string | null
          position: number
          track_id?: string | null
        }
        Update: {
          added_at?: string | null
          id?: string
          playlist_id?: string | null
          position?: number
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_tracks_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          category: string | null
          cover_art_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          play_count: number | null
          total_duration: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          cover_art_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          play_count?: number | null
          total_duration?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          cover_art_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          play_count?: number | null
          total_duration?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      resource_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
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
          order_id: string | null
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
          order_id?: string | null
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
          order_id?: string | null
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
            foreignKeyName: "subscriptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      track_plays: {
        Row: {
          id: number
          played_at: string
          track_id: string
          user_id: string | null
        }
        Insert: {
          id?: number
          played_at?: string
          track_id: string
          user_id?: string | null
        }
        Update: {
          id?: number
          played_at?: string
          track_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "track_plays_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "track_plays_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          access_level: string | null
          approved: boolean | null
          audio_path: string
          cover_path: string | null
          created_at: string | null
          description: string | null
          id: string
          title: string
          user_id: string | null
        }
        Insert: {
          access_level?: string | null
          approved?: boolean | null
          audio_path: string
          cover_path?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          user_id?: string | null
        }
        Update: {
          access_level?: string | null
          approved?: boolean | null
          audio_path?: string
          cover_path?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          resource_category: string | null
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
          resource_category?: string | null
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
          resource_category?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          youtube_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_content_resource_category_fkey"
            columns: ["resource_category"]
            isOneToOne: false
            referencedRelation: "resource_categories"
            referencedColumns: ["name"]
          },
        ]
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
      inspect_old_breach_checks: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          created_at: string
        }[]
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
