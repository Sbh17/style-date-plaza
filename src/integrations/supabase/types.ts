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
      appointments: {
        Row: {
          created_at: string | null
          date: string
          end_time: string
          id: string
          notes: string | null
          salon_id: string
          service_id: string
          start_time: string
          status: string
          stylist_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          notes?: string | null
          salon_id: string
          service_id: string
          start_time: string
          status?: string
          stylist_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          notes?: string | null
          salon_id?: string
          service_id?: string
          start_time?: string
          status?: string
          stylist_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_stylist_id_fkey"
            columns: ["stylist_id"]
            isOneToOne: false
            referencedRelation: "stylists"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_suggestions: {
        Row: {
          description: string
          id: string
          status: string
          submitted_at: string | null
          submitted_by: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          description: string
          id?: string
          status?: string
          submitted_at?: string | null
          submitted_by?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          description?: string
          id?: string
          status?: string
          submitted_at?: string | null
          submitted_by?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      features: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_premium: boolean
          name: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          is_premium?: boolean
          name: string
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_premium?: boolean
          name?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          content: string
          created_at: string | null
          ends_at: string
          id: string
          image_url: string | null
          is_approved: boolean
          salon_id: string
          starts_at: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          ends_at: string
          id?: string
          image_url?: string | null
          is_approved?: boolean
          salon_id: string
          starts_at: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          ends_at?: string
          id?: string
          image_url?: string | null
          is_approved?: boolean
          salon_id?: string
          starts_at?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          bio: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          occupation: string | null
          password: string | null
          phone: string | null
          profile_image: string | null
          role: string
          user_id: string
        }
        Insert: {
          address?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          occupation?: string | null
          password?: string | null
          phone?: string | null
          profile_image?: string | null
          role?: string
          user_id: string
        }
        Update: {
          address?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          occupation?: string | null
          password?: string | null
          phone?: string | null
          profile_image?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          appointment_id: string | null
          comment: string
          created_at: string | null
          id: string
          rating: number
          salon_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          appointment_id?: string | null
          comment: string
          created_at?: string | null
          id?: string
          rating: number
          salon_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          appointment_id?: string | null
          comment?: string
          created_at?: string | null
          id?: string
          rating?: number
          salon_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salons: {
        Row: {
          address: string
          city: string
          cover_image_url: string | null
          created_at: string | null
          description: string
          email: string
          id: string
          logo_url: string | null
          name: string
          phone: string
          rating: number | null
          state: string
          updated_at: string | null
          website: string | null
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          cover_image_url?: string | null
          created_at?: string | null
          description: string
          email: string
          id?: string
          logo_url?: string | null
          name: string
          phone: string
          rating?: number | null
          state: string
          updated_at?: string | null
          website?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          cover_image_url?: string | null
          created_at?: string | null
          description?: string
          email?: string
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string
          rating?: number | null
          state?: string
          updated_at?: string | null
          website?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          created_at: string | null
          description: string
          duration: number
          id: string
          image_url: string | null
          name: string
          price: number
          salon_id: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          duration: number
          id?: string
          image_url?: string | null
          name: string
          price: number
          salon_id: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          duration?: number
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          salon_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      stylists: {
        Row: {
          avatar_url: string | null
          bio: string
          created_at: string | null
          id: string
          name: string
          salon_id: string
          specialties: string[]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio: string
          created_at?: string | null
          id?: string
          name: string
          salon_id: string
          specialties?: string[]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string
          created_at?: string | null
          id?: string
          name?: string
          salon_id?: string
          specialties?: string[]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stylists_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          data_sharing: boolean
          id: string
          notifications_enabled: boolean
          preferred_language: string | null
          translate_api_key: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data_sharing?: boolean
          id?: string
          notifications_enabled?: boolean
          preferred_language?: string | null
          translate_api_key?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data_sharing?: boolean
          id?: string
          notifications_enabled?: boolean
          preferred_language?: string | null
          translate_api_key?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_table_exists: {
        Args: { table_name: string }
        Returns: boolean
      }
      update_profile_password: {
        Args: { user_id: string; new_password: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
