'use client';

import { MatchResult } from '@/lib/api';

interface MatchScoreProps {
    result: MatchResult;
}

export default function MatchScore({ result }: MatchScoreProps) {
    const score = result.overall_score;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;

    const getScoreColor = (s: number) => {
        if (s >= 70) return '#22c55e'; // green
        if (s >= 40) return '#eab308'; // yellow
        return '#ef4444'; // red
    };

    const getScoreLabel = (s: number) => {
        if (s >= 70) return 'Excellent Match';
        if (s >= 40) return 'Good Potential';
        return 'Needs Improvement';
    };

    return (
        <div className="glass-card p-8">
            <h3 className="text-lg font-semibold text-white mb-6 text-center">Match Analysis</h3>

            {/* Score Ring */}
            <div className="flex justify-center mb-8">
                <div className="relative w-32 h-32">
                    <svg className="score-ring w-full h-full" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="8"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={getScoreColor(score)}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            style={{ filter: `drop-shadow(0 0 6px ${getScoreColor(score)})` }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">{Math.round(score)}%</span>
                        <span className="text-xs text-gray-400">{getScoreLabel(score)}</span>
                    </div>
                </div>
            </div>

            {/* Skills Analysis */}
            <div className="space-y-4">
                {/* Matching Skills */}
                {result.matching_skills.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-semibold text-green-400">
                                Matching ({result.matching_skills.length})
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {result.matching_skills.slice(0, 10).map((skill, i) => (
                                <span key={i} className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                                    {skill}
                                </span>
                            ))}
                            {result.matching_skills.length > 10 && (
                                <span className="px-2 py-1 text-xs text-gray-500">+{result.matching_skills.length - 10} more</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Missing Skills */}
                {result.missing_skills.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-semibold text-red-400">
                                Missing ({result.missing_skills.length})
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {result.missing_skills.slice(0, 10).map((skill, i) => (
                                <span key={i} className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                                    {skill}
                                </span>
                            ))}
                            {result.missing_skills.length > 10 && (
                                <span className="px-2 py-1 text-xs text-gray-500">+{result.missing_skills.length - 10} more</span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                        {result.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                <span className="text-accent-cyan">•</span>
                                {rec}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
