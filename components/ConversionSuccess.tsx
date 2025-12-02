import React from 'react';
import { CheckCircle2, Download, Mail, FileType, RotateCcw, ExternalLink, Share2 } from 'lucide-react';
import { GeneratedContent } from '../types';
import { downloadUrl } from '../utils/fileUtils';

interface ResultViewProps {
  content: GeneratedContent;
  onReset: () => void;
}

export const ConversionSuccess: React.FC<ResultViewProps> = ({ content, onReset }) => {
  
  const handleDownload = () => {
     downloadUrl(content.cdrUrl, content.convertedName);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HIMAN Converter',
          text: 'I just converted my file to CDR for free using HIMAN!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for desktop
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Success Card */}
      <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-green-500/30 animate-in fade-in slide-in-from-bottom-4">
        
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-8 text-center border-b border-green-500/20">
            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-green-500/30">
                <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Process Completed</h2>
            <p className="text-green-200">File converted and emailed successfully</p>
        </div>

        <div className="p-6 md:p-8 space-y-6">
            {/* Email Status */}
            <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
                    <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h3 className="text-white font-medium mb-1">Email Sent</h3>
                    <p className="text-sm text-slate-400 mb-2">
                        The converted CDR file has been mailed to:
                    </p>
                    <a 
                      href={`mailto:${content.recipient}`}
                      className="inline-block bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-blue-300 hover:text-blue-200 text-sm font-mono border border-slate-700 transition-colors cursor-pointer group"
                    >
                        {content.recipient}
                        <ExternalLink className="w-3 h-3 inline-block ml-2 opacity-50 group-hover:opacity-100" />
                    </a>
                </div>
            </div>

            {/* File Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 flex flex-col">
                    <span className="text-xs text-slate-500 uppercase tracking-wider mb-2">Original File</span>
                    <div className="flex items-center gap-2 text-slate-300 font-medium">
                        <FileType className="w-4 h-4 text-red-400" />
                        <span className="truncate">{content.originalName}</span>
                    </div>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 flex flex-col">
                    <span className="text-xs text-slate-500 uppercase tracking-wider mb-2">Converted File</span>
                    <div className="flex items-center gap-2 text-green-400 font-medium">
                        <FileType className="w-4 h-4" />
                        <span className="truncate">{content.convertedName}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
                <button
                    onClick={handleDownload}
                    className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-900/20"
                >
                    <Download className="w-5 h-5" />
                    Download Converted CDR
                </button>
                
                <button
                    onClick={handleShare}
                    className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                >
                    <Share2 className="w-5 h-5" />
                    Share this Tool
                </button>
            </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Convert Another File
        </button>
      </div>
    </div>
  );
};