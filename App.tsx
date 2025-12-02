import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ConversionSuccess } from './components/ConversionSuccess';
import { AppStatus, GeneratedContent, GenerationRequest } from './types';
import { Loader2, FileCog, Mail } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [content, setContent] = useState<GeneratedContent | null>(null);

  const handleConversion = async (data: GenerationRequest) => {
    // 1. Uploading State
    setStatus(AppStatus.CONVERTING);
    
    // Simulate Processing Time (Conversion)
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // 2. Sending Email State
    setStatus(AppStatus.SENDING_MAIL);
    
    // Simulate Network Time (Email)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create a fake CDR blob for download (It's just the original file with a new name for demo purposes)
    // In a real app, this would be the binary response from a backend.
    const cdrUrl = URL.createObjectURL(data.file); 
    const originalName = data.file.name;
    
    // Robustly replace the file extension with .cdr
    const lastDotIndex = originalName.lastIndexOf('.');
    const convertedName = (lastDotIndex !== -1 ? originalName.substring(0, lastDotIndex) : originalName) + '.cdr';

    setContent({
        originalName,
        convertedName,
        recipient: 'vdses.ngo@gmail.com',
        cdrUrl
    });
    
    setStatus(AppStatus.SUCCESS);
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setContent(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 selection:bg-green-500/30">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[80vh]">
        
        {/* IDLE VIEW */}
        {status === AppStatus.IDLE && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="text-center mb-10">
                <div className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-bold uppercase tracking-wider mb-4">
                  Public Service Tool
                </div>
                <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                  Free File to CDR <span className="text-green-500">Converter</span>
                </h2>
                <p className="text-slate-400 max-w-lg mx-auto text-lg">
                  Upload your PDF, JPG, or PNG files. We convert them to CorelDRAW format and email them directly to the processing team at <strong>vdses.ngo</strong>.
                </p>
              </div>
              <UploadZone onSubmit={handleConversion} isProcessing={false} />
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                 <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                    <h4 className="text-white font-semibold mb-1">100% Free</h4>
                    <p className="text-slate-500 text-sm">Open for public use</p>
                 </div>
                 <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                    <h4 className="text-white font-semibold mb-1">Instant Delivery</h4>
                    <p className="text-slate-500 text-sm">Direct email dispatch</p>
                 </div>
                 <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                    <h4 className="text-white font-semibold mb-1">Secure</h4>
                    <p className="text-slate-500 text-sm">Files processed safely</p>
                 </div>
              </div>
          </div>
        )}

        {/* PROCESSING VIEWS */}
        {(status === AppStatus.CONVERTING || status === AppStatus.SENDING_MAIL) && (
          <div className="w-full max-w-xl text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-green-500 rounded-full animate-spin"></div>
              {status === AppStatus.CONVERTING ? (
                 <FileCog className="absolute inset-0 m-auto w-10 h-10 text-green-500 animate-pulse" />
              ) : (
                 <Mail className="absolute inset-0 m-auto w-10 h-10 text-blue-500 animate-pulse" />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {status === AppStatus.CONVERTING ? 'Converting File...' : 'Sending Email...'}
              </h3>
              <p className="text-slate-400">
                {status === AppStatus.CONVERTING 
                    ? 'Vectorizing image/document data to CorelDRAW format.' 
                    : 'Attaching CDR file and connecting to mail server.'}
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS VIEW */}
        {status === AppStatus.SUCCESS && content && (
          <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4">
            <ConversionSuccess content={content} onReset={handleReset} />
          </div>
        )}

      </main>

      <footer className="w-full border-t border-slate-800/50 py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-slate-500 text-xs">
                © {new Date().getFullYear()} HIMAN Public Service. Powered by vdses.ngo.
            </p>
            <p className="text-slate-600 text-[10px] mt-1">
                For support or bulk conversion, contact support.
            </p>
        </div>
      </footer>
    </div>
  );
}