import { useState } from 'react';
import { updateApiBaseUrl, getConfiguredApiUrl } from '../lib/api';

export default function AboutPage() {
  const [apiUrl, setApiUrl] = useState(getConfiguredApiUrl());
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveUrl = () => {
    if (apiUrl.trim()) {
      updateApiBaseUrl(apiUrl.trim());
    }
  };

  const handleReset = () => {
    const defaultUrl = import.meta.env.VITE_API_URL || 'https://musician-vaccine-conversation-promo.trycloudflare.com';
    setApiUrl(defaultUrl);
    localStorage.removeItem('apiBaseUrl');
    updateApiBaseUrl(defaultUrl);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About CyberShare</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p className="text-muted-foreground text-lg mb-4">
            CyberShare is a modern social blogging platform designed to bring writers and readers together.
          </p>

          {/* API Configuration Section */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-6 rounded-lg my-6 not-prose">
            <h3 className="text-xl font-semibold mb-3 text-blue-900 dark:text-blue-100">⚙️ API Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Current API Base URL:
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      placeholder="Enter API URL"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveUrl}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                      >
                        Save & Reload
                      </button>
                      <button
                        onClick={() => {
                          setApiUrl(getConfiguredApiUrl());
                          setIsEditing(false);
                        }}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium"
                      >
                        Reset to Default
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-blue-300 dark:border-blue-700 rounded-md text-sm text-gray-900 dark:text-gray-100 break-all">
                      {apiUrl}
                    </code>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium whitespace-nowrap"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                💡 Tip: Use this to quickly switch between local development and production servers without changing .env files.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Technology Stack</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Frontend:</strong> React 18, Vite, TailwindCSS, Shadcn UI</li>
            <li><strong>Backend:</strong> Spring Boot 3.5, Spring Security, JPA/Hibernate</li>
            <li><strong>Database:</strong> MySQL with Flyway migrations</li>
            <li><strong>Authentication:</strong> JWT + Refresh Token, OAuth2 (Google)</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Features (Planned)</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>User authentication and authorization</li>
            <li>Rich text editor with Markdown support</li>
            <li>Social interactions (likes, comments, bookmarks)</li>
            <li>Follow system and personalized feed</li>
            <li>Real-time notifications</li>
            <li>Content moderation and admin panel</li>
            <li>Search and discovery features</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Development Status</h2>
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-semibold text-green-600 dark:text-green-400">✅ Phase 0 - Project Initialization (Complete)</p>
            <p className="text-sm text-muted-foreground mt-2">
              Backend skeleton with Swagger, health check, and database migration is running.
              Frontend is set up with routing and basic components.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
