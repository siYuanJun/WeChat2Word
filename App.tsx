
import React, { useState } from 'react';
import Header from './components/Header';
import { ScriptConfig, GeneratedScript } from './types';
import { generatePythonScript } from './services/geminiService';

const App: React.FC = () => {
  const [urlInput, setUrlInput] = useState('');
  const [config, setConfig] = useState<ScriptConfig>({
    urls: [],
    includeImages: true,
    savePath: './outputs',
    concurrency: 5,
    filenameTemplate: '{title}.docx',
    useProxy: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedScript | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const urls = urlInput
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.startsWith('http'));

    if (urls.length === 0) {
      setError('请至少输入一个有效的微信公众号文章链接');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await generatePythonScript({ ...config, urls });
      setGeneratedResult(result);
    } catch (err: any) {
      setError(err.message || '生成失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板');
  };

  const downloadFile = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Configuration Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                文章链接输入
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-slate-700">公众号文章链接 (每行一个)</label>
                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      已识别: {urlInput.split('\n').filter(u => u.trim().startsWith('http')).length} 个
                    </span>
                  </div>
                  <textarea 
                    className="w-full h-40 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-mono text-sm resize-none"
                    placeholder="https://mp.weixin.qq.com/s/..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                高级参数
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">保存路径</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
                    value={config.savePath}
                    onChange={(e) => setConfig({...config, savePath: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">并发数</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="20"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
                    value={config.concurrency}
                    onChange={(e) => setConfig({...config, concurrency: parseInt(e.target.value) || 1})}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    id="includeImages"
                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                    checked={config.includeImages}
                    onChange={(e) => setConfig({...config, includeImages: e.target.checked})}
                  />
                  <label htmlFor="includeImages" className="text-sm font-medium text-slate-700">下载图片并插入 Word</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    id="useProxy"
                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                    checked={config.useProxy}
                    onChange={(e) => setConfig({...config, useProxy: e.target.checked})}
                  />
                  <label htmlFor="useProxy" className="text-sm font-medium text-slate-700">使用 HTTP 代理</label>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    正在生成脚本...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    生成批量下载脚本
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-7">
            {!generatedResult && !isLoading ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">生成定制 Python 脚本</h3>
                <p className="text-slate-500 max-w-sm">在左侧输入您的链接并调整参数。生成的脚本将自动包含这些链接，您可以直接在本地运行实现批量下载。</p>
              </div>
            ) : generatedResult ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-700">wechat_batch_exporter.py</span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => copyToClipboard(generatedResult.code)}
                        className="text-xs bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors flex items-center shadow-sm"
                      >
                        复制代码
                      </button>
                      <button 
                        onClick={() => downloadFile(generatedResult.code, 'wechat_batch_exporter.py')}
                        className="text-xs bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors flex items-center shadow-sm"
                      >
                        下载文件
                      </button>
                    </div>
                  </div>
                  <div className="p-0 overflow-x-auto bg-slate-900">
                    <pre className="p-6 text-sm font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
                      {generatedResult.code}
                    </pre>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                      1. 安装环境
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <code className="text-xs font-mono text-slate-700 break-all">
                        pip install {generatedResult.requirements.join(' ')}
                      </code>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      2. 运行脚本
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {generatedResult.usageInstructions}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500">AI 正在根据您的链接编写 Python 代码...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2024 WeChat2Word Tool - 批量导出微信文章的最佳方案</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
