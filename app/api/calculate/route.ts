import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function POST() {
  try {
    // 1. Get all salaries from database
    const salaries = await db.getSalaries();

    if (salaries.length === 0) {
      return NextResponse.json({ error: '没有工资数据，请先上传员工工资数据' }, { status: 400 });
    }

    // 2. Get cities data (currently only Foshan)
    const cities = await db.getCities();

    if (cities.length === 0) {
      return NextResponse.json({ error: '没有城市标准数据，请先上传城市标准数据' }, { status: 400 });
    }

    // Find Foshan city data
    const cityData = cities.find(c => c.city_name === '佛山');

    if (!cityData) {
      return NextResponse.json({ error: '未找到佛山市的标准数据' }, { status: 400 });
    }

    // 3. Group salaries by employee name and calculate average salary
    const employeeSalaries = new Map<string, number[]>();

    salaries.forEach((salary) => {
      if (!employeeSalaries.has(salary.employee_name)) {
        employeeSalaries.set(salary.employee_name, []);
      }
      employeeSalaries.get(salary.employee_name)!.push(salary.salary_amount);
    });

    // 4. Calculate for each employee
    const results: Array<{
      employee_name: string;
      avg_salary: number;
      contribution_base: number;
      company_fee: number;
    }> = [];

    for (const [employeeName, salaryList] of employeeSalaries.entries()) {
      // Calculate average salary
      const avgSalary =
        salaryList.reduce((sum, amount) => sum + amount, 0) / salaryList.length;

      // Determine contribution base
      let contributionBase: number;
      if (avgSalary < cityData.base_min) {
        contributionBase = cityData.base_min;
      } else if (avgSalary > cityData.base_max) {
        contributionBase = cityData.base_max;
      } else {
        contributionBase = avgSalary;
      }

      // Calculate company fee
      const companyFee = contributionBase * cityData.rate;

      results.push({
        employee_name: employeeName,
        avg_salary: Math.round(avgSalary * 100) / 100,
        contribution_base: Math.round(contributionBase * 100) / 100,
        company_fee: Math.round(companyFee * 100) / 100,
      });
    }

    // 5. Clear existing results and insert new results
    await db.clearResults();
    await db.insertResults(results);

    return NextResponse.json({
      success: true,
      message: `计算完成，共处理 ${results.length} 位员工`,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { error: '计算失败: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
