import * as XLSX from "xlsx";
import { serverSupabaseClient } from "#supabase/server";

interface ExcelRow {
  [key: string]: string | number | boolean | Date;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readFormData(event);
    const file = body.get("file") as File;

    if (!file) {
      throw createError({
        statusCode: 400,
        statusMessage: "Nenhum arquivo foi enviado",
      });
    }

    const workbook = XLSX.read(await file.arrayBuffer());
    const client = await serverSupabaseClient(event);

    function parseSemana(text: string) {
      return Number(text.match(/Semana\s+(\d+)/i)?.[1] || null) || null;
    }

    function normalized(row: ExcelRow) {
      const normalizeData: { [key: string]: any } = {};

      Object.keys(row).forEach((key) => {
        const lowercaseKey = key.toLowerCase();

        if (String(row[key]).includes("Semana")) {
          normalizeData[lowercaseKey] = parseSemana(row[key] as string);
        } else if (typeof row[key] === "string") {
          normalizeData[lowercaseKey] =
            (row[key] as string).replace(/#DIV\/0!/g, "").trim() || 0;
        } else {
          normalizeData[lowercaseKey] = row[key];
        }
      });

      return normalizeData;
    }

    for (const sheetName of workbook.SheetNames) {
      const sheets = workbook.Sheets;
      const workSheet = sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(workSheet) as ExcelRow[];

      if (sheetName === "Renovação") {
        const newData = rows.map((row) => {
          const normalizeData = normalized(row);
          return {
            semana: normalizeData?.["semana"] ?? "",
            meta_valor: normalizeData?.["meta em valor"] ?? "",
            valor_realizado: normalizeData?.["valor realizado"] ?? "",
            meta_contratos: normalizeData?.["meta de contratos"] ?? "",
            quantidade_realizada: normalizeData?.["quantidade realizada"] ?? "",
            valores_cancelados: normalizeData?.["valores cancelados"] ?? "",
            quantidade_cancelados:
              normalizeData?.["quantidade cancelados"] ?? "",
          };
        });

        const { error } = await client.from("renovacao").insert(newData);

        if (error) {
          throw createError({
            statusCode: 500,
            statusMessage: `Erro ao inserir dados: ${error.message}`,
          });
        }
      }

      if (sheetName === "Base de Alunos Info") {
        const newData = rows.map((row) => {
          const normalizeData = normalized(row);
          return {
            semana: normalizeData?.["semana"] ?? 0,
            senior_ativo: normalizeData?.["sênior ativo"] ?? 0,
            senior_inativo: normalizeData?.["sênior inativo"] ?? 0,
            pleno_ativo: normalizeData?.["pleno ativo"] ?? 0,
            pleno_inativos: normalizeData?.["pleno inativos"] ?? 0,
            master_ativo: normalizeData?.["master ativo"] ?? 0,
            master_inativo: normalizeData?.["master inativo"] ?? 0,
            eb_skills_basic_ativos:
              normalizeData?.["eb skills basic ativos"] ?? 0,
            eb_skills_basic_inativos:
              normalizeData?.["eb skills basic inativos"] ?? 0,
            eb_skills_completo_ativos:
              normalizeData?.["eb skills completo ativos"] ?? 0,
            eb_skills_completo_inativos:
              normalizeData?.["eb skills completo inativos"] ?? 0,
            eb_skills_tira_duvidas_ativos:
              normalizeData?.["eb skills tira dúvidas ativos"] ?? 0,
            eb_skills_tira_duvidas_inativos:
              normalizeData?.["eb skills tira dúvidas inativos"] ?? 0,
            eb_skills_cursos_ativos:
              normalizeData?.["eb skills cursos ativos"] ?? 0,
            eb_skills_cursos_inativos:
              normalizeData?.["eb skills cursos inativos"] ?? 0,
          };
        });

        const { error } = await client
          .from("base_de_alunos_info")
          .insert(newData);

        if (error) {
          throw createError({
            statusCode: 500,
            statusMessage: `Erro ao inserir dados: ${error.message}`,
          });
        }
      }

      if (sheetName === "Gestão de Contratos MBA") {
        const newData = rows.map((row) => {
          const normalizeData = normalized(row);
          return {
            semana: normalizeData?.["semana"] ?? 0,
            rh_assinados: normalizeData?.["rh assinados"] ?? 0,
            rh_pendente: normalizeData?.["rh pendente"] ?? 0,
            nr1_assinados: normalizeData?.["nr1 assinados"] ?? 0,
            nr1_pendente: normalizeData?.["nr1 pendente"] ?? 0,
            dp_assinados: normalizeData?.["dp assinados"] ?? 0,
            dp_pendente: normalizeData?.["dp pendente"] ?? 0,
          };
        });

        const { error } = await client
          .from("gestao_de_contratos_mba")
          .insert(newData);

        if (error) {
          throw createError({
            statusCode: 500,
            statusMessage: `Erro ao inserir dados: ${error.message}`,
          });
        }
      }

      if (sheetName === "Carteira MBA") {
        const newData = rows.map((row) => {
          const normalizeData = normalized(row);
          return {
            semana: normalizeData?.["semana"] ?? 0,
            rh_assinados: normalizeData?.["rh assinados"] ?? 0,
            rh_pendente: normalizeData?.["rh pendente"] ?? 0,
            nr1_assinados: normalizeData?.["nr1 assinados"] ?? 0,
            nr1_pendente: normalizeData?.["nr1 pendente"] ?? 0,
            dp_assinados: normalizeData?.["dp assinados"] ?? 0,
            dp_pendente: normalizeData?.["dp pendente"] ?? 0,
          };
        });

        const { error } = await client
          .from("gestao_de_contratos_mba")
          .insert(newData);

        if (error) {
          throw createError({
            statusCode: 500,
            statusMessage: `Erro ao inserir dados: ${error.message}`,
          });
        }
      }
    }
  } catch (error) {
    console.error("Erro no upload:", error);

    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage:
        error instanceof Error
          ? error.message
          : "Erro interno do servidor ao processar arquivo",
    });
  }
});
