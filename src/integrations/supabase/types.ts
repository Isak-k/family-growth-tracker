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
      academic_years: {
        Row: {
          admin_id: string
          created_at: string
          end_date: string
          grade: string
          id: string
          name: string
          start_date: string
          updated_at: string
          year: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          end_date: string
          grade: string
          id?: string
          name: string
          start_date: string
          updated_at?: string
          year: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          end_date?: string
          grade?: string
          id?: string
          name?: string
          start_date?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      activity_log: {
        Row: {
          action: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          academic_year_id: string
          bonus_enabled: boolean
          bonus_max: number
          created_at: string
          grading_assignment: number
          grading_final: number
          grading_mid: number
          grading_test: number
          id: string
          max_score: number
          name: string
          updated_at: string
        }
        Insert: {
          academic_year_id: string
          bonus_enabled?: boolean
          bonus_max?: number
          created_at?: string
          grading_assignment?: number
          grading_final?: number
          grading_mid?: number
          grading_test?: number
          id?: string
          max_score?: number
          name: string
          updated_at?: string
        }
        Update: {
          academic_year_id?: string
          bonus_enabled?: boolean
          bonus_max?: number
          created_at?: string
          grading_assignment?: number
          grading_final?: number
          grading_mid?: number
          grading_test?: number
          id?: string
          max_score?: number
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
        ]
      }
      islamic_learning_goals: {
        Row: {
          admin_id: string
          age_group: string
          category: string
          completed_date: string | null
          created_at: string
          description: string | null
          id: string
          notes: string | null
          status: string
          student_id: string
          target_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          admin_id: string
          age_group: string
          category: string
          completed_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          notes?: string | null
          status?: string
          student_id: string
          target_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          admin_id?: string
          age_group?: string
          category?: string
          completed_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          notes?: string | null
          status?: string
          student_id?: string
          target_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "islamic_learning_goals_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      islamic_study_plans: {
        Row: {
          admin_id: string
          created_at: string
          created_by: string
          goals: Json
          id: string
          plan: Json
          student_id: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          created_by: string
          goals?: Json
          id?: string
          plan: Json
          student_id: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          created_by?: string
          goals?: Json
          id?: string
          plan?: Json
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "islamic_study_plans_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          attendance_alerts: boolean | null
          created_at: string
          email_notifications: boolean | null
          grade_alerts: boolean | null
          id: string
          updated_at: string
          user_id: string
          weekly_summary: boolean | null
        }
        Insert: {
          attendance_alerts?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          grade_alerts?: boolean | null
          id?: string
          updated_at?: string
          user_id: string
          weekly_summary?: boolean | null
        }
        Update: {
          attendance_alerts?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          grade_alerts?: boolean | null
          id?: string
          updated_at?: string
          user_id?: string
          weekly_summary?: boolean | null
        }
        Relationships: []
      }
      parent_child_relationships: {
        Row: {
          child_id: string
          created_at: string
          id: string
          parent_id: string
        }
        Insert: {
          child_id: string
          created_at?: string
          id?: string
          parent_id: string
        }
        Update: {
          child_id?: string
          created_at?: string
          id?: string
          parent_id?: string
        }
        Relationships: []
      }
      personal_history: {
        Row: {
          category: string
          content: string
          created_at: string
          entry_date: string
          id: string
          is_private: boolean
          language: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          entry_date?: string
          id?: string
          is_private?: boolean
          language?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          entry_date?: string
          id?: string
          is_private?: boolean
          language?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          religion: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          religion?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          religion?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quran_memorization: {
        Row: {
          admin_id: string
          completion_date: string | null
          created_at: string
          id: string
          juz_number: number
          last_reviewed: string | null
          notes: string | null
          start_date: string | null
          status: string
          student_id: string
          surah_name: string
          surah_number: number
          tajweed_level: string | null
          total_verses: number
          updated_at: string
          verses_memorized: number
        }
        Insert: {
          admin_id: string
          completion_date?: string | null
          created_at?: string
          id?: string
          juz_number?: number
          last_reviewed?: string | null
          notes?: string | null
          start_date?: string | null
          status?: string
          student_id: string
          surah_name: string
          surah_number: number
          tajweed_level?: string | null
          total_verses?: number
          updated_at?: string
          verses_memorized?: number
        }
        Update: {
          admin_id?: string
          completion_date?: string | null
          created_at?: string
          id?: string
          juz_number?: number
          last_reviewed?: string | null
          notes?: string | null
          start_date?: string | null
          status?: string
          student_id?: string
          surah_name?: string
          surah_number?: number
          tajweed_level?: string | null
          total_verses?: number
          updated_at?: string
          verses_memorized?: number
        }
        Relationships: [
          {
            foreignKeyName: "quran_memorization_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_academic_years: {
        Row: {
          academic_year_id: string
          created_at: string
          id: string
          student_id: string
        }
        Insert: {
          academic_year_id: string
          created_at?: string
          id?: string
          student_id: string
        }
        Update: {
          academic_year_id?: string
          created_at?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_academic_years_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_academic_years_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_grades: {
        Row: {
          academic_year: string
          created_at: string
          grade: number
          grade_date: string
          id: string
          max_grade: number
          notes: string | null
          student_id: string
          subject: string
          term: string
          updated_at: string
        }
        Insert: {
          academic_year: string
          created_at?: string
          grade: number
          grade_date?: string
          id?: string
          max_grade?: number
          notes?: string | null
          student_id: string
          subject: string
          term: string
          updated_at?: string
        }
        Update: {
          academic_year?: string
          created_at?: string
          grade?: number
          grade_date?: string
          id?: string
          max_grade?: number
          notes?: string | null
          student_id?: string
          subject?: string
          term?: string
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          admin_id: string
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          description: string | null
          education_level: string | null
          email: string
          enrollment_date: string
          first_name: string
          gender: string
          id: string
          interests: string[]
          last_name: string
          learning_goals: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_id: string
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          description?: string | null
          education_level?: string | null
          email?: string
          enrollment_date?: string
          first_name: string
          gender?: string
          id?: string
          interests?: string[]
          last_name: string
          learning_goals?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_id?: string
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          description?: string | null
          education_level?: string | null
          email?: string
          enrollment_date?: string
          first_name?: string
          gender?: string
          id?: string
          interests?: string[]
          last_name?: string
          learning_goals?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_family_religion: { Args: { _user_id: string }; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      my_student_id: { Args: never; Returns: string }
    }
    Enums: {
      app_role: "admin" | "student"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "student"],
    },
  },
} as const
