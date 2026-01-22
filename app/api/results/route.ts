import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function GET() {
  try {
    const results = await db.getResults();

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Get results error:', error);
    return NextResponse.json(
      { error: '获取结果失败: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
