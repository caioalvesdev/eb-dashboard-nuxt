export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      base_de_alunos_info: {
        Row: {
          created_at: string | null;
          deleted_at: string | null;
          eb_skills_basic_ativos: number | null;
          eb_skills_basic_inativos: number | null;
          eb_skills_completo_ativos: number | null;
          eb_skills_completo_inativos: number | null;
          eb_skills_cursos_ativos: number | null;
          eb_skills_cursos_inativos: number | null;
          eb_skills_tira_duvidas_ativos: number | null;
          eb_skills_tira_duvidas_inativos: number | null;
          id: number;
          master_ativo: number | null;
          master_inativo: number | null;
          pleno_ativo: number | null;
          pleno_inativos: number | null;
          semana: number | null;
          senior_ativo: number | null;
          senior_inativo: number | null;
        };
        Insert: {
          created_at?: string | null;
          deleted_at?: string | null;
          eb_skills_basic_ativos?: number | null;
          eb_skills_basic_inativos?: number | null;
          eb_skills_completo_ativos?: number | null;
          eb_skills_completo_inativos?: number | null;
          eb_skills_cursos_ativos?: number | null;
          eb_skills_cursos_inativos?: number | null;
          eb_skills_tira_duvidas_ativos?: number | null;
          eb_skills_tira_duvidas_inativos?: number | null;
          id?: number;
          master_ativo?: number | null;
          master_inativo?: number | null;
          pleno_ativo?: number | null;
          pleno_inativos?: number | null;
          semana?: number | null;
          senior_ativo?: number | null;
          senior_inativo?: number | null;
        };
        Update: {
          created_at?: string | null;
          deleted_at?: string | null;
          eb_skills_basic_ativos?: number | null;
          eb_skills_basic_inativos?: number | null;
          eb_skills_completo_ativos?: number | null;
          eb_skills_completo_inativos?: number | null;
          eb_skills_cursos_ativos?: number | null;
          eb_skills_cursos_inativos?: number | null;
          eb_skills_tira_duvidas_ativos?: number | null;
          eb_skills_tira_duvidas_inativos?: number | null;
          id?: number;
          master_ativo?: number | null;
          master_inativo?: number | null;
          pleno_ativo?: number | null;
          pleno_inativos?: number | null;
          semana?: number | null;
          senior_ativo?: number | null;
          senior_inativo?: number | null;
        };
        Relationships: [];
      };
      carteira_mba: {
        Row: {
          alunos_mba_dp: number | null;
          alunos_mba_nr1: number | null;
          alunos_mba_rh: number | null;
          alunos_total: number | null;
          cancelados: number | null;
          created_at: string | null;
          deleted_at: string | null;
          id: number;
          semana: number | null;
          valor_mba_dp: number | null;
          valor_mba_nr1: number | null;
          valor_total: number | null;
          valores_cancelados: number | null;
        };
        Insert: {
          alunos_mba_dp?: number | null;
          alunos_mba_nr1?: number | null;
          alunos_mba_rh?: number | null;
          alunos_total?: number | null;
          cancelados?: number | null;
          created_at?: string | null;
          deleted_at?: string | null;
          id?: number;
          semana?: number | null;
          valor_mba_dp?: number | null;
          valor_mba_nr1?: number | null;
          valor_total?: number | null;
          valores_cancelados?: number | null;
        };
        Update: {
          alunos_mba_dp?: number | null;
          alunos_mba_nr1?: number | null;
          alunos_mba_rh?: number | null;
          alunos_total?: number | null;
          cancelados?: number | null;
          created_at?: string | null;
          deleted_at?: string | null;
          id?: number;
          semana?: number | null;
          valor_mba_dp?: number | null;
          valor_mba_nr1?: number | null;
          valor_total?: number | null;
          valores_cancelados?: number | null;
        };
        Relationships: [];
      };
      contratos_mba: {
        Row: {
          created_at: string | null;
          dp_assinados: number;
          dp_pendente: number;
          id: number;
          nr1_assinados: number;
          nr1_pendente: number;
          porcentagem_dp: number;
          porcentagem_nr1: number;
          porcentagem_rh: number;
          rh_assinados: number;
          rh_pendente: number;
          semana: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          dp_assinados: number;
          dp_pendente: number;
          id?: number;
          nr1_assinados: number;
          nr1_pendente: number;
          porcentagem_dp: number;
          porcentagem_nr1: number;
          porcentagem_rh: number;
          rh_assinados: number;
          rh_pendente: number;
          semana: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          dp_assinados?: number;
          dp_pendente?: number;
          id?: number;
          nr1_assinados?: number;
          nr1_pendente?: number;
          porcentagem_dp?: number;
          porcentagem_nr1?: number;
          porcentagem_rh?: number;
          rh_assinados?: number;
          rh_pendente?: number;
          semana?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      gestao_de_contratos_mba: {
        Row: {
          created_at: string | null;
          deleted_at: string | null;
          dp_assinados: number | null;
          dp_pendente: number | null;
          id: number;
          nr1_assinados: number | null;
          nr1_pendente: number | null;
          rh_assinados: number | null;
          rh_pendente: number | null;
          semana: number | null;
        };
        Insert: {
          created_at?: string | null;
          deleted_at?: string | null;
          dp_assinados?: number | null;
          dp_pendente?: number | null;
          id?: number;
          nr1_assinados?: number | null;
          nr1_pendente?: number | null;
          rh_assinados?: number | null;
          rh_pendente?: number | null;
          semana?: number | null;
        };
        Update: {
          created_at?: string | null;
          deleted_at?: string | null;
          dp_assinados?: number | null;
          dp_pendente?: number | null;
          id?: number;
          nr1_assinados?: number | null;
          nr1_pendente?: number | null;
          rh_assinados?: number | null;
          rh_pendente?: number | null;
          semana?: number | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          role: string | null;
          updated_at: string | null;
          username: string | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          role?: string | null;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          role?: string | null;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      renovacao: {
        Row: {
          created_at: string | null;
          deleted_at: string | null;
          id: number;
          meta_contratos: number | null;
          meta_valor: number | null;
          quantidade_cancelados: number | null;
          quantidade_realizada: number | null;
          semana: number | null;
          valor_realizado: number | null;
          valores_cancelados: number | null;
        };
        Insert: {
          created_at?: string | null;
          deleted_at?: string | null;
          id?: number;
          meta_contratos?: number | null;
          meta_valor?: number | null;
          quantidade_cancelados?: number | null;
          quantidade_realizada?: number | null;
          semana?: number | null;
          valor_realizado?: number | null;
          valores_cancelados?: number | null;
        };
        Update: {
          created_at?: string | null;
          deleted_at?: string | null;
          id?: number;
          meta_contratos?: number | null;
          meta_valor?: number | null;
          quantidade_cancelados?: number | null;
          quantidade_realizada?: number | null;
          semana?: number | null;
          valor_realizado?: number | null;
          valores_cancelados?: number | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      soma_alunos_info_por_semana: {
        Args: { filter_month?: number; filter_year?: number };
        Returns: {
          eb_skills_basic_ativos: number;
          eb_skills_basic_inativos: number;
          eb_skills_completo_ativos: number;
          eb_skills_completo_inativos: number;
          eb_skills_cursos_ativos: number;
          eb_skills_cursos_inativos: number;
          eb_skills_tira_duvidas_ativos: number;
          eb_skills_tira_duvidas_inativos: number;
          master_ativo: number;
          master_inativo: number;
          pleno_ativo: number;
          pleno_inativos: number;
          porcentagem_ativos: number;
          semana: number;
          senior_ativo: number;
          senior_inativo: number;
          total_ativos: number;
          total_inativos: number;
        }[];
      };
      soma_carteira_mba_por_semana: {
        Args: { filter_month?: number; filter_year?: number };
        Returns: {
          alunos_mba_dp: number;
          alunos_mba_nr1: number;
          alunos_mba_rh: number;
          alunos_total: number;
          cancelados: number;
          churn_alunos: number;
          churn_valores: number;
          percentual_cancelados_alunos: number;
          percentual_cancelados_valores: number;
          semana: number;
          valor_mba_dp: number;
          valor_mba_nr1: number;
          valor_total: number;
          valores_cancelados: number;
        }[];
      };
      soma_gestao_contratos_mba_por_semana: {
        Args: { filter_month?: number; filter_year?: number };
        Returns: {
          dp_assinados: number;
          dp_pendente: number;
          dp_percentual: number;
          nr1_assinados: number;
          nr1_pendente: number;
          nr1_percentual: number;
          rh_assinados: number;
          rh_pendente: number;
          rh_percentual: number;
          semana: number;
          total_assinados: number;
          total_pendentes: number;
          total_percentual: number;
        }[];
      };
      soma_renovacao_por_semana: {
        Args: { filter_month?: number; filter_year?: number };
        Returns: {
          meta_contratos: number;
          meta_valor: number;
          porcentagem_contratos: number;
          quantidade_cancelados: number;
          quantidade_realizada: number;
          semana: number;
          valor_realizado: number;
          valores_cancelados: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
