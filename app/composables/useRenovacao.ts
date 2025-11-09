/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from "vue";
import type { Database } from "~/types/database.types";

export type RenovacaoType =
  Database["public"]["Functions"]["soma_renovacao_por_semana"]["Returns"];
type Column<T extends Record<string, any>, K extends keyof T = keyof T> = {
  key: K;
  label?: string;
  transform?: (value: T[K], row: T) => any;
};

const columns = [
  {
    key: "Valor Realizado",
    label: "valor_realizado",
  },
  {
    key: "Quantidade Realizada",
    label: "quantidade_realizada",
  },
  {
    key: "Quantidade cancelados",
    label: "quantidade_cancelados",
  },
  {
    key: "Meta em Valor",
    label: "meta_valor",
  },
  {
    key: "Valores cancelados",
    label: "valores_cancelados",
  },
  {
    key: "Meta de Contratos",
    label: "meta_contratos",
  },
  {
    key: "Semana",
    label: "semana",
    transform: (value: string) => Number(extractWeek(value)?.number || 0),
  },
] as const;

function renameFields<T extends Record<string, any>, C extends Column<T>[]>(
  data: T[],
  columns: C
): {
  [I in keyof C as C[I] extends Column<T>
    ? C[I]["label"] extends string
      ? C[I]["label"]
      : C[I]["key"]
    : never]: any;
}[] {
  return data.map((item) => {
    const newItem: Record<string, any> = {};
    columns.forEach((col) => {
      const newKey =
        typeof col.label === "string" ? col.label : String(col.key);
      const value = item[col.key as keyof T];
      newItem[newKey] = col.transform ? col.transform(value, item) : value;
    });
    return newItem as any;
  });
}

export function useRenovacao() {
  const isLoading = ref<boolean>(false);
  const renovacaoData = ref<RenovacaoType>([]);
  const supabase = useSupabaseClient();
  const toast = useToast();

  async function fetchRenovacao(month: number, year: number): Promise<void> {
    isLoading.value = true;
    try {
      const { data, error } = await supabase.rpc("soma_renovacao_por_semana", {
        filter_month: month,
        filter_year: year,
      });

      if (error) throw error;

      renovacaoData.value = data;
    } catch (error) {
      console.error("Erro ao buscar dados de renovação:", error);
    } finally {
      isLoading.value = false;
    }
  }

  async function createRenovacao(data: any) {
    try {
      const cleanedData = validateAndCleanData(data);
      const renamedData = renameFields(cleanedData, columns as any);

      await supabase.from("renovacao").insert(renamedData);
      toast.add({
        title: "Dados de renovação criados com sucesso!",
        icon: "i-lucideon-check-circle",
      });
    } catch (error: any) {
      console.error("Erro ao criar dados de renovação:", error);

      if (
        error.message &&
        error.message.includes("Dados inválidos encontrados:")
      ) {
        toast.add({
          title: "Dados inválidos encontrados!",
          description: toToastMessage(error),
          color: "error",
          icon: "i-lucideon-alert-triangle",
          duration: 15000,
        });
      } else {
        toast.add({
          title: "Erro ao criar dados de renovação",
          color: "error",
          icon: "i-lucideon-alert-triangle",
        });
      }

      throw error;
    }
  }

  return {
    isLoading,
    renovacaoData,
    createRenovacao,
    fetchRenovacao,
  };
}
