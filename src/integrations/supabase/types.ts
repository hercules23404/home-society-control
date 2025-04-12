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
      admins: {
        Row: {
          created_at: string | null
          designation: string | null
          is_active: boolean | null
          society_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          designation?: string | null
          is_active?: boolean | null
          society_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          designation?: string | null
          is_active?: boolean | null
          society_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admins_society_id_fkey"
            columns: ["society_id"]
            isOneToOne: false
            referencedRelation: "societies"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_admin_post: boolean | null
          is_pinned: boolean | null
          notice_type: Database["public"]["Enums"]["notice_type"] | null
          photos: string[] | null
          society_id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_admin_post?: boolean | null
          is_pinned?: boolean | null
          notice_type?: Database["public"]["Enums"]["notice_type"] | null
          photos?: string[] | null
          society_id: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_admin_post?: boolean | null
          is_pinned?: boolean | null
          notice_type?: Database["public"]["Enums"]["notice_type"] | null
          photos?: string[] | null
          society_id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_society_id_fkey"
            columns: ["society_id"]
            isOneToOne: false
            referencedRelation: "societies"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_requests: {
        Row: {
          assigned_worker: string | null
          cost: number | null
          created_at: string | null
          description: string
          id: string
          issue_type: string
          photos: string[] | null
          property_id: string | null
          society_id: string
          status: Database["public"]["Enums"]["maintenance_status_type"] | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          assigned_worker?: string | null
          cost?: number | null
          created_at?: string | null
          description: string
          id?: string
          issue_type: string
          photos?: string[] | null
          property_id?: string | null
          society_id: string
          status?: Database["public"]["Enums"]["maintenance_status_type"] | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          assigned_worker?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string
          id?: string
          issue_type?: string
          photos?: string[] | null
          property_id?: string | null
          society_id?: string
          status?: Database["public"]["Enums"]["maintenance_status_type"] | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_assigned_worker_fkey"
            columns: ["assigned_worker"]
            isOneToOne: false
            referencedRelation: "utility_workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_society_id_fkey"
            columns: ["society_id"]
            isOneToOne: false
            referencedRelation: "societies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          amenities: string[] | null
          area_sqft: number
          bathrooms: number
          bedrooms: number
          city: string
          created_at: string | null
          description: string | null
          id: string
          owner_id: string | null
          photos: string[] | null
          property_type: Database["public"]["Enums"]["property_type"]
          rent_amount: number
          society_id: string
          state: string
          status: Database["public"]["Enums"]["property_status_type"] | null
          updated_at: string | null
          zip_code: string
        }
        Insert: {
          address: string
          amenities?: string[] | null
          area_sqft: number
          bathrooms: number
          bedrooms: number
          city: string
          created_at?: string | null
          description?: string | null
          id?: string
          owner_id?: string | null
          photos?: string[] | null
          property_type: Database["public"]["Enums"]["property_type"]
          rent_amount: number
          society_id: string
          state: string
          status?: Database["public"]["Enums"]["property_status_type"] | null
          updated_at?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          amenities?: string[] | null
          area_sqft?: number
          bathrooms?: number
          bedrooms?: number
          city?: string
          created_at?: string | null
          description?: string | null
          id?: string
          owner_id?: string | null
          photos?: string[] | null
          property_type?: Database["public"]["Enums"]["property_type"]
          rent_amount?: number
          society_id?: string
          state?: string
          status?: Database["public"]["Enums"]["property_status_type"] | null
          updated_at?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_society_id_fkey"
            columns: ["society_id"]
            isOneToOne: false
            referencedRelation: "societies"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_payments: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string
          id: string
          late_fee: number | null
          paid_date: string | null
          payment_method: string | null
          payment_status:
            | Database["public"]["Enums"]["payment_status_type"]
            | null
          property_id: string | null
          receipt_url: string | null
          society_id: string
          tenant_id: string
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date: string
          id?: string
          late_fee?: number | null
          paid_date?: string | null
          payment_method?: string | null
          payment_status?:
            | Database["public"]["Enums"]["payment_status_type"]
            | null
          property_id?: string | null
          receipt_url?: string | null
          society_id: string
          tenant_id: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string
          id?: string
          late_fee?: number | null
          paid_date?: string | null
          payment_method?: string | null
          payment_status?:
            | Database["public"]["Enums"]["payment_status_type"]
            | null
          property_id?: string | null
          receipt_url?: string | null
          society_id?: string
          tenant_id?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rent_payments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rent_payments_society_id_fkey"
            columns: ["society_id"]
            isOneToOne: false
            referencedRelation: "societies"
            referencedColumns: ["id"]
          },
        ]
      }
      societies: {
        Row: {
          address: string
          amenities: string[] | null
          city: string
          created_at: string | null
          id: string
          name: string
          state: string
          total_units: number
          updated_at: string | null
          zip_code: string
        }
        Insert: {
          address: string
          amenities?: string[] | null
          city: string
          created_at?: string | null
          id?: string
          name: string
          state: string
          total_units: number
          updated_at?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          amenities?: string[] | null
          city?: string
          created_at?: string | null
          id?: string
          name?: string
          state?: string
          total_units?: number
          updated_at?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      tenant_documents: {
        Row: {
          document_type: string
          file_path: string
          id: string
          tenant_id: string
          uploaded_at: string | null
        }
        Insert: {
          document_type: string
          file_path: string
          id?: string
          tenant_id: string
          uploaded_at?: string | null
        }
        Update: {
          document_type?: string
          file_path?: string
          id?: string
          tenant_id?: string
          uploaded_at?: string | null
        }
        Relationships: []
      }
      tenants: {
        Row: {
          created_at: string | null
          flat_number: string
          is_active: boolean | null
          society_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          flat_number: string
          is_active?: boolean | null
          society_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          flat_number?: string
          is_active?: boolean | null
          society_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenants_society_id_fkey"
            columns: ["society_id"]
            isOneToOne: false
            referencedRelation: "societies"
            referencedColumns: ["id"]
          },
        ]
      }
      utility_workers: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          role: string
          society_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          role: string
          society_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          role?: string
          society_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "utility_workers_society_id_fkey"
            columns: ["society_id"]
            isOneToOne: false
            referencedRelation: "societies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_societies: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string
          amenities: string[] | null
          city: string
          created_at: string | null
          id: string
          name: string
          state: string
          total_units: number
          updated_at: string | null
          zip_code: string
        }[]
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      maintenance_status_type:
        | "pending"
        | "in_progress"
        | "completed"
        | "rejected"
      notice_type: "general" | "maintenance" | "events" | "emergency"
      payment_status_type: "pending" | "paid" | "overdue" | "cancelled"
      property_status_type: "vacant" | "occupied" | "under_maintenance"
      property_type:
        | "1BHK"
        | "2BHK"
        | "3BHK"
        | "4BHK"
        | "studio"
        | "villa"
        | "other"
      user_role: "tenant" | "admin"
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
      maintenance_status_type: [
        "pending",
        "in_progress",
        "completed",
        "rejected",
      ],
      notice_type: ["general", "maintenance", "events", "emergency"],
      payment_status_type: ["pending", "paid", "overdue", "cancelled"],
      property_status_type: ["vacant", "occupied", "under_maintenance"],
      property_type: [
        "1BHK",
        "2BHK",
        "3BHK",
        "4BHK",
        "studio",
        "villa",
        "other",
      ],
      user_role: ["tenant", "admin"],
    },
  },
} as const
