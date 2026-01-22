import { NextRequest, NextResponse } from 'next/server';
import { parseSalariesExcel } from '@/lib/excelParser';
import { db } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '未找到上传文件' }, { status: 400 });
    }

    // Check if file is an Excel file
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json({ error: '请上传Excel文件（.xlsx或.xls）' }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse Excel file
    const salaries = await parseSalariesExcel(buffer);

    if (salaries.length === 0) {
      return NextResponse.json({ error: 'Excel文件中没有数据' }, { status: 400 });
    }

    // Clear existing data and insert new data
    await db.clearSalaries();
    await db.insertSalaries(salaries);

    return NextResponse.json({
      success: true,
      message: `成功导入 ${salaries.length} 条员工工资数据`,
      count: salaries.length,
    });
  } catch (error) {
    console.error('Upload salaries error:', error);
    return NextResponse.json(
      { error: '上传失败: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
