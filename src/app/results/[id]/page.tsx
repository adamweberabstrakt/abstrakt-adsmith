'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BrandHeader } from '@/components/Logo';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { ChilipiperPopup } from '@/components/ChilipiperPopup';
import { FormData, AnalysisResult } from '@/lib/types';

interface StoredResults {
    id: string;
    formData: FormData;
    leadData: {
      email: string;
      companyName: string;
      role: string;
      wantsCall: boolean;
    };
    analysisResult: AnalysisResult;
    createdAt: string;
}

export default function SharedResultsPage() {
    const params = useParams();
    const id = params.id as string;

  const [results, setResults] = useState<StoredResults | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
    const [copied, setCopied] = useState(false);

  useEffect(() => {
        async function fetchResults() {
                try {
                          const response = await fetch(`/api/results/${id}`);
                          if (!response.ok) {
                                      if (response.status === 404) {
                                                    setError('Results not found or have expired.');
                                      } else {
                                                    setError('Failed to load results.');
                                      }
                                      return;
                          }
                          const data = await response.json();
                          setResults(data);
                } catch (err) {
                          console.error('Error fetching results:', err);
                          setError('Failed to load results.');
                } finally {
                          setIsLoading(false);
                }
        }

                if (id) {
                        fetchResults();
                }
  }, [id]);

  const handleCopyLink = async () => {
        try {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
        } catch (err) {
                console.error('Failed to copy:', err);
        }
  };

  const handleStartOver = () => {
        window.location.href = '/';
  };

  const handleRegenerateMessaging = async () => {
        alert('Regenerating messaging is only available during the initial assessment.');
  };

  if (isLoading) {
        return (
                <main className="min-h-screen pb-12">
                        <BrandHeader />
                        <div className="max-w-4xl mx-auto px-4">
                                  <div className="flex flex-col items-center justify-center py-20">
                                              <div className="spinner mb-6" />
                                              <h2 className="text-2xl font-heading font-bold text-white mb-2">
                                                            Loading Results
                                              </h2>h2>
                                              <p className="text-abstrakt-text-muted text-center max-w-md">
                                                            Fetching your brand analysis...
                                              </p>p>
                                  </div>div>
                        </div>div>
                </main>main>
              );
  }
  
    if (error || !results) {
          return (
                  <main className="min-h-screen pb-12">
                          <BrandHeader />
                          <div className="max-w-4xl mx-auto px-4">
                                    <div className="flex flex-col items-center justify-center py-20">
                                                <div className="w-16 h-16 rounded-full bg-red-900/20 flex items-center justify-center mb-6">
                                                              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                              </svg>svg>
                                                </div>div>
                                                <h2 className="text-2xl font-heading font-bold text-white mb-2">
                                                              Results Not Found
                                                </h2>h2>
                                                <p className="text-abstrakt-text-muted text-center max-w-md mb-6">
                                                  {error || 'This results page may have expired or the link is invalid.'}
                                                </p>p>
                                                <a
                                                                href="/"
                                                                className="abstrakt-button"
                                                              >
                                                              Start New Assessment
                                                </a>a>
                                    </div>div>
                          </div>div>
                  </main>main>
                );
    }
  
    return (
          <main className="min-h-screen pb-12">
                <BrandHeader />
                <div className="max-w-4xl mx-auto px-4">
                  {/* Shared Results Banner */}
                        <div className="mb-6 bg-abstrakt-card rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-abstrakt-card-border">
                                  <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 rounded-full bg-abstrakt-orange/20 flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-abstrakt-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                            </svg>svg>
                                              </div>div>
                                              <div>
                                                            <p className="text-white font-medium">Shared Results</p>p>
                                                            <p className="text-xs text-abstrakt-text-dim">
                                                                            Created {new Date(results.createdAt).toLocaleDateString()}
                                                            </p>p>
                                              </div>div>
                                  </div>div>
                                  <button
                                                onClick={handleCopyLink}
                                                className="abstrakt-button-outline text-sm px-4 py-2 flex items-center gap-2"
                                              >
                                    {copied ? (
                                                              <>
                                                                              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                              </svg>svg>
                                                                              Copied!
                                                              </>>
                                                            ) : (
                                                              <>
                                                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                              </svg>svg>
                                                                              Copy Link
                                                              </>>
                                                            )}
                                  </button>button>
                        </div>div>
                
                        <ResultsDisplay
                                    result={results.analysisResult}
                                    formData={results.formData}
                                    onStartOver={handleStartOver}
                                    onRegenerateMessaging={handleRegenerateMessaging}
                                    onOpenScheduler={() => setIsSchedulerOpen(true)}
                                  />
                </div>div>
          
            {/* Chilipiper Popup */}
                <ChilipiperPopup
                          isOpen={isSchedulerOpen}
                          onClose={() => setIsSchedulerOpen(false)}
                        />
          </main>main>
        );
}</></></main>
