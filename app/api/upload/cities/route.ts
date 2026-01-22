import { NextRequest, NextResponse } from 'next/server';
import { parseCitiesExcel } from '@/lib/excelParser';
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
    const cities = await parseCitiesExcel(buffer);

    // Debug: 打印解析结果
    console.log('Parsed cities data:', JSON.stringify(cities, null, 2));

    if (cities.length === 0) {
      return NextResponse.json({ error: 'Excel文件中没有数据' }, { status: 400 });
    }

    // Clear existing data and insert new data
    await db.clearCities();
    await db.insertCities(cities);

    return NextResponse.json({
      success: true,
      message: `成功导入 ${cities.length} 条城市标准数据`,
      count: cities.length,
    });
  } catch (error) {
    console.error('Upload cities error:', error);
    return NextResponse.json(
      { error: '上传失败: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
