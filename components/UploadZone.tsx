import React, { useState } from 'react';
import { FileText, UploadCloud, ArrowRight, FileType, Image as ImageIcon } from 'lucide-react';
import { GenerationRequest } from '../types';

interface InputFormProps {
  onSubmit: (data: GenerationRequest) => void;
  isProcessing: boolean;
}

export const UploadZone: React.FC<InputFormProps> = ({ onSubmit, isProcessing }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    onSubmit({ file });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    
    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid PDF, JPG, or PNG file.");
    }
  };

  const getFileIcon = () => {
      if (!file) return <UploadCloud className="w-8 h-8" />;
      if (file.type.startsWith('image/')) return <ImageIcon className="w-8 h-8" />;
      return <FileText className="w-8 h-8" />;
  };

  return (
    <div className="w-full bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -z-0"></div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        
        <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-white">Upload Document or Image</h3>
            <p className="text-sm text-slate-400">Select a PDF, JPG, or PNG file to convert</p>
        </div>

        {/* Drop Zone Visual */}
        <div className="relative group cursor-pointer">
           <div className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all ${
               file 
               ? 'border-green-500/50 bg-green-500/5' 
               : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
           }`}>
                {!file ? (
                    <>
                        <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4 text-slate-400 group-hover:text-white group-hover:scale-110 transition-all">
                            <UploadCloud className="w-8 h-8" />
                        </div>
                        <p className="text-slate-300 font-medium mb-1">Click to upload</p>
                        <p className="text-xs text-slate-500">Supports PDF, JPG, PNG</p>
                    </>
                ) : (
                    <>
                         <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 text-green-400">
                            {getFileIcon()}
                        </div>
                        <p className="text-white font-medium mb-1">{file.name}</p>
                        <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
                        <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); setFile(null); }}
                            className="mt-4 text-xs text-red-400 hover:text-red-300 underline"
                        >
                            Remove file
                        </button>
                    </>
                )}
           </div>
           
           <input 
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png" 
              onChange={handleFileUpload} 
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isProcessing}
           />
        </div>

        {/* Info Section */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex items-center gap-4">
             <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <FileType className="w-5 h-5 text-red-400" />
             </div>
             <ArrowRight className="w-5 h-5 text-slate-600" />
             <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <FileType className="w-5 h-5 text-green-400" />
             </div>
             <div className="ml-auto text-right">
                <p className="text-xs font-medium text-slate-300">Auto-Email Service</p>
                <p className="text-[10px] text-slate-500">vdses.ngo@gmail.com</p>
             </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing || !file}
          className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white
            bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-green-500/25`}
        >
          {isProcessing ? 'Processing...' : 'Convert & Mail File'}
          {!isProcessing && <ArrowRight className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
};