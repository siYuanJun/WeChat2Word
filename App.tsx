
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import { ScriptConfig, GeneratedScript } from './types';
import { generatePythonScript } from './services/geminiService';

const App: React.FC = () => {
  const [config, setConfig] = useState<ScriptConfig>({
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
    setIsLoading(true);
    setError(null);
    try {
      const result = await generatePythonScript(config);
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
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                配置选项
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">下载保存路径</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={config.savePath}
                    onChange={(e) => setConfig({...config, savePath: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">并发线程数 (1-20)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="20"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={config.concurrency}
                    onChange={(e) => setConfig({...config, concurrency: parseInt(e.target.value) || 1})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">文件命名模板</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={config.filenameTemplate}
                    onChange={(e) => setConfig({...config, filenameTemplate: e.target.value})}
                    placeholder="{title}.docx"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="includeImages"
                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                    checked={config.includeImages}
                    onChange={(e) => setConfig({...config, includeImages: e.target.checked})}
                  />
                  <label htmlFor="includeImages" className="text-sm font-medium text-slate-700">保存文章中的图片</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    id="useProxy"
                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                    checked={config.useProxy}
                    onChange={(e) => setConfig({...config, useProxy: e.target.checked})}
                  />
                  <label htmlFor="useProxy" className="text-sm font-medium text-slate-700">启用 HTTP 代理支持</label>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      正在生成...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      生成 Python 脚本
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-8">
            {!generatedResult && !isLoading ? (
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">准备好生成你的脚本了吗？</h3>
                <p className="text-slate-500 max-w-sm">配置左侧的选项，点击“生成 Python 脚本”即可获得一个全功能的微信文章批量导出工具。</p>
              </div>
            ) : generatedResult ? (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-700">wechat_exporter.py</span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => copyToClipboard(generatedResult.code)}
                        className="text-xs bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        复制代码
                      </button>
                      <button 
                        onClick={() => downloadFile(generatedResult.code, 'wechat_exporter.py')}
                        className="text-xs bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        下载文件
                      </button>
                    </div>
                  </div>
                  <div className="p-0 overflow-x-auto bg-slate-900">
                    <pre className="p-6 text-sm font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed">
                      {generatedResult.code}
                    </pre>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                      安装依赖
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <code className="text-xs font-mono text-slate-700">
                        pip install {generatedResult.requirements.join(' ')}
                      </code>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      使用指南
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {generatedResult.usageInstructions}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full animate-pulse">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500">正在通过 AI 引擎构建你的定制脚本...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2024 WeChat2Word Tool - Powered by Gemini API & Python Docx</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
