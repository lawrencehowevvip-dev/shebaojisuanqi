'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { exportResultsToExcel } from '@/lib/excelParser';

interface Result {
  id: number;
  employee_name: string;
  avg_salary: number;
  contribution_base: number;
  company_fee: number;
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/results');
      const data = await response.json();

      if (response.ok) {
        setResults(data.data);
        setError('');
      } else {
        setError(data.error || '获取结果失败');
      }
    } catch (err) {
      setError('获取结果失败: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (results.length === 0) {
      setError('没有数据可导出');
      return;
    }

    try {
      exportResultsToExcel(
        results.map((r) => ({
          employee_name: r.employee_name,
          avg_salary: r.avg_salary,
          contribution_base: r.contribution_base,
          company_fee: r.company_fee,
        }))
      );
    } catch (err) {
      setError('导出失败: ' + (err as Error).message);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">计算结果</h1>
            <p className="text-gray-600 mt-1">
              共 {results.length} 位员工的计算结果
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchResults}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              刷新
            </button>
            <button
              onClick={handleExport}
              disabled={results.length === 0}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              导出Excel
            </button>
            <Link
              href="/"
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : results.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">暂无数据</h3>
            <p className="text-gray-500 mb-6">请先上传数据并执行计算</p>
            <Link
              href="/upload"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              前往上传
            </Link>
          </div>
        ) : (
          /* Results Table */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">序号</th>
                    <th className="px-6 py-4 text-left font-semibold">员工姓名</th>
                    <th className="px-6 py-4 text-right font-semibold">年度月平均工资</th>
                    <th className="px-6 py-4 text-right font-semibold">缴费基数</th>
                    <th className="px-6 py-4 text-right font-semibold">公司缴纳金额</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((result, index) => (
                    <tr
                      key={result.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {result.employee_name}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-700">
                        {formatCurrency(result.avg_salary)}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-700">
                        {formatCurrency(result.contribution_base)}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-green-600">
                        {formatCurrency(result.company_fee)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-right font-semibold text-gray-700">
                      合计
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-600 text-lg">
                      {formatCurrency(
                        results.reduce((sum, r) => sum + r.company_fee, 0)
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
