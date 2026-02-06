'use client';

import { ResumeData } from '@/lib/api';

interface ResumeResultsProps {
    data: ResumeData;
}

export default function ResumeResults({ data }: ResumeResultsProps) {
    return (
        <div className="glass-card p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-xl font-bold text-dark-900">
                    {data.name ? data.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">{data.name || 'Unknown Candidate'}</h2>
                    <p className="text-sm text-gray-400">{data.emails[0] || 'No email found'}</p>
                </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.phones.length > 0 && (
                    <div className="flex items-center gap-3 text-gray-300">
                        <svg className="w-5 h-5 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{data.phones[0]}</span>
                    </div>
                )}
                {data.links.length > 0 && (
                    <div className="flex items-center gap-3 text-gray-300">
                        <svg className="w-5 h-5 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <a
                            href={data.links[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-cyan hover:underline truncate max-w-xs"
                        >
                            {data.links[0]}
                        </a>
                    </div>
                )}
            </div>

            {/* Skills */}
            {data.skills.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Skills ({data.skills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, index) => (
                            <span key={index} className="skill-badge">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Summary */}
            {data.summary && (
                <div className="pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-400">{data.summary}</p>
                </div>
            )}
        </div>
    );
}
