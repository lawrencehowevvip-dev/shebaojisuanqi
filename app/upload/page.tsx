'use client';

import { useState } from 'react';
import Link from 'next/link';

type UploadType = 'cities' | 'salaries';
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface StatusMessage {
  cities: UploadStatus;
  salaries: UploadStatus;
  calculate: UploadStatus;
}

export default function UploadPage() {
  const [status, setStatus] = useState<StatusMessage>({
    cities: 'idle',
    salaries: 'idle',
    calculate: 'idle',
  });
  const [messages, setMessages] = useState({
    cities: '',
    salaries: '',
    calculate: '',
  });

  const handleFileUpload = async (type: UploadType, file: File | null) => {
    if (!file) {
      setMessages((prev) => ({ ...prev, [type]: '请选择文件' }));
      return;
    }

    setStatus((prev) => ({ ...prev, [type]: 'uploading' }));
    setMessages((prev) => ({ ...prev, [type]: '上传中...' }));

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/upload/${type}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setStatus((prev) => ({ ...prev, [type]: 'success' }));
        setMessages((prev) => ({ ...prev, [type]: result.message }));
      } else {
        setStatus((prev) => ({ ...prev, [type]: 'error' }));
        setMessages((prev) => ({ ...prev, [type]: result.error }));
      }
    } catch (error) {
      setStatus((prev) => ({ ...prev, [type]: 'error' }));
      setMessages((prev) => ({
        ...prev,
        [type]: '上传失败: ' + (error as Error).message,
      }));
    }
  };

  const handleCalculate = async () => {
    setStatus((prev) => ({ ...prev, calculate: 'uploading' }));
    setMessages((prev) => ({ ...prev, calculate: '计算中...' }));

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
      });

      const result = await response.json();

      if (response.ok) {
        setStatus((prev) => ({ ...prev, calculate: 'success' }));
        setMessages((prev) => ({ ...prev, calculate: result.message }));
      } else {
        setStatus((prev) => ({ ...prev, calculate: 'error' }));
        setMessages((prev) => ({ ...prev, calculate: result.error }));
      }
    } catch (error) {
      setStatus((prev) => ({ ...prev, calculate: 'error' }));
      setMessages((prev) => ({
        ...prev,
        calculate: '计算失败: ' + (error as Error).message,
      }));
    }
  };

  const getStatusColor = (s: UploadStatus) => {
    switch (s) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'uploading':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">数据上传与计算</h1>
          <Link
            href="/"
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
          >
            返回首页
          </Link>
        </div>

        <div className="space-y-6">
          {/* Upload Cities */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">上传城市标准数据</h2>
                <p className="text-sm text-gray-500">包含城市名、年份、基数上下限和缴纳比例</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileUpload('cities', e.target.files?.[0] || null)}
                className="flex-1 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                disabled={status.cities === 'uploading'}
              />
            </div>

            {messages.cities && (
              <div className={`mt-4 p-3 rounded-lg border ${getStatusColor(status.cities)}`}>
                {messages.cities}
              </div>
            )}
          </div>

          {/* Upload Salaries */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">上传员工工资数据</h2>
                <p className="text-sm text-gray-500">包含员工工号、姓名、月份和工资金额</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileUpload('salaries', e.target.files?.[0] || null)}
                className="flex-1 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                disabled={status.salaries === 'uploading'}
              />
            </div>

            {messages.salaries && (
              <div className={`mt-4 p-3 rounded-lg border ${getStatusColor(status.salaries)}`}>
                {messages.salaries}
              </div>
            )}
          </div>

          {/* Calculate */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">执行计算</h2>
                <p className="text-sm text-gray-500">根据上传的数据计算社保公积金费用</p>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={status.calculate === 'uploading'}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {status.calculate === 'uploading' ? '计算中...' : '执行计算并存储结果'}
            </button>

            {messages.calculate && (
              <div className={`mt-4 p-3 rounded-lg border ${getStatusColor(status.calculate)}`}>
                {messages.calculate}
              </div>
            )}
          </div>

          {/* Navigation */}
          {status.calculate === 'success' && (
            <Link
              href="/results"
              className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg text-center"
            >
              查看计算结果
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
