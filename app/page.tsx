import Link from 'next/link';

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80")',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl font-bold text-white mb-4">
          五险一金计算器
        </h1>
        <p className="text-xl text-gray-200 mb-12">
          企业社保公积金费用计算工具
        </p>

        <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
          {/* Card 1: Data Upload */}
          <Link
            href="/upload"
            className="flex-1 bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl hover:scale-105 hover:shadow-3xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                数据上传
              </h2>
              <p className="text-gray-600">
                上传城市标准和员工工资数据，执行计算
              </p>
            </div>
          </Link>

          {/* Card 2: Results */}
          <Link
            href="/results"
            className="flex-1 bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl hover:scale-105 hover:shadow-3xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                结果查询
              </h2>
              <p className="text-gray-600">
                查看计算结果并导出Excel报告
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
