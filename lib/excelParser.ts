import * as xlsx from 'xlsx';
import type { City, Salary } from './supabase';

export interface ParsedCityData {
  city_name: string;
  year: string;
  base_min: number;
  base_max: number;
  rate: number;
}

export interface ParsedSalaryData {
  employee_id: string;
  employee_name: string;
  month: string;
  salary_amount: number;
}

/**
 * Parse Excel file for cities data (server-side)
 * Expected format:
 * | city_name | year | base_min | base_max | rate |
 */
export async function parseCitiesExcel(buffer: Buffer): Promise<ParsedCityData[]> {
  try {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet) as any[];

    // Debug: 打印原始数据
    console.log('Raw Excel data:', JSON.stringify(jsonData, null, 2));

    const cities: ParsedCityData[] = jsonData.map((row) => ({
      city_name: String(
        row.city_name ||
        row['city name'] ||
        row['city_namte '] ||  // Excel中的拼写错误列名
        row['城市名'] ||
        row['城市'] ||
        ''
      ).trim(),
      year: String(row.year || row['年份'] || '').trim(),
      base_min: Number(row.base_min || row['基数下限'] || 0),
      base_max: Number(row.base_max || row['基数上限'] || 0),
      rate: Number(row.rate || row['缴纳比例'] || 0),
    }));

    return cities;
  } catch (error) {
    throw new Error('解析城市数据失败: ' + (error as Error).message);
  }
}

/**
 * Parse Excel file for salaries data (server-side)
 * Expected format:
 * | employee_id | employee_name | month | salary_amount |
 */
export async function parseSalariesExcel(buffer: Buffer): Promise<ParsedSalaryData[]> {
  try {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet) as any[];

    const salaries: ParsedSalaryData[] = jsonData.map((row) => ({
      employee_id: String(row.employee_id || row['员工工号'] || '').trim(),
      employee_name: String(row.employee_name || row['员工姓名'] || '').trim(),
      month: String(row.month || row['月份'] || '').trim(),
      salary_amount: Number(row.salary_amount || row['工资金额'] || 0),
    }));

    return salaries;
  } catch (error) {
    throw new Error('解析工资数据失败: ' + (error as Error).message);
  }
}

/**
 * Export results data to Excel file
 */
export function exportResultsToExcel(
  results: Array<{
    employee_name: string;
    avg_salary: number;
    contribution_base: number;
    company_fee: number;
  }>,
  filename: string = '社保计算结果.xlsx'
) {
  const worksheet = xlsx.utils.json_to_sheet(
    results.map((r) => ({
      '员工姓名': r.employee_name,
      '年度月平均工资': r.avg_salary,
      '缴费基数': r.contribution_base,
      '公司缴纳金额': r.company_fee,
    }))
  );

  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, '计算结果');
  xlsx.writeFile(workbook, filename);
}
