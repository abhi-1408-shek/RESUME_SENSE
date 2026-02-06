'use client';

import { useState, useCallback } from 'react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    isLoading?: boolean;
}

export default function FileUpload({ onFileSelect, isLoading }: FileUploadProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const file = e.dataTransfer.files[0];
        if (file && isValidFile(file)) {
            setFileName(file.name);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && isValidFile(file)) {
            setFileName(file.name);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const isValidFile = (file: File) => {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        const validExtensions = ['.pdf', '.docx', '.txt'];
        return validTypes.includes(file.type) || validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
        upload-zone glass-card p-12 text-center cursor-pointer
        transition-all duration-300 ease-out
        ${isDragOver ? 'dragover' : ''}
        ${isLoading ? 'opacity-50 pointer-events-none' : ''}
      `}
        >
            <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={isLoading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
                {/* Icon */}
                <div className="mb-6">
                    <svg
                        className="w-16 h-16 mx-auto text-accent-cyan opacity-60"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                </div>

                {/* Text */}
                {fileName ? (
                    <div>
                        <p className="text-lg font-semibold text-accent-cyan">{fileName}</p>
                        <p className="text-sm text-gray-400 mt-2">Click or drop to change file</p>
                    </div>
                ) : (
                    <div>
                        <p className="text-lg font-medium text-gray-200">
                            Drop your resume here, or <span className="text-accent-cyan">browse</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Supports PDF, DOCX, TXT
                        </p>
                    </div>
                )}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="mt-4">
                        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-sm text-gray-400 mt-2">Analyzing...</p>
                    </div>
                )}
            </label>
        </div>
    );
}
